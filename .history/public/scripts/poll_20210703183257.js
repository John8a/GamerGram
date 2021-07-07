const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

function openField() {
    inputField.classList.toggle("hide");
}

function showFlashMessage(message) {
    flashMessage.innerText = message;
}

function submitForm(event) {

    event.preventDefault();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/poll', // missing quotes  
        dataType: 'html',
        data: {
            yes: $("#yes").val(),
            no: $("#no").val(),
            message: $("#message").val()
        },
        success: function (result) {
            openField();
            showFlashMessage("Danke für Deine Hilfe! Wir danken Dir für Deine Meinung!");
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}