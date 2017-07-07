/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
      win = global.window,
      canvas = doc.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      lastTime;

  canvas.width = 707;
  canvas.height = 707;
  document.getElementById('canvas').appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    win.requestAnimationFrame(main);
  }

  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    // play the intro
    state.intro();
    // reset();
    lastTime = Date.now();
    main();
    // play the background music
    background.play();
    background.volume = 0.1;
  }

  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {
    if (state.gameOn) {
      updateEntities(dt);
      checkCollisions();
      updatePedestalsState();
    }
  }

  /* This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update();
  }

  /* This function checks collision
   */
  function checkCollisions() {
    // Collision detection for bug. Set the width to 50 so player and bug are not going to collide too soon.
    allEnemies.forEach(function(enemy) {
      if (enemy.x < player.x + 50 && enemy.x + 50 > player.x && enemy.y < player.y + 50 && enemy.y + 50 > player.y) {
        // remember '=' is assignment. When at first you use '=', it doesn't work out right.
        if (player.catch === true) {
          // play the punch sound
          punch.play();
          player.numOfPokeballs--;
          // If collision happens, calls the reset() function in engine.js
          player.reset();
          pikachu.reset();
        } else {
          // play the punch sound
          punch.play();
          player.numOfPokeballs--;
          // If collision happens, calls the reset() function in engine.js
          player.reset();
        }
      }
    });

    // Collision detection for pikachu.
    if (pikachu.x < player.x + 50 && pikachu.x + 50 > player.x && pikachu.y < player.y + 50 && pikachu.y + 50 > player.y) {
      // If collision happens, catch number ++ and reset pikachu's location
      pikachu.catched();
      // play the fizzle sound
      fizzle.play();
    }
  }

  /* This functions update states for the pedestals
   * Attribution: https://github.com/Sentry71/arcade
   */
   function updatePedestalsState() {
     // Check if the player has reached the pedestal
     if (player.y < 0) {
       // Check if the pedestal is empty
       var empty = true;
       allPedestals.forEach(function(pedestal) {
         if (player.x === pedestal.x) {
           empty = false;
         }
       });

       // If the pedestal is empty, place the pokeball; Otherwise push player down the row.
       if (empty && player.catch) {
         allPedestals.push(new Pedestal(player.x, pedestalSpriteState.full));
         // play score sound
         points.play();
         // If all pedestals get filled, trigger win state; Otherwise reset the player and update numOfPokeballs
         if (allPedestals.length ===7) {
           // Trigger Win State.
           state.win();
           // Updates the pokeballBar texts.
           var noChild = document.createElement('div'),
               oldChild2 = document.getElementById('child'),
               pokeballBar = document.getElementsByClassName('pokeballBar');
           noChild.id = 'child';
           noChild.innerHTML = 'no pokeball';
           pokeballBar[0].replaceChild(noChild, oldChild2);
         } else {
           player.reset();
           pikachu.reset();
           player.numOfPokeballs--;
         }
       } else {
      // If the pedestal is occupied, then push player down the row.
         player.y +=83;
       }
     }
   }


  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var topRowImages = [
          'images/water-block.png', // First tile of the top row is water
          'images/pedestal.png',    // Second tile of the top row is pedestal
          'images/pedestal.png',    // ..
          'images/pedestal.png',    // ..
          'images/pedestal.png',    // ..
          'images/pedestal.png',    // Sixth tile of the top row is pedestal
          'images/water-block.png'  // Last tile of the top row is water
        ],
        rowImages = [
          // Must put null here so the index works.
          null,
          'images/grass-block.png', // Row 1 of 5 of grass
          'images/grass-block.png', // Row 2 of 5 of grass
          'images/grass-block.png', // Row 3 of 5 of grass
          'images/grass-block.png', // Row 4 of 5 of grass
          'images/grass-block.png', // Row 5 of 5 of grass
          'images/stone-block.png'  // Row 1 of 1 of stone
        ],
        numRows = 7,
        numCols = 7,
        row, col;

    // Create the first row
    for (col = 0; col < numCols; col++) {
      ctx.drawImage(Resources.get(topRowImages[col]), col * 101, 0);
    }

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 1; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /* This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();

    pikachu.render();

    rocks.forEach(function(rock){
      rock.render();
    });

    renderPedestals();
  }

  // This functions renders pedestals.
  function renderPedestals() {
    allPedestals.forEach(function(pedestal) {
      pedestal.render();
    });
  }

  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
    // noop
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/pedestal.png',
    'images/blank.png',
    'images/Rock.png',
    // Image Attribution: https://pixabay.com/en/users/PIRO4D-2707530/
    'images/pokeball-45.png',
    'images/pokeball-20.png',
    // Image Attribution: http://www.pokemon.name
    // Note either pokeball and pikachu-catched is 45X45, and 82 to the top.
    'images/pikachu-catched.png',
    'images/pikachu-catched_pedestal.png',
    // Note all pokemons is 80*80, and 70 to the top.
    'images/pikachu-80.png',
    // Below are the enemies
    'images/Blastoise-80.png',
    'images/Bulbasaur-80.png',
    'images/Charizard-80.png',
    'images/Metapod-80.png',
    'images/Poliwrath-80.png',
    'images/Gliscor-80.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas, canvas' context object, and the reset function to the global variable (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.canvas = canvas;
  global.ctx = ctx;
  global.reset = reset;
})(this);
