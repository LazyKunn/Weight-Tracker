# Weight Tracker

<img width="1920" height="1080" alt="Weight Tracker" src="https://github.com/user-attachments/assets/6ae1905f-f82d-4c81-8791-7e7943a13f52" />

A simple, private weight tracking app that runs entirely in your browser. Log your weight, see your progress on a chart, set a goal, and get a weekly reminder to weigh in.

It's a **Progressive Web App (PWA)**: you can install it on your phone or computer like a regular app, and it **works offline**. There are no accounts, no servers and no tracking: **all your data stays on your device**.

## Live Demo

Try it in your browser: **[lazykunn.github.io/Weight-Tracker](https://lazykunn.github.io/Weight-Tracker/)**

## Features

- **Quick logging**: type your weight and tap *Log*. The app shows the change since your last entry (⬆ / ⬇).
- **Progress chart**: see how your weight changes over time, filtered by *All*, *Last month* or *3 months*, with a dashed line for your goal.
- **Goal tracking**: set a target weight and see how many kg you have left.
- **Weekly reminder**: pick a day and time to get a notification to weigh in.
- **Full history**: every entry with date, time and difference from the previous one. Delete any entry with one tap.
- **Import & export (CSV)**: back up your data or share it via WhatsApp, Discord, email, etc. Import it back after reinstalling (duplicates are skipped automatically).
- **Two languages**: English and Portuguese (Portugal). The app follows your phone's language by default, and you can change it anytime in *Settings*.
- **Works offline**: after the first visit, the app opens without internet.
- **Always up to date**: new versions are picked up automatically when you're online.
- **Version info**: *Settings* shows the exact version you're running (Git commit and date), with a link to the change on GitHub.

## Install on your phone

1. Open the [live demo](https://lazykunn.github.io/Weight-Tracker/) in your phone's browser.
2. **Android (Chrome):** go to *Settings* in the app and tap *Install on phone*, or use the browser menu → *Add to Home screen*.
3. **iPhone (Safari):** tap the *Share* button → *Add to Home Screen*.

## Privacy

Everything is saved in your browser's local storage, **only on your device**. Nothing is sent anywhere.

> ⚠️ Clearing your browser's site data will delete your entries. Use **Export CSV** in *Settings* to keep a backup.

## Tech Stack

- **HTML, CSS and vanilla JavaScript**: no frameworks, no build step.
- **[Chart.js](https://www.chartjs.org/)**: for the progress chart.
- **localStorage**: to save data on the device.
- **Service Worker**: for offline support, using a *network-first* strategy so updates arrive automatically.
- **Web App Manifest**: makes the app installable.
- **GitHub Actions + GitHub Pages**: automatic deployment on every push.

## Project Structure

```
Weight-Tracker/
├── index.html              # Page structure
├── style.css               # All styles
├── app.js                  # App logic (entries, chart, goals, reminder, settings)
├── i18n.js                 # Language detection and translation helper: t("key")
├── locales/
│   ├── en.js               # English texts
│   └── pt.js               # Portuguese (Portugal) texts
├── sw.js                   # Service worker (offline + updates)
├── manifest.json           # PWA settings (name, icons, colors)
├── icon-*.png              # App icons
└── .github/workflows/
    └── deploy.yml          # Publishes to GitHub Pages and creates version.json
```

## Run Locally

The app needs to be served by a local web server (opening `index.html` directly with a double click won't load the service worker).

**Option 1: VS Code**
Install the *Live Server* extension, right-click `index.html` → *Open with Live Server*.

**Option 2: Python**
```bash
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000).

When running locally, *Settings* shows "local version" (the version file is only created when the app is deployed).

## Adding a New Language

1. Copy `locales/en.js` to a new file, for example `locales/es.js`.
2. In the new file, change `window.LOCALES.en` to `window.LOCALES.es`, and update `_name` (e.g. `"Español"`) and `_locale` (e.g. `"es-ES"`).
3. Translate the texts on the right side (keep the keys on the left unchanged).
4. Add `<script src="locales/es.js"></script>` to `index.html`, next to the other language files.
5. Add `"./locales/es.js"` to the `APP_ASSETS` list in `sw.js`, and increase the `CACHE_NAME` version.

The new language appears in *Settings* automatically.

## Deployment

Every push to `main` runs a GitHub Actions workflow that:

1. Creates a `version.json` file with the commit hash and date.
2. Publishes the app to GitHub Pages.

So the version shown in *Settings* always matches the latest commit.

## Known Limitations

- **Reminders:** since the app has no server, the weekly reminder only fires reliably if the app is open, or was recently in the background, at the chosen time. If the app has been fully closed for a long time, the phone may not trigger it.
- **One device:** data isn't synced between devices. Use export/import to move it.
