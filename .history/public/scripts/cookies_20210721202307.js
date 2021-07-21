var cookieRequest = document.querySelector(".save-selection");

var answeredCookie;
var defaultCookie = false;

// Wenn Akzeptiert wird, wird checkCookie ausgeführt
cookieRequest.addEventListener("click", function() {
    defaultCookie = true;
    checkCookie("cookie");
});

// getsCookie Name
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return "";
}

// checked, ob der Cookie schon gesetzt ist
function checkCookie(name) {
    answeredCookie = getCookie(name);
    console.log(answeredCookie);
    if (answeredCookie == "true") {
        $("section[name='cookies']").removeClass("fade-up");
    } else {
        $("section[name='cookies']").addClass("fade-up");
        if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1) == "datenschutz") {
            $(".fade-up").css("animation", "none").css("bottom", "40px");
        }
    }

    // document.querySelector("section[name='cookies']").style = null;
    answeredCookie = defaultCookie;
    if (answeredCookie != "" && answeredCookie != null) {
        setCookie("cookie", answeredCookie, 365);
        $("section[name='cookies']").removeClass("fade-up");
        $("section[name='cookies']").attr("style", "");
        $("section[name='cookies']").addClass("fade-out");
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" +d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}
