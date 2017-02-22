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
           window.location = "/home";
        else
            window.location = "/";
    },"json");
    
    $(document).on('click','#submit',function(event){
          event.preventDefault();
           var timer = setInterval(function(){
             $.get('/login_check',function(status){
            if(status.status == 1){
               clearInterval(timer);
               window.location = "/home";
            }
            },"json");
        },1000);
          var URL = "https://drchrono.com/o/authorize/?redirect_uri=https://ide50-xavi4.cs50.io/authenticate&response_type=code&client_id=hS7jz4iDshQPovuwzhjalDSdySYfQ4FVqNZHK2G3";
          window.open(URL, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    });
});