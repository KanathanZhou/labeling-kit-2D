import {AppTool, CursorType} from "./constant";
import CircleHelper from "./circle-helper";
import * as PIXI from "pixi.js";
import {ErrorMark} from "./error-mark";

class Rect {
    app; // Yasha Application
    container = new PIXI.Container();
    graphics = new PIXI.Graphics();

    id;
    width = 0;
    height = 0;
    color = 0xFFFFFF;

    circleHelpers = [];
    hoveredCircleHelper;
    selectedCircleHelper;

    verticalResize = false;
    horizontalResize = false;

    drawAsDotted = false;

    errorMark;

    /**
     * @param app Yasha.Application
     */
    constructor(app) {
        this.app = app;
        this.app.safeArea.addChild(this.container);
        for (let i = 0; i < 8; i++) {
            const cHelper = new CircleHelper(this);
            this.circleHelpers.push(cHelper);
            this.container.addChild(cHelper.graphics);
        }
        this.container.addChild(this.graphics);
        this.errorMark = new ErrorMark(this);
    }

    hitTest(x, y) {
        const insideArea = x >= this.minX - this.hitThreshold && x <= this.maxX + this.hitThreshold && y >= this.minY - this.hitThreshold && y <= this.maxY + this.hitThreshold;
        const insideTop = y >= this.minY - this.hitThreshold && y <= this.minY + this.hitThreshold;
        const insideBottom = y >= this.maxY - this.hitThreshold && y <= this.maxY + this.hitThreshold;
        const insideLeft = x >= this.minX - this.hitThreshold && x <= this.minX + this.hitThreshold;
        const insideRight = x >= this.maxX - this.hitThreshold && x <= this.maxX + this.hitThreshold;
        return insideArea && (insideTop || insideBottom || insideLeft || insideRight);
    }

    move(x, y) {
        this.x += x;
        this.y += y;
        if (this.minX < 0) {
            this.minX = 0;
        }
        if (this.maxX > this.app.safeAreaRight) {
            this.maxX = this.app.safeAreaRight;
        }
        if (this.minY < 0) {
            this.minY = 0;
        }
        if (this.maxY > this.app.safeAreaBottom) {
            this.maxY = this.app.safeAreaBottom;
        }
    }

    redrawAsDotted() {
        const startX = this.width > 0 ? 0 : this.width;
        const endX = this.width > 0 ? this.width : 0;
        const startY = this.height > 0 ? 0 : this.height;
        const endY = this.height > 0 ? this.height : 0;

        let dotX = startX;
        while (dotX < endX) {
            const dotLineX = dotX + 4; // + 4 is the dot line width
            this.graphics.moveTo(dotX, startY);
            if (dotLineX > endX) {
                this.graphics.lineTo(endX, startY);
            } else {
                this.graphics.lineTo(dotLineX, startY);
            }
            this.graphics.moveTo(dotX, endY);
            if (dotLineX > endX) {
                this.graphics.lineTo(endX, endY);
            } else {
                this.graphics.lineTo(dotLineX, endY);
            }
            dotX  = dotLineX + 4; // + 4 is the gap
        }

        let dotY = startY;
        while (dotY < endY) {
            const dotLineY = dotY + 4; // + 4 is the dot line height
            this.graphics.moveTo(startX, dotY);
            if (dotLineY > endY) {
                this.graphics.lineTo(startX, endY);
            } else {
                this.graphics.lineTo(startX, dotLineY);
            }
            this.graphics.moveTo(endX, dotY);
            if (dotLineY > endY) {
                this.graphics.lineTo(endX, endY);
            } else {
                this.graphics.lineTo(endX, dotLineY);
            }
            dotY = dotLineY + 4; // + 4 is the gap
        }
    }

    redraw() {
        this.errorMark.reload();
        this.redrawCircleHelpers();
        this.graphics.clear();
        this.graphics.beginFill(this.color, 0.1);
        this.graphics.lineStyle({ width: this.lineStyleWidth, color: this.color, alpha: 1 });
        if (this.drawAsDotted) {
            this.redrawAsDotted();
        } else {
            this.graphics.drawRect(0, 0, this.width, this.height); // the position is always 0 since the graphics is being added to a container, the position is relative to the container
        }
        this.graphics.endFill();
    }

    redrawCircleHelpers() {
        for (let i = 0; i < this.circleHelpers.length; i++) {
            const cHelper = this.circleHelpers[i];
            cHelper.clear();
            if (this.app.hoveredShape === this) {
                const rawArea = this.width * this.height; // can be negative
                if (i === 0) {
                    cHelper.cursorType = rawArea > 0 ? CursorType.nwseResize : CursorType.neswResize;
                    cHelper.set(0, 0);
                } else if (i === 1) {
                    cHelper.cursorType = rawArea > 0 ? CursorType.nwseResize : CursorType.neswResize;
                    cHelper.set(this.width, this.height);
                } else if (i === 2) {
                    cHelper.cursorType = rawArea > 0 ? CursorType.neswResize : CursorType.nwseResize;
                    cHelper.set(this.width, 0);
                } else if (i === 3) {
                    cHelper.cursorType = rawArea > 0 ? CursorType.neswResize : CursorType.nwseResize;
                    cHelper.set(0, this.height);
                } else if (i === 4) {
                    cHelper.cursorType = CursorType.nsResize;
                    cHelper.set(this.width / 2, 0);
                } else if (i === 5) {
                    cHelper.cursorType = CursorType.nsResize;
                    cHelper.set(this.width / 2, this.height);
                } else if (i === 6) {
                    cHelper.cursorType = CursorType.ewResize;
                    cHelper.set(this.width, this.height / 2);
                } else if (i === 7) {
                    cHelper.cursorType = CursorType.ewResize;
                    cHelper.set(0, this.height / 2);
                }
                cHelper.redraw();
            }
        }
    }

    hoverTestCircleHelpers() {
        this.hoveredCircleHelper = undefined;
        for (const cHelper of this.circleHelpers) {
            if (cHelper.hitTest(this.localCoordinate.x, this.localCoordinate.y)) {
                this.app.setCursor(cHelper.cursorType);
                this.hoveredCircleHelper = cHelper;
                return true;
            }
        }
        return false;
    }

    hitTestCircleHelpers() {
        if (this.hoveredCircleHelper) {
            this.selectedCircleHelper = this.hoveredCircleHelper;
            if (this.selectedCircleHelper.x === 0) {
                this.x = this.x === this.minX ? this.maxX : this.minX;
                this.width *= -1;
            }
            if (this.selectedCircleHelper.y === 0) {
                this.y = this.y === this.minY ? this.maxY : this.minY;
                this.height *= -1;
            }
            this.redraw();
            this.verticalResize = this.selectedCircleHelper.x === this.width / 2;
            this.horizontalResize = this.selectedCircleHelper.y === this.height / 2;
            return true;
        }
        return false;
    }

    get type() {
        return AppTool.rect;
    }

    set isErrorMarkHidden(hidden) {
        this.errorMark.isHidden = hidden;
    }

    get isErrorMarkHidden() {
        return this.errorMark.isHidden;
    }

    get localCoordinate() {
        return this.container.toLocal(this.app.localCoordinate, this.app.safeArea);
    }

    get area() {
        return Math.abs(this.width * this.height);
    }

    setColor(color) {
        this.color = color;
        this.redraw();
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    set x(x) {
        this.container.x = x;
    }

    get x() {
        return this.container.x;
    }

    set y(y) {
        this.container.y = y;
    }

    get y() {
        return this.container.y;
    }

    get bounds() {
        const minX = this.width > 0 ? this.x : this.x + this.width;
        const minY = this.height > 0 ? this.y : this.y + this.height;
        return {
            left: minX,
            top: minY,
            right: minX + Math.abs(this.width),
            bottom: minY + Math.abs(this.height)
        };
    }

    set minX(x) {
        if (this.width > 0) {
            this.x = x;
        } else {
            this.x = x + Math.abs(this.width);
        }
    }

    set minY(y) {
        if (this.height > 0) {
            this.y = y;
        } else {
            this.y = y + Math.abs(this.height);
        }
    }

    set maxX(x) {
        if (this.width > 0) {
            this.x = x - Math.abs(this.width);
        } else {
            this.x = x;
        }
    }

    set maxY(y) {
        if (this.height > 0) {
            this.y = y - Math.abs(this.height);
        } else {
            this.y = y;
        }
    }

    get minX() {
        return this.bounds.left;
    }

    get minY() {
        return this.bounds.top;
    }

    get maxX() {
        return this.bounds.right;
    }

    get maxY() {
        return this.bounds.bottom;
    }

    get globalX() {
        return this.graphics.getGlobalPosition().x;
    }

    get globalY() {
        return this.graphics.getGlobalPosition().y;
    }

    get globalWidth() {
        return this.width * this.app.safeAreaScale;
    }

    get globalHeight() {
        return this.height * this.app.safeAreaScale;
    }

    get lineStyleWidth() {
        return 1 / this.app.safeAreaScale;
    }

    get hitThreshold() {
        return 4 / this.app.safeAreaScale;
    }

    get globalMinX() {
        return this.globalWidth > 0 ? this.globalX : this.globalX + this.globalWidth;
    }

    get globalMinY() {
        return this.globalHeight > 0 ? this.globalY : this.globalY + this.globalHeight;
    }

    get globalMaxX() {
        return this.globalWidth > 0 ? this.globalX + this.globalWidth : this.globalX;
    }

    get globalMaxY() {
        return this.globalHeight > 0 ? this.globalY + this.globalHeight : this.globalY;
    }

}
export { Rect };