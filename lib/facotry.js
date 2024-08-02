import { Rect } from "./rect";
import { ActionState } from "./constant";
import {MissMark} from "./miss-mark";

function createRect(app, x, y, width, height, config = {}) {
    const rect = new Rect(app);
    rect.set(x, y);
    rect.width = width;
    rect.height = height;
    rect.id = config.id;
    rect.color = config.color ?? 0xFFFFFF;
    app.setSelectedShape(rect);
    app.shapes.push(rect);
    rect.redraw();
    if (config.shouldTriggerGlobalChanged) {
        app.delegate.globalChangedImpl();
    }
    return rect;
}

function updateRect(app, rect, x = undefined, y = undefined, width = undefined, height = undefined, config = {}) {
    if (x) {
        rect.x = x;
    }
    if (y) {
        rect.y = y;
    }
    if (width) {
        rect.width = width;
    }
    if (height) {
        rect.height = height;
    }
    if (config.color) {
        rect.color = config.color;
    }
    rect.redraw();
    app.delegate.globalChangedImpl();
    return rect;
}

function deleteShape(app, shape) {
    const index = app.shapes.indexOf(shape);
    // if shape is inside the app
    if (index !== -1) {
        if (app.shape) {
            if (app.shape === shape) {
                app.deHoverShape();
                app.deSelectShape();
                app.setActionState(ActionState.none);
            }
        }
        app.safeArea.removeChild(app.shapes[index].container);
        app.shapes.splice(index, 1);
        app.delegate.globalChangedImpl();
        return true;
    }
    return false;
}

function getShapes(app) {
    return app.shapes;
}

function selectShape(app, shape) {
    const index = app.shapes.indexOf(shape);
    // if shape is inside the app
    if (index !== -1) {
        app.setSelectedShape(shape);
        return true;
    }
    return false;
}

function selectShapeById(app, shapeId) {
    const shape = getShapeById(app, shapeId);
    if (shape) {
        app.setSelectedShape(shape);
        return true;
    }
    return false;
}

function getShapeById(app, shapeId) {
    if (shapeId !== undefined && shapeId !== null) {
        return app.shapes.find((shape) => shape.id === shapeId);
    }
    return undefined;
}

function updateRectById(app, rectId, x = undefined, y = undefined, width = undefined, height = undefined, config = {}) {
    const rect = getShapeById(app, rectId);
    if (rect) {
        return updateRect(app, rect, x, y, width, height, config);
    }
    return undefined;
}

function deleteShapeById(app, shapeId) {
    const shape = getShapeById(app, shapeId);
    if (shape) {
        return deleteShape(app, shape);
    }
    return false;
}

function deleteAllShapes(app) {
    app.deHoverShape();
    app.deSelectShape();
    app.setActionState(ActionState.none);
    app.shapes.forEach((shape) => {
        app.safeArea.removeChild(shape.container);
    });
    app.shapes = [];
    app.delegate.globalChangedImpl();
}

function changeAppTool(app, appTool) {
    if (app.actionState === ActionState.none) {
        app.appTool = appTool;
        return true;
    }
    return false;
}

function createMissMark(app, x, y, config = {}) {
    const mm = new MissMark(app, x, y);
    mm.id = config.id;
    app.setSelectedShape(mm);
    app.shapes.push(mm);
    if (config.shouldTriggerGlobalChanged) {
        app.delegate.globalChangedImpl();
    }
    return mm;
}

function updateMissMark(app, missMark, x = undefined, y = undefined, config = {}) {
    if (x) {
        missMark.x = x;
    }
    if (y) {
        missMark.y = y;
    }
    app.delegate.globalChangedImpl();
    return missMark;
}

function updateMissMarkById(app, missMarkId, x = undefined, y = undefined, config = {}) {
    const mm = getShapeById(app, missMarkId);
    if (mm) {
        return updateMissMark(app, mm, x, y, config);
    }
    return undefined;
}


export {
    createRect,
    updateRect, updateRectById,
    deleteShape, deleteShapeById, deleteAllShapes,
    getShapes, getShapeById,
    selectShape, selectShapeById,
    changeAppTool,
    createMissMark,
    updateMissMark, updateMissMarkById
};