$(document).ready(function () {
    $('div.lang img').click(function () {
        window.localStorage.setItem("lang",$(this).attr("alt"));
    });
});