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

// ---------------------------------
// Sets up hamburger slide animation
// ---------------------------------
function navSlide() {
    var hamburger = $('#hamburger');
    var navlinks = $('.navlinks').first();

    hamburger.on('click', function() {
        if (navlinks.hasClass('hamburger-active') == false) {
            navlinks.removeClass('hamburger-inactive');
            navlinks.addClass('hamburger-active');

            hamburger.addClass('morph-hamburger');
        }
        else {
            navlinks.removeClass('hamburger-active');
            navlinks.addClass('hamburger-inactive');

            hamburger.removeClass('morph-hamburger');
        }

        $('.navlinks li').each(function(index, li) {
            if(li.style.animation) {
                li.style.animation = '';
            }
            else {
                li.style.animation = `hamburgerFade 0.5s ease forwards ${(index / 7) + 0.3}s`;
            }
        });
    });
}

// -----------------------------------------------------------------------------------
// Sets up the removal of extraneous classes when window width is resized above MOBILE
// -----------------------------------------------------------------------------------
function windowResizeListener() {
    var hamburger = $('#hamburger');
    var window_element = $(window);
    var navlinks = $('.navlinks').first();

    window_element.resize(function resize() {
        if (window_element.width() > 768) {
            navlinks.removeClass('hamburger-inactive');
            navlinks.removeClass('hamburger-active');
            hamburger.removeClass('morph-hamburger');

            $('.navlinks li').each(function(index, li) {
                li.style.animation = '';
            });
        }
    }).trigger('resize');
}

// -------------------------------------------------------------------------------
// Modifies the given html to enable the typeWriter function to access each letter
// -------------------------------------------------------------------------------
function typeWriterPrep(container, html) {
    var newHTML = "";

    var char = '';
    var insideTag = false;
    var letterCounter = 0;
    for (var i = 0; i < html.length; i++) {
        char = html.charAt(i);
        if (char == '<') {
            insideTag = true;
        }
        else if (char == '>') {
            insideTag = false;
            newHTML += char;
            continue;
        }

        if (insideTag || char == ' ' || char == '\n' || char == '\t') {
            newHTML += char;
        }
        else {
            newHTML += `<span id="tw${letterCounter}" class="hidden">${char}</span>`;
            letterCounter++;
        }
    }

    container.append(newHTML);

    return letterCounter;
}

// ---------------------------------------------------------------------------
// Writes text using typewriter effect. Must call typeWriterPrep on html first
// ---------------------------------------------------------------------------
function typeWriter(element, index, totalChars, speed) {
    if (index < totalChars) {
        var letter = element.find(`#tw${index}`);
        letter.removeClass('hidden');
        setTimeout(function() {
            typeWriter(element, index+1, totalChars, speed);
        }, speed);
    }
}

// --------------------
// Shuffles given array
// --------------------
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

// ========================
// End function definitions
// ========================

// ============
// Begin script
// ============

// ----------------------------------------------------------
// Setting up logo click listener to go back to the home page
// ----------------------------------------------------------
$('#logo').click(function() {
    window.location = '/';
})

// -------------------------------------
// Setting up the navbar slide animation
// -------------------------------------
navSlide();

// -----------------------------------------------------------------------
// Setting up the removal of extraneous classes when the window is resized
// -----------------------------------------------------------------------
windowResizeListener();

// ============
// Begin script
// ============