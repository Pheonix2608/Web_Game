# Alchemical Evolution

Alchemical Evolution is a simple, local-first web game where players combine basic elements (Fire, Water, Earth, Air) to discover new ones. All discovered elements are added to a Compendium, and your progress is saved automatically to your local machine.

This project is built with vanilla JavaScript, HTML, and CSS on the frontend, and a lightweight Node.js/Express server on the backend. It's designed to be easy to set up and run without complex dependencies or build tools.

## How to Play

1.  **Start the game:** Follow the setup instructions below to run the application.
2.  **Drag and drop:** Drag one element from the "Elements" or "Compendium" sections and drop it directly onto another element.
3.  **Discover:** If the combination is valid, a new element will be discovered and added to your Compendium.
4.  **Continue:** Use your newly discovered elements to find even more combinations!

## Project Structure

The project is organized into two main parts: the frontend code in the `public` directory and the backend code in the root directory.

```
alchemical-evolution/
├── public/
│   ├── index.html      # The main game page structure
│   ├── style.css       # All styles for the game
│   └── script.js       # All game logic and interactivity
├── .gitignore          # Specifies files for Git to ignore
├── game-data.json      # Stores your saved game progress (created automatically)
├── package.json        # Project definition and dependencies
├── package-lock.json   # Exact dependency versions
└── server.js           # The backend Node.js server
```

## Setup and Installation

To run this game on your local machine, you will need to have [Node.js](https://nodejs.org/) installed.

1.  **Clone or download the project:** Get the project files onto your computer.

2.  **Navigate to the project directory:**
    ```bash
    cd alchemical-evolution
    ```

3.  **Install dependencies:**
    This command will install the two required packages: `express` and `cors`.
    ```bash
    npm install
    ```

4.  **Start the server:**
    ```bash
    node server.js
    ```
    You will see a confirmation message: `Server running on http://localhost:3000`.

5.  **Play the game:**
    Open your web browser and navigate to `http://localhost:3000`.

## Technical Architecture

### Frontend

The frontend is built with **vanilla technologies only** to avoid the need for build steps.
-   **HTML (`index.html`):** Defines the structure of the game, including the crafting area, element lists, and compendium.
-   **CSS (`style.css`):** Provides styling for the user interface, including visual feedback for dragging and dropping elements.
-   **JavaScript (`script.js`):** Contains all the client-side logic:
    -   Rendering elements on the screen.
    -   Implementing the full drag-and-drop functionality.
    -   Checking recipes for element combinations.
    -   Communicating with the backend to load and save the game state.

### Backend

The backend is a simple Node.js server using the **Express** framework.
-   **`server.js`:** The single server file that:
    -   Serves the frontend static files from the `public` directory.
    -   Provides two simple API endpoints for persistence.
-   **Dependencies:**
    -   `express`: The web server framework.
    -   `cors`: A middleware to enable Cross-Origin Resource Sharing, allowing the frontend to make requests to the backend.

### API Endpoints

-   **`GET /load`**
    -   Reads the `game-data.json` file.
    -   Returns the saved list of discovered elements as a JSON object.
    -   If the file doesn't exist, it returns an empty state for a new game.
-   **`POST /save`**
    -   Receives a JSON object from the frontend containing the list of discovered elements.
    -   Overwrites `game-data.json` with the new state.

## Potential Improvements

This game provides a solid foundation, but it could be extended with many new features. Here are a few ideas:

-   **More Content:**
    -   Add a much larger set of elements and recipes to increase discovery and playtime.
    -   Introduce multi-element combinations (e.g., three or more elements).

-   **UI/UX Enhancements:**
    -   Add animations or visual effects when a new element is discovered.
    -   Implement sound effects for discovering elements and for invalid combinations.
    -   Add a "Clear Crafting Area" button to remove all elements from the crafting space.
    -   Provide a "Hint" button that suggests a possible combination.

-   **Technical Refinements:**
    -   **Frontend Modularity:** For a larger project, split `script.js` into modules (e.g., `api.js` for server communication, `ui.js` for rendering, `game.js` for logic).
    -   **Robust Error Handling:** Add frontend notifications if the server cannot be reached, so the user knows their progress isn't being saved.
    -   **Testing:** Implement a testing framework like Jest to create unit tests for the recipe logic on the frontend and the API endpoints on the backend.

-   **Advanced Features:**
    -   **Discovery Tree:** Create a visual "tech tree" that shows how elements are connected.
    -   **Element Properties:** Give elements properties (e.g., "hot," "cold," "sharp") that could influence combinations in more complex ways.
