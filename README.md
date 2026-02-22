# Enneagram Compass (VersionBear LABS)

A beautiful, interactive Enneagram personality test built with vanilla JavaScript. Discover your dominant type, explore your wing, and visualize your scores across all nine types.

![Enneagram Compass](https://img.shields.io/badge/HTML-CSS-JS-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **36 Reflective Questions** — Carefully crafted prompts covering all 9 Enneagram types (4 questions per type)
- **5-Point Rating Scale** — Nuanced responses from "Not at all" to "Very much"
- **Wing Analysis** — Automatic detection of your dominant adjacent wing (e.g., 5w4, 7w8)
- **Visual Score Breakdown** — See your scores across all types with triad color coding:
  - 🟠 Gut Triad (Types 8, 9, 1)
  - 🔴 Heart Triad (Types 2, 3, 4)
  - 🔵 Head Triad (Types 5, 6, 7)
- **Aggregate Baseline** — Compare your results against anonymous community averages
- **Save Results** — Track your results over time with local storage
- **Share Results** — Built-in Web Share API support for easy sharing
- **Auto-Advance** — Optional automatic progression between questions
- **Fully Responsive** — Works beautifully on mobile, tablet, and desktop

## Quick Start

1. Clone or download this repository
2. Open `index.html` in any modern web browser
3. Click "Start Test" and begin

No build process, dependencies, or server required.

```bash
# Or serve locally with any static server
npx serve .
```

## Project Structure

```
EnneagramCompass/
├── index.html      # Main HTML structure
├── styles.css      # Custom CSS with CSS variables and animations
├── script.js       # Vanilla JavaScript logic (no frameworks)
├── favicon.svg     # Custom SVG favicon
└── README.md       # This file
```

## How It Works

### Scoring System

Each of the 36 questions maps to one of the 9 Enneagram types. Users rate each statement on a 1-5 scale:

- **4 questions per type** × **max 5 points** = **maximum 20 points per type**
- The type with the highest total score is your dominant type
- Wing is determined by comparing scores on adjacent types (e.g., Type 5 compares Types 4 and 6)

### Data Storage

All data is stored locally in the browser using `localStorage`:

- **Result history** — Used to compute aggregate baseline (max 500 entries)
- **Saved results** — Manually saved test results (max 50 entries)
- **Preferences** — Auto-advance setting persistence

### Triad Classification

Types are grouped into three triads for visual distinction:

| Triad | Types | Focus |
|-------|-------|-------|
| Gut/Body | 8, 9, 1 | Instinct, action, autonomy |
| Heart/Image | 2, 3, 4 | Emotion, identity, relationships |
| Head/Thinking | 5, 6, 7 | Analysis, security, possibilities |

## Customization

### Inject Custom Baseline

To provide your own aggregate baseline instead of using local data:

```html
<script>
  window.ENNEAGRAM_BASELINE = {
    scores: { 1: 14, 2: 11, 3: 13, 4: 10, 5: 15, 6: 12, 7: 11, 8: 9, 9: 13 },
    sampleSize: 150
  };
</script>
<script src="script.js"></script>
```

### Styling

CSS variables in `styles.css` make theming easy:

```css
:root {
  --ink: #1b1a25;        /* Primary text color */
  --paper: #fffaf2;      /* Background base */
  --accent: #e56b38;     /* Primary accent (orange) */
  --good: #2b8a5f;       /* Success/highlight color */
  /* ... more variables ... */
}
```

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome for Android)

## License

MIT License — see [LICENSE](LICENSE) for details.

Created by [VersionBear](https://versionbear.itssljk.com)
