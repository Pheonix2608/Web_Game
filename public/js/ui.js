import { gameState, checkForCombination, addDiscoveredElement, loadGameContent, getHint } from './game.js';
import { loadGame, saveGame } from './api.js';

// --- Audio ---
const successSound = new Audio('sounds/success.mp3');
const failSound = new Audio('sounds/fail.mp3');

// --- DOM Elements ---
const elementsContainer = document.getElementById('elements-container');
const compendiumContainer = document.getElementById('compendium-container');
const craftingArea = document.getElementById('crafting-area');
const discoveryTreeContainer = document.getElementById('discovery-tree-container');
const clearCraftingBtn = document.getElementById('clear-crafting-btn');
const hintBtn = document.getElementById('hint-btn');

let draggedElementId = null;

// --- Rendering ---
function createElementDOM(id, element) {
    const el = document.createElement('div');
    el.id = id;
    el.className = 'element';
    el.textContent = element.name;
    el.draggable = true;
    el.addEventListener('dragstart', handleDragStart);
    el.addEventListener('dragend', handleDragEnd);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('drop', handleDrop);
    return el;
}

function renderElements() {
    elementsContainer.innerHTML = '';
    compendiumContainer.innerHTML = '';

    // Clear any elements from crafting area that might be there from a previous state
    clearCraftingArea();

    // Render base elements
    for (const id in gameState.baseElements) {
        elementsContainer.appendChild(createElementDOM(id, gameState.baseElements[id]));
    }

    // Render discovered elements
    gameState.discovered.forEach(id => {
        const element = gameState.elementData[id];
        if (element) {
            compendiumContainer.appendChild(createElementDOM(id, element));
        }
    });

    renderDiscoveryTree();
}

function renderDiscoveryTree() {
    discoveryTreeContainer.innerHTML = '';
    const discoveredRecipes = new Set();

    // Use the recipes from the gameState
    for (const combination in gameState.recipes) {
        const resultId = gameState.recipes[combination];
        if (gameState.discovered.has(resultId)) {
            const [el1, el2] = combination.split('+');
            const sortedKey = [el1, el2].sort().join('+');
            discoveredRecipes.add(`${sortedKey}=${resultId}`);
        }
    }

    discoveredRecipes.forEach(recipeString => {
        const [combo, resultId] = recipeString.split('=');
        const [el1Id, el2Id] = combo.split('+');

        const el1Name = gameState.elementData[el1Id]?.name || gameState.baseElements[el1Id]?.name;
        const el2Name = gameState.elementData[el2Id]?.name || gameState.baseElements[el2Id]?.name;
        const resultName = gameState.elementData[resultId]?.name;

        const li = document.createElement('li');
        li.textContent = `[${el1Name}] + [${el2Name}] = [${resultName}]`;
        discoveryTreeContainer.appendChild(li);
    });
}

// --- Drag and Drop Handlers ---
function handleDragStart(e) {
    draggedElementId = e.target.id;
    e.dataTransfer.setData('text/plain', draggedElementId);
    setTimeout(() => e.target.classList.add('dragging'), 0);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElementId = null;
}

function handleDragOver(e) {
    e.preventDefault();
    const target = e.target.closest('.crafting-area, .element');
    if (target) target.classList.add('drag-over');
}

function handleDragLeave(e) {
    const target = e.target.closest('.crafting-area, .element');
    if (target) target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropTarget = e.target;
    // Use closest for reliability, especially with the new header in crafting area
    const dropTargetArea = dropTarget.closest('.crafting-area');
    const dropTargetElement = dropTarget.closest('.element');

    if (dropTarget) dropTarget.classList.remove('drag-over');

    const draggedEl = document.getElementById(draggedElementId);
    if (!draggedEl) return;

    // Case 1: Dropping an element onto another element
    if (dropTargetElement && dropTargetElement.id !== draggedElementId) {
        const droppedOnId = dropTargetElement.id;
        const resultId = checkForCombination(draggedElementId, droppedOnId);
        if (resultId) {
            successSound.play();
            console.log(`New discovery: ${gameState.elementData[resultId].name}`);
            addDiscoveredElement(resultId);
            renderElements(); // Re-render to add new element to compendium

            // Trigger animation
            const newElementDOM = compendiumContainer.querySelector(`#${resultId}`);
            if (newElementDOM) {
                newElementDOM.classList.add('element-discovered');
                setTimeout(() => {
                    newElementDOM.classList.remove('element-discovered');
                }, 700); // Match animation duration
            }

            saveGame();
        } else {
            failSound.play();
        }
        // Don't move the element, just check for combination
        return;
    }

    // Case 2: Dropping an element into the crafting area
    if (dropTargetArea) {
        // To allow multiple elements, we clone the node
        const clone = draggedEl.cloneNode(true);
        // Re-add event listeners to the clone
        clone.addEventListener('dragstart', handleDragStart);
        clone.addEventListener('dragend', handleDragEnd);
        clone.addEventListener('dragover', handleDragOver);
        clone.addEventListener('dragleave', handleDragLeave);
        clone.addEventListener('drop', handleDrop);
        craftingArea.appendChild(clone);
    }
}


// --- Button Logic ---
function clearCraftingArea() {
    // Select all elements *inside* the crafting area, but not the area itself or its header
    const elementsInCrafting = craftingArea.querySelectorAll('.element');
    elementsInCrafting.forEach(el => el.remove());
}

function showHint() {
    const hint = getHint();
    alert(hint);
}

// --- Initialization ---
async function initialize() {
    // Add event listeners
    craftingArea.addEventListener('dragover', handleDragOver);
    craftingArea.addEventListener('dragleave', handleDragLeave);
    craftingArea.addEventListener('drop', handleDrop);
    clearCraftingBtn.addEventListener('click', clearCraftingArea);
    hintBtn.addEventListener('click', showHint);

    // Load all necessary data before rendering
    await loadGameContent(); // 1. Load recipes and element data
    await loadGame();        // 2. Load player's saved progress
    renderElements();        // 3. Render the UI
}

// Start the application
initialize();
