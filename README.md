# HackYeah 2025 – Młodzi Działają

## Jak tu trafiliśmy
Witamy na HackYeah 2025! Jesteśmy tu, aby w zwinny sposób odpowiedzieć na realne potrzeby młodych ludzi, organizacji i szkół. Atmosfera hackathonu pozwala nam iterować pomysły w krótkich sprintach, uczyć się od siebie nawzajem i szybko reagować na feedback społeczności. Dzięki temu krok po kroku rozwijamy rozwiązanie, które wzmacnia wolontariat w Krakowie.

## Zespół „Gorące bobry w Twojej okolicy”
- Mariusz
- Łukasz
- Mateusz
- Kamil
- Grzesiek (Grzechu)

## Dokumentacja aplikacji

### Opis
Młodzi Działają to nowoczesna platforma cyfrowa, która łączy młodych wolontariuszy z organizacjami, szkołami, uczelniami i instytucjami działającymi w Krakowie. Serwis upraszcza udział w wolontariacie, usprawnia komunikację między interesariuszami i promuje aktywność społeczną młodych mieszkańców miasta.

To miejsce, w którym:
- wolontariusze znajdują inspirujące inicjatywy i zdobywają doświadczenie,
- organizacje i instytucje zyskują dostęp do zaangażowanych osób oraz narzędzie do zarządzania projektami,
- koordynatorzy szkolni mogą bezpiecznie i sprawnie prowadzić wolontariat uczniowski.

### Big Picture
#### Jakie problemy rozwiązuje aplikacja?
- Inicjatywy społeczne docierają do młodych ludzi w atrakcyjny, szybki i uporządkowany sposób.
- Organizacje i instytucje zyskują wsparcie w rekrutacji wolontariuszy oraz komunikacji z nimi.
- Szkoły i uczelnie otrzymują narzędzie do formalnego zarządzania wolontariatem młodzieży, w tym osób niepełnoletnich.
- Powstaje jedno, spójne miejsce online, które łączy młodzież, organizacje i szkoły.

#### Hasła przewodnie
- Dla wszystkich, bez barier – otwartość dla młodzieży szkolnej, studentów i pełnoletnich mieszkańców Krakowa.
- Bez wykluczania, bez faworyzowania – równe szanse dla każdego wolontariusza, niezależnie od wieku, umiejętności i miejsca zamieszkania.
- Prosto i nowocześnie – zgłoszenie na wydarzenie wymaga zaledwie kilku kliknięć.
- Bezpiecznie i odpowiedzialnie – zgodność z RODO, ochrona danych niepełnoletnich oraz jasne zasady zgód i uprawnień.
- Budujemy razem – wolontariat to wspólnota i wzajemna pomoc zamiast rywalizacji.
- Transparentnie – wszystkie strony mają wgląd w przebieg działań i mogą dokumentować efekty.
- Inspirująco – wolontariusze widzą realny wpływ swojej pracy dzięki certyfikatom, mapom inicjatyw i raportom efektów.

### Najważniejsze funkcje
- Mapa działań, która prezentuje wszystkie inicjatywy w jednym miejscu.
- Asystent dopasowania rekomendujący wydarzenia zgodne z profilem wolontariusza.
- Certyfikaty i portfolio budujące historię aktywności oraz generujące zaświadczenia.
- Bezpośrednia komunikacja: chat wolontariusz–organizacja (dla pełnoletnich) lub koordynator–organizacja (dla osób U18).
- Cele wspólne prezentowane w formie liczników pokazujących zbiorczy wpływ działań społecznych.

### Paleta kolorów aplikacji „Młodzi Działają”
Paleta została zbudowana w oparciu o logotyp „Młody Kraków” i obowiązuje we wszystkich elementach interfejsu.

#### Kolory bazowe
- **Primary – niebieski:** `#0071BC`
- **Secondary – różowy/czerwony:** `#E03C67`
- **Accent – zielony:** `#4CAF50`

#### Kolory wspierające
- **Orange/Yellow highlight:** `#F4B400`
- **Light Blue Gradient:** `#29ABE2`

#### Skala neutralna i typografia
- **Dark Gray (nagłówki):** `#333333`
- **Medium Gray (teksty pomocnicze):** `#666666`
- **Light Gray (tła, obramowania):** `#F5F5F5`
- **White:** `#FFFFFF`

#### Gradienty inspirowane logo
- **Hero Gradient (tła główne, CTA):** `linear-gradient(90deg, #0071BC 0%, #E03C67 100%)`
- **Highlight Gradient (banery, karty):** `linear-gradient(45deg, #29ABE2 0%, #4CAF50 100%)`

#### Zasady stosowania w interfejsie
- Primary: nagłówki, główne przyciski i aktywne elementy nawigacji.
- Secondary: kluczowe akcje (CTA), wyróżnienia ikon i stany podkreślające zaangażowanie.
- Accent: statusy sukcesu, znaczniki kategorii „eko/społeczne”, obramowania map i kart.
- Orange/Yellow highlight: odznaki, nowości i wyróżnienia ważnych wydarzeń.
- Skala szarości: powierzchnie tła, karty, formularze oraz teksty pomocnicze.

### Grupy docelowe
- Wolontariusze (U18 i 18+), którzy chcą zdobywać doświadczenie i angażować się społecznie.
- Organizacje i instytucje, w tym NGO, jednostki miejskie, szkoły, uczelnie oraz instytucje kultury i sportu.
- Koordynatorzy szkolni – nauczyciele i pedagodzy wspierający uczniów w aktywnościach społecznych.
- Miasto Kraków, które dzięki aplikacji zyskuje dane o zaangażowaniu młodzieży i może lepiej wspierać lokalne inicjatywy.

### Typy użytkowników i ich potrzeby

#### 1) Organizator
- **Kim jest:** NGO/instytucja/uczelnia/szkoła prowadząca wydarzenia.
- **Cel:** pozyskać wolontariuszy i bezpiecznie zrealizować zadania.

**Najważniejsze zadania:**
- tworzy wydarzenia (termin, miejsce, opis, kontakt),
- definiuje zadania w wydarzeniu (opis, sloty, start–koniec),
- określa wymagania dla każdego zadania: `requiresAdult` (tak/nie), `minAge`, `skills[]`, `certificates[]`,
- publikuje oferty, przyjmuje/odrzuca aplikacje (pojedyncze i grupowe),
- przypisuje wolontariuszy do zadań i aktualizuje listę obecności,
- potwierdza godziny i wystawia zaświadczenia (PDF),
- prowadzi komunikację: z wolontariuszem 18+ bezpośrednio, z U18 przez koordynatora.

**Co widzi:**
- swoje wydarzenia, zadania, wymagania,
- wszystkie aplikacje na swoje wydarzenia (anonimizowane U18 do momentu akceptacji),
- dane kontaktowe 18+; dla U18 — kontakt do koordynatora.

**Czego nie robi:**
- nie przetwarza danych U18 poza zakresem wydarzenia,
- nie ma dostępu do prywatnych danych po zakończeniu wydarzenia (retencja ograniczona).

#### 2) Wolontariusz 18+
- **Kim jest:** pełnoletni użytkownik (student, mieszkaniec).
- **Cel:** znaleźć inicjatywy, rozwijać kompetencje, gromadzić portfolio.

**Najważniejsze zadania:**
- zakłada profil (zainteresowania, zgody RODO),
- wyszukuje oferty i aplikuje bezpośrednio,
- rozmawia z organizatorem (chat),
- uczestniczy, raportuje godziny (jeśli wymagane), odbiera zaświadczenia,
- buduje historię aktywności (portfolio/certyfikaty).

**Co widzi:**
- wszystkie oferty (zgodne z wymaganiami),
- stan swoich aplikacji, przypisania i certyfikaty.

**Czego nie robi:**
- nie zgłasza innych osób,
- nie zarządza uczniami.

#### 3) Wolontariusz U18
- **Kim jest:** uczeń/niepełnoletni.
- **Cel:** bezpieczny udział w wolontariacie pod opieką szkoły.

**Najważniejsze zadania:**
- ma konto powiązane ze szkołą/koordynatorem (zgoda rodzica/szkoły),
- widzi tylko oferty dopuszczone dla U18 (wg wymagań),
- zgłasza chęć udziału, a wniosek trafia do koordynatora,
- odbiera przypisania i zaświadczenia (po akceptacji organizatora i koordynatora).

**Komunikacja:**
- z organizatorem wyłącznie przez koordynatora (domyślnie),
- dane osobowe ujawniane organizatorowi dopiero po akceptacji aplikacji.

**Czego nie robi:**
- nie kontaktuje się bezpośrednio z organizatorem przed akceptacją,
- nie zgłasza innych uczniów.

#### 4) Koordynator (szkolny)
- **Kim jest:** nauczyciel/opiekun wolontariatu.
- **Cel:** opieka formalna nad U18, zgodność z zasadami, raporty dla szkoły.

**Najważniejsze zadania:**
- zarządza uczniami (listy, klasy, zgody),
- składa aplikacje w imieniu uczniów lub grup na wybrane zadania,
- pośredniczy w komunikacji z organizatorem,
- zatwierdza godziny i generuje raporty (per uczeń/klasa/semestr),
- dba o zgody rodziców/szkoły, nadzór nad danymi U18.

**Co widzi:**
- oferty dla U18,
- statusy aplikacji uczniów, przypisania, certyfikaty, raporty.

**Czego nie robi:**
- nie publikuje wydarzeń (chyba że działa też jako Organizator w innej roli).

#### 5) Admin (system/miasto)
- **Kim jest:** operator systemu.
- **Cel:** bezpieczeństwo, jakość danych, spójność działań.

**Najważniejsze zadania:**
- weryfikuje organizacje, zarządza kategoriami/tagami,
- konfiguruje polityki prywatności, retencję danych, audyt,
- ma dostęp do zagregowanych statystyk (bez danych osobowych U18),
- interweniuje przy nadużyciach (moderacja).

## Adres strony
- https://mlodzidzialja.pl
