const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const numberOfStars = random(100, 150);
const numberOfShootingStars = random(10, 20);
const frequencyOfTwinkle = 180;
const stars = [];
const shootingStars = [];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
    const transparency = random(1, 80) / 100;
    const red = random(40, 120),
        green = random(40, 120),
        blue = random(40, 170);
    return `rgba(${red}, ${green}, ${blue}, ${transparency})`;
}

function createStars() {
    for (let i = 0; i < numberOfStars; i++) {
        stars.push({
            x: random(0, width),
            y: random(0, height),
            size: random(1, 4) / 2,
            color: randomRGB(),
            fadeSpeed: Math.random() * 0.02 + 0.005,
        });
    }
}

let nextShootingStarTime = Date.now();  // 初期値を現在時刻に設定

function drawShootingStars() {
    const currentTime = Date.now();

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        drawObject(star);

        if (isOutBound(star)) {
            shootingStars.splice(i, 1);  // 流れ星を配列から削除
        }
    }

    // 新しい流れ星を生成するタイミングをチェック
    if (currentTime > nextShootingStarTime) {
        createShootingStars();  // 新しい流れ星を生成
        nextShootingStarTime = currentTime + random(5000, 10000);  // 次の生成時刻を設定
    }
}


function createShootingStars() {
    for (let i = 0; i < numberOfShootingStars; i++) {
        shootingStars.push({
            x: random(0, width),
            y: random(0, height),
            size: random(1, 4) / 2,
            color: 'rgb(150,150,255)',
            speed: random(5, 10),
            distance: random(width / 2, width),
            angle: random(0, 360),
            curve: Math.random() * 0.1 + 0.05,
            type: 'shootingStar',
        });
    }
}





function drawObject(object) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.size, 0, Math.PI * 2);
    ctx.fillStyle = object.color;
    ctx.globalAlpha = object.color[3];
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 10;
    ctx.fill();
    if (object.type === 'shootingStar') {
        // Migration of shooting stars
        object.x += Math.cos(object.angle) * object.speed;
        object.y += Math.sin(object.angle) * object.speed;

        // Curved orbit of a shooting star
        object.x += Math.cos(object.angle) * object.curve;
        object.y += Math.sin(object.angle) * object.curve;

        // When a shooting star advances a certain distance, it relocates.
        if (Math.sqrt(Math.pow(object.x - shootingStars[0].x, 2) + Math.pow(object.y - shootingStars[0].y, 2)) > object.distance) {
            object.x = shootingStars[0].x;
            object.y = shootingStars[0].y;
        }
    }
    ctx.restore();
}

function drawStars() {
    for (const star of stars) {
        drawObject(star);
    }
}

function isOutBound(star) {
    return star.x < 0 || star.x > width || star.y < 0 || star.y > height;
}

function background() {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'rgb(5,5,15)';
    ctx.fill();
}

function blinkStars() {
    for (const star of stars) {
        star.color = randomRGB();
    }
}

function fadeOutStars() {
    for (const star of stars) {
        star.color = star.color.replace(/\d?\.?\d+\)$/g, `${Math.max(parseFloat(star.color.match(/\d?\.?\d+\)$/g)[0]) - star.fadeSpeed, 0)})`);
    }
}

let x = 50; // 初期位置X座標
let y = height / 3; // 初期位置Y座標
const radius = 2; // 円の半径
const speed = 2; // 移動速度

function drawOneShootingStar() {
    ctx.beginPath();
    ctx.arc(x + 100, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // X座標を更新して移動
    x += speed;
    y += speed;

    // キャンバスの端に達したら初期位置に戻す
    if (x > width + radius || y > height + radius) {
        x = -radius;
        y = -radius;
    }
}


createStars();
createShootingStars();
background();

let lastBlinkTime = Date.now();

function animate() {
    let currentTime = Date.now();

    if (currentTime - lastBlinkTime > frequencyOfTwinkle) {
        fadeOutStars();
        blinkStars();
        lastBlinkTime = currentTime;
    }

    ctx.clearRect(0, 0, width, height);
    background();
    drawStars();
    drawShootingStars();
    drawOneShootingStar();
    requestAnimationFrame(animate);
}

animate();  // アニメーションの開始