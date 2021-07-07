const pollForm = document.querySelector("form.poll");

function openField() {
    document.querySelector('.input-field').classList.remove("hide");
}

function submitForm() {
    document.querySelector('.input-field').classList.add("hide");
    document.querySelector(".flash-message").classList.remove("hide");
    pollForm.submit();
    return false;
}