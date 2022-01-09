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

fileInput.addEventListener("change", function () {
  setFile();
});

closeBtn.addEventListener("click", function () {
  fileInput.value = null;
  setFile();
});

function setFile() {
    filInput = logoInput.value != null ? teamInput : logoInput;
  var fileName = fileInput.value.split("\\")[fileInput.value.split("\\").length - 1];
  if (fileInput.value != "") {
    document.querySelector("#file").innerText = fileName;
  } else {
    document.querySelector("#file").innerText = "Datei auswählen";
  }
}

function upload() {
    uploadInfo.forEach(function(info) {
        info.innerText = "Lädt hoch...";
    })
}

document.querySelector("html").addEventListener("keypress", function (event) {
  if (event.keyCode == 13) {
    document.querySelector("form").submit();
  }
});