// Begin script
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

var resumeHTML = $('#resume').html();
$('#resume').remove();

var speed = 30;
var totalChars = typeWriterPrep($('#text-container'), resumeHTML);
typeWriter($('#text-container'), 0, totalChars, speed);

$('.skip-text-scroll').click(function() {
    clearTimeout();
    $('#text-container').html('<h1>RESUME</h1><br><a href="/docs/sdsmart_resume.pdf">1-PAGE PDF VERSION</a><br><br>');
    $('#text-container').append(resumeHTML);    
});