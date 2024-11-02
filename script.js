const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const scaleFactor = 2;

const loadAsset = (path) => {
    const asset = {};
    
    asset.image = new Image();
    asset.image.onload = () => {
        asset.width = asset.image.width / scaleFactor;
        asset.height = asset.image.height / scaleFactor;
    };
    asset.image.src = path;
    
    return asset;
}

const dinoAsset = loadAsset("assets/dino/dino.png");
const dinoRunning1Asset = loadAsset("assets/dino/dino_running_1.png");
const dinoRunning2Asset = loadAsset("assets/dino/dino_running_2.png");

let y = 0;
let yVelocity = 0;
let currentRunningState = 0;
let score = 0;
let highScore = 0;

let lastTime = Date.now();
let lastRunningPhaseSwitch = lastTime;

const renderScene = () => {
    let currentTime = Date.now();;
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if(lastRunningPhaseSwitch + 100 < currentTime) {
        currentRunningState = !currentRunningState;

        lastRunningPhaseSwitch = currentTime;
    }

    
    context.clearRect(0, 0, width, height);

    yVelocity -= 0.01;
    y += yVelocity
    if(y < 0) {
        y = 0;
    }

    score += deltaTime * 0.1;

    context.moveTo(0, height - 50);
    context.lineTo(width, height - 50);
    context.strokeStyle = "#847f86";
    context.stroke();

    if(y > 0) {
        context.drawImage(dinoAsset.image, 100, height - 150 - y, dinoAsset.width, dinoAsset.height);
    } else {
        if(currentRunningState) {
            context.drawImage(dinoRunning1Asset.image, 100, height - 150 - y, dinoRunning1Asset.width, dinoRunning1Asset.height);
        } else {
            context.drawImage(dinoRunning2Asset.image, 100, height - 150 - y, dinoRunning2Asset.width, dinoRunning2Asset.height);
        }
    }

    context.font = "24px PixelArtFont";

    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillText(Math.floor(score), width - 5, 5);

    requestAnimationFrame(renderScene);
}

document.addEventListener("keydown", (e) => {
    if(e.code == "Space") {
        if(y == 0) {
            yVelocity = 1.0;
        }
    }
});

renderScene();

