const header = document.querySelector("header");

window.onscroll = function() {
    "use strict";
    if((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && window.innerWidth > 980) {
        header.classList.add("scroll");
    } else if(window.innerWidth <= 980 && (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
        header.classList.add("remove-top");
        header.classList.remove("fade-in");
    } else {
        header.classList.remove("scroll");
        header.classList.add("fade-in");
        header.classList.remove("remove-top");
    }
}

function outline(input) {
    input.parentElement.classList.toggle("active");
}

function fullText(card) {
    card.parentElement.parentElement.children[2].classList.toggle("show"); 
    card.parentElement.parentElement.children[2].classList.toggle("show"); 
}