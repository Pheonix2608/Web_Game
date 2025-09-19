// The initial set of elements available to the player.
export const baseElements = {
    'fire': { name: 'Fire' },
    'water': { name: 'Water' },
    'earth': { name: 'Earth' },
    'air': { name: 'Air' },
};

// --- Game State ---
let elementData = {};
let recipes = {};
let discovered = new Set();
let discoveredRecipes = new Set();
let elementRecipeCounts = new Map();

/**
 * Pre-calculates the total number of recipes each element is a part of.
 */
function calculateRecipeCounts() {
    elementRecipeCounts.clear();
    const allElements = new Set([...Object.keys(baseElements), ...Object.keys(elementData)]);

    allElements.forEach(id => {
        elementRecipeCounts.set(id, 0);
    });

    for (const combination in recipes) {
        const [el1, el2] = combination.split('+');
        if (elementRecipeCounts.has(el1)) {
            elementRecipeCounts.set(el1, elementRecipeCounts.get(el1) + 1);
        }
        if (elementRecipeCounts.has(el2)) {
            elementRecipeCounts.set(el2, elementRecipeCounts.get(el2) + 1);
        }
    }
}

/**
 * Fetches the game content and initializes recipe counts.
 */
export async function loadGameContent() {
    try {
        const response = await fetch('game-content.json');
        if (!response.ok) throw new Error('Could not load game content!');
        const content = await response.json();
        elementData = content.elementData;
        recipes = content.recipes;
        calculateRecipeCounts(); // Calculate totals after loading recipes
    } catch (error) {
        console.error('Failed to load game content:', error);
        alert('CRITICAL ERROR: Could not load game content. Please refresh the page.');
    }
}

/**
 * Checks if a combination of two elements is a valid recipe.
 * @returns {{resultId: string, recipeKey: string}|null} The result and key, or null.
 */
export function getCombinationResult(id1, id2) {
    const key1 = `${id1}+${id2}`;
    const key2 = `${id2}+${id1}`;

    let resultId = null;
    let recipeKey = null;

    if (recipes[key1]) {
        resultId = recipes[key1];
        recipeKey = key1;
    } else if (recipes[key2]) {
        resultId = recipes[key2];
        recipeKey = key2;
    }

    if (resultId && elementData[resultId]) {
        return { resultId, recipeKey };
    }

    return null;
}

/**
 * Adds a new discovery to the game state.
 */
export function addDiscovery(resultId, recipeKey) {
    discovered.add(resultId);
    discoveredRecipes.add(recipeKey);
    // Also add the reverse recipe to the set for easier lookup
    const [el1, el2] = recipeKey.split('+');
    discoveredRecipes.add(`${el2}+${el1}`);
}

/**
 * Checks if an element has had all its possible combinations discovered.
 */
export function isElementExhausted(id) {
    const totalRecipes = elementRecipeCounts.get(id) || 0;
    if (totalRecipes === 0) return false; // Cannot exhaust an element with no recipes

    let discoveredCount = 0;
    for (const combination in recipes) {
        if (combination.split('+').includes(id)) {
            if (discoveredRecipes.has(combination)) {
                discoveredCount++;
            }
        }
    }
    return discoveredCount >= totalRecipes;
}


// --- Game State Export ---
export const gameState = {
    baseElements,
    get elementData() { return elementData; },
    get discovered() { return discovered; },
    set discovered(newDiscovered) { discovered = new Set(newDiscovered); },
    get discoveredRecipes() { return discoveredRecipes; },
    set discoveredRecipes(newRecipes) { discoveredRecipes = new Set(newRecipes); },
    get recipes() { return recipes; },
};

/**
 * Provides a hint for a possible new discovery.
 */
export function getHint() {
    const availableElements = [...Object.keys(baseElements), ...Array.from(discovered)];

    const possibleHints = [];
    const checkedCombinations = new Set();

    for (const combination in recipes) {
        const sortedCombination = combination.split('+').sort().join('+');
        if (checkedCombinations.has(sortedCombination)) continue;
        checkedCombinations.add(sortedCombination);

        if (!discoveredRecipes.has(combination) && !discoveredRecipes.has(combination.split('+').reverse().join('+'))) {
            const [el1, el2] = combination.split('+');
            if (availableElements.includes(el1) && availableElements.includes(el2)) {
                possibleHints.push({ el1, el2 });
            }
        }
    }

    if (possibleHints.length === 0) {
        return "No new combinations found with your current elements!";
    }

    const hint = possibleHints[Math.floor(Math.random() * possibleHints.length)];
    const el1Name = elementData[hint.el1]?.name || baseElements[hint.el1]?.name;
    const el2Name = elementData[hint.el2]?.name || baseElements[hint.el2]?.name;

    return `Try combining ${el1Name} with ${el2Name}...`;
}
