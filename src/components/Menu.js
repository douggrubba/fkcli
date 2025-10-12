import React, { useState } from 'react';
import { Text, Box, useInput } from 'ink';
import { t } from '../lang/index.js';

const Menu = ({ onSelect }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	
	const menuItems = [
		{ key: 'newGame', label: t('game.newGame') },
		{ key: 'continue', label: t('game.continue') },
		{ key: 'settings', label: t('game.settings') },
		{ key: 'quit', label: t('game.quit') }
	];
	
	useInput((input, key) => {
		if (key.upArrow) {
			setSelectedIndex(prev => prev > 0 ? prev - 1 : menuItems.length - 1);
		} else if (key.downArrow) {
			setSelectedIndex(prev => prev < menuItems.length - 1 ? prev + 1 : 0);
		} else if (key.return) {
			if (onSelect) {
				onSelect(menuItems[selectedIndex].key);
			}
		}
	});
	
	return React.createElement(Box, {
		flexDirection: 'column',
		alignItems: 'center'
	}, [
		React.createElement(Box, { key: 'spacer', height: 1 }),
		...menuItems.map((item, index) => 
			React.createElement(Text, {
				key: item.key,
				color: selectedIndex === index ? 'black' : 'white',
				backgroundColor: selectedIndex === index ? 'cyan' : undefined,
				bold: selectedIndex === index
			}, ` ${selectedIndex === index ? '►' : ' '} ${item.label} `)
		),
		React.createElement(Box, { key: 'spacer2', height: 1 }),
		React.createElement(Text, { 
			key: 'instructions', 
			color: 'gray' 
		}, t('ui.menuInstructions'))
	]);
};

export default Menu;