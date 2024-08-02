import * as PIXI from "pixi.js";
import {ERROR_MARK_BASE64_DATA} from "./constant";

class ErrorMark {
    shape; // A Yasha Shape
    terrain;

    constructor(shape) {
        this.shape = shape;
        const svgResource = new PIXI.SVGResource(ERROR_MARK_BASE64_DATA);
        const texture  = PIXI.Texture.from(svgResource);
        this.terrain = new PIXI.Sprite(texture);
        this.isHidden = true;
        this.shape.container.addChild(this.terrain);
    }

    reload() {
        this.terrain.scale.set(this.scale);
    }

    set isHidden(hidden) {
        if (hidden) {
            this.terrain.alpha = 0;
        } else {
            const x = this.shape.width > 0 ? 0 : this.shape.width;
            const y = this.shape.height > 0 ? 0 : this.shape.height;
            this.terrain.position.set(x, y); // update position
            this.terrain.alpha = 1;
        }
    }

    get isHidden() {
        return this.terrain.alpha === 0;
    }

    get scale() {
        return 1 / this.shape.app.safeAreaScale;
    }
}
export { ErrorMark };