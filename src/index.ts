import '../css/index.css';
import GameEngine from './game-engine';
import { GAME_ENGINE_CONF } from './conf/game-engine';
import GameManager from './game-manager';

const gameEngine = new GameEngine();
gameEngine.loadConfiguration(GAME_ENGINE_CONF);
gameEngine.start();

// Add game manager after we have started so all the required
// components are already loaded.
if (gameEngine.backgroundLayer) {
  const gameManager = new GameManager(gameEngine.backgroundLayer);
  gameEngine.components.set(gameManager.tag, gameManager);
}
