var cardAnswer = document.querySelector(".answer");
var element    = document.querySelector(".to-answer");
var back       = document.querySelector(".card-answer p");

function answerContact(cardAnswer) {
    cardAnswer.parentElement.parentElement.classList.toggle("to-answer");   
}

function removeContact(element) {
    alert(element.parentElement.parentElement.innerHTML);
    element.parentElement[0].classList.toggle("to-answer");
}