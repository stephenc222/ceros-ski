import { SKIER_JUMP } from "../Constants";

export class AssetManager {
    loadedAssets = [];

    constructor() {
    }

    async loadAssets(assets) {
        const assetPromises = [];

        for (const [assetName, assetUrl] of Object.entries(assets)) {
            const assetPromise = Array.isArray(assetUrl)
                ? this.loadMultipleAssets(assetUrl, assetName)
                : this.loadSingleAsset(assetUrl, assetName);
            assetPromises.push(assetPromise);
        }

        await Promise.all(assetPromises);
    }

    loadMultipleAssets(assetUrlArr, assetName) {
        Promise.all(assetUrlArr.map((assetUrl, index) => {
            return new Promise((resolve) => {
                const assetImage = new Image();
                assetImage.onload = () => {
                    assetImage.width /= 2;
                    assetImage.height /= 2;
                    if (!this.loadedAssets[assetName] || !this.loadedAssets[assetName].length) {
                        this.loadedAssets[assetName] = []
                    }
                    this.loadedAssets[assetName][index] = assetImage;
                    resolve();
                };
                assetImage.src = assetUrl;
            });
        }))
    }

    loadSingleAsset(assetUrl, assetName) {
        return new Promise((resolve) => {
            const assetImage = new Image();
            assetImage.onload = () => {
                assetImage.width /= 2;
                assetImage.height /= 2;
                this.loadedAssets[assetName] = assetImage;
                resolve();
            };
            assetImage.src = assetUrl;
        });
    }

    getAsset(assetName, frame) {
        if (frame !== null && frame !== undefined) {
            return this.loadedAssets[assetName][frame];
        }
        return this.loadedAssets[assetName];
    }
}