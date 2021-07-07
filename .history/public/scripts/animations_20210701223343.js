const header = document.querySelector("header");

window.onscroll = function() {
    if(document.body.scrollTop > 20) {
        header.classList.add("scroll");
    } 
}