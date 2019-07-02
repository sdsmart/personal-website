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

// ============
// Begin script
// ============

// -----------------------------------------------------
// Sets up auto scroll to the top of the page on refresh
// -----------------------------------------------------
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

// ----------------------------------------------
// Skips the text scroll when the link is clicked
// ----------------------------------------------
$('.skip-text-scroll').click(function() {
    clearTimeout();
    $('#text-container').html('<h1>RESUME</h1><br><a href="/docs/sdsmart_resume.pdf">1-PAGE PDF VERSION</a><br><br>');
    $('#text-container').append(resumeHTML);    
});

// ------------------------------------------------
// Grabbing the html from the placeholder container
// ------------------------------------------------
var resumeHTML = $('#resume').html();
$('#resume').remove();

// -----------------------------------------------
// Applying typewriter effect to the About Me text
// -----------------------------------------------
var speed = 30;
var totalChars = typeWriterPrep($('#text-container'), resumeHTML);
typeWriter($('#text-container'), 0, totalChars, speed);

// ==========
// End script
// ==========