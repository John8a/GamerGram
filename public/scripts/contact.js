var cardAnswer = document.querySelector(".answer");
var element    = document.querySelector(".to-answer");
var addArticle = document.querySelector("#newForm");
let back;

window.onload = function() {
    if(window.location.href.substring(window.location.href.lastIndexOf('/') + 1) === "news#addForm") {
        showAddArticle();
    }
}

function answerContact(cardAnswer) {
    cardAnswer.parentElement.parentElement.classList.add("to-answer");   
    back.classList.remove("go-back");
}

function removeContact(element) {
    back = element.parentElement.parentElement.parentElement.children[0];
    cardAnswer.parentElement.parentElement.classList.add("to-answer");   
    back.classList.add("go-back");
}

function showAddArticle() {
    addArticle.style.display = "block";
}