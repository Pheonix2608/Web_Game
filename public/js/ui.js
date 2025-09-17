import { gameState, checkForCombination, addDiscoveredElement } from './game.js';
import { loadGame, saveGame } from './api.js';

// --- DOM Elements ---
const elementsContainer = document.getElementById('elements-container');
const compendiumContainer = document.getElementById('compendium-container');
const craftingArea = document.getElementById('crafting-area');
const clearCraftingBtn = document.getElementById('clear-crafting-btn');

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

// --- Initialization ---
async function initialize() {
    craftingArea.addEventListener('dragover', handleDragOver);
    craftingArea.addEventListener('dragleave', handleDragLeave);
    craftingArea.addEventListener('drop', handleDrop);
    clearCraftingBtn.addEventListener('click', clearCraftingArea);

    await loadGame();
    renderElements();
}

// Start the application
initialize();
