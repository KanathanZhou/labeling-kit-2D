import {CursorType} from "./constant";
import * as PIXI from "pixi.js";

class CircleHelper {
    shape; // A Yasha Shape

    graphics = new PIXI.Graphics();
    cursorType = CursorType.default;

    constructor(shape) {
        this.shape = shape;
    }

    hitTest(x, y) {
        return (x >= this.graphics.x - this.graphics.width / 2)
            && (x <= this.graphics.x + this.graphics.width / 2)
            && (y >= this.graphics.y - this.graphics.height / 2)
            && (y <= this.graphics.y + this.graphics.height / 2);
    }

    redraw() {
        this.graphics.lineStyle(this.lineStyleWidth, 0x1a73e8);
        this.graphics.beginFill(0xFFFFFF, 0.3);
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();
    }

    set(x, y) {
        this.graphics.position.set(x, y);
    }

    clear() {
        this.graphics.clear();
    }

    set x(x) {
        this.graphics.x = x;
    }

    get x() {
        return this.graphics.x;
    }

    set y(y) {
        this.graphics.y = y;
    }

    get y() {
        return this.graphics.y;
    }

    get lineStyleWidth() {
        return 1 / this.shape.app.safeAreaScale;
    }

    get size() {
        return 4 / this.shape.app.safeAreaScale;
    }
}
export default CircleHelper;