const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

let y = 0;
let yVelocity = 0;
let currentRunningState = 0;
let score = 0;
let highScore = 0;

function render() {
    currentRunningState = !currentRunningState;
    
    context.clearRect(0, 0, width, height);

    yVelocity -= 0.01;
    y += yVelocity
    if(y < 0) {
        y = 0;
    }

    score++;

    context.moveTo(0, height - 50);
    context.lineTo(width, height - 50);
    context.strokeStyle = "#847f86";
    context.stroke();

    if(y > 0) {
        context.drawImage(document.getElementById("dino-texture"), 100, height - 75 - y);
    } else {
        if(currentRunningState) {
            context.drawImage(document.getElementById("dino-running-1-texture"), 100, height - 75 - y);
        } else {
            context.drawImage(document.getElementById("dino-running-2-texture"), 100, height - 75 - y);
        }
    }

    context.textAlign = "right";
    context.textBaseline = "top";
    context.fillText(score, width - 5, 5);
    context.fillText(highScore, width - 10, 5);

    requestAnimationFrame(render);
}

document.addEventListener("keydown", (e) => {
    if(e.code == "Space") {
        if(y == 0) {
            yVelocity = 1.0;
        }
    }
});

render();

