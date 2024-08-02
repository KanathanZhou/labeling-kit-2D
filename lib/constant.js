const ZoomRate = 1.05;
const PanState = {
    none: 0,
    willPan: 1,
    panning: 2
};
const ActionState = {
    none: 0,
    creating: 1,
    willMoveShape: 2,
    movingShape: 3,
    willEditShape: 4,
    editingShape: 5
};
const CursorType = {
    default: "default",
    move: "move",
    crosshair: "crosshair",
    nsResize: "ns-resize",
    ewResize: "ew-resize",
    neswResize: "nesw-resize",
    nwseResize: "nwse-resize",
    grab: "grab",
    grabbing: "grabbing",
    copy: "copy"
};
const AppTool = {
    rect: 0,
    missMark: 9
};
// base 64 svg data = `data:image/svg+xml;base64,${window.btoa(svgString - just copy it from your svg file)}`
const MISS_MARK_BASE64_DATA = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9InJlZCI+PGc+PHBhdGggZD0iTTAsMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PC9nPjxnPjxnPjxwYXRoIGQ9Ik0xMiwyYy00LjIsMC04LDMuMjItOCw4LjJjMCwzLjMyLDIuNjcsNy4yNSw4LDExLjhjNS4zMy00LjU1LDgtOC40OCw4LTExLjhDMjAsNS4yMiwxNi4yLDIsMTIsMnogTTEyLDE5LjMzIGMtNC4wNS0zLjctNi02Ljc5LTYtOS4xNEM2LDYuNTcsOC42NSw0LDEyLDRzNiwyLjU3LDYsNi4yQzE4LDEyLjU0LDE2LjA1LDE1LjY0LDEyLDE5LjMzeiIvPjxyZWN0IGhlaWdodD0iNSIgd2lkdGg9IjIiIHg9IjExIiB5PSI2Ii8+PHJlY3QgaGVpZ2h0PSIyIiB3aWR0aD0iMiIgeD0iMTEiIHk9IjEzIi8+PC9nPjwvZz48L3N2Zz4=`;
const ERROR_MARK_BASE64_DATA = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE0LjU5IDhMMTIgMTAuNTkgOS40MSA4IDggOS40MSAxMC41OSAxMiA4IDE0LjU5IDkuNDEgMTYgMTIgMTMuNDEgMTQuNTkgMTYgMTYgMTQuNTkgMTMuNDEgMTIgMTYgOS40MSAxNC41OSA4ek0xMiAyQzYuNDcgMiAyIDYuNDcgMiAxMnM0LjQ3IDEwIDEwIDEwIDEwLTQuNDcgMTAtMTBTMTcuNTMgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=`;

export { ZoomRate, PanState, ActionState, CursorType, MISS_MARK_BASE64_DATA, ERROR_MARK_BASE64_DATA, AppTool };