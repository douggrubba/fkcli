import { render, Text, Box, useInput } from 'ink';
import React from 'react';
import { cleanupAndExit, enterFullscreen, exitFullscreen, exit } from './util/ui.js';
import { initLanguageSystem, t } from './lang/index.js';
import { getConfig } from './config.js';
import { displayLogo } from './util/logo.js';

const App = () => {
	useInput((input, key) => {
		if (key.ctrl && input === 'c') {
			exit();
		}
	});
	
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
		React.createElement(Text, { key: 'exit', color: 'yellow' }, t('ui.exit'))
	]);
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
