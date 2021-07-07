var cardAnswer = document.querySelector(".answer");
var element    = document.querySelector(".to-answer");

function answerContact(cardAnswer) {
    cardAnswer.parentElement.parentElement.classList.toggle("to-answer");   
}

function removeContact(element) {
    let back = element.parentElement.parentElement.children[0];
    back.classList.toggle("go-back");
}