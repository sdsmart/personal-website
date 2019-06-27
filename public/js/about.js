// Begin script
var aboutMeHTML = $('#about-me').html();
$('#about-me').remove();

var speed = 40;
var totalChars = typeWriterPrep($('#text-container'), aboutMeHTML);
typeWriter($('#text-container'), 0, totalChars, speed);

$('.skip-text-scroll').click(function() {
    clearTimeout();
    $('#text-container').html('<h1>ABOUT ME</h1><br>');
    $('#text-container').append(aboutMeHTML);    
});