# TTM — Thai Tadabbur with Mukhtasar

A web-based tool for reading and studying the Quran with Thai translation (Mukhtasar), colored tajweed text, and Maqasid information (objectives of each surah).

## Features

- **Quran Text** — Colored tajweed (online via API) or Uthmani script (offline, from `quran_uthmani_data.js`)
- **Thai Translation (Mukhtasar)** — Short translation and explanation of each ayah by Abu Hamza Al-Farsi
- **Maqasid Panel** — Topics by ayah group and overall content of each surah, displayed in the right panel with independent surah dropdown (does not affect the left panel)
- **Toggle Right Panel** — Show/hide the Maqasid panel; the left panel expands to full width when hidden
- **Split Screen** — Left panel shows ayah with translation, right panel shows surah info and topic groups
- **Bookmarks** — Saves reading position (surah, ayah, text mode, font size) in `localStorage` and restores automatically on page load
- **Arabic Font Size Adjustment** — Adjust using preset buttons and a slider
- **Responsive Layout** — Panels stack vertically on narrow screens

## Data Files

- `thai-mukhtasar.js` — Thai translation data by Abu Hamza Al-Farsi (`window.QURAN_TRANSLATION_DATA`)
- `maqasid_data.js` — Maqasid data for each surah (`window.QURAN_MAP_DATA`)
- `quran_uthmani_data.js` — Uthmani script text from [tanzil.net](https://tanzil.net) (`window.QURAN_UTHMANI_DATA`)

## Usage

1. Open `index.html` in any modern web browser.
2. Use the surah dropdown in the left panel to select a surah to read.
3. Switch between **Tajweed** (requires internet, fetched from `api.alquran.cloud`) and **Uthmani** (offline) text modes using the toggle.
4. Adjust the Arabic font size using the preset buttons or the slider.
5. The right panel displays the surah's Maqasid (objectives and themes). You can:
   - Browse topics by ayah group
   - Select a different surah in the right panel's dropdown without affecting the left panel
   - Hide the right panel using the toggle button for a full-width reading experience
6. Your reading position is saved automatically — close and reopen the page to resume where you left off.
7. The Uthmani text and Thai translation work offline; tajweed text requires an active internet connection.

## Credits

- Thai translation: Abu Hamza Al-Farsi (Mukhtasar)
- Uthmani text: [tanzil.net](https://tanzil.net)
- Ayah API: [alquran.cloud](https://alquran.cloud)
