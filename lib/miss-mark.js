import * as PIXI from 'pixi.js';
import { AppTool, MISS_MARK_BASE64_DATA } from './constant';

const MM_WIDTH = 24;
const MM_HEIGHT = 24;

class MissMark {
  app; // Yasha Application
  container = new PIXI.Container();
  terrain;

  id;

  constructor(app, x = 0, y = 0, usingCursorPosition = false) {
    this.app = app;
    this.app.safeArea.addChild(this.container);

    const svgResource = new PIXI.SVGResource(MISS_MARK_BASE64_DATA);
    const texture = PIXI.Texture.from(svgResource);
    this.terrain = new PIXI.Sprite(texture);
    this.container.addChild(this.terrain);

    this.container.scale.set(1 / this.app.safeAreaScale);

    if (usingCursorPosition) {
      this.container.position.set(x - this.width / 2, y - this.height);
    } else {
      this.container.position.set(x, y);
    }
  }

  hitTest(x, y) {
    return (x >= this.minX)
        && (x <= this.maxX)
        && (y >= this.minY)
        && (y <= this.maxY);
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  redraw() {
    this.container.scale.set(this.scale);
  }

  hoverTestCircleHelpers() {
    // miss mark doesn't have any circle helpers
    return false;
  }

  hitTestCircleHelpers() {
    // miss mark doesn't have any circle helpers
    return false;
  }

  get width() {
    return MM_WIDTH / this.app.safeAreaScale;
  }

  get height() {
    return MM_HEIGHT / this.app.safeAreaScale;
  }

  get scale() {
    return 1 / this.app.safeAreaScale;
  }

  get type() {
    return AppTool.missMark;
  }

  get area() {
    return this.width * this.height;
  }

  set(x, y) {
    this.container.position.set(x, y);
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

  get minX() {
    return this.x;
  }

  get minY() {
    return this.y;
  }

  get maxX() {
    return this.x + this.width;
  }

  get maxY() {
    return this.y + this.height;
  }

  get globalX() {
    return this.container.getGlobalPosition().x;
  }

  get globalY() {
    return this.container.getGlobalPosition().y;
  }

  get globalWidth() {
    return this.width * this.app.safeAreaScale;
  }

  get globalHeight() {
    return this.height * this.app.safeAreaScale;
  }

  get globalMinX() {
    return this.globalX;
  }

  get globalMinY() {
    return this.globalY;
  }

  get globalMaxX() {
    return this.globalX + this.globalWidth;
  }

  get globalMaxY() {
    return this.globalY + this.globalHeight;
  }
}
export { MissMark };
