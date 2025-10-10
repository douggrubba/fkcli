# Language System (i18n)

This is a simple internationalization system for the FK game.

## Structure

```
src/
├── lang/
│   ├── index.js     # Main language system
│   ├── en.js        # English translations
│   ├── es.js        # Spanish translations
│   └── fr.js        # French translations
├── config.js        # Configuration system
└── example-usage.js # Usage examples
```

## Usage

### Basic Translation

```javascript
import { t } from './lang/index.js';

// Use dot notation to access nested translations
const helloWorld = t('ui.helloWorld');      // "Hello World"
const startGame = t('game.start');          // "Start Game" 
const errorMsg = t('errors.generic');       // "An error occurred"
```

### Changing Languages

```javascript
import { setLanguage, t } from './lang/index.js';

setLanguage('es');                    // Switch to Spanish
console.log(t('ui.helloWorld'));     // "Hola Mundo"

setLanguage('fr');                    // Switch to French  
console.log(t('ui.helloWorld'));     // "Bonjour le Monde"
```

### Configuration

You can set the default language in `config.js`:

```javascript
export const CONFIG = {
    language: 'es', // Change this to 'en', 'es', or 'fr'
    // ... other config
};
```

### Available Functions

- `t(keyPath, fallback)` - Get translation for a key path
- `setLanguage(langCode)` - Set current language
- `getCurrentLanguage()` - Get current language code
- `getAvailableLanguages()` - Get array of available language codes
- `getLanguageName(langCode)` - Get display name for language
- `initLanguageSystem(preferredLang)` - Initialize with optional preferred language
- `detectSystemLanguage()` - Auto-detect system language

## Adding New Languages

1. Create a new language file (e.g., `src/lang/de.js` for German):

```javascript
export const de = {
    ui: {
        helloWorld: 'Hallo Welt',
        welcome: 'Willkommen',
        // ... more translations
    },
    // ... other sections
};
```

2. Import and add it to `src/lang/index.js`:

```javascript
import { de } from './de.js';

export const LANGUAGES = {
    en: 'English',
    es: 'Español', 
    fr: 'Français',
    de: 'Deutsch'  // Add this
};

const languages = {
    en, es, fr, de  // Add de here
};
```

## Translation Key Structure

Translations are organized in categories:

- `ui.*` - User interface elements
- `game.*` - Game-specific text
- `errors.*` - Error messages

You can add more categories as needed.