const cancel = document.querySelector(".fas.fa-times");
var currentValue = document.querySelector(".upload .input input");
var fileInput = document.querySelector("#image-upload");

currentValue.addEventListener("change", function () {
    cancel.style.display = "block";
});

function cleanInput() {
    currentValue.value = "";
    cancel.style.display = "none";
}

function imageUpload() {
    currentValue.value = fileInput.files[0].name;
    fileInput.value = "/images/team/" + fileInput.files[0].name;
}