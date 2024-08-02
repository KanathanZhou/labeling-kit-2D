export type Shape = Rect | MissMark;

export declare interface ApplicationConfig {
    /**
     * Canvas Width
     * @default: 800
     */
    width?: number;
    /**
     * Canvas Height
     * @default: 600
     */
    height?: number;
    /**
     * Canvas Background Color
     * @default: 0x000000
     */
    backgroundColor?: number;
    /**
     * Whether to resizeTo parent element
     * @default: false
     */
    resizeToParent?: boolean;
}

export declare interface ApplicationSetupConfig {
    /**
     * Whether to keep previous scale when setup with a new image src
     * @default: true
     */
    keepPreviousScale?: boolean;
}

export declare class Application {
    /**
     * Constructor for Application
     * @param parentElement
     * @param config: Optional
     * @param delegate: Optional
     */
    new(parentElement: HTMLElement, config?: ApplicationConfig, delegate?: ApplicationDelegate): Application;

    /**
     * Call this after the constructor to setup the core functionality
     * @param imageURL
     * @param width: Optional, you can specify the width if you want to, will default to aspect fit x
     * @param height: Optional, you can specify the height if you want to, will default to aspect fit y
     * @param config: Optional
     */
    setup(imageURL: string, width?: number, height?: number, config?: ApplicationSetupConfig): void;

    destroy: () => void;

    /**
     * AppTool of the application
     */
    readonly appTool: AppTool;

    /**
     * Current scale of the safe area
     */
    readonly safeAreaScale: number;

    /**
     * Safe area top bounds
     */
    readonly safeAreaTop: number;
    /**
     * Safe area right bounds
     */
    readonly safeAreaRight: number;
    /**
     * Safe area bottom bounds
     */
    readonly safeAreaBottom: number;
    /**
     * Safe area left bounds
     */
    readonly safeAreaLeft: number;

    /**
     * Terrain, a.k.a the background image, the sprite of src url you passed in the setup(url) function
     */
    readonly terrain: Terrain;

    /**
     * The shape you are currently selected / creating / editing
     */
    shape: Shape;

    /**
     * All of the shapes currently in the canvas
     */
    shapes: Shape[];

    /**
     * Manually set selected shape, this will change "shape"
     * @param shape
     */
    setSelectedShape(shape: Shape): void;

    /**
     * Deselect shape, this will change "shape"
     */
    deSelectShape(): void;

    /**
     * Set the cursor of the canvas
     * @param cursorType
     */
    setCursor(cursorType: string): void;

    /**
     * Ask for redrawing all shapes
     */
    redraw(): void;

    /**
     * resize canvas to match the width and height of the parent element (works only if you set app to match parent's size when you initialized it)
     * @param resetPosition: Default: false. Whether to reset the image to aspect fit in the center of canvas.
     */
    resize(resetPosition?: boolean): void;
}

export declare class ApplicationDelegate {
    /**
     * Ask the delegate if it is ok to begin creating
     * @return boolean
     */
    shouldBeginCreating: () => boolean;
    /**
     * Ask the delegate if it is ok to push the shape just created by user to shapes
     * @return boolean
     */
    shouldAddShapeCreatedToShapes: (shapeCreated: Shape) => boolean;
    /**
     * Tell the delegate when a shape changed
     * @return void
     */
    shapeChanged: (shapeChanged: Shape) => void;
    /**
     * Tell the delegate when shapes array changed
     * @return void
     */
    shapesChanged: () => void;
    /**
     * Tell the delegate when anything changed
     * @return void
     */
    globalChanged: () => void;
    /**
     * Ask the delegate if it is ok for user to select shape
     * @return boolean
     */
    shouldLetUserSelectShape: (shapeUserTryingToSelect: Shape) => boolean;
    /**
     * Ask the delegate if it is ok for user to select shape on right click
     * @return boolean
     */
    shouldLetUserSelectShapeOnRightClick: (shapeUserTryingToSelectOnRightClick: Shape) => boolean;
    /**
     * Tell the delegate when shape is selected on right click
     * @return void
     */
    userSelectedShapeOnRightClick: (shapeSelectedOnRightClick: Shape) => void;

    /**
     * Ask the delegate if it is ok to move the shape
     * @return boolean
     */
    shouldLetUserMoveShapeImpl: (shapeToMove: Shape) => boolean;

    /**
     * Ask the delegate if it is ok to edit/resize the shape
     * @return boolean
     */
    shouldLetUserEditShapeImpl: (shapeToMove: Shape) => boolean;
}

export declare interface ShapeConfig {
    /**
     * Id of the shape
     */
    id?: number | string;
    /**
     * Color of the shape
     * @default 0xFFFFFF
     */
    color?: number;
    /**
     * Tell the factory to trigger delegate function: globalChanged
     */
    shouldTriggerGlobalChanged?: boolean;
}

export declare class Rect {
    /**
     * Rect Id
     */
    id?: number | string;

    /**
     * Whether to show error mark
     * @default: true
     */
    isErrorMarkHidden: boolean;

    /**
     * Rect type
     * @return AppTool.rect
     */
    readonly type: AppTool;

    /**
     * Width of the rect
     */
    readonly width: number;

    /**
     * Height of the rect
     */
    readonly height: number;

    /**
     * position x of the rect
     */
    readonly x: number;

    /**
     * position y of the rect
     */
    readonly y: number;

    /**
     * Minimum X of the rect
     */
    readonly minX: number;

    /**
     * Minimum Y of the rect
     */
    readonly minY: number;

    /**
     * Maximum X of the rect
     */
    readonly maxX: number;

    /**
     * Maximum Y of the rect
     */
    readonly maxY: number;

    /**
     * X position relative to the canvas
     */
    readonly globalX: number;

    /**
     * Y position relative to the canvas
     */
    readonly globalY: number;

    /**
     * width relative to the canvas
     */
    readonly globalWidth: number;

    /**
     * height relative to the canvas
     */
    readonly globalHeight: number;

    /**
     * Minimum X of the rect relative to the canvas
     */
    readonly globalMinX: number;

    /**
     * Minimum Y of the rect relative to the canvas
     */
    readonly globalMinY: number;

    /**
     * Maximum X of the rect relative to the canvas
     */
    readonly globalMaxX: number;

    /**
     * Maximum Y of the rect relative to the canvas
     */
    readonly globalMaxY: number;

    /**
     * Set the color of the shape
     * @param color
     */
    public setColor(color: number): void;
}

export declare class MissMark {
    /**
     * Rect Id
     */
    id?: number | string;

    /**
     * Miss Mark type
     * @return AppTool.missMark
     */
    readonly type: AppTool;

    /**
     * position x of the rect
     */
    readonly x: number;

    /**
     * position y of the rect
     */
    readonly y: number;

    /**
     * Minimum X of the rect
     */
    readonly minX: number;

    /**
     * Minimum Y of the rect
     */
    readonly minY: number;

    /**
     * Maximum X of the rect
     */
    readonly maxX: number;

    /**
     * Maximum Y of the rect
     */
    readonly maxY: number;

    /**
     * X position relative to the canvas
     */
    readonly globalX: number;

    /**
     * Y position relative to the canvas
     */
    readonly globalY: number;

    /**
     * width relative to the canvas
     */
    readonly globalWidth: number;

    /**
     * height relative to the canvas
     */
    readonly globalHeight: number;

    /**
     * Minimum X of the rect relative to the canvas
     */
    readonly globalMinX: number;

    /**
     * Minimum Y of the rect relative to the canvas
     */
    readonly globalMinY: number;

    /**
     * Maximum X of the rect relative to the canvas
     */
    readonly globalMaxX: number;

    /**
     * Maximum Y of the rect relative to the canvas
     */
    readonly globalMaxY: number;
}

export declare enum AppTool {
    rect = 0,
    missMark = 9,
}

export declare class Terrain {
    /**
     * Original width of the terrain
     */
    readonly width: number;

    /**
     * Original height of the terrain
     */
    readonly height: number;
}

/**
 * Manually create a rect in the app
 * @param app
 * @param x
 * @param y
 * @param width
 * @param height
 * @param config
 * @returns Rect just created
 */
export declare function createRect(
    app: Application,
    x: number,
    y: number,
    width: number,
    height: number,
    config?: ShapeConfig
): Rect;

/**
 * Manually update a rect
 * @param app
 * @param rect
 * @param x
 * @param y
 * @param width
 * @param height
 * @param config
 * @returns Rect just updated
 */
export declare function updateRect(
    app: Application,
    rect: Rect,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    config?: ShapeConfig
): Rect;

/**
 * Manually update a rect by passing in rectId
 * @param app
 * @param rectId
 * @param x
 * @param y
 * @param width
 * @param height
 * @param config
 * @returns Rect | undefined, if rect updated successfully, return rect, otherwise return undefined
 */
export declare function updateRectById(
    app: Application,
    rectId: string | number,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    config?: ShapeConfig
): Rect | undefined;

/**
 * Manually delete a shape
 * @param app
 * @param shape
 * @returns true if deleted ok, false otherwise
 */
export declare function deleteShape(app: Application, shape: Shape): boolean;

/**
 * Manually delete a shape by shapeId
 * @param app
 * @param shapeId
 * @returns true if deleted ok, false otherwise
 */
export declare function deleteShapeById(app: Application, shapeId: string | number): boolean;

/**
 * Manually delete all shapes in the app
 * @param app
 */
export declare function deleteAllShapes(app: Application): void;

/**
 * Get All Shapes
 * @param app
 * @returns shape array
 */
export declare function getShapes(app: Application): Shape[];

/**
 * @param app
 * @param shapeId
 * @returns Shape | undefined
 */
export declare function getShapeById(app: Application, shapeId: number | string): Shape | undefined;

/**
 * @param app
 * @param shape
 * @returns boolean: true if shape is selected, and vice versa
 */
export declare function selectShape(app: Application, shape: Shape): boolean;

/**
 * @param app
 * @param shapeId
 * @returns boolean: true if shape is selected, and vice versa
 */
export declare function selectShapeById(app: Application, shapeId: number | string): boolean;

/**
 * Manually create a miss mark in the app
 * @param app
 * @param x
 * @param y
 * @param config
 * @returns MissMark just created
 */
export declare function createMissMark(app: Application, x: number, y: number, config?: ShapeConfig): MissMark;

/**
 * Manually update a miss mark
 * @param app
 * @param missMark
 * @param x
 * @param y
 * @param config
 * @returns Miss Mark just updated
 */
export declare function updateMissMark(
    app: Application,
    missMark: MissMark,
    x?: number,
    y?: number,
    config?: ShapeConfig
): MissMark;

/**
 * Manually update a miss mark by passing in missMarkId
 * @param app
 * @param missMarkId
 * @param x
 * @param y
 * @param config
 * @returns MissMark | undefined, if rect updated successfully, return rect, otherwise return undefined
 */
export declare function updateMissMarkById(
    app: Application,
    missMarkId: string | number,
    x?: number,
    y?: number,
    config?: ShapeConfig
): MissMark | undefined;
