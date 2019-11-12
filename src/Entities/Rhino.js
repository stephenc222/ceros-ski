
import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { Rect, intersectTwoRects } from '../Core/Utils';

export class Rhino extends Entity {
  constructor(x, y) {
    super(x, y);
    this.assetName = Constants.RHINO
    this.eatAnimation = 0
    this.isEatingSkier = false
  }

  setDirection(direction) {
    this.direction = direction;
    this.updateAsset();
  }

  updateAsset() {
    this.assetName = Constants.RHINO_EAT;
  }

  checkIfHitSkier(skier, assetManager) {
    const rhinoAsset = assetManager.getAsset(this.assetName);
    const skierAsset = assetManager.getAsset(skier.assetName);
    const rhinoBounds = new Rect(
      this.x - rhinoAsset.width / 2,
      this.y - rhinoAsset.height / 2,
      this.x + rhinoAsset.width / 2,
      this.y - rhinoAsset.height / 4
    );
    const skierBounds = new Rect(
      skier.x - skierAsset.width / 2,
      skier.y - skierAsset.height / 2,
      skier.x + skierAsset.width / 2,
      skier.y - skierAsset.height / 4
    );
    if (intersectTwoRects(skierBounds, rhinoBounds)) {
      this.isEatingSkier = true
      this.updateAsset()
      return
    }
  }
}