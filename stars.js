const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const numberOfStars = random(100, 1500);
const numberOfShootingStars = random(10, 20);
const frequencyOfTwinkle = 110;
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
    // 設定した数値分の星を配列にpushする関数
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

// function drawStars() {
//     for (const star of stars) {
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//         ctx.fillStyle = star.color;
//         ctx.globalAlpha = star.color[3];
//         //star配列のcolorプロパティのrgbaの'a'を取得している
//         //Refer to 'A' in 'RGBA'
//         ctx.shadowColor = 'white';
//         ctx.shadowBlur = 10;
//         ctx.fill();
//         ctx.globalAlpha = 1;
//     }
// }

function drawStars() {
    for (const star of stars) {
        ctx.save();  // 現在の描画状態を保存

        ctx.beginPath();  // 各星ごとにパスを開始
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.color[3];  // RGBAのアルファ値を使用
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;

        ctx.fill();

        ctx.restore();  // 描画状態を元に戻す（透明度と影の設定をリセット）
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
        });
    }
}

function drawShootingStars() {
    for (const star of shootingStars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;
        ctx.fill();

        // Migration of shooting stars
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        // Curved orbit of a shooting star
        star.x += Math.cos(star.angle) * star.curve;
        star.y += Math.sin(star.angle) * star.curve;

        // When a shooting star advances a certain distance, it relocates.
        if (Math.sqrt(Math.pow(star.x - shootingStars[0].x, 2) + Math.pow(star.y - shootingStars[0].y, 2)) > star.distance) {
            star.x = shootingStars[0].x;
            star.y = shootingStars[0].y;
        }
    }
}

function background() {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fillStyle = 'rgb(5,5,15)';
    ctx.fill();
}

function blinkStars() {
    for (const star of stars) {
        // star.color[3] = random(1, 10) / 10;
        star.color = randomRGB();
    }
}

function fadeOutStars() {
    for (const star of stars) {
        star.color = star.color.replace(/\d?\.?\d+\)$/g, `${Math.max(parseFloat(star.color.match(/\d?\.?\d+\)$/g)[0]) - star.fadeSpeed, 0)})`);
    }
}

createStars();
createShootingStars();
background();

setInterval(() => {
    ctx.clearRect(0, 0, width, height);
    background();
    fadeOutStars();
    blinkStars();
    drawStars();
    drawShootingStars();
}, frequencyOfTwinkle);

//* ランダムに無数のドットを描画
// 色を制限する
// 距離を保つ
// 近い場合は小さい星が暗めになる

//* 背景をセット
// 薄明かり
//// 青み
// 天の川
// 人工衛星や飛行機

//* またたきを追加
//// 生成した星はそのままに透明度のみを変える
// shadowBlurも変化させる
// おだやかなまたたきにする
// フェードアウトさせる

//* 流れ星を追加
// 素早く流す
// 横方向に流れるもの
// 放射状に流れるもの

//* 月を追加

//* プラネタリウム化(動く)