class ApplicationDelegate {
    shouldBeginCreating;
    shouldAddShapeCreatedToShapes;
    shapeChanged;
    shapesChanged;
    globalChanged;
    shouldLetUserSelectShape;
    shouldLetUserSelectShapeOnRightClick;
    userSelectedShapeOnRightClick;
    shouldLetUserMoveShape;
    shouldLetUserEditShape;

    constructor() {
    }

    get shouldBeginCreatingImpl() {
        return this.shouldBeginCreating ?? function () { return true; };
    }

    get shouldAddShapeCreatedToShapesImpl() {
        return this.shouldAddShapeCreatedToShapes ?? function (shapeCreated) { return true; };
    }

    get shapeChangedImpl() {
        return this.shapeChanged ?? function (shapeChanged) { console.info('A Shape Changed.'); };
    }

    get shapesChangedImpl() {
        return this.shapesChanged ?? function () {};
    }

    get globalChangedImpl() {
        return this.globalChanged ?? function () { console.info('Global Changed.'); };
    }

    get shouldLetUserSelectShapeImpl() {
        return this.shouldLetUserSelectShape ?? function (shapeUserTryingToSelect) { return true; };
    }

    get shouldLetUserSelectShapeOnRightClickImpl() {
        return this.shouldLetUserSelectShapeOnRightClick ?? function (shapeUserTryingToSelectOnRightClick) { return true; };
    }

    get userSelectedShapeOnRightClickImpl() {
        return this.userSelectedShapeOnRightClick ?? function (shapeSelectedOnRightClick) { console.info('Shape selected on right click.'); };
    }

    get shouldLetUserMoveShapeImpl() {
        return this.shouldLetUserMoveShape ?? function (shapeToMove) { return true; };
    }

    get shouldLetUserEditShapeImpl() {
        return this.shouldLetUserEditShape ?? function (shapeToEdit) { return true; };
    }

}

export {ApplicationDelegate};
