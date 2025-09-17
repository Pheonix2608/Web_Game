import { gameState } from './game.js';

const API_URL = 'http://localhost:3000';

/**
 * Loads the game state from the server and updates the local game state.
 */
export async function loadGame() {
    try {
        const response = await fetch(`${API_URL}/load`);
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
        const data = await response.json();
        if (data.discovered) {
            // Update the discovered set in the game module
            gameState.discovered = new Set(data.discovered);
        }
    } catch (error) {
        console.error('Load error:', error);
        alert('Could not load saved data. Starting a new game. (Is the server running?)');
        // Game starts with default state if load fails
    }
}

/**
 * Saves the current set of discovered elements to the server.
 */
export async function saveGame() {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ discovered: Array.from(gameState.discovered) }),
        });
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    } catch (error) {
        console.error('Save error:', error);
        alert('Could not save progress. Please ensure the server is running.');
    }
}
