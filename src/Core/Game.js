import * as Constants from "../Constants";
import { AssetManager } from "./AssetManager";
import { Canvas } from './Canvas';
import { Skier } from "../Entities/Skier";
import { ObstacleManager } from "../Entities/Obstacles/ObstacleManager";
import { Rect } from './Utils';

const NUM_JUMP_FRAMES = 5
let JUMP_FRAME_TICK = 0

export class Game {
    gameWindow = null;

    constructor() {
        this.assetManager = new AssetManager();
        this.canvas = new Canvas(Constants.GAME_WIDTH, Constants.GAME_HEIGHT);
        this.skier = new Skier(0, 0);
        this.obstacleManager = new ObstacleManager();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    init() {
        this.obstacleManager.placeInitialObstacles();
    }

    async load() {
        await this.assetManager.loadAssets(Constants.ASSETS);
    }

    run() {
        this.canvas.clearCanvas();

        this.updateGameWindow();
        this.drawGameWindow();

        requestAnimationFrame(this.run.bind(this));
    }

    updateGameWindow() {
        // if is jumping, then y+= something
        // but disallow move to prevent jump animation
        this.skier.move();

        const previousGameWindow = this.gameWindow;
        this.calculateGameWindow();

        this.obstacleManager.placeNewObstacle(this.gameWindow, previousGameWindow);

        if (!this.skier.hasHit) {
            this.skier.checkIfSkierHitObstacle(this.obstacleManager, this.assetManager);
        }
    }

    drawGameWindow() {
        this.canvas.setDrawOffset(this.gameWindow.left, this.gameWindow.top);

        if (this.skier.isJumping) {
            // console.log('draw jump', { isJumping: this.skier.isJumping })
            if (this.skier.jumpAnimationFrame <= NUM_JUMP_FRAMES) {
                // hopefully means 1 draw per 60 frames...
                if (JUMP_FRAME_TICK % 7 === 0) {
                    ++this.skier.jumpAnimationFrame
                } else {
                    this.skier.draw(this.canvas, this.assetManager, this.skier.jumpAnimationFrame);
                }
                JUMP_FRAME_TICK += 1
            } else {
                this.skier.isJumping = false
                this.skier.jumpAnimationFrame = 0
                JUMP_FRAME_TICK = 0
            }
        } else {
            this.skier.draw(this.canvas, this.assetManager);
        }
        this.obstacleManager.drawObstacles(this.canvas, this.assetManager);
    }

    calculateGameWindow() {
        const skierPosition = this.skier.getPosition();
        const left = skierPosition.x - (Constants.GAME_WIDTH / 2);
        const top = skierPosition.y - (Constants.GAME_HEIGHT / 2);

        this.gameWindow = new Rect(left, top, left + Constants.GAME_WIDTH, top + Constants.GAME_HEIGHT);
    }

    handleKeyDown(event) {
        switch (event.which) {
            case Constants.KEYS.LEFT:
                this.skier.turnLeft();
                event.preventDefault();
                break;
            case Constants.KEYS.RIGHT:
                this.skier.turnRight();
                event.preventDefault();
                break;
            case Constants.KEYS.UP:
                this.skier.turnUp();
                event.preventDefault();
                break;
            case Constants.KEYS.DOWN:
                this.skier.turnDown();
                event.preventDefault();
                break;
            case Constants.KEYS.SPACE:
                this.skier.turnJump();
                event.preventDefault();
                break;
        }
    }
}