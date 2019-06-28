// Begin script
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

var aboutMeHTML = $('#about-me').html();
$('#about-me').remove();

var speed = 30;
var totalChars = typeWriterPrep($('#text-container'), aboutMeHTML);
typeWriter($('#text-container'), 0, totalChars, speed);

$('.skip-text-scroll').click(function() {
    clearTimeout();
    $('#text-container').html('<h1>ABOUT ME</h1><br>');
    $('#text-container').append(aboutMeHTML);    
});