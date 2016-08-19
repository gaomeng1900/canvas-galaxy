/**
 * 自动调频测试
 * @author Simon
 * @create 2016-08-15
 */

// 测试
const canvas = document.getElementById('canvas');
const ct     = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const planets  = [];
for (let i = 0; i < 100; i++) {
    let ball = new Ball(Math.random()*700, Math.random()*700, Math.random()*7);
    // let theta = Math.random() * Math.PI * 2;
    // ball.vx = Math.cos(theta) * V;
    // ball.vy = Math.sin(theta) * V;


    const X = [350 - ball.x, 350 - ball.y];
    const lenX = Math.sqrt(Math.pow(X[0], 2) + Math.pow(X[1], 2)); // 连线向量长度
    let letX = (350 - ball.y > 0) ? 1 : -1;
    let Y = [letX, (350 - ball.y > 0) ? -X[0]/X[1] : X[0]/X[1]];
    let lenY = Math.sqrt(Math.pow(Y[0], 2) + Math.pow(Y[1], 2)); // 切线向量长度
    if (lenY > 99999999) {
        lenY = letX;
        Y = [0, letX];
    };
    Y = [
        Y[0] / lenY,
        Y[1] / lenY
    ]
    let ranV = V * Math.random()*5;
    ball.vx = ranV * Y[0];
    ball.vy = ranV * Y[1];


    ball.m = Math.pow(ball.radius, 2);
    ball.f = F;
    ball.fillStyle = '#EEEEEE';
    planets.push(ball);
}

const sun = new Ball(200, 350, 20);
sun.m = 1000;
sun.vy = -2;
sun.fillStyle = 'yellow';
planets.unshift(sun);
const subSun = new Ball(600, 350, 20);
subSun.m = 1000;
subSun.vy = 2;
subSun.fillStyle = 'yellow';
planets.unshift(subSun);
// const suns = [sun];

// const stars = planets.concat(suns);

// Hand of God !!!
const hog = new Engine(canvas, 2, false, true);
hog.scale = 0.3;
hog.origin = {
    x: 1400,
    y: 800
}

// 添加实体
hog.add(planets);
// hog.add(suns);

// 添加球之间的碰撞规则
hog.addLaw(() => {
    // 碰撞检测
    hog.checkCollition(planets, (A, B) => {
        // 碰撞后融合
        hog.sizeMerge(A, B);
        // 完全非弹性碰撞
        hog.pICollision(A, B);
        // 弹性碰撞
        // hog.elasticImpact(A, B);
    })
    hog.clean();
});

// 添加桌面边缘碰撞规则
// hog.addLaw(() => {
//     planets.map(ball => {
//         if (ball.x + ball.radius >= PLAY_ZONE[2]) {
//             ball.vx = -ball.vx * RESTITUTION;
//             ball.ax = -ball.ax;
//             ball.x = PLAY_ZONE[2] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
//         }
//         if (ball.x - ball.radius <= PLAY_ZONE[0]) {
//             ball.vx = -ball.vx * RESTITUTION;
//             ball.ax = -ball.ax;
//             ball.x = PLAY_ZONE[0] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
//         }
//         if (ball.y + ball.radius >= PLAY_ZONE[3]) {
//             ball.vy = -ball.vy * RESTITUTION;
//             ball.ay = -ball.ay;
//             ball.y = PLAY_ZONE[3] - ball.radius; // 立刻退回区域内, 暂时不按原路径退回
//         }
//         if (ball.y - ball.radius <= PLAY_ZONE[1]) {
//             ball.vy = -ball.vy * RESTITUTION;
//             ball.ay = -ball.ay;
//             ball.y = PLAY_ZONE[1] + ball.radius; // 立刻退回区域内, 暂时不按原路径退回
//         }
//     })
// });

// 添加拖拽规则
hog.addLaw(() => {
    planets.map(ball => hog.draftSimple(ball));
    // planets.map(ball => hog.draftEase(ball, 0.9 / SAMSARA_COUNT));
    // balls.map(ball => hog.bungee(ball, SHOT_POWER, 300));
})

// 添加万有引力定律
hog.addLaw(() => {
    planets.map(ball => ball.ax = ball.ay = 0);
    let entities = planets;
    for (let i = 0; i < entities.length - 1; i++) {
        let entity = entities[i];
        for (var j = i + 1; j < entities.length; j++) {
            let nextEntity = entities[j];
            hog.uGrav(entity, nextEntity, G);
        }
    }
})

// 鼠标引力
hog.addLaw(() => {
    if (hog.mouse.down) {
        let entities = planets;
        for (let i = 0; i < entities.length - 1; i++) {
            let entity = entities[i];
            let blackHole = {
                x: hog.mouse.x,
                y: hog.mouse.y,
                m: 30
            }
            hog.uGrav(entity, blackHole, G);
        }
    }
})

// 开始运行
hog.run();
