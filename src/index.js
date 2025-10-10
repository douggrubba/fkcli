import { render, Text, Box, useInput } from 'ink';
import React from 'react';
import { cleanupAndExit, enterFullscreen, exitFullscreen, exit } from './util/ui.js';
import { initLanguageSystem, t } from './lang/index.js';
import { getConfig } from './config.js';

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
		alignItems: 'center'
	}, React.createElement(Text, null, t('ui.helloWorld')));
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
