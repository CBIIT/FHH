/**
 * Created by hendrikssonm on 9/4/2014.
 */
var pdialog;
var familyarray = new Array();
var familyclonearray = new Array();
var brothers = new Array();
var personal_information_clone;
var ME,MEID;

function GET_FAMILY(){


    pdialog = $('<div id="pivottag" width="100%" class="">' +
        '<div id="pivot_info">' +
        '<table id="pivot_table">' +
        '<thead></thead>' +
        '<tfoot></tfoot>' +
        '<tbody>' +
        '<tr>' +
        '<td>' +
            //'<input type="button" class="transfer" value="transfer" onclick="TRANSFER()"/>' +
        '<input type="button" class="transfer" value="SWAP & CLONE" onclick="CHECK()"/>' +
        '<input id="clone_xml" type="button" class="transfer" value="SAVE & TRANSFER" onclick="transfer_save_xml()"/>' +
        '<input id="clone_xml" type="button" class="transfer" value="RESET" onclick="RESET()"/>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    );

    $(pdialog).dialog({
        autoOpen: false,
        position: ['middle', 0],
        title: 'Family Transfer',
        height: 500,
        width: ['97%'],
        modal: true,
        open: function (){
            $(this).dialog("open");
            $(this).load(tableCreate());
        },
        close: function(){
            $(this).empty();
            $(this).dialog('destroy').remove()
        }
    });

    ME = personal_information.name;
    MEID = personal_information.id;

    $.each(personal_information, function (key, item) {
        if (item.name!=null) {
            familyarray.push({"key":key, "id":[item.id], "name":[item.name], "relationship":[item.relationship], "pid":[item.pid]})
        }
    });

    pdialog.dialog('open');

    var sel = $('<select id="transferer">').appendTo('body');
    sel.append($("<option class='pivotlist' selected>").attr('value','me').text(ME));
    $(familyarray).each(function() {
        sel.append($("<option>")
            .attr('key',this.key)
            .attr('value',this.id)
            .attr('name',this.name)
            .text(this.name + ' - ' + this.relationship));
    });

    $("#pivot_table").find('tbody')
        .append(sel);

    //$.each(personal_information, function (key, item) {
    //    alert("PIVOT-->"+item.name);
    //})




}
function TRANSFER(){
    var MID = $( "#transferer option:selected" ).attr('value');

    $.each(personal_information, function (key, item) {
        if(MID == item.id){
            alert("Dadaaa-->"+[item.id,item.name,item.parent_id])
        }

    });
    //alert($( "#transferer option:selected" ).attr('value'));
    //alert($('#transferer').selected )


}

/*
 * Function to set up the swap for users
 */
function CHECK(){
    var CHANGE_PARAMS = ['id','name'];
    var SWAP_DATA = new Array();
    //Set the main values for change
    var SELECTED_ID = $( "#transferer option:selected" ).attr('value');
    var SELECTED_NAME = $( "#transferer option:selected" ).attr('name');
    var SELECTED_KEY = $( "#transferer option:selected" ).attr('key');

    var TRANSFER_DATA = [SELECTED_ID,SELECTED_NAME,SELECTED_KEY];

    var CHANGE_ID = personal_information.id;
    var CHANGE_NAME = personal_information.name;
    var CHANGE_DATA = [CHANGE_ID,CHANGE_NAME];

    if(SELECTED_ID == CHANGE_ID){
        alert("Please select one of you family members")
        return false;
    }



    //Get the old values
    //var OLD_DATA = OLD_VALUES(CHANGE_DATA);
    //Get the new values
    var NEW_DATA = NEW_VALUES(TRANSFER_DATA);

    //for(var t in OLD_DATA) {
    //
    //
    //
    //    ////Swap to new values
    //    //personal_information_clone.id = NEW_DATA[k].id;
    //    //personal_information_clone.name = NEW_DATA[k].name;
    //    //personal_information_clone.date_of_birth = NEW_DATA[k].date_of_birth;
    //    //personal_information_clone.gender = NEW_DATA[k].gender;
    //    //personal_information_clone.ethnicity = NEW_DATA[k].ethnicity;
    //    //personal_information_clone.race = NEW_DATA[k].race;
    //    //personal_information_clone['Health History'] = NEW_DATA[k]['Health History'];
    //
    //}

    //Build a new clone
    alert ("Original Personal Information:" + JSON.stringify(personal_information, null, 2) );

    //Clone the table
    personal_information_clone = $.extend(true, {}, personal_information);
    //Get brother info
    $.each(personal_information_clone, function (key, data) {
        if (key.substring(0, 7) == "brother") {
            brothers.push(key);
        }

    });

    for(var k in NEW_DATA) {

        //Swap to new values
        personal_information_clone.id = NEW_DATA[k].id;
        personal_information_clone.name = NEW_DATA[k].name;
        personal_information_clone.date_of_birth = NEW_DATA[k].date_of_birth;
        personal_information_clone.gender = NEW_DATA[k].gender;
        personal_information_clone.ethnicity = NEW_DATA[k].ethnicity;
        personal_information_clone.race = NEW_DATA[k].race;
        personal_information_clone['Health History'] = NEW_DATA[k]['Health History'];

        //Empty values
        personal_information_clone.weight = "";
        personal_information_clone.weight_unit = "";
        personal_information_clone,height = "";
        personal_information_clone.height_unit = "";
    }

    //Swap with the selected brother
    if (SELECTED_KEY.substring(0, 7) == "brother") {
        var id = personal_information.id;
        var name = personal_information.name;
        var date_of_birth = personal_information.date_of_birth;
        var gender = personal_information.gender;
        var ethnicity = personal_information.ethnicity;
        var race = personal_information.race;

        $.each(personal_information_clone, function (key, data) {
            if (key == SELECTED_KEY) {
                personal_information_clone[key].id = id;
                personal_information_clone[key].name = name;
                personal_information_clone[key].date_of_birth = date_of_birth;
                personal_information_clone[key].gender = gender;
                personal_information_clone[key].ethnicity = ethnicity;
                personal_information_clone[key].race = race;
                personal_information_clone[key]['Health History'] = personal_information['Health History'];

                return false;
            }
        });
    }


    //Swap with the selected brother
    if (SELECTED_KEY.substring(0, 6) == "sister") {
        var newbrother;

        //delete personal_information_clone[SELECTED_KEY];


        //$.each(personal_information_clone, function (key, data) {
        //    if (key == "brother_" + parseInt(brothers.length + 1)) {
        //        newbrother = "brother_" + parseInt(brothers.length + 2);
        //    }
        //});

        //newbrother = BROTHERS()

        var id = personal_information.id;
        var name = personal_information.name;
        var date_of_birth = personal_information.date_of_birth;
        var gender = personal_information.gender;
        var ethnicity = personal_information.ethnicity;
        var race = personal_information.race;

        $.each(personal_information_clone, function (key, data) {
            if (key == SELECTED_KEY) {
                personal_information_clone[key].id = id;
                personal_information_clone[key].name = name;
                personal_information_clone[key].date_of_birth = date_of_birth;
                personal_information_clone[key].gender = gender;
                personal_information_clone[key].ethnicity = ethnicity;
                personal_information_clone[key].race = race;
                personal_information_clone[key]['Health History'] = personal_information['Health History'];
                //personal_information_clone[SELECTED_KEY]=BROTHERS();



                //return false;
            }
        });
    }

    alert ("CLONE Personal Information:" + JSON.stringify(personal_information_clone, null, 2) );
    CLONED();

}

function BROTHERS(){
    var newbrother;
    $.each(personal_information_clone, function (key, data) {
        if (key == brothers[brothers.length - 1]) {
            var nr = parseInt(key.substring(key.indexOf('_')+1,key.length))+1;
            newbrother =  "brother_" +nr;
            alert("return newbrother-->"+newbrother)
            return newbrother;
        }
    });



}

function CLONED(){
    //Remove old table
    $('#transferer').remove();

    var CME = personal_information_clone.name;

    $.each(personal_information_clone, function (key, item) {
        var newname;
        if(typeof item != 'undefined') {
            newname = item.name;
            //}
            if (newname != null && typeof (newname != 'undefined')) {
                familyclonearray.push({
                    "key": key,
                    "id": [item.id],
                    "name": [item.name],
                    "relationship": [item.relationship],
                    "pid": [item.pid]
                })
            }
        }
    });

    var sel = $('<select id="transferer">').appendTo('body');
    sel.append($("<option class='pivotlist' selected>").attr('value','cme').text(CME));
    $(familyclonearray).each(function() {
        sel.append($("<option>")
            .attr('key',this.key)
            .attr('value',this.id)
            .attr('name',this.name)
            .text(this.name + ' - ' + this.relationship));
    });

    $("#pivot_table").find('tbody')
        .append(sel);
}

function RESET(){
    //Remove old table
    $('#transferer').remove();

    familyarray = new Array();

    var ME = personal_information.name;

    $.each(personal_information, function (key, item) {
        if (item.name!=null) {
            familyarray.push({"key":key, "id":[item.id], "name":[item.name], "relationship":[item.relationship], "pid":[item.pid]})
        }
    });

    var sel = $('<select id="transferer">').appendTo('body');
    sel.append($("<option class='pivotlist' selected>").attr('value','me').text(ME));
    $(familyarray).each(function() {
        sel.append($("<option>")
            .attr('key',this.key)
            .attr('value',this.id)
            .attr('name',this.name)
            .text(this.name + ' - ' + this.relationship));
    });

    $("#pivot_table").find('tbody')
        .append(sel);
}

function myFunction(SWAP_DATA){
    var parsedJSON = JSON.parse(SWAP_DATA.d);
    for (var i=0;i<parsedJSON.length;i++) {
        alert(parsedJSON[i]);
        alert(parsedJSON[i].id);
        alert(parsedJSON[i].name);
    }
}

//Search and Return the new data
function OLD_VALUES(ARRAY){


    alert("START OLD -- > "+ ARRAY[0])

    alert("PERSONAL START OLD -- >"  + personal_information.id)

    var DATA_BLOCK = new Array();
    for(var k in personal_information) {

        if(personal_information[k].id == ARRAY[0]) {



            DATA_BLOCK.push(personal_information[k]);
        }
    }

    return DATA_BLOCK;
}

//Search and Return the new data
function NEW_VALUES(ARRAY){
    var DATA_BLOCK = new Array();
    for(var k in personal_information) {
        if(personal_information[k].id == ARRAY[0]) {
            DATA_BLOCK.push(personal_information[k]);
        }
    }

    return DATA_BLOCK;
}

function OLD_DATA_PURGE(DATA) {
    //var data = {"result":[
    //    {"FirstName":"Test1","LastName":"User","Email":"test@test.com","City":"ahmedabad","State":"sk","Country":"canada","Status":"False","iUserID":"23"},
    //    {"FirstName":"user","LastName":"user","Email":"u@u.com","City":"ahmedabad","State":"Gujarat","Country":"India","Status":"True","iUserID":"41"},
    //    {"FirstName":"Ropbert","LastName":"Jones","Email":"Robert@gmail.com","City":"NewYork","State":"gfg","Country":"fgdfgdfg","Status":"True","iUserID":"48"},
    //    {"FirstName":"hitesh","LastName":"prajapti","Email":"h.prajapati@zzz.com","City":"","State":"","Country":"","Status":"True","iUserID":"78"}
    //]
    //}

    alert ("Original Personal Information:" + JSON.stringify(personal_information, null, 2) );

    //alert(personal_information_clone)
    delete personal_information_clone[0].id;
    delete personal_information_clone[0].name;
    //alert(personal_information_clone)


    //alert ("PURGED Personal Information:" + JSON.stringify(DATA, null, 2) );
    alert ("PURGED Personal Information:" + JSON.stringify(personal_information_clone, null, 2) );
}

//{
//    "Disease Name": "Other Kidney Disease",
//    "Detailed Disease Name": "Other Kidney Disease",
//    "Age At Diagnosis": "30-39 years"
//}

function HEALTH_ARRAY(ARRAY){
    var temp = new Array();
    $.each(ARRAY, function (key, item) {
        temp.push({"id":[item.id], "name":[item.name], "relationship":[item.relationship], "pid":[item.pid]});

        alert([item['Disease Name']])
        //alert(personal_information[k]['Health History'])
    });
}

function SWAP(ARRAY){
    var swaparray = new Array();
    var healtharray = new Array();


    $.each(ARRAY, function(key, item) {

        if(item['Health History']) alert(item['Health History'])

    });
    //$.each(item['Health History'], function (key, item) {


    //$.each(ARRAY, function (key, item) {
    //swaparray.push({
    //    "id":[item.id],
    //    "gender":[item.gender],
    //    "name":[item.name],
    //    "twin_status":[item.name],
    //    "cause_of_death":[item.name],
    //    "detailed_cause_of_death":[item.name],
    //    "estimated_death_age":[item.name],
    //
    //    "Health History":[{item.name}],
    //
    //    "ethnicity": {"Ashkenazi Jewish": true}
    //    "relationship":[item.relationship],
    //
    //    "race": {"White": true},
    //
    //    "relationship": "paternal_grandmother"
    //
    //});





}


function REPLACE_DATA( field, oldvalue, newvalue ) {

    alert([newvalue[0],newvalue[1]])

    personal_information_clone[field[0]] = newvalue[0];
    personal_information_clone[field[1]] = newvalue[1];

    /*
     for(var k in personal_information_clone) {

     //alert("oldvalue*** "+oldvalue)
     //alert("PESRONAL NEW*** "+personal_information_clone[k][field])

     if( oldvalue == personal_information_clone[k][field] ) {

     alert("LOOP FOUND-->"+personal_information_clone[k][field])

     personal_information_clone[k][field] = newvalue ;
     }
     }
     */
    return personal_information_clone;
}

function TRANSFER_BROTHER(){

}
function TRANSFER_SISTER(){

}


function replacer(key,value)
{
    if (key=="privateProperty1") return undefined;
    else if (key=="privateProperty2") return undefined;
    else return value;
}

function TRANSFORM_CLONE(CLONE){
    var id = CLONE.id;
    var name = CLONE.name;
    var date_of_birth = CLONE.date_of_birth;
    var gender = CLONE.gender;

    alert([id,name,date_of_birth])

}

function CHECKPIVOT(){


    var id = personal_information.id;
    var name = personal_information.name;
    var date_of_birth = personal_information.date_of_birth;
    var gender = personal_information.gender;

    alert(JSON.stringify(replacer(x, ['privateProperty1','privateProperty2'])));
}

function replacer1(obj, keys)
{
    var dup = {};
    for (key in obj) {
        if (keys.indexOf(key) == -1) {
            dup[key] = obj[key];
        }
    }
    return dup;
}




//function HEALTHARRAY(ARRAY){
//    var healtharray = new Array();
//
//    $.each()
//
//    healtharray.push( "Health History":[{item.name}]);
//
//}


