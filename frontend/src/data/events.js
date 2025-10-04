export const organizerProfile = {
  name: 'Marta Zawadzka',
  role: 'Koordynatorka programu',
  phone: '+48 501 222 198',
  email: 'marta.zawadzka@mlodzi-dzialaja.pl',
  languages: ['polski', 'angielski'],
  focusAreas: ['partycypacja młodzieży', 'partnerstwa lokalne'],
}

export const organizationProfile = {
  name: 'Fundacja Młodzi Działają',
  founded: 2012,
  location: {
    city: 'Warszawa',
    venue: 'Centrum Aktywności Społecznej',
    address: 'ul. Solidarności 27',
  },
  mission:
    'Wspieramy młodych liderów w rozwijaniu projektów społecznych, łącząc edukację obywatelską z działaniem w terenie.',
  programs: ['inkubator projektów', 'mikrogranty sąsiedzkie', 'akademia wolontariatu'],
  website: 'https://mlodzi-dzialaja.pl',
}

export const events = [
  {
    id: 'civic-lab-2025',
    name: 'Civic Lab 2025',
    status: 'upcoming',
    summary:
      'Trzydniowe laboratorium projektowe, w trakcie którego młodzież tworzy rozwiązania dla wyzwań lokalnych.',
    description:
      'Civic Lab 2025 to intensywny proces projektowy, w którym zespoły młodzieżowe pracują z mentorami nad realnymi wyzwaniami miast. Uczestnicy przejdą przez etap diagnozy problemu, prototypowania rozwiązań oraz przygotowania prezentacji przed jury złożonym z przedstawicieli samorządów i organizacji społecznych.',
    dates: { start: '2025-04-10', end: '2025-04-12' },
    time: '09:30–17:30',
    mainLocation: {
      venue: 'Centrum Innowacji Młodych',
      city: 'Warszawa',
      address: 'ul. Przemian 4',
    },
    mapQuery: 'Centrum Innowacji Młodych, Warszawa',
    focusAreas: ['innowacje społeczne', 'edukacja obywatelska'],
    capacity: { participants: 80, volunteers: 28 },
    registrations: 63,
    tasks: [
      {
        id: 'civic-registration',
        title: 'Rejestracja uczestników',
        description: 'Przyjmowanie młodzieży i wydawanie pakietów startowych.',
        location: 'Hol główny',
        date: '2025-04-10',
        timeFrom: '08:00',
        timeTo: '10:30',
        volunteerNeeds: {
          minAge: 18,
          skills: ['komunikacja interpersonalna', 'obsługa systemów rejestracyjnych'],
          experience: 'Doświadczenie w pracy z młodzieżą mile widziane.',
          additional: 'Potrzebne 4 osoby na poranną zmianę.',
        },
      },
      {
        id: 'civic-labsupport',
        title: 'Wsparcie zespołów projektowych',
        description: 'Moderowanie pracy warsztatowej i raportowanie postępów.',
        location: 'Sala warsztatowa B',
        date: '2025-04-10',
        timeFrom: '10:00',
        timeTo: '17:30',
        volunteerNeeds: {
          minAge: 19,
          skills: ['facylitacja spotkań', 'notowanie wizualne'],
          experience: 'Minimum jeden zrealizowany projekt społeczny.',
          additional: '6 osób rotacyjnie w dwugodzinnych blokach.',
        },
      },
      {
        id: 'civic-media',
        title: 'Zespół medialny',
        description: 'Dokumentowanie wydarzenia, krótkie wywiady i relacje live.',
        location: 'Strefa networkingowa',
        date: '2025-04-11',
        timeFrom: '09:00',
        timeTo: '17:00',
        volunteerNeeds: {
          minAge: 17,
          skills: ['fotografia', 'montaż krótkich materiałów wideo'],
          experience: 'Portfolio lub link do wcześniejszych realizacji.',
          additional: '5 osób, możliwość pracy w parach.',
        },
      },
    ],
  },
  {
    id: 'youth-forum-2024',
    name: 'Youth Forum 2024',
    status: 'completed',
    summary:
      'Ogólnopolskie forum młodych liderów z debatami, konsultacjami eksperckimi i targami organizacji.',
    description:
      'Youth Forum 2024 zebrało liderów młodzieżowych z całej Polski. W programie znalazły się debaty o przyszłości polityki młodzieżowej, sesje mentoringowe z ekspertami oraz targi organizacji wspierających młodych działaczy. Podsumowaniem wydarzenia była deklaracja współpracy podpisana przez 12 miast.',
    dates: { start: '2024-09-19', end: '2024-09-21' },
    time: '10:00–18:00',
    mainLocation: {
      venue: 'Hala Expo Łódź',
      city: 'Łódź',
      address: 'al. Politechniki 4',
    },
    mapQuery: 'Hala Expo Łódź',
    focusAreas: ['polityka młodzieżowa', 'demokracja lokalna'],
    capacity: { participants: 450, volunteers: 75 },
    registrations: 418,
    tasks: [
      {
        id: 'youth-stage',
        title: 'Zarządzanie sceną główną',
        description: 'Koordynowanie wejść prelegentów i obsługa zaplecza technicznego.',
        location: 'Scena główna',
        date: '2024-09-19',
        timeFrom: '09:00',
        timeTo: '19:00',
        volunteerNeeds: {
          minAge: 20,
          skills: ['koordynacja zespołu', 'obsługa techniczna eventów'],
          experience: 'Minimum jeden duży event w portfolio.',
          additional: '8 osób pracujących w parach.',
        },
      },
      {
        id: 'youth-care',
        title: 'Strefa dobrostanu',
        description: 'Opieka nad strefą odpoczynku, prowadzenie krótkich aktywizacji.',
        location: 'Strefa relaksu',
        date: '2024-09-20',
        timeFrom: '10:00',
        timeTo: '18:00',
        volunteerNeeds: {
          minAge: 18,
          skills: ['animacja czasu wolnego', 'pierwsza pomoc'],
          experience: 'Certyfikat pierwszej pomocy lub szkolenie HSR.',
          additional: '6 osób na dwie zmiany.',
        },
      },
    ],
  },
  {
    id: 'green-weekend-2025',
    name: 'Green Weekend',
    status: 'upcoming',
    summary:
      'Weekendowy cykl warsztatów ekologicznych i akcji sprzątania terenów zielonych.',
    description:
      'Green Weekend to rodzinny festiwal ekologiczny w przestrzeni parkowej. Zaplanowano warsztaty zero waste, wspólne sadzenie roślin, panele dyskusyjne z ekspertami oraz akcję sprzątania plaży. Celem wydarzenia jest zachęcenie mieszkańców do codziennych, proekologicznych nawyków.',
    dates: { start: '2025-06-06', end: '2025-06-08' },
    time: '08:30–16:30',
    mainLocation: {
      venue: 'Park Nadmorski',
      city: 'Gdańsk',
      address: 'ul. Brzegowa 5',
    },
    mapQuery: 'Park Nadmorski, Gdańsk',
    focusAreas: ['ekologia', 'wolontariat rodzinny'],
    capacity: { participants: 220, volunteers: 52 },
    registrations: 188,
    tasks: [
      {
        id: 'green-logistics',
        title: 'Logistyka sprzętu',
        description: 'Rozstawienie punktów warsztatowych i zabezpieczenie materiałów.',
        location: 'Magazyn przy parku',
        date: '2025-06-06',
        timeFrom: '07:00',
        timeTo: '10:00',
        volunteerNeeds: {
          minAge: 18,
          skills: ['organizacja pracy', 'podstawy BHP'],
          experience: 'Doświadczenie w pracy fizycznej w plenerze.',
          additional: 'Potrzeba 10 osób, wymagane rękawice robocze.',
        },
      },
      {
        id: 'green-education',
        title: 'Edukatorzy terenowi',
        description: 'Prowadzenie stanowisk edukacyjnych i krótkich gier ekologicznych.',
        location: 'Strefa warsztatowa',
        date: '2025-06-07',
        timeFrom: '09:00',
        timeTo: '16:30',
        volunteerNeeds: {
          minAge: 17,
          skills: ['praca z dziećmi', 'wiedza ekologiczna'],
          experience: 'Minimum jeden wolontariat w podobnej tematyce.',
          additional: '12 osób, krótkie szkolenie dzień wcześniej.',
        },
      },
      {
        id: 'green-cleanup',
        title: 'Koordynacja sprzątania',
        description: 'Przydzielanie ekipom sektorów i raportowanie postępów.',
        location: 'Punkt zbiórki przy wejściu głównym',
        date: '2025-06-08',
        timeFrom: '08:30',
        timeTo: '15:30',
        volunteerNeeds: {
          minAge: 18,
          skills: ['zarządzanie zespołem', 'logistyka wydarzeń'],
          experience: 'Preferowane doświadczenie w akcjach społecznych.',
          additional: '8 osób, wymagane prawo jazdy kat. B dla dwóch osób.',
        },
      },
    ],
  },
]

export const findEventById = (eventId) => events.find((event) => event.id === eventId) ?? null

export const formatDateRange = ({ start, end }) => {
  if (start === end) {
    return start
  }
  return `${start} – ${end}`
}
