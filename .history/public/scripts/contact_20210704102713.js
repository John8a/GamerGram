var cardAnswer = document.querySelector(".answer");
var element    = document.querySelector(".to-answer");

function answerContact(cardAnswer) {
    cardAnswer.parentElement.parentElement.classList.toggle("to-answer");   
}

function removeContact(element) {
    alert("TEST");
    alert(element.innerHTML);
    element.parentElement[0].classList.toggle("to-answer");
}