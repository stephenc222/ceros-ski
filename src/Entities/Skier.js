import * as Constants from "../Constants";
import { Entity } from "./Entity";
import { intersectTwoRects, Rect } from "../Core/Utils";

export class Skier extends Entity {
    assetName = Constants.SKIER_DOWN;

    direction = Constants.SKIER_DIRECTIONS.DOWN;
    prevDirection = null
    speed = Constants.SKIER_STARTING_SPEED;

    constructor(x, y) {
        super(x, y);
        this.hasHit = false
        this.isJumping = false
        this.jumpAnimationFrame = 0
    }

    setDirection(direction) {
        this.direction = direction;
        this.updateAsset();
    }

    updateAsset() {
        this.assetName = Constants.SKIER_DIRECTION_ASSET[this.direction];
    }

    move() {
        switch (this.direction) {
            case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                this.moveSkierLeftDown();
                break;
            case Constants.SKIER_DIRECTIONS.DOWN:
                this.moveSkierDown();
                break;
            case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                this.moveSkierRightDown();
                break;
            case Constants.SKIER_DIRECTIONS.JUMP:
                switch (this.prevDirection) {
                    case Constants.SKIER_DIRECTIONS.LEFT_DOWN:
                        this.moveSkierLeftDown();
                        break;
                    case Constants.SKIER_DIRECTIONS.DOWN:
                        this.moveSkierDown();
                        break;
                    case Constants.SKIER_DIRECTIONS.RIGHT_DOWN:
                        this.moveSkierRightDown();
                        break;
                }
                break
        }
    }

    moveSkierLeft() {
        this.x -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierLeftDown() {
        this.x -= this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierDown() {
        this.y += this.speed;
    }

    moveSkierRightDown() {
        this.x += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
        this.y += this.speed / Constants.SKIER_DIAGONAL_SPEED_REDUCER;
    }

    moveSkierRight() {
        this.x += Constants.SKIER_STARTING_SPEED;
    }

    moveSkierUp() {
        this.y -= Constants.SKIER_STARTING_SPEED;
    }

    moveSkierJump() {
        this.isJumping = true
        this.prevDirection = this.direction
        this.setDirection(Constants.SKIER_DIRECTIONS.JUMP);
    }

    turnLeft() {
        this.isJumping = false
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            this.x -= 50
            this.hasHit = false
            this.setDirection(Constants.SKIER_DIRECTIONS.LEFT);
        }
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT) {
            this.moveSkierLeft();
        }
        else {
            this.setDirection(this.direction - 1);
        }
    }

    turnRight() {
        this.isJumping = false
        if (this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierRight();
        }
        else {
            this.setDirection(this.direction + 1);
        }
    }

    turnUp() {
        this.isJumping = false
        if (this.direction === Constants.SKIER_DIRECTIONS.LEFT || this.direction === Constants.SKIER_DIRECTIONS.RIGHT) {
            this.moveSkierUp();
        }
    }

    turnJump() {
        this.isJumping = true
        this.prevDirection = this.direction
        this.setDirection(Constants.SKIER_DIRECTIONS.JUMP);
    }
    turnDown() {
        this.isJumping = false
        this.setDirection(Constants.SKIER_DIRECTIONS.DOWN);
    }

    checkIfSkierHitObstacle(obstacleManager, assetManager) {
        if (this.direction === Constants.SKIER_DIRECTIONS.CRASH) {
            return
        }
        const asset = assetManager.getAsset(this.assetName);
        const skierBounds = new Rect(
            this.x - asset.width / 2,
            this.y - asset.height / 2,
            this.x + asset.width / 2,
            this.y - asset.height / 4
        );

        const collision = obstacleManager.getObstacles().find((obstacle) => {
            const obstacleAsset = assetManager.getAsset(obstacle.getAssetName());
            const obstaclePosition = obstacle.getPosition();
            const obstacleBounds = new Rect(
                obstaclePosition.x - obstacleAsset.width / 2,
                obstaclePosition.y - obstacleAsset.height / 2,
                obstaclePosition.x + obstacleAsset.width / 2,
                obstaclePosition.y
            );

            return intersectTwoRects(skierBounds, obstacleBounds);
        });
        // TODO: here check if is jumping and if collision is rock then no crash
        if (collision && !this.isJumping) {
            this.setDirection(Constants.SKIER_DIRECTIONS.CRASH);
        }
    };
}