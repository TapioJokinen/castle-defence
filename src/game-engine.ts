import { GameEngineConfiguration } from '../types/game-engine';
import DomUtils from './dom-utils';
import BackgroundLayer from './layers/background-layer';
import Component from './components/component';

export default class GameEngine {
  /**
   * Global game engine instance
   */
  static instance: GameEngine;
  /**
   * Manager for the background canvas
   */
  backgroundLayer: BackgroundLayer | undefined;
  /**
   * Game canvas width
   * @private
   */
  public width: number = 0;
  /**
   * Game canvas height
   * @private
   */
  public height: number = 0;
  /**
   * Timestamp returned by the requestAnimationFrame()
   * @private
   */
  private lastTime: number | undefined;
  /**
   * Contains configuration data of the layers
   * @private
   */
  private layerConf = {
    Background: { id: 'background-layer', index: '10' },
    Game: { id: 'game-layer', index: '20' },
    UI: { id: 'ui-layer', index: '30' },
  };
  /**
   * Current FPS
   * @private
   */
  private fps: number = 0;
  /**
   * Collect count of frames during 1s
   * @private
   */
  private frames: number = 0;
  /**
   * Timestamp for updating fps counter once every second
   * @private
   */
  private lastFpsUpdate: number | undefined;
  /**
   * List of components attached directly to game engine
   * @private
   */
  private components: Component[] = [];

  constructor() {
    GameEngine.instance = this;
  }

  /**
   * Load game engine configuration
   * @param conf
   */
  loadConfiguration(conf: GameEngineConfiguration) {
    this.width = conf.width;
    this.height = conf.height;
  }

  /**
   * Start the game
   */
  start() {
    this.initializeGameElements();
    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Get game stage element
   */
  getStage() {
    return document.getElementById('game-stage');
  }

  /**
   * Add component
   * @param component
   */
  addComponent(component: Component) {
    this.components.push(component);
  }

  /**
   * Find a first component with given tag
   * @param tag
   */
  findComponentByTag<T>(tag: string) {
    let component = this.components.find((c) => c.tag === tag);

    if (!component)
      component = this.backgroundLayer?.components.find((c) => c.tag === tag);

    return (component as T) || null;
  }

  /**
   * Create stage element
   * @private
   */
  private createStage() {
    const stage = DomUtils.createDiv('game-stage', 'stage', {
      width: `${this.width}px`,
      height: `${this.height}px`,
    });
    return stage;
  }

  /**
   * Create a layer element
   * @param id
   * @param zIndex
   * @private
   */
  private createLayer(id: string, zIndex: string) {
    const layer = DomUtils.createCanvas(
      id,
      this.width,
      this.height,
      zIndex,
      'layer'
    );
    return layer;
  }

  /**
   * Initialize game elements like canvases and the game stage
   * @private
   */
  private initializeGameElements() {
    const stage = this.createStage();
    const backgroundLayer = this.createLayer(
      this.layerConf.Background.id,
      this.layerConf.Background.index
    );
    const gameLayer = this.createLayer(
      this.layerConf.Game.id,
      this.layerConf.Game.index
    );
    const uiLayer = this.createLayer(
      this.layerConf.UI.id,
      this.layerConf.UI.index
    );
    stage.append(backgroundLayer, gameLayer, uiLayer);
    document.getElementById('stage-container')?.appendChild(stage);

    this.backgroundLayer = new BackgroundLayer(backgroundLayer);
  }

  /**
   * Game loop function that calls update on all components
   * @param timeStamp
   * @private
   */
  private loop(timeStamp: number) {
    if (!this.lastTime) {
      this.lastTime = timeStamp;
    }

    if (!this.lastFpsUpdate) {
      this.lastFpsUpdate = timeStamp;
    }

    const elapsed = (timeStamp - this.lastTime) / 1000;
    this.lastTime = timeStamp;
    this.frames += 1;

    if (timeStamp - this.lastFpsUpdate >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastFpsUpdate = timeStamp;
      const fpsElement = document.getElementById('fps');
      if (fpsElement) {
        fpsElement.textContent = `FPS: ${this.fps.toString()} (max FPS is monitor's refresh rate)`;
      }
    }

    this.update(elapsed);

    requestAnimationFrame(this.loop.bind(this));
  }

  /**
   * Call update on all components
   * @param elapsed
   * @private
   */
  private update(elapsed: number) {
    this.components.forEach((c) => c.update(elapsed));
  }
}
