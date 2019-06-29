// Setup hamburger slide animation
function navSlide() {
    var hamburger = $('#hamburger');
    var navlinks = $('.navlinks').first();

    hamburger.on('click', function() {
        // Toggle sidebar
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

        // Animate links
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

// Remove extraneous classes when window is resized above 768px
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

// Modifies the given html to enable the typeWriter function to access each letter
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

// Write text using typewriter effect
function typeWriter(element, index, totalChars, speed) {
    if (index < totalChars) {
        var letter = element.find(`#tw${index}`);
        letter.removeClass('hidden');
        setTimeout(function() {
            typeWriter(element, index+1, totalChars, speed);
        }, speed);
    }
}

// Shuffles the input array
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// --------------------------

// Begin script
navSlide();
windowResizeListener();