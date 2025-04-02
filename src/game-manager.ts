import Component from './components/component';
import BackgroundLayer from './layers/background-layer';
import { GameState, GameStates } from '../types/game-manager';

export default class GameManager extends Component {
  gameState: GameState;
  readonly gameStates: GameStates = {
    MainMenu: 'main-menu',
    InGame: 'in-game',
  };

  private stateChanged: boolean = true;
  private readonly backgroundLayer: BackgroundLayer;

  constructor(backgroundLayer: BackgroundLayer) {
    super('GAME_MANAGER');
    this.gameState = this.gameStates.MainMenu;

    this.backgroundLayer = backgroundLayer;

    this.renderAll();
  }

  update(elapsed: number) {
    super.update(elapsed);
    this.onGameStateChange();
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
      this.backgroundLayer.loadGame();
    }

    this.stateChanged = false;
  }
}
