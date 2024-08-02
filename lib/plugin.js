// import * as PIXI from "pixi.js";

// class Plugin {
    // showLineAssistance = true;
    // lineAssistanceGraphics = new PIXI.Graphics();
    // showCursorCoordinates = true;
    // cursorCoordinatesText = new PIXI.Text("(0, 0)");


    // this.safeArea.addChild(this.lineAssistanceGraphics);
    // this.redrawLineAssistance();


/*    redrawLineAssistance() {
        this.lineAssistanceGraphics.clear();
        this.lineAssistanceGraphics.lineStyle({ width: 1 / this.safeAreaScale, color: 0xdadce0, alpha: 0.3 });
        let startX = 0, startY = 0;
        while (startX < this.safeAreaRight) {
            this.lineAssistanceGraphics.moveTo(startX, this.localCoordinate.y);
            this.lineAssistanceGraphics.lineTo(startX + 4, this.localCoordinate.y);
            startX += 8;
        }
        while (startY < this.safeAreaBottom) {
            this.lineAssistanceGraphics.moveTo(this.localCoordinate.x, startY);
            this.lineAssistanceGraphics.lineTo(this.localCoordinate.x, startY + 4);
            startY += 8;
        }
    }*/
// }
// export { Plugin };