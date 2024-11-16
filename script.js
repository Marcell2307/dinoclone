const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

const scaleFactor = 2;
const obstaclesCount = 1;

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

const dinoDucking1Asset = loadAsset("assets/dino/dino_ducking_1.png");
const dinoDucking2Asset = loadAsset("assets/dino/dino_ducking_2.png");

const bird1Asset = loadAsset("assets/bird/bird_1.png");
const bird2Asset = loadAsset("assets/bird/bird_2.png");
const cactus1Asset = loadAsset("assets/cactus/cactus_1.png");
const cactus2Asset = loadAsset("assets/cactus/cactus_2.png");

let dinoPosition = 0;
let dinoVelocity = 0;
let isDucking = false;
let currentRunningState = 0;
let score = 0;

let lastTime = Date.now();
let lastRunningPhaseSwitch = lastTime;
let isRunning = true;
let highScore;

let obstacles = [];

const renderScene = () => {
    let currentTime = Date.now();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    context.font = "24px PixelArtFont";

    if(isRunning) {
        gameScreen(currentTime, deltaTime);
    } else {
        gameOverScreen();
    }

    requestAnimationFrame(renderScene);
}

const init = () => {
    for(let i = 0; i < obstaclesCount; i++) {
        obstacles.push({
            position: width + i * width / obstaclesCount,
            type: Math.floor(Math.random() * 4)
        });
    }

    highScore = localStorage.getItem("highScore");
}

document.addEventListener("keyup", (e) => {
    if (e.code == "ArrowDown") {
        isDucking = false;
    }
})

document.addEventListener("keydown", (e) => {
    if(e.code == "Space" || e.code == "ArrowUp") {
        if(isRunning) {
            if(dinoPosition == 0) {
                dinoVelocity = 4.0;
            }
        } else {
            score = 0;
            lastRunningPhaseSwitch = lastTime;
            obstacles = [];
            isRunning = true;
            
            init();
        }
    } else if (e.code == "ArrowDown") {
        isDucking = true;
    }
});

const gameScreen = (currentTime, deltaTime) => {
    if(lastRunningPhaseSwitch + 100 < currentTime) {
        currentRunningState = !currentRunningState;

        lastRunningPhaseSwitch = currentTime;
    }
    
    context.clearRect(0, 0, width, height);

    dinoVelocity -= 0.01 * deltaTime;
    dinoPosition += dinoVelocity
    if (dinoPosition < 0) {
        dinoPosition = 0;
        dinoVelocity = 0;
    }

    for(let i = 0; i < obstaclesCount; i++) {
        obstacles[i].position -= deltaTime * 1;

        isColliding = false;
        isOnSameHorizontalPosition = obstacles[i].position > 100 && obstacles[i].position < 100 + dinoAsset.width;

        switch(obstacles[i].type) {
            case 0: {
                if(currentRunningState) {
                    context.drawImage(bird1Asset.image, obstacles[i].position, height - 225, bird1Asset.width, bird1Asset.height);
                } else {
                    context.drawImage(bird2Asset.image, obstacles[i].position, height - 225, bird2Asset.width, bird2Asset.height);
                }
                if(isOnSameHorizontalPosition && dinoPosition > 75)
                {
                    isColliding = true;
                }
            } break;
            case 1: {
                if(currentRunningState) {
                    context.drawImage(bird1Asset.image, obstacles[i].position, height - 100, bird1Asset.width, bird1Asset.height);
                } else {
                    context.drawImage(bird2Asset.image, obstacles[i].position, height - 100, bird2Asset.width, bird2Asset.height);
                }
                if(isOnSameHorizontalPosition && dinoPosition < bird1Asset.height)
                {
                    isColliding = true;
                }
            } break;
            case 2: {
                context.drawImage(cactus1Asset.image, obstacles[i].position, height - 115, cactus1Asset.width, cactus1Asset.height);
                if(isOnSameHorizontalPosition && dinoPosition < cactus1Asset.height)
                {
                    isColliding = true;
                }
            } break;
            case 3: {
                context.drawImage(cactus2Asset.image, obstacles[i].position, height - 150, cactus2Asset.width, cactus2Asset.height);
                if(isOnSameHorizontalPosition && dinoPosition < cactus2Asset.height)
                {
                    isColliding = true;
                }
            } break;

        }
        
        if(isColliding) {
            const personalBest = localStorage.getItem("highScore");
            if(score > personalBest) {
                highScore = score;
                localStorage.setItem("highScore", score);
            }

            isRunning = false;
        }

        if(obstacles[i].position < -bird1Asset.width) {
            obstacles[i].position = width;
            obstacles[i].type = Math.floor(Math.random() * 4);
        }
    }

    score += deltaTime * 0.1;

    context.moveTo(0, height - 50);
    context.lineTo(width, height - 50);
    context.strokeStyle = "#847f86";
    context.stroke();

    if(isDucking) {
        if(currentRunningState) {
            context.drawImage(dinoDucking1Asset.image, 100, height - 150 - dinoPosition, dinoDucking1Asset.width, dinoDucking1Asset.height);
        } else {
            context.drawImage(dinoDucking2Asset.image, 100, height - 150 - dinoPosition, dinoDucking2Asset.width, dinoDucking2Asset.height);
        }
    } else {
        if(dinoPosition > 0) {
            context.drawImage(dinoAsset.image, 100, height - 150 - dinoPosition, dinoAsset.width, dinoAsset.height);
        } else {
            if(currentRunningState) {
                context.drawImage(dinoRunning1Asset.image, 100, height - 150 - dinoPosition, dinoRunning1Asset.width, dinoRunning1Asset.height);
            } else {
                context.drawImage(dinoRunning2Asset.image, 100, height - 150 - dinoPosition, dinoRunning2Asset.width, dinoRunning2Asset.height);
            }
        }
    }

    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillText(Math.floor(score), width - 5, 5);
    context.fillText(Math.floor(highScore), width - 5, 29);
}

const gameOverScreen = () => {
    isRunning = false;
    context.clearRect(0, 0, width, height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game over! Your score is " + Math.floor(score), width / 2, height / 2);
    context.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
    init();
    renderScene();
});
