const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function openField() {
    inputField.classList.toggle("hide");
}

function showFlashMessage(message) {
    // flashMessage.innerText = message;
    flashMessage.classList.remove("hide");
    // sleep(1000);
    // document.querySelector(".hide").style.transition = "0.3s linear";
    // flashMessage.classList.add("hide");
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
            showFlashMessage("Danke für Deine Hilfe! Wir danken Dir für Dein Feedback!");
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}