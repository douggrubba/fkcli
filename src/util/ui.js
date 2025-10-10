// a collection of UI utility functions

// a function that clears the screen and sets it to fullscreen mode
export const enterFullscreen = () => {
    process.stdout.write('\x1b[2J\x1b[0f\x1b[?1049h');
};

// a function that exits fullscreen mode and restores the previous screen
export const exitFullscreen = () => {
    process.stdout.write('\x1b[?1049l');
};

// a function that exits the process
export const exit = () => {
    process.exit(0);
}

// clean up the app for exit
export const cleanupAndExit = (unmount) => {
    exitFullscreen();
    unmount();
    exit();
};
