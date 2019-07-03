/*
=================================================================
 (                              (       *             (            
 )\ )  *   )                    )\ )  (  `     (      )\ )  *   )  
(()/(` )  /( (    (   (   (    (()/(  )\))(    )\    (()/(` )  /(  
 /(_))( )(_)))\   )\  )\  )\    /(_))((_)()\((((_)(   /(_))( )(_)) 
(_)) (_(_())((_) ((_)((_)((_)  (_))  (_()((_))\ _ )\ (_)) (_(_())  
/ __||_   _|| __|\ \ / / | __| / __| |  \/  |(_)_\(_)| _ \|_   _|  
\__ \  | |  | _|  \ V /  | _|  \__ \ | |\/| | / _ \  |   /  | |    
|___/  |_|  |___|  \_/   |___| |___/ |_|  |_|/_/ \_\ |_|_\  |_|
=================================================================
*/

// ==========================
// Begin function definitions
// ==========================

// -----------------------------------------------
// Animates centerpiece text with colorful letters
// -----------------------------------------------
function colorizeCenterpieceText() {
    var color1 = '#F44336';
    var color2 = '#009688';
    var color3 = '#FF9800';
    var color4 = '#4CAF50';
    var color5 = '#9C27B0';
    var color6 = '#3F51B5';

    var textColors = [color1, color2, color3, color4, color5, color6, color1, color3, color4, color5];
    textColorsShuffled = shuffle(textColors);

    $('#centerpiece span').each(function(index, span) {
        span.style = 'color: ' + textColorsShuffled[index];
    });
}

// -----------------------------------------------
// Detects if the current device is a touch screen
// -----------------------------------------------
function isTouchDevice() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function(query) {
        return window.matchMedia(query).matches;
    }

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

// ===============================
// Begin PIXI function definitions
// ===============================

// -----------------------
// Mage object constructor
// -----------------------
function Mage() {

    // ------
    // Fields
    // ------

    this.mobileScale = 0.05;
    this.tabletScale = 0.19;
    this.desktopScale = 0.25;

    this.maxXSpeed = 6;
    this.xAcceleration = 1.5;
    this.jumpSpeed = 13;

    this.leftPressed = false;
    this.rightPressed = false;
    this.jumpPressed = false;

    this.dead = false;

    this.yResizeOffset = 0;

    this.sprite = null;

    this.instructions = null;

    this.images = {
        walkingRight: ['/img/sprites/mage_right.png'],
        walkingLeft: ['/img/sprites/mage_left.png'],
        castingRight: ['/img/sprites/mage_cast_right0.png',
                       '/img/sprites/mage_cast_right0.png',
                       '/img/sprites/mage_cast_right1.png'],
        castingLeft: ['/img/sprites/mage_cast_left0.png',
                      '/img/sprites/mage_cast_left0.png',
                      '/img/sprites/mage_cast_left1.png']
    };

    this.textures = {
        walkingRight: [],
        walkingLeft: [],
        castingRight: [],
        castingLeft: []
    };

    this.defaultTextures = this.textures.walkingRight;

    // -------
    // Methods
    // -------

    this.reScale = function() {
        if ($(window).width() <= MOBILE_MAX_WIDTH) {
            this.sprite.scale.set(this.mobileScale);
        }
        else if ($(window).width() <= TABLET_MAX_WIDTH) {
            this.sprite.scale.set(this.tabletScale);
        }
        else {
            this.sprite.scale.set(this.desktopScale);
        }
    };

    this.update = function() {
        if ((this.leftPressed == true) && (this.rightPressed == false)) {
            if (this.sprite.textures == this.textures.walkingRight) {
                this.sprite.textures = this.textures.walkingLeft;
            }
            this.sprite.ax = -this.xAcceleration;
        }
        else if ((this.leftPressed == false) && (this.rightPressed == true)) {
            if (this.sprite.textures == this.textures.walkingLeft) {
                this.sprite.textures = this.textures.walkingRight;
            }
            this.sprite.ax = this.xAcceleration;
        }
        else {
            this.sprite.ax = 0;
        }

        if (this.sprite.vy == 0) { 
            this.jumping = false;
        }
        else {
            this.jumping = true;
        }

        if (this.sprite.vx < 0) {
            this.sprite.vx += this.sprite.ax + FRICTION;
            if (this.sprite.vx < -(this.maxXSpeed)) {
                this.sprite.vx = -this.maxXSpeed;
            }
        }
        else if (this.sprite.vx > 0) {
            this.sprite.vx += this.sprite.ax - FRICTION;
            if (this.sprite.vx > this.maxXSpeed) {
                this.sprite.vx = this.maxXSpeed;
            }
        }
        else {
            this.sprite.vx += this.sprite.ax;
        }

        this.sprite.vy += this.sprite.ay + GRAVITY;

        this.sprite.x += this.sprite.vx;
        this.sprite.y += this.sprite.vy;

        if (this.instructions != null) {
            this.instructions.update();
        }

        this.checkCollision();
    };

    this.updateOnResize = function() {
        let xPositionRatio = this.sprite.x / app.renderer.view.width;
        let yPositionRatio = this.sprite.y / app.renderer.view.height;

        this.reScale();

        if ((app.renderer.view.width <= MOBILE_MAX_WIDTH) && ($(window).width() > MOBILE_MAX_WIDTH)) {
            this.yResizeOffset = 15;
        }
        else if ((app.renderer.view.width <= TABLET_MAX_WIDTH) && ($(window).width() > TABLET_MAX_WIDTH)) {
            this.yResizeOffset = 45;
        }
        else if ((app.renderer.view.width <= MOBILE_MAX_WIDTH) && ($(window).width() > TABLET_MAX_WIDTH)) {
            this.yResizeOffset = 85;
        }
        else {
            this.yResizeOffset = 0;
        }

        this.sprite.x = xPositionRatio * $(window).width();
        this.sprite.y = (yPositionRatio * $(window).height()) - this.yResizeOffset;

        if (this.instructions != null) {
            this.instructions.updateOnResize();
        }
    };

    this.checkCollision = function() {
        let centerpieceOffset = $('#centerpiece').offset();
        let centerPieceTopPosition = centerpieceOffset.top + 5;
        let centerpieceLeftPosition = centerpieceOffset.left;
        let centerpieceRightPosition = centerpieceOffset.left + $('#centerpiece').width();
        let centerpieceBottomPosition = centerpieceOffset.top + $('#centerpiece').height();
        let centerpieceTopCollisionOffset = 16;
        let blastZoneBottomOffset = 50;
        
        if (((this.sprite.x + (this.sprite.width / 2)) > centerpieceLeftPosition) && ((this.sprite.x - (this.sprite.width / 2)) < centerpieceRightPosition)) {
            if ((this.sprite.y >= centerPieceTopPosition) && (this.sprite.y <= centerpieceBottomPosition) && (this.sprite.y < (centerPieceTopPosition + centerpieceTopCollisionOffset))) {
                this.sprite.y = centerPieceTopPosition;
                this.sprite.vy = 0;
            }
        }

        if ((this.sprite.y > centerPieceTopPosition) && (this.sprite.y - this.sprite.height) < centerpieceBottomPosition) {
            if (((this.sprite.x + (this.sprite.width / 2)) > centerpieceLeftPosition) && (this.sprite.x < ($(window).width() / 2))) {
                this.sprite.x = centerpieceLeftPosition - (this.sprite.width / 2);
                this.sprite.vx = 0;
            }
            else if (((this.sprite.x - (this.sprite.width / 2)) < centerpieceRightPosition) && (this.sprite.x >= ($(window).width() / 2))) {
                this.sprite.x = centerpieceRightPosition + (this.sprite.width / 2);
                this.sprite.vx = 0;
            }
        }

        if ((this.sprite.y - this.sprite.height - blastZoneBottomOffset) > $(window).height()) {
            this.kill();
        }
    };

    this.kill = function() {
        app.stage.removeChild(this.sprite);

        this.dead = true;

        if (this.instructions != null) {
            app.stage.removeChild(this.instructions.sprite);
            this.instructions.sprite = null;
            this.instructions = null;
        }

        if (playSound) {
            deathSound.pause();
            deathSound.currentTime = 0;
            deathSound.play();
        }
    };

    this.revive = function() {
        this.sprite.x = (app.renderer.view.width / 2);
        this.sprite.y = ($('#centerpiece').offset().top + 5);
        this.sprite.vx = 0;
        this.sprite.vy = 0;
        this.sprite.ax = 0;
        this.sprite.ay = 0;
        this.dead = false;

        app.stage.addChild(this.sprite);
    }

    this.jump = function() {
        this.sprite.vy = -this.jumpSpeed;
    };

    this.castSpell = function(targetX, targetY) {
        this.sprite.loop = false;
        this.sprite.onComplete = function() {
            if (mage != null) {
                if (mage.sprite.textures == mage.textures.castingRight) {
                    mage.sprite.textures = mage.textures.walkingRight;
                }
                else {
                    mage.sprite.textures = mage.textures.walkingLeft;
                }
            }
        };
        if (targetX >= this.sprite.x) {
            this.sprite.textures = this.textures.castingRight;
            this.sprite.play();
        }
        else {
            this.sprite.textures = this.textures.castingLeft;
            this.sprite.play();
        }

        spell = new Spell(this, targetX, targetY);
        spell.init();
    };

    this.init = function() { 
        for (let key in this.images) {
            for (let i = 0; i < this.images[key].length; i++) {
                this.textures[key].push(Texture.from(this.images[key][i]));
            }
        }

        this.sprite = new AnimatedSprite(this.defaultTextures);

        this.reScale();

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 1;
        this.sprite.x = (app.renderer.view.width / 2);
        this.sprite.y = ($('#centerpiece').offset().top + 5);
        this.sprite.vx = 0;
        this.sprite.vy = 0;
        this.sprite.ax = 0;
        this.sprite.ay = 0;
        this.sprite.animationSpeed = 0.2;

        app.stage.addChild(this.sprite);
    };
};

// -------------------------------
// Instructions object constructor
// -------------------------------
function Instructions(mage) {

    // ------
    // Fields
    // ------

    this.mobileScale = 0.05;
    this.tabletScale = 0.30;
    this.desktopScale = 0.40;

    this.xOffset = 0;

    this.mage = mage;

    this.sprite = null;

    this.images = {
        standard: ['/img/sprites/instructions_desktop.png'],
        touch: ['/img/sprites/instructions_touch.png']
    };

    this.textures = {
        standard: [],
        touch: []
    };

    this.defaultTextures = this.textures.standard;

    // -------
    // Methods
    // -------

    this.reScale = function() {
        if ($(window).width() <= MOBILE_MAX_WIDTH) {
            this.sprite.scale.set(this.mobileScale);
            this.xOffset = 0;
        }
        else if ($(window).width() <= TABLET_MAX_WIDTH) {
            this.sprite.scale.set(this.tabletScale);
            this.xOffset = 50;
        }
        else {
            this.sprite.scale.set(this.desktopScale);
            this.xOffset = 70;
        }
    };

    this.update = function() {
        this.sprite.x = this.mage.sprite.x + this.xOffset;
        this.sprite.y = this.mage.sprite.y - this.mage.sprite.height;
    };

    this.updateOnResize = function() {
        this.reScale();
        this.update();
    };

    this.init = function() {
        for (let key in this.images) {
            for (let i = 0; i < this.images[key].length; i++) {
                this.textures[key].push(Texture.from(this.images[key][i]));
            }
        }

        if (isTouchDevice() == true) {
            this.defaultTextures = this.textures.touch;
        }

        this.sprite = new AnimatedSprite(this.defaultTextures);

        this.reScale();

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 1;
        this.sprite.x = this.mage.sprite.x + this.xOffset;
        this.sprite.y = this.mage.sprite.y - this.mage.sprite.height;

        app.stage.addChild(this.sprite);
    };
}

// ------------------------
// Spell object constructor
// ------------------------
function Spell(mage, targetX, targetY) {

    // ------
    // Fields
    // ------

    this.mobileScale = 0.05;
    this.tabletScale = 1.9;
    this.desktopScale = 2.5;

    this.targetX = targetX;
    this.targetY = targetY;

    this.speed = 3;
    this.acceleration = 0.15;
    this.rotationSpeed = 40;

    this.collidedNavElement = null;

    this.mage = mage;

    this.sprite = null;

    this.images = {
        standard: ['/img/sprites/spell.png'],
        collision: ['/img/sprites/spell_collision0.png',
                    '/img/sprites/spell_collision1.png',
                    '/img/sprites/spell_collision2.png',
                    '/img/sprites/spell_collision3.png',
                    '/img/sprites/spell_collision4.png',
                    '/img/sprites/spell_collision5.png',
                    '/img/sprites/spell_collision6.png',
                    '/img/sprites/spell_collision7.png']
    };

    this.textures = {
        standard: [],
        collision: []
    };

    this.defaultTextures = this.textures.standard;

    // -------
    // Methods
    // -------

    this.reScale = function() {
        if ($(window).width() <= MOBILE_MAX_WIDTH) {
            this.sprite.scale.set(this.mobileScale);
        }
        else if ($(window).width() <= TABLET_MAX_WIDTH) {
            this.sprite.scale.set(this.tabletScale);
        }
        else {
            this.sprite.scale.set(this.desktopScale);
        }
    };

    this.update = function() {
        this.sprite.vx += this.sprite.ax;
        this.sprite.vy += this.sprite.ay;

        this.sprite.x += this.sprite.vx;
        this.sprite.y += this.sprite.vy;

        this.sprite.angle += this.rotationSpeed;

        this.checkCollision();
    };

    this.updateOnResize = function() {
        if ($(window).width() <= MOBILE_MAX_WIDTH) {
            app.stage.removeChild(this.sprite);
        }
    }

    this.checkNavCollision = function(navElement) {
        let navTop = navElement.offsetTop;
        let navBottom = navTop + navElement.offsetHeight;
        let navLeft = navElement.offsetLeft;
        let navRight = navLeft + navElement.offsetWidth;
        
        if ((this.sprite.x >= navLeft) && (this.sprite.x <= navRight) && (this.sprite.y >= navTop) && (this.sprite.y <= navBottom)) {
            this.sprite.textures = this.textures.collision;
            this.sprite.onComplete = function() {
                if (playSound == false) {
                    spell.collidedNavElement.firstChild.click();
                }
            };
            this.rotationSpeed = 0;
            this.sprite.ax = 0;
            this.sprite.ay = 0;
            this.sprite.vx = 0;
            this.sprite.vy = 0;
            this.sprite.animationSpeed = 0.8;
            this.sprite.loop = false;

            this.collidedNavElement = navElement;

            this.sprite.play();

            if (playSound == true) {
                spellCollideSound.pause();
                spellCollideSound.currentTime = 0;
                spellCollideSound.play();
            }
        }
    };

    this.checkCollision = function() {
        let navElements = $('.navlinks li').toArray();
        if (this.collidedNavElement == null) {
            for (let i = 0; i < navElements.length; i++) {
                this.checkNavCollision(navElements[i]);
            }
        }

        let spellBlastZoneOffset = 10;
        if ((this.sprite.x > ($(window).width() + spellBlastZoneOffset))
            || (this.sprite.x < (-spellBlastZoneOffset))
            || (this.sprite.y > ($(window).height() + spellBlastZoneOffset))
            || (this.sprite.y < (-spellBlastZoneOffset))) {

            app.stage.removeChild(this.sprite);
            this.sprite = null;
        }
    };

    this.init = function() {
        for (let key in this.images) {
            for (let i = 0; i < this.images[key].length; i++) {
                this.textures[key].push(Texture.from(this.images[key][i]));
            }
        }

        this.sprite = new AnimatedSprite(this.defaultTextures);

        this.reScale();

        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.mage.sprite.x;
        this.sprite.y = this.mage.sprite.y - (this.mage.sprite.width / 2);

        let dx = this.targetX - this.sprite.x;
        let dy = this.targetY - this.sprite.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        this.sprite.vx = (dx / distance) * this.speed;
        this.sprite.vy = (dy / distance) * this.speed;
        this.sprite.ax = this.sprite.vx * this.acceleration;
        this.sprite.ay = this.sprite.vy * this.acceleration;
        this.sprite.animationSpeed = 0.2;

        app.stage.addChild(this.sprite);
        this.sprite.play();

        if (playSound) {
            spellSound.pause();
            spellSound.currentTime = 0;
            spellSound.play();
        }
    };
}

// --------------------------------------
// Creates a key object for the given key
// --------------------------------------
function createKey(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    
    // The down handler
    key.downHandler = function(event) {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    // The up handler
    key.upHandler = function(event) {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    // Attaching event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detaching event listeners
    key.unsubscribe = function() {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

// -------------------------------------------------------------------------
// Handles game logic when any key mapped to the move left action is pressed
// -------------------------------------------------------------------------
function leftPressed() {
    if (mage != null) {
        mage.leftPressed = true;
        if (mage.instructions != null) {
            app.stage.removeChild(mage.instructions.sprite);
        }
    }
}

// --------------------------------------------------------------------------
// Handles game logic when any key mapped to the move left action is released
// --------------------------------------------------------------------------
function leftReleased() {
    if (mage != null) {
        mage.leftPressed = false;
    }
}

// --------------------------------------------------------------------------
// Handles game logic when any key mapped to the move right action is pressed
// --------------------------------------------------------------------------
function rightPressed() {
    if (mage != null) {
        mage.rightPressed = true;
        if (mage.instructions != null) {
            app.stage.removeChild(mage.instructions.sprite);
        }
    }
}

// ---------------------------------------------------------------------------
// Handles game logic when any key mapped to the move right action is released
// ---------------------------------------------------------------------------
function rightReleased() {
    if (mage != null) {
        mage.rightPressed = false;
    }
}

// --------------------------------------------------------------------
// Handles game logic when any key mapped to the jump action is pressed
// --------------------------------------------------------------------
function jumpPressed() {
    if (mage != null) {
        if (mage.jumping == false) { 
            mage.jump();
        }
        if (mage.instructions != null) {
            app.stage.removeChild(mage.instructions.sprite);
        }
    }
}

// ----------------
// Sets up the game
// ----------------
function setup() {
    if ($(window).width() > MOBILE_MAX_WIDTH) {
        mage = new Mage();
        mage.init();

        mage.instructions = new Instructions(mage);
        mage.instructions.init();

        document.body.appendChild(app.view);
    }

    app.ticker.maxFPS = 60;
    app.ticker.minFPS = 60;
    app.ticker.add(function(delta) {
        gameLoop(delta);
    });
}

// ---------------------------------------------------
// Executes 60 times per second and updates game state
// ---------------------------------------------------
function gameLoop(delta) {

    if (mage != null) {
        if (mage.dead == false) {
            mage.update();
        }
        else {
            mage.revive();
        }
    }

    if (spell != null) {
        if (spell.sprite == null) {
            spell = null;
        }
        else {
            spell.update();
        }
    }
}

// ---------------------------------
// Updates the game on window resize
// ---------------------------------
function updateOnResize() {
    if (mage != null) {

        mage.updateOnResize();
    }

    if ((app.renderer.view.width > MOBILE_MAX_WIDTH) && ($(window).width() <= MOBILE_MAX_WIDTH)) {
        app.stage.removeChildren();
        document.body.removeChild(app.view);
        if (mage.instructions != null) {
            mage.instructions.sprite = null;
            mage.instructions = null;
        }
        if (mage != null) {
            mage.sprite = null;
            mage = null;
        }
        if (spell != null) {
            spell.sprite = null;
            spell = null;
        }
    }
    else if ((app.renderer.view.width <= MOBILE_MAX_WIDTH) && ($(window).width() > MOBILE_MAX_WIDTH)) {

        setTimeout(function() {
            mage = new Mage();
            mage.init();

            mage.instructions = new Instructions(mage);
            mage.instructions.init();

            document.body.appendChild(app.view);
        }, 250);
    }

    if (spell != null) {
        spell.updateOnResize();
    }

    app.renderer.resize($(window).width(), $(window).height());
}

// --------------------
// Handles click events
// --------------------
function clickHandler() {
    if ((spell != null) || (mage == null) || (mage.sprite == null) || (mage.dead == true)) {
        return;
    }

    if (mage.instructions != null) {
        app.stage.removeChild(mage.instructions.sprite);
    }

    let targetX = event.clientX;
    let targetY = event.clientY;

    mage.castSpell(targetX, targetY);
}

// =============================
// End PIXI function definitions
// =============================

// ========================
// End function definitions
// ========================

// ============
// Begin script
// ============

// ------------------------------------------------------------------
// Preventing clicking the links from generating further click events
// ------------------------------------------------------------------
$('a').click(function() {
    event.stopPropagation();
});

$('#logo').click(function() {
    event.stopPropagation();
});

// ---------------------------------------------
// Animating centerpiece text with pretty colors
// ---------------------------------------------
colorizeCenterpieceText();
setInterval(colorizeCenterpieceText, 333);

// =========================
// Begin sound effects setup
// =========================

// -----------------------------------------------------------
// Registering click listener for the mute/unmute sound button
// -----------------------------------------------------------
$('#mute-sound img').click(function() {

    $('.speaker-img').each(function() {
        $(this).toggleClass('hidden');
    })

    playSound = !playSound;

    // Play background soundtrack
    if (playSound == true) {
        soundtrack.play();
    }
    else {
        soundtrack.currentTime = 0;
        soundtrack.pause();
    }

    event.stopPropagation();
})

// ---------------------
// Setting up soundtrack
// ---------------------
var playSound = false;
var soundtrack = new Audio('/sound/soundtrack.mp3'); 
soundtrack.volume = 0.08;
soundtrack.loop = true;

// ----------------------
// Setting up spell sound
// ----------------------
var spellSound = new Audio('/sound/spell.mp3');
spellSound.volume = 0.05;

// --------------------------------
// Setting up spell collision sound
// --------------------------------
var spellCollideSound = new Audio('/sound/spell_collide.mp3');
spellCollideSound.volume = 0.3;
spellCollideSound.addEventListener('ended', function() {
    spell.collidedNavElement.firstChild.click();
});

// ---------------------------
// Setting up mage death sound
// ---------------------------
var deathSound = new Audio('/sound/death.mp3');
deathSound.volume = 0.3;

// =======================
// End sound effects setup
// =======================

// =================
// Begin PIXI script
// =================

// ---------
// Constants
// ---------
var MOBILE_MAX_WIDTH = 768;
var TABLET_MAX_WIDTH = 1440;
var FRICTION = 0.5;
var GRAVITY = 0.7;

// -------
// Aliases
// -------
var Application = PIXI.Application;
var Loader = PIXI.Loader.shared;
var Texture = PIXI.Texture;
var Sprite = PIXI.Sprite;
var AnimatedSprite = PIXI.AnimatedSprite;

// ---------------------------
// Creating a Pixi Application
// ---------------------------
var app = new Application({transparent: true});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.top = "0";
app.renderer.view.style.left = "0";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize($(window).width(), $(window).height());

// ----------------------------
// Registering global listeners
// ----------------------------
$(window).resize(updateOnResize);
$(document).click(clickHandler);

// ---------------------------------
// Defining mage and spell variables
// ---------------------------------
var mage = null;
var spell = null;

// --------------------------------------
// Creating key objects for relevant keys
// --------------------------------------
var lowerA = createKey('a');
var upperA = createKey('A');
var lowerD = createKey('d');
var upperD = createKey('D');
var space = createKey(' ');
var spaceIE = createKey('Spacebar');

// -------------------------
// Registering key listeners
// ------------------------- 
lowerA.press = leftPressed;
upperA.press = leftPressed;
lowerA.release = leftReleased;
upperA.release = leftReleased;

lowerD.press = rightPressed;
upperD.press = rightPressed;
lowerD.release = rightReleased;
upperD.release = rightReleased;

space.press = jumpPressed;
spaceIE.press = jumpPressed;

// -----------------------
// Go! (Setting up Loader)
// -----------------------
Loader.add([]).load(setup);

// ===============
// End PIXI script
// ===============

// ==========
// End script
// ==========