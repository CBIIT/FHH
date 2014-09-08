/**
 * Created by hendrikssonm on 9/4/2014.
 */
var pdialog;
var familyarray = new Array();
var familyclonearray = new Array();
var brothers = new Array();
var personal_information_clone=null;
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
}
function TRANSFER(){
    var MID = $( "#transferer option:selected" ).attr('value');

    $.each(personal_information, function (key, item) {
        if(MID == item.id){
        }

    });
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
    //Build a new clone
    alert ("Original Personal Information:" + JSON.stringify(personal_information, null, 2) );

    //Clone the table
    personal_information_clone = null;
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

        var newbro = BROTHERS();

        var id = personal_information.id;
        var name = personal_information.name;
        var date_of_birth = personal_information.date_of_birth;
        var gender = personal_information.gender;
        var ethnicity = personal_information.ethnicity;
        var race = personal_information.race;

        var array = new Array();
        array.push(id)
        array.push(name)
        array.push(date_of_birth)
        array.push(gender)
        //var tmp = JSON.stringify(personal_information_clone);

        //myJSON = JSON.stringify({brother_2: array});
        var objToAdd = {brother_2: {"id":id, "name":name, "date_of_birth":date_of_birth, "gender":gender}};

        $.each(personal_information_clone, function (key, data) {
            if(key == "sister_0") data = objToAdd;
        });
        alert ("BRAND NEW JSON :" + JSON.stringify(personal_information_clone, null, 2) );
        $.each(personal_information_clone, function (key, data) {

            //personal_information_clone = JSON.parse(personal_information_clone, function(key, ) {


            if (key == SELECTED_KEY) {
                for (var item in this) {
                    this.id = id;
                    this.name = name;
                    this.date_of_birth = date_of_birth;
                    this.gender = gender;
                    this.race = race;
                    this.name['Health History'] = personal_information['Health History'];
                }




            }

        });


        alert(personal_information_clone.sister_0.text)

        JSON.stringify(personal_information_clone.sister_0).replace('sister_0', "brother_2")

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

    $('#transferer')
        .find('option')
        .remove()
        .end()
    ;
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


//Search and Return the new data
function OLD_VALUES(ARRAY){
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
}


function REPLACE_DATA( field, oldvalue, newvalue ) {


    personal_information_clone[field[0]] = newvalue[0];
    personal_information_clone[field[1]] = newvalue[1];
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



