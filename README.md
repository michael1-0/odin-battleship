# odin-battleship

This is a project submission for The Odin Project Javascript Course Testing Javascript, Project: File Uploader.

This project is a single-player Battleship game where you compete against a computer opponent. The game features ship placement with preview highlighting, turn-based combat, and visual feedback for hits and misses.

Live: [https://michael1-0.github.io/odin-battleship/](https://michael1-0.github.io/odin-battleship/)

## Features

- **Interactive Ship Placement**: Click to place ships on your board with visual preview
- **Rotation Support**: Rotate ships between horizontal and vertical orientation
- **Random Placement**: Automatically place all ships randomly
- **Visual Feedback**: Clear indicators for hits (💥), misses (💦), and sunk ships (💀)
- **Computer AI**: Play against a computer opponent with random targeting
- **Responsive Design**: Works on various screen sizes

## Built With

- **JavaScript (ES6+)** - Core game logic with classes
- **Webpack** - Module bundling and development server
- **Jest** - Unit testing framework
- **Babel** - JavaScript transpilation
- **ESLint & Prettier** - Code linting and formatting

## Project Structure

```
src/
├── index.js              # Entry point
├── styles.css            # Game styles
├── template.html         # HTML template
├── class/
│   ├── Ship.js           # Ship class with hit tracking
│   ├── Gameboard.js      # Board logic and attack handling
│   ├── Player.js         # Player and computer logic
│   ├── GameController.js # Main game state management
│   └── DOMController.js  # UI rendering and events
└── test/
    ├── Ship.test.js      # Ship unit tests
    ├── Gameboard.test.js # Gameboard unit tests
    └── Player.test.js    # Player unit tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/odin-battleship.git
   cd odin-battleship
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## How to Play

1. **Setup Phase**:

   - Click on your board to place ships
   - Use the **Rotate** button to change ship orientation
   - Use **Random** to auto-place all ships
   - Click **Start Battle** when all ships are placed

2. **Battle Phase**:

   - Click on the enemy board to attack
   - 💥 indicates a hit
   - 💦 indicates a miss
   - 💀 indicates a sunk ship
   - The computer will automatically attack after your turn

3. **Victory**: Sink all enemy ships before they sink yours!

## Testing

The project includes comprehensive unit tests for the core game logic:

```bash
npm test
```

Tests cover:

- Ship creation and hit mechanics
- Gameboard ship placement and attack handling
- Player shot tracking and computer AI
