import { useEffect, useState } from 'react';
import { searchByDateRange } from '../../api/event';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.scss';

function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = firstDay.getDay();
    const matrix = [];
    let day = 1 - startDayOfWeek;
    for (let row = 0; row < 6; row++) {
        const week = [];
        for (let col = 0; col < 7; col++) {
            const date = new Date(year, month, day);
            week.push({
                date,
                inMonth: date.getMonth() === month,
                day: date.getDate(),
            });
            day++;
        }
        matrix.push(week);
    }
    return matrix;
}

function getMonthRange(year, month) {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0);
    return {
        from: from.toISOString(),
        to: to.toISOString(),
    };
}

export default function CalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const { from, to } = getMonthRange(year, month);
        setLoading(true);
        setError(null);
        searchByDateRange(from, to)
            .then(setEvents)
            .catch(e => setError(e.message))
            .finally(() => setLoading(false));
    }, [year, month]);

    const matrix = getMonthMatrix(year, month);
    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    function prevMonth() {
        if (month === 0) {
            setYear(y => y - 1);
            setMonth(11);
        } else {
            setMonth(m => m - 1);
        }
    }
    function nextMonth() {
        if (month === 11) {
            setYear(y => y + 1);
            setMonth(0);
        } else {
            setMonth(m => m + 1);
        }
    }

    function normalizeDate(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    }

    function eventsForDay(date) {
        const day = normalizeDate(date).getTime();
        return events.filter(ev => {
            const from = normalizeDate(ev.dateFrom).getTime();
            const to = ev.dateTo ? normalizeDate(ev.dateTo).getTime() : from;
            return day >= from && day <= to;
        });
    }

    function handleEventClick(ev) {
        navigate(`/organizer/events/${ev.id}`);
    }

    return (
        <div className="calendar-root">
            <header className="header-calendar">
                <div>
                    <h1>Kalendarz wydarzeń</h1>
                    <p>Wszystkie kluczowe informacje o zespole organizującym i planowanych inicjatywach.</p>
                </div>
            </header>
            <div className='calendar-container'>
                <div className="calendar-nav">
                    <button onClick={prevMonth} className="calendar-btn">Poprzedni</button>
                    <span className="calendar-month">
                        {monthNames[month]} {year}
                    </span>
                    <button onClick={nextMonth} className="calendar-btn">Następny</button>
                </div>
                {loading && <div className="calendar-loading">Ładowanie...</div>}
                {error && <div className="calendar-error">Błąd: {error}</div>}
                <div className="calendar-grid">
                    <div className="calendar-row calendar-header">
                        {['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'].map(d => (
                            <div key={d} className="calendar-cell calendar-header-cell">{d}</div>
                        ))}
                    </div>
                    {matrix.map((week, i) => (
                        <div key={i} className="calendar-row">
                            {week.map((cell, j) => (
                                <div key={j} className={`calendar-cell${cell.inMonth ? '' : ' calendar-cell-out'}`}>
                                    <div className="calendar-day">{cell.day}</div>
                                    <div className="calendar-events">
                                        {eventsForDay(cell.date).map(ev => (
                                            <div
                                                key={ev.id}
                                                className="calendar-event"
                                                onClick={() => handleEventClick(ev)}
                                                tabIndex={0}
                                                role="button"
                                                title={ev.name}
                                            >
                                                <span className="calendar-event-name">{ev.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
