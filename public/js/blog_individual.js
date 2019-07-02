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

// -------------------------------------------------------------------
// Converts a given UTC date and time to local time (without the date)
// -------------------------------------------------------------------
function convertToLocalTime(utcDateString) {
    var now = new Date(utcDateString);

    var newDateString = now.toString();
    var splitNewDateString = newDateString.split(':');
    var hour = splitNewDateString[0].slice(-2);
    var minute = splitNewDateString[1].slice(0, 2);

    var localTime = hour + ':' + minute;

    return localTime;
}

// --------------------------------------------------------------------------
// Converts the existing times in the comment section to local times from UTC
// --------------------------------------------------------------------------
function updateCommentTimesToLocal() {
    var numComments = $('.comment-date').toArray().length;

    for (var i = 0; i < numComments; i++) {
        var date = $(`.comment-date-${i}`).html();
        var time = $(`.comment-time-${i}`).html();
        
        var utcDateString = date + ' ' + time + ' UTC';
        var localTime = convertToLocalTime(utcDateString);

        $(`.comment-time-${i}`).html(localTime);
    }
}

// ----------------------------------------------------------
// Displays "No Comments Yet" if the comment section is empty
// ----------------------------------------------------------
function updateNoCommentsText() {
    if (!$('.comment-date').length) {
        $('#comments-container').html('<p id="no-comments">No Comments Yet</p>');
    }
    else {
        $('#no-comments').remove();
    }
}

// ========================
// End function definitions
// ========================

// ============
// Begin Script
// ============

// -----------------------------------------------------
// Adding "No Comments" to the comment section if needed
// -----------------------------------------------------
updateNoCommentsText();

// -----------------------------------------
// Updating UTC comment times to local times
// -----------------------------------------
updateCommentTimesToLocal();

// ----------------------------------------
// Registering "POST" button click listener
// ----------------------------------------
$('.post-button').first().click(function() {

    // Grabbing the comment from the text area and the name from the hidden div
    var comment = $('#new-comment').val();
    var name = $('#user-full-name').html();
    
    // Generating current datetime information
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var yyyy = now.getFullYear();
    
    // Formatting the date and time
    var date = mm + '/' + dd + '/' + yyyy;
    var time = String(now.getUTCHours()).padStart(2, '0') + ':' + String(now.getUTCMinutes()).padStart(2, '0');

    // Creating the data object sent with the POST request
    var data = {name: name, datetime: now.toUTCString(), date: date, time: time, comment: comment};

    // Sending POST request with comment data to the server
    $.ajax({
        type: 'POST',
        url: '/blog/1',
        data: data,

        // Updates the comment section with the new comments on success
        success: function(data) {
            var html = ``;

            for (var i = 0; i < data.length; i++) {
                var localTime = convertToLocalTime(data[i].date + ' ' + data[i].time + ' UTC');
                html += `
                    <span class="comment-name">${data[i].name}</span> on <span class="comment-date">${data[i].date}</span> at <span class="comment-time">${localTime}</span>
                    <br>
                    &#x25B8 ${data[i].comment}
                    <br>
                    <br>
                `;
            }

            $('#comments-container').html(html);
            $('#new-comment').val('');
            updateNoCommentsText();
        }
    });
});

// ==========
// End Script
// ==========