$(function () {

    $(".send").click(function (){
       // alert("CookieBarie CookieBarie .... CookieBarie, CookieBarie CookieBarie ... CookieBarie........... Don't call me CookieBarie!!!");
        $.ajax({
            url: "/server/waves_handler.php",
            type: "GET",
            success: function (data) {
                console.log(data);
            },
            error: function(request, status, error) {
                console(error);
            }
        });
    });
});
