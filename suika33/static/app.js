import { FRUITS } from './fruits.js';

const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  World = Matter.World,
  Body = Matter.Body;

// 엔진 선언
const engine = Engine.create();

// 렌더 선언
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false, // True면 색 적용 안됨
    background: '#F7F4C8', // 배경
    width: 620,
    height: 850,
  },
});

// 월드 생성
const world = engine.world;

// 왼쪽 벽 생성
const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true, // 고정해주는 기능
  //   isStatic: false, // 물리엔진 적용
  render: { fillStyle: '#E6B143' }, // 색상 지정
});

// 오른쪽 벽 생성
const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  isStatic: true,
  isSensor: true, // 충돌은 감지하나 물리엔진은 적용 X
  render: { fillStyle: '#E6B143' },
});

const ground = Bodies.rectangle(310, 820, 620, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

// 벽 배치
World.add(world, [leftWall, rightWall, topLine, ground]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;

let disableAction = false;

// 과일 떨어지는 함수 만들기
const addFruit = () => {
  // 과일 인덱스 저장
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
      //{texture: fruit.name+'.png'}
    },
    restitution: 1,
  });

  currentBody = body;
  currentFruit = fruit;

  console.log(fruit.name);
  World.add(world, body);
};

window.onkeydown = e => {
  if (disableAction) {
    return;
  }
  switch (e.code) {
    case 'KeyA':
      Body.setPosition(currentBody, {
        x: currentBody.position.x - 10,
        y: currentBody.position.y,
      });
      break;
    case 'KeyD':
      Body.setPosition(currentBody, {
        x: currentBody.position.x + 10,
        y: currentBody.position.y,
      });
      break;
    case 'KeyS':
      currentBody.isSleeping = false;

      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
};

addFruit();
