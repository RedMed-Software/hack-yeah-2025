# Frontend

Interfejs został przygotowany w oparciu o Vite i React. Aplikacja integruje się z platformą [Ory](https://www.ory.sh/) i obsługuje logowanie, rejestrację oraz ochronę tras w oparciu o sesję użytkownika.

## Wymagania

- Node.js 18+
- Skonfigurowany projekt w Ory Network (lub własna instancja Ory Kratos)
- Działający tunel `ory tunnel` podczas pracy lokalnej

## Konfiguracja środowiska

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Ustaw zmienne środowiskowe z adresami usług backendowych:
   ```bash
   export VITE_API_BASE_URL="http://localhost:7258/api"
   export VITE_ORY_SDK_URL="http://localhost:4000"
   ```
   Pierwsza zmienna wskazuje adres backendu aplikacji, druga adres SDK Ory (domyślnie `http://localhost:4000`, który udostępnia tunel Ory).
3. Uruchom tunel wskazując adres aplikacji (domyślnie `http://localhost:5173`):
   ```bash
   ory tunnel --project <ID_PROJEKTU> http://localhost:5173
   ```

## Start aplikacji

```bash
npm run dev
```

Aplikacja domyślnie nasłuchuje na porcie `5173`.

## Dostępne funkcje

- Rejestracja i logowanie przy użyciu natywnych flow Ory.
- Automatyczne odświeżanie sesji oraz przycisk wylogowania.
- Ochrona tras paneli (dashboard, organizer, volunteer) przed dostępem bez zalogowania.
- Wyświetlanie podstawowych danych profilu użytkownika po zalogowaniu.

## Struktura kodu

- `src/providers/AuthProvider.jsx` – konfiguracja Ory SDK i kontekst sesji.
- `src/components/OryFlowForm.jsx` – uniwersalny renderer formularzy Ory (logowanie/rejestracja).
- `src/routes/ProtectedRoute.jsx` – ochrona tras z wykorzystaniem sesji.
- `src/pages` – widoki stron, m.in. integracja flow logowania i rejestracji.

## Przydatne komendy

- `npm run lint` – uruchamia ESLint.
- `npm run build` – buduje wersję produkcyjną.
- `npm run preview` – uruchamia podgląd zbudowanej aplikacji.
