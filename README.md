## Version 0.0.20
### Delegate
1. 新增`shouldLetUserMoveShape`  
   描述：当用户尝试移动选中的框体时询问，返还true会允许用户移动选中的框体, 返还false会阻止用户移动选中的框体
   用法：
   `delegate.shouldLetUserMoveShape = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`return mode !== Mode.Preview;` // 非预览模式下允许用户移动  
   `}`
2. 新增`shouldLetUserEditShape`  
   描述：当用户尝试修改选中的框体时询问，返还true会允许用户修改选中的框体, 返还false会阻止用户修改选中的框体
   用法：
   `delegate.shouldLetUserEditShape = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`return mode !== Mode.Preview;` // 非预览模式下允许用户修改  
   `}`

### Others
1. 修复了`createMissMark` render位置不正确的问题

## Version 0.0.19
### Application
1. 新增`resize`方法，可以强制讲canvas匹配parent element的width & height

## Version 0.0.18
### Application
1. `setup` 中新增 `config`，可以指定是否保留上一张图片的缩放比例与缩放位置，默认保留

### Others
1. index.d.ts中新增 `ApplicationSetupConfig`

## Version 0.0.17
优化Application `setup` 方法, 加载前做清理动作, 同时添加 `destroy` 方法

## Version 0.0.16
修复加载完图片后把之前绘制的图形遮挡了的问题

## Version 0.0.15
### Application
1. 新增绘制工具appTool，目前支持两种：AppTool.rect 和 AppTool.missMark，默认为AppTool.rect, 请使用`changeAppTool`更改

### Delegate
1. 新增`shouldLetUserSelectShapeOnRightClick`  
   描述：当用户尝试使用右键选中一个框体时询问，返还true会选中该框体并且调用`userSelectedShapeOnRightClick`, 返还false会正常执行移动画布操作   
   用法：（例如在标注阶段阻止用户选中漏标）  
   `delegate.shouldLetUserSelectShapeOnRightClick = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`return shape.type !== AppTool.missmark;`  
   `}`
2. 新增`userSelectedShapeOnRightClick`  
   描述：当用户成功使用右键选中一个框体时调用  
   用法：  
   `delegate.userSelectedShapeOnRightClick = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`shape.isErrorMarkHidden = !shape.isErrorMarkHidden;`  
   `}`

### Rect
1. 新增`isErrorMarkHidden`  
   描述：用来控制框体是否显示错误标记, true会隐藏, false会显示  
   用法：`if (<your code>) shape.isErrorMarkHidden = false`
2. 新增`type`  
   描述：会返还AppTool.rect

### Factory
1. 新增`changeAppTool`  
   描述：用以改变绘制工具，返还true则成功，false则失败  
   用法: 请确保调用时用户没有在绘制中或者编辑框体或者移动框体，否则会失败
2. 新增`createMissMark`
3. 新增`updateMissMark`
4. 新增`updateMissMarkById`

### Others
1. index.d.ts中新增`AppTool`, 可使用于`changeAppTool`, 或与`shape.type`比较
2. index.d.ts中新增`MissMark`
3. index.d.ts中新增`createMissMark`, `updateMissMark`, `updateMissMarkById`

### Tips
1. 阻止标注员选中漏标可使用：  
   `delegate.shouldLetUserSelectShape`  
   `delegate.shouldLetUserSelectShapeOnRightClick`
2. 删除漏标可使用`deleteShape` 或 `deleteShapeById`

## Version 0.0.14
### Rect
1. 新增`globalMinX`, `globalMinY`, `globalMaxX`, `globalMaxY`, 左上角的点即为 (globalMinX, globalMinY), 右下角的点为(globalMaxX, globalMaxY)

### Delegate
1. 新增`shapeChanged`   
   描述：当有一个shape发生变化（绘制，移动，改变大小，etc,.）时调用   
   用法：  
   `delegate.shapeChanged = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`shape.id = "xsadsad";`   
   &nbsp;&nbsp;&nbsp;&nbsp;`console.log(shape);`   
   `}`

### Factory
1. 修复了updateRect的问题
2. 修复了updateRectById不起作用的问题
3. update, delete仍会触发delegate.globalChanged
4. createRect方法中新增config: shouldTriggerGlobalChanged, 如果传入shouldTriggerGlobalChanged为true, 则会触发delegate.globalChanged，否则不触发

### Others
1. index.d.ts中：ShapeConfig新增shouldTriggerGlobalChanged

## Version 0.0.13
### Factory
1. 新增`updateRectById`
2. 新增`deleteShapeById`
3. 新增`getShapeById`
4. 新增`deleteAllShapes`
5. `updateRect`现在会返还更新后的rect，`updateRectById` 现在会返还更新后的rect或undefined（未找到rect）
6. `deleteShape`与`deleteShapeById`现在会返还true/false

### Rect
1. 新增`globalWidth`, `globalHeight`

## Version 0.0.12
### Application
1. 更新画shape的逻辑，现在画完shape之后会调用shouldAddShapeCreatedToShapes来询问是否加入shapes
2. 更新画shape的表现形式为虚线

### Delegate
1. 新增shouldAddShapeCreatedToShapes  
   描述：当「用户」画完一个shape时调用，返还true则会加入shapes，返还false会丢弃掉这个shape  
   用法：  
`delegate.shouldAddShapeCreatedToShapes = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`shape.id = "xsadsad";`   
   &nbsp;&nbsp;&nbsp;&nbsp;`console.log(shape);`  
   &nbsp;&nbsp;&nbsp;&nbsp;`return false;`  
`}`
2. 删除了didEndCreating

## Version 0.0.11
### Shape
1. Shape 现在有了 id  
用法1: 可在createRect()中通过ShapeConfig.id传入  
用法2: 直接shape.id = xxx 更改

### Factory
1. 新增selectShape
2. 新增selectShapeById
3. createRect中的config支持传入id

### Delegate
1. 新增shouldLetUserSelectShape  
描述：当「用户」尝试选中一个Shape时触发，返还true则会允许「用户」选中  
用法：  
`delegate.shouldLetUserSelectShape = (shape) => {`  
   &nbsp;&nbsp;&nbsp;&nbsp;`console.log(shape);`  
   &nbsp;&nbsp;&nbsp;&nbsp;`return false;`  
`}`

### Others
1. 更新了index.d.ts中的一些写法