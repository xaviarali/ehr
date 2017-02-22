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
           $("#test").html('Welcome to your Home!!!');
        else
            window.location = "/";
    },"json");
    $('#medPatientsTable').hide();
    $(document).on('click','#signout',function(e){
        e.preventDefault();
        $.get('/logout',function(data){
             window.location = "/";
        });
    });
    $.get('/getAllPatients',function(data){
        
        var table = "";
        localStorage.setItem('AllPatients',JSON.stringify(data));
        for(var i = 0,len = data.length; i < len; i++)
        {
            table += getTableRow(data[i]);
            //localStorage.setItem(data[i],)
            bindEventListener(data[i].id)
        }
        $('#patients').html(table);
    },'json');
    
    $(document).on('click','#sendtoAll',function(e){
        e.preventDefault();
        $('#sendtoAll').html('Sending...');
        $.get('/sendtoAll',{'note':$('#pnote').val()},function(data){
             $('#sendtoAll').html('Sent');
        });
    });
    
    $.get('/getMedPatients',function(data){
        
        var table = "";
        localStorage.setItem('AllPatients',JSON.stringify(data));
        for(var i = 0,len = data.length; i < len; i++)
        {
            table += getTableRow(data[i]);
            //localStorage.setItem(data[i],)
            bindEventListener(data[i].id)
        }
        $('#medPatients').html(table);
    },'json');
    
    $(document).on('click','#medPat',function(e){
        $('#patientsTable').hide();
        $('#medPatientsTable').show();
    });
    
    $(document).on('click','#allPat',function(e){
        $('#patientsTable').show();
        $('#medPatientsTable').hide();
    });

});

function getTableRow(data)
{
    var name = data.first_name+' ' + data.last_name;
    var chartId = data.chart_id;
    var email = data.email;
    var gender = data.gender;
    var spButton = "<button id=\"s"+ data.id+"\" data-id=\""+data.id +"type=\"button\" class=\"btn btn-danger\">Send</button>";
    var vButton = "<button id=\"v"+ data.id+"\" data-id=\""+data.id +"type=\"button\" class=\"btn btn-primary\">View</button>";
    return "<tr><th scope=\"row\">"+chartId+"</th><td>"+name+"</td><td>"+email+"</td><td>"+gender+"</td><td>"+spButton+"</td><td>"+vButton+"</td></tr>";
}

function bindEventListener(id)
{
       $(document).on('click','#s'+id,function(e){
        e.preventDefault();
        console.log('Id#'+id);
        
        $.get('/sendPrescriptionNote',{'id':id,'note':$('#pnote').val()},function(data){
             if(data.status == 1){
                 $('#s'+id).text('Sent');
                 //$('#s'+id).addClass('.btn.btn-success').removeClass('.btn.btn-danger');
                 $('#s'+id).removeClass("btn btn-danger").addClass("btn btn-success");
                 // $('#s'+id).addClass('.btn-success');
                 console.log($('#pnote').val());
             }
             },'json');
    });
    
    $(document).on('click','#v'+id,function(e){
        e.preventDefault();
        localStorage.setItem('viewId',id);
         $.get('/getMeds',{'id':id},function(data){
            if(data.length > 0)
              window.open('/getPS','_blank');
            else
              alert('No Medication Prescriped to the User.');
         }); 
        //window.open('/getPS','_blank');
    });
}