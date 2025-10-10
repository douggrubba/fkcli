import chalk from 'chalk';

// ASCII logo for the FK game
export const LOGO = `  _____     .__  .__   __                       __   
_/ ____\\_ __|  | |  | |  | ______  __ __  _____/  |_ 
\\   __\\  |  \\  | |  | |  |/ /  _ \\|  |  \\/    \\   __\\
 |  | |  |  /  |_|  |_|    <  <_> )  |  /   |  \\  |  
 |__| |____/|____/____/__|_ \\____/|____/|___|  /__|  
                           \\/                \\/      `;

// Function to display the logo with optional styling
export const displayLogo = (colored = true) => {
	if (colored) {
		return chalk.cyan(LOGO);
	}
	return LOGO;
};

// Function to get logo lines as array for easier rendering
export const getLogoLines = () => {
	return LOGO.split('\n');
};