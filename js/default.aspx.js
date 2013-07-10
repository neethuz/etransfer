$(document).ready(function () {
    $('.driverselect span').click(function () {
        $('.driverdropdown').fadeToggle();
    });
    $('.driverdropdown').mouseleave(function () {
        $('.driverdropdown').fadeOut();
    });
});