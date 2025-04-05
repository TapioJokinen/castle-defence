import BackgroundLayer from '../layers/background-layer';
import Route from '../components/route';
import Vector2 from '../vector2';
import { EASY_PATH } from './paths';

export default class MapManager {
  private readonly backgroundLayer: BackgroundLayer;

  constructor(backgroundLayer: BackgroundLayer) {
    this.backgroundLayer = backgroundLayer;
  }

  loadMap(mapId: number) {
    switch (mapId) {
      case 1:
        this.loadEasyMap();
        break;
    }
  }

  loadEasyMap() {
    const ctx = this.backgroundLayer.getContext();
    if (!ctx) return;

    const route = new Route('R_EASY', ctx, EASY_PATH, 50);
    this.backgroundLayer.components.push(route);
  }
}
