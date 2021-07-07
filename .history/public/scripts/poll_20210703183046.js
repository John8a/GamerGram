const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

function openField() {
    inputField.classList.toggle("hide");
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
            console.log(result.message)
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}