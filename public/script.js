document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000';

    // --- DOM Elements ---
    const elementsContainer = document.getElementById('elements-container');
    const compendiumContainer = document.getElementById('compendium-container');
    const craftingArea = document.getElementById('crafting-area');

    // --- Game State ---
    let gameState = {
        elements: {
            'fire': { name: 'Fire' },
            'water': { name: 'Water' },
            'earth': { name: 'Earth' },
            'air': { name: 'Air' },
        },
        discovered: new Set(),
        recipes: {
            'fire+water': 'steam',
            'water+fire': 'steam',
            'earth+water': 'mud',
            'water+earth': 'mud',
            'fire+earth': 'lava',
            'earth+fire': 'lava',
            'air+fire': 'smoke',
            'fire+air': 'smoke',
            'air+water': 'mist',
            'water+air': 'mist',
            'air+earth': 'dust',
            'earth+air': 'dust',
            'lava+steam': 'stone',
            'steam+lava': 'stone',
            'stone+fire': 'metal',
            'fire+stone': 'metal',
            'water+lava': 'obsidian',
            'lava+water': 'obsidian',
        },
        elementData: {
            'steam': { name: 'Steam' },
            'mud': { name: 'Mud' },
            'lava': { name: 'Lava' },
            'smoke': { name: 'Smoke' },
            'mist': { name: 'Mist' },
            'dust': { name: 'Dust' },
            'stone': { name: 'Stone' },
            'metal': { name: 'Metal' },
            'obsidian': { name: 'Obsidian' },
        }
    };

    let draggedElementId = null;

    // --- API Communication ---
    const loadGame = async () => {
        try {
            const response = await fetch(`${API_URL}/load`);
            if (!response.ok) throw new Error('Failed to load game data.');
            const data = await response.json();
            if (data.discovered) {
                gameState.discovered = new Set(data.discovered);
            }
        } catch (error) {
            console.error('Load error:', error);
            // Game starts with default state if load fails
        } finally {
            renderElements();
        }
    };

    const saveGame = async () => {
        try {
            await fetch(`${API_URL}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discovered: Array.from(gameState.discovered) }),
            });
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    // --- Rendering ---
    const createElementDOM = (id, element) => {
        const el = document.createElement('div');
        el.id = id;
        el.className = 'element';
        el.textContent = element.name;
        el.draggable = true;
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);
        // Allow elements to be drop targets as well
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);
        return el;
    };

    const renderElements = () => {
        // Clear existing elements
        elementsContainer.innerHTML = '';
        compendiumContainer.innerHTML = '';

        // Render base elements
        for (const id in gameState.elements) {
            elementsContainer.appendChild(createElementDOM(id, gameState.elements[id]));
        }

        // Render discovered elements in the compendium
        gameState.discovered.forEach(id => {
            const element = gameState.elementData[id];
            if (element) {
                compendiumContainer.appendChild(createElementDOM(id, element));
            }
        });
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e) => {
        draggedElementId = e.target.id;
        e.dataTransfer.setData('text/plain', draggedElementId);
        setTimeout(() => e.target.classList.add('dragging'), 0);
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        draggedElementId = null;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        const target = e.target.closest('.crafting-area, .element');
        if (target) {
            target.classList.add('drag-over');
        }
    };

    const handleDragLeave = (e) => {
        const target = e.target.closest('.crafting-area, .element');
        if (target) {
            target.classList.remove('drag-over');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const target = e.target.closest('.crafting-area, .element');
        if (target) {
            target.classList.remove('drag-over');
        }

        const droppedOnId = e.target.closest('.element')?.id;
        if (droppedOnId && draggedElementId && droppedOnId !== draggedElementId) {
            checkForCombination(draggedElementId, droppedOnId);
        }
    };

    // --- Game Logic ---
    const checkForCombination = (id1, id2) => {
        const combinationKey1 = `${id1}+${id2}`;
        const combinationKey2 = `${id2}+${id1}`;
        const resultId = gameState.recipes[combinationKey1] || gameState.recipes[combinationKey2];

        if (resultId && gameState.elementData[resultId]) {
            if (!gameState.discovered.has(resultId)) {
                console.log(`New discovery: ${gameState.elementData[resultId].name}`);
                gameState.discovered.add(resultId);
                renderElements();
                saveGame();
            } else {
                console.log(`Already discovered: ${gameState.elementData[resultId].name}`);
            }
        } else {
            console.log('Nothing happens.');
        }
    };

    // --- Initialization ---
    craftingArea.addEventListener('dragover', handleDragOver);
    craftingArea.addEventListener('dragleave', handleDragLeave);
    craftingArea.addEventListener('drop', handleDrop);

    loadGame();
});
