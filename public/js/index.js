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