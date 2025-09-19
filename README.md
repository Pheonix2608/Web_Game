# Alchemical Evolution

Welcome to Alchemical Evolution! This is a web-based crafting game where you start with the four basic elements—Fire, Water, Earth, and Air—and combine them to discover over 100 new and exciting items. From simple concepts like Steam and Mud to complex creations like Computers and Space Rockets, your goal is to unlock every possible combination.

This project is built with vanilla JavaScript, HTML, and CSS on the frontend, and a lightweight Node.js/Express server on the backend. It's designed to be simple, local-first, and easily extensible.

![Gameplay Screenshot](https://user-images.githubusercontent.com/12345/67890.png) <!-- Placeholder image -->

## Features

-   **Expansive Library:** Discover over 100 unique elements, each with its own icon.
-   **Dynamic Crafting:** Drag elements into the crafting area. When you combine them, the new element appears right there, ready to be used in your next creation.
-   **Smart Compendium:** The game tracks your progress. Once you've found every possible combination for an element, it becomes "exhausted" and can no longer be used for crafting, keeping your workspace clean.
-   **Image Placeholders:** Each element has a unique icon. If an image is missing, a stylish placeholder with the element's initials is shown instead.
-   **Automatic Saving:** Your progress is saved automatically to your local machine, so you can pick up where you left off.
-   **Clear & Hint:** A "Clear" button helps you tidy up the crafting area, and a "Hint" button can give you a nudge in the right direction.

## How to Play

1.  **Start the game:** Follow the setup instructions below to run the application.
2.  **Drag Elements:** Drag elements from the "Elements" or "Compendium" lists into the "Crafting Area."
3.  **Combine:** To combine, drag one element directly on top of another. The newly created element will appear in the crafting area.
4.  **Keep Crafting:** Use your newly discovered elements to find even more combinations! The source elements remain in the crafting area until you drag them out or press "Clear."
5.  **Remove Elements:** To remove a single element from the crafting area, simply drag it outside of the crafting box and release.

## Full Combination List

For a complete guide to every possible combination in the game, please see the [**Combination List**](./list.md).

## Customizing Elements

You can easily add your own images for the elements!

1.  Create a `.png` image for your element.
2.  Name the image file after the element's **ID** (e.g., `steam.png`, `light_bulb.png`). You can find the IDs in the `list.md` file.
3.  Place the image file inside the `public/images` directory.

The game will automatically pick up the new image the next time you load it.

## Project Structure

The project is organized with a simple and clear structure:

```
alchemical-evolution/
├── public/
│   ├── images/         # Element images (e.g., fire.png)
│   ├── js/             # Frontend JavaScript (api.js, game.js, ui.js)
│   ├── index.html      # Main game page structure
│   ├── style.css       # All styles for the game
│   └── game-content.json # All element and recipe data
├── list.md             # A complete guide to all combinations
├── game-data.json      # Stores your saved game progress
├── package.json        # Project definition and dependencies
└── server.js           # The backend Node.js server
```

## Setup and Installation

To run this game on your local machine, you will need to have [Node.js](https://nodejs.org/) installed.

1.  **Clone the project:**
    ```bash
    git clone <repository-url>
    cd alchemical-evolution
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    node server.js
    ```
    You will see a confirmation message: `Server running on http://localhost:3000`.

4.  **Play the game:**
    Open your web browser and navigate to `http://localhost:3000`.
