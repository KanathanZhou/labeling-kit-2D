import {Texture, BaseTexture} from '@pixi/core';
import {ActionState, AppTool, CursorType, PanState, ZoomRate} from './constant';
import {Point} from './point';
import {Rect} from './rect';
import {ApplicationDelegate} from './application.delegate';
import * as PIXI from 'pixi.js';
import {MissMark} from './miss-mark';
import {deleteAllShapes} from './facotry';

const DEFAULT_SETUP_CONFIG = {
    keepPreviousScale: true,
};

class Application {
    app;

    safeArea = new PIXI.Container();
    terrain;
    actionState = ActionState.none;
    panState = PanState.none;

    appTool = AppTool.rect;

    point = new Point(); // safearea's position relative to stage
    panPoint = new Point();
    zoomPoint = new Point();
    prevMovePoint = new Point();
    cursorPoint = new PIXI.Point();

    shape;
    shapes = [];
    hoveredShape;

    clean = () => {
    };
    destroy = () => {
    };

    delegate; // Application Delegate

    // used for zoom to last position: https://jira.inceptio.tech/browse/AN-809
    lastZoomedScale;
    lastPoint = new Point();

    constructor(parentElement, config = {}, delegate = new ApplicationDelegate()) {
        this.app = new PIXI.Application({
            width: config.width ?? 800,
            height: config.height ?? 600,
            backgroundColor: config.backgroundColor ?? 0x000000,
            resizeTo: config.resizeToParent ? parentElement : undefined,
        });
        parentElement.appendChild(this.app.view);
        this.delegate = delegate;
    }

    handleMousedown = (e) => {
        e.preventDefault();
        if (!this.insideTerrain()) {
            if (e.which === 1) {
                if (this.hoveredShape) {
                    this.setActionState(ActionState.willMoveShape);
                } else {
                    switch (this.actionState) {
                        case ActionState.creating:
                            this.didEndCreatingRect();
                            break;
                        case ActionState.movingShape:
                            this.setActionState(ActionState.none);
                            this.delegate.shapeChangedImpl(this.shape);
                            this.delegate.shapesChangedImpl();
                            this.delegate.globalChangedImpl();
                            break;
                        case ActionState.editingShape:
                            this.setActionState(ActionState.none);
                            this.delegate.shapeChangedImpl(this.shape);
                            this.delegate.shapesChangedImpl();
                            this.delegate.globalChangedImpl();
                            break;
                        default:
                            break;
                    }
                }
            } else if (e.which === 3) {
                switch (this.actionState) {
                    case ActionState.creating:
                        // only trigger it if cursor is outside of the sprite
                        // TODO: cancel drawing / delete shape
                        break;
                    default:
                        break;
                }
            }
        }
    };

    handleMouseup = (e) => {
        e.preventDefault();
        if (!this.insideTerrain()) {
            switch (this.actionState) {
                case ActionState.movingShape:
                    this.setActionState(ActionState.none);
                    this.delegate.shapeChangedImpl(this.shape);
                    this.delegate.shapesChangedImpl();
                    this.delegate.globalChangedImpl();
                    break;
                case ActionState.editingShape:
                    this.setActionState(ActionState.none);
                    this.delegate.shapeChangedImpl(this.shape);
                    this.delegate.shapesChangedImpl();
                    this.delegate.globalChangedImpl();
                    break;
                default:
                    break;
            }
        }
    };

    handleContextmenu = (e) => {
        e.preventDefault();
    };

    handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            this.zoomIn();
        } else {
            this.zoomOut();
        }
        this.delegate.globalChangedImpl();
        this.redraw();
    };

    setup(url, width, height, config = DEFAULT_SETUP_CONFIG) {
        if (width && height) {
            this.aspectFit(width, height);
        }

        this.clean();
        this.app.loader.add(url).load((loader, resources) => {
            this.clean = () => {
                this.terrain.destroy(true);
                PIXI.utils.clearTextureCache();
                loader.reset();
                loader.destroy();
                Texture.removeFromCache(url);
                BaseTexture.removeFromCache(url);
            };

            this.destroy = () => {
                resources[url].texture.destroy(true);
                this.terrain.destroy(true);
                this.safeArea.destroy(true);
                this.app.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
                this.app.view.removeEventListener('contextmenu', this.handleContextmenu);
                this.app.view.removeEventListener('mousedown', this.handleMousedown);
                this.app.view.removeEventListener('mouseup', this.handleMouseup);
                this.app.view.removeEventListener('wheel', this.handleWheel);
            };

            this.terrain = new PIXI.Sprite(resources[url].texture);
            this.safeArea.addChild(this.terrain);
            this.app.stage.addChild(this.safeArea);
            this.safeArea.setChildIndex(this.terrain, 0);

            if (!width || !height) {
                // set safe area as aspect fit
                this.aspectFit(this.terrain.width, this.terrain.height);
            }
            // center safe area
            this.safeArea.position.set(
                this.app.screen.width / 2 - this.safeArea.width / 2,
                this.app.screen.height / 2 - this.safeArea.height / 2
            );
            this.safeArea.pivot.set(0, 0);

            // initial spec state
            this.panPoint.set(this.safeArea.x, this.safeArea.y);
            this.point.set(this.safeArea.x, this.safeArea.y);
            this.zoomPoint.set(this.safeArea.x, this.safeArea.y);

            this.app.view.addEventListener('contextmenu', this.handleContextmenu, false);
            this.app.view.addEventListener('mousedown', this.handleMousedown, false);
            this.app.view.addEventListener('mouseup', this.handleMouseup, false);
            this.app.view.addEventListener('wheel', this.handleWheel, false);

            this.terrain.interactive = true;
            this.terrain.on('rightdown', (e) => {
                switch (this.actionState) {
                    case ActionState.none:
                        if (this.hoveredShape) {
                            if (this.delegate.shouldLetUserSelectShapeOnRightClickImpl(this.hoveredShape)) {
                                this.setSelectedShape(this.hoveredShape);
                                this.delegate.userSelectedShapeOnRightClickImpl(this.shape);
                            } else {
                                this.willPan(e.data.global.x, e.data.global.y);
                            }
                        } else {
                            this.willPan(e.data.global.x, e.data.global.y);
                        }
                        break;
                    case ActionState.creating:
                        this.willPan(e.data.global.x, e.data.global.y);
                        break;
                    default:
                        break;
                }

                switch (this.panState) {
                    case PanState.panning:
                        this.setActionState(ActionState.none);
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
            });
            this.terrain.on('rightup', (e) => {
                switch (this.panState) {
                    case PanState.panning:
                    case PanState.willPan:
                        this.setCursor(CursorType.crosshair);
                        this.setPanState(PanState.none);
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
            });
            this.terrain.on('mousedown', (e) => {
                this.prevMovePoint.set(this.localCoordinate.x, this.localCoordinate.y);
                switch (this.actionState) {
                    case ActionState.none:
                        if (this.hoveredShape) {
                            if (this.delegate.shouldLetUserSelectShapeImpl(this.hoveredShape)) {
                                this.setSelectedShape(this.hoveredShape);
                                if (this.shape.hitTestCircleHelpers()) {
                                    this.setActionState(ActionState.willEditShape);
                                } else {
                                    this.setActionState(ActionState.willMoveShape);
                                }
                            }
                        } else {
                            switch (this.appTool) {
                                case AppTool.rect:
                                    if (this.delegate.shouldBeginCreatingImpl()) {
                                        this.setActionState(ActionState.creating);
                                        const newRect = new Rect(this);
                                        newRect.set(this.localCoordinate.x, this.localCoordinate.y);
                                        newRect.drawAsDotted = true;
                                        this.setSelectedShape(newRect);
                                    }
                                    break;
                                case AppTool.missMark:
                                    if (this.delegate.shouldBeginCreatingImpl()) {
                                        this.setActionState(ActionState.none);
                                        const mm = new MissMark(this, this.localCoordinate.x, this.localCoordinate.y, true);
                                        this.setSelectedShape(mm);
                                        this.didEndCreatingRect();
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    case ActionState.creating:
                        this.didEndCreatingRect();
                        break;
                    case ActionState.movingShape:
                        this.setActionState(ActionState.none);
                        this.delegate.shapeChangedImpl(this.shape);
                        this.delegate.shapesChangedImpl();
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
                switch (this.panState) {
                    case PanState.willPan:
                    case PanState.panning:
                        this.setPanState(PanState.none);
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
            });
            this.terrain.on('mousemove', (e) => {
                this.cursorPoint = e.data.global;
                const x = e.data.global.x,
                    y = e.data.global.y;
                this.zoomPoint.set(x, y);

                switch (this.actionState) {
                    case ActionState.none:
                        this.hitTest(this.localCoordinate.x, this.localCoordinate.y);
                        if (this.hoveredShape) {
                            this.hoveredShape.hoverTestCircleHelpers();
                        }
                        break;
                    case ActionState.creating:
                        this.shape.width = this.sanitizedX - this.shape.x;
                        this.shape.height = this.sanitizedY - this.shape.y;
                        this.shape.redraw();
                        break;
                    case ActionState.willMoveShape:
                        this.setActionState(ActionState.movingShape);
                        break;
                    case ActionState.movingShape:
                        if (this.delegate.shouldLetUserMoveShapeImpl(this.shape)) {
                            const moveX = this.localCoordinate.x - this.prevMovePoint.x,
                                moveY = this.localCoordinate.y - this.prevMovePoint.y;
                            this.shape.move(moveX, moveY);
                            this.shape.redraw();
                            this.prevMovePoint.set(this.localCoordinate.x, this.localCoordinate.y);
                            this.delegate.globalChangedImpl();
                        } else {
                            this.setActionState(ActionState.none);
                        }
                        break;
                    case ActionState.willEditShape:
                        this.setActionState(ActionState.editingShape);
                        break;
                    case ActionState.editingShape:
                        if (this.delegate.shouldLetUserEditShapeImpl(this.shape)) {
                            if (!this.shape.verticalResize) {
                                this.shape.width = this.sanitizedX - this.shape.x;
                            }
                            if (!this.shape.horizontalResize) {
                                this.shape.height = this.sanitizedY - this.shape.y;
                            }
                            this.shape.redraw();
                            this.delegate.globalChangedImpl();
                        } else {
                            this.setActionState(ActionState.none);
                        }
                        break;
                    default:
                        break;
                }

                switch (this.panState) {
                    case PanState.willPan:
                        this.setPanState(PanState.panning);
                        break;
                    case PanState.panning:
                        this.panning(x, y);
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
            });
            this.terrain.on('mouseup', () => {
                switch (this.actionState) {
                    case ActionState.willMoveShape:
                        this.setActionState(ActionState.none);
                        break;
                    case ActionState.movingShape:
                        this.setActionState(ActionState.none);
                        this.delegate.shapeChangedImpl(this.shape);
                        this.delegate.shapesChangedImpl();
                        this.delegate.globalChangedImpl();
                        break;
                    case ActionState.willEditShape:
                        this.setActionState(ActionState.none);
                        break;
                    case ActionState.editingShape:
                        this.setActionState(ActionState.none);
                        this.delegate.shapeChangedImpl(this.shape);
                        this.delegate.shapesChangedImpl();
                        this.delegate.globalChangedImpl();
                        break;
                    default:
                        break;
                }
            });

            if (config.keepPreviousScale) {
                this.zoomToPreviousScale();
            }
        });
    }

    aspectFit(width, height) {
        const widthRatio = this.app.screen.width / width;
        const heightRadio = this.app.screen.height / height;
        this.safeAreaScale = widthRatio < heightRadio ? widthRatio : heightRadio;
    }

    resize(resetPosition = false) {
        this.app.resize();
        if (this.terrain && resetPosition) {
            this.aspectFit(this.terrain.width, this.terrain.height);
            // center safe area
            this.safeArea.position.set(
                this.app.screen.width / 2 - this.safeArea.width / 2,
                this.app.screen.height / 2 - this.safeArea.height / 2
            );
            this.safeArea.pivot.set(0, 0);
            // initial spec state
            this.panPoint.set(this.safeArea.x, this.safeArea.y);
            this.point.set(this.safeArea.x, this.safeArea.y);
            this.zoomPoint.set(this.safeArea.x, this.safeArea.y);
            this.redraw();
        }
    }

    willPan(globalX, globalY) {
        this.setCursor(CursorType.grab);
        this.panPoint.set(globalX, globalY);
        this.setPanState(PanState.willPan);
    }

    panning(x, y) {
        const moveX = x - this.panPoint.x,
            moveY = y - this.panPoint.y;
        this.safeArea.x += moveX;
        this.safeArea.y += moveY;

        this.panPoint.set(x, y);
        this.point.set(this.safeArea.x, this.safeArea.y);
        this.zoomPoint.set(this.safeArea.x, this.safeArea.y);

        this.setCursor(CursorType.grabbing);
    }

    zoomToPreviousScale() {
        if (this.lastZoomedScale) {
            this.safeAreaScale = this.lastZoomedScale; // zoom to previous scale
            this.point.set(this.lastPoint.x, this.lastPoint.y);
            this.safeArea.position.set(this.lastPoint.x, this.lastPoint.y); // move safe area to last position
        }
    }

    zoomIn() {
        let xs = (this.zoomPoint.x - this.point.x) / this.safeAreaScale,
            ys = (this.zoomPoint.y - this.point.y) / this.safeAreaScale; // distance from safearea's position and zoom point at 100% scale
        this.safeAreaScale = this.safeAreaScale / ZoomRate;
        this.point.set(this.zoomPoint.x - xs * this.safeAreaScale, this.zoomPoint.y - ys * this.safeAreaScale);
        this.safeArea.position.set(this.point.x, this.point.y);

        this.lastZoomedScale = this.safeAreaScale;
        this.lastPoint.set(this.point.x, this.point.y);
    }

    zoomOut() {
        let xs = (this.zoomPoint.x - this.point.x) / this.safeAreaScale,
            ys = (this.zoomPoint.y - this.point.y) / this.safeAreaScale; // distance from safearea's position and zoom point at 100% scale
        this.safeAreaScale = this.safeAreaScale * ZoomRate;
        this.point.set(this.zoomPoint.x - xs * this.safeAreaScale, this.zoomPoint.y - ys * this.safeAreaScale);
        this.safeArea.position.set(this.point.x, this.point.y);

        this.lastZoomedScale = this.safeAreaScale;
        this.lastPoint.set(this.point.x, this.point.y);
    }

    setActionState(actionState) {
        this.actionState = actionState;
    }

    setPanState(panState) {
        this.panState = panState;
    }

    hitTest(x, y) {
        let hitShape;
        this.shapes.forEach((shape) => {
            if (shape.hitTest(x, y)) {
                if (hitShape) {
                    if (hitShape.area > shape.area) {
                        hitShape = shape;
                    }
                } else {
                    hitShape = shape;
                }
            }
        });
        if (hitShape) {
            this.setCursor(CursorType.move);
            this.setHoveredShape(hitShape);
        } else {
            this.setCursor(CursorType.crosshair);
            this.deHoverShape();
        }
    }

    setHoveredShape(shape) {
        this.hoveredShape = shape;
        this.hoveredShape.redraw();
    }

    deHoverShape() {
        if (this.hoveredShape) {
            const tempHoveredShape = this.hoveredShape;
            this.hoveredShape = undefined;
            tempHoveredShape.redraw();
        }
    }

    setSelectedShape(shape) {
        this.shape = shape;
        this.shape.redraw();
    }

    deSelectShape() {
        if (this.shape) {
            const tempShape = this.shape;
            this.shape = undefined;
            tempShape.redraw();
        }
    }

    setCursor(cursorType) {
        this.app.view.style.cursor = cursorType;
    }

    insideTerrain() {
        const interactionManager = this.app.renderer.plugins.interaction;
        return interactionManager.hitTest(this.cursorPoint, this.terrain);
    }

    redraw() {
        this.shapes.forEach((shape) => shape.redraw());
    }

    didEndCreatingRect() {
        // this.shape should be something, but not undefined
        if (this.delegate.shouldAddShapeCreatedToShapesImpl(this.shape)) {
            this.shape.drawAsDotted = false;
            this.shape.redraw();
            this.shapes.push(this.shape);
            this.delegate.shapesChangedImpl();
            this.delegate.globalChangedImpl();
        } else {
            this.safeArea.removeChild(this.shape.container);
            this.hoveredShape = undefined;
            this.shape = undefined;
        }
        this.setActionState(ActionState.none);
    }

    get localCoordinate() {
        return this.safeArea.toLocal(this.cursorPoint, this.app.stage);
    }

    get sanitizedX() {
        if (this.localCoordinate.x < this.safeAreaLeft) {
            return this.safeAreaLeft;
        } else if (this.localCoordinate.x > this.safeAreaRight) {
            return this.safeAreaRight;
        } else {
            return this.localCoordinate.x;
        }
    }

    get sanitizedY() {
        if (this.localCoordinate.y < this.safeAreaTop) {
            return this.safeAreaTop;
        } else if (this.localCoordinate.y > this.safeAreaBottom) {
            return this.safeAreaBottom;
        } else {
            return this.localCoordinate.y;
        }
    }

    set safeAreaScale(scale) {
        this.safeArea.scale.set(scale, scale);
    }

    get safeAreaScale() {
        return this.safeArea.scale.x;
    }

    get safeAreaBounds() {
        return {
            left: this.safeAreaLeft,
            top: this.safeAreaTop,
            right: this.safeAreaRight,
            bottom: this.safeAreaBottom,
        };
    }

    get safeAreaTop() {
        return this.safeArea._localBoundsRect.top;
    }

    get safeAreaLeft() {
        return this.safeArea._localBoundsRect.left;
    }

    get safeAreaRight() {
        return this.safeArea._localBoundsRect.right;
    }

    get safeAreaBottom() {
        return this.safeArea._localBoundsRect.bottom;
    }
}

export {Application};
