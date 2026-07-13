# TTM — Thai Tadabbur with Mukhtasar

A web-based tool for reading and studying the Quran with Thai translation (Mukhtasar), colored tajweed text, English translation, Maqasid information (objectives of each surah), and full Mukhtasar content viewer.

## Features

- **Quran Text** — Three modes: Colored Tajweed (online via API), Uthmani script (offline, from `quran_uthmani_data.js`), or Quran.com (online)
- **Thai Translation (Mukhtasar)** — Short translation and explanation of each ayah by Abu Hamza Al-Farsi
- **English Translation** — Toggle "คำแปลไทย" to show Thai translation; uncheck to show English translation instead
- **Tajweed Color Guide** — Info modal with complete tajweed color rules referenced from [alquran.cloud/tajweed-guide](https://alquran.cloud/tajweed-guide)
- **Mukhtasar Content Viewer** — In Quran.com mode, click "Mukhtasar" button in the header to view full Mukhtasar translations from the current ayah to the end of the surah in a scrollable modal
- **Mukhtasar Info** — Info modal explaining what Mukhtasar is and how to use it
- **Maqasid Panel** — Topics by ayah group and overall content of each surah, displayed in the right panel with independent surah dropdown
- **Toggle Right Panel** — Show/hide the Maqasid panel; the left panel expands to full width when hidden
- **Split Screen** — Left panel shows ayah with translation, right panel shows surah info and topic groups
- **Bookmarks** — Saves reading position (surah, ayah, text mode, font sizes) in `localStorage` and restores automatically on page load
- **Arabic Font Size Adjustment** — Adjust using preset buttons and a slider (via bookmark settings)
- **Translation Font Size Adjustment** — Separate font size control for translation text
- **Responsive Layout** — Panels stack vertically on narrow screens

## Data Files

- `thai-mukhtasar.js` — Thai translation data by Abu Hamza Al-Farsi (`window.QURAN_TRANSLATION_DATA`)
- `english-mukhtasar.js` — English translation data (`window.QURAN_ENGLISH_TRANSLATION_DATA`)
- `maqasid_data.js` — Maqasid data for each surah (`window.QURAN_MAP_DATA`)
- `quran_uthmani_data.js` — Uthmani script text from [tanzil.net](https://tanzil.net) (`window.QURAN_UTHMANI_DATA`)

## Usage

1. Open `index.html` in any modern web browser.
2. Use the surah dropdown in the header to select a surah to read.
3. Switch between **Tajweed** (requires internet), **Uthmani** (offline), or **Quran.com** text modes via the bookmark settings (ปุ่ม "ตั้งค่า").
4. Toggle **คำแปลไทย** to show Thai translation; uncheck to show English translation instead.
5. Toggle **Tajweed** to enable/disable colored tajweed highlighting.
6. Toggle **Maqasid** to show/hide the right panel with surah objectives and themes.
7. Adjust Arabic and translation font sizes via the **ตั้งค่า** button.
8. In **Quran.com** mode, click **Mukhtasar** button to view full translation content from current ayah to end of surah.
9. Your reading position is saved automatically — close and reopen the page to resume where you left off.

## Credits

- Thai translation: Abu Hamza Al-Farsi (Mukhtasar)
- Uthmani text: [tanzil.net](https://tanzil.net)
- Ayah API: [alquran.cloud](https://alquran.cloud)
- Tajweed guide: [alquran.cloud/tajweed-guide](https://alquran.cloud/tajweed-guide)
