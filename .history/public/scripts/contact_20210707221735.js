var cardAnswer = document.querySelector(".answer");
var element    = document.querySelector(".to-answer");
var addArticle = document.querySelector("#newForm");

window.onload = function() {
    
}

function answerContact(cardAnswer) {
    cardAnswer.parentElement.parentElement.classList.toggle("to-answer");   
}

function removeContact(element) {
    let back = element.parentElement.parentElement.parentElement.children[0];
    back.classList.toggle("go-back");
}

function showAddArticle() {
    addArticle.style.display = "block";
}