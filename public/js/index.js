// Animates centerpiece text with colorful letters
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
        span.style = `color: ${textColorsShuffled[index]}`;
     });
}

// --------------------------

// Begin script
colorizeCenterpieceText();
setInterval(colorizeCenterpieceText, 333);

// --- PIXI code ---
// Aliases
let Application = PIXI.Application;
let Loader = PIXI.Loader.shared;
let Texture = PIXI.Texture;
let Sprite = PIXI.Sprite;
let AnimatedSprite = PIXI.AnimatedSprite;

// Create a Pixi Application
let app = new Application({transparent: true});
app.renderer.view.style.position = "absolute";
app.renderer.view.style.top = "0";
app.renderer.view.style.left = "0";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize($(window).width(), $(window).height());
document.body.appendChild(app.view);

// Game constants
const gravity = 0.7;
const friction = 0.5;
const maxXSpeed = 7;
var mageDied = false;
var collidedNavElement = null;
var addGameLoop = true;

$(window).resize(resizeUpdate);

// Mage sprite and textures
let mage = null;

let mageWalkingRightImgs = ['/img/sprites/mage_right.png'];
let mageWalkingRightTextures = [];
for (let i=0; i < mageWalkingRightImgs.length; i++) {
    mageWalkingRightTextures.push(Texture.from(mageWalkingRightImgs[i]));
}

let mageWalkingLeftImgs = ['/img/sprites/mage_left.png'];
let mageWalkingLeftTextures = [];
for (let i=0; i < mageWalkingLeftImgs.length; i++) {
    mageWalkingLeftTextures.push(Texture.from(mageWalkingLeftImgs[i]));
}

let mageCastingRightImgs = ['/img/sprites/mage_cast_right0.png',
                            '/img/sprites/mage_cast_right0.png',
                            '/img/sprites/mage_cast_right1.png'];
let mageCastingRightTextures = [];
for (let i=0; i < mageCastingRightImgs.length; i++) {
    mageCastingRightTextures.push(Texture.from(mageCastingRightImgs[i]));
}

let mageCastingLeftImgs = ['/img/sprites/mage_cast_left0.png',
                           '/img/sprites/mage_cast_left0.png',
                           '/img/sprites/mage_cast_left1.png'];
let mageCastingLeftTextures = [];
for (let i=0; i < mageCastingLeftImgs.length; i++) {
    mageCastingLeftTextures.push(Texture.from(mageCastingLeftImgs[i]));
}

// Spell sprite and textures
let spell = null;

let spellImgs = ['/img/sprites/spell.png'];

let spellTextures = [];
for (let i=0; i < spellImgs.length; i++) {
    spellTextures.push(Texture.from(spellImgs[i]));
}

let spellCollisionImgs = ['/img/sprites/spell_collision0.png',
                          '/img/sprites/spell_collision1.png',
                          '/img/sprites/spell_collision2.png',
                          '/img/sprites/spell_collision3.png',
                          '/img/sprites/spell_collision4.png',
                          '/img/sprites/spell_collision5.png',
                          '/img/sprites/spell_collision6.png',
                          '/img/sprites/spell_collision7.png'];
let spellCollisionTextures = [];
for (let i=0; i < spellCollisionImgs.length; i++) {
    spellCollisionTextures.push(Texture.from(spellCollisionImgs[i]));
}

// Keyboard objects
left = keyboard('a');
right = keyboard('d');
jump = keyboard(' ');

// Load sprite image as texture and create sprite
if ($(window).width() > 768) {
    Loader.add([]).load(setup);
}

function setup() {

    // Setting up the mage sprite
    mage = new AnimatedSprite(mageWalkingRightTextures);
    
    // Rescale the mage based on window width
    if ($(window).width() <= 768) {
        mage.scale.set(0.05);
    }
    else if ($(window).width() <= 1440) {
        mage.scale.set(0.19);
    }
    else {
        mage.scale.set(0.25);
    }

    mage.anchor.x = 0.5;
    mage.anchor.y = 1;
    mage.x = app.renderer.view.width / 2;
    mage.y = $('#centerpiece').offset().top + 5;
    mage.vx = 0;
    mage.vy = 0;
    mage.ax = 0;
    mage.ay = 0;
    mage.leftPressed = false;
    mage.rightPressed = false;
    mage.jumping = false;
    mage.animationSpeed = 0.2;

    left.press = function() {
        mage.leftPressed = true;
    }
    left.release = function() {
        mage.leftPressed = false;
    }

    right.press = function() {
        mage.rightPressed = true;
    }
    right.release = function() {
        mage.rightPressed = false;
    }

    jump.press = function() {
        if (mage.jumping == false) {
            mage.vy = -13;
        }
    }

    // Adding the mage sprite the the stage
    app.stage.addChild(mage);

    // Register event listener for casting a spell
    $(document).click(castSpell);

    // Start the game loop
    if (addGameLoop) {
        app.ticker.add(delta => gameLoop(delta));
        addGameLoop = false;
    }
}

function gameLoop(delta) {
    if (mage) {
        if ((mage.leftPressed == true) && (mage.rightPressed == false)) {
            if (mage.textures == mageWalkingRightTextures) {
                mage.textures = mageWalkingLeftTextures;
            }
            mage.ax = -1.5;
        }
        else if ((mage.leftPressed == false) && (mage.rightPressed == true)) {
            if (mage.textures == mageWalkingLeftTextures) {
                mage.textures = mageWalkingRightTextures;
            }
            mage.ax = 1.5;
        }
        else {
            mage.ax = 0;
        }

        if (mage.vy == 0) { 
            mage.jumping = false;
        }
        else {
            mage.jumping = true;
        }

        if (mage.vx < 0) {
            mage.vx += mage.ax + friction;
            if (mage.vx < -(maxXSpeed)) {
                mage.vx = -maxXSpeed;
            }
        }
        else if (mage.vx > 0) {
            mage.vx += mage.ax - friction;
            if (mage.vx > maxXSpeed) {
                mage.vx = maxXSpeed;
            }
        }
        else {
            mage.vx += mage.ax;
        }

        mage.vy += mage.ay + gravity;

        mage.x += mage.vx;
        mage.y += mage.vy;

        checkMageCollision();
    }

    if (spell) {
        spell.vx += spell.ax;
        spell.vy += spell.ay;

        spell.x += spell.vx;
        spell.y += spell.vy;

        spell.angle += spell.rotationSpeed;

        checkSpellCollision();
    }
}

function checkMageCollision() {
    var centerpieceOffset = $('#centerpiece').offset();
    var centerPieceTopPosition = centerpieceOffset.top + 5;
    var centerpieceLeftPosition = centerpieceOffset.left;
    var centerpieceRightPosition = centerpieceOffset.left + $('#centerpiece').width();
    var centerpieceBottomPosition = centerpieceOffset.top + $('#centerpiece').height();
    
    if (((mage.x + (mage.width / 2)) > centerpieceLeftPosition) && ((mage.x - (mage.width / 2)) < centerpieceRightPosition)) {
        if ((mage.y >= centerPieceTopPosition) && (mage.y <= centerpieceBottomPosition) && (mage.y < (centerPieceTopPosition + 16))) {
            mage.y = centerPieceTopPosition;
            mage.vy = 0;
        }
    }

    if ((mage.y > centerPieceTopPosition) && (mage.y - mage.height) < centerpieceBottomPosition) {
        if (((mage.x + (mage.width / 2)) > centerpieceLeftPosition) && (mage.x < ($(window).width() / 2))) {
            mage.x = centerpieceLeftPosition - (mage.width / 2);
            mage.vx = 0;
        }
        else if (((mage.x - (mage.width / 2)) < centerpieceRightPosition) && (mage.x >= ($(window).width() / 2))) {
            mage.x = centerpieceRightPosition + (mage.width / 2);
            mage.vx = 0;
        }
    }

    // Check if mage is dead off the bottom
    if ((mage.y - mage.height - 50) > $(window).height()) {
        killMage();
    }
}

function checkSpellCollision() {

    let navElements = $('.navlinks li').toArray();
    if (!collidedNavElement) {
        for (let i = 0; i < navElements.length; i++) {
            checkSpellNavCollision(navElements[i]);
        }
    }

    if ((spell.x > ($(window).width() + 10))
        || (spell.x < (-10))
        || (spell.y > ($(window).height() + 10))
        || (spell.y < (-10))) {

        app.stage.removeChild(spell);
        spell = null;
    }
}

function spellCollisionComplete() {
    collidedNavElement.firstChild.click();
}

function checkSpellNavCollision(navElement) {
    let navTop = navElement.offsetTop;
    let navBottom = navTop + navElement.offsetHeight;
    let navLeft = navElement.offsetLeft;
    let navRight = navLeft + navElement.offsetWidth;
    
    if ((spell.x >= navLeft) && (spell.x <= navRight) && (spell.y >= navTop) && (spell.y <= navBottom)) {
        spell.textures = spellCollisionTextures;
        spell.onComplete = spellCollisionComplete;
        spell.rotationSpeed = 0;
        spell.ax = 0;
        spell.ay = 0;
        spell.vx = 0;
        spell.vy = 0;
        spell.animationSpeed = 0.8;
        spell.loop = false;

        collidedNavElement = navElement;

        spell.play();
    }
}

function resizeUpdate() {
    if (mage) {

        if ($(window).width() <= 768) {
            app.stage.removeChild(mage);
            if (spell) { app.stage.removeChild(spell); }
            document.body.removeChild(app.view);
            app = null;
            mage = null;
            spell = null;
            left.press = null;
            left.release = null;
            right.press = null;
            right.release = null;
            jump.press = null;
            return;
        }

        let xPositionRatio = mage.x / app.renderer.view.width;
        let yPositionRatio = mage.y / app.renderer.view.height;

        // Rescale the mage based on window width
        if ($(window).width() <= 768) {
            mage.scale.set(0.05);
        }
        else if ($(window).width() <= 1440) {
            mage.scale.set(0.19);
        }
        else {
            mage.scale.set(0.25);
        }

        let yOffset = 0;
        if ((app.renderer.view.width <= 768) && ($(window).width() > 768)) {
            yOffset = 15;
        }
        if ((app.renderer.view.width <= 1440) && ($(window).width() > 1440)) {
            yOffset = 45;
        }
        if ((app.renderer.view.width <= 768) && ($(window).width() > 1440)) {
            yOffset = 85;
        }

        mage.x = xPositionRatio * $(window).width();
        mage.y = (yPositionRatio * $(window).height()) - yOffset;
    }
    else {
        if (($(window).width() > 768) && (mageDied == false)) {
            app = new Application({transparent: true});
            app.renderer.view.style.position = "absolute";
            app.renderer.view.style.top = "0";
            app.renderer.view.style.left = "0";
            app.renderer.view.style.display = "block";
            app.renderer.autoDensity = true;
            document.body.appendChild(app.view);

            setup();
        }
    }

    if (app) {
        app.renderer.resize($(window).width(), $(window).height());
    }
}

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

// Callback function for when the cast animation is completed
function castAnimationComplete() {
    if (mage.textures == mageCastingRightTextures) {
        mage.textures = mageWalkingRightTextures;
    }
    else {
        mage.textures = mageWalkingLeftTextures;
    }
}

// Casts a spell towards the mouse on click
function castSpell() {
    if (spell || !mage) { return; }

    let mouseX = event.clientX;
    let mouseY = event.clientY;

    mage.loop = false;
    mage.onComplete = castAnimationComplete;
    if (mouseX >= mage.x) {
        mage.textures = mageCastingRightTextures;
        mage.play();
    }
    else {
        mage.textures = mageCastingLeftTextures;
        mage.play();
    }

    spell = new AnimatedSprite(spellTextures);

    // Rescale the spell based on window width
    if ($(window).width() <= 768) {
        spell.scale.set(0.05);
    }
    else if ($(window).width() <= 1440) {
        spell.scale.set(1.368);
    }
    else {
        spell.scale.set(1.8);
    }

    spell.anchor.x = 0.5;
    spell.anchor.y = 0.5;
    spell.x = mage.x;
    spell.y = mage.y - (mage.width / 2);

    let dx = mouseX - spell.x;
    let dy = mouseY - spell.y;
    let distance = Math.sqrt(dx*dx + dy*dy);

    spell.vx = (dx / distance) * 3;
    spell.vy = (dy / distance) * 3;
    spell.ax = spell.vx * 0.15;
    spell.ay = spell.vy * 0.15;
    spell.rotationSpeed = 40;
    spell.targetX = mouseX;
    spell.targetY = mouseY;
    spell.animationSpeed = 0.2;

    app.stage.addChild(spell);
    spell.play();
}

// Kill the mage
function killMage() {
    app.stage.removeChild(mage);
    mage = null;
    
    left.press = null;
    left.release = null;
    right.press = null;
    right.release = null;
    jump.press = null;

    mageDied = true;
}