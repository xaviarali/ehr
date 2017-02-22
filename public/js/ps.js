$(function(){
    $('#s').css('background-color','green');
    $.get('/getMeds',{id:localStorage.getItem('viewId')},function(data){
        var mhtml = "";
        for(var i=0;i<data.length;i++)
        {
            mhtml += insertMed(data[i],i+1);
            setNote(data[i].pharmacy_note);
        }
        $('#xmeds').html(mhtml);
    },'json');
    setPersonalInfo();
});

function setPersonalInfo()
{
    if(!localStorage.getItem('AllPatients'))
       alert('No Info Available');
    var str = localStorage.getItem('AllPatients');
    var json = JSON.parse(str);
    
    for(var i=0;i<json.length;i++)
    {
        if(json[i].id == localStorage.getItem('viewId'))
        {
            // TODO:
        }
    }
}
function insertMed(med,number)
{
    var appointment = med.appointment; 
    var date_prescribed = med.date_prescribed; 
    var date_started_taking = med.date_started_taking; 
    var date_stopped_taking = med.date_stopped_taking;
    var daw = med.daw;
    var dispense_quantity = med.dispense_quantity;
    var doctor = med.doctor;
    var dosage_quantity = med.dosage_quantity;
    var dosage_units = med.dosage_units;
    var frequency = med.frequency;
    var id = med.id; 
    var indication = med.indication; 
    var name = med.name; 
    var notes = med.notes;
    var number_refills = med.number_refills;     
    var order_status = med.order_status;
    var patient = med.patient;
    var pharmacy_note = med.pharmacy_note;
    var prn = med.prn; 
    var route = med.route; 
    var rxnorm = med.rxnorm;
    var signature_note = med.signature_note; 
    var status = med.status;
    return "<table class=\"table table-bordered\"><thead><tr><td class=\"bg-success\" colspan=\"8\"><span id=\"drug1\">"+name+"</tr></td></tr></thead><tbody><tr class=\"active\"><th colspan=\"3\">Take once a day for 30 days.</th><th><bold>Dispence:</bold>"+dispense_quantity+"</th><th><bold>PUC:</bold>Capsule</th><th><bold>DaW:</bold>"+daw+"</th><th><bold>Refills:</bold>"+number_refills+"</th><th>Drug "+number+"</th></tr></tbody></table>";
}

function setNote(note)
{
    console.log('PS:'+ note);
    if(note != null)
    {
       note = note.replace(/(?:\r\n|\r|\n)/g, '<br />');
       $('#pxnote').append(note);    
       $('#pxnote').append("<br>");
    }
    
}