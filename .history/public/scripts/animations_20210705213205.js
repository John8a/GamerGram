const header = document.querySelector("header");

window.onscroll = function() {
    "use strict";
    if((document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) && window.innerWidth > 480) {
        header.classList.add("scroll");
    } else if(window.innerWidth <= 480 && (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20)) {
        header.classList.remove("fade-in");
        header.classList.add("remove-top");
    } else {
        header.classList.remove("scroll");
        header.classList.add("fade-in");
        header.classList.remove("remove-top");
    }
}

function outline(input) {
    input.parentElement.classList.toggle("active");
}