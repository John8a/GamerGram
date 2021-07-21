const cancel = document.querySelector(".fas.fa-times");
var currentValue = document.querySelector(".upload .input input");
var fileInput = document.querySelector("#image-upload");

currentValue.addEventListener("change", function () {
    if (fileInput.files[0].name != undefined) {
        currentValue.value = fileInput.files[0].name;
    }
    cancel.style.display = "block";
});

function cleanInput() {
    currentValue.value = "";
    cancel.style.display = "none";
}

function imageUpload() {
}