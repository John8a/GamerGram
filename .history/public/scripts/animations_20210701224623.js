const header = document.querySelector("header");

window.onscroll = function() {
    "use strict";
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
}

function outline(input) {
    this.input.parent.style.backgroundColor = "blue";
    input.parent.classList.add("active");
}