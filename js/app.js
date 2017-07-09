/* app.js
 * This files defines all the Classes and functions.
 */

// Set the data for objects.
var data = {
  'Y_POSITIONS': [65, 148, 231, 314, 397],
  'ENEMY_MIN_STARTING_X': -505,
  'ENEMY_MAX_STARTING_X': -101,
  'ENEMY_MIN_SPEED': 100,
  'ENEMY_MAX_SPEED': 300,
  'PLAYER_STARTING_X': 303,
  'PLAYER_STARTING_Y': 480,
  'NUM_OF_POKEBALLS': 5
};

// Set the ememy sprite list.
var enemySpriteList = [
  'images/Blastoise-80.png',
  'images/Bulbasaur-80.png',
  'images/Charizard-80.png',
  'images/Metapod-80.png',
  'images/Poliwrath-80.png',
  'images/Weezing-80.png',
  'images/Gliscor-80.png'
];

var gemSpriteList = [
  'images/Psyduck-80.png',
  'images/Psyduck-80.png',
  'images/Snorlax-80.png'
];

// Set shrine sprite state to be either empty or full.
var shrineSpriteState = {
  empty: 'images/blank.png',
  full: 'images/pikachu-catched_shrine.png'
};

// About audio: http://www.w3school.com.cn/jsref/dom_obj_audio.asp
// About audio: https://stackoverflow.com/questions/9419263/playing-audio-with-javascript
// Sound attribution: [Background music: Imagine My Shock by SukiWukiDookie](http://www.newgrounds.com/audio/listen/751384)
// Sound attribution: [Sound effects: By Sound Bible](http://soundbible.com/free-sound-effects-1.html)
    // when you catch pikachu
var  fizzle = new Audio('sounds/fizzle.mp3'),
    // when you hit an enemy
     punch = new Audio('sounds/punch.mp3'),
    // when you put pokeball inside a shrine
     points = new Audio('sounds/points.mp3'),
    // when you catch snorlax
     gemCollected = new Audio('sounds/gem.mp3'),
    // when you win
     achievement = new Audio('sounds/achievement.mp3'),
    // when you lose
     failMusic = new Audio('sounds/gong.mp3'),
    // background music
     background = new Audio('sounds/background.mp3');
background.loop = true;

/* This Class manages game state.
 *
 */
var State = function() {
  this.gameOn = false;
};

// When game starts, play this function. Since gameOn is false, the update() does not updates, but render() renders. Therefore you need to hide pikachu and pokeball. And waits for player to click the play button.
State.prototype.intro = function() {
  // No need to hide the enemies because they are all off-screen somewhere between x=-101 and x=-505; Also no need to hide rocks because the list is not filled yet.
  pikachu.hide();
  player.hide();
};

State.prototype.restart = function() {
  // set the game state to be on so that the main function starts updateing.
  this.gameOn = true;
  // Since player and Pikachu are purposefully hidden, now show them.
  player.reset();
  // Instantiate the rocks. Numbers of rocks.
  for (var i=0; i < randomInt(2,3); i++){
    rocks.push(new Obstacle());
  }
  // Instantiate the gems. Number of Gems. No need to worry about gems coinciding with rocks. You will hide it on the rendering level.
  for (var j=0; j < randomInt(1,2); j++){
    gems.push(new Gem());
  }
  // Set pikachu's location after rocks and gems have been placed.
  pikachu.reset();
  // re-fill the allEnemies list.
  // Don't make JavaScript read the length of an array at every iteration of a for loop. Store the length value in a different variable.
  for (var a = 0, b = enemySpriteList.length; a < b; a++) {
    allEnemies.push(new Enemy(enemySpriteList[a]));
  }
  // re-fill the pokeballBar.
  player.numOfPokeballs=data.NUM_OF_POKEBALLS;
};

// When player runs out of pokeball, this function gets executed.
State.prototype.lose = function() {
  // First set state.gameOn to false, so the game stops updating.
  this.gameOn=false;
  // clear all objects off the canvas.
  allEnemies = [];
  // Don't forget to stuff the first and last tile of shrines. Otherwise after your first win, you will have to fill the first and second tile.
  allShrines = [];
  allShrines.push(new Shrine(0, shrineSpriteState.empty));
  allShrines.push(new Shrine(606, shrineSpriteState.empty));
  pikachu.hide();
  player.hide();
  rocks = [];
  gems = [];
  // make the lose page show
  document.getElementById('lose').classList.toggle('hidden');
  // Stop the background music, play the fail music, and then play background music again.
  background.pause();
  failMusic.play();
  setTimeout('background.play()',3000);
};

// When player fill all shrines, this function gets executed.
State.prototype.win = function() {
  // if win, first stop update() from updating.
  this.gameOn=false;
  // clear all objects off the canvas.
  allEnemies = [];
  // Don't forget to stuff the first and last tile of shrines. Otherwise after your first win, you will have to fill the first and second tile.
  allShrines = [];
  allShrines.push(new Shrine(0, shrineSpriteState.empty));
  allShrines.push(new Shrine(606, shrineSpriteState.empty));
  pikachu.hide();
  player.hide();
  rocks = [];
  gems = [];
  // make the win page show.
  document.getElementById('win').classList.toggle('hidden');
  // Stop the background music, play the achievement music, and then play background music again.
  background.pause();
  achievement.play();
  setTimeout('background.play()',2000);
};


/* Enemies our player must avoid.
 *
 */
var Enemy = function(sprite) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started.

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images.
  this.sprite = sprite;
  // the reset function will reset the enemy's position.
  this.reset();
};

// Update the enemy's position, required method for game.
// Parameter: dt, a time delta between ticks.
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = this.x + this.speed * dt;
  //This code below help the enemy to start over again. Use canvas.width instead of a fixed number incase the width changes.
  if (this.x >= canvas.width) {
    this.reset();
  }
};

// Reset the enemy's position.
Enemy.prototype.reset = function() {
  // a new enemy will have a random starting x position.
  this.x = randomInt(data.ENEMY_MIN_STARTING_X, data.ENEMY_MAX_STARTING_X);
  // a new enemy will be randomly positioned in one of the three lanes.
  this.y = data.Y_POSITIONS[randomInt(0, 4)];
  // a new enemy will have a random speed.
  this.speed = randomInt(data.ENEMY_MIN_SPEED, data.ENEMY_MAX_SPEED);
};

// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Now write your own player class.
 *
 */
var Player = function() {
  this.sprite = 'images/pokeball-45.png';
  this.x = data.PLAYER_STARTING_X;
  this.y = data.PLAYER_STARTING_Y;
  this.catch = false;
  this.numOfPokeballs = data.NUM_OF_POKEBALLS;
};


// Each time this function is called, the player goes back to the original starting location.
Player.prototype.reset = function() {
  this.sprite = 'images/pokeball-45.png';
  this.x = data.PLAYER_STARTING_X;
  this.y = data.PLAYER_STARTING_Y;
  this.catch = false;
};

// This function takes an input from an event listener of the keyboard arrow keys, and change the location of the player according to the input.
Player.prototype.handleInput = function(input) {
  var self=this;
  // Collision detection for obstacles must be put inside handleInput function.
  switch (input) {
    case 'left':
      if (self.x >= 101) {
        self.x = self.x - 101;
      }
      // run through each rock to see if it conincides with player.
      rocks.forEach(function(rock){
        if (self.x === rock.x && self.y === rock.y) {
          self.x += 101;
        }
      });
      break;
    case 'up':
      // No matter the player catches pikachu or not, he can goes up to the second row.
      if (self.y >= 148) {
        self.y = self.y - 83;
        // When at second row, if the player catches pikachu, he can go a step further. Now hands to updateShrinesState() to handle player.
      } else if (self.y === 65 && self.catch === true) {
        self.y = self.y -83;
      }
      // run through each rock to see if it conincides with player.
      rocks.forEach(function(rock){
        if (self.x === rock.x && self.y === rock.y) {
          self.y += 83;
        }
      });
      break;
    case 'right':
      if (self.x <= 505) {
        self.x = self.x + 101;
      }
      // run through each rock to see if it conincides with player.
      rocks.forEach(function(rock){
        if (self.x === rock.x && self.y === rock.y) {
          self.x -= 101;
        }
      });
      break;
    case 'down':
      if (self.y <= 397) {
        self.y = self.y + 83;
      }
      // run through each rock to see if it conincides with player.
      rocks.forEach(function(rock){
        if (self.x === rock.x && self.y === rock.y) {
          self.y -= 83;
        }
      });
      break;
  }
};

// Updates the number of Pokeballs left. When the number is 0, execute state.lose().
// Attribution: https://github.com/Klammertime/P3-Classic-Arcade-Game-Clone
Player.prototype.update = function() {
  // getElementsByClassName returns a NodeList.
  var pokeballBar = document.getElementsByClassName('pokeballBar'),
  // Since you are going to use replaceChild() method, you have to grab the old child and create a new child.
  // https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild.
      oldChild = document.getElementById('child'),
      newChild = document.createElement('div'),
      img;
      // must have this line of code below, so that in a loop, the 'old' child will always have that ID.
      newChild.id = 'child';
  for (var i=0; i < this.numOfPokeballs; i++) {
    // HTML5 Constructor
    img = new Image();
    img.src = 'images/pokeball-20.png';
    img.alt = 'pokeball';
    newChild.appendChild(img);
  }
  // Since pokeballBar is a NodeList and it has only one element. Therefore you have to add to its first element.
  pokeballBar[0].replaceChild(newChild, oldChild);
  // when the number is 0, reset the game.
  if (this.numOfPokeballs === 0) {
    // Trigger Lose state.
    state.lose();
    // Updates the numOfPokeballs bar texts.
    var noChild = document.createElement('div'),
        oldChild2 = document.getElementById('child');
    noChild.id = 'child';
    noChild.innerHTML = 'no pokeball';
    pokeballBar[0].replaceChild(noChild, oldChild2);
  }
};

Player.prototype.hide = function() {
  this.x = -101;
};

// This function renders the player in each frame. It also shows the number of pokeballs a player has. Attribution: https://discussions.udacity.com/t/is-it-possible-to-use-ctx-filltext-to-display-score-and-lives/193866
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Declare Pikachu Class, which is to be catched by the player.
 *
 */
var Pikachu = function() {
  // Image Attribution: http://www.pokemon.name
  this.sprite = 'images/pikachu-80.png';
  this.x = randomInt(0, 6) * 101;
  this.y = data.Y_POSITIONS[randomInt(0,4)];
};


// When player collide with pikachu, pikachu will disappear from the screen.
Pikachu.prototype.catched = function() {
  player.catch = true;
  // Change the sprite to pikachu-catched.
  player.sprite = 'images/pikachu-catched.png';
  // Move this pikachu off screen.
  this.x = -101;
};

// Make pikachu appear on the canvas again.
Pikachu.prototype.reset = function() {
  this.x = randomInt(0, 6) * 101;
  this.y = data.Y_POSITIONS[randomInt(0,4)];
  // If pikachu's location conincides with rock's, then reset again. If not, try next loop.
  for (var i=0, j = rocks.length; i < j; i++){
    if (pikachu.x === rocks[i].x) {
      this.reset();
    }
  }
  // If pikachu's location conincides with gem's, then reset again.
  for (var a=0, b = gems.length; a < b; a++){
    if (pikachu.x === gems[a].x) {
      this.reset();
    }
  }
};

Pikachu.prototype.hide = function() {
  this.x = -101;
};

// Draw this pikachu on the canvas.
Pikachu.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Declare Obstacle Class.
 * It basically needs all propertities of Pikachu class except catched(); You are not going to use catched() anyway.
 * Therefore make it a subclass of Pikachu. Only change its sprite and its range of Y coordinates.
 */
var Obstacle = function() {
  Pikachu.call(this);
  this.sprite = 'images/Rock.png';
  // The Obstacle cannot be in the first row of grass, otherwise it would block player.
  this.y = data.Y_POSITIONS[randomInt(1,4)];
};

Obstacle.prototype = Object.create(Pikachu.prototype);
Obstacle.prototype.constructor = Pikachu;

/* Declare Gem Class.
 * It also needs all propertities of Pikachu class. Therefore make it a subclass of Pikachu.
 */
var Gem = function() {
  Pikachu.call(this);
  this.sprite = gemSpriteList[randomInt(0, 2)];
  this.y = data.Y_POSITIONS[randomInt(1,4)];
};

Gem.prototype = Object.create(Pikachu.prototype);
Gem.prototype.constructor = Pikachu;

/* Declare Shrine Class.
 *
 */
var Shrine = function(x, sprite) {
  this.x = x;
  this.y = 0;
  this.sprite = sprite;
};

//Draw pokeball on scoring row.
Shrine.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Now instantiate your objects.
 * Place all enemy objects in an array called allEnemies.
 * Place the player object in a variable called player.
 */
var state = new State(),
    player = new Player(),
    pikachu = new Pikachu(),
    rocks = [],
    gems = [],
    allEnemies = [],
    allShrines = [];
// Since the first and last tile are waters. Fill the shrine list with black image in these two tiles.
allShrines.push(new Shrine(0, shrineSpriteState.empty));
allShrines.push(new Shrine(606, shrineSpriteState.empty));

/* Helper functions below.
 *
 */
// Create random integers between min and max, inclusive.
function randomInt(min, max) {
  // Math.floor() returns the largest integer less than or equal to a given number.
  // Math.random() return [0, 1).
  // So to be inclusive of min and max, you need to add 1 to the multiplier.
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/* This listens for key presses and sends the keys to your.
 * Player.handleInput() method. You don't need to modify this.
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

/* When the musicButton gets clicked, the music turns on or off. And the button changes texts.
 *
 */
var musicButton = document.getElementById('musicButton');
musicButton.onclick = function() {
  if (musicButton.classList.contains('music')){
    background.pause();
    musicButton.classList.toggle('music');
    musicButton.innerHTML = "MUSIC OFF";
  } else {
    background.play();
    musicButton.classList.toggle('music');
    musicButton.innerHTML = "MUSIC ON";
  }
};

/* Add event listener for play and play again.
 *
 */
// In the intro page, when pressing the play button, game starts.
document.getElementById('play').onclick = function() {
  // make the menu page disappear.
  document.getElementById('menu').classList.toggle('hidden');
  // Show the pokeballBar.
  (document.getElementsByClassName('pokeballBar'))[0].classList.toggle('hidden');
  // make the background music louder.
  background.volume = 0.4;
  state.restart();
};

// In the lose page, when pressing the playAgain button, restart the game.
document.getElementById('playAgain').onclick = function() {
  // make the lose page hide again.
  document.getElementById('lose').classList.toggle('hidden');
  state.restart();
};

// In the win page, when pressing the playAgain button, restart the game.
document.getElementById('winAgain').onclick = function() {
  // make the win page hide again.
  document.getElementById('win').classList.toggle('hidden');
  state.restart();
};
