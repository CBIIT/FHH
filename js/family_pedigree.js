/**
 * Created by hendrikssonm on 9/4/2014.
 */


var mdialog,tdialog;
var original;
var clone;
var masterRight = $(window).width();
var masterHeight = $(window).height();
var masterleft=Math.floor(parseInt(masterRight)/2);
var mastery,masterx;
var x = new Array();
var y = new Array();
var xl = new Array();
var HEALTHARRAY = new Array();
var DISEASELISTARRAY = new Array();
var ex,ey;
var MYNAME,MYGENDER;
var svgw;
var diseasearray=new Array();
var pstart,pend,mstart,mend;
var $optdialog;
var SINGLEGROUPS = 0;
var GRANDSGROUP = 0;
var SISTERSGROUP = 0;
var oTable;

var defaultfamilyarray=[
    'maternal_grandfather',
    'maternal_grandmother',
    'paternal_grandfather',
    'paternal_grandmother',
    'mother',
    'paternal_grandmother',
    'father',
    'brother',
    'sister',
    'son',
    'daughter',
    'maternal_uncle',
    'maternal_aunt',
    'paternal_uncle',
    'paternal_aunt'

];

function xmlload() {

    mdialog = $('<div id="family_pedigree" class="family_dialog" >' +

            //'<input align="right" type="button" value="pivot" onclick="GET_FAMILY()"/>' +
        '<div id="family_pedigree_info">' +

        '<div align="left" >' +
        '<input id="printer" align="right" type="button" class="tablebutton" value="Print Report"/>' +
        '<input id="downoptions" align="right" type="button"  class="tablebutton" onclick="createDialog()" value="Diagram Table & Options"/>' +
        '<table id="bmi_table" class="htable">' +
        '<caption>My Personal Information</caption>' +
        '<tr><td id="age">Age:</td></tr>' +
        '<tr><td id="height">Height:</td></tr>' +
        '<tr><td id="weight">Weight:</td></tr>' +
        '<tr><td id="abmi">BMI:</td></tr>' +
        '</tr></table>' +
        '</div>' +

        '<table id="closed_table" ><tr><td></td></tr></table>' +
        '<table id="health_table" class="display compact">' +
        '<caption>Disease Matrix Table</caption>' +
        '<thead></thead>' +
        '<tfoot></tfoot>' +
        '<tbody></tbody>' +
        '</table>' +
        '</div>' +
        '</div>'
    );



    $(mdialog).dialog({
        autoOpen: false,
        position: ['middle', 0],
        title: 'Family Pedigree Chart',
        height: 'auto',
        width: 'auto',
        modal: true,
        open: function () {
            $(this).dialog("open");
            $(this).load(LOAD_HEALTH_TABLE());
            window.scrollBy(1500, 10 );
        },
        close: function () {
            $(this).empty();
            $(this).dialog('destroy').remove()
        }
    });


    $(document).ready(function() {


        $.each(personal_information['Health History'], function (key, item) {
            if (item == 'undefined' || item == null) item = "";
            var dn = item['Disease Name'];
            if(diseasearray.length == 0){
                diseasearray.push(dn)
            }
            else if ($.inArray(dn, diseasearray) == -1){
                diseasearray.push(dn)
            }
        });

        $.each(personal_information, function (key, item) {
            if (item == 'undefined' || item == null) item = "";
            if (item.id) {
                $.each(item['Health History'], function (k, data) {
                    var dn = data['Disease Name'];
                    if(diseasearray.length == 0){
                        diseasearray.push(dn)
                    }
                    else if ($.inArray(dn, diseasearray) == -1){
                        diseasearray.push(dn)
                    }
                });
            }
        });

        var HEADERS = new Array;
        HEADERS.push({"title":'Name'});
        HEADERS.push({"title":'Relationship'});
        HEADERS.push({"title":'Still Living'});

        for (i = 0; i < diseasearray.length; i++) {
            var NAME = diseasearray[i];
            var COL = i + 3;
            var DID = 'D_' + COL;
            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" style="padding-right: 5px;padding-top: 2px"/></a>' +
            NAME
            });
        }

        oTable = $('#health_table').dataTable({
            "bPaginate": true,
            //"scrollY": "300px",
            //"sScrollY": "250px",
            "bAutoWidth": true,
            "bScrollCollapse": false,
            "bLengthChange": false,
            "bFilter": true,
            "displayLength": 25,
            "dom": 'Rlfrtip',
            //"dom": 'Rlfrtip','T<"clear">lfrtip',
            tableTools: {
                "aButtons": [ "print" ]
            },
            "columns": HEADERS

        });

        //oTable
    });


    var merr = 45;
    var ferr = 25;
    var cr = 21;
    var rr = 40;
    var l = 355;
    var r = 350;
    var ml = 350;
    var pl = 350;
    var dl = 350;
    var sl = 350;
    var p1 = 0;
    var p2 = 0;
    var pw = 0;
    var ph = 0;
    var top = 400;
    var Ftop = 420
    var corner;
    var gencolor = 'silver';
    var spoucecolor = 'white';

    var array = new Array();
    var GrantParentalArray = new Array();
    var GrantMaternalsArray = new Array();
    var FatherArray = new Array();
    var MotherArray = new Array();

    var widtharray = new Array();
    var niecearray = new Array();
    var NephewArray = new Array();
    var SiblingsArray = new Array();
    var BrothersArray = new Array();
    var SistersArray = new Array();
    var PaternalHalfSiblingsArray = new Array();
    var MaternalHalfSiblingsArray = new Array();
    var HalfSistersArray = new Array();
    //var level1 = new Array();
    var daughter1 = new Array();
    var ChildrenArray = new Array();
    var GrandChildrenArray = new Array();
    var MaternalCousinArray = new Array();
    var PaternalCousinArray = new Array();
    var PaternalRelatives = new Array();
    var MaternalRelatives = new Array();
    //var son1 = new Array();
    //var levelneg1 = new Array();
    //var levelneg2 = new Array();

    //Start SVG
    mdialog.dialog('open');
    mdialog.svg();

    //Set SVG frame
    var svg = mdialog.svg('get');
    var LINEGROUP = svg.group({stroke: 'black', strokeWidth: 2});
    var svgw = mdialog.find('svg')[0];

    svgw.setAttribute('id', 'svgframe');
    svgw.setAttribute('height', '100%');


    //svgw.setAttribute('viewBox','-1000 -350 2800 1000');
    svgw.setAttribute('viewBox','0 0 1000 1300');
    //svgw.setAttribute('style','overflow-x:scroll; overflow-y:scroll');

    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 1, 1, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft - 120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft + 120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray' });

    svg.rect(masterleft + 420, 50, 360, 50, 10, 10, {id: 'options', class: 'tablebutton', fill: 'darkslategray', stroke: 'white', strokeWidth: 1, onclick:'createDialog()', cursor:'pointer'});
    svg.text(masterleft + 450, 80, "Diagram Table & Options", {class: 'tablebutton', fontWeight: 'bold', fontSize: '18.5', fill: 'white', onclick:'createDialog()', cursor:'pointer'});

    $('#optionsPanel').attr('width', '800px');

    svg.line(LINEGROUP, masterleft - 100, 220, masterleft + 120, 220, {id: 'mel', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'mei', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'grmei', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft - 140, 220, masterleft + 180, 220, {id: 'grmei1', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft - 140, 200, masterleft - 140, 70, {id: 'grmei2', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 180, 200, masterleft + 180, 70, {id: 'grmei3', stroke: 'black', strokeWidth: 3});


    //alert ("personal_information ARRAY Information:" + JSON.stringify(personal_information, null, 2) );

    //Gender
    if (personal_information.gender == 'MALE') {
        //Center Me
        svg.rect(masterleft+5, top, rr, rr, 1, 1, {
            id: 'me',
            class: 'male',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
        masterx = parseInt($('#me').attr('x'));
        mastery = parseInt($('#me').attr('y'));
    }
    else if (personal_information.gender == 'FEMALE') {

        svg.circle(masterleft + 25, Ftop, cr, {
            id: 'me',
            class: 'female',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
        masterx = parseInt($('#me').attr('cx'));
        mastery = parseInt($('#me').attr('cy') - 20);
    }

    var weight, height,age,weight_unit,height_unit;
    if(typeof personal_information.weight == 'undefined' || personal_information.weight == null) {
        weight="";
        weight_unit="";
    }
    else{
        weight =  personal_information.weight;
        weight_unit =  personal_information.weight_unit;

    }
    if(typeof personal_information.height == 'undefined' || personal_information.height == null) {
        height="";
        height_unit="";
    }
    else{
        height =  personal_information.height;
        height_unit =  personal_information.height_unit;
    }

    if(typeof personal_information.date_of_birth == 'undefined' || personal_information.date_of_birth == null) {
        age="";
    }
    else{
        age = getAge(personal_information.date_of_birth);
    }

    var BMI = BMI_CALCULATE(weight,height);
    if(typeof BMI == 'undefined' || BMI == null) {
        BMI = "";
    }



    $('#age').text = age;
    $('#age').append($("<span><b></b></span>").text(age));
    if(height != "") $('#height').append($("<span><b></b></span>").text( height + " " + height_unit));
    if(weight != "") $('#weight').append($("<span><b></b></span>").text( weight + " " + weight_unit));
    $('#abmi').append($("<span><b></b></span>").text( BMI));


    //Build health array
    $.each(personal_information, function (key, item) {
        if (item == 'undefined' || item == null) item = "";

        if (item.id) {
            var ids = new Array();
            var dis = new Array();
            ids.push(item.id)
            ids.push(item.name)
            $.each(item['Health History'], function (k, data) {
                var disname = data['Disease Name'];
                var disdet = data['Detailed Disease Name'];
                ids.push(disname);
                dis.push([disname,disdet]);

                //dis.push(disname);
            });
            HEALTHARRAY.push(ids);
            if ($.inArray(dis, DISEASELISTARRAY) == -1) DISEASELISTARRAY.push(dis);
        }

    });

    var ids = new Array();
    var dis = new Array();

    ids.push('me');
    ids.push(personal_information.name);

    $.each(personal_information['Health History'], function (k, data) {
        var disname = data['Disease Name'];
        var disdet = data['Detailed Disease Name'];
        //var dis = [disname,disdet];
        ids.push(disname);

        dis.push([disname,disdet]);
        //ids.push(dis)
    });
    HEALTHARRAY.push(ids);
    DISEASELISTARRAY.push(dis);

    //alert ("DISEASELISTARRAY ARRAY Information:" + JSON.stringify(DISEASELISTARRAY, null, 2) );

    //Set the master Y levels
    var Level5F = mastery + 299;
    var Level5M = mastery + 279;

    var Level4F = mastery + 169;
    var Level4M = mastery + 149;

    var Level3F = mastery + 20;
    var Level3M = mastery - 0;

    var Level2F = 220;
    var Level2M = 200;

    var Level1F = 70;
    var Level1M = 50;


    var NAMEARRAY = new Array();



    //Prepare all data to array formats for processing
    $.each(personal_information, function (key, item) {

        //alert ("personal_information Information:" + JSON.stringify(personal_information, null, 2) );
        //if(key=="name"){MYNAME=item};
        //if(key=="gender"){MYGENDER=item};



        //Identification when no names added
        var rand = Math.floor((Math.random() * 10000) + 1);
        if (item == 'undefined' || item == null) item = "";
        if (key == 'paternal_grandmother' || key == 'paternal_grandfather') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            GrantParentalArray.push({"key": key, "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        if (key == 'maternal_grandmother' || key == 'maternal_grandfather') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            GrantMaternalsArray.push({"key": key,  "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        if (key == 'father') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            FatherArray.push({"key": key,  "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        if (key == 'mother') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            MotherArray.push({"key": key,  "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }

        if (key.substring(0, 13) == "paternal_aunt") {
            var id,pid;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            if (item.parent_id == "" || item.parent_id == null){
                for (var d in GrantParentalArray){
                    if(GrantParentalArray[d].gender == 'FEMALE') var pid = GrantParentalArray[d].id;
                }
            }
            else pid = item.parent_id;

            array.push('PARENTALS');

            PaternalRelatives.push([item.gender, id, 'PA_' + key.substring(14, 15), pid]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            var id,pid;

            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            if (item.parent_id == "" || item.parent_id == null){
                for (var d in GrantParentalArray){
                    if(GrantParentalArray[d].gender == 'MALE') var pid = GrantParentalArray[d].id;
                }
            }
            else pid = item.parent_id;

            array.push('PARENTALS');
            PaternalRelatives.push([item.gender, id, 'PU_' + key.substring(15, 16), pid]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            array.push('MATERNALS');

            MaternalRelatives.push([item.gender, id, 'MA_' + key.substring(14, 15), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            array.push('MATERNALS');
            MaternalRelatives.push([item.gender, id, 'MU_' + key.substring(15, 16), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);

        }
        else if (key.substring(0, 6) == "nephew" || key.substring(0, 5) == "niece") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            NephewArray.push([item.gender, id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 15) == "maternal_cousin") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            var ITEMGEN = item.gender;
            if(typeof ITEMGEN == 'undefined') ITEMGEN = 'MALE';

            MaternalCousinArray.push([ITEMGEN, id, item.parent_id, key]);
            var t = {"id": [item.id], "name": [item.name], "gender": [ITEMGEN], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 15) == "paternal_cousin") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            var ITEMGEN = item.gender;
            if(typeof ITEMGEN == 'undefined') ITEMGEN = 'MALE';

            if (item.parent_id == "" || item.parent_id == null)pid = 'paternal_uncle' + rand;
            else pid = item.parent_id;

            PaternalCousinArray.push([ITEMGEN, id, key, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 7) == "brother") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            BrothersArray.push(['MALE', id, 'PB_' + key.substring(8, 9), 'me', item.twin_status]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);


        }
        /**** NEW VALUES ***/
        else if (key.substring(0, 20) == "paternal_halfbrother") {

            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            PaternalHalfSiblingsArray.push(['MALE', id, 'PHB_' + key.substring(21, 22), FatherArray[0].id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 19) == "paternal_halfsister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            PaternalHalfSiblingsArray.push(['FEMALE', id, 'PHS_' + key.substring(20, 21), FatherArray[0].id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 20) == "maternal_halfbrother") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            MaternalHalfSiblingsArray.push(['MALE', id, 'MHB_' + key.substring(21, 22), MotherArray[0].id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 19) == "maternal_halfsister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            MaternalHalfSiblingsArray.push(['FEMALE', id, 'MHS_' + key.substring(20, 21), MotherArray[0].id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }


        else if (key.substring(0, 6) == "sister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            SistersArray.push(['FEMALE', id, 'MS_' + key.substring(7, 8), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }


        else if (key.substring(0, 8) == "daughter") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            ChildrenArray.push(['FEMALE', id, key, 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);

        }
        else if (key.substring(0, 3) == "son") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            ChildrenArray.push(['MALE', id, key, 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 8) == "grandson") {

            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            GrandChildrenArray.push(['MALE', id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 13) == "granddaughter") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            GrandChildrenArray.push(['FEMALE', id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
    });

    //Set self up
    var t = {"id": 'me', "name": [personal_information.name], "gender": [personal_information.gender], key: 'self'};
    NAMEARRAY.push(t);
    //alert ("Original Personal Information:" + JSON.stringify(personal_information, null, 2) );


    //Set the children objects
    var pid = 'me';
    //Confirm my gender
    if ($('#' + pid).attr('class') == 'male') {
        p1 = parseInt($('#' + pid).attr('x'));
        p2 = parseInt($('#' + pid).attr('y'));
    }
    if ($('#' + pid).attr('class') == 'female') {
        p1 = parseInt($('#' + pid).attr('cx'));
        p2 = parseInt($('#' + pid).attr('cy'));
    }

    //Are children involved?
    if (ChildrenArray.length > 0) CHILDREN_MAIN_LOAD();
    //Are grandchildren involved?
    if (GrandChildrenArray.length > 0) GRANDCHILDREN_MAIN_LOAD();


    //Begin process
    $.each(personal_information, function (key, item) {
        var pstart,pend,mstart,mend;

        //var mleft = parseInt(masterleft) - 185;
            pend = parseInt(masterleft) - 220;
            pstart = parseInt(masterleft) - 75;
            mend = parseInt(masterleft) + 245;
            mstart = parseInt(masterleft) + 100;


        if (key == 'paternal_grandmother') {
            //var mleft = parseInt(masterleft) - 30;
            var id = item['id'];
            if (id == "" || id == null)id = "parental_grandmother";

            svg.circle(pstart, 70, cr, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key == 'paternal_grandfather') {
            //var mleft = parseInt(masterleft) - 185;
            var id = item['id'];
            if (id == "" || id == null) id = "paternal_grandfather";

            svg.rect(pend, 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });


            svg.line(LINEGROUP, parseInt(pend)-0, Level1F, parseInt(pstart)+20, Level1F, {id:'Ln_'+id , stroke: 'black',strokeWidth: 3});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }



        //Paternal Grand Parents
        if (key == 'maternal_grandmother') {
            //var mleft = parseInt(masterleft) + 200;
            var id = item['id'];
            if (id == "" || id == null)id = "maternal_grandmother";
            svg.circle(parseInt(mend), 70, cr, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key == 'maternal_grandfather') {
            //var mleft = parseInt(masterleft) + 60;
            var id = item['id'];
            if (id == "" || id == null)id = "maternal_grandfather";

            svg.rect(parseInt(mstart), 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });

            svg.line(LINEGROUP, parseInt(mend)-0, Level1F, parseInt(mstart)+20, Level1F, {id:'Ln_'+id , stroke: 'black',strokeWidth: 3});

            //SPOUCE_CONNECT(id);
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Father
        if (key == 'father') {
            var mleft = parseInt(masterleft) - 160;
            var id = item['id'];
            if (id == "" || id == null)id = "father";

            svg.rect(parseInt(mleft), 200, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });
            svg.line(LINEGROUP, parseInt(mleft) + 20, 170, parseInt(mleft) + 20, 200, {id: 'Ln_'+id, stroke: 'black',strokeWidth: 3});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Mother
        if (key == 'mother') {
            var mleft = masterleft + 180;
            var id = item['id'];
            if (id == "" || id == null)id = "mother";

            svg.circle(mleft, 220, cr, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });
            svg.line(LINEGROUP, mleft, 170, mleft, 200, {id: 'mst', stroke: 'black',strokeWidth: 3});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }


        if (typeof item == 'object') {
            var otop = 280;
            var mtop = otop + 20;
            var ftop = otop + 40;
            var mats = 0;
            var pats = 0;

            if (key.substring(0, 5) == "niece") {
                var no = key.substring(6, 7);
                var gen = item['gender'];
                var pid = item['parent_id'];
                var mid = item['id'];

                if ($('#' + pid).attr('class') == 'male') {
                    p1 = parseInt($('#' + pid).attr('x'));
                    p2 = parseInt($('#' + pid).attr('y'));
                }
                if ($('#' + pid).attr('class') == 'female') {
                    p1 = parseInt($('#' + pid).attr('cx'));
                    p2 = parseInt($('#' + pid).attr('cy'));
                }

                //Width
                pw = parseInt($('#' + pid).attr('width'));
                if (no == "0") {
                    sl = p1 - 20;
                    right_end_line(p1, p2, r, pw);
                    nieces(no, p1, p2, pid, mid);
                }
                else {
                    sl = sl + 80;
                    right_end_line(p1, p2, sl, pw);
                    nieces(no, p1, p2, pid, mid);
                }
            }
        }
        else {

        }

        var pos = 850;
        var k = svg.group({stroke: 'red', strokeWidth: 2, 'z-index': '9999'});

        //Index keys
        svg.rect(30, 40 + pos, 980, 100, 1, 1, {
            id: 'panel',
            fill: 'none',
            stroke: 'slategray',
            strokeWidth: 1
        });

        var kcr = 21;
        var krr = 40;

        //Live
        svg.text(100, 30 + pos, "Alive", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray'});
        svg.circle(75, 95 + pos, kcr, {id: 'kfd', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(120, 74 + pos, krr, krr, 1, 1, {id: 'kma', fill: gencolor, stroke: 'red', strokeWidth: 3});

        //Deceased
        svg.text(270, 30 + pos, "Deceased", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray'});
        svg.circle(270, 95 + pos, kcr, {id: 'kf', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(325, 74 + pos, krr, krr, 1, 1, {id: 'kmd', fill: gencolor, stroke: 'red', strokeWidth: 2});

        svg.text(470, 30 + pos, "A non-blood relative or relative through marriage.", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray'});
        svg.rect(570, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.circle(690, 95 + pos, kcr, {id: 'ex', fill: 'white', stroke: 'red', strokeWidth: 2});
        svg.line(LINEGROUP, 570,  95 + pos, 690,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        svg.circle(820, 95 + pos, kcr, {id: 'ex', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(900, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: 'white', stroke: 'red', strokeWidth: 2});
        svg.line(LINEGROUP, 820,  95 + pos, 900,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        //Set live status
        circlestatus('kf');
        rectstatus('kmd');

    });

    SINGLEGROUPS = COUNT_SINGLE_GROUPS(ChildrenArray);
    GRANDSGROUP = COUNT_GROUPS(GrandChildrenArray);
    SISTERSGROUP = COUNT_GROUPS(SistersArray);

    //Load Brothers
    BROTHERS_LOAD();
    //Load Sisters
    SISTERS_LOAD();
    //Load Half Brothers
    PATERNAL_HALF_SIBLINGS_LOAD();
    //Load Half Brothers
    MATERNAL_HALF_SIBLINGS_LOAD();
    //Load Maternal Uncle/Aunt
    MATERNALS_MAIN_LOAD();
    //Load Paternal Uncle/Aunt
    PATERNALS_MAIN_LOAD();
    //Load Nephews
    NEPHEWS_LOAD();

    //Load paternal Cousins
    PATERNAL_COUSINS_LOAD();
    //Load Maternal Cousins
    MATERNAL_COUSINS_LOAD();




    //Ensure the table is belw
    var SVG = document.getElementById('svgframe');
    var parent = SVG.parentNode;
    var TBL = parent.firstChild;
    parent.insertBefore(SVG, TBL);

    /*
    Tables and other information tools
     */
    LOAD_NAMES(NAMEARRAY);

    //LOAD_HEALTH(HEALTHARRAY);
    //LOAD_DISEASE_LIST(DISEASELISTARRAY);
    //BUILD_DISEASE_LIST();

    ADOPTED_FAMILY();

    $( "#printer" ).click(function() {

        $('.tablebutton').hide();
        $('#health_table').hide();

        var container = $(mdialog);
        var tableelement = $( "table" );
        var TABLE = $( container ).find( tableelement );
        var svgelement = $( "svg" );
        var SVG = $( container ).find( svgelement );
        var w = $('#svgframe').attr('width');
        var h = $('#svgframe').attr('height');


        var printContent = document.getElementById('svgframe');
        //printContent.setAttribute('viewBox', '0 -20 '+ masterRight + ' ' + masterHeight);
        //$(printContent).attr('transform', 'rotate(90,' + masterRight + ',' + masterHeight + ')');


        var windowUrl = 'about:blank';
        var uniqueName = new Date();
        var windowName = 'Print' + uniqueName.getTime();
        try {
            container.attr({align: 'left'});
            var width = parseInt(container.attr("width"));
            var height = parseInt(container.attr("height"))
            var printWindow = window.open('',windowName, 'width=' + width    + ',height=' + height, top=50,left=50,toolbars='no',scrollbars='yes',status='no',resizable='yes');
            //var printWindow = window.open('',windowName, 'width=' + masterRight + ',height=' + masterHeight, top=50,left=50,toolbars='no',scrollbars='yes',status='no',resizable='yes');
            printWindow.document.writeln('<!DOCTYPE html>');
            printWindow.document.writeln('<html><head><title>Disease Matrix</title>');
            printWindow.document.writeln('<link rel="stylesheet" type="text/css" href="../static/css/print.css" media="all">');
            printWindow.document.writeln('</head><body>');
            printWindow.document.writeln($(container).html());
            printWindow.document.writeln('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();

            var timer = setInterval(function() {
                if(printWindow.closed) {
                    clearInterval(timer);
                    $('.tablebutton').show();
                    $('#health_table').show();

                }
            }, 1000);

        } catch ( e ) {
            alert("Error: " + e.description );
        }



    });

    $.each(HEALTHARRAY, function (key, value) {
        var temp = "";
        var e, name;

        for (var item in value) {
            e = value[0];
            name = value[1];

            if (value.length > 1 && item != 0 && item != 1) temp = temp + '<li>' + value[item] + '</li>';
            else  temp + '<li> No Disease Report </li>';
        }
        ;

        $('#' + e).qtip({
            overwrite: false,
            content: {
                text: '<div align="left" width="300px" class="pop">' +
                '<ul class="navlist">' + temp + '</ul></div>',
                title: {
                    text: '<p class="qtitle">' + name +' </p>'
                    //button: true
                }
            },
            show: {
                event: 'click',
                solo: true,
                ready: false,
                effect: function (offset) {
                    $(this).slideDown(100); // "this" refers to the tooltip
                },
                modal: {
                    on: true, // Make it modal (darken the rest of the page)...
                    blur: false, // ... but don't close the tooltip when clicked
                    escape: false //dont hide on escape button
                }
            },

            position: {
                my: 'top right', // ...at the center of the viewport
                at: 'center',
                target: $('#' + e)
            },
            position: {
                target: 'mouse', // Position at the mouse...
                adjust: {mouse: false} // ...but don't follow it!
            },
            hide: {
                leave: false,
                distance: 100,
                effect: function (offset) {
                    $(this).slideDown(100); // "this" refers to the tooltip
                }
            },
            prerender: true,
            overwrite: true,
            //onHide: function() { $(this).qtip('destroy'); },
            events: {
                show: function (api, event) {
                    $('#' + e).attr('stroke', 'blue');

                },
                hide: function (api, event) {
                    $('#' + e).attr('stroke', 'red');
                    //$('#' + e).qtip('destroy');
                    //return $(this).qtip('destroy');
                }
                //hide: function(event, api) {
                //    api.destroy(true); // Destroy it immediately
                //}
            },
            style: {
                //classes:  'qtip-bootstrap'
                //classes:  'qtip-dark'
                //classes:  'qtip-shadow'
                classes:  'qtip-dark qtip-shadow',
                tip: { // Requires Tips plugin
                    corner: true, // Use position.my by default
                    mimic: false, // Don't mimic a particular corner
                    width: 8,
                    height: 8,
                    border: true, // Detect border from tooltip style
                    offset: 0 // Do not apply an offset from corner
                }




            }
        });
    });



    //Begin process
    $.each(personal_information, function (key, item) {

        if (key.substring(0, 7) == "brother") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 20) == "paternal_halfbrother") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 20) == "maternal_halfbrother") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 6) == "sister") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 19) == "paternal_halfsister"){
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 19) == "maternal_halfsister") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 13) == "paternal_aunt") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 13) == "paternal_aunt") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 6) == "nephew") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 5) == "niece") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 15) == "maternal_cousin") {
            if (typeof item.estimated_death_age != 'undefined') {
                if(item.gender == 'FEMALE')circlestatus(item['id']);
                else rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 15) == "paternal_cousin") {
            if (typeof item.estimated_death_age != 'undefined') {
                if(item.gender == 'FEMALE')circlestatus(item['id']);
                else rectstatus(item['id']);
            }
        }
        else if (key.substring(0, 8) == "daughter") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }
        else if (key.substring(0, 3) == "son") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }
    });


    function LOAD_NAMES(NAMEARRAY) {
        var k;
        var dis = new Array();
        $.each(NAMEARRAY, function () {
            //$(NAMEARRAY).each(function() {
            var temp = new Array();
            var ID = this.id;
            var NAME = this.name;
            var GEN = this.gender;
            var TITLE = this.key;
            var p1, p2, name1, name2;

            //alert ("NAMEARRAY ARRAY Information:" + JSON.stringify(NAMEARRAY, null, 2) );



            if (NAME == "") {
                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) + 5;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;
                }

                //svg.text(p1, p2, TITLE.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
            }
            else if (ID != "") {

                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;
                    temp = NAME.toString().split(' ');

                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID, class: 'namebox', fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {id:'name2_'+ID, class: 'namebox', fontWeight: 'bold', fill: 'red'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID, class: 'namebox',fontWeight: 'bold', fill: 'red'});
                    }
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) - 0;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;


                    temp = NAME.toString().split(' ');
                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID, class: 'namebox',fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {id:'name2_'+ID, class: 'namebox',fontWeight: 'bold', fill: 'red'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID, class: 'namebox',fontWeight: 'bold', fill: 'red'});
                    }
                }
            }

        });
    }


    function LOAD_HEALTH(HEALTHARRAY){

        $.each(personal_information, function (key, item) {
            var ID = item.id;
            var NAME = item.name;
            var GEN = item.gender;
            var r = 0;

            if (typeof ID != 'undefined' && ID != null) {

                if(NAME !="") var r = 30;
                else var r = 0;

                //var GEN = $('#'+ID).attr('class').toUpperCase();

                if (GEN == 'FEMALE') {
                    p1 = $('#' + ID).attr("cx") - 30;
                    p2 = parseInt($('#' + ID).attr("cy")) + 60;
                }
                else {
                    p1 = $('#' + ID).attr("x") - 10;
                    p2 = parseInt($('#' + ID).attr("y")) + 75;
                }

                $.each(item['Health History'], function (k, data) {
                    var disname = data['Disease Name'];
                    var detdisname = data['Detailed Disease Name'];
                    if(detdisname!=null) {
                        var ln = detdisname.length;
                        var F3 = disname.substr(0, 3);
                        var L2 = detdisname.substr(ln - 2, ln).toUpperCase();
                    }
                    var Abr = F3+L2;
                    BUILDSVGLIST(Abr,r);

                    r = r + 20;
                });
            }
        });

        var r = 30;

        var GEN = $('#me').attr('class').toUpperCase();

        if (GEN == 'FEMALE') {
            p1 = $('#me').attr("cx") - 30;
            p2 = parseInt($('#me').attr("cy")) + 60;
        }
        else {
            p1 = $('#me').attr("x") - 10;
            p2 = parseInt($('#me').attr("y")) + 75;
        }

        $.each(personal_information['Health History'], function (k, data) {

            var disname = data['Disease Name'];
            var detdisname = data['Detailed Disease Name'];
            if(detdisname!=null) {
                var ln = detdisname.length;
                var F3 = disname.substr(0, 3);
                var L2 = detdisname.substr(ln - 2, ln).toUpperCase();
            }
            var Abr = F3+L2;
            BUILDSVGLIST(Abr,r);
            r = r + 20;
        });
    }




    function BUILD_DISEASE_LIST(){
        var pos = 850;
        var cr = 25;
        var ident="";
        var array = new Array();

        $.each(personal_information['Health History'], function (k, data) {
            var disname = data['Disease Name'];
            var detdisname = data['Detailed Disease Name'];
            var ln = detdisname.length;

            var F3 = disname.substr(0,3);
            var L2 = detdisname.substr(ln - 2,ln).toUpperCase();

            var Abr = F3+L2;

            if ($.inArray(Abr, array) == -1) {
                array.push(Abr);
                if (detdisname == null)ident = disname;
                else ident = detdisname;
                var identInfo = Abr + " = " + ident;

                if (cr == 25) {
                    $('#itempanel').attr('height', cr + 85);
                    var f2 = pos + cr;
                    var t2 = f2 + 25;
                    cr = cr + 25;
                    svg.rect(1100, pos, 550, 100, 3, 3, {
                        id: 'itempanel',
                        fill: 'none',
                        stroke: 'slategray',
                        strokeWidth: 1
                    });

                    svg.text(1150, t2, identInfo, {
                        id: Abr,
                        fontWeight: 'bold',
                        fontSize: '22.5',
                        fill: 'slategray'
                    });
                }
                else {
                    var f2 = pos + cr;
                    var t2 = f2 + 25;
                    cr = cr + 25;
                    $('#itempanel').attr('height', cr);
                    svg.text(1150, t2, identInfo, {
                        id: Abr,
                        fontWeight: 'bold',
                        fontSize: '22.5',
                        fill: 'slategray'
                    });
                }
            }
        });

        $.each(personal_information, function (key, item) {
                if (item['Health History']) {
                    var health = new Array();
                    health = item['Health History'];
                    $.each(health, function (k, data) {
                        var disname = data['Disease Name'];
                        var detdisname = data['Detailed Disease Name'];
                        var ln = detdisname.length;

                        var F3 = disname.substr(0,3);
                        var L2 = detdisname.substr(ln - 2,ln).toUpperCase();

                        var Abr = F3+L2;

                        if ($.inArray(Abr, array) == -1) {
                            array.push(Abr);
                            if (detdisname == null)ident = disname;
                            else ident = detdisname;
                            var identInfo = Abr + " = " + ident;

                            if (cr == 25) {
                                $('#itempanel').attr('height', cr + 85);
                                var f2 = pos + cr;
                                var t2 = f2 + 25;
                                cr = cr + 25;
                                svg.rect(1100, pos, 550, 100, 3, 3, {
                                    id: 'itempanel',
                                    fill: 'none',
                                    stroke: 'slategray',
                                    strokeWidth: 1
                                });

                                svg.text(1150, t2, identInfo, {
                                    id: Abr,
                                    fontWeight: 'bold',
                                    fontSize: '22.5',
                                    fill: 'slategray'
                                });
                            }
                            else {
                                var f2 = pos + cr;
                                var t2 = f2 + 25;
                                cr = cr + 25;
                                $('#itempanel').attr('height', cr);
                                svg.text(1150, t2, identInfo, {
                                    id: Abr,
                                    fontWeight: 'bold',
                                    fontSize: '22.5',
                                    fill: 'slategray'
                                });
                            }
                        }
                    });
                }
        });

        $('#itempanel').attr('height',cr + 55);

    }

    function BUILDSVGLIST(Abr,r){
        svg.text(p1, parseInt(p2) + r, ' - ' + Abr, {
            fill: 'black',
            stroke: 'black',
            'stroke-width': '0.5',
            lengthAdjust: 'spacingAndGlyphs',
            class: 'infobox'
        });
        return;
    }

    function left_line(pid, mid, mode) {
        var t1x, t1y, t2, t3, l1, l2;

        var tid = $('#' + pid).attr('id');
        var points = $('#P_' + pid).attr('points');
        if (typeof points != 'undefined') {
            points = points.split(' ')[2].split(',');
            t2 = points[0];
            t3 = points[1];
        }

        //Confirm target
        if ($('#' + mid).attr('class') == 'male') {
            t1x = parseInt($('#' + mid).attr('x'));
            t1y = parseInt($('#' + mid).attr('y'));
        }
        if ($('#' + mid).attr('class') == 'female') {
            t1x = parseInt($('#' + mid).attr('cx'));
            t1y = parseInt($('#' + mid).attr('cy'));
        }

        //Confirm parent
        if ($('#' + pid).attr('class') == 'male') {
            l1 = parseInt($('#' + pid).attr('x'));
            l2 = parseInt($('#' + pid).attr('y'));
        }
        if ($('#' + pid).attr('class') == 'female') {
            l1 = parseInt($('#' + pid).attr('cx'));
            l2 = parseInt($('#' + pid).attr('cy'));
        }

        swapline(pid, l1, l2, t1x, t1y, t2, t3, mode, 'left')
    }


    //Draws connecting polyline rect
    function connect_rect_line(a1, a2, no) {
        svg.polyline(
            [
                [parseInt(a1) + 20, parseInt(a2) + 100],
                [parseInt(a1) + 20, parseInt(a2) + 85],
                [parseInt(a1) + 80, parseInt(a2) + 85],
                [parseInt(a1) + 80, parseInt(a2) + 100]
            ],
            {fill: 'none', stroke: 'green', strokeWidth: 3});
    }

    //Draws connecting polyline circle
    function connect_circle_line(a1, a2, no) {
        svg.polyline(
            [
                [parseInt(a1), parseInt(a2) + 100],
                [parseInt(a1), parseInt(a2) + 65],
                [parseInt(a1) + 60, parseInt(a2) + 65],
                [parseInt(a1) + 60, parseInt(a2) + 100]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    //Draws ending polyline to the left side of the diagram
    function left_end_line(p1, p2, c, pw) {
        var col = parseInt(c - p1);
        svg.polyline(
            [
                [parseInt(p1) + pw / 2, parseInt(p2)],
                [parseInt(p1) + pw / 2, parseInt(p2) - 20],
                [parseInt(p1) + col, parseInt(p2) - 20],
                [parseInt(p1) + col, parseInt(p2) + 20]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    //Draws ending polyline to the right side of the diagram
    function right_end_line(p1, p2, c, pw) {
        var col = parseInt(p1 - c);

        svg.polyline(
            [
                [parseInt(p1) + pw / 2, parseInt(p2)],
                [parseInt(p1) + pw / 2, parseInt(p2) - 20],
                [parseInt(p1) - col, parseInt(p2) - 20],
                [parseInt(p1) - col, parseInt(p2) + 20]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 3});
    }


    function polyline(p1, p2) {
        svg.polyline(
            [
                [parseInt(p1) + 105, parseInt(p2) + 110],
                [parseInt(p1) + 105, parseInt(p2) + 90],
                [parseInt(p1) + 170, parseInt(p2) + 90],
                [parseInt(p1) + 170, parseInt(p2) + 110]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    //Build active statuses for deceosed
    function circlestatus(id) {
        var p1 = $('#' + id).attr('cx');
        var p2 = $('#' + id).attr('cy');
        svg.polyline([[parseInt(p1) - 17, parseInt(p2) + 12], [parseInt(p1) + 18, parseInt(p2) - 15]],
            {fill: 'none', stroke: 'red', strokeWidth: 3});
        return false;
    }

    function rectstatus(id) {
        var p1 = $('#' + id).attr('x');
        var p2 = $('#' + id).attr('y');
        svg.polyline([[parseInt(p1 - 0), parseInt(p2) + 40], [parseInt(p1) + 40, parseInt(p2) - 0]],
            {fill: 'none', stroke: 'red', strokeWidth: 3});
        return false;
    }

    //Collect the daughters
    function daughters(no, d1, d2, pid, mid) {
        //Prevent too many hooks
        $.each(daughter1, function (key, value) {
            //Prevent too many hooks
            if ((parseInt(no)) < key) connect_circle_line(d1, d2, no);

            var temp = "";
            var e = "";

            for (var item in value) {
                e = value[0];
                if (e == mid) {

                    a1 = parseInt(d1) + (parseInt(no) * 60);
                    svg.circle(d1, parseInt(d2) + 125, cr, {
                        id: mid,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                    return;
                }
            }
            ;
        });
    }

    //Parse Maternals Load
    function CHILDREN_MAIN_LOAD() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var DATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("MaternalHalfSiblingsArray ARRAY Information:" + JSON.stringify(MaternalHalfSiblingsArray, null, 2) );
        if(ChildrenArray.length==0)return;
        for (t = 0; t < ChildrenArray.length; t++) {
            var midgen = ChildrenArray[t][0];
            var mid = ChildrenArray[t][1];
            var id = ChildrenArray[t][2];
            var pid = ChildrenArray[t][3];

            //Do candidate have children
            var cnr = COUNT_KIDS(GrandChildrenArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            DATA.push({"id": id, "value": [midgen, mid, 'me'], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        DATA = DATA.sort(SortByNr);
        CHILDREN_LOAD(DATA);
    }


    //Collect the children
    function CHILDREN_LOAD(ARRAY) {
        var MIDGEN = $('#me').attr("class");
        var xl = new Array();
        var P1 = new Array();

        var TOTALKIDS = COUNT_FAMILY_KIDS(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS(ChildrenArray);

        //alert ("CHILDER ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, masterx + 65, mastery + 25, masterx + 65, mastery + 130, {
            id: 'childs',
            stroke: 'black',
            strokeWidth: 3
        });
        else svg.line(LINEGROUP, masterx + 45, mastery + 20, masterx + 45, mastery + 130, {id: 'childs', stroke: 'black', strokeWidth: 3});

        //alert ("CHILDER ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        if (ARRAY.length > 0) {
            for (var p in ARRAY) {
                var DATAKEY = ARRAY[p].id;
                var CNR = ARRAY[p].cnr;
                var MIDGEN = ARRAY[p].value[0];
                var MID = ARRAY[p].value[1];
                var PID = ARRAY[p].value[2];
                var PIDGEN = $('#' + PID).attr('class').toUpperCase();
                var p1temp = new Array();

                if (p == 0) {
                    var DATAKEY = ARRAY[p].id;
                    var ps = CHILD_START_LINE(PIDGEN,PID);
                    var p1 = ps[0];
                    //SINGLE_RIGHT_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, Level3M, p1);
                    p1temp.push(MIDGEN, MID, p1, PID, CNR);
                    P1.push(p1temp);
                    //single_straight_parent_child_connection(MIDGEN,Level3M,p1,'tess')
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1+25, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1+45, Level4F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else{
                    var DATAKEY = ARRAY[p].id;
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    var PREVIOUSP1 = P1[P1.length - 1][2];
                    var PREVIOUSCNR = P1[P1.length - 1][4];
                    if(TOTALMYKIDS==0){TOTALMYKIDS=1;}
                    if(TOTALKIDS==0){TOTALKIDS=1;}

                    if(PREVIOUSCNR==0) {
                        if(MIDGEN=='MALE') {
                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 80;
                            else  var p1 = parseInt(PREVIOUSP1) + 100;
                        }
                        else{
                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 80;
                            else  var p1 = parseInt(PREVIOUSP1) + 120;
                        }
                    }
                    //else var p1 = parseInt(TARGET) + (parseInt(PREVIOUSCNR) * 40);
                    else{
                        //p1 = HAS_RIGHT_SPOUCE(PREVIOUSID,PREVIOUSGEN);
                        if(PREVIOUSCNR==1) {

                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 20 + (parseInt(PREVIOUSCNR) * 140);
                            else  var p1 = parseInt(PREVIOUSP1) + 20  + (parseInt(PREVIOUSCNR) * 160);

                            //var p1 = parseInt(PREVIOUSP1) + (parseInt(PREVIOUSCNR) * 180)
                        }
                        else if(PREVIOUSCNR>1) {

                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 20 + (parseInt(PREVIOUSCNR) * 80);
                            else  var p1 = parseInt(PREVIOUSP1) + 20  + (parseInt(PREVIOUSCNR) * 100);

                            //if(TOTALKIDS==0){var p1 = parseInt(PREVIOUSP1) + (parseInt(TOTALMYKIDS) * 30)}
                            //else {
                            //    var p1 = parseInt(PREVIOUSP1) + (parseInt(PREVIOUSCNR) * 80)
                            //}
                        }
                        //else if(TOTALKIDS>1) var p1 = parseInt(PREVIOUSP1) + (parseInt(TOTALKIDS) * 30);
                        //else var p1 = parseInt(TARGET) + (parseInt(TOTALKIDS) * 150)
                    }





                    p1temp.push(MIDGEN, MID, p1, PID, CNR);
                    P1.push(p1temp);

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }

                }

            }
        }
//Load my spouce
        LOAD_SPOUCE_MATERNAL('me', $('#me').attr("class"))
        OBJECTS_CONNECT(ChildrenArray, 'ctest');
        }


    //Load paternal cousins
    function GRANDCHILDREN_MAIN_LOAD() {

        var lx = 0;
        var ly = 0;
        var pid, mid, G, midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var DATAARRAY = new Array();

        GrandChildrenArray = GrandChildrenArray.sort(SortById);
        var nr = 0;
        var id = "";
        for (t = 0; t < GrandChildrenArray.length; t++) {
            var parentid = GrandChildrenArray[t][2];
            var ckey = GrandChildrenArray[t][3];
            var key = $('#' + parentid).attr('datakey');
            if (id != key)nr = 0;
            var id = key;
            var midgen = GrandChildrenArray[t][0];
            var mid = GrandChildrenArray[t][1];
            var pid = GrandChildrenArray[t][2];
            var side = $('#' + pid).attr('datakey').substring(0, 1);
                DATAARRAY.push({"id": id, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
        }
        GRANDCHILDREN_LOAD(DATAARRAY);
    }

    function GRANDCHILDREN_LOAD(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("GRANDCHILDREN_LOAD ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level5F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
            }
            /*** The Next Parent is Loaded ***/
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;
                var PREVMID = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var TARGET = P1[P1.length - 1][2];
                //Begin new elemnt
                if (LINE == 0) {
                    ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level5F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level5F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];


                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level5F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }


        CONNECTOR(ARRAY,'TEST');


    }


    //Collect the grandchildren
    function GRANDCHILDREN_LOADXX(d1, d2, pid) {
        var MIDGEN = $('#me').attr("class");
        ////Load my spouce
        //LOAD_SPOUCE_MATERNAL('me', $('#me').attr("class"))

        //alert ("GrandChildrenArray ARRAY Information:" + JSON.stringify(GrandChildrenArray, null, 2) );


        if(GrandChildrenArray.length==0) return;
        //Prevent too many hooks
        if (GrandChildrenArray.length > 1) {

            $.each(GrandChildrenArray, function (key, value) {
                var temp = "";
                var id = "";
                //for (var item in value) {
                var MIDGEN = value[0];
                var MID = value[1];
                var PID = value[2];
                if (MID == "" || MID == null) MID = 'gchl_' + key;
                //Load my spouce
                LOAD_SPOUCE_MATERNAL(PID, $('#'+PID).attr("class"));
                var ps = SPOTLINE(PID);
                var p1 = ps[0];


                if(key==0){
                    if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, p1 + 45, Level4M + 20, p1 + 45, Level4M + 120, {
                        id: 'gchilds',
                        stroke: 'black',strokeWidth: 3
                    });
                    else svg.line(LINEGROUP, p1 + 45, Level4F + 0, p1 + 45, Level4F + 120, {
                        id: 'gchilds',
                        stroke: 'black',strokeWidth: 3
                    });
                }
                ////else{
                //    alert(key)
                ////}


                if (key == 0) p1 = parseInt(p1);
                else p1 = parseInt(p1) - 20 - (parseInt(key) * 60);

                if (MIDGEN == 'FEMALE') {svg.circle(p1 + 50, Level5F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            });
        }
        else {
            $.each(GrandChildrenArray, function (key, value) {
                var temp = "";
                var id = "";
                //for (var item in value) {
                var MIDGEN = value[0];
                var MID = value[1];
                var PID = value[2];
                var PIDGEN = $('#'+PID).attr("class");
                if (MID == "" || MID == null) MID = 'gchl_' + key;
                //Load my spouce
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);



                var ps = SPOTLINE(PID);
                var p1 = ps[0];

                if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, p1 + 45, Level4M + 20, p1 + 45, Level4M + 120, {
                    id: 'gchilds',
                    stroke: 'black',strokeWidth: 3
                });
                else svg.line(LINEGROUP, p1 + 45, Level4F + 25, p1 + 45, Level4F + 120, {id: 'gchilds', stroke: 'black',strokeWidth: 3});
                //single_straight_parent_child_connection(MIDGEN,Level5M,p1,'grchild')

                //if(MIDGEN=='MALE') sigle_strait_parent_child_connection(PIDGEN,Level5M,p1,'gchild');
                //else sigle_strait_parent_child_connection(PIDGEN,Level5F,p1,'gchild');

                if (MIDGEN == 'FEMALE') {svg.circle(p1 + 45, Level5F - 20, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M - 20, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            });

        }


        OBJECTS_CONNECT(GrandChildrenArray, 'grands');
    }


    function single_straight_parent_child_connection(GEN,LEVEL,P1,TEMPLATE){
        if (GEN.toUpperCase() == "MALE")svg.line(LINEGROUP, parseInt(P1) + 45, parseInt(LEVEL) + 0, P1 + 45, parseInt(LEVEL) + 130, {
            id: TEMPLATE,
            stroke: 'black'
        });
        else svg.line(LINEGROUP, parseInt(P1) + 45, parseInt(LEVEL) + 20, parseInt(P1) + 45, parseInt(LEVEL) + 130, {id: TEMPLATE, stroke: 'black'});

    }


    //Collect the children
    //function CHILDREN_LOADAA(d1, d2, pid) {
    //    var PID = 'me';
    //    var PIDGEN = $('#me').attr("class");
    //    //Load my spouce
    //    LOAD_SPOUCE_MATERNAL('me', $('#me').attr("class"))
    //
    //    if (PIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, masterx + 65, mastery + 25, masterx + 65, mastery + 130, {
    //        id: 'childs',
    //        stroke: 'black'
    //    });
    //    else svg.line(LINEGROUP, masterx + 45, mastery + 20, masterx + 45, mastery + 130, {id: 'childs', stroke: 'black'});
    //
    //    //Prevent too many hooks
    //    if (ChildrenArray.length > 1) {
    //
    //        $.each(ChildrenArray, function (key, value) {
    //            var temp = "";
    //            var id = "";
    //            //for (var item in value) {
    //            var MIDGEN = value[0];
    //            var MID = value[1];
    //            if (MID == "" || MID == null) MID = 'chl_' + key;
    //            if (key == 0) p1 = parseInt(masterx);
    //            else p1 = parseInt(masterx) + 20 + (parseInt(key) * 60);
    //
    //            single_right_parent_child_connector(PID,MID,MIDGEN,PIDGEN,Level4F);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(p1 + 50, Level4F, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level4M, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
    //        });
    //
    //    }
    //    else {
    //        $.each(ChildrenArray, function (key, value) {
    //            var temp = "";
    //            var id = "";
    //            //for (var item in value) {
    //            var MIDGEN = value[0];
    //            var MID = value[1];
    //            if (MID == "" || MID == null) MID = 'chl_' + key;
    //            if (key == 0) p1 = parseInt(masterx) + 20;
    //
    //            var ps = SPOTLINE(PID);
    //
    //            single_right_parent_child_connector(PID,MID,MIDGEN,PIDGEN,Level4F);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(ps[0] + 65, Level4F - 20, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(ps[0] + 20, Level4M - 20, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
    //        });
    //
    //
    //
    //    }
    //
    //    OBJECTS_CONNECT(ChildrenArray, 'ctest');
    //
    //}

    //Collect the nieces
    function nieces(no, a1, a2, pid, mid) {
        //Prevent too many hooks
        $.each(niecearray, function (key, value) {

            //Prevent too many hooks
            if ((parseInt(no)) < key) connect_circle_line(a1, a2, no);

            var temp = "";
            var e = "";

            for (var item in value) {
                e = value[0];

                if (e == mid) {
                    a1 = parseInt(a1) + (parseInt(no) * 50);

                    svg.circle(a1, a2 + 100, cr, {
                        id: mid,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                    return;
                }};
        });
    }

    //Parse Paternals Load
    function PATERNALS_MAIN_LOAD() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("MaternalHalfSiblingsArray ARRAY Information:" + JSON.stringify(MaternalHalfSiblingsArray, null, 2) );
        if(PaternalRelatives.length==0)return;

        //Side character values
        var sidgen = FatherArray[0].gender;
        var sid = FatherArray[0].id;
        for (t = 0; t < PaternalRelatives.length; t++) {
            var midgen = PaternalRelatives[t][0];
            var mid = PaternalRelatives[t][1];
            var id = PaternalRelatives[t][2];
            var pid = PaternalRelatives[t][3];
            //var pid;

            //alert (pid + " PaternalRelatives ARRAY Information:" + JSON.stringify(PaternalRelatives, null, 2) );


            //for (var d in GrantParentalArray){
            //    if(GrantParentalArray[d].key == cid) var pid = GrantParentalArray[d].id;
            //}
            //Do candidate have children
            var cnr = COUNT_KIDS(PaternalCousinArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            PATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr, "sid": [sidgen,sid]});
            pnr = pnr + 1;
        }
        //SORT
        PATERNALDATA = PATERNALDATA.sort(SortByNr);

        PATERNALS_LOAD(PATERNALDATA);
    }

    //Load paternal aunt / uncle
    function PATERNALS_LOAD(ARRAY) {
        var lx = 0;
        var ly = 0;
        var g, gen, PERVMID;
        var p1, p2;
        var pid, mid;
        var xl = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        var BROTHERS = COUNT_FAMILY_KIDS(BrothersArray);
        var NEPHEWS = COUNT_FAMILY_KIDS(NephewArray);
        var PATERNALHALFS = COUNT_FAMILY_KIDS(PaternalHalfSiblingsArray);

        //alert ("PATERNALS_LOAD ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );
        //alert ("PaternalCousinArray ARRAY Information:" + JSON.stringify(PaternalCousinArray, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var SIDGEN = ARRAY[p].sid[0];
            var SID = ARRAY[p].sid[1];
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = START_PAT_GENLINE(PIDGEN, PID, MIDGEN);
                p1 = parseInt(ps[0]) - ((parseInt(BROTHERS)*50) + (parseInt(NEPHEWS)*30) + (parseInt(PATERNALHALFS)*40));
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);

                SINGLE_SIDE_START_CORNER_CONNECTOR(SID,MID,MIDGEN,SIDGEN,Level2M, p1);

                //single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level2M);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;
                //var PREVMID = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var PREVIOUSP1 = P1[P1.length - 1][2];


                if (LINE == 0) {
                    var KIDS = COUNT_MY_KIDS(PaternalCousinArray, PREVIOUSID);

                    p1 = parseInt(PREVIOUSP1) - (100 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }
                else {
                    var KIDS = COUNT_MY_KIDS(PaternalCousinArray, PREVIOUSID);
                    p1 = parseInt(PREVIOUSP1) - (100 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }

                SINGLE_SIDE_CORNER_CONNECTOR(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);



                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = PAT_GENLINE(PREVIOUSGEN, PREVIOUSID);
                var p1 = ps[0];
                SINGLE_SIDE_CORNER_CONNECTOR(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, mastery, rr, rr, 1, 1, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }

        CONNECTOR(ARRAY,'PATERNALS');

    }



    //Load paternal aunt / uncle
    function PATERNALS_LOAD_XX(ARRAY) {
        var lx = 0;
        var ly = 0;
        var g, gen, PERVMID;
        var p1, p2;
        var pid, mid;
        var xl = new Array();

        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("PATERNALS_LOAD ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        $.each(PaternalRelatives, function (key, value) {
            MIDGEN = value[0];
            MID = value[1];
            pid = value[3];
            var xy;
            var datakey = value[2];
            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */

            if (BrothersArray.length > 1 || PaternalHalfSiblingsArray.length > 0) {

                if(PaternalHalfSiblingsArray.length>0){
                    var d = PaternalHalfSiblingsArray[PaternalHalfSiblingsArray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                    else lx = parseInt($('#' + d[1]).attr('cx'));
                }
                else {
                    var d = BrothersArray[BrothersArray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                    else lx = parseInt($('#' + d[1]).attr('cx'));
                }

                //lx = parseInt($('#' + d[1]).attr('x'));
                //else lx = parseInt($('#' + d[1]).attr('cx'));
            }
            else {
                lx = 60
            }


            if (PaternalRelatives.length > 1) {
                if (key == 0) {
                    //Get father location
                    var check = IS_IN_ARRAY(PaternalCousinArray, MID);
                    var PARENTID = FatherArray[0].id;
                    var PARENTGEN = FatherArray[0].gender;


                    var ps = PAT_GENLINE(PARENTGEN, PARENTID);
                    p1 = ps[0];
                    p2 = ps[1];

                    if (i % 2 == 0) {
                        xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                    }
                    else if (i % 2 != 0) {
                        xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                    }

                    //Get brother location
                    if(PaternalHalfSiblingsArray.length>0){
                        p1 = parseInt(lx) - 80;
                        if (check != -1) {
                            p1 = parseInt(p1) - 80;
                        }
                    }
                    else if (BrothersArray.length > 1) {
                        p1 = parseInt(lx) - 80;
                        if (check != -1) {
                            p1 = parseInt(p1) - 80;
                        }
                    }
                    else{
                        p1 = parseInt(p1) - 80;
                        if (check != -1) {
                            p1 = parseInt(p1) - 80;
                        }
                    }


                    //else p1 = parseInt(p1) - 40;
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (PaternalRelatives.length - 1)) {
                    var PERVMID = PaternalRelatives[key - 1][1];
                    var PERVGEN = PaternalRelatives[key - 1][0];
                    var check = IS_IN_ARRAY(PaternalCousinArray, PERVMID);
                    var ps = LAST_LEFT_PATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(PaternalCousinArray, PERVMID);
                        if (c <= 4){p1 = parseInt(p1) - 140;}
                        else if (c > 4 && c < 6){p1 = parseInt(p1) - 200;}
                        else{p1 = parseInt(p1) - 260;}
                    }
                    else {
                        p1 = parseInt(p1) - 60;
                    }
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (PaternalRelatives.length - 1))) {
                    PERVMID = PaternalRelatives[key - 1][1];
                    var PERVMID = PaternalRelatives[key - 1][1];
                    var PERVGEN = PaternalRelatives[key - 1][0];
                    var check = IS_IN_ARRAY(PaternalCousinArray, PERVMID);
                    var ps = LEFT_PATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(PaternalCousinArray, PERVMID);
                        if (c <= 4){p1 = parseInt(p1) - 140;}
                        else if (c > 4 && c < 6){p1 = parseInt(p1) - 200;}
                        else{p1 = parseInt(p1) - 260;}
                    }
                    else {
                        p1 = parseInt(p1) - 80;
                    }

                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }
            else {
                var PARENTID = FatherArray[0].id;
                var PARENTGEN = FatherArray[0].gender;
                var ps = START_PAT_GENLINE(PARENTGEN, PARENTID);
                var check = IS_IN_ARRAY(PaternalCousinArray, MID);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                else if (i % 2 != 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                if (check != -1) {
                    p1 = parseInt(p1) - 80;
                }

                //Get brother location
                if(PaternalHalfSiblingsArray.length>0){
                    p1 = parseInt(lx) - 80;
                    if (check != -1) {
                        p1 = parseInt(p1) - 80;
                    }
                }
                else if (BrothersArray.length > 1) {
                    p1 = parseInt(lx) - 80;
                    if (check != -1) {
                        p1 = parseInt(p1) - 80;
                    }
                }
                else{
                    p1 = parseInt(p1) - 80;
                    if (check != -1) {
                        p1 = parseInt(p1) - 80;
                    }
                }


                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'})}
            }
        });

        PAT_PARENT_CHILD_POLYLINES(PaternalRelatives, FatherArray);
    }


    //Parse Maternals Load
    function MATERNALS_MAIN_LOAD() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var MATERNALDATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("MaternalHalfSiblingsArray ARRAY Information:" + JSON.stringify(MaternalHalfSiblingsArray, null, 2) );
        if(MaternalRelatives.length==0)return;
        for (t = 0; t < MaternalRelatives.length; t++) {
            var midgen = MaternalRelatives[t][0];
            var mid = MaternalRelatives[t][1];
            var id = MaternalRelatives[t][2];
            var pid = MaternalRelatives[t][3];

            //Do candidate have children
            var cnr = COUNT_KIDS(MaternalCousinArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            MATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr);

        //alert ("MATERNALDATA ARRAY Information:" + JSON.stringify(MATERNALDATA, null, 2) );

        MATERNALS_LOAD(MATERNALDATA);
    }


//Load paternal aunt / uncle
//    function MATERNALS_LOAD_NEW(ARRAY) {
//        var lx = 0;
//        var ly = 0;
//        var g, MID, gen, MIDGEN, PERVMID;
//        var p1, p2, lx;
//        var pid, mid;
//        var xl = new Array();
//
//        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
//        var P1 = new Array();
//        var idarray = new Array();
//        var DATAKEY = null;
//        var objectsarray = new Array();
//
//        //alert ("MATERNALS_LOAD ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );
//
//        for (var p in ARRAY) {
//            var idarray = new Array();
//            var MIDGEN = ARRAY[p].value[0];
//            var PID = ARRAY[p].value[2];
//            var MID = ARRAY[p].value[1];
//            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
//            var p1temp = new Array();
//
//            if (p == 0) {
//                DATAKEY = ARRAY[p].id;
//                var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
//                p1 = ps[0];
//                //Get previous object coordninates
//                p1temp.push(MIDGEN, MID, p1, PID);
//                P1.push(p1temp);
//                //Connect to parent
//                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
//                if (MIDGEN == 'MALE') {
//                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
//                        id: MID,
//                        fill: gencolor,
//                        stroke: 'red',
//                        strokeWidth: 2,
//                        class: 'male',
//                        cursor: 'pointer'
//                    });
//                }
//                else if (MIDGEN == 'FEMALE') {
//                    svg.circle(p1, Level5F, cr, {
//                        id: MID,
//                        fill: gencolor,
//                        stroke: 'red',
//                        strokeWidth: 2,
//                        class: 'female',
//                        cursor: 'pointer'
//                    });
//                }
//                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
//            }
//            /*** The Next Parent is Loaded ***/
//            else if (DATAKEY != ARRAY[p].id) {
//                var ps;
//                var LINE = ARRAY[p].nr;
//                DATAKEY = ARRAY[p].id;
//                var PREVMID = ARRAY[p].id;
//                var PREVIOUSGEN = P1[P1.length - 1][0];
//                var PREVIOUSID = P1[P1.length - 1][1];
//                var TARGET = P1[P1.length - 1][2];
//                //Begin new elemnt
//                if (LINE == 0) {
//                    ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
//                    p1 = ps[0];
//                    p1temp.push(MIDGEN, MID, p1, PID);
//                    P1.push(p1temp);
//                    //Connect to parent
//                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
//                    if (MIDGEN == 'MALE') {
//                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
//                            id: MID,
//                            fill: gencolor,
//                            stroke: 'red',
//                            strokeWidth: 2,
//                            class: 'male',
//                            cursor: 'pointer'
//                        });
//                    }
//                    else if (MIDGEN == 'FEMALE') {
//                        svg.circle(p1, Level5F, cr, {
//                            id: MID,
//                            fill: gencolor,
//                            stroke: 'red',
//                            strokeWidth: 2,
//                            class: 'female',
//                            cursor: 'pointer'
//                        });
//                    }
//                }
//                else {
//                    ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
//                    p1 = ps[0];
//                    p1temp.push(MIDGEN, MID, p1, PID);
//                    P1.push(p1temp);
//                    //Connect to parent
//                    right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
//                    if (MIDGEN == 'MALE') {
//                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
//                            id: MID,
//                            fill: gencolor,
//                            stroke: 'red',
//                            strokeWidth: 2,
//                            class: 'male',
//                            cursor: 'pointer'
//                        });
//                    }
//                    else if (MIDGEN == 'FEMALE') {
//                        svg.circle(p1, Level5F, cr, {
//                            id: MID,
//                            fill: gencolor,
//                            stroke: 'red',
//                            strokeWidth: 2,
//                            class: 'female',
//                            cursor: 'pointer'
//                        });
//                    }
//                }
//
//                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
//
//            }
//            else {
//                DATAKEY = ARRAY[p].id;
//                var PREVIOUSGEN = P1[P1.length - 1][0];
//                var PREVIOUSID = P1[P1.length - 1][1];
//                var ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
//                p1 = ps[0];
//
//
//                p1temp.push(MIDGEN, MID, p1, PID);
//                P1.push(p1temp);
//
//                if (MIDGEN == 'MALE') {
//                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
//                        id: MID,
//                        fill: gencolor,
//                        stroke: 'red',
//                        strokeWidth: 2,
//                        class: 'male',
//                        cursor: 'pointer'
//                    });
//                }
//                else if (MIDGEN == 'FEMALE') {
//                    svg.circle(p1, Level5F, cr, {
//                        id: MID,
//                        fill: gencolor,
//                        stroke: 'red',
//                        strokeWidth: 2,
//                        class: 'female',
//                        cursor: 'pointer'
//                    });
//                }
//            }
//        }
//
//
//        CONNECTOR(ARRAY,'TEST');
//
//
//        //Load the polylines
//        //MAT_PARENT_CHILD_POLYLINES(MaternalRelatives, MotherArray);
//
//    }



    //Load paternal aunt / uncle
    function MATERNALS_LOAD(ARRAY) {
        var lx = 0;
        var ly = 0;
        var g, MID, gen, MIDGEN, PERVMID;
        var p1, p2, lx;
        var pid, mid;
        var xl = new Array();

        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("MATERNALS_LOAD ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        $.each(MaternalRelatives, function (key, value) {
            MIDGEN = value[0];
            MID = value[1];
            pid = value[3];
            var xy;
            var datakey = value[2];

            //alert("MATERNALS---->"+MID + " -<-MID --pid-->  " + pid + "**MIDGEN " + MIDGEN + " datakey -->"+datakey )

            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */
            if (SistersArray.length > 1  || MaternalHalfSiblingsArray.length > 0) {
                if (MaternalHalfSiblingsArray.length > 0) {
                    var d = MaternalHalfSiblingsArray[MaternalHalfSiblingsArray.length - 1];
                }
                else {
                    var d = SistersArray[SistersArray.length - 1];
                }
                if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x')) + 60;
                else lx = parseInt($('#' + d[1]).attr('cx'));
            }
            else {
                lx = 60
            }

            if (MaternalRelatives.length > 1) {
                if (key == 0) {
                    var check = IS_IN_ARRAY(MaternalCousinArray, MID);
                    //Get mother location
                    var PARENTID = MotherArray[0].id;
                    var PARENTGEN = MotherArray[0].gender;
                    var ps = MAT_GENLINE(PARENTGEN, PARENTID);
                    p1 = ps[0];
                    p2 = ps[1];
                    if (i % 2 == 0) {
                        xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                    }
                    else if (i % 2 != 0) {
                        xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                    }
                    //Get sisters location
                    if (SistersArray.length > 1) {
                        p1 = parseInt(lx) + 20;
                    }
                    if (check != -1) {
                        p1 = parseInt(p1) + 80
                    }
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (MaternalRelatives.length - 1)) {
                    var PERVMID = MaternalRelatives[key - 1][1];
                    var PERVGEN = MaternalRelatives[key - 1][0];
                    var check = IS_IN_ARRAY(MaternalCousinArray, PERVMID);
                    var ps = LAST_RIGHT_MATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(MaternalCousinArray, PERVMID);
                        if (c <= 4){p1 = parseInt(p1) + 140;}
                        else if (c > 4 && c < 6){p1 = parseInt(p1) + 200;}
                        else{p1 = parseInt(p1) + 260;}
                    }
                    else {
                        p1 = parseInt(p1) + 80;
                    }

                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (MaternalRelatives.length - 1))) {
                    var PERVMID = MaternalRelatives[key - 1][1];
                    var PERVGEN = MaternalRelatives[key - 1][0];
                    var check = IS_IN_ARRAY(MaternalCousinArray, PERVMID);
                    var ps = RIGHT_MATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];
                    p2 = ps[1];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(PaternalCousinArray, PERVMID);
                        if (c <= 4){p1 = parseInt(p1) + 140;}
                        else if (c > 4 && c < 6){p1 = parseInt(p1) + 200;}
                        else{p1 = parseInt(p1) + 260;}
                    }
                    else {
                        p1 = parseInt(p1) + 80;
                    }

                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }

            else {
                var PARENTID = MotherArray[0].id;
                var PARENTGEN = MotherArray[0].gender;
                var ps = MAT_GENLINE(PARENTGEN, PARENTID);
                var check = IS_IN_ARRAY(MaternalCousinArray, MID);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                else if (i % 2 != 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                if (check != -1) {
                    p1 = parseInt(p1) + 140
                }
                //p1 = p1 + parseInt(lx);

                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

            }
        });

        //Load the polylines
        MAT_PARENT_CHILD_POLYLINES(MaternalRelatives, MotherArray);

    }

    function MAT_PARENT_CHILD_POLYLINES(ARRAY1, ARRAY2) {
        var PARENTGEN = ARRAY2[0].gender;
        var PARENTID = ARRAY2[0].id;
        var xl = new Array();
        //Draw connecting polyline
        for (i = 0; i < ARRAY1.length; i++) {
            var value = ARRAY1[i];
            mid = value[1];
            var ps = GENLINE(value[0], value[1]);
            p1 = ps[0];
            p2 = ps[1];
            if (i % 2 == 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }

        }
        var temp = GENLINE(PARENTGEN, PARENTID);
        xl.push([temp[0], temp[1] - 20], [temp[0], temp[1]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 3});

    }

    function PAT_PARENT_CHILD_POLYLINES(ARRAY1, ARRAY2) {
        var PARENTGEN = ARRAY2[0].gender;
        var PARENTID = ARRAY2[0].id;
        var xl = new Array();
        //Draw connecting polyline
        for (i = 0; i < ARRAY1.length; i++) {
            var value = ARRAY1[i];
            mid = value[1];
            var ps = GENLINE(value[0], value[1]);
            p1 = ps[0];
            p2 = ps[1];
            if (i % 2 == 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }

        }
        var temp = GENLINE(PARENTGEN, PARENTID);
        xl.push([temp[0], temp[1] - 20], [temp[0], temp[1]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 3});

    }
    /*
     * These functions load the x and y values for lines on objects
     */
    function LEFTGEN(PIDGEN, ID, MIDGEN) {
        var p1, p2;
        if (PIDGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) - 40;
            p2 = parseInt($('#' + ID).attr('y')) + 20;
            if (MIDGEN == "FEMALE") {
                p1 = p1 - 10
            }
            else {
                p1 = p1 - 20
            }
        }
        else if (PIDGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) - 40;
            p2 = parseInt($('#' + ID).attr('cy'));
            if (MIDGEN == "MALE") {
                p1 = parseInt(p1) - 45
            }
            else {
                p1 = p1 - 15
            }
        }
        return [p1, p2]
    }

    function RIGHTGEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;

        if (PREIOUSGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) + 40;
            p2 = parseInt($('#' + ID).attr('y')) + 20;
            if (MIDGEN == "FEMALE") {
                p1 = p1 + 20
            }
            else {
                p1 = p1 + 20
            }
        }
        else if (PREIOUSGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) + 60;
            p2 = parseInt($('#' + ID).attr('cy'));
        }
        return [p1, p2]
    }

    function RIGHT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN) {
        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 45;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 100;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 80;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_NEPHEWS_START_GEN(PARENTGEN, PARENTID, MIDGEN, GRANDGROUPS) {

        var p1, p2, gp1=0;
        /** Calculate the possible grandkids **/
        //if(GRANDGROUPS > 0){gp1 = parseInt(GRANDGROUPS) * 100}
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 40;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 25;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 60;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [parseInt(p1)+gp1, p2]
    }

    function LEFT_NEPHEWS_START_GEN(PARENTGEN, PARENTID, MIDGEN) {
        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 50;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 40;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 30;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_NEPHEWS_GEN(PREVIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 80;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 85;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 65;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }


        return [p1, p2]
    }

    /** COUNT THE NUMBER OF GROUPS(PARENTS) IN ARRAY **/
    function COUNT_GROUPS(ARRAY){

        //alert ("CHILDER ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );
        var count = 0;
        var pid = "";
        for (var p in ARRAY) {
            if(p==0){
                count = count + 1;
                pid = ARRAY[p][2];
            }
            else{
                if(pid != ARRAY[p][2]) {
                    count = count + 1;
                    pid = ARRAY[p][2];
                }

            }
        }
        return count;
    }


    /** COUNT THE NUMBER OF GROUPS(NON-PARENTS) IN ARRAY **/
    function COUNT_SINGLE_GROUPS(ARRAY){
        var count = 0;
        var mid = "";
        for (var p in ARRAY) {
            if(p==0){
                mid = ARRAY[p][1];
                if(!$('#SP_'+mid)){count = count + 1;}
            }
            else{
                if(mid != ARRAY[p][1]) {
                    mid = ARRAY[p][1];
                    var cla = $('#SP_'+mid).attr('class');
                    if(typeof cla == 'undefined'){count = count + 1;}
                }
            }
        }
        return count;
    }

    /** GET SPOUCE LOCATION **/
    function HAS_RIGHT_SPOUCE(PREVIOUSID,PREVIOUSGEN){
        var p1 = 0;
        var SPI = $('#SP_'+PREVIOUSID).attr('class');

        if(typeof SPI != 'undefined') {

            var SPGEN = $('#SP_'+PREVIOUSID).attr('class').toUpperCase();
            if (SPGEN == 'MALE') {
                p1 = parseInt($('#' + SPID).attr('x')) + 100;
            }
            else if (SPGEN == 'FEMALE') {
                p1 = parseInt($('#' + SPID).attr('cx')) + 100;
            }
        }
        else{
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx'));
            }
        }

        return p1;
    }

    /** GET SPOUCE LOCATION **/
    function HAS_LEFT_SPOUCE(PREVIOUSID,PREVIOUSGEN){
        var p1 = 0;
        var SPID = $('#SP_'+PREVIOUSID).attr('class');
        if(typeof SPID != 'undefined') {

            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + SPID).attr('x'));
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + SPID).attr('cx'));
            }
        }
        else{
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx'));
            }
        }

        return p1;
    }

    function RIGHT_MATERALS_GEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 40;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 40;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LAST_RIGHT_MATERALS_GEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 40;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 40;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_PATERALS_GEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 80;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 120;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LAST_LEFT_PATERALS_GEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 60;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 80;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 100;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 60;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 40;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 80;
                p2 = parseInt($('#' + PREVIOUSID).attr('y'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 60;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_START_PARENT_COUSINS_GEN(PARENTGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 25;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 25;
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 45;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_START_COUSINS_GEN(PARENTGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 45;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 25;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 60;
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 45;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) - 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) - 85;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) - 45;
                p2 = parseInt($('#' + PREVIOUSID).attr('y'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) - 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_START_HALF_SIBLINGS_GEN(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 65;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 85;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 65;
                p2 = parseInt($('#' + PARENTID).attr('y'))+ 45;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 65;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_START_HALF_SIBLINGS_GEN(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 55;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 75;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 55;
                p2 = parseInt($('#' + PARENTID).attr('y'))+ 45;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 55;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_HALF_SIBLINGS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

        //alert([PREVIOUSGEN,PREVIOUSID,MIDGEN])

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) - 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) - 85;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) - 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('y'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) - 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_HALF_SIBLINGS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

        var p1, p2;

        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 85;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 95;
                p2 = parseInt($('#' + PREVIOUSID).attr('y'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 65;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function LEFT_START_COUSINS_GEN(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 50;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 65;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 30;
                p2 = parseInt($('#' + PARENTID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function GENLINE(GEN, ID) {
        var p1, p2;
        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) + 20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy')) - 20;
        }
        return [p1, p2]
    }

    function CHILD_START_LINE(PARENTGEN, ID) {
        var p1, p2;
        if (PARENTGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) + 20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (PARENTGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy')) - 20;
        }
        return [p1, p2]
    }

    function START_PAT_GENLINE_Q(PARENTGEN, PARENTID) {
        var p1, p2;

        if (PARENTGEN == 'MALE') {
            p1 = parseInt($('#' + PARENTID).attr('x')) - 60;
            p2 = parseInt($('#' + PARENTID).attr('y'));
        }
        else if (PARENTGEN == 'FEMALE') {
            p1 = parseInt($('#' + PARENTID).attr('cx'));
            p2 = parseInt($('#' + PARENTID).attr('cy')) - 20;
        }
        return [p1, p2]
    }

    function START_PAT_GENLINE(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 35;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 65;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 30;
                p2 = parseInt($('#' + PARENTID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function PAT_GENLINE(PARENTGEN, PARENTID) {
        var p1, p2;

        if (PARENTGEN == 'MALE') {
            p1 = parseInt($('#' + PARENTID).attr('x')) + 20;
            p2 = parseInt($('#' + PARENTID).attr('y'));
        }
        else if (PARENTGEN == 'FEMALE') {
            p1 = parseInt($('#' + PARENTID).attr('cx'));
            p2 = parseInt($('#' + PARENTID).attr('cy')) - 20;
        }
        return [p1, p2]
    }



    function MAT_GENLINE(PARENTGEN, PARENTID) {
        var p1, p2;

        if (PARENTGEN == 'MALE') {
            p1 = parseInt($('#' + PARENTID).attr('x')) + 40;
            p2 = parseInt($('#' + PARENTID).attr('y'));
        }
        else if (PARENTGEN == 'FEMALE') {
            p1 = parseInt($('#' + PARENTID).attr('cx')) + 80;
            p2 = parseInt($('#' + PARENTID).attr('cy')) - 20;
        }
        return [p1, p2]
    }

    //Load brothers
    function BROTHERS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, e, gen, G, MIDGEN, MID;
        var p1, p2;
        var PID = 'me';
        var xl = new Array();
        var P1 = new Array();

        if(BrothersArray.length==0)return;

        //alert ("BrothersArray ARRAY Information:" + JSON.stringify(BrothersArray, null, 2) );

        if (BrothersArray.length > 0) {
            p2 = mastery;
            var p1temp = new Array();

            $.each(BrothersArray, function (key, value) {
                var MIDGEN = value[0];
                var MID = value[1];
                //var mid = value[1];
                var PID = 'me';
                var datakey = value[2];

                if (BrothersArray.length > 1) {

                    //Parse array and build diagram
                    if (key > 0 && (key < (BrothersArray.length - 1))) {
                        var BID = BrothersArray[key - 1][1];
                        var PREVIOUSGEN = P1[P1.length - 1][0];
                        var PREVIOUSID = P1[P1.length - 1][1];
                        var PREVIOUSP1 = P1[P1.length - 1][2];
                        var KIDS = COUNT_KIDS(NephewArray, PREVIOUSID);
                        if(KIDS==0)KIDS=1;



                        //var check = IS_IN_ARRAY(NephewArray, BID);
                        var p1 = PREVIOUSP1 - (parseInt(KIDS) * 75);

                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);

                        //p1 = parseInt($('#' + BID).attr('x')) - 80;
                        //p1 = parseInt($('#' + MID).attr('x')) - 80;
                        //if (check == 'found') p1 = parseInt(p1) - 140;
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });


                    }
                    else if (key == (BrothersArray.length - 1)) {
                        var BID = BrothersArray[key - 1][1];
                        var check = IS_IN_ARRAY(NephewArray, BID);
                        p1 = parseInt($('#' + BID).attr('x')) - 80
                        if (check != -1) p1 = parseInt(p1) - 140;
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else {
                        if ($('#' + PID).attr("class").toUpperCase() == "MALE"){
                            p1 = parseInt($('#' + PID).attr('x')) - 80
                        }
                        else{ p1 = parseInt($('#' + PID).attr('cx')) - 80}
                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);

                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }

                }
                else {
                    var PIDGEN = $('#' + PID).attr('class').toUpperCase();
                    if (PIDGEN == "MALE")p1 = parseInt($('#' + PID).attr('x')) - 80;
                    else p1 = parseInt($('#' + PID).attr('cx')) - 100;
                    svg.rect(p1, Level3M, rr, rr, 1, 1, {
                        id: MID,
                        datakey: datakey,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }


            });
        }

        //Prevent too many hooks
        for (i = 0; i < BrothersArray.length; i++) {
            var value = BrothersArray[i];
            var MID = value[1];

            //Confirm my gender
            p1 = parseInt($('#' + MID).attr('x')) + 20;
            p2 = parseInt($('#' + MID).attr('y'));

            if (value % 2 == 0) {
                xl.push([[p1, p2], [p1, p2 - 20]]);
            }
            else if (value % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
        }

        var mx = $('#mei').attr("x1");
        var my = $('#mei').attr("y1");
        xl.push([[p1, p2 - 20], [mx, mastery - 20]]);
        //Load the polyline

        svg.polyline(xl, {id: 'Tb_' + PID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }


    function PATERNAL_HALF_SIBLINGS_LOAD() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();
        var MATERNALDATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("PaternalHalfSiblingsArray ARRAY Information:" + JSON.stringify(PaternalHalfSiblingsArray, null, 2) );
        if(PaternalHalfSiblingsArray.length==0)return;
        for (t = 0; t < PaternalHalfSiblingsArray.length; t++) {
            var midgen = PaternalHalfSiblingsArray[t][0];
            var mid = PaternalHalfSiblingsArray[t][1];
            var id = PaternalHalfSiblingsArray[t][2];
            var pid = PaternalHalfSiblingsArray[t][3];


            //Do candidate have children
            var cnr = COUNT_KIDS(NephewArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            PATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        PATERNALDATA = PATERNALDATA.sort(SortByNr);

        LOAD_HALF_PATERNAL_OBJECTS(PATERNALDATA);
    }



    //Paternal Half Broters
    function LOAD_HALF_PATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY, lx, p1;
        var xl = new Array();
        var P1 = new Array();

        //alert ("'PatHalfSib' *** PATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        if (ARRAY.length > 0) {
            p2 = mastery;
            //$.each(ARRAY, function (key, value) {
            for (var p in ARRAY) {
                var DATAKEY = ARRAY[p].id;
                var CNR = ARRAY[p].cnr;
                var MIDGEN = ARRAY[p].value[0];
                var MID = ARRAY[p].value[1];
                var PID = ARRAY[p].value[2];
                var PIDGEN = $('#' + PID).attr('class').toUpperCase();
                var p1temp = new Array();
                //var datakey = value[2];


                //Parse array and build diagram
                if (p == 0) {
                    DATAKEY = ARRAY[p].id;
                    //alert(BrothersArray.length)
                    if (BrothersArray.length > 1) {
                        var d = BrothersArray[BrothersArray.length - 1];
                        lx = parseInt($('#' + d[1]).attr('x'));
                        p1 = parseInt(lx) - 165;
                        SINGLE_LEFT_CORNER_CONNECTOR(PID,d[1],'MALE',PIDGEN,Level3M,p1);
                    }
                    else {
                        //p1 = parseInt($('#' + PID).attr('x')) - lx;
                        var ps = LEFT_START_HALF_SIBLINGS_GEN(PIDGEN,PID,MIDGEN);
                        //var ps = GENLINE(PIDGEN, PID);
                        p1 = ps[0];
                        SINGLE_LEFT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }

                    //Get previous object coordninates
                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);
                    STACK_CONNECTOR(ARRAY,'PatHalfSib');

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    DATAKEY = ARRAY[p].id;
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    var TARGET = P1[P1.length - 1][2];
                    var PREVIOUSCNR = P1[P1.length - 1][3];
                    if(PREVIOUSCNR==0) var p1 = parseInt(TARGET) - 80;
                    else var p1 = parseInt(TARGET) - (parseInt(PREVIOUSCNR) * 80);

                    //var BID = BrothersArray[key - 1][1];
                    //var check = IS_IN_ARRAY(NephewArray, PREVIOUSID);

                    //var ps = LEFT_HALF_SIBLINGS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    //p1 = SINGLE_LEFT_CORNER_CONNECTOR(PREVIOUSGEN,MID,MIDGEN,PREVIOUSID,Level3M);

                    //p1 = ps[0];

                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);



                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

            }
        }

        STACK_CONNECTOR(ARRAY,'PatHalfSib');

    }


    function MATERNAL_HALF_SIBLINGS_LOAD() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();
        var MATERNALDATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("MaternalHalfSiblingsArray ARRAY Information:" + JSON.stringify(MaternalHalfSiblingsArray, null, 2) );
        if(MaternalHalfSiblingsArray.length==0)return;
        for (t = 0; t < MaternalHalfSiblingsArray.length; t++) {
            var midgen = MaternalHalfSiblingsArray[t][0];
            var mid = MaternalHalfSiblingsArray[t][1];
            var id = MaternalHalfSiblingsArray[t][2];
            var pid = MaternalHalfSiblingsArray[t][3];

            //Do candidate have children
            var cnr = COUNT_KIDS(NephewArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            MATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr);

        LOAD_HALF_MATERNAL_OBJECTS(MATERNALDATA);
    }

    //Paternal Half Broters
    function LOAD_HALF_MATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY, lx, p1;
        var xl = new Array();
        var P1 = new Array();

        //alert ("'MatHalfSib' *** PATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        if (ARRAY.length > 0) {
            p2 = mastery;
            //$.each(ARRAY, function (key, value) {
            for (var p in ARRAY) {
                var DATAKEY = ARRAY[p].id;
                var CNR = ARRAY[p].cnr;
                var MIDGEN = ARRAY[p].value[0];
                var MID = ARRAY[p].value[1];
                var PID = ARRAY[p].value[2];
                var PIDGEN = $('#' + PID).attr('class').toUpperCase();
                var p1temp = new Array();
                //var datakey = value[2];


                //Parse array and build diagram
                if (p == 0) {
                    DATAKEY = ARRAY[p].id;
                    if (SistersArray.length > 1) {
                        var d = SistersArray[SistersArray.length - 1];
                        var lx = $('#' + d[1]).attr('cx');
                        if(MIDGEN=='MALE') p1 = parseInt(lx) + 200;
                        else  p1 = parseInt(lx) + 145;
                        SINGLE_RIGHT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }
                    else {
                        var ps = RIGHT_START_HALF_SIBLINGS_GEN(PIDGEN,PID,MIDGEN);
                        p1 = ps[0];
                        SINGLE_RIGHT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }

                    //Get previous object coordninates
                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    DATAKEY = ARRAY[p].id;
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    var TARGET = P1[P1.length - 1][2];
                    var PREVIOUSCNR = P1[P1.length - 1][3];
                    if(PREVIOUSCNR==0) var p1 = parseInt(TARGET) + 110;
                    else var p1 = parseInt(TARGET) + (parseInt(PREVIOUSCNR) * 110);

                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

            }
        }

        STACK_CONNECTOR(ARRAY,'MatHalfSib');

    }

    //Load sisters
    function SISTERS_LOAD() {
        var lx = 0;
        var ly = 0;
        var MIDGEN, MID, SPID;
        var p1, p2, lx;
        var PID = 'me';
        var xl = new Array();
        var P1 = new Array();

        //alert ("SistersArray ARRAY Information:" + JSON.stringify(SistersArray, null, 2) );
        //Are any family children around
        var TOTALGRANDKIDS = COUNT_FAMILY_KIDS(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS(ChildrenArray);

        //alert ("ChildrenArray ARRAY Information:" + JSON.stringify(ChildrenArray, null, 2) );

        if(SistersArray.length==0)return;

        if (SistersArray.length > 0) {
            p2 = mastery;
            $.each(SistersArray, function (key, value) {
                var MIDGEN = value[0];
                var MID = value[1];
                var mid = value[1];
                var datakey = value[2];
                var p1temp = new Array();

                if ((ChildrenArray.length == 1)) {
                    var d = ChildrenArray[ChildrenArray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x')) + 150;
                    else lx = parseInt($('#' + d[1]).attr('cx')) + 150;
                }
                else if (ChildrenArray.length > 0) {
                    var d = ChildrenArray[ChildrenArray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'))+ parseInt(TOTALMYKIDS) * 10;
                    else lx = parseInt($('#' + d[1]).attr('cx'))+ parseInt(TOTALMYKIDS) * 10;
                }

                if (SistersArray.length > 1) {
                    //Parse array and build diagram
                    if (key > 0 && (key < (SistersArray.length - 1))) {
                        var SID = SistersArray[key - 1][1];
                        var PREVIOUSGEN = P1[P1.length - 1][0];
                        var PREVIOUSID = P1[P1.length - 1][1];
                        var PREVIOUSP1 = P1[P1.length - 1][2];
                        var KIDS = COUNT_KIDS(NephewArray, PREVIOUSID);
                        if(KIDS==0)KIDS=1;


                        var check = IS_IN_ARRAY(NephewArray, SID);
                        var p1 = PREVIOUSP1 + (parseInt(KIDS) * 75);
                        //if (check != -1) p1 = parseInt(p1) + 120;

                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);
                    }
                    else if (key == (SistersArray.length - 1)) {
                        var SID = SistersArray[key - 1][1];
                        var check = IS_IN_ARRAY(NephewArray, SID);

                        var PREVIOUSGEN = P1[P1.length - 1][0];
                        var PREVIOUSID = P1[P1.length - 1][1];
                        var PREVIOUSP1 = P1[P1.length - 1][2];
                        var KIDS = COUNT_KIDS(NephewArray, PREVIOUSID);

                        var check = IS_IN_ARRAY(NephewArray, SID);
                        var p1 = PREVIOUSP1 + (parseInt(KIDS) * 75);
                        //p1 = PREVIOUSP1 + 120;
                        //if (check != -1) p1 = parseInt(p1) + 120;
                    }
                    else {
                        var KIDS = COUNT_MY_KIDS(ChildrenArray, PID);
                        if(KIDS==0) KIDS=1;

                        if ($('#' + PID).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(KIDS) * 85) + (parseInt(TOTALGRANDKIDS) * 60);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(KIDS) * 85) + (parseInt(TOTALGRANDKIDS) * 60);
                        }

                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);
                    }

                }
                else {
                    var KIDS = COUNT_MY_KIDS(ChildrenArray, PID);
                    if(KIDS==0) KIDS=1;
                    if(GRANDSGROUP>0){
                        if ($('#' + PID).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(SINGLEGROUPS) * 85) + (parseInt(GRANDSGROUP) * 180);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(SINGLEGROUPS) * 85) + (parseInt(GRANDSGROUP) * 180);
                        }
                    }
                    else {

                        if ($('#' + PID).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(KIDS) * 85);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(KIDS) * 85);
                        }
                    }
                }

                svg.circle(p1, Level3F, cr, {
                    id: MID,
                    datakey: datakey,
                    fill: gencolor,
                    stroke: 'red',
                    strokeWidth: 2,
                    class: 'female',
                    cursor: 'pointer'
                });
            });
        }


        //Prevent too many hooks
        for (i = 0; i < SistersArray.length; i++) {
            var value = SistersArray[i];
            mid = value[1];

            //Confirm my gender
            p1 = parseInt($('#' + mid).attr('cx'));
            p2 = parseInt($('#' + mid).attr('cy') - 20);

            if (value % 2 == 0) {
                xl.push([[p1, p2], [p1, p2 - 20]]);
            }
            else if (value % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
        }


        var mx = $('#mei').attr("x1");
        var my = $('#mei').attr("y1");
        var POLYLINE3 = parseInt(my) + 160;

        xl.push([[p1, p2 - 20], [mx, POLYLINE3]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Td_' + pid, fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    //Get direct X Y coordinates
    function SPOTLINE(ID) {
        var GEN = $('#' + ID).attr("class").toUpperCase();

        var p1, p2;
        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) + 20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy')) - 20;
        }
        return [p1,p2]
    }

    //Sort the array values by female / male
    function SortByName(a, b) {
        var aName = a[0].toLowerCase();
        var bName = b[0].toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    function SortById(a, b) {
        a = a[2];
        b = b[2];

        var aName = a.toLowerCase();
        var bName = b.toLowerCase();
        //var aName = a;
        //var bName = b;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    function SortByNr(a, b) {

        a = a.id;
        b = b.id;

        var aName = a.toLowerCase();
        var bName = b.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }


    function NEPHEWS_LOAD() {
        var lx = 0;
        var ly = 0;
        var pid, mid, G, midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var PATERNALDATA = new Array();
        var MATERNALDATA = new Array();

        //NephewArray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        var gnr="";

        var gnr = COUNT_GROUPS(GrandChildrenArray);

        //alert ("GrandChildrenArray ARRAY Information:" + JSON.stringify(GrandChildrenArray, null, 2) );

        for (t = 0; t < NephewArray.length; t++) {
            var key = $('#' + NephewArray[t][2]).attr('datakey');
            var midgen = NephewArray[t][0];
            var mid = NephewArray[t][1];
            var pid = NephewArray[t][2];

            var side = $('#' + pid).attr('datakey').substring(0, 1);

            if (side == 'P') {
                if (ptid != key)pnr = 0;
                var ptid = key;
                PATERNALDATA.push({"id": ptid, "value": [midgen, mid, pid], "nr": pnr, gnr: gnr})
                pnr = pnr + 1;
            }
            if (side == 'M') {
                if (mtid != key)mnr = 0;
                var mtid = key;
                MATERNALDATA.push({"id": mtid, "value": [midgen, mid, pid], "nr": mnr, gnr: gnr});
                mnr = mnr + 1;
            }
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr);
        PATERNALDATA = PATERNALDATA.sort(SortByNr);

        LOAD_MATERNAL_OBJECTS(MATERNALDATA);
        LOAD_PATERNAL_OBJECTS(PATERNALDATA);
    }

    function LOAD_MATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();
        var GRANDGROUPS = "";

        //alert ("MATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();
            var GRANDGROUPS =  ARRAY[p].gnr;

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN, GRANDGROUPS);
                p1 = ps[0];
                //p2 = ps[1];

                //if (ChildrenArray.length > 0) {
                //    var d = ChildrenArray[ChildrenArray.length - 1];
                //    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                //    else lx = parseInt($('#' + d[1]).attr('cx'));
                //    p1 = lx + 60;
                //}

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }

                //Connect to parent
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;

                if (LINE == 0) {
                    var ps = RIGHT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = RIGHT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                }
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                //Connect to parent

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
                //right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
            }
        }

        CONNECTOR(ARRAY,'TEST');
        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT(objectsarray, 'test');
        //        objectsarray = new Array();
        //        id = ARRAY[p].id
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id == ARRAY[p].id) {
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //}
        //OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function LOAD_PATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("PATERNAL NEPHEW ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        //$.each(ARRAY, function (datakey, data) {
        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }

                //Connect to parent
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);



            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;

                if (LINE == 0) {
                    var ps = LEFT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = LEFT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                //Connect to parent
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);


            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = LEFT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                //p1 = P1[P1.length - 1][2] - 90;
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);

            }

        }

        CONNECTOR(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT(objectsarray, 'test');
        //        objectsarray = new Array();
        //        id = ARRAY[p].id
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id == ARRAY[p].id) {
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //}
        //OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function LOAD_SPOUCE_MATERNAL(ID, GEN) {
        var ID, GEN, SPOUCE;
        var objectsarray = new Array();
        var mdia, fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_" + ID;
        if (ID == 'me') {
            if (GEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 70;
                p2 = parseInt($('#' + ID).attr('cy')) - 20;
                svg.line(LINEGROUP, masterx, mastery + 20, p1, mastery + 20, {id: 'female_spouce', stroke: 'black', strokeWidth: 3});
            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                svg.line(LINEGROUP, masterx, mastery + 20, p1, mastery + 20, {id: 'male_spouce', stroke: 'black', strokeWidth: 3});
            }
        }
        else {
            if (GEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 70;
                p2 = parseInt($('#' + ID).attr('cy')) - 20;

            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 110;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            SPOUCE_CONNECT(ID);
        }
        //mdia = rr;
        //fdia = cr;
        //Build a spuce sign
        if (GEN == 'FEMALE') {
            svg.rect(p1, p2, rr, rr, 1, 1, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'male',
                cursor: 'pointer'
            });
        }
        else if (GEN == 'MALE') {
            svg.circle(p1, p2, cr, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'female',
                cursor: 'pointer'
            });
        }
    }

    function LOAD_SPOUCE_PATERNAL(ID, GEN) {

        var ID, GEN, SPOUCE;
        var objectsarray = new Array();
        var mdia, fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_" + ID;

        if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) - 120;
            p2 = parseInt($('#' + ID).attr('cy')) - 20;

        }
        else {
            p1 = parseInt($('#' + ID).attr('x')) - 80;
            p2 = parseInt($('#' + ID).attr('y')) + 20;
        }

        //Build a spuce sign
        PATERNAL_SPOUCE_CONNECT(ID)
        if (GEN == 'FEMALE') {
            svg.rect(p1, p2, rr, rr, 1, 1, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'male',
                cursor: 'pointer'
            });
        }
        else if (GEN == 'MALE') {
            svg.circle(p1, p2, cr, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'female',
                cursor: 'pointer'
            });
        }
        ;
    }

    //function LOAD_SPOUCE_PATERNAL1(ID, GEN) {
    //    var ID, GEN, SPOUCE;
    //    var objectsarray = new Array();
    //    var mdia, fdia;
    //    GEN = GEN.toUpperCase();
    //    SPOUCE = "SP_" + ID;
    //    if (ID == 'me') {
    //        if (GEN == 'FEMALE') {
    //            p1 = parseInt($('#' + ID).attr('cx')) + 70;
    //            p2 = parseInt($('#' + ID).attr('cy')) + 20;
    //
    //            //p1 = masterx + 150;
    //            //p2 = mastery;
    //        }
    //        else {
    //            p1 = parseInt($('#' + ID).attr('x')) + 100;
    //            p2 = parseInt($('#' + ID).attr('y')) + 20;
    //            //p1 = masterx + 150;
    //            //p2 = mastery + 25;
    //        }
    //        svg.line(LINEGROUP, masterx, p2, p1, p2, {id: 'spuces', stroke: 'black'});
    //    }
    //    else {
    //        if (GEN == 'FEMALE') {
    //            p1 = parseInt($('#' + ID).attr('cx')) + 70;
    //            p2 = parseInt($('#' + ID).attr('cy')) - 20;
    //
    //            //p1 = masterx + 150;
    //            //p2 = mastery;
    //        }
    //        else {
    //            p1 = parseInt($('#' + ID).attr('x')) + 70;
    //            p2 = parseInt($('#' + ID).attr('y')) + 20;
    //            //p1 = masterx + 150;
    //            //p2 = mastery + 25;
    //        }
    //        SPOUCE_CONNECT(ID);
    //    }
    //    //mdia = rr;
    //    //fdia = cr;
    //    //Build a spuce sign
    //    if (GEN == 'FEMALE') {
    //        svg.rect(p1, p2, rr, rr, 1, 1, {
    //            id: SPOUCE,
    //            fill: gencolor,
    //            stroke: 'red',
    //            strokeWidth: 2,
    //            class: 'male',
    //            cursor: 'pointer'
    //        });
    //    }
    //    else if (GEN == 'MALE') {
    //        svg.circle(p1, p2, cr, {
    //            id: SPOUCE,
    //            fill: gencolor,
    //            stroke: 'red',
    //            strokeWidth: 2,
    //            class: 'female',
    //            cursor: 'pointer'
    //        });
    //    }
    //}

    //Check array condition if has children
    function IS_IN_ARRAY(ARRAY, ID) {
        var res = -1;
        $.each(ARRAY, function (k, data) {
            if (ID == data[2]) {

                //var ps = GENLINE(data[0],ID);
                //res = ps[0];
                res = 'found';
                return false;
            }
        });
        return res;
    }

    //Check array condition if has children
    function COUNT_KIDS(ARRAY, ID) {



        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {

            if (ID == data[2]) {
                amt = parseInt(amt) + 1;


                //var ps = GENLINE(data[0],ID);
                //res = ps[0];
                //res = 'found';
                //return false;
            }
        });

        return amt;
    }

    //Check array condition if has children
    function COUNT_MY_KIDS(ARRAY, ID) {
        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {
            if (ID == data[3]) {
                amt = parseInt(amt) + 1;


                //var ps = GENLINE(data[0],ID);
                //res = ps[0];
                //res = 'found';
                //return false;
            }
        });

        return amt;
    }

    //Check any array condition if has children
    function COUNT_FAMILY_KIDS(ARRAY) {
        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {
            if (data[2]) {
                amt = parseInt(amt) + 1;
            }
        });

        return amt;
    }

    function COUNT_IN_ARRAY(ARRAY, ID) {
        var res = -1;
        var count = 0;
        $.each(ARRAY, function (k, data) {
            if (ID == data[2]) {
                count = count + 1;
            }
        });
        return count;
    }

    //Connect object rows
    function OBJECTS_CONNECT(ARRAY, ID) {
        var xl = new Array();
        if (ARRAY.length > 1) {
            for (i = 0; i < ARRAY.length; i++) {
                var GEN = ARRAY[i][0];
                var ID = ARRAY[i][1];
                //alert(GEN + " ** " + ID)
                var ps = GENLINE(GEN,ID);
                p1 = ps[0];
                p2 = ps[1];
                //Begin of the objects coord recorder
                if (i % 2 == 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                else if (i % 2 != 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
            }
            //alert ( ID + " *** STACK_CONNECTOR Information:" + JSON.stringify(xl, null, 2) );

            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 3});
        }
        else{

            for (i = 0; i < ARRAY.length; i++) {

                var ps = GENLINE(ARRAY[i][0], ARRAY[i][1]);
                p1 = ps[0];
                p2 = ps[1];
                //Begin of the objects coord recorder
                //if (i % 2 == 0) {
                //    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                //}
                //else if (i % 2 != 0) {
                xl.push([[p1, p2], [p1, p2 - 20]    ]);
                //}
            }

            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 3});
        }
    }


    //Connect spouces rows
    function SPOUCE_CONNECT(ID) {
        var xl = new Array();
        var p1, p2;
        var GEN = $('#' + ID).attr('class').toUpperCase();

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'));
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) - 20;
            p2 = parseInt($('#' + ID).attr('cy')) - 20;
        }
        xl.push([[p1 + 40, p2 + 20], [p1 + 125, p2 + 20]]);
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 3});

        return;
    }

    //Connect spouces rows
    function PATERNAL_SPOUCE_CONNECT(ID) {

        var xl = new Array();
        var p1, p2;
        var GEN = $('#' + ID).attr('class').toUpperCase();

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) - 100;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) - 120;
            p2 = parseInt($('#' + ID).attr('cy')) - 20;
        }
        xl.push([[p1 + 40, p2 + 20], [p1 + 100, p2 + 20]]);
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 3});

        return;
    }

    //Load paternal cousins
    function MATERNAL_COUSINS_LOAD() {

        var lx = 0;
        var ly = 0;
        var pid, mid, G, midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var DATAARRAY = new Array();
        var mtemp = new Array();

        MaternalCousinArray = MaternalCousinArray.sort(SortById);
        var nr = 0;
        var id = "";

        for (t = 0; t < MaternalCousinArray.length; t++) {
            var parentid = MaternalCousinArray[t][2];
            var ckey = MaternalCousinArray[t][3];
            var key = $('#' + parentid).attr('datakey');
            if (id != key)nr = 0;
            var id = key;
            var midgen = MaternalCousinArray[t][0];
            var mid = MaternalCousinArray[t][1];
            var pid = MaternalCousinArray[t][2];
            var side = $('#' + pid).attr('datakey').substring(0, 1);
            if (side == 'M') {
                mtemp.push({"id": id, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
        }
        //mtemp.sort(SortById);
        LOAD_MATERNAL_COUSINS_OBJECTS(mtemp);

    }

    function LOAD_MATERNAL_COUSINS_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("MATERNALS ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level3M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;
                var PREVMID = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                //Begin new elemnt
                if (LINE == 0) {
                    ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                //if(MIDGEN=='MALE'){
                //    if(P1[P1.length - 1][0] == 'FEMALE') p1 = parseInt(P1[P1.length - 1][2]) + 40;
                //    else p1 = parseInt(P1[P1.length - 1][2]) + 60;
                //}
                //else{
                //    if(P1[P1.length - 1][0] == 'FEMALE') p1 = parseInt(P1[P1.length - 1][2]) + 65;
                //    else p1 = parseInt(P1[P1.length - 1][2]) + 80;
                //}
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level3M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }


        CONNECTOR(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT(objectsarray, 'test');
        //        objectsarray = new Array();
        //        id = ARRAY[p].id
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id == ARRAY[p].id) {
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //}
        //OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function PATERNAL_COUSINS_LOAD() {
        var lx = 0;
        var ly = 0;
        var pid, mid, G, midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var DATAARRAY = new Array();
        var mtemp = new Array();



        var nr = 0;
        var id = "";
        var pid = "";

        //alert ("ARRAY ARRAY Information:" + JSON.stringify(PaternalCousinArray, null, 2) );

        for (t = 0; t < PaternalCousinArray.length; t++) {
            var key = PaternalCousinArray[t][2];
            //if (id != key)nr = 0;
            //var id = key;
            var midgen = PaternalCousinArray[t][0];
            var mid = PaternalCousinArray[t][1];


            //if (side == 'P') {
            if(pid=="") {
                var pid = PaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
            else if(pid == PaternalCousinArray[t][3]){
                var pid = PaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
            else if(pid != PaternalCousinArray[t][3]){
                var pid = PaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                nr = 0;
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})

            }
            //}
        }

        //alert ("DATAARRAY ARRAY Information:" + JSON.stringify(DATAARRAY, null, 2) );

        //ptemp.sort(SortById);
        DATAARRAY = DATAARRAY.sort(SortByNr);
        LOAD_PATERNAL_COUSINS_OBJECTS(DATAARRAY);

    }


    function LOAD_PATERNAL_COUSINS_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("LOAD_PATERNAL_COUSINS_OBJECTS ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
                //Connect to parent
            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;
                //var PREVMID = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var PREVIOUSX = P1[P1.length - 1][2];

                if (LINE == 0) {
                    ps = LEFT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = LEFT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];

                    //var ps = LEFT_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    //p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                }

                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
                //Connect to parent
            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = LEFT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, mastery, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }

        CONNECTOR(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT(objectsarray, 'test');
        //        objectsarray = new Array();
        //        id = ARRAY[p].id
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id == ARRAY[p].id) {
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //}
        //OBJECTS_CONNECT(objectsarray, 'ltest');
    }


    function CONNECTOR(ARRAY,ID){


        var objectsarray = new Array();
        var id = "0";
        for (var p in ARRAY) {
            var tmp = new Array();
            if (id == "0") {
                id = ARRAY[p].id;
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if (id != ARRAY[p].id) {
                OBJECTS_CONNECT(objectsarray, 'test');
                objectsarray = new Array();
                id = ARRAY[p].id
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if (id == ARRAY[p].id) {
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
        }

        OBJECTS_CONNECT(objectsarray, ID);
    }

    function STACK_CONNECTOR(ARRAY,ID){


        var objectsarray = new Array();
        var id = "0";
        for (var p in ARRAY) {
            var tmp = new Array();
            if (id == "0") {
                id = ARRAY[p].id;
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if (id != ARRAY[p].id) {
                //OBJECTS_CONNECT(objectsarray, 'test');
                //objectsarray = new Array();
                id = ARRAY[p].id
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if (id == ARRAY[p].id) {
                tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
        }

        //alert (objectsarray.length + " --- " + ID + " *** STACK_CONNECTOR Information:" + JSON.stringify(objectsarray, null, 2) );

        OBJECTS_CONNECT(objectsarray, ID);
    }


    function SINGLE_SIDE_START_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx')) - 45;
            var p2 = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else {
            var p1 = parseInt($('#' + PID).attr('x'))- 0;
            var p2 = parseInt($('#' + PID).attr('y')) + 0;
            target1 = parseInt(target1)+20;
        }
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 20;

        xl.push([
            [parseInt(p1)+20, parseInt(LEVEL) - 20],
            [target1, parseInt(LEVEL) - 20],
            [target1,parseInt(LEVEL) - 20],
            [target1, parseInt(LEVEL)-20]
        ]);
            svg.polyline(xl, {id: 'Pss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    function SINGLE_SIDE_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx')) - 45;
            var p2 = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else {
            var p1 = parseInt($('#' + PID).attr('x')) - 0;
            var p2 = parseInt($('#' + PID).attr('y')) + 0;
            //target1 = parseInt(target1)+20;
        }
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 20;
        else var target1 = parseInt(target1) + 20;

        xl.push([[target1, parseInt(LEVEL)-20], [target1, parseInt(LEVEL)-20],[target1,parseInt(LEVEL)-20],[parseInt(p1)+45, parseInt(LEVEL)-20]]);
        svg.polyline(xl, {id: 'Hbss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    function SINGLE_LEFT_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx')) - 45;
            var p2 = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else {
            var p1 = parseInt($('#' + PID).attr('x'))  - 0;
            var p2 = parseInt($('#' + PID).attr('y')) + 20;
            target1 = parseInt(target1)+20;
        }
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 20;

        xl.push([[target1, LEVEL], [target1, LEVEL - 0],[target1,p2],[p1+0, p2]]);
        svg.polyline(xl, {id: 'Hbcs_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return p1;


    }

    function SINGLE_RIGHT_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx'))+25;
            var p2 = parseInt($('#' + PID).attr('cy'));
        }
        else {
            var p1 = parseInt($('#' + PID).attr('x'))  - 0;
            var p2 = parseInt($('#' + PID).attr('y')) + 20;
            target1 = parseInt(target1)+20;
        }
        if(MIDGEN=='MALE') target1 = parseInt(target1) + 20;
        //else return p1;

        xl.push([[target1, p2], [target1, LEVEL - 0],[target1,p2],[p1, p2]]);
        svg.polyline(xl, {id: 'Hscs_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        //if(MIDGEN=='MALE') return p1 + 20;
        //else return p1;


    }

    function right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, LEVEL) {
        var xl = new Array();
        var x, y, ex, ey;

        if (PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx')) + 45;
            y = parseInt($('#' + PID).attr('cy')) - 20;
            xl.push([[x, y + 20], [x, LEVEL - 20]]);
        }
        else if (PIDGEN == "MALE") {
            x = parseInt($('#' + PID).attr('x')) + 65;
            y = parseInt($('#' + PID).attr('y'));
            xl.push([[x, y + 20], [x, LEVEL]]);
        }
        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return false;
    }

    function single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, LEVEL) {
        var xl = new Array();
        var x, y, ex, ey;

        if (PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx')) + 45;
            y = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else if (PIDGEN == "MALE") {
            if (MIDGEN == "FEMALE") {
                x = parseInt($('#' + PID).attr('x')) + 60;
                y = parseInt($('#' + PID).attr('y'));
            }
            else {
                x = parseInt($('#' + PID).attr('x')) + 65;
                y = parseInt($('#' + PID).attr('y'));
            }
        }
        xl.push([[x, y + 20], [x, LEVEL - 0]]);

        svg.polyline(xl, {id: 'Tcrs_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return false;
    }

    function left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, LEVEL) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx')) - 45;
            var y = parseInt($('#' + PID).attr('cy'));
        }
        else {
            var x = parseInt($('#' + PID).attr('x')) - 30;
            var y = parseInt($('#' + PID).attr('y')) + 20;
        }
        xl.push([[x, y], [x, LEVEL]]);
        svg.polyline(xl, {id: 'Tlr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return false;
    }

    function single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, LEVEL) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx')) - 45;
            var y = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else {
            var x = parseInt($('#' + PID).attr('x')) - 30;
            var y = parseInt($('#' + PID).attr('y')) + 0;
        }
        xl.push([[x, y + 20], [x, LEVEL - 0]]);
        svg.polyline(xl, {id: 'Tlrs_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return false;
    }

    function left_parent_child_L4_connector(PID, MID, MIDGEN, PIDGEN, NR) {
        var xl = new Array();
        if (MIDGEN == "FEMALE") {
            var ex = parseInt($('#' + MID).attr('cx'));
            var ey = parseInt($('#' + MID).attr('cy'));
        }
        else {
            var ex = parseInt($('#' + MID).attr('x'));
            var ey = parseInt($('#' + MID).attr('y'));
            if (PIDGEN == "FEMALE") {
                ex = ex - 20
            }
        }
        if (PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx'));
            var y = parseInt($('#' + PID).attr('cy'));
        }
        else {
            var x = parseInt($('#' + PID).attr('x'));
            var y = parseInt($('#' + PID).attr('y'));

        }
        var rnd = (parseInt(y) + 100) - (parseInt(NR) + 8);
        xl.push([[x + 20, y + 40], [x + 20, rnd], [ex + 20, rnd], [ex + 20, ey]]);
        svg.polyline(xl, {id: 'Tcl_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
        return false;
    }

    function setTransform(elem, x, y, scale) {
        var transform = elem.data('transform');
        transform.x += (x || 0);
        transform.y += (y || 0);
        transform.scale *= (scale || 1);
        elem.data('transform', transform);
        return 'translate(' + transform.x + ' ' + transform.y + ') scale(' + transform.scale + ')';
    }

    if (NephewArray.length > 5) {
        if (PaternalCousinArray.length > 8) {
            svgw.setAttribute('viewBox', '0 -20 2000 1800');
            var w = svgw.getAttribute('width');
            svgw.setAttribute('width', 2000);
        }
        else {
            svgw.setAttribute('viewBox', '-20 0 1900 1200');
            svgw.setAttribute('width', 1900);
        }
    }
    else if (PaternalRelatives.length > 3) {
            svgw.setAttribute('viewBox', '-20 0 2000 1300');
        svgw.setAttribute('width', 2000);
    }
    else{
        svgw.setAttribute('viewBox', '0 0 1800 1200');
        svgw.setAttribute('width', 1800);
    }
}



//Build a table of health issues
function LOAD_HEALTH_TABLE(){
    var DISEASESARRAY = new Array();
    var item;


    //Add my self to table
    var TABLE_DATA_ARRAY = new Array();
    var temp1 = new Array();
    var temp2 = new Array();
    var diss;


    temp1.push(personal_information.name)
    temp1.push('Self')
    var cod = ((typeof personal_information.cause_of_death == 'undefined') ? 'Yes' : 'No / ' + personal_information.cause_of_death);

    var myhealth = new Array();
    myhealth = personal_information['Health History'];

    var cols = new Array();
    cols = LOAD_DATA(cod,diseasearray.length)

    if(myhealth.length>0) {
        $.each(myhealth, function (key, item) {
            var tmp = item['Disease Name'];
            var details = item['Detailed Disease Name'];
            if ($.inArray(tmp, diseasearray) != -1) {
                diss = "";
                $.each(diseasearray, function(key, item) {
                    if(tmp == item){
                        diss = [key,details];
                    }
                });
                var disst = diss[1];
                if(disst==null)disst = tmp;
                cols[diss[0]+1]= '<span style="background-color: darkslategray;color: white;padding: 4px 8px 4px 8px">' + disst + '</span>';
            }
        });

        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), cols );


        //TABLE_DATA_ARRAY.push(cols.toString());
        //temp.push(cols)
    }
    else {
        var cols = new Array();
        cols = LOAD_DATA(cod,diseasearray.length);
        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), cols );
    }
    DISEASESARRAY.push(TABLE_DATA_ARRAY);




    //Load remaining family
    var TABLE_DATA_ARRAY = new Array();

    $.each(personal_information, function(key, item) {
        var temp1 = new Array();
        var temp2 = new Array();
        //var temp = new Array();
        if(item!=null && typeof item != 'undefined') {
            var FAMNAME = item.name;
            var RELATION = $.t("fhh_js." + item.relationship);

            var fullid =  ($.inArray(key, defaultfamilyarray));
            var halfid =  ($.inArray(key.substr(0,key.lastIndexOf('_')), defaultfamilyarray));

            if (fullid != -1){
                if (item.id == null || typeof item.id == 'undefined') {
                    FAMNAME = key;
                    RELATION=key.substr(key.indexOf('_')+1,key.length);
                }
            }
            else if (halfid != -1){
                if (item.id == null || typeof item.id == 'undefined') {
                    FAMNAME = key;
                    RELATION=key.substr(0,key.lastIndexOf('_'));
                }
            }

            if (FAMNAME != null && typeof FAMNAME != 'undefined') {
                var NAME = FAMNAME;
                temp1.push(NAME );
                temp1.push(RELATION);

                var cod = ((typeof item.cause_of_death == 'undefined') ? 'Yes' :  'No / ' + item.cause_of_death);
                var cols = new Array();
                var diss;

                cols = LOAD_DATA(cod,diseasearray.length)

                //Is in Disease array
                if (typeof item['Health History'] != 'undefined') {
                    if (item['Health History'].length > 0) {
                        $.each(item['Health History'], function (key, item) {
                            var tmp = item['Disease Name'];
                            var details =  item['Detailed Disease Name'] ;
                            if ($.inArray(tmp, diseasearray) != -1) {
                                diss = "";
                                $.each(diseasearray, function (key, item) {
                                    if (tmp == item) {
                                        diss = [key, details];
                                    }
                                });
                                var disst = diss[1];
                                if(disst==null) disst = tmp;
                                cols[diss[0] + 1] = '<span style="background-color: darkslategray;color: white;padding: 4px 8px 4px 8px">' + disst + '</span>';
                            }
                        });
                        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), cols );
                        //temp.push(cols);
                    }
                    else {
                        var cols = new Array();
                        cols = LOAD_DATA(cod, diseasearray.length)
                        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), cols );
                        //temp.push(cols)
                    }
                }
                else {
                    var cols = new Array();
                    cols = LOAD_DATA(cod, diseasearray.length)
                    TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), cols );
                    //temp.push(cols)
                }
                DISEASESARRAY.push(TABLE_DATA_ARRAY);
            }
        }
    });
    /*
    Add disease headers
     */
    oTable.fnAddData(DISEASESARRAY);


    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        // Get the column API object
        var ID = $(this).attr('data-column');
        var TXT = $(this).attr('id');
        var NAME = $(this).attr('name');
        oTable.fnSetColumnVis( ID, false );
        /*
        Infor of the closed diseases
         */
        if($("#closed_table tr td" ).length == 1) {
            $('#closed_table tr').append('<td>' +
            '<span style="font-weight:bold;background-color: white; color: black; padding-right:25px;">Closed Diseases:  </span>' +
            '<button id="' + TXT + '" class="closer"  data-column="' + ID + '" onClick="openTab(this.id)" style="background-color: darkslategrey;color: white;border: none;padding-right: 25px;cursor:pointer">' +
            '<img src="../static/images/open.gif" title="Add to the table" style="padding-right: 15px;padding-top: 4px;"/>' + NAME + '</button>' +
            '</td>');
        }
        else{
            $('#closed_table tr').append('<td>' +
            '<button id="' + TXT + '" class="closer"  data-column="' + ID + '" onClick="openTab(this.id)" style="background-color: darkslategrey;color: white;border: none;padding-right: 25px;cursor:pointer">' +
            '<img src="../static/images/open.gif" title="Add to the table" style="padding-right: 15px;padding-top: 4px;"/>' + NAME + '</button>' +
            '</button>' +
            '</td>');

        }
        $("#closed_table").show();
    } );


}

function openTab(TXT){
    var ID = TXT.substr(TXT.indexOf('_')+1 , TXT.length);
    oTable.fnSetColumnVis( ID, true );
    $('#'+TXT).hide();
}



function ADOPTED_FAMILY(){
    $.each(personal_information, function (key, item) {
        var adopt = item.adopted;
        if(typeof adopt != 'undefined'){
            if (adopt == 'true') {
                var id = item.id;
                $('#' + id).attr({fill: 'palegoldenrod'});
            }
        }
    });
}

function LOAD_TR(cod,nr){
    var cols = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) cols.push('<td>'+ cod + '</td>');
        else cols.push('<td></td>');

    }
    //cols.push('<td>' + cod + '</td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>');
    return cols;
}

function LOAD_DATA(cod,nr){
    var cols = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) cols.push(cod.toString());
        else cols.push(" - ");

    }
    return cols;
}


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function BMI_CALCULATE(W,H) {
    var finalBmi=0;
    var weight = W;
    var height = H;
    if(weight > 0 && height > 0){

        var bmw = parseInt(weight);
        var bmh = parseInt(height);

        finalBmi = (parseInt(bmw)/(parseInt(bmh)*parseInt(bmh))) * 703;

    }
    return finalBmi.toFixed(2);
}


function createDialog() {

    if($("#optionsPanel").dialog( "isOpen" ) == true) {
      $("#optionsPanel").dialog( "open" );

    }
    else {

        var array = new Array();
        array.push("<option value='0' selected></option>")

        $.each(personal_information, function (key, item) {
            if (typeof item.id != 'undefined') {
                if (item['Health History']) {
                    var health = new Array();
                    health = item['Health History'];
                    $.each(health, function (k, data) {
                        var disname = data['Disease Name'];
                        var detdisname = data['Detailed Disease Name'];

                        if(detdisname==null) var temp = "<option id=" + " value=" + disname + ">" + disname + "</option>"
                        else var temp = "<option id=" + +" value=" + disname + ">" + detdisname + "</option>"

                        array.push(temp)
                    });
                }
            }
        });

        var $optdialog = $("<div id='optionsPanel' width='800px' class='option_dialog' style='width:800px;'><p>"
        + "You can view, save or print your family health history to share with your health care worker. They can assess your risk for certain diseases, and develop disease prevention strategies that are right for you. You can also share the table with other family members to your your family's disease history. You can change what is shown in the table yourself by selecting from the options below. Please select from the options below what you would like to show on your table, and then press: Update Report."
        + "<table>"
        + "<tr>"
        + "<td>"
        + "<label for='diseaseopts'>Select a disease or condition to highlight in the table  </label>"
        + "<select id='diseaseopts' onchange='DiseaseDna()'>"
        + array.toString()
        + "<option value='one'></option>"
        + "</select>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
        + "<input id='bmi' type='checkbox' name='chk_group' value='bmi' onclick='HideInfo()' checked />Show my personal information in the report (such as Date of Birth, Height, or Weight)<br />"
        + "<input id='names' type='checkbox' name='chk_group' value='names' onclick='HideInfo()' checked />Show names of family members in the report<br />"
        + "<input id='diagram' type='checkbox' name='chk_group' value='diagram' onclick='HideInfo()' checked/>Show drawing (the tree diagram of your family's health history)<br />"
        + "<input id='table' type='checkbox' name='chk_group' value='table' onclick='HideInfo()' checked/>Show table (your family's health history displayed as a listing table)<br />"

        + "</td>"
        + "</tr></table>"


        + "</p></div>").dialog({
            width: 900,
            title: 'Diagram & Table Options',
            close: function (ev, ui) {
                //ClearDna();
                $(this).empty();
                $(this).dialog('destroy').remove();
            }
        });

        //Reset All to Original
        ResetInfo();

        return $optdialog
    }

}

function ClearDna(){
    $.each(personal_information, function (key, item) {
        var ID = item.id;
        if (typeof ID != 'undefined') {
            $('#'+ID).attr({fill: 'silver',stroke: 'red'});
        }
    });
}

function ClearNames(comp){
    if(comp=='hide') {
        $.each(personal_information, function (key, item) {
            var ID = item.id;
            var name1 = 'name1_' + ID;
            var name2 = 'name2_' + ID;
            if (typeof ID != 'undefined') {
                $('#' + name1).hide();
                $('#' + name2).hide();
            }
        });
        oTable.fnSetColumnVis( 0, false );

    }
    else{
        $.each(personal_information, function (key, item) {
            var ID = item.id;
            var name1 = 'name1_' + ID;
            var name2 = 'name2_' + ID;
            if (typeof ID != 'undefined') {
                $('#' + name1).show();
                $('#' + name2).show();
            }
        });
        oTable.fnSetColumnVis( 0, true );
    }
}

function DiseaseDna(){

    ClearDna();

    var selectBox = document.getElementById("diseaseopts");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    $.each(personal_information, function (key, item) {
        var ID = item.id;
        if(typeof ID!='undefined'){
            if(item['Health History']){
                var health = new Array();
                health = item['Health History'];
                $.each(health, function (k, data) {
                    var detdisname = data['Detailed Disease Name'];
                    var disname = data['Disease Name'];

                    if(selectedValue == detdisname){
                        $('#'+ID).attr({fill: 'yellow',stroke: 'black'});
                    }
                    else if(selectedValue == disname){
                        $('#'+ID).attr({fill: 'yellow',stroke: 'black'});
                    }
                });
            }
        }
    });

}

function HideInfo(){

    if(document.getElementById("bmi").checked == true) $('#bmi_table').show();
    else if(document.getElementById("bmi").checked == false) $('#bmi_table').hide();

    if(document.getElementById("names").checked == true) ClearNames('show');
    else if(document.getElementById("names").checked == false) ClearNames('hide');

    if(document.getElementById("diagram").checked == true) {
        $('#svgframe').show();
        $('#downoptions').hide();
    }
    else if(document.getElementById("diagram").checked == false) {
        $('#svgframe').hide();
        $('#downoptions').show();
    }

    if(document.getElementById("table").checked == true) $('#health_table').show();
    else if(document.getElementById("table").checked == false) $('#health_table').hide();


}

function ResetInfo(){
    $('#bmi_table').show();
    ClearNames('show');
    $('#svgframe').show();
    $('#health_table').show();



}




