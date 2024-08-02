import './style.css';
import { Application } from './lib/application';
import {
  ApplicationDelegate,
  AppTool,
  changeAppTool,
  createMissMark,
  createRect,
  deleteShape,
  deleteShapeById,
  ErrorMark,
  MissMark,
  selectShape,
  selectShapeById,
  updateMissMark,
  updateMissMarkById,
  updateRect,
  updateRectById,
} from './lib/main';

let app1 = document.querySelector('#app1');
let instance1 = new Application(app1);
instance1.setup(
    'images/mop.jpeg',
  // 'https://inceptio-annotation-platform-dev.oss-cn-hangzhou.aliyuncs.com/projects/30/batches/20/frames/1615538177741686300.jpg',
    // 800,
    // 800
);

let app2 = document.querySelector('#app2');
let delegate = new ApplicationDelegate();
delegate.globalChanged = () => {
  console.log('custom global changed');
};
let instance2 = new Application(app2, { resizeToParent: true }, delegate);
delegate.shapesChanged = () => {
  // console.log("custom shapes changed");
  // console.log(instance2.shapes);
  // console.log(instance2.safeAreaScale)
};
delegate.shouldLetUserSelectShape = (shape) => {
  // console.log(shape);
  return true;
};
delegate.shouldAddShapeCreatedToShapes = (shape) => {
  // shape.id = "xsadsad";
  // console.log(shape);
  return true;
};
delegate.shapeChanged = (shape) => {
  console.log('zzzzz');
  console.log(shape);
};
delegate.userSelectedShapeOnRightClick = (shape) => {
  shape.isErrorMarkHidden = !shape.isErrorMarkHidden;
};
instance2.setup('images/mop3.jpeg');

let button1 = document.createElement('button');
button1.innerText = 'click me1!';
document.body.appendChild(button1);
button1.addEventListener('click', () => {
  // createMissMark(instance1, 1000.8667968749997, 428.7175781249998);
  // createMissMark(instance1, 952.8667968749997, 332.7175781249998);
  // createMissMark(instance1, 711.9376464843748, 252.43952636718734);
  createMissMark(instance1, 1036.7303466796873, 703.0598876953123);

  // instance2.resize(false);
  // instance1.setup('images/mop.jpeg');

/*  if (instance2.shapes.length) {
    instance2.shapes[0].setColor(0xff5555);
    instance2.shapes[0].id = '12345';
    createRect(instance2, 100, 100, 44, 44);
    console.log(instance2.shape);
    selectShapeById(instance2, '12345');
    selectShape(instance2, instance2.shapes[1]);
    console.log(instance2.shape);
    // deleteShape(instance2, instance2.shapes[0]);
  }*/
});

let button2 = document.createElement('button');
button2.innerText = 'click me2!';
document.body.appendChild(button2);
button2.addEventListener('click', () => {
  instance1.setup('images/mop2.jpeg');
  // createRect(instance2, 100, 100, 44, 44);
  // changeAppTool(instance2, AppTool.missMark);
  // createMissMark(instance2, 0, 0);
});

let button3 = document.createElement('button');
button3.innerText = 'click me3!';
document.body.appendChild(button3);
button3.addEventListener('click', () => {
  instance1.setup('images/mop3.jpeg');
  // instance2.shapes[0].id = '21312321';
  // updateRect(instance2.shapes[0], undefined, undefined, undefined, undefined, { color: 0xfff0cd });
  // console.log(instance2.shapes);
  // updateMissMarkById(instance2, '21312321', 100, 100);
  // deleteShapeById(instance2, "21312321");
  // updateRectById(instance2, "21312321", undefined, undefined, undefined, undefined, { color: 0xb6b6b6 });
});
