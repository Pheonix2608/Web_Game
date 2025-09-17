const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'game-data.json');

// Middleware
app.use(cors()); // Allow requests from the frontend
app.use(express.json({ limit: '1mb' })); // To parse JSON request bodies
app.use(express.static('public')); // Serve static files from the 'public' directory

// --- API Endpoints ---

// GET /load: Reads and returns the saved game state.
app.get('/load', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      // If the file doesn't exist (e.g., first time playing),
      // return a default empty state.
      if (err.code === 'ENOENT') {
        return res.json({ discovered: [] });
      }
      // For other errors, send a server error response.
      console.error('Error reading data file:', err);
      return res.status(500).json({ message: 'Error loading game data.' });
    }
    // If the file exists, parse and send its content.
    try {
        res.json(JSON.parse(data));
    } catch (parseErr) {
        console.error('Error parsing data file:', parseErr);
        return res.status(500).json({ message: 'Error parsing game data.' });
    }
  });
});

// POST /save: Receives game state from the frontend and saves it.
app.post('/save', (req, res) => {
  const gameState = req.body;

  // Validate that we received an object with a 'discovered' property
  if (!gameState || !Array.isArray(gameState.discovered)) {
      return res.status(400).json({ message: 'Invalid game state format.' });
  }

  // Write the new game state to the JSON file, overwriting the previous content.
  fs.writeFile(DATA_FILE, JSON.stringify(gameState, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing data file:', err);
      return res.status(500).json({ message: 'Error saving game data.' });
    }
    res.json({ message: 'Game saved successfully!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
