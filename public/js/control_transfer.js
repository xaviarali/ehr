/*
 *  written in jQuery
 *  Author: Zaaviar Ali
 *  Email: xyle.xavier@gmail.com
 *  Last Upadated: 24-Jan-2017
 */

// when DOM is ready
$(function(){
    $.get('/login_check',function(status){
        if(status.status == 1)
           window.close();
        else
            window.location = "https://drchrono.com/o/authorize/?redirect_uri=https://ide50-xavi4.cs50.io/authenticate&response_type=code&client_id=sFWDyuTnMLku0mn6ectbYb8mlKPdvYEWyfitv1Ga&scope=clinical:read clinical:write";
    },"json");
});