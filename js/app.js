/* app.js
 * This files defines all the Classes and functions.
 */

// Set the data for objects
var data = {
    "Y_POSITIONS": [65, 148, 233, 316, 399],
    "BUG_MIN_STARTING_X": -505,
    "BUG_MAX_STARTING_X": -101,
    "BUG_MIN_SPEED": 100,
    "BUG_MAX_SPEED": 300,
    "PLAYER_STARTING_X": 303,
    "PLAYER_STARTING_Y": 485
};

var spriteList = [
  "img/Blastoise-80.png",
  "img/Bulbasaur-80.png",
  "img/Charizard-80.png",
  "img/Metapod-80.png",
  "img/Poliwrath-80.png",
  "img/Gliscor-80.png",
]

// This object manages game state
var State = function() {

};

// Enemies our player must avoid
var Enemy = function(sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;
    // a new bug will have a random starting x position
    this.x = randomInt(data.BUG_MIN_STARTING_X, data.BUG_MAX_STARTING_X);
    // a new bug will be randomly positioned in one of the three lanes
    this.y = data.Y_POSITIONS[randomYPosition()];
    // a new bug will have a random speed
    this.speed = randomInt(data.BUG_MIN_SPEED, data.BUG_MAX_SPEED);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    //This code below help the bug to start over again. Use canvas.width instead of a fixed number incase the width changes
    if (this.x >= canvas.width) {
        this.x = randomInt(data.BUG_MIN_STARTING_X, data.BUG_MAX_STARTING_X);
        this.y = data.Y_POSITIONS[randomYPosition()];
        this.speed = randomInt(data.BUG_MIN_SPEED, data.BUG_MAX_SPEED);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'img/pokeball-45.png';
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y;
    this.lives = 5;
    this.wins = 0;
};

// This function takes an input from an event listener of the keyboard arrow keys, and change the location of the player according to the input.
Player.prototype.handleInput = function(input) {
    switch (input) {
        case 'left':
            if (this.x >= 101) {
                this.x = this.x - 101;
            } else {
                break;
            }
            break;
        case 'up':
            if (this.y >= 153) {
                this.y = this.y - 83;
            } else if (this.y === 70) {
                //If the player reaches the river, the number of wins increases, and play goes back to the starting point
                this.wins++;
                this.reset();
            }
            break;
        case 'right':
            if (this.x <= 505) {
                this.x = this.x + 101;
            } else {
                break;
            }
            break;
        case 'down':
            if (this.y <= 402) {
                this.y = this.y + 83;
            } else {
                break;
            }
            break;
    }
};

// This function checks if the player's live is 0; if so, it hard reset the state of the game.
Player.prototype.update = function() {
    if (this.lives === 0) {
        window.alert("Game over!");
        document.location.reload();
    }
};

// This function renders the player in each frame. It also shows the lives and wins of the players. Attribution: https://discussions.udacity.com/t/is-it-possible-to-use-ctx-filltext-to-display-score-and-lives/193866
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = '20px Sans serif';
    ctx.fillText('Lives: ' + this.lives, 40, 100);
    ctx.fillText('Wins: ' + this.wins, 150, 100);
};

// Each time this function is called, the player goes back to the original starting location.
Player.prototype.reset = function() {
    this.x = data.PLAYER_STARTING_X;
    this.y = data.PLAYER_STARTING_Y;
}

/* Create pikachu to be catched by the player
 *
 */
var Pikachu = function() {
    // Image Attribution: http://www.pokemon.name
    this.sprite = 'img/pikachu-80.png';
};


// When player collide with pikachu, pikachu will disappear from the screen
Pikachu.prototype.catch = function() {
    this.visibility = false;
    // Move this pikachu off screen.
    this.x = -101;
};

// Make pikachu appear on the canvas again
Pikachu.prototype.reset = function() {
    this.visibility = true;
    this.x = randomInt(0, 6) * 101;
    this.y = data.Y_POSITIONS[randomYPosition()];
};

// Draw this pikachu on the canvas
Pikachu.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
for (var i = 0; i < spriteList.length; i++) {
    allEnemies.push(new Enemy(spriteList[i]));
}
var player = new Player();
// declare a new pikachu and give it a random location
var pikachu = new Pikachu();
pikachu.reset();

// Create random integers between min and max, inclusive.
function randomInt(min, max) {
    // Math.floor() returns the largest integer less than or equal to a given number
    // Math.random() return [0, 1)
    // So to be inclusive of min and max, you need to add 1 to the multiplier
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// This function is used for randomly returning an integer of 0, 1, or 2, 3, 4, which will be used for picking a random y position
function randomYPosition() {
    return Math.floor(Math.random() * 5);
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
