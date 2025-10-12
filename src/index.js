import { render, Text, Box, useInput } from 'ink';
import React, { useState } from 'react';
import { cleanupAndExit, enterFullscreen, exitFullscreen, exit } from './util/ui.js';
import { initLanguageSystem, t } from './lang/index.js';
import { getConfig } from './config.js';
import { displayLogo } from './util/logo.js';
import Menu from './components/Menu.js';

const App = () => {
	const [currentScreen, setCurrentScreen] = useState('welcome');
	const [showLogo, setShowLogo] = useState(true);
	
	useInput((input, key) => {
		if (key.ctrl && input === 'c') {
			exit();
		}
		
		// On welcome screen, any key shows menu
		if (currentScreen === 'welcome' && (input || key.return || key.space)) {
			setCurrentScreen('menu');
			setShowLogo(false);
		}
	});
	
	const handleMenuSelect = (menuKey) => {
		switch (menuKey) {
			case 'newGame':
				setCurrentScreen('newGame');
				break;
			case 'continue':
				setCurrentScreen('continue');
				break;
			case 'settings':
				setCurrentScreen('settings');
				break;
			case 'quit':
				exit();
				break;
		}
	};
	
	const renderWelcomeScreen = () => {
		return React.createElement(Box, {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column'
		}, [
			React.createElement(Text, { key: 'logo' }, displayLogo()),
			React.createElement(Box, { key: 'spacer1', height: 1 }),
			React.createElement(Text, { key: 'welcome', color: 'green', bold: true }, t('ui.welcome')),
			React.createElement(Text, { key: 'subtitle', color: 'gray' }, t('ui.subtitle')),
			React.createElement(Box, { key: 'spacer2', height: 2 }),
			React.createElement(Text, { key: 'continue', color: 'yellow' }, t('ui.pressAnyKey')),
			React.createElement(Box, { key: 'spacer3', height: 1 }),
			React.createElement(Text, { key: 'exit', color: 'gray', dimColor: true }, t('ui.exit'))
		]);
	};
	
	const renderMenuScreen = () => {
		return React.createElement(Box, {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column'
		}, [
			showLogo && React.createElement(Text, { key: 'logo' }, displayLogo()),
			showLogo && React.createElement(Box, { key: 'spacer1', height: 1 }),
			React.createElement(Text, { key: 'welcome', color: 'green', bold: true }, t('ui.welcome')),
			React.createElement(Menu, { key: 'menu', onSelect: handleMenuSelect }),
			React.createElement(Box, { key: 'spacer2', height: 1 }),
			React.createElement(Text, { key: 'exit', color: 'gray', dimColor: true }, t('ui.exit'))
		]);
	};
	
	const renderGameScreen = (type) => {
		const messages = {
			newGame: 'Starting new game...',
			continue: 'Loading saved game...',
			settings: 'Settings menu (coming soon...)'
		};
		
		return React.createElement(Box, {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column'
		}, [
			React.createElement(Text, { key: 'message', color: 'cyan' }, messages[type] || 'Game screen'),
			React.createElement(Box, { key: 'spacer', height: 2 }),
			React.createElement(Text, { key: 'exit', color: 'gray' }, t('ui.exit'))
		]);
	};
	
	switch (currentScreen) {
		case 'welcome':
			return renderWelcomeScreen();
		case 'menu':
			return renderMenuScreen();
		case 'newGame':
		case 'continue':
		case 'settings':
			return renderGameScreen(currentScreen);
		default:
			return renderWelcomeScreen();
	}
};

const main = () => {
	// Initialize language system with configured language
	const preferredLanguage = getConfig('language');
	initLanguageSystem(preferredLanguage);
	
	enterFullscreen();
	
	const { unmount } = render(React.createElement(App), { exitOnCtrlC: false });
	
	process.on('SIGINT', () => cleanupAndExit(unmount));
	process.on('SIGTERM', () => cleanupAndExit(unmount));
	process.on('exit', () => exitFullscreen());
};

main();
