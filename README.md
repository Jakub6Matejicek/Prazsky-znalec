# Pražský znalec

Autor: Jakub Matějíček
Studijní obor: Informační technologie

## Anotace

Projekt "Pražský znalec" je webová hra inspirovaná populárním GeoGuessr, avšak zaměřená na česká krajská města. [cite: 1, 2] Hráč hádá, kde se na mapě nachází, přičemž k dispozici má panoramatický výhled. [cite: 2] Projekt sestává z frontendové části v Reactu a backendu ve Flasku. [cite: 3] Součástí hry je uživatelská registrace, přihlášení a možnost hrát oficiální mód se zapisováním výsledků do veřejného žebříčku (leaderboard). [cite: 4]

## Úvod

Cílem projektu "Pražský znalec" je nabídnout uživatelům zábavný způsob, jak si ověřit či rozšířit geografické znalosti, a to formou hry, která je zaměřená na česká města. [cite: 5] Inspiraci přináší hra GeoGuessr, která pracuje s reálnými lokacemi a panoramaty. [cite: 6] V našem případě využíváme otevřená data (API od Mapy.cz) a vybranou část ČR. [cite: 7]

Hra má dva základní módy:

* Volný mód, kde je výběr města, počet kol i délka kola plně v rukou hráče. [cite: 8]
* Oficiální mód, který je určen výhradně registrovaným uživatelům a je fixně nastaven (5 kol, 45 sekund, lokalita Praha). [cite: 9]

Projekt je rozdělen do dvou částí:

* Frontend: Postaven na Reactu (s bundlerem Vite), stará se o uživatelské rozhraní, přechody mezi herními obrazovkami a volání API. [cite: 10]
* Backend: Postaven na Flasku (Python). [cite: 11] Zajišťuje autentizaci, komunikaci s databází (SQLite) a logiku pro ukládání výsledků i zpracování leaderboardu. [cite: 11]

Rozsah projektu zahrnuje:

* Implementaci správy uživatelů (registrace, login, logout, zapomenuté heslo). [cite: 12]
* Herní logiku (počítání vzdálenosti a bodů). [cite: 12]
* Vytvoření leaderboardu (nejlepší skóre, průměrné skóre). [cite: 13]
* Zajištění session cookie pro oficiální mód. [cite: 13]

## Ekonomická rozvaha

### Konkurence

Konkurenčními produkty jsou zejména hry typu GeoGuessr či CityGuessr. [cite: 14] Většina z nich je však buď globálně zaměřená (celý svět), nebo nemá detailní pokrytí českých měst. [cite: 15] Pražský znalec se soustředí jen na ČR, čímž nabízí domácím uživatelům podrobnější a přesnější zobrazení. [cite: 16]

### Výhody našeho projektu

* Jazyková lokalizace: Celá hra (včetně nápověd, tipů) je v češtině. [cite: 17]
* Specializace na česká města: Můžeme do budoucna přidávat další krajská města či zajímavé lokality. [cite: 18]
* Zdarma: Projekt je koncipován jako bezplatný. [cite: 19]

### Způsob propagace

* Sociální sítě: Facebookové skupiny, které se zabývají cestováním po ČR či hrami. [cite: 19, 20]
* Spolupráce s turistickými portály: Možnost odkazů či sdílení na turistických webech. [cite: 20]

### Návratnost investic

Aplikace "Pražský znalec" je v současné době zcela bez zpoplatnění. [cite: 21] Do budoucna by ale byla možná komerční spolupráce s obcemi či městy, například:

* Poskytnutí hry ve formě „iframe“ integrovaného do oficiálních webových stránek jednotlivých obcí (turistické portály, regionální prezentace). [cite: 22, 23]
* Speciální soutěžní verze pro konkrétní region, kde by hra mohla vyhodnocovat výsledky návštěvníků, pořádat turnaje či nabízet statistiky pro marketingové účely. [cite: 23, 24]

Takový model by přinesl finanční přínos formou licenčních poplatků za využití hry, případně za rozšířené funkce (např. personalizované mapové podklady, vyhodnocení kampaní). [cite: 24, 25] Ačkoli je projekt nyní v nekomerční pilotní fázi, uvedený způsob by mohl v budoucnu zajistit návratnost investic a zároveň obohatit oficiální prezentaci obcí o interaktivní prvek. [cite: 25]

## Vývoj

### Použité technologie

* Frontend:
    * React (TypeScript), bundler Vite [cite: 26]
    * Leaflet (mapová knihovna) + panorama API od Mapy.cz [cite: 26]
    * TailwindCSS pro základní stylování [cite: 26]
* Backend:
    * Flask (Python) [cite: 26]
    * Flask-CORS pro podporu cross-origin requestů (session cookie) [cite: 26]
    * Flask-Bcrypt pro hashování hesel [cite: 26]
    * SQLite jako databáze [cite: 26]

### Struktura projektu

* `frontend/`
    * `src/components` (React komponenty jako `StartMenu`, `SingleRound`, `GuessMap`, `LeaderboardPage`, atd.) [cite: 26]
    * `src/context` (`GameContext`, `AuthContext` – správa stavu hry a uživatele) [cite: 26]
    * `src/pages` (`Login`, `Register`, `ResultPage`, `FinalResults…`) [cite: 26]
* `backend/`
    * `app.py` (hlavní Flask aplikace, definice endpointů) [cite: 26]
    * `models.py` (SQLAlchemy modely: `User`, `GameResult`) [cite: 26]
    * `requirements.txt` (závislosti pro Python) [cite: 26]

### Dokumentace v kódu

Kód je doplněn o komentáře a docstringy, zvláště v klíčových částech (herní logika, API endpointy). [cite: 26, 27] Struktura je rozdělena dle MVC principu (modely – views – controllers), ačkoliv je v menším měřítku (Flask). [cite: 27]

### Testování

Během vývoje proběhlo manuální a částečně automatizované testování. [cite: 28]

1.  Scénář – Přihlášení uživatele

    * Postup: Uživatel navštíví `/login`, zadá správné údaje, dojde k volání `/api/login`. [cite: 29, 30]
    * Výsledek: Vrácena hlavička `Set-Cookie` s session, `/api/me` následně vrací `logged_in: true`. [cite: 30, 31]
2.  Scénář – Registrace chybějícího uživatele

    * Postup: Přechod na `/register`, vyplnění formuláře s unikátním username, email, heslo. [cite: 31, 32]
    * Výsledek: Do DB se vloží nový řádek, v logu se zobrazí `Registration successful`. [cite: 32, 33]
3.  Scénář – Volný mód

    * Postup: Na úvodní stránce se vybere město „Brno“, nastaví se 3 kola, 60 sekund a klikne na "Volný mód". [cite: 33, 34]
    * Výsledek: Zobrazí se panorama Brna, uživatel tipne polohu, potvrdí, a hra vypočítá body. [cite: 34, 35] Po konci všech kol se zobrazí finální skóre (bez zápisu do leaderboardu). [cite: 35, 36]
4.  Scénář – Oficiální mód

    * Postup: Uživatel se přihlásí, pak v `StartMenu` klikne na "Oficiální mód". [cite: 36, 37] Proběhne 5 kol, 45s, v Praze. [cite: 37, 38] Po dokončení se volá `/api/submit_official_game`. [cite: 37, 38]
    * Výsledek: Skóre se zapíše do DB (tabulka `game_results`), v `/api/leaderboard/highest_score` je výsledek vidět. [cite: 38, 39]
5.  Scénář – Nasazení aplikace

    * Postup: Na lokálním stroji s Python 3.9 a Node.js 16 proběhne `pip install -r requirements.txt` + `npm install`. [cite: 39, 40] Následně `python app.py` (port 5000), `npm run dev` (port 5173). [cite: 40, 41]
    * Výsledek: Frontend funguje na `http://localhost:5173`, komunikuje s backendem na `http://localhost:5000`, lze spustit volný i oficiální mód, registrace i login. [cite: 41, 42]

## Nasazení a spuštění

1.  Naklonujte repozitář ze zdroje (viz níže) pro obě části (frontend / backend). [cite: 42, 43]
2.  Backend:
    * Přepnutí do složky `backend` [cite: 43, 44]
    * vytvoření virtuálního prostředí
        * MacOS/Linux

        ```
        python3 -m venv venv
        source venv/bin/activate
        ```
        * Windows

        ```
        python -m venv venv
        venv\Scripts\activate.bat
        ```
    * nainstalování python knihoven

    ```
    pip install -r requirements.txt
    ```
    * spuštění aplikace

    ```
    python app.py
    ```
3.  Frontend:
    * přepnutí do složky `frontend` [cite: 51, 52]
    * nainstalování npm

    ```
    npm install
    ```
    * zapnutí aplikace

    ```
    npm run dev
    ```

    * (nebo `npm run build` a poté `npm run preview` pro produkční build) [cite: 55]

Přístup k aplikaci:

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

Co je potřeba:

* Python >= 3.9
* Node.js >= 16
* Volitelně virtuální prostředí (venv) pro Python
* Webový prohlížeč (Chrome, Firefox, Edge)

## Licence

Projekt je uvolněn pod licencí MIT License (je možné upravovat, distribuovat, uvádět do provozu bez větších omezení, avšak bez záruky). [cite: 55, 56] Licenční soubor je součástí repozitáře (LICENSE). [cite: 56, 57]

## Odkaz na GIT

[https://github.com/Jakub6Matejicek/Prazsky-znalec](https://github.com/Jakub6Matejicek/Prazsky-znalec)

## Závěr

Projekt "Pražský znalec" názorně ukazuje propojení frontendové a backendové aplikace pro interaktivní geolokační hru. [cite: 56, 57] Během vývoje jsme se zaměřili na:

* Jednoduchost uživatelského rozhraní (StartMenu, Game, Leaderboard). [cite: 57, 58]
* Bezpečnost (hashovaná hesla, session cookie, CORS). [cite: 57, 58]
* Flexibilitu (možnost volného módu i oficiálního soutěžení). [cite: 58, 59]

V budoucnu lze rozšířit o další kraje a implementovat funkci pro pokročilé statistiky. [cite: 58, 59] Projekt lze použít jako základ pro podobné mapové hry či aplikace s geolokačními funkcemi. [cite: 59, 60] Snahou bylo nabídnout snadno pochopitelné a funkční řešení, které může kdokoliv dále rozvíjet nebo přizpůsobit vlastním potřebám. [cite: 60]