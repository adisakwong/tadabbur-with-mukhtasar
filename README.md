# TTMM — Thai Tadabbur with Mukhtasar & Maqasid

A web-based Quran study app for reading Arabic text with Tajweed coloring, Thai Mukhtasar translation, English fallback translation, Maqasid content, and Tajweed explanations.

## Features

- **Quran Text Modes** — Tajweed (online via `alquran.cloud`), Uthmani script (offline from `quran_uthmani_data.js`), and Quran.com iframe mode
- **Thai Translation (Mukhtasar)** — Short translation and explanation of each ayah by Abu Hamza Al-Farsi
- **English Translation Toggle** — Toggle Thai translation on/off; when hidden, English translation appears instead
- **Tajweed Color Guide** — Info modal explaining the color meanings and referencing [alquran.cloud/tajweed-guide](https://alquran.cloud/tajweed-guide)
- **Tajweed Rules** — Comprehensive Tajweed rules reference in Thai, opened from the header button
- **Mukhtasar Content Viewer** — Open the full Mukhtasar translation from the current ayah onward in a modal window
- **Maqasid Panel** — Surah overview, themes by ayah range, and general content in the right panel
- **Split Screen Layout** — Left panel shows the Quran text; right panel shows Maqasid information
- **Bookmarks** — Saves surah, ayah, selected text mode, Arabic font, and font sizes to `localStorage`
- **Arabic Font Options** — Includes readable Arabic font choices such as Amiri, Noto Naskh Arabic, and Scheherazade New, plus classic alternatives
- **Font Size Controls** — Separate controls for Arabic text and translation text
- **Responsive Layout** — Adapts to narrower screens and mobile browsing

## Data Files

- `thai-mukhtasar.js` — Thai translation data by Abu Hamza Al-Farsi (`window.QURAN_TRANSLATION_DATA`)
- `english-mukhtasar.js` — English translation data (`window.QURAN_ENGLISH_TRANSLATION_DATA`)
- `maqasid_data.js` — Maqasid data for each surah (`window.QURAN_MAP_DATA`)
- `quran_uthmani_data.js` — Uthmani script data from [tanzil.net](https://tanzil.net) (`window.QURAN_UTHMANI_DATA`)
- `tajweed_rules_data.js` — Tajweed rules reference data in Thai (`window.TAJWEED_RULES_DATA`)

## Usage

1. Open `index.html` in a modern browser.
2. Use the surah dropdown to select a surah.
3. Click **ตั้งค่า** to open the bookmark settings and choose:
   - surah + ayah
   - text mode: **Tajweed**, **Uthmani**, or **Quran.com**
   - Arabic font style
   - Arabic and translation font sizes
4. Toggle **คำแปลไทย** to show Thai translation; uncheck it to show English translation instead.
5. Toggle **Tajweed** to enable or disable the colored Tajweed display.
6. Toggle **Maqasid** to show or hide the right panel.
7. Use **Mukhtasar** to view the fuller translation from the current ayah onward.
8. Use **Tajweed Rules** for a reference guide in Thai.
9. The reading position is saved automatically and restored on refresh.

## Sources

- Thai translation (Mukhtasar): [qul.tarteel.ai](https://qul.tarteel.ai)
- Uthmani text: [tanzil.net](https://tanzil.net)
- Quran text and Tajweed colored text: [alquran.cloud](https://alquran.cloud)
- Tajweed guide: [alquran.cloud/tajweed-guide](https://alquran.cloud/tajweed-guide)
- Tajweed rules content: [madinaharabic.com](https://www.madinaharabic.com/blog/tajweed-rules.html)
- Maqasid reference: [genfa.co](https://genfa.co)
- Arabic fonts: Google Fonts (Amiri, Noto Naskh Arabic, Scheherazade New)
