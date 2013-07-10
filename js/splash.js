$(document).ready(function () {
    $('p.lang img').click(function () {
        window.localStorage.setItem("lang",$(this).attr("alt"));
    });
});