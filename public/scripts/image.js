const cancel = document.querySelector(".fas.fa-times");
var currentValue = document.querySelector(".upload .input input");
var fileInput = document.querySelector("#image-upload");
const logoInput = document.querySelector("#logo");
const teamInput = document.querySelector("#team");
const uploadInfo = document.querySelectorAll("form > div > div.info > h4");
const closeBtn = document.querySelector(".fas.fa-times");

function cleanInput() {
    currentValue.value = "";
    cancel.style.display = "none";
}

function imageUpload() {
    currentValue.value = fileInput.files[0].name;
    cancel.style.display = "block";
}

closeBtn.addEventListener("click", function () {
    closeBtn.parentElement.parentElement.style.display = "none";
});

function setFile(input) {
    // filInput = logoInput.value != null ? logoInput : teamInput;
    fileInput = input;
  var fileName = fileInput.value.split("\\")[fileInput.value.split("\\").length - 1];
  if (fileInput.value != "") {
    document.querySelector("#file").innerText = fileName;
    document.querySelector("#file2").innerText = fileName;
  } else {
    document.querySelector("#file").innerText = "Datei auswählen";
    document.querySelector("#file2").innerText = "Datei auswählen";
  }
}

document.querySelector("html").addEventListener("keypress", function (event) {
  if (event.keyCode == 13) {
    document.querySelector("form").submit();
  }
});