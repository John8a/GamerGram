const cancel = document.querySelector(".fas.fa-times");
var currentValue = document.querySelector(".upload .input input");

currentValue.addEventListener("change", function () {
    cancel.style.display = "block";
});

function cleanInput() {
    currentValue.value = "";
    cancel.style.display = "none";
}

function imageUpload() {
    alert("TEXT");
}