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
            gameState.discovered = new Set(data.discovered);
        }
        if (data.discoveredRecipes) {
            gameState.discoveredRecipes = new Set(data.discoveredRecipes);
        }
    } catch (error) {
        console.error('Load error:', error);
        alert('Could not load saved data. Starting a new game. (Is the server running?)');
    }
}

/**
 * Saves the current game state to the server.
 */
export async function saveGame() {
    try {
        const saveData = {
            discovered: Array.from(gameState.discovered),
            discoveredRecipes: Array.from(gameState.discoveredRecipes),
        };
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saveData),
        });
        if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    } catch (error) {
        console.error('Save error:', error);
        alert('Could not save progress. Please ensure the server is running.');
    }
}
