//The World
var windowWidth = 700;
var windowHeight = 700;

var world = {
    ctx:null,
    fps:20 //new frame every 0.5 seconds
}
world.init = function()
{
    $('body').append('<canvas id="gameCanvas">');
    var $canvas = $('#gameCanvas');
    $canvas.attr('width', windowWidth);
    $canvas.attr('height', windowHeight);
    var canvas = $canvas[0];
    ctx = canvas.getContext('2d');
    
    world.ctx = ctx;

    world.ctx.strokeStyle = '#fe57a1';
    world.ctx.strokeRect(0, 0, windowWidth-1, windowHeight-1);

    //Escape routes


    snake.init();
    snake.move();
    //Start moving the snake
    //setInterval(snake.move, world.frameLength);
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    window.setTimeout(callback, 100 / 60);
};
})();

//Escape Routs rects
var escapeRects = [];

//The Snake
var snake = {
    blockSize:20,
    direction:"right",
    blocks:[]
}
snake.init = function()
{
    //world.ctx.clearRect(11, 11, windowWidth-13, windowHeight-13); //clear the canvas
    world.ctx.fillStyle = '#fe57a1';

    snake.blocks.push([0,0]);
    snake.blocks.push([20,0]);

    for (var i=0; i<snake.blocks.length; i++)
    {
        var coordinates = snake.blocks[i];
        var x = coordinates[0];
        var y = coordinates[1];

        world.ctx.fillRect(x, y, snake.blockSize, snake.blockSize);
    }
}
snake.move = function()
{
    world.ctx.clearRect(1, 1, windowWidth-2, windowHeight-2); //clear the canvas

    var firstBlock = snake.blocks.splice(0, 0);
    snake.blocks.shift();
    var lastBlock = snake.blocks[snake.blocks.length-1];

    if (snake.direction == "right")
        firstBlock = [lastBlock[0]+snake.blockSize, lastBlock[1]];
    if (snake.direction == "down")
        firstBlock = [lastBlock[0], lastBlock[1]+snake.blockSize];
    if (snake.direction == "left")
        firstBlock = [lastBlock[0]-snake.blockSize, lastBlock[1]];
    if (snake.direction == "up")
        firstBlock = [lastBlock[0], lastBlock[1]-snake.blockSize];
    
    snake.blocks.push(firstBlock);

    for (var i=0; i<snake.blocks.length; i++)
    {
        if (i == snake.blocks.length-1)
            world.ctx.fillStyle = '#000000';
        else
            world.ctx.fillStyle = '#fe57a1';

        var coordinates = snake.blocks[i];
        var x = coordinates[0];
        var y = coordinates[1];

        world.ctx.fillRect(x, y, snake.blockSize, snake.blockSize);
    }

    //Place food at random coordinates
    if (food.x == 0 && food.y == 0)
        food.chooseRandomLocation();
    world.ctx.fillRect(food.x, food.y, food.blockSize, food.blockSize);

    //Detect collision
    snake.detectCollision();

    setTimeout(function() {
        requestAnimationFrame(snake.move);
        // Drawing code goes here
    }, 1000 / world.fps);
}

snake.detectCollision = function()
{
    //Food collision
    var lastBlock = snake.blocks[snake.blocks.length-1];

    if (lastBlock[0] == food.x && lastBlock[1] == food.y)
    {
        snake.blocks.push([food.x, food.y]);

        food.x = 0;
        food.y = 0;   

        if (world.fps < 70)
            world.fps ++;
    }

    //Boundry Collision
    if (lastBlock[0] >= windowWidth)
    {
        console.log("Out");
    }
}

//The Food
food = {

    x:0,
    y:0,
    blockSize:20
}
food.chooseRandomLocation = function()
{
    var randomX = Math.floor((Math.random() * windowWidth) + 0);
    var randomY = Math.floor((Math.random() * windowHeight) + 0);

    //X
    //n-(n%10)
    var modX = randomX % 20;
    var x = randomX-modX;

    //Y
    //n-(n%10)
    var modY = randomY % 20;
    var y = randomY-modY;

    food.x = x;
    food.y = y;

    for (var i=0; i<snake.blocks.length; i++)
    {
        var block = snake.blocks[i];
        if (x == block[0] && y == block[1])
            console.log("On the snake");
    }
}

//The Inputs
$( document ).keypress(function(e) {
    var ch = String.fromCharCode(e.charCode);
    if(e.ctrlKey){
    }else{
        if (ch == "w")
            snake.direction = "up";
        if (ch == "a")
            snake.direction = "left";
        if (ch == "s")
            snake.direction = "down";
        if (ch == "d")
            snake.direction = "right";
    }
});

$(document).ready(function () {

    world.init();

});