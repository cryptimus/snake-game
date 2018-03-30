var canvas = document.querySelector('canvas');
var setscore = document.getElementById("score");
var scorecard = document.getElementById("scorecard");
var levelDisplay = document.getElementById("levelDisplay");
var levelInput = document.getElementById("levelInput");
var level = document.getElementsByName('level');
canvas.width = 576;
canvas.height = 576;
var ctx = canvas.getContext('2d');

let speed = 200;
let d;
let step = 32;
let score = 0;
document.addEventListener("keydown",direction);

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        d = "LEFT";
    }
    else if(key == 38 && d != "DOWN"){
        d = "UP";
    }
    else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
    }
    else if(key == 40 && d != "UP"){
        d = "DOWN";
    }
}

//load images
const ground = new Image();
ground.src = "images/snakebg.png";

const foodImg = new Image();
foodImg.src = "images/food.png";

const snakeHead = new Image();
snakeHead.src = "images/snakehead.png";

const snakeBody = new Image();
snakeBody.src = "images/snakebody.png";

//load sounds
let dead = new Audio();
dead.src = "audio/dead.mp3";
let eat = new Audio();
eat.src = "audio/eat.mp3";

//body of snake
function snake(x,y){
    this.x = x;
    this.y = y;
}

//head of snake
let snakeb = [];
snakeb.push(new snake(canvas.width/2,canvas.height/2));

//body of food
function food(){
    this.fx = Math.floor(Math.random()*10)*step ;
    this.fy = Math.floor(Math.random()*10)*step;

    this.drawf = function(){
        ctx.drawImage(foodImg, this.fx, this.fy);
    }
    
}

let f = new food;

function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function setLevel(){
    clearInterval(game);
    var levelValue;
    for(var i = 0; i < level.length; i++){
        if(level[i].checked){
            levelValue = level[i].value;
            levelInput.style.display = 'none';
            break;
        }
    }
    if(levelValue == 'easy'){
        speed = 300;
        levelDisplay.innerHTML = 'Easy';
    }
    else if(levelValue == 'medium'){
        speed = 200; 
        levelDisplay.innerHTML = 'Medium';       
    }
    else if(levelValue == 'hard'){
        speed = 100;
        levelDisplay.innerHTML = 'Hard';
    }
    game = setInterval(animate,speed);
}



//main function
function animate(){

    //draw ground
    ctx.drawImage(ground,0,0);

    //draw snake
    for(let i = 0; i<snakeb.length ; i++){
        
        let snakeimg = (i==0)? snakeHead : snakeBody;
        ctx.drawImage(snakeimg,snakeb[i].x,snakeb[i].y);
    }

    //draw food
    f.drawf();

    //position of head
    let headx =snakeb[0].x;
    let heady =snakeb[0].y;

    //direction of snake & update head
    if( d == "LEFT") headx -=  step;
    if( d == "UP") heady -= step;
    if( d == "RIGHT") headx +=  step;
    if( d == "DOWN") heady +=  step;

    let newhead = new snake(headx,heady);

    //snake eats food
    if(headx == f.fx && heady == f.fy){
        eat.play();
        score++;
        setscore.innerHTML = score;
        f.fx = Math.floor(Math.random()*10)*step ;
        f.fy = Math.floor(Math.random()*10)*step;

        for(let i = 0; i < snakeb.length; i++){
            if(f.fx == snakeb[i].x && f.fy == snakeb[i].y){
                f.fx = Math.floor(Math.random()*10)*step ;
                f.fy = Math.floor(Math.random()*10)*step;
            }
            

        }
        
    }
    else{
        snakeb.pop()
    }

    if(headx < 0 || headx > canvas.width || heady < 0 || heady > canvas.height || collision(newhead,snakeb)){
        dead.play();
        clearInterval(game);
        scorecard.style.visibility = 'hidden';
        ctx.fillStyle = 'red';
        ctx.font = "70px Arial";
        ctx.fillText("GAME OVER", 70, 300); 
        ctx.strokeStyle = 'yellow';
        ctx.strokeText("GAME OVER", 70, 300);
        ctx.fillStyle = 'black'; 
        ctx.font = "50px Arial";
        ctx.fillText("Your Score", 170, 350);
        ctx.fillText(score, 270, 400); 
    }

    snakeb.unshift(newhead);
}
let game = setInterval(animate,150);


