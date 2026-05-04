import {defineConfig} from 'vite'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    base:"/Memory/",
    
    build: {
    rollupOptions: {
      input: {
        // Hauptseite
        main: resolve(__dirname, 'index.html'),
        // Hier fügst du deine HTML-Dateien aus dem Unterordner hinzu
        settings: resolve(__dirname, 'src/html/settings.html'),
        game_board: resolve(__dirname, 'src/html/game_board.html'),
        game_over: resolve(__dirname, 'src/html/game_over.html'),
        winner: resolve(__dirname, 'src/html/winner.html'),
      },
    },
  },
});