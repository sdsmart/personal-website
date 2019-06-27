// Shuffles the input array
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Animate centerpiece text with colorful letters
function colorizeCenterpieceText() {
    var color1 = '#F44336'; //'#C41C00';
    var color2 = '#009688'; //'#00675B';
    var color3 = '#FF9800'; //'#FB8C00';
    var color4 = '#4CAF50'; //'#087F23';
    var color5 = '#9C27B0'; //'#6A0080';
    var color6 = '#3F51B5'; //'#002984';

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