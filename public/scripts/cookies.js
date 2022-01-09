var answeredCookie;
var defaultCookie   = false;

toggleCookie = function() {
    $("section[name='cookies']").removeClass("fade-up");
    $("section[name='cookies']").attr("style", "");
    $("section[name='cookies']").addClass("fade-out");
}

// function toggleMode() {
//     try {
//         var osmode = getCookie("osmode");
//     } catch (error) {
//         osmode = "light";
//     }
//     const root = document.querySelector(":root").style;
//     if (osmode == "light") {
//         root.setProperty("--white-", "#000");
//         root.setProperty("--black-", "#fff");
//         root.setProperty("--grey-background", "#1a1a1a");
//         setCookie("osname", "light", 14);
//     } else {
//         root.setProperty("--white-", "#fff");
//         root.setProperty("--black-", "#000");
//         root.setProperty("--grey-background", "#f5f5f5");
//         setCookie("osname", "light", 14);
//     }
// }

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
function checkCookie(name, expectedAnswer) {
    answeredCookie = getCookie(name);
    if (answeredCookie == expectedAnswer) {
      $("section[name='cookies']").removeClass("fade-up");
    } else {
      $("section[name='cookies']").addClass("fade-up");
      if (window.location.href.substring(window.location.href.lastIndexOf("/") + 1) == "datenschutz") {
        $(".fade-up").css("animation", "none").css("bottom", "40px");
      }
    }
}

function setCookie(cname, cvalue, exdays) {
    if (cname === "cookie") {
        toggleCookie();
    }
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" +d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}
