// The initial set of elements available to the player.
export const baseElements = {
    'fire': { name: 'Fire' },
    'water': { name: 'Water' },
    'earth': { name: 'Earth' },
    'air': { name: 'Air' },
};

// Placeholders for the game content data.
let elementData = {};
let recipes = {};

// The set of discovered element IDs. This will be populated from the server.
let discovered = new Set();

/**
 * Fetches the game content (elements and recipes) from a JSON file.
 */
export async function loadGameContent() {
    try {
        const response = await fetch('game-content.json');
        if (!response.ok) throw new Error('Could not load game content!');
        const content = await response.json();
        elementData = content.elementData;
        recipes = content.recipes;
    } catch (error) {
        console.error('Failed to load game content:', error);
        alert('CRITICAL ERROR: Could not load game content. Please refresh the page.');
    }
}

/**
 * Checks if a combination of two elements results in a new discovery.
 * @param {string} id1 - The ID of the first element.
 * @param {string} id2 - The ID of the second element.
 * @returns {string|null} The ID of the discovered element, or null if no new discovery.
 */
export function checkForCombination(id1, id2) {
    const key1 = `${id1}+${id2}`;
    const key2 = `${id2}+${id1}`;
    const resultId = recipes[key1] || recipes[key2];

    if (resultId && elementData[resultId] && !discovered.has(resultId)) {
        return resultId;
    }
    return null;
}

/**
 * Adds a newly discovered element to the set.
 * @param {string} id - The ID of the discovered element.
 */
export function addDiscoveredElement(id) {
    discovered.add(id);
}

// Export all the necessary parts.
export const gameState = {
    baseElements,
    get elementData() { return elementData; },
    get discovered() { return discovered; },
    set discovered(newDiscovered) { discovered = newDiscovered; },
    get recipes() { return recipes; }, // Expose for hint system
};

/**
 * Finds a possible combination that the player has the ingredients for but hasn't discovered yet.
 * @returns {string} A hint message, or a message indicating no hints are available.
 */
export function getHint() {
    const availableElements = [...Object.keys(baseElements), ...Array.from(discovered)];

    // Use a Set to avoid duplicate hints (e.g., fire+water and water+fire)
    const checkedCombinations = new Set();
    const possibleHints = [];

    for (const combination in recipes) {
        const [el1, el2] = combination.split('+');
        const sortedCombination = [el1, el2].sort().join('+');

        if (checkedCombinations.has(sortedCombination)) {
            continue;
        }
        checkedCombinations.add(sortedCombination);

        const result = recipes[combination];
        if (!discovered.has(result)) {
            if (availableElements.includes(el1) && availableElements.includes(el2)) {
                possibleHints.push({ el1, el2 });
            }
        }
    }

    if (possibleHints.length === 0) {
        return "No new combinations found with your current elements. Keep exploring!";
    }

    // Pick a random hint
    const hint = possibleHints[Math.floor(Math.random() * possibleHints.length)];
    const el1Name = elementData[hint.el1]?.name || baseElements[hint.el1]?.name;
    const el2Name = elementData[hint.el2]?.name || baseElements[hint.el2]?.name;

    return `Try combining ${el1Name} with ${el2Name}...`;
}
