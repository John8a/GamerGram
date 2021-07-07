const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

window.onload = function() {
    answeredCookie = getCookie("polled");
    alert(answeredCookie);
    if (answeredCookie == "true") {
        document.querySelectorAll(".poll-panel a input").forEach((input) => {
            input.disabled = true;
        });
    }
})

// getsCookie Name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

function openField() {
    inputField.classList.toggle("hide");
}

function showFlashMessage(message) {
    flashMessage.innerText = message;
    flashMessage.classList.remove("hide");
}

function submitForm(event, poll_val) {

    event.preventDefault();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/poll', // missing quotes  
        dataType: 'html',
        data: {
            poll: poll_val,
            message: $("#message").val()
        },
        success: function (result) {
            if (!inputField.classList.contains("hide")) {
                openField();
            }
            showFlashMessage("Danke für Deine Hilfe! Wir danken Dir für Dein Feedback!");
            setCookies("polled", true);
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}

function setCookies(cookieName, bool) {
    var d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    var expires = "expires=" +d.toUTCString();
    
    document.cookie = cookieName + "=" + bool + ";" + expires;
}