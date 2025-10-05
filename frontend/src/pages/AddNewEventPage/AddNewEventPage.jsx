import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddNewEventPage.module.scss';

const defaultEventData = {
    name: '',
    status: 'upcoming',
    summary: '',
    description: '',
    dates: { start: '', end: '' },
    time: '',
    mainLocation: {
        venue: '',
        city: '',
        address: ''
    },
    focusAreas: [],
    capacity: {
        participants: 0,
        volunteers: 0
    },
    tasks: []
};

const defaultTask = {
    title: '',
    description: '',
    location: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    volunteerNeeds: {
        minAge: 16,
        skills: [],
        experience: '',
        additional: ''
    }
};

const focusAreaOptions = [
    'edukacja',
    'środowisko',
    'zdrowie',
    'kultura',
    'sport',
    'technologie',
    'społeczność',
    'sztuka',
    'nauka',
    'bezpieczeństwo',
    'innowacje społeczne',
    'edukacja obywatelska'
];

export default function AddNewEventPage() {
    const [eventData, setEventData] = useState(defaultEventData);
    const [currentFocusArea, setCurrentFocusArea] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const geocodeAddress = async (city, address) => {
        if (!city) {
            throw new Error('Miasto jest wymagane do geokodowania');
        }

        const query = [address, city].filter(Boolean).join(', ');

        if (!query) {
            throw new Error('Przynajmniej miasto musi być podane');
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=pl`
            );

            if (!response.ok) {
                throw new Error('Błąd podczas geokodowania');
            }

            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                return {
                    latitude: parseFloat(lat),
                    longitude: parseFloat(lon)
                };
            } else {
                throw new Error('Nie znaleziono lokalizacji. Sprawdź poprawność adresu.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error('Błąd podczas pobierania współrzędnych: ' + error.message);
        }
    };

    const handleEventChange = (path, value) => {
        const paths = path.split('.');
        setEventData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < paths.length - 1; i++) {
                current = current[paths[i]];
            }
            current[paths[paths.length - 1]] = value;
            return newData;
        });
    };

    const handleTaskChange = (index, field, value) => {
        setEventData(prev => {
            const newTasks = [...(prev.tasks || [])];
            const task = { ...(newTasks[index] || { ...defaultTask }) };
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                task[parent] = { ...(task[parent] || {}), [child]: value };
            } else {
                task[field] = value;
            }
            newTasks[index] = task;
            return { ...prev, tasks: newTasks };
        });
    };

    const addFocusArea = () => {
        if (currentFocusArea && !eventData.focusAreas.includes(currentFocusArea)) {
            setEventData(prev => ({ ...prev, focusAreas: [...prev.focusAreas, currentFocusArea] }));
            setCurrentFocusArea('');
        }
    };

    const removeFocusArea = (area) => {
        setEventData(prev => ({ ...prev, focusAreas: prev.focusAreas.filter(a => a !== area) }));
    };

    const addTask = () => {
        setEventData(prev => ({ ...prev, tasks: [...(prev.tasks || []), { ...defaultTask }] }));
    };

    const removeTask = (index) => {
        setEventData(prev => ({ ...prev, tasks: prev.tasks.filter((_, i) => i !== index) }));
    };

    const handleTaskSkillChange = (taskIndex, skillsString) => {
        const skills = skillsString.split(',').map(skill => skill.trim()).filter(Boolean);
        handleTaskChange(taskIndex, 'volunteerNeeds.skills', skills);
    };

    const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

    const mapTaskToDto = (t) => ({
        id: t.id || undefined,
        title: t.title || '',
        description: t.description || '',
        location: t.location || '',
        dateEnd: t.date || null,
        dateStart: t.date || null,
        timeFrom: t.timeFrom || null,
        timeTo: t.timeTo || null,
        volunteerNeeds: {
            minAge: t.volunteerNeeds?.minAge ?? 16,
            skills: t.volunteerNeeds?.skills || [],
            experience: t.volunteerNeeds?.experience || '',
            additional: t.volunteerNeeds?.additional || ''
        }
    });

    const buildPayload = (data) => {
        const payload = {
            name: data.name,
            status: data.status,
            shortDescription: data.summary,
            longDescription: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            dateFrom: data.dates.start ? new Date(data.dates.start).toISOString() : null,
            dateTo: data.dates.end ? new Date(data.dates.end).toISOString() : null,
            time: data.time || '',
            place: data.mainLocation?.venue || '',
            city: data.mainLocation?.city || '',
            address: data.mainLocation?.address || '',
            mapQuery: `${data.mainLocation?.venue || ''}, ${data.mainLocation?.city || ''}`.trim().replace(/^,|,$/g, ''),
            focusAreas: data.focusAreas.join(',') || [],
            capacity: {
                participants: Number(data.capacity?.participants) || 0,
                volunteers: Number(data.capacity?.volunteers) || 0
            },
            registrations: Number(data.registrations) || 0,
            tasks: (data.tasks || []).map(mapTaskToDto)
        };
        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Pobieranie współrzędnych przed wysłaniem
            const { city, address } = eventData.mainLocation;
            if (city) {
                try {
                    const coordinates = await geocodeAddress(city, address);
                    setEventData(prev => ({
                        ...prev,
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude
                    }));
                } catch (geocodingError) {
                    console.warn('Geocoding failed:', geocodingError);
                    // Kontynuuj bez współrzędnych - nie blokuj tworzenia wydarzenia
                }
            }

            const payload = buildPayload(eventData);
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${apiBase}/event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Server error');
            }

            const id = await res.json();
            navigate(`/organizer/events/${id}`, { replace: true });
        } catch (error) {
            console.error('Error creating event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Dodaj nowe wydarzenie</h1>
                    <p className={styles.subtitle}>Wypełnij formularz, aby dodać nowe wydarzenie do platformy wolontariatu</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Podstawowe informacje</h2>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="name">
                                <p>Nazwa wydarzenia <span className={styles.required}>*</span></p>
                            </label>
                            <input
                                id="name"
                                type="text"
                                className={styles.input}
                                value={eventData.name}
                                onChange={(e) => handleEventChange('name', e.target.value)}
                                required
                                placeholder="Np. Civic Lab 2025"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="summary">
                                <p>Krótki opis <span className={styles.required}>*</span></p>
                            </label>
                            <textarea
                                id="summary"
                                className={styles.textarea}
                                value={eventData.summary}
                                onChange={(e) => handleEventChange('summary', e.target.value)}
                                required
                                rows={3}
                                placeholder="Krótkie podsumowanie wydarzenia (max 2-3 zdania)"
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="description">
                                <p>Szczegółowy opis <span className={styles.required}>*</span></p>
                            </label>
                            <textarea
                                id="description"
                                className={styles.textarea}
                                value={eventData.description}
                                onChange={(e) => handleEventChange('description', e.target.value)}
                                required
                                rows={6}
                                placeholder="Szczegółowy opis wydarzenia, cel, przebieg, etc."
                            />
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Daty i godziny</h2>

                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="dateStart">
                                    <p>Data rozpoczęcia <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="dateStart"
                                    type="date"
                                    className={styles.input}
                                    value={eventData.dates.start}
                                    onChange={(e) => handleEventChange('dates.start', e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="dateEnd">
                                    <p>Data zakończenia <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="dateEnd"
                                    type="date"
                                    className={styles.input}
                                    value={eventData.dates.end}
                                    onChange={(e) => handleEventChange('dates.end', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="time">
                                Godziny wydarzenia
                            </label>
                            <input
                                id="time"
                                type="text"
                                className={styles.input}
                                value={eventData.time}
                                onChange={(e) => handleEventChange('time', e.target.value)}
                                placeholder="Np. 09:30–17:30"
                            />
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Lokalizacja</h2>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="venue">
                                <p>Nazwa miejsca <span className={styles.required}>*</span></p>
                            </label>
                            <input
                                id="venue"
                                type="text"
                                className={styles.input}
                                value={eventData.mainLocation.venue}
                                onChange={(e) => handleEventChange('mainLocation.venue', e.target.value)}
                                required
                                placeholder="Np. Centrum Innowacji Młodych"
                            />
                        </div>

                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="city">
                                    <p>Miasto <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="city"
                                    type="text"
                                    className={styles.input}
                                    value={eventData.mainLocation.city}
                                    onChange={(e) => handleEventChange('mainLocation.city', e.target.value)}
                                    required
                                    placeholder="Np. Warszawa"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="address">
                                    <p>Adres <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="address"
                                    type="text"
                                    className={styles.input}
                                    value={eventData.mainLocation.address}
                                    onChange={(e) => handleEventChange('mainLocation.address', e.target.value)}
                                    required
                                    placeholder="Np. Szkolna 17"
                                />
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Obszary tematyczne</h2>

                        <div className={styles.field}>
                            <label className={styles.label}>Dodaj obszary tematyczne</label>
                            <div className={styles.tagInput}>
                                <select
                                    className={styles.select}
                                    value={currentFocusArea}
                                    onChange={(e) => setCurrentFocusArea(e.target.value)}
                                >
                                    <option value="">Wybierz obszar tematyczny</option>
                                    {focusAreaOptions.map(area => (
                                        <option key={area} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={addFocusArea}
                                    disabled={!currentFocusArea}
                                >
                                    Dodaj
                                </button>
                            </div>

                            <div className={styles.tags}>
                                {eventData.focusAreas.map((area, index) => (
                                    <span key={index} className={styles.tag}>
                                        {area}
                                        <button
                                            type="button"
                                            className={styles.removeTag}
                                            onClick={() => removeFocusArea(area)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Pojemność</h2>

                        <div className={styles.fieldGrid}>
                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="participants">
                                    <p>Liczba uczestników <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="participants"
                                    type="number"
                                    className={styles.input}
                                    value={eventData.capacity.participants}
                                    onChange={(e) => handleEventChange('capacity.participants', parseInt(e.target.value) || 0)}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label} htmlFor="volunteers">
                                    <p>Liczba wolontariuszy <span className={styles.required}>*</span></p>
                                </label>
                                <input
                                    id="volunteers"
                                    type="number"
                                    className={styles.input}
                                    value={eventData.capacity.volunteers}
                                    onChange={(e) => handleEventChange('capacity.volunteers', parseInt(e.target.value) || 0)}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Zadania dla wolontariuszy</h2>
                            <button type="button" className={styles.addTaskButton} onClick={addTask}>+ Dodaj zadanie</button>
                        </div>

                        {(eventData.tasks || []).map((task, index) => (
                            <div key={index} className={styles.taskCard}>
                                <div className={styles.taskHeader}>
                                    <h3 className={styles.taskTitle}>Zadanie {index + 1}</h3>
                                    <button type="button" className={styles.removeTask} onClick={() => removeTask(index)}>Usuń</button>
                                </div>

                                <div className={styles.fieldGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Tytuł zadania <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={task.title}
                                            onChange={(e) => handleTaskChange(index, 'title', e.target.value)}
                                            required
                                            placeholder="Np. Rejestracja uczestników"
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Lokalizacja <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            value={task.location}
                                            onChange={(e) => handleTaskChange(index, 'location', e.target.value)}
                                            required
                                            placeholder="Np. Hol główny"
                                        />
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}><p>Opis zadania <span className={styles.required}>*</span></p></label>
                                    <textarea
                                        className={styles.textarea}
                                        value={task.description}
                                        onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                                        required
                                        rows={3}
                                        placeholder="Szczegółowy opis zadania i obowiązków"
                                    />
                                </div>

                                <div className={styles.fieldGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Data <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="date"
                                            className={styles.input}
                                            value={task.date}
                                            onChange={(e) => handleTaskChange(index, 'date', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Godzina rozpoczęcia <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={task.timeFrom}
                                            onChange={(e) => handleTaskChange(index, 'timeFrom', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Godzina zakończenia <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="time"
                                            className={styles.input}
                                            value={task.timeTo}
                                            onChange={(e) => handleTaskChange(index, 'timeTo', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Wymagane umiejętności</label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder="Np. komunikacja, organizacja, obsługa komputerów"
                                        onChange={(e) => handleTaskSkillChange(index, e.target.value)}
                                    />
                                    <div className={styles.skills}>
                                        {(task.volunteerNeeds?.skills || []).map((skill, skillIndex) => (
                                            <span key={skillIndex} className={styles.skillTag}>{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.fieldGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label}><p>Minimalny wiek <span className={styles.required}>*</span></p></label>
                                        <input
                                            type="number"
                                            className={styles.input}
                                            value={task.volunteerNeeds?.minAge ?? 16}
                                            onChange={(e) => handleTaskChange(index, 'volunteerNeeds.minAge', parseInt(e.target.value) || 16)}
                                            required
                                            min="16"
                                            max="100"
                                        />
                                    </div>
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Wymagane doświadczenie</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={task.volunteerNeeds?.experience || ''}
                                        onChange={(e) => handleTaskChange(index, 'volunteerNeeds.experience', e.target.value)}
                                        rows={2}
                                        placeholder="Np. Doświadczenie w pracy z młodzieżą mile widziane"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label className={styles.label}>Dodatkowe informacje</label>
                                    <textarea
                                        className={styles.textarea}
                                        value={task.volunteerNeeds?.additional || ''}
                                        onChange={(e) => handleTaskChange(index, 'volunteerNeeds.additional', e.target.value)}
                                        rows={2}
                                        placeholder="Np. Potrzebne 4 osoby na poranną zmianę"
                                    />
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelButton} onClick={() => navigate('/events')}>Anuluj</button>
                        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                            {isSubmitting ? 'Zapisywanie...' : 'Utwórz wydarzenie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
