// Simple configuration system
export const CONFIG = {
	// Language settings
	language: 'en', // Default language, can be 'en', 'es', 'fr'
	
	// UI settings
	ui: {
		fullscreen: true,
		exitOnCtrlC: true,
	},
	
	// Game settings
	game: {
		difficulty: 'normal',
		soundEnabled: true,
	}
};

// Function to get config value with dot notation
export const getConfig = (keyPath, defaultValue = null) => {
	const keys = keyPath.split('.');
	let value = CONFIG;
	
	for (const key of keys) {
		if (value && typeof value === 'object' && key in value) {
			value = value[key];
		} else {
			return defaultValue;
		}
	}
	
	return value;
};

// Function to set config value
export const setConfig = (keyPath, newValue) => {
	const keys = keyPath.split('.');
	let current = CONFIG;
	
	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!(key in current) || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key];
	}
	
	current[keys[keys.length - 1]] = newValue;
};