const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

window.onload = function() {
    answeredCookie = getCookie("polled");
    if (answeredCookie == "true") {
        document.querySelector(".poll p").innerHTML = "";
        let polls = document.querySelector(".poll-panel").children
        for (var i = 0; i < polls.length; i++) {
            polls[i].removeAttribute("onclick");
        }
        showFlashMessage("");
    }
};

function openField() {
    inputField.classList.toggle("hide");
}

function showFlashMessage(message) {
    if (message.length != 0) {
        flashMessage.innerText = message;
    }
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
            setCookies("polled", true, 365);
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}