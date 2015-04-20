$(function () {

    $(".dispatch").click(function (){
        $.ajax({
            url: "/server/records_handler.php",
            type: "GET",
            success: function (data) {
            },
            error: function(request, status, error) {
            }
        });
    });
});
