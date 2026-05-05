# Memory Game

A browser-based memory card game built with TypeScript, SCSS, and Vite.  
Match all card pairs before your opponent does to win!

---

## Features

- Two themes: **Code Vibes** and **Gaming**
- Two-player support (Blue vs. Orange)
- Three board sizes: 16, 24, or 36 cards
- Score tracking with live scoreboard
- Animated card flipping and match highlighting
- Fully responsive layout

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (bundled with Node.js)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/memory.git
   cd memory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production**
   ```bash
   npm run build
   ```
   The compiled output will be placed in the `dist/` folder, ready to deploy to any static hosting or FTP server.

5. **Preview the production build locally**
   ```bash
   npm run preview
   ```

---

## How to Play

### 1. Start the game

On the start screen, click the **Play** button to go to the Settings page.

### 2. Configure your settings

Choose all three options before the Start button becomes available:

| Setting | Options |
|---|---|
| **Game Theme** | Code Vibes Theme / Gaming Theme |
| **Starting Player** | Blue / Orange |
| **Board Size** | 16 cards / 24 cards / 36 cards |

Once all options are selected, click **Start** to begin.

### 3. Play

- Cards are laid face-down on the board.
- On your turn, click **two cards** to flip them.
- If they **match**, they stay face-up and you gain a point.
- If they **do not match**, they flip back after a short delay and the turn passes to the other player.
- Continue until all pairs have been found.

### 4. Winning

When the last pair is matched, the game automatically navigates to the **Game Over** screen showing the final scores, followed by the **Winner** screen declaring the winner.  
If both players have the same score, it is declared a **tie**.

### 5. Exit or restart

- During the game, click **Exit Game** (top right) to open a confirmation dialog.
- Confirm to return to the start screen, or cancel to continue playing.
- From the Winner screen, click **Back to Start** / **Home** to play again.

---

## Project Structure

```
memory/
├── index.html              # Start screen
├── src/
│   ├── html/               # Inner pages (settings, game board, game over, winner)
│   ├── scripts/            # Game logic (board, cards, score, templates)
│   ├── styles/             # SCSS (components, themes, layout)
│   └── main.ts             # Application entry point
├── public/                 # Static assets
├── vite.config.ts
└── tsconfig.json
```

---

## License

ISC
