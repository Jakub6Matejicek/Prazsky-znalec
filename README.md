# Pražský znalec

Autor: Jakub Matějíček

Škola: Střední průmyslová škola elektrotechnická, Praha 2, Ječná 30

Studijní obor: Informační technologie

## Anotace

Studentský Projekt "Pražský znalec" je webová hra inspirovaná populárním GeoGuessrem, avšak zaměřená na česká krajská města. Hráč hádá, kde se na mapě nachází, přičemž k dispozici má panoramatický výhled. Projekt sestává z frontendové části v Reactu a backendu ve Flasku (Python). Součástí hry je uživatelská registrace, přihlášení a možnost hrát oficiální mód se zapisováním výsledků do veřejného žebříčku (leaderboard).

## Úvod

Cílem projektu "Pražský znalec" je nabídnout uživatelům zábavný způsob, jak si ověřit či rozšířit geografické znalosti, a to formou hry, která je zaměřená na česká města. Inspiraci přináší hra GeoGuessr, která pracuje s reálnými lokacemi a panoramaty. V mém případě využívám otevřená data (API od Mapy.cz) a vybranou část ČR.

Hra má dva základní módy:

* Volný mód, kde je výběr města, počet kol i délka kola plně v rukou hráče.
* Oficiální mód, který je určen výhradně registrovaným uživatelům a je fixně nastaven (5 kol, 45 sekund, lokalita Praha).

Projekt je rozdělen do dvou částí:

* Frontend: Postaven na Reactu (s bundlerem Vite), stará se o uživatelské rozhraní, přechody mezi herními obrazovkami a volání API. Zahrnuje celou herní logiku 
* Backend: Postaven na Flasku (Python). Zajišťuje autentizaci, komunikaci s databází (SQLite) a logiku pro ukládání výsledků i zpracování leaderboardu. 

Rozsah projektu zahrnuje:

* Implementaci správy uživatelů (registrace, login, logout, zapomenuté heslo).
* Herní logiku (počítání vzdálenosti a bodů).
* Vytvoření leaderboardu (nejlepší skóre, průměrné skóre).
* Zajištění session cookie pro oficiální mód.


### Použité technologie

* Frontend:
    * React (TypeScript), bundler Vite
    * Leaflet (mapová knihovna) + panorama API od Mapy.cz
    * TailwindCSS pro základní stylování
* Backend:
    * Flask (Python)
    * Flask-CORS pro podporu cross-origin requestů (session cookie)
    * Flask-Bcrypt pro hashování hesel
    * SQLite jako databáze

### Struktura projektu

* `frontend/`
    * `src/components` (React komponenty jako `StartMenu`, `SingleRound`, `GuessMap`, `LeaderboardPage`, atd.)
    * `src/context` (`GameContext`, `AuthContext` – správa stavu hry a uživatele) 
    * `src/pages` (`Login`, `Register`, `ResultPage`, `FinalResults…`) 
* `backend/`
    * `app.py` (hlavní Flask aplikace, definice endpointů) 
    * `models.py` (SQLAlchemy modely: `User`, `GameResult`)
    * `requirements.txt` (závislosti pro Python)


## Nasazení a spuštění

1.  Naklonujte repozitář.
2.  Přepnutí do složky `python-backend` 
3.  Vytvoření virtuálního prostředí
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
4. nainstalování python knihoven

    ```
    pip install -r requirements.txt
    ```
5.  spuštění aplikace

    ```
    python app.py
    ```

Přístup k aplikaci:

* Frontend: http://localhost:5173
* Backend API: http://localhost:5000

Co je potřeba:

* Python >= 3.9
* Node.js >= 16
* Volitelně virtuální prostředí (venv) pro Python
* Webový prohlížeč (Chrome, Firefox, Edge)

## Licence

Projekt je uvolněn pod licencí MIT License (je možné upravovat, distribuovat, uvádět do provozu bez větších omezení, avšak bez záruky). Licenční soubor je součástí repozitáře (LICENSE). 

## Odkaz na GIT

[https://github.com/Jakub6Matejicek/Prazsky-znalec](https://github.com/Jakub6Matejicek/Prazsky-znalec)

## Závěr

Projekt "Pražský znalec" názorně ukazuje propojení frontendové a backendové aplikace pro interaktivní geolokační hru. Během vývoje jsme se zaměřili na:

* Jednoduchost uživatelského rozhraní (StartMenu, Game, Leaderboard).
* Bezpečnost (hashovaná hesla, session cookie, CORS).
* Flexibilitu (možnost volného módu i oficiálního soutěžení). 

V budoucnu lze projekt rozšířit o další kraje a implementovat funkci pro pokročilé statistiky. Projekt lze použít jako základ pro podobné mapové hry či aplikace s geolokačními funkcemi. Snahou bylo nabídnout snadno pochopitelné a funkční řešení, které může kdokoliv dále rozvíjet nebo přizpůsobit vlastním potřebám. 