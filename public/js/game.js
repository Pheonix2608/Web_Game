// The initial set of elements available to the player.
const baseElements = {
    'fire': { name: 'Fire' },
    'water': { name: 'Water' },
    'earth': { name: 'Earth' },
    'air': { name: 'Air' },
};

// All possible new elements that can be discovered.
const elementData = {
    // Original
    'steam': { name: 'Steam' },
    'mud': { name: 'Mud' },
    'lava': { name: 'Lava' },
    'smoke': { name: 'Smoke' },
    'mist': { name: 'Mist' },
    'dust': { name: 'Dust' },
    'stone': { name: 'Stone' },
    'metal': { name: 'Metal' },
    'obsidian': { name: 'Obsidian' },
    // New
    'sand': { name: 'Sand' },
    'glass': { name: 'Glass' },
    'lens': { name: 'Lens' },
    'rust': { name: 'Rust' },
    'blade': { name: 'Blade' },
    'sword': { name: 'Sword' },
    'pressure': { name: 'Pressure' },
    'diamond': { name: 'Diamond' },
    'clay': { name: 'Clay' },
    'brick': { name: 'Brick' },
    'wall': { name: 'Wall' },
    'sea': { name: 'Sea' },
    'salt': { name: 'Salt' },
    'wind': { name: 'Wind' },
};

// The recipes for combining elements.
const recipes = {
    // Original
    'fire+water': 'steam', 'water+fire': 'steam',
    'earth+water': 'mud', 'water+earth': 'mud',
    'fire+earth': 'lava', 'earth+fire': 'lava',
    'air+fire': 'smoke', 'fire+air': 'smoke',
    'air+water': 'mist', 'water+air': 'mist',
    'air+earth': 'dust', 'earth+air': 'dust',
    'lava+steam': 'stone', 'steam+lava': 'stone',
    'stone+fire': 'metal', 'fire+stone': 'metal',
    'water+lava': 'obsidian', 'lava+water': 'obsidian',
    // New
    'stone+air': 'sand', 'air+stone': 'sand',
    'sand+fire': 'glass', 'fire+sand': 'glass',
    'glass+water': 'lens', 'water+glass': 'lens',
    'metal+water': 'rust', 'water+metal': 'rust',
    'metal+stone': 'blade', 'stone+metal': 'blade',
    'blade+metal': 'sword', 'metal+blade': 'sword',
    'earth+earth': 'pressure',
    'pressure+earth': 'diamond', 'earth+pressure': 'diamond',
    'dust+water': 'clay', 'water+dust': 'clay',
    'clay+fire': 'brick', 'fire+clay': 'brick',
    'brick+brick': 'wall',
    'water+water': 'sea',
    'sea+fire': 'salt', 'fire+sea': 'salt',
    'air+air': 'wind',
};

// The set of discovered element IDs. This will be populated from the server.
let discovered = new Set();

/**
 * Checks if a combination of two elements results in a new discovery.
 * @param {string} id1 - The ID of the first element.
 * @param {string} id2 - The ID of the second element.
 * @returns {string|null} The ID of the discovered element, or null if no new discovery.
 */
function checkForCombination(id1, id2) {
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
function addDiscoveredElement(id) {
    discovered.add(id);
}

// Export all the necessary parts.
export const gameState = {
    baseElements,
    elementData,
    get discovered() { return discovered; },
    set discovered(newDiscovered) { discovered = newDiscovered; },
};

export { checkForCombination, addDiscoveredElement };
