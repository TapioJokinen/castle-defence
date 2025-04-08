import Component from './components/component';
import BackgroundLayer from './layers/background-layer';
import { GameState, GameStates } from '../types/game-manager';
import WaveManager from './waves/wave-manager';

export default class GameManager extends Component {
  /**
   * Current game state
   */
  gameState: GameState;
  /**
   * Enum of game states
   */
  readonly gameStates: GameStates = {
    MainMenu: 'main-menu',
    InGame: 'in-game',
  };
  /**
   * Wave manager for handling wave events
   */
  readonly waveManager: WaveManager;
  /**
   * If true, we need to run onGameStateChange
   * @private
   */
  private stateChanged: boolean = true;
  /**
   * Reference to background layer manager
   * @private
   */
  private readonly backgroundLayer: BackgroundLayer;

  constructor(backgroundLayer: BackgroundLayer) {
    super('GAME_MANAGER');
    this.waveManager = new WaveManager(this);

    this.gameState = this.gameStates.MainMenu;

    this.backgroundLayer = backgroundLayer;
    this.backgroundLayer.setGameManager(this);

    this.renderAll();
  }

  update(elapsed: number) {
    super.update(elapsed);
    this.onGameStateChange();

    this.waveManager.reduceWaveIdleTimer(elapsed);

    this.backgroundLayer.update(elapsed);
  }

  /**
   * Change game state
   * @param state
   * @private
   */
  changeState(state: GameState) {
    this.gameState = state;
    this.stateChanged = true;
    document.body.style.cursor = 'default';
  }

  /**
   * Render all components from each layer
   * @private
   */
  private renderAll() {
    this.backgroundLayer.render = true;
  }

  /**
   * Handle actions when game state changes
   * @private
   */
  private onGameStateChange() {
    if (!this.stateChanged) return;

    if (this.gameState === this.gameStates.MainMenu) {
      this.backgroundLayer.loadMainMenu();
    } else if (this.gameState === this.gameStates.InGame) {
      this.initializeGame();
    }

    this.stateChanged = false;
  }

  /**
   * Initialize game
   * @private
   */
  private initializeGame() {
    this.waveManager.setWaveIdleTimer(30);
    this.backgroundLayer.loadGame();
  }
}
