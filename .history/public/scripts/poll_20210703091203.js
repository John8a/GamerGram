const pollForm = document.querySelector("form.poll");

function openField() {
    document.querySelector('.input-field').classList.remove("hide");
}

function submitForm() {
    document.querySelector(".flash-message").classList.remove("hide");
    pollForm.submit();
    return false;
}