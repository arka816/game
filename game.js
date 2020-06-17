var maincanvas, overlaycanvas, context, gamePiece;
var gameAreaWidth = 400, gameAreaHeight = 400;
var obstructionWidth = 20;
var obstructionArr = [];
var scoreboard, score=0;
var gameStatus = true;
var keycode;


function gamepiece(width, height, color, x, y){
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.update = function(){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

function obstruction(x, y, end, start, color){
    this.x=x;
    this.y = y;
    this.color = color;
    this.end=end;
    this.start = start;
    this.update = function(){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, obstructionWidth, this.end);
        context.fillRect(this.x, this.start, obstructionWidth, gameAreaHeight - this.start);
    }
}

function reloadWindow(){
    window.location.reload();
}

function stop(){
    gameStatus = false;
    overlaycanvas.style.backgroundColor = "rgba(20, 20, 20, 0.8)";
    document.getElementById('restart').style.visibility = "visible";
}
function resume(){
    gameStatus = true;
    overlaycanvas.style.backgroundColor = "transparent";
    document.getElementById('restart').style.visibility = "hidden";
}

function clearScreen(){
    context.clearRect(0, 0, gameAreaWidth, gameAreaHeight);
}

function handleKey(event){
    keycode = event.which || event.keyCode;
    if(keycode === 37) moveGamePieceH(-5);
    else if(keycode === 38) moveGamePieceV(-5);
    else if(keycode === 39) moveGamePieceH(5);
    else if(keycode === 40) moveGamePieceV(5);

}

function moveGamePieceV(n){
    if(gameStatus && gamePiece.y + n >= 0 && gamePiece.y + n <= gameAreaHeight - gamePiece.height){
        gamePiece.y += n;
        clearScreen();
        gamePiece.update();
        for(obs in obstructionArr){
            obstructionArr[obs].update();
        }
    }
}

function moveGamePieceH(n){
    if(gameStatus && gamePiece.x + n >= 0 && gamePiece.x + n <= gameAreaWidth - gamePiece.width){
        gamePiece.x += n;
        clearScreen();
        gamePiece.update();
        for(obs in obstructionArr){
            obstructionArr[obs].update();
        }
    }
}

function generateObstruction(){
    setInterval(function(){
        if(gameStatus){
            end = 60 + Math.floor(180 * Math.random());
            start = end + 100;
            obs = new obstruction(gameAreaWidth, 0, end, start, 'green');
            obstructionArr.push(obs);
            obs.update();
        }
    }, 4000);
}

function animateObstruction(){
    setInterval(function(){
        if(gameStatus){
            clearScreen();
            for(obs in obstructionArr){
                obstructionArr[obs].x -= 1;
                obstructionArr[obs].update();
            }
            gamePiece.update();
        }
    }, 25)
}

function deleteObstruction(){
    setInterval(function(){
        if(gameStatus) obstructionArr.shift();
    }, 4000);
}

function updateScore(){
    setInterval(function(){
        if(gameStatus){
            score += 5;
            scoreboard.innerHTML = "Score: " + score;
        }
    }, 100);
}

function checkCollision(){
    setInterval(function(){
        if(gameStatus){
            for(obs in obstructionArr){
                if(gamePiece.x + gamePiece.width == obstructionArr[obs].x){
                    if(gamePiece.y <= obstructionArr[obs].end || gamePiece.y >= obstructionArr[obs].start - 40){
                        stop();
                        break;
                    }
                }
            }
        }
    }, 25);
}

function loadObjects(){
    maincanvas = document.getElementsByTagName('canvas')[0];
    overlaycanvas = document.getElementsByTagName('canvas')[1];
    scoreboard = document.getElementById('scoreboard');
    maincanvas.width = gameAreaWidth;
    maincanvas.height = gameAreaHeight;
    context = maincanvas.getContext('2d');

    gamePiece = new gamepiece(40, 40, "red", 0, 180);
    gamePiece.update();

    generateObstruction();
    setTimeout(animateObstruction, 4000);
    setTimeout(deleteObstruction, 12000);
    setTimeout(updateScore, 3000);
    setTimeout(checkCollision, 3000);
}