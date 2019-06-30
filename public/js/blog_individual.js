// Converts a given UTC date and time to local time
function convertToLocalTime(utcDateString) {
    var now = new Date(utcDateString);

    var newDateString = now.toString();
    var splitNewDateString = newDateString.split(':');
    var hour = splitNewDateString[0].slice(-2);
    var minute = splitNewDateString[1].slice(0, 2);

    var localTime = hour + ':' + minute;

    return localTime;
}

// Converts the comment times in the comment section to local times
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

// Displays "No Comments Yet" if the comment section is empty
function updateNoCommentsText() {
    if (!$('.comment-date').length) {
        $('#comments-container').html('<p id="no-comments">No Comments Yet</p>');
    }
    else {
        $('#no-comments').remove();
    }
}

// --------------------------

// Begin script
updateNoCommentsText();
updateCommentTimesToLocal();

$('.post-button').first().click(function() {
    var comment = $('#new-comment').val();
    var name = $('#user-full-name').html();
    
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var yyyy = now.getFullYear();
    
    var date = mm + '/' + dd + '/' + yyyy;
    var time = String(now.getUTCHours()).padStart(2, '0') + ':' + String(now.getUTCMinutes()).padStart(2, '0');

    var data = {name: name, datetime: now.toUTCString(), date: date, time: time, comment: comment};

    $.ajax({
        type: 'POST',
        url: '/blog/1',
        data: data,
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