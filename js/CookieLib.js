function setHashCookie(sName, sValore, iGiorni) {
    var dtOggi = new Date()
    var dtExpires = new Date()
    dtExpires.setTime
      (dtOggi.getTime() + 24 * iGiorni * 3600000)
    document.cookie = sName + "=" + escape(sValore) +
      "; expires=" + dtExpires.toGMTString();
}
function getHashCookie(sName) {
    var asCookies = document.cookie.split("; ");
    for (var iCnt = 0; iCnt < asCookies.length; iCnt++) {
        var asCookie = asCookies[iCnt].split("=");
        if (sName == asCookie[0]) {
            return (unescape(asCookie[1]));
        }
    }
    return ("");
}
function delHashCookie(sName) {
    setHashCookie(sName, "");
}

function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}
function getRandomChar() {
    var chars = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
    return chars.substr(getRandomNumber(62), 1);
}
function randomID(size) {
    var str = "";
    for (var i = 0; i < size; i++) {
        str += getRandomChar();
    }
    return str;
}

uid_hash = getHashCookie("hashcookie");

if (uid_hash == "") {
    uid_hash = randomID(20);
    setHashCookie("hashcookie", uid_hash, 365)
} else {
    uid_hash = getHashCookie("hashcookie");
}
