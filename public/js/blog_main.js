// Begin script
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

var blogHTML = $('#blog-front-page-contents').html();
$('#blog-front-page-contents').remove();

var speed = 30;
var totalChars = typeWriterPrep($('#text-container'), blogHTML);
typeWriter($('#text-container'), 0, totalChars, speed);

$('.skip-text-scroll').click(function() {
    clearTimeout();
    $('#text-container').html('<h1 style="display: inline-block;">BLOG</h1><br><br>');
    $('#text-container').append(blogHTML);    
});