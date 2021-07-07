const { $where } = require("../../models/abonnements");

const pollForm = document.querySelector("form.poll");
const inputField = document.querySelector('.input-field');
const flashMessage = document.querySelector(".flash-message");

function openField() {
    document.querySelector('.input-field').classList.remove("hide");
}

function submitForm() {
    // document.querySelector('.input-field').classList.add("hide");
    // document.querySelector(".flash-message").classList.remove("hide");
    // pollForm.submit();
    // return false;

    e.preventDefault();
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
            console.log(result);
        },
        error: function (request, status, error) {
            serviceError();
        }
    });

}