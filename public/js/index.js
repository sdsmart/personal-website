// Setup hamburger slide animation
function navSlide() {
    const hamburger = $('#hamburger');
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
                li.style.animation = `hamburgerFade 0.3s ease forwards ${(index / 7) + 0.3}s`;
            }
        });
    });
}

// Remove extraneous classes when window is resized above 768px
function windowResizeListener() {
    var window_element = $(window);
    var navlinks = $('.navlinks').first();

    window_element.resize(function resize() {
        if (window_element.width() > 768) {
            navlinks.removeClass('hamburger-inactive');
        }
    }).trigger('resize');
}

// Begin script
navSlide();
windowResizeListener();
