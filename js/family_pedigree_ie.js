/**
 * Created by hendrikssonm on 10/14/2014.
 */

'<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />'


var mdialog=null;
var original;
var clone;
var masterRight = $(window).width();
var masterHeight = $(window).height();
var masterleft=Math.floor(parseInt(masterRight)/2);
var browser = navigator.userAgent;
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
var SCREENWIDTH=0;
var SVGWIDTH=0;
var PARENTWIDTH=0;
var DIALOGWIDTH=0;
var originalContents;
var svg;
var CLONE,CLONEFRAME;
var TOPCLONE,TOPCLONEFRAME;
var topdivheight,topdivwidht;
var infoframemargin;
var nowselected;

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

var STATICDISEASES = [
    'heart disease',
    'stroke',
    'diabetes',
    'colon cancer',
    'breast cancer',
    'ovarian cancer'
];



function IEload() {



    //IE 8
//if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
//    alert(navigator.userAgent)
//}

    

    /*
     Get Date
     */
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    var currentdate = new Date();

    var day = days[ currentdate.getDay() ];
    var month = months[ currentdate.getMonth() ];
    //Date
    var hours = currentdate.getHours();
    var hours = (hours+24-2)%24;
    var mid='AM';
    if(hours==0){ //At 00 hours we need to show 12 am
        hours=12;
    }
    else if(hours>12){
        hours=hours%12 + 2;
        mid='PM';
    }
    var today =  "Date of Report: " +
        day + ", " + month + " "
        + currentdate.getDate() + ", "
        + currentdate.getFullYear() + " "
        + hours + ":"
        + currentdate.getMinutes() + " "
        + mid;

//alert(new Date(0).toString())


    mdialog = $(
        '<div id="family_pedigree">' +
        '<div id="topsvg"> ' +
            //'<svg id="svgframe" version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">' +
            // '<svg id="svgframe">' +
            //'<g id="glass" class="">' +
            //'</g>' +
            // '</svg>' +
        '</div>' +

        '<div id="main" class="">' +

        '<div id="dialogtext" style="position: absolute;top: 20px"></div>' +

        '<div id="nav" class="sticky">' +
        '<ul>' +
        '<li><a class="top" onclick="ToTop_Ie();return false;" href="#">Go To Diagram</a></li>' +
        '<li><a class="bottom" onclick="ToTable();return false;" href="#">Go To Table</a></li>' +
        '<li><a id="printer">Print</a></li>' +
        '<li><a href="#top" onclick="createDialog_Ie()">Diagram & Table Options</a></li>' +
        '<li>' +
        '<select id="zoomer" class="selector" onchange="TheZoom_Ie(this);">'+
        '<option id="the1" value="100">+100</option>' +
        '<option id="the2" value="200">+200</option>' +
        '</select>' +
        '</li>' +
        '<li>' +
        '<input class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close"' +
        'type="button"role="button" aria-disabled="false" title="close" value="close" onclick="closedialog_ie()" style="right:50px;width:50px"></input>' +
        '</li>' +
        '</ul>' +
        '</div>' +
            //'<div id="top"></div>' +
            //'<div class="desc"></div>' +
            //'<div id="bottom" style="height:1px;border-left:solid 1px black"></div>' +
            //'<div class="scroll"></div>' +
        '<div class="info"></div>' +
        '</div>' +
        '<div id="family_pedigree_info">' +
        '<div>' +
        '<table id="closed_table" ><tr><td></td></tr></table>' +
        '<table id="health_table" class="display compact">' +
        '<caption style="font-size:12px;text-align: center">' + today + '</caption>' +
        '<thead></thead>' +
        '<tfoot></tfoot>' +
        '<tbody></tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>'
    );

    $(mdialog).dialog({
        autoOpen: false,
        position: ['top',0] ,
        //position: ['top', '10px'],
        title: 'Family Pedigree Chart 1',
        minHeight:450,
        height:'auto',
        width: 'auto',
        position: 'fixed',
        modal: true,
        open: function () {
            var target = $(this);
            $(this).dialog("open");
            // $(this).load(STARTRAP()) ;
            // $(this).load(LOAD_HEALTH_TABLE_IE());
            PARENTWIDTH = $(this).closest("div").attr("id");
            DIALOGWIDTH = $(this).width();
            SCREENWIDTH = parseInt($(window).width())-100;
            $(this).css("width", SCREENWIDTH);
            var myDialogX = $(this).position().left - $(this).outerWidth();
            //var myDialogY = $(this).position().top - ( $(document).scrollTop() + $('.ui-dialog').outerHeight() );
            $(this).dialog( 'option', 'position', [myDialogX, 40] );
            diseasearray=new Array();




        },
        beforeClose: function(){
            $(this).position(['top',0]);
            $(this).position('fixed');
        },
        close: function() {
            oTable.fnDestroy();

            $("#health_table").empty();
            diseasearray=new Array();
            $(this).empty();
            $(this).dialog('destroy').remove();
        }
    });

    $("#dialogtext").html(
        '<h1>View Diagram & Table</h1><br/>'+
        '<table class="infolayer">' +
        '<tr><td>' +
        '<p style="margin-bottom: 1px">sTalking with your health care provider about your family health history can help you stay healthy!</p><br style="line-height: 0px"/>' +
        '<p>Your family health conditions are shown here in a diagram and a table (below the diagram).  Scroll up and down to see both.</p>' +
        '</td></tr></table>'
    );

    //No info
    if(typeof personal_information.name == 'undefined'){
        if (confirm("Please enter valid information for a Diagram!")){
            return;
        }
    }

    $(document).ready(function() {

         // $(function() {

alert("raphael 0")
// CODE

// var svg = Raphael(0, 0, '100%', '100%');

 var svg = new Raphael(document.getElementById('topsvg'), '100%', '100%');

 // svg = Raphael("#svgIEframe", 500,500);
 // var svg = Raphael("paper", 500,500);
    // var circle3 = svg.circle(13, 13, 10.5);
    alert("raphael 0a")

    svg.rect(200,100,90,40).attr({fill: "red"}); 
    svg.text(masterleft - 120, 30, "Paternal").attr({fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft + 120, 30, "Maternal").attr({fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});

    // svg.line(LINEGROUP, masterleft - 100, 220, masterleft + 120, 220, {id: 'mel', stroke: 'black', strokeWidth: 3});
    // svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'mei', stroke: 'black', strokeWidth: 3});
    // svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'grmei', stroke: 'black', strokeWidth: 3});
    // svg.line(LINEGROUP, masterleft - 140, 220, masterleft + 180, 220, {id: 'grmei1', stroke: 'black', strokeWidth: 3});
    // svg.line(LINEGROUP, masterleft - 140, 200, masterleft - 140, 70, {id: 'grmei2', stroke: 'black', strokeWidth: 3});
    // svg.line(LINEGROUP, masterleft + 180, 200, masterleft + 180, 70, {id: 'grmei3', stroke: 'black', strokeWidth: 3});    



    // svg.text(masterleft - 120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'pattext'});
    // svg.text(masterleft + 120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'mattext'});


 if (personal_information.gender == 'MALE') {


        //Center Me
         var bar = svg.rect(masterleft+5, top, rr, rr).attr({fill: "slateblue"}); 
         bar.node.id = "me";
         bar.node.gender = "MALE";
         
        // svg.rect(masterleft+5, top, rr, rr, 1, 1, {
        //     id: 'me',
        //     genders: 'male',
        //     fill: 'slateblue',
        //     stroke: 'red',
        //     strokeWidth: 2,
        //     cursor: 'pointer'
        // });
        masterx = parseInt($('#me').attr('x'));
        mastery = parseInt($('#me').attr('y'));
    }
    else if (personal_information.gender == 'FEMALE') {
        var bar = svg.circle(masterleft + 25, Ftop, cr).attr({fill: "slateblue"}); 
         bar.node.id = "me";
         bar.node.gender = "FEMALE";

        // svg.circle(masterleft + 25, Ftop, cr, {
        //     id: 'me',
        //     genders: 'female',
        //     fill: 'slateblue',
        //     stroke: 'red',
        //     strokeWidth: 2,
        //     cursor: 'pointer'
        // });
        masterx = parseInt($('#me').attr('cx'));
        mastery = parseInt($('#me').attr('cy') - 20);
    }


  // LINEGROUP = svg.group({stroke: 'black', strokeWidth: 2});

// });




        // $.each(personal_information['Health History'], function (key, item) {
        //     if (item == 'undefined' || item == null) item = "";
        //     var dn = item['Disease Name'];
        //     var details =  item['Detailed Disease Name'] ;
        //     if(dn)dn = dn.toLowerCase();
        //     if(details)details = details.toLowerCase();
        //     if(details=='diseases:null') details = "";

        //     if($.inArray(details.toLowerCase(), STATICDISEASES) == -1) {
        //         if (diseasearray.length == 0) diseasearray.push([dn,details])
        //         else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])

        //     }
        // });

        // $.each(personal_information, function (key, item) {
        //     if (item == 'undefined' || item == null) item = "";
        //     if (item.id) {

        //         $.each(item['Health History'], function (k, data) {
        //             var dn = data['Disease Name'];
        //             var details =  data['Detailed Disease Name'];
        //             if(dn)dn = dn.toLowerCase();
        //             if(details)details = details.toLowerCase();
        //             if(details=='diseases:null') details = "";

        //             if($.inArray(details.toLowerCase(), STATICDISEASES) == -1) {
        //                 if (diseasearray.length == 0) diseasearray.push([dn,details])
        //                 else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])
        //             }
        //         });
        //     }
        // });


        

// alert ("diseasearray ARRAY Information:" + JSON.stringify(diseasearray, null, 2) );



        var HEADERS = new Array;
        HEADERS.push({"title":'Id'});
        HEADERS.push({"title":'Name & Relationship'});
        //HEADERS.push({"title":'Relationship'});
        HEADERS.push({"title":'Still Living, cause of death (age)'});

        for (var t = 0; t < STATICDISEASES.length; t++) {
            var NAME = STATICDISEASES[t];
            var COL = t + 3;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME.toLowerCase();

            /*
             Get only values that are not static
             */
            //if ($.inArray(NAME.toLowerCase(), STATICDISEASES) == -1){alert(NAME)}

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" height="16" class="closeimg"/></a>' + NAME
            });
        }

        for (var i = 0; i < diseasearray.length; i++) {
            var NAME = diseasearray[i][0];
            var COL = i + 9;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME.toLowerCase();

            /*
             Get only values that are not static
             */
            //if ($.inArray(NAME.toLowerCase(), STATICDISEASES) == -1){alert(NAME)}

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" height="16" style="padding-right: 5px;padding-top: 2px"/></a>' + NAME
            });
        }

        oTable = $('#health_table').dataTable({
            "bPaginate": true,
            //"scrollX": true,
            //"scrollY": "300px",
            //"sScrollY": "250px",
            "bAutoWidth": true,
            "bScrollCollapse": false,
            "bLengthChange": false,
            "bFilter": true,
            "displayLength": 100,
            "dom": '<"toolbar">Rlfrtip',
            //"dom": 'Rlfrtip','T<"clear">lfrtip',
            tableTools: {
                "aButtons": ["print"]
            },
            "columns": HEADERS,
            "columnDefs": [
                {
                    "targets": [0],
                    "visible": false,
                    "searchable": false
                }
            ],
            "aaSortingFixed": [[0, 'desc']]

        });

        $("div.toolbar").html(

            '<div id="lightbox">' +
            '<table id="bmi_table" class="htable">' +
            '<caption>My Personal Information</caption>' +
            '<tr><td id="age">Age:</td></tr>' +
            '<tr><td id="height">Height:</td></tr>' +
            '<tr><td id="weight">Weight:</td></tr>' +
            '<tr><td id="abmi">BMI:</td></tr>' +
            '</tr></table>' +
            '</div>'

            //'<b>Custom tool bar! Text/images etc.</b>'
        );

        $(function() {
            $(window).scroll(function(){
                var scrollTop = $(window).scrollTop();
                if(scrollTop != 0)
                    $('#nav').stop().animate({'opacity':'0.9'},400);
                else
                    $('#nav').stop().animate({'opacity':'1'},400);
            });
            $('#nav').hover(
                function (e) {
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop != 0){
                        $('#nav').stop().animate({'opacity':'1'},400);
                    }
                },
                function (e) {
                    var scrollTop = $(window).scrollTop();
                    if(scrollTop != 0){
                        $('#nav').stop().animate({'opacity':'0.9'},400);
                    }
                }
            );
        });
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
    var GrantPaternalArray = new Array();
    var GrantMaternalArray = new Array();
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

    //mdialog.dialog({ position: ['top', 20] });

    




// var svg = Raphael($("#svgframe"), 500,500);
//  // var svg = Raphael("paper", 500,500);
//     // var circle3 = svg.circle(13, 13, 10.5);
//     alert("raphael 0a")

//     svg.rect(200,100,90,40).attr({fill: "#4422ff"}); 
// alert("raphael 1")
//     // svg.rect(200,100,90,40).attr({fill: "#4422ff"}); 

    ToTop_Ie();
    setTimeout(
        function()
        {
            mdialog.dialog('open');
        }, 3000);


    alert("raphael %% 1")



    /*
     Start SVG
     */


    

    // $('#svgframe').svg();
    // svg = $('#svgframe').svg('get');
    var svg;
    var LINEGROUP;

$(document).ready(function() {

   function STARTRAP() {

    alert("raphael 0")
// CODE
 svg = Raphael($("#svgframe"), 500,500);
 // var svg = Raphael("paper", 500,500);
    // var circle3 = svg.circle(13, 13, 10.5);
    alert("raphael 0a")

    svg.rect(200,100,90,40).attr({fill: "red"}); 


alert("RAPHAEL 1")

alert("$$$ "+personal_information.gender)

  LINEGROUP = svg.group({stroke: 'black', strokeWidth: 2});




    $('#svgframe')
        .draggable();
    //.resizable();
    // var LINEGROUP = svg.group({stroke: 'black', strokeWidth: 2});

    //var TOPCLONE = svg.clone( null, rect1)[0];

    var svgw = mdialog.find('#svgframe')[0];
    svgw.setAttribute('height', '80%');
    svgw.setAttribute('valign', 'top');
    svgw.setAttribute('width', masterRight);
    svgw.setAttribute('margin-top', '5px');

    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 1, 1, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft - 120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'pattext'});
    svg.text(masterleft + 120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'mattext'});

    $('#optionsPanel').attr('width', '800px');

    svg.line(LINEGROUP, masterleft - 100, 220, masterleft + 120, 220, {id: 'mel', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'mei', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 25, 220, masterleft + 25, top, {id: 'grmei', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft - 140, 220, masterleft + 180, 220, {id: 'grmei1', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft - 140, 200, masterleft - 140, 70, {id: 'grmei2', stroke: 'black', strokeWidth: 3});
    svg.line(LINEGROUP, masterleft + 180, 200, masterleft + 180, 70, {id: 'grmei3', stroke: 'black', strokeWidth: 3});




    //Gender
    if (personal_information.gender == 'MALE') {


        //Center Me
        svg.rect(masterleft+5, top, rr, rr, 1, 1, {
            id: 'me',
            genders: 'male',
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
            genders: 'female',
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
        age = getAge_Ie(personal_information.date_of_birth);
    }

    var BMI = BMI_CALCULATE_IE(weight,height);
    if(typeof BMI == 'undefined' || BMI == null) {
        BMI = "";
    }

    $('#age').text = age;
    $('#age').append($("<span><b></b></span>").text(age));
    if(height != "") $('#height').append($("<span><b></b></span>").text( height + " " + height_unit));
    if(weight != "") $('#weight').append($("<span><b></b></span>").text( weight + " " + weight_unit));
    $('#abmi').append($("<span><b></b></span>").text( BMI));

    //Build health array
    /*
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
                ids.push([disname,disdet]);
                dis.push([disname,disdet]);
            });
            HEALTHARRAY.push(ids);
            if ($.inArray(dis, DISEASELISTARRAY) == -1) DISEASELISTARRAY.push(dis);
        }
    });
*/

    var ids = new Array();
    var dis = new Array();

    ids.push('me');
    ids.push(personal_information.name);

    $.each(personal_information['Health History'], function (k, data) {
        var disname = data['Disease Name'];
        var disdet = data['Detailed Disease Name'];
        ids.push([disname,disdet]);
        dis.push([disname,disdet]);
    });

/***********************/

HEALTHARRAY.push(ids);
    DISEASELISTARRAY.push(dis);

   
alert("11")

}

 });

/***********************/

    

    //alert ("HEALTHARRAY ARRAY Information:" + JSON.stringify(HEALTHARRAY, null, 2) );

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

    //alert ("personal_information Information:" + JSON.stringify(personal_information, null, 2) );



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
            GrantPaternalArray.push({"key": key, "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        if (key == 'maternal_grandmother' || key == 'maternal_grandfather') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            GrantMaternalArray.push({"key": key,  "id": id, "gender":item.gender});
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
                for (var d in GrantPaternalArray){
                    if(GrantPaternalArray[d].gender == 'FEMALE') var pid = GrantPaternalArray[d].id;
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
                for (var d in GrantPaternalArray){
                    if(GrantPaternalArray[d].gender == 'MALE') var pid = GrantPaternalArray[d].id;
                }
            }
            else pid = item.parent_id;

            array.push('PARENTALS');
            PaternalRelatives.push([item.gender, id, 'PU_' + key.substring(15, 16), pid]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            var id,pid;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            if (item.parent_id == "" || item.parent_id == null){
                for (var d in GrantMaternalArray){
                    if(GrantMaternalArray[d].gender == 'FEMALE') var pid = GrantMaternalArray[d].id;
                }
            }
            else pid = item.parent_id;

            array.push('MATERNALS');

            MaternalRelatives.push([item.gender, id, 'MA_' + key.substring(14, 15), pid]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            var id,pid;

            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            if (item.parent_id == "" || item.parent_id == null){
                for (var d in GrantMaternalArray){
                    if(GrantMaternalArray[d].gender == 'MALE') var pid = GrantMaternalArray[d].id;
                }
            }
            else pid = item.parent_id;

            array.push('MATERNALS');
            MaternalRelatives.push([item.gender, id, 'MU_' + key.substring(15, 16), pid]);
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
            var id,pid;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            var ITEMGEN = item.gender;
            if(typeof ITEMGEN == 'undefined') ITEMGEN = 'MALE';

            if (typeof item.parent_id == "undefined" || item.parent_id == "" || item.parent_id == null) pid = 'maternal_uncle' + rand;
            else pid = item.parent_id;

            MaternalCousinArray.push([ITEMGEN, id, key, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [ITEMGEN], key: [key]};
            NAMEARRAY.push(t);
            //alert ("MaternalCousinArray ARRAY Information:" + JSON.stringify(MaternalCousinArray, null, 2) );

        }
        else if (key.substring(0, 15) == "paternal_cousin") {
            var id,pid;
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
    if ($('#' + pid).attr('genders') == 'male') {
        p1 = parseInt($('#' + pid).attr('x'));
        p2 = parseInt($('#' + pid).attr('y'));
    }
    if ($('#' + pid).attr('genders') == 'female') {
        p1 = parseInt($('#' + pid).attr('cx'));
        p2 = parseInt($('#' + pid).attr('cy'));
    }

    //Are children involved?
    if (ChildrenArray.length > 0) CHILDREN_MAIN_LOAD_IE();
    //Are grandchildren involved?
    if (GrandChildrenArray.length > 0) GRANDCHILDREN_MAIN_LOAD_IE();


    //Begin process
    $.each(personal_information, function (key, item) {
        var pstart,pend,mstart,mend;

        //var mleft = parseInt(masterleft) - 185;
        pend = parseInt(masterleft) - 220;
        pstart = parseInt(masterleft) - 75;
        mend = parseInt(masterleft) + 245;
        mstart = parseInt(masterleft) + 100;


        if (key == 'paternal_grandmother') {
            var id = item['id'];
            if (id == "" || id == null){
                for (var d in GrantPaternalArray){
                    if(GrantPaternalArray[d].gender == 'FEMALE')  id = GrantPaternalArray[d].id;
                }
            }

            svg.circle(pstart, 70, cr, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
            });

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key == 'paternal_grandfather') {
            var id = item['id'];
            if (id == "" || id == null){
                for (var d in GrantPaternalArray){
                    if(GrantPaternalArray[d].gender == 'MALE')  id = GrantPaternalArray[d].id;
                }
            }


            svg.rect(pend, 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
            });


            svg.line(LINEGROUP, parseInt(pend)-0, Level1F, parseInt(pstart)+20, Level1F, {id:'Ln_'+id , stroke: 'black',strokeWidth: 3});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }



        //Paternal Grand Parents
        if (key == 'maternal_grandmother') {
            //var mleft = parseInt(masterleft) + 200;
            var id = item['id'];

            if (id == "" || id == null){
                for (var d in GrantMaternalArray){
                    if(GrantMaternalArray[d].gender == 'FEMALE')  id = GrantMaternalArray[d].id;
                }
            }

            svg.circle(parseInt(mend), 70, cr, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
            });

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key == 'maternal_grandfather') {
            //var mleft = parseInt(masterleft) + 60;
            var id = item['id'];

            if (id == "" || id == null){
                for (var d in GrantMaternalArray){
                    if(GrantMaternalArray[d].gender == 'MALE')  id = GrantMaternalArray[d].id;
                }
            }

            svg.rect(parseInt(mstart), 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
            });

            svg.line(LINEGROUP, parseInt(mend)-0, Level1F, parseInt(mstart)+20, Level1F, {id:'Ln_'+id , stroke: 'black',strokeWidth: 3});

            //SPOUCE_CONNECT_IE(id);
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }

        //Father
        if (key == 'father') {
            var mleft = parseInt(masterleft) - 160;
            var id = item['id'];
            if (id == "" || id == null) id = FatherArray[0].id;

            svg.rect(parseInt(mleft), 200, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
            });
            svg.line(LINEGROUP, parseInt(mleft) + 20, 170, parseInt(mleft) + 20, 200, {id: 'Ln_'+id, stroke: 'black',strokeWidth: 3});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }

        //Mother
        if (key == 'mother') {
            var mleft = masterleft + 180;
            var id = item['id'];
            if (id == "" || id == null) id = MotherArray[0].id;

            svg.circle(mleft, 220, cr, {
                id: id,
                fill: gencolor,
                stroke: 'black',
                strokeWidth: 2,
                cursor: 'pointer',
                genders: item.gender
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

                if ($('#' + pid).attr('genders') == 'male') {
                    p1 = parseInt($('#' + pid).attr('x'));
                    p2 = parseInt($('#' + pid).attr('y'));
                }
                if ($('#' + pid).attr('genders') == 'female') {
                    p1 = parseInt($('#' + pid).attr('cx'));
                    p2 = parseInt($('#' + pid).attr('cy'));
                }

                //Width
                pw = parseInt($('#' + pid).attr('width'));
                if (no == "0") {
                    sl = p1 - 20;
                    right_end_line_ie(p1, p2, r, pw);
                    nieces_ie(no, p1, p2, pid, mid);
                }
                else {
                    sl = sl + 80;
                    right_end_line_ie(p1, p2, sl, pw);
                    nieces_ie(no, p1, p2, pid, mid);
                }
            }
        }
        else {

        }

        var pos = 850;
        var k = svg.group({stroke: 'red', strokeWidth: 2, 'z-index': '9999'});

        var skip = 650;
        var skipa = 550;

        //Index keys
        svg.rect(parseInt(skipa) - 30, 40 + pos, 980+150, 100, 1, 1, {
            id: 'panel',
            fill: 'none',
            stroke: 'slategray',
            strokeWidth: 1
        });

        var kcr = 21;
        var krr = 40;


        //Adopted
        svg.text(10+skipa, 30 + pos, "Adopted", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f1text'});
        svg.circle(0+skipa, 95 + pos, kcr, {id: 'afd', fill: 'palegoldenrod', stroke: 'black', strokeWidth: 2});
        svg.rect(50+skipa, 74 + pos, krr, krr, 1, 1, {id: 'ama', fill: 'palegoldenrod', stroke: 'black', strokeWidth: 3});

        //Live
        svg.text(100+skip, 30 + pos, "Alive", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f2text'});
        svg.circle(75+skip, 95 + pos, kcr, {id: 'kfd', fill: gencolor, stroke: 'black', strokeWidth: 2});
        svg.rect(120+skip, 74 + pos, krr, krr, 1, 1, {id: 'kma', fill: gencolor, stroke: 'black', strokeWidth: 3});

        //Deceased
        svg.text(270+skip, 30 + pos, "Deceased", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f3text'});
        svg.circle(270+skip, 95 + pos, kcr, {id: 'kf', fill: gencolor, stroke: 'black', strokeWidth: 2});
        svg.rect(325+skip, 74 + pos, krr, krr, 1, 1, {id: 'kmd', fill: gencolor, stroke: 'black', strokeWidth: 2});

        svg.text(470+skip, 30 + pos, "A non-blood relative or relative through marriage.", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f4text'});
        svg.rect(570+skip, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: gencolor, stroke: 'black', strokeWidth: 2});
        svg.circle(690+skip, 95 + pos, kcr, {id: 'ex', fill: 'white', stroke: 'black', strokeWidth: 2});
        svg.line(LINEGROUP, 570+skip,  95 + pos, 690+skip,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        svg.circle(820+skip, 95 + pos, kcr, {id: 'ex', fill: gencolor, stroke: 'black', strokeWidth: 2});
        svg.rect(900+skip, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: 'white', stroke: 'black', strokeWidth: 2});
        svg.line(LINEGROUP, 820+skip,  95 + pos, 900+skip,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        //Set live status
        circlestatus_ie('kf');
        rectstatus_ie('kmd');

    });

    SINGLEGROUPS = COUNT_SINGLE_GROUPS_IE(ChildrenArray);
    GRANDSGROUP = COUNT_GROUPS_IE(GrandChildrenArray);
    SISTERSGROUP = COUNT_GROUPS_IE(SistersArray);

    //Load Brothers
    BROTHERS_LOAD_IE();
    //Load Sisters
     SISTERS_LOAD_IE();
    //Load Half Brothers
    PATERNAL_HALF_SIBLINGS_LOAD_IE();
    //Load Half Brothers
     MATERNAL_HALF_SIBLINGS_LOAD_IE();
    //Load Maternal Uncle/Aunt
    MATERNALS_MAIN_LOAD_IE();
    //Load Paternal Uncle/Aunt
    PATERNALS_MAIN_LOAD_IE();
    //Load Nephews
    NEPHEWS_LOAD_IE();
    //Load paternal Cousins
    PATERNAL_COUSINS_LOAD_IE();
    //Load Maternal Cousins
    MATERNAL_COUSINS_LOAD_IE();

    /*
     Tables and other information tools
     */
    LOAD_NAMES_IE(NAMEARRAY);

    ADOPTED_FAMILY_IE();

    $( "#printer" ).click(function() {

        $('#svgframe').draggable('disable');
        $('#topsvg').css('overflow', 'hidden');

        $('.sticky').hide();
        $('.closeimg').hide();
        $('#health_table_filter').hide();
        $('#health_table_info').hide();
        $('#health_table_paginate').hide();

        var container = $(mdialog);
        var tableelement = $( "table" );
        var TABLE = $( container ).find( tableelement );
        var svgelement = $( "svg" );
        var SVG = $( container ).find( svgelement );
        var w = $('#svgframe').attr('width');
        var h = $('#svgframe').attr('height');

        //var printContent = document.getElementById('svgframe');

        var windowUrl = 'about:blank';
        var uniqueName = new Date();
        var windowName = 'Print' + uniqueName.getTime();

        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
            $('#dialogtext').hide();
            var DocumentContainer = $(mdialog);
            var WindowObject = window.open('', "Print", "width=800,height=700,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no");
            WindowObject.document.writeln('<!DOCTYPE html>'
            + '<html><head><title>MFHP|Disease Matrix</title>'
            +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
            + $(DocumentContainer).html()
            + '</head><body>');
            WindowObject.document.close();
            WindowObject.focus();
            WindowObject.print();
            WindowObject.close();

            var timer = setInterval(function() {
                if( WindowObject.closed) {
                    clearInterval(timer);
                    $('.sticky').show();
                    $('#dialogtext').show();
                    $('.closeimg').show();
                    $('#health_table_filter').show();
                    $('#health_table_info').show();
                    $('#health_table_paginate').show();
                    $('#svgframe').draggable('enable');
                    $('#topsvg').css('overflow', 'visible');
                }
            }, 1000);
        }
        else {
            originalContents = document.body.innerHTML;
            $('#dialogtext').hide();
            var myWindow=window.open('','Print','width=900,height=900,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no');

            var container = $(mdialog);
            //var diaelem = $('#svgframe').clone();
            //var diaelem = $('#topsvg').clone();


            //var rotation = 90;
            //$(diaelem).css({'-webkit-transform' : 'rotate('+ rotation +'deg)',
            //    '-moz-transform' : 'rotate('+ rotation +'deg)',
            //    '-ms-transform' : 'rotate('+ rotation +'deg)',
            //    'transform' : 'rotate('+ rotation +'deg)'});

            var infoelem = $('#family_pedigree_info');

            //transform = "rotate(-45 100 100)"
            //$(diaelem).attr('transform','rotate(-90 100 100)')

            infoelem.attr('class','page-break');


            $('#topsvg').attr('class','landscape');
            //$(diaelem).addClass("landscape");

            $('#topsvg').attr('height',masterHeight);
            $('#topsvg').attr('margin-top',10);


            myWindow.document.write('<!DOCTYPE html>'
            + '<html><head><title>MFHP|Disease Matrix|</title>'
            +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'

                //+ $(diaelem).html()
                //+ $(infoelem).html()
            + $(container).html()

            + '</head><body>');

            myWindow.focus();
            myWindow.print();
            myWindow.close();


            var timer = setInterval(function() {
                if( myWindow.closed) {
                    clearInterval(timer);
                    $('.sticky').show();
                    $('#dialogtext').show();
                    $('.closeimg').show();
                    $('#health_table_filter').show();
                    $('#health_table_info').show();
                    $('#health_table_paginate').show();
                    infoelem.attr('class','family_pedigree_info');

                    $('#svgframe').draggable('enable');
                    $('#topsvg').css('overflow', 'visible');
                    $('#topsvg').attr('class','');
                }
            }, 1000);
        }
    });

    //function printDiv(elementId) {
    //    var popUpAndPrint = function()
    //    {
    //        var container = $('#topsvg');
    //        var svgframe = $('svgframe');
    //
    //        var width = $('#svgframe').attr('width');
    //        var height = $('#svgframe').attr('height');
    //
    //
    //        //var width = parseFloat(svgframe.getAttribute("width"))
    //        //var height = parseFloat(svgframe.getAttribute("height"))
    //        var printWindow = window.open('', 'PrintMap',
    //            'width=' + width + ',height=' + height);
    //        printWindow.document.writeln(
    //            '<!DOCTYPE html>'
    //            + '<html><head><title>Disease Matrix</title>'
    //            +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
    //            + $(container).html()
    //                //+ printContents
    //            + '</head><body>'
    //            //$(container).html()
    //        );
    //        printWindow.document.close();
    //        printWindow.print();
    //        printWindow.close();
    //    };
    //    setTimeout(popUpAndPrint, 500);
    //}
    //
    //
    //function printDivA(divName) {
    //    var printContents = $(mdialog).find('svg');
    //
    //    var originalContents = document.body.innerHTML;
    //
    //    document.body.innerHTML = '<!DOCTYPE html>'
    //    + '<html><head><title>Disease Matrix</title>'
    //    +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
    //    + $(printContents).html()
    //        //+ printContents
    //    + '</head><body>';
    //
    //    //document.body.innerHTML = printContents;
    //
    //    window.print();
    //
    //    document.body.innerHTML = originalContents;
    //}




    //Qtip app
    $.each(HEALTHARRAY, function (key, value) {
        var temp = "";
        var e, name;

//alert ("HEALTHARRAY ARRAY Information:" + JSON.stringify(HEALTHARRAY, null, 2) );


        for (var item in value) {
            e = value[0];
            name = value[1];

            if (value.length > 1 && item != 0 && item != 1) temp = temp + '<li>' + value[item] + '</li>';
            else  temp + '<li> No Disease Report </li>';
        };

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
                event: 'mouseover',
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
                    $('#' + e).attr('stroke', 'black');
                }
            },
            style: {
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
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 20) == "paternal_halfbrother") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 20) == "maternal_halfbrother") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 6) == "sister") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 19) == "paternal_halfsister"){
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 19) == "maternal_halfsister") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 13) == "paternal_aunt") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 13) == "paternal_aunt") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 6) == "nephew") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 5) == "niece") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 15) == "maternal_cousin") {
            if (typeof item.estimated_death_age != 'undefined') {
                if(item.gender == 'FEMALE')circlestatus_ie(item['id']);
                else rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 15) == "paternal_cousin") {
            if (typeof item.estimated_death_age != 'undefined') {
                if(item.gender == 'FEMALE')circlestatus_ie(item['id']);
                else rectstatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 8) == "daughter") {
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus_ie(item['id']);
            }
        }
        else if (key.substring(0, 3) == "son") {
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus_ie(item['id']);
            }
        }
    });


    function LOAD_NAMES_IE(NAMEARRAY) {
        var k;
        var dis = new Array();
        $.each(NAMEARRAY, function () {
            //$(NAMEARRAY).each(function() {
            var temp = new Array();
            var ID = this.id;
            var NAME = this.name;
            var GEN = this.gender;
            var TITLE = this.key.toString();
            var p1, p2, name1, name2,rel;

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
                var splits = new Array();

                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;

                    //alert(TITLE + " %% " +TITLE.toString().indexOf('_'))
                    if(TITLE.indexOf('_')>0){
                        splits = TITLE.split('_');
                        if (splits[0] == 'paternal' || splits[0] == 'maternal')rel = splits[1];
                        else rel = splits[0];
                    }
                    else rel = TITLE;

                    var REL = '[' + rel + ']';
                    temp = NAME.toString().split(' ');

                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {id:'name2_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 40, REL, {id:'rel_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'navy'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID,  'class': 'namebox',fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, REL, {id:'rel_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'navy'});
                    }
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) - 0;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;
                    if(TITLE.indexOf('_')>0) {
                        splits = TITLE.split('_');
                        if (splits[0] == 'paternal' || splits[0] == 'maternal')rel = splits[1];
                        else rel = splits[0];
                    }
                    else rel = TITLE;

                    var REL = '[' + rel + ']';

                    temp = NAME.toString().split(' ');
                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID,  'class': 'namebox',fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {id:'name2_'+ID,  'class': 'namebox',fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 40, REL, {id:'rel_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'navy'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {id:'name1_'+ID,  'class': 'namebox',fontWeight: 'bold', fill: 'red'});
                        svg.text(p1, p2 + 20, REL, {id:'rel_'+ID,  'class': 'namebox', fontWeight: 'bold', fill: 'navy'});
                    }
                }
            }

        });
    }


    //function LOAD_HEALTH(HEALTHARRAY){
    //
    //    $.each(personal_information, function (key, item) {
    //        var ID = item.id;
    //        var NAME = item.name;
    //        var GEN = item.gender;
    //        var r = 0;
    //
    //        if (typeof ID != 'undefined' && ID != null) {
    //
    //            if(NAME !="") var r = 30;
    //            else var r = 0;
    //
    //            //var GEN = $('#'+ID).attr('genders').toUpperCase();
    //
    //            if (GEN == 'FEMALE') {
    //                p1 = $('#' + ID).attr("cx") - 30;
    //                p2 = parseInt($('#' + ID).attr("cy")) + 60;
    //            }
    //            else {
    //                p1 = $('#' + ID).attr("x") - 10;
    //                p2 = parseInt($('#' + ID).attr("y")) + 75;
    //            }
    //
    //            $.each(item['Health History'], function (k, data) {
    //                var disname = data['Disease Name'];
    //                var detdisname = data['Detailed Disease Name'];
    //                if(detdisname!=null) {
    //                    var ln = detdisname.length;
    //                    var F3 = disname.substr(0, 3);
    //                    var L2 = detdisname.substr(ln - 2, ln).toUpperCase();
    //                }
    //                var Abr = F3+L2;
    //                BUILDSVGLIST(Abr,r);
    //
    //                r = r + 20;
    //            });
    //        }
    //    });
    //
    //    var r = 30;
    //
    //    var GEN = $('#me').attr('genders').toUpperCase();
    //
    //    if (GEN == 'FEMALE') {
    //        p1 = $('#me').attr("cx") - 30;
    //        p2 = parseInt($('#me').attr("cy")) + 60;
    //    }
    //    else {
    //        p1 = $('#me').attr("x") - 10;
    //        p2 = parseInt($('#me').attr("y")) + 75;
    //    }
    //
    //    $.each(personal_information['Health History'], function (k, data) {
    //
    //        var disname = data['Disease Name'];
    //        var detdisname = data['Detailed Disease Name'];
    //        if(detdisname!=null) {
    //            var ln = detdisname.length;
    //            var F3 = disname.substr(0, 3);
    //            var L2 = detdisname.substr(ln - 2, ln).toUpperCase();
    //        }
    //        var Abr = F3+L2;
    //        BUILDSVGLIST(Abr,r);
    //        r = r + 20;
    //    });
    //}





    //function BUILD_DISEASE_LIST(){
    //    var pos = 850;
    //    var cr = 25;
    //    var ident="";
    //    var array = new Array();
    //
    //    $.each(personal_information['Health History'], function (k, data) {
    //        var disname = data['Disease Name'];
    //        var detdisname = data['Detailed Disease Name'];
    //        var ln = detdisname.length;
    //
    //        var F3 = disname.substr(0,3);
    //        var L2 = detdisname.substr(ln - 2,ln).toUpperCase();
    //
    //        var Abr = F3+L2;
    //
    //        if ($.inArray(Abr, array) == -1) {
    //            array.push(Abr);
    //            if (detdisname == null)ident = disname;
    //            else ident = detdisname;
    //            var identInfo = Abr + " = " + ident;
    //
    //            if (cr == 25) {
    //                $('#itempanel').attr('height', cr + 85);
    //                var f2 = pos + cr;
    //                var t2 = f2 + 25;
    //                cr = cr + 25;
    //                svg.rect(1100, pos, 550, 100, 3, 3, {
    //                    id: 'itempanel',
    //                    fill: 'none',
    //                    stroke: 'slategray',
    //                    strokeWidth: 1
    //                });
    //
    //                svg.text(1150, t2, identInfo, {
    //                    id: Abr,
    //                    fontWeight: 'bold',
    //                    fontSize: '22.5',
    //                    fill: 'slategray'
    //                });
    //            }
    //            else {
    //                var f2 = pos + cr;
    //                var t2 = f2 + 25;
    //                cr = cr + 25;
    //                $('#itempanel').attr('height', cr);
    //                svg.text(1150, t2, identInfo, {
    //                    id: Abr,
    //                    fontWeight: 'bold',
    //                    fontSize: '22.5',
    //                    fill: 'slategray'
    //                });
    //            }
    //        }
    //    });
    //
    //    $.each(personal_information, function (key, item) {
    //        if (item['Health History']) {
    //            var health = new Array();
    //            health = item['Health History'];
    //            $.each(health, function (k, data) {
    //                var disname = data['Disease Name'];
    //                var detdisname = data['Detailed Disease Name'];
    //                var ln = detdisname.length;
    //
    //                var F3 = disname.substr(0,3);
    //                var L2 = detdisname.substr(ln - 2,ln).toUpperCase();
    //
    //                var Abr = F3+L2;
    //
    //                if ($.inArray(Abr, array) == -1) {
    //                    array.push(Abr);
    //                    if (detdisname == null)ident = disname;
    //                    else ident = detdisname;
    //                    var identInfo = Abr + " = " + ident;
    //
    //                    if (cr == 25) {
    //                        $('#itempanel').attr('height', cr + 85);
    //                        var f2 = pos + cr;
    //                        var t2 = f2 + 25;
    //                        cr = cr + 25;
    //                        svg.rect(1100, pos, 550, 100, 3, 3, {
    //                            id: 'itempanel',
    //                            fill: 'none',
    //                            stroke: 'slategray',
    //                            strokeWidth: 1
    //                        });
    //
    //                        svg.text(1150, t2, identInfo, {
    //                            id: Abr,
    //                            fontWeight: 'bold',
    //                            fontSize: '22.5',
    //                            fill: 'slategray'
    //                        });
    //                    }
    //                    else {
    //                        var f2 = pos + cr;
    //                        var t2 = f2 + 25;
    //                        cr = cr + 25;
    //                        $('#itempanel').attr('height', cr);
    //                        svg.text(1150, t2, identInfo, {
    //                            id: Abr,
    //                            fontWeight: 'bold',
    //                            fontSize: '22.5',
    //                            fill: 'slategray'
    //                        });
    //                    }
    //                }
    //            });
    //        }
    //    });
    //
    //    $('#itempanel').attr('height',cr + 55);
    //
    //}

    //function BUILDSVGLIST(Abr,r){
    //    svg.text(p1, parseInt(p2) + r, ' - ' + Abr, {
    //        fill: 'black',
    //        stroke: 'black',
    //        'stroke-width': '0.5',
    //        lengthAdjust: 'spacingAndGlyphs',
    //        'class': 'infobox'
    //    });
    //    return;
    //}

    //function left_line(pid, mid, mode) {
    //    var t1x, t1y, t2, t3, l1, l2;
    //
    //    var tid = $('#' + pid).attr('id');
    //    var points = $('#P_' + pid).attr('points');
    //    if (typeof points != 'undefined') {
    //        points = points.split(' ')[2].split(',');
    //        t2 = points[0];
    //        t3 = points[1];
    //    }
    //
    //    //Confirm target
    //    if ($('#' + mid).attr('genders') == 'male') {
    //        t1x = parseInt($('#' + mid).attr('x'));
    //        t1y = parseInt($('#' + mid).attr('y'));
    //    }
    //    if ($('#' + mid).attr('genders') == 'female') {
    //        t1x = parseInt($('#' + mid).attr('cx'));
    //        t1y = parseInt($('#' + mid).attr('cy'));
    //    }
    //
    //    //Confirm parent
    //    if ($('#' + pid).attr('genders') == 'male') {
    //        l1 = parseInt($('#' + pid).attr('x'));
    //        l2 = parseInt($('#' + pid).attr('y'));
    //    }
    //    if ($('#' + pid).attr('genders') == 'female') {
    //        l1 = parseInt($('#' + pid).attr('cx'));
    //        l2 = parseInt($('#' + pid).attr('cy'));
    //    }
    //
    //    swapline(pid, l1, l2, t1x, t1y, t2, t3, mode, 'left')
    //}


    //Draws connecting polyline rect
    //function connect_rect_line(a1, a2, no) {
    //    svg.polyline(
    //        [
    //            [parseInt(a1) + 20, parseInt(a2) + 100],
    //            [parseInt(a1) + 20, parseInt(a2) + 85],
    //            [parseInt(a1) + 80, parseInt(a2) + 85],
    //            [parseInt(a1) + 80, parseInt(a2) + 100]
    //        ],
    //        {fill: 'none', stroke: 'green', strokeWidth: 3});
    //}

    //Draws connecting polyline circle
    function connect_circle_line_ie(a1, a2, no) {
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
    //function left_end_line(p1, p2, c, pw) {
    //    var col = parseInt(c - p1);
    //    svg.polyline(
    //        [
    //            [parseInt(p1) + pw / 2, parseInt(p2)],
    //            [parseInt(p1) + pw / 2, parseInt(p2) - 20],
    //            [parseInt(p1) + col, parseInt(p2) - 20],
    //            [parseInt(p1) + col, parseInt(p2) + 20]
    //        ],
    //        {fill: 'none', stroke: 'black', strokeWidth: 3});
    //}

    //Draws ending polyline to the right side of the diagram
    function right_end_line_ie(p1, p2, c, pw) {
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


    //function polyline(p1, p2) {
    //    svg.polyline(
    //        [
    //            [parseInt(p1) + 105, parseInt(p2) + 110],
    //            [parseInt(p1) + 105, parseInt(p2) + 90],
    //            [parseInt(p1) + 170, parseInt(p2) + 90],
    //            [parseInt(p1) + 170, parseInt(p2) + 110]
    //        ],
    //        {fill: 'none', stroke: 'black', strokeWidth: 3});
    //}

    //Build active statuses for deceosed
    function circlestatus_ie(id) {
        var p1 = $('#' + id).attr('cx');
        var p2 = $('#' + id).attr('cy');
        svg.polyline([[parseInt(p1) - 17, parseInt(p2) + 12], [parseInt(p1) + 18, parseInt(p2) - 15]],
            {fill: 'none', stroke: 'red', strokeWidth: 3});
        return false;
    }

    function rectstatus_ie(id) {
        var p1 = $('#' + id).attr('x');
        var p2 = $('#' + id).attr('y');
        svg.polyline([[parseInt(p1 - 0), parseInt(p2) + 40], [parseInt(p1) + 40, parseInt(p2) - 0]],
            {fill: 'none', stroke: 'red', strokeWidth: 3});
        return false;
    }

    //Collect the daughters
    //function daughters(no, d1, d2, pid, mid) {
    //    //Prevent too many hooks
    //    $.each(daughter1, function (key, value) {
    //        //Prevent too many hooks
    //        if ((parseInt(no)) < key) connect_circle_line_ie(d1, d2, no);
    //
    //        var temp = "";
    //        var e = "";
    //
    //        for (var item in value) {
    //            e = value[0];
    //            if (e == mid) {
    //
    //                a1 = parseInt(d1) + (parseInt(no) * 60);
    //                svg.circle(d1, parseInt(d2) + 125, cr, {
    //                    id: mid,
    //                    fill: gencolor,
    //                    stroke: 'black',
    //                    strokeWidth: 2,
    //                    genders: 'female',
    //                    cursor: 'pointer'
    //                });
    //                return;
    //            }
    //        }
    //        ;
    //    });
    //}

    //Parse Maternals Load
    function CHILDREN_MAIN_LOAD_IE() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var DATA = new Array();

        //NephewArray.sort( SortByName_IE);
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
            var cnr = COUNT_KIDS_IE(GrandChildrenArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            DATA.push({"id": id, "value": [midgen, mid, 'me'], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        DATA = DATA.sort(SortByNr_IE);
        CHILDREN_LOAD_IE(DATA);
    }


    //Collect the children
    function CHILDREN_LOAD_IE(ARRAY) {

        var thatElement = svg.getById("me");

        alert(thatElement)

var ME = document.getElementById('me');

        var MIDGEN = $(ME).attr("genders")
        alert(MIDGEN);

        var xl = new Array();
        var P1 = new Array();

        var TOTALKIDS = COUNT_FAMILY_KIDS_IE(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS_IE(ChildrenArray);

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
                var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
                var p1temp = new Array();

                if (p == 0) {
                    var DATAKEY = ARRAY[p].id;
                    var ps = CHILD_START_LINE_IE(PIDGEN,PID);
                    var p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID, CNR);
                    P1.push(p1temp);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1+25, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1+45, Level4F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
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
                        if(PREVIOUSCNR==1) {

                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 20 + (parseInt(PREVIOUSCNR) * 140);
                            else  var p1 = parseInt(PREVIOUSP1) + 20  + (parseInt(PREVIOUSCNR) * 160);

                            //var p1 = parseInt(PREVIOUSP1) + (parseInt(PREVIOUSCNR) * 180)
                        }
                        else if(PREVIOUSCNR>1) {
                            if (PREVIOUSGEN == 'MALE') var p1 = parseInt(PREVIOUSP1) + 20 + (parseInt(PREVIOUSCNR) * 80);
                            else  var p1 = parseInt(PREVIOUSP1) + 20  + (parseInt(PREVIOUSCNR) * 100);
                        }
                    }





                    p1temp.push(MIDGEN, MID, p1, PID, CNR);
                    P1.push(p1temp);

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }

                }

            }
        }
//Load my spouce
        LOAD_SPOUCE_MATERNAL_IE('me', $('#me').attr("genders"))
        CHILD_START_LINE_IE(ChildrenArray, 'ctest');
    }


    //Load paternal cousins
    function GRANDCHILDREN_MAIN_LOAD_IE() {

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

//alert ("GrandChildrenArray ARRAY Information:" + JSON.stringify(GrandChildrenArray, null, 2) );


        GrandChildrenArray = GrandChildrenArray.sort( SortById_IE);
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
        GRANDCHILDREN_LOAD_IE(DATAARRAY);
    }

    function GRANDCHILDREN_LOAD_IE(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("GRANDCHILDREN_LOAD_IE ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level5M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level5F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);
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
                    ps = RIGHT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level5M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level5F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    ps = RIGHT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level5M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level5M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level5F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];


                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level5M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level5F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }


        CONNECTOR_IE(ARRAY,'TEST');


    }


    //Collect the grandchildren
    //function GRANDCHILDREN_LOADXX(d1, d2, pid) {
    //    var MIDGEN = $('#me').attr("genders")
    //    ////Load my spouce
    //    //LOAD_SPOUCE_MATERNAL_IE('me', $('#me').attr("class"))
    //
    //    //alert ("GrandChildrenArray ARRAY Information:" + JSON.stringify(GrandChildrenArray, null, 2) );
    //
    //
    //    if(GrandChildrenArray.length==0) return;
    //    //Prevent too many hooks
    //    if (GrandChildrenArray.length > 1) {
    //
    //        $.each(GrandChildrenArray, function (key, value) {
    //            var temp = "";
    //            var id = "";
    //            //for (var item in value) {
    //            var MIDGEN = value[0];
    //            var MID = value[1];
    //            var PID = value[2];
    //            if (MID == "" || MID == null) MID = 'gchl_' + key;
    //            //Load my spouce
    //            LOAD_SPOUCE_MATERNAL_IE(PID, $('#'+PID).attr("genders"));
    //            var ps =  SPOTLINE_IE(PID);
    //            var p1 = ps[0];
    //
    //
    //            if(key==0){
    //                if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, p1 + 45, Level4M + 20, p1 + 45, Level4M + 120, {
    //                    id: 'gchilds',
    //                    stroke: 'black',strokeWidth: 3
    //                });
    //                else svg.line(LINEGROUP, p1 + 45, Level4F + 0, p1 + 45, Level4F + 120, {
    //                    id: 'gchilds',
    //                    stroke: 'black',strokeWidth: 3
    //                });
    //            }
    //
    //            if (key == 0) p1 = parseInt(p1);
    //            else p1 = parseInt(p1) - 20 - (parseInt(key) * 60);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(p1 + 50, Level5F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
    //        });
    //    }
    //    else {
    //        $.each(GrandChildrenArray, function (key, value) {
    //            var temp = "";
    //            var id = "";
    //            //for (var item in value) {
    //            var MIDGEN = value[0];
    //            var MID = value[1];
    //            var PID = value[2];
    //            var PIDGEN = $('#'+PID).attr("genders")
    //            if (MID == "" || MID == null) MID = 'gchl_' + key;
    //            //Load my spouce
    //            LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);
    //
    //
    //
    //            var ps =  SPOTLINE_IE(PID);
    //            var p1 = ps[0];
    //
    //            if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, p1 + 45, Level4M + 20, p1 + 45, Level4M + 120, {
    //                id: 'gchilds',
    //                stroke: 'black',strokeWidth: 3
    //            });
    //            else svg.line(LINEGROUP, p1 + 45, Level4F + 25, p1 + 45, Level4F + 120, {id: 'gchilds', stroke: 'black',strokeWidth: 3});
    //            //single_straight_parent_child_connection(MIDGEN,Level5M,p1,'grchild')
    //
    //            //if(MIDGEN=='MALE') sigle_strait_parent_child_connection(PIDGEN,Level5M,p1,'gchild');
    //            //else sigle_strait_parent_child_connection(PIDGEN,Level5F,p1,'gchild');
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(p1 + 45, Level5F - 20, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M - 20, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
    //        });
    //
    //    }
    //
    //
    //    OBJECTS_CONNECT_IE(GrandChildrenArray, 'grands');
    //}


    //function single_straight_parent_child_connection(GEN,LEVEL,P1,TEMPLATE){
    //    if (GEN.toUpperCase() == "MALE")svg.line(LINEGROUP, parseInt(P1) + 45, parseInt(LEVEL) + 0, P1 + 45, parseInt(LEVEL) + 130, {
    //        id: TEMPLATE,
    //        stroke: 'black'
    //    });
    //    else svg.line(LINEGROUP, parseInt(P1) + 45, parseInt(LEVEL) + 20, parseInt(P1) + 45, parseInt(LEVEL) + 130, {id: TEMPLATE, stroke: 'black'});
    //
    //}


    //Collect the children
    //function CHILDREN_LOADAA(d1, d2, pid) {
    //    var PID = 'me';
    //    var PIDGEN = $('#me').attr("genders")
    //    //Load my spouce
    //    LOAD_SPOUCE_MATERNAL_IE('me', $('#me').attr("genders"))
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
    //            single_right_parent_child_connector_ie(PID,MID,MIDGEN,PIDGEN,Level4F);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(p1 + 50, Level4F, cr, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level4M, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
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
    //            var ps =  SPOTLINE_IE(PID);
    //
    //            single_right_parent_child_connector_ie(PID,MID,MIDGEN,PIDGEN,Level4F);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(ps[0] + 65, Level4F - 20, cr, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(ps[0] + 20, Level4M - 20, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
    //        });
    //
    //
    //
    //    }
    //
    //    OBJECTS_CONNECT_IE(ChildrenArray, 'ctest');
    //
    //}

    //Collect the nieces_ie
    function nieces_ie(no, a1, a2, pid, mid) {
        //Prevent too many hooks
        $.each(niecearray, function (key, value) {

            //Prevent too many hooks
            if ((parseInt(no)) < key) connect_circle_line_ie(a1, a2, no);

            var temp = "";
            var e = "";

            for (var item in value) {
                e = value[0];

                if (e == mid) {
                    a1 = parseInt(a1) + (parseInt(no) * 50);

                    svg.circle(a1, a2 + 100, cr, {
                        id: mid,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                    return;
                }};
        });
    }

    //Parse Paternals Load
    function PATERNALS_MAIN_LOAD_IE() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();

        //NephewArray.sort( SortByName_IE);
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
            //Do candidate have children
            var cnr = COUNT_KIDS_IE(PaternalCousinArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            PATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr, "sid": [sidgen,sid]});
            pnr = pnr + 1;
        }
        //SORT
        PATERNALDATA = PATERNALDATA.sort(SortByNr_IE);

        PATERNALS_LOAD_IE(PATERNALDATA);
    }

    //Load paternal aunt / uncle
    function PATERNALS_LOAD_IE(ARRAY) {
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

        var BROTHERS = COUNT_FAMILY_KIDS_IE(BrothersArray);
        var NEPHEWS = COUNT_FAMILY_KIDS_IE(NephewArray);
        var PATERNALHALFS = COUNT_FAMILY_KIDS_IE(PaternalHalfSiblingsArray);
        if(BROTHERS==0)BROTHERS=1;
        //if(NEPHEWS==0)NEPHEWS=1;
        if(PATERNALHALFS==0)PATERNALHALFS=1;


        //alert ("PATERNALS_LOAD_IE ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );
        //alert ("PaternalCousinArray ARRAY Information:" + JSON.stringify(PaternalCousinArray, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var SIDGEN = ARRAY[p].sid[0];
            var SID = ARRAY[p].sid[1];
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = START_PAT_GENLINE_IE(PIDGEN, PID, MIDGEN);
                p1 = parseInt(ps[0]) - ((parseInt(BROTHERS)*50) + (parseInt(NEPHEWS)*30) + (parseInt(PATERNALHALFS)*40));
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);

                SINGLE_SIDE_START_PATERNAL_CORNER_CONNECTOR_IE(SID,SIDGEN,MID,MIDGEN,Level2M, p1);

                //single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level2M);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
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
                    var KIDS = COUNT_MY_KIDS_IE(PaternalCousinArray, PREVIOUSID);
                    p1 = parseInt(PREVIOUSP1) - (100 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }
                else {
                    var KIDS = COUNT_MY_KIDS_IE(PaternalCousinArray, PREVIOUSID);
                    p1 = parseInt(PREVIOUSP1) - (100 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }
//alert([PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1])
                SINGLE_SIDE_CORNER_CONNECTOR_IE(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);

                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = PAT_GENLINE_IE(PREVIOUSGEN, PREVIOUSID);
                var p1 = ps[0];
                SINGLE_SIDE_CORNER_CONNECTOR_IE(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, mastery, rr, rr, 1, 1, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }

        CONNECTOR_IE(ARRAY,'PATERNALS');

    }


    //Parse Maternals Load
    function MATERNALS_MAIN_LOAD_IE() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var MATERNALDATA = new Array();

        //NephewArray.sort( SortByName_IE);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        //alert ("MaternalRelatives ARRAY Information:" + JSON.stringify(MaternalRelatives, null, 2) );
        if(MaternalRelatives.length==0)return;
        var sidgen = MotherArray[0].gender;
        var sid = MotherArray[0].id;

        for (t = 0; t < MaternalRelatives.length; t++) {
            var midgen = MaternalRelatives[t][0];
            var mid = MaternalRelatives[t][1];
            var id = MaternalRelatives[t][2];
            var pid = MaternalRelatives[t][3];

            //Do candidate have children
            var cnr = COUNT_KIDS_IE(MaternalCousinArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            MATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr, "sid": [sidgen,sid]});
            pnr = pnr + 1;
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr_IE);

        MATERNALS_LOAD_IE(MATERNALDATA);
    }


//Load paternal aunt / uncle
    function MATERNALS_LOAD_IE(ARRAY) {
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
        var FARRIGHT;

        //alert ("MATERNALS_LOAD_IE ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        var SISTERS = COUNT_FAMILY_KIDS_IE(SistersArray);
        var NEPHEWS = COUNT_FAMILY_KIDS_IE(NephewArray);
        var MATERNALHALFS = COUNT_FAMILY_KIDS_IE(MaternalHalfSiblingsArray);


        if(MaternalHalfSiblingsArray.length>0) FARRIGHT = COORDINATES_OF_FAMILY_IE(MaternalHalfSiblingsArray,NephewArray);
        else FARRIGHT = COORDINATES_OF_FAMILY_IE(SistersArray,NephewArray);

        for (var p in ARRAY) {
            var idarray = new Array();
            var SIDGEN = ARRAY[p].sid[0];
            var SID = ARRAY[p].sid[1];
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = START_MAT_GENLINE_IE(PIDGEN, PID, MIDGEN);

                if(typeof FARRIGHT != 'undefined')p1 = parseInt(FARRIGHT) + 60;
                else p1 = ps[0] + 20;

                //p1 = parseInt(ps[0]) + ((parseInt(SISTERS)*50) + (parseInt(NEPHEWS)*30) + (parseInt(MATERNALHALFS)*40));
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                SINGLE_SIDE_START_MATERNAL_CORNER_CONNECTOR_IE(SID,SIDGEN,MID,MIDGEN,Level2M, p1);

                //single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level5M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level2M, rr, rr, 1, 1, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level2F, cr, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                //LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);
            }
            /*** The Next Parent is Loaded ***/
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;
                //var PREVMID = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var PREVIOUSP1 = P1[P1.length - 1][2];


                //Begin new elemnt
                if (LINE == 0) {
                    var KIDS = COUNT_MY_KIDS_IE(MaternalCousinArray, PREVIOUSID);
                    if(KIDS==0)KIDS=1;
                    p1 = parseInt(PREVIOUSP1) + (60 + (parseInt(KIDS)*80));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }
                else {
                    var KIDS = COUNT_MY_KIDS_IE(MaternalCousinArray, PREVIOUSID);
                    if(KIDS==0)KIDS=1;
                    p1 = parseInt(PREVIOUSP1) + (60 + (parseInt(KIDS)*80));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);

                    //Connect to parent
                    //right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level5M);
                }

                SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR_IE(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);


                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level2M, rr, rr, 1, 1, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level2F, cr, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = PAT_GENLINE_IE(PREVIOUSGEN, PREVIOUSID);
                var p1 = ps[0];
                SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR_IE(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);

                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level2M, rr, rr, 1, 1, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level2F, cr, {
                        id: MID,
                        datakey: DATAKEY,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }


        CONNECTOR_IE(ARRAY,'MATERNALS');


        //Load the polylines
        //MAT_PARENT_CHILD_POLYLINES(MaternalRelatives, MotherArray);

    }


    //function MAT_PARENT_CHILD_POLYLINES(ARRAY1, ARRAY2) {
    //    var PARENTGEN = ARRAY2[0].gender;
    //    var PARENTID = ARRAY2[0].id;
    //    var xl = new Array();
    //    //Draw connecting polyline
    //    for (i = 0; i < ARRAY1.length; i++) {
    //        var value = ARRAY1[i];
    //        mid = value[1];
    //        var ps = GENLINE_IE(value[0], value[1]);
    //        p1 = ps[0];
    //        p2 = ps[1];
    //        if (i % 2 == 0) {
    //            xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
    //        }
    //        else if (i % 2 != 0) {
    //            xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
    //        }
    //
    //    }
    //    var temp = GENLINE_IE(PARENTGEN, PARENTID);
    //    xl.push([temp[0], temp[1] - 20], [temp[0], temp[1]]);
    //    //Load the polyline
    //    svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 3});
    //
    //}

    //function PAT_PARENT_CHILD_POLYLINES(ARRAY1, ARRAY2) {
    //    var PARENTGEN = ARRAY2[0].gender;
    //    var PARENTID = ARRAY2[0].id;
    //    var xl = new Array();
    //    //Draw connecting polyline
    //    for (i = 0; i < ARRAY1.length; i++) {
    //        var value = ARRAY1[i];
    //        mid = value[1];
    //        var ps = GENLINE_IE(value[0], value[1]);
    //        p1 = ps[0];
    //        p2 = ps[1];
    //        if (i % 2 == 0) {
    //            xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
    //        }
    //        else if (i % 2 != 0) {
    //            xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
    //        }
    //
    //    }
    //    var temp = GENLINE_IE(PARENTGEN, PARENTID);
    //    xl.push([temp[0], temp[1] - 20], [temp[0], temp[1]]);
    //    //Load the polyline
    //    svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 3});
    //
    //}
  
    /*
     * These functions load the x and y values for lines on objects
     */
    //function LEFTGEN(PIDGEN, ID, MIDGEN) {
    //    var p1, p2;
    //    if (PIDGEN == 'MALE') {
    //        p1 = parseInt($('#' + ID).attr('x')) - 40;
    //        p2 = parseInt($('#' + ID).attr('y')) + 20;
    //        if (MIDGEN == "FEMALE") {
    //            p1 = p1 - 10
    //        }
    //        else {
    //            p1 = p1 - 20
    //        }
    //    }
    //    else if (PIDGEN == 'FEMALE') {
    //        p1 = parseInt($('#' + ID).attr('cx')) - 40;
    //        p2 = parseInt($('#' + ID).attr('cy'));
    //        if (MIDGEN == "MALE") {
    //            p1 = parseInt(p1) - 45
    //        }
    //        else {
    //            p1 = p1 - 15
    //        }
    //    }
    //    return [p1, p2]
    //}

    //function RIGHTGEN(PREIOUSGEN, ID, MIDGEN) {
    //
    //    var p1, p2;
    //
    //    if (PREIOUSGEN == 'MALE') {
    //        p1 = parseInt($('#' + ID).attr('x')) + 40;
    //        p2 = parseInt($('#' + ID).attr('y')) + 20;
    //        if (MIDGEN == "FEMALE") {
    //            p1 = p1 + 20
    //        }
    //        else {
    //            p1 = p1 + 20
    //        }
    //    }
    //    else if (PREIOUSGEN == 'FEMALE') {
    //        p1 = parseInt($('#' + ID).attr('cx')) + 60;
    //        p2 = parseInt($('#' + ID).attr('cy'));
    //    }
    //    return [p1, p2]
    //}

    function RIGHT_NEPHEWS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN) {
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

    function RIGHT_NEPHEWS_START_GEN_IE(PARENTGEN, PARENTID, MIDGEN, GRANDGROUPS) {

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

    function LEFT_NEPHEWS_START_GEN_IE(PARENTGEN, PARENTID, MIDGEN) {
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

    function LEFT_NEPHEWS_GEN_IE(PREVIOUSGEN, ID, MIDGEN) {

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
    function COUNT_GROUPS_IE(ARRAY){

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
    function COUNT_SINGLE_GROUPS_IE(ARRAY){
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
                    var cla = $('#SP_'+mid).attr('genders');
                    if(typeof cla == 'undefined'){count = count + 1;}
                }
            }
        }
        return count;
    }







    function RIGHT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 80;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 40;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        else {
            if (PREVIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 100;
                p2 = parseInt($('#' + PREVIOUSID).attr('y'));
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 60;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }


    function RIGHT_START_COUSINS_GEN_IE(PARENTGEN, ID, MIDGEN) {

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

    function LEFT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

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

    function LEFT_START_HALF_SIBLINGS_GEN_IE(PARENTGEN, PARENTID, MIDGEN) {

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

    function RIGHT_START_HALF_SIBLINGS_GEN_IE(PARENTGEN, PARENTID, MIDGEN) {

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

    function LEFT_HALF_SIBLINGS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN) {

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

    //function RIGHT_HALF_SIBLINGS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN) {
    //
    //    var p1, p2;
    //
    //    if (MIDGEN == 'MALE') {
    //        if (PREVIOUSGEN == 'MALE') {
    //            p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 65;
    //            p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
    //        }
    //        else if (PREVIOUSGEN == 'FEMALE') {
    //            p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 85;
    //            p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
    //        }
    //    }
    //    else {
    //        if (PREVIOUSGEN == 'MALE') {
    //            p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 95;
    //            p2 = parseInt($('#' + PREVIOUSID).attr('y'));
    //        }
    //        else if (PREVIOUSGEN == 'FEMALE') {
    //            p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 65;
    //            p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
    //        }
    //    }
    //    return [p1, p2]
    //}

    function LEFT_START_COUSINS_GEN_IE(PARENTGEN, PARENTID, MIDGEN) {

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

    function GENLINE_IE(GEN, ID) {
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

    function CHILD_START_LINE_IE(PARENTGEN, ID) {
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

    function START_PAT_GENLINE_IE(PARENTGEN, PARENTID, MIDGEN) {

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

    function START_MAT_GENLINE_IE(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 35;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 65;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 30;
                p2 = parseInt($('#' + PARENTID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function PAT_GENLINE_IE(PARENTGEN, PARENTID) {
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

    function MAT_GENLINE_IE(PARENTGEN, PARENTID) {
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
    function BROTHERS_LOAD_IE() {
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
                        var KIDS = COUNT_KIDS_IE(NephewArray, PREVIOUSID);
                        if(KIDS==0)KIDS=1;



                        //var check = IS_IN_ARRAY_IE(NephewArray, BID);
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
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });


                    }
                    else if (key == (BrothersArray.length - 1)) {
                        var BID = BrothersArray[key - 1][1];
                        var check = IS_IN_ARRAY_IE(NephewArray, BID);
                        p1 = parseInt($('#' + BID).attr('x')) - 80
                        if (check != -1) p1 = parseInt(p1) - 140;
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else {
                        if ($('#' + PID).attr("genders").toUpperCase() == "MALE"){
                            p1 = parseInt($('#' + PID).attr('x')) - 80
                        }
                        else{ p1 = parseInt($('#' + PID).attr('cx')) - 80}
                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);

                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }

                }
                else {
                    var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
                    if (PIDGEN == "MALE")p1 = parseInt($('#' + PID).attr('x')) - 80;
                    else p1 = parseInt($('#' + PID).attr('cx')) - 100;
                    svg.rect(p1, Level3M, rr, rr, 1, 1, {
                        id: MID,
                        datakey: datakey,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
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

    function PATERNAL_HALF_SIBLINGS_LOAD_IE() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();
        var MATERNALDATA = new Array();

        //NephewArray.sort( SortByName_IE);
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
            var cnr = COUNT_KIDS_IE(NephewArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            PATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        PATERNALDATA = PATERNALDATA.sort(SortByNr_IE);

         LOAD_HALF_PATERNAL_OBJECTS_IE(PATERNALDATA);
    }

    //Paternal Half Broters
    function  LOAD_HALF_PATERNAL_OBJECTS_IE(ARRAY) {
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
                var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
                var p1temp = new Array();
                //var datakey = value[2];


                //Parse array and build diagram
                if (p == 0) {
                    DATAKEY = ARRAY[p].id;
                    if (BrothersArray.length > 1) {
                        var d = BrothersArray[BrothersArray.length - 1];
                        lx = parseInt($('#' + d[1]).attr('x'));
                        p1 = parseInt(lx) - 165;
                        SINGLE_LEFT_CORNER_CONNECTOR_IE(PID,d[1],'MALE',PIDGEN,Level3M,p1);
                    }
                    else {
                        //p1 = parseInt($('#' + PID).attr('x')) - lx;
                        var ps = LEFT_START_HALF_SIBLINGS_GEN_IE(PIDGEN,PID,MIDGEN);
                        //var ps = GENLINE_IE(PIDGEN, PID);
                        p1 = ps[0];
                        SINGLE_LEFT_CORNER_CONNECTOR_IE(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }

                    //Get previous object coordninates
                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);
                    STACK_CONNECTOR_IE(ARRAY,'PatHalfSib');

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
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
                    //var check = IS_IN_ARRAY_IE(NephewArray, PREVIOUSID);

                    //var ps = LEFT_HALF_SIBLINGS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    //p1 = SINGLE_LEFT_CORNER_CONNECTOR_IE(PREVIOUSGEN,MID,MIDGEN,PREVIOUSID,Level3M);

                    //p1 = ps[0];

                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);



                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

            }
        }

        STACK_CONNECTOR_IE(ARRAY,'PatHalfSib');

    }

    function  MATERNAL_HALF_SIBLINGS_LOAD_IE() {
        var pid, mid, G, midgen;
        var PIDS = new Array();
        var MIDS = new Array();
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var PATERNALDATA = new Array();
        var MATERNALDATA = new Array();

        //NephewArray.sort( SortByName_IE);
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
            var cnr = COUNT_KIDS_IE(NephewArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            MATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr});
            pnr = pnr + 1;
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr_IE);

         LOAD_HALF_MATERNAL_OBJECTS_IE(MATERNALDATA);
    }

    //Paternal Half Broters
    function  LOAD_HALF_MATERNAL_OBJECTS_IE(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY, lx, p1;
        var xl = new Array();
        var P1 = new Array();

        //alert ("'MatHalfSib' *** PATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );
        var FARRIGHT = COORDINATES_OF_FAMILY_IE(SistersArray,NephewArray);

        if (ARRAY.length > 0) {
            p2 = mastery;
            //$.each(ARRAY, function (key, value) {
            for (var p in ARRAY) {
                var DATAKEY = ARRAY[p].id;
                var CNR = ARRAY[p].cnr;
                var MIDGEN = ARRAY[p].value[0];
                var MID = ARRAY[p].value[1];
                var PID = ARRAY[p].value[2];
                var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
                var p1temp = new Array();
                //var datakey = value[2];


                //Parse array and build diagram
                if (p == 0) {
                    DATAKEY = ARRAY[p].id;

                    //if (SistersArray.length > 1) {
                    //    var d = SistersArray[SistersArray.length - 1];
                    //    var lx = $('#' + d[1]).attr('cx');
                    //    if(MIDGEN=='MALE') p1 = parseInt(lx) + 200;
                    //    else  p1 = parseInt(lx) + 145;
                    //    SINGLE_RIGHT_CORNER_CONNECTOR_IE(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    //}
                    //else {
                    //    var ps = RIGHT_START_HALF_SIBLINGS_GEN_IE(PIDGEN,PID,MIDGEN);
                    //    p1 = ps[0];
                    //    SINGLE_RIGHT_CORNER_CONNECTOR_IE(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    //}


                    if(typeof FARRIGHT!= 'undefined')p1 = parseInt(FARRIGHT) + 120;
                    else p1 = ps[0] + 40;

                    SINGLE_RIGHT_CORNER_CONNECTOR_IE(PID,MID,MIDGEN,PIDGEN,Level3M, p1);

                    //Get previous object coordninates
                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
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
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: DATAKEY,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

            }
        }

        STACK_CONNECTOR_IE(ARRAY,'MatHalfSib');

    }

    //Load sisters
    function  SISTERS_LOAD_IE() {
        var lx = 0;
        var ly = 0;
        var MIDGEN, MID, SPID;
        var p1, p2, lx;
        var PID = 'me';
        var xl = new Array();
        var P1 = new Array();

        //alert ("SistersArray ARRAY Information:" + JSON.stringify(SistersArray, null, 2) );
        //Are any family children around
        var TOTALGRANDKIDS = COUNT_FAMILY_KIDS_IE(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS_IE(ChildrenArray);

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
                        var KIDS = COUNT_KIDS_IE(NephewArray, PREVIOUSID);

                        if(KIDS==0)KIDS=1;

                        var check = IS_IN_ARRAY_IE(NephewArray, SID);
                        var p1 = PREVIOUSP1 + (80 + (parseInt(KIDS)*(parseInt(KIDS) * 65))/parseInt(KIDS));
                        //if (check != -1) p1 = parseInt(p1) + 120;

                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);

                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                    else if (key == (SistersArray.length - 1)) {
                        var SID = SistersArray[key - 1][1];
                        var check = IS_IN_ARRAY_IE(NephewArray, SID);

                        var PREVIOUSGEN = P1[P1.length - 1][0];
                        var PREVIOUSID = P1[P1.length - 1][1];
                        var PREVIOUSP1 = P1[P1.length - 1][2];
                        var KIDS = COUNT_KIDS_IE(NephewArray, PREVIOUSID);
                        if(KIDS==0) KIDS=1;

                        var check = IS_IN_ARRAY_IE(NephewArray, SID);

                        var p1 = PREVIOUSP1 + (60 + (parseInt(KIDS)*(parseInt(KIDS) * 45))/parseInt(KIDS));
                        //p1 = PREVIOUSP1 + 120;
                        //if (check != -1) p1 = parseInt(p1) + 120;

                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                    else {
                        var KIDS = COUNT_MY_KIDS_IE(ChildrenArray, PID);
                        if(KIDS==0) KIDS=1;

                        if ($('#' + PID).attr("genders").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(KIDS) * 95) + (parseInt(TOTALGRANDKIDS) * 60);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(KIDS) * 95) + (parseInt(TOTALGRANDKIDS) * 60);
                        }

                        p1temp.push(MIDGEN, MID, p1, PID);
                        P1.push(p1temp);

                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }

                    //svg.circle(p1, Level3F, cr, {
                    //    id: MID,
                    //    datakey: datakey,
                    //    fill: gencolor,
                    //    stroke: 'black',
                    //    strokeWidth: 2,
                    //    genders: 'female',
                    //    cursor: 'pointer'
                    //});

                }
                else {
                    var KIDS = COUNT_MY_KIDS_IE(ChildrenArray, PID);
                    if(KIDS==0) KIDS=1;
                    if(GRANDSGROUP>0){
                        if ($('#' + PID).attr("genders").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(SINGLEGROUPS) * 85) + (parseInt(GRANDSGROUP) * 180);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(SINGLEGROUPS) * 85) + (parseInt(GRANDSGROUP) * 180);
                        }
                    }
                    else {

                        if ($('#' + PID).attr("genders").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + PID).attr('x')) + (parseInt(KIDS) * 85);
                        }
                        else {
                            p1 = parseInt($('#' + PID).attr('cx')) + (parseInt(KIDS) * 85);
                        }
                    }
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        datakey: datakey,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }


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
    function  SPOTLINE_IE(ID) {
        var GEN = $('#' + ID).attr("genders").toUpperCase();

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
    function  SortByName_IE(a, b) {
        var aName = a[0].toLowerCase();
        var bName = b[0].toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    function  SortById_IE(a, b) {
        a = a[2];
        b = b[2];

        var aName = a.toLowerCase();
        var bName = b.toLowerCase();
        //var aName = a;
        //var bName = b;
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }

    function SortByNr_IE(a, b) {

        a = a.id;
        b = b.id;

        var aName = a.toLowerCase();
        var bName = b.toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }


    function NEPHEWS_LOAD_IE() {
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

        //NephewArray.sort( SortByName_IE);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        var gnr="";

        var gnr = COUNT_GROUPS_IE(GrandChildrenArray);

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
        MATERNALDATA = MATERNALDATA.sort(SortByNr_IE);
        PATERNALDATA = PATERNALDATA.sort(SortByNr_IE);

        LOAD_MATERNAL_OBJECTS_IE(MATERNALDATA);
        LOAD_PATERNAL_OBJECTS_IE(PATERNALDATA);
    }

    function LOAD_MATERNAL_OBJECTS_IE(ARRAY) {
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
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();
            var GRANDGROUPS =  ARRAY[p].gnr;

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_NEPHEWS_START_GEN_IE(PIDGEN, PID, MIDGEN, GRANDGROUPS);
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
                single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }

                //Connect to parent
                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);

            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;

                if (LINE == 0) {
                    var ps = RIGHT_NEPHEWS_START_GEN_IE(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = RIGHT_NEPHEWS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                }
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                //Connect to parent

                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);
                //right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);

            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_NEPHEWS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);
            }
        }

        CONNECTOR_IE(ARRAY,'TEST');
        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT_IE(objectsarray, 'test');
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
        //OBJECTS_CONNECT_IE(objectsarray, 'ltest');
    }

    function LOAD_PATERNAL_OBJECTS_IE(ARRAY) {
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
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_NEPHEWS_START_GEN_IE(PIDGEN, PID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }

                //Connect to parent
                LOAD_SPOUCE_PATERNAL_IE(PID, PIDGEN);



            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                var ps;
                var LINE = ARRAY[p].nr;
                DATAKEY = ARRAY[p].id;

                if (LINE == 0) {
                    var ps = LEFT_NEPHEWS_START_GEN_IE(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = LEFT_NEPHEWS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level4M);
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                //Connect to parent
                LOAD_SPOUCE_PATERNAL_IE(PID, PIDGEN);


            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = LEFT_NEPHEWS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                //p1 = P1[P1.length - 1][2] - 90;
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level4M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level4F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_PATERNAL_IE(PID, PIDGEN);

            }

        }

        CONNECTOR_IE(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT_IE(objectsarray, 'test');
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
        //OBJECTS_CONNECT_IE(objectsarray, 'ltest');
    }

    function LOAD_SPOUCE_MATERNAL_IE(ID, GEN) {
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
            SPOUCE_CONNECT_IE(ID);
        }
        //mdia = rr;
        //fdia = cr;
        //Build a spuce sign
        if (GEN == 'FEMALE') {
            svg.rect(p1, p2, rr, rr, 1, 1, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'black',
                strokeWidth: 2,
                genders: 'male',
                cursor: 'pointer'
            });
        }
        else if (GEN == 'MALE') {
            svg.circle(p1, p2, cr, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'black',
                strokeWidth: 2,
                genders: 'female',
                cursor: 'pointer'
            });
        }
    }

    function LOAD_SPOUCE_PATERNAL_IE(ID, GEN) {

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
        PATERNAL_SPOUCE_CONNECT_IE(ID)
        if (GEN == 'FEMALE') {
            svg.rect(p1, p2, rr, rr, 1, 1, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'black',
                strokeWidth: 2,
                genders: 'male',
                cursor: 'pointer'
            });
        }
        else if (GEN == 'MALE') {
            svg.circle(p1, p2, cr, {
                id: SPOUCE,
                fill: spoucecolor,
                stroke: 'black',
                strokeWidth: 2,
                genders: 'female',
                cursor: 'pointer'
            });
        }
        ;
    }



    //Check array condition if has children
    function IS_IN_ARRAY_IE(ARRAY, ID) {
        var res = -1;
        $.each(ARRAY, function (k, data) {
            if (ID == data[2]) {

                //var ps = GENLINE_IE(data[0],ID);
                //res = ps[0];
                res = 'found';
                return false;
            }
        });
        return res;
    }

    //Check array condition if has children
    function COUNT_KIDS_IE(ARRAY, ID) {



        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {

            if (ID == data[2]) {
                amt = parseInt(amt) + 1;


                //var ps = GENLINE_IE(data[0],ID);
                //res = ps[0];
                //res = 'found';
                //return false;
            }
        });

        return amt;
    }

    //Check array condition if has children
    function COUNT_MY_KIDS_IE(ARRAY, ID) {
        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {


            if (ID == data[3]) {
                amt = parseInt(amt) + 1;

            }
        });

        return amt;
    }

    //Check any array condition if has children
    function COUNT_FAMILY_KIDS_IE(ARRAY) {
        var res = -1;
        var amt=0;
        $.each(ARRAY, function (k, data) {
            if (data[2]) {
                amt = parseInt(amt) + 1;
            }
        });

        return amt;
    }

    //Check any array condition if has children
    function COORDINATES_OF_FAMILY_IE(ARRAY1,ARRAY2) {
        var res = -1;
        var amt=0;
        var array = new Array();
        $.each(ARRAY1, function (k, data) {
            var ID = data[1];

            var KIDS = COUNT_SIBLING_KIDS_IE(ARRAY2,ID);
            var  x =  SPOTLINE_IE(ID);
            if (KIDS>0) {

                var Nk = parseInt(x[0]);
                array.push(parseInt(x[0])+parseInt(KIDS)*30+60)
            }
            else array.push(x[0]);

        });

        //array = array.reverse();

        array = array.sort(function(a,b){return b - a}) //Array now becomes [7, 8, 25, 41]
        return array[0];
    }

    //Check array condition if has children
    function COUNT_SIBLING_KIDS_IE(ARRAY, ID) {
        var res = -1;
        var amt=0;

        $.each(ARRAY, function (k, data) {

            if (ID == data[2]) {
                amt = parseInt(amt) + 1;

            }
        });

        return amt;
    }



    function COUNT_IN_ARRAY_IE(ARRAY, ID) {
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
    function OBJECTS_CONNECT_IE(ARRAY, ID) {
        var xl = new Array();
        if (ARRAY.length > 1) {
            for (i = 0; i < ARRAY.length; i++) {
                var GEN = ARRAY[i][0];
                var ID = ARRAY[i][1];
                var ps = GENLINE_IE(GEN,ID);
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
            //alert ( ID + " *** STACK_CONNECTOR_IE Information:" + JSON.stringify(xl, null, 2) );

            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 3});
        }
        else{

            for (i = 0; i < ARRAY.length; i++) {

                var ps = GENLINE_IE(ARRAY[i][0], ARRAY[i][1]);
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
    function SPOUCE_CONNECT_IE(ID) {
        var xl = new Array();
        var p1, p2;
        var GEN = $('#' + ID).attr('genders').toUpperCase();

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
    function PATERNAL_SPOUCE_CONNECT_IE(ID) {

        var xl = new Array();
        var p1, p2;
        var GEN = $('#' + ID).attr('genders').toUpperCase();

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
    function MATERNAL_COUSINS_LOAD_IE() {
        var pid, mid, midgen;
        var DATAARRAY = new Array();
        var nr = 0;

        //MaternalCousinArray = MaternalCousinArray.sort( SortById_IE);
        //alert ("MaternalCousinArray ARRAY Information:" + JSON.stringify(MaternalCousinArray, null, 2) );
        for (t = 0; t < MaternalCousinArray.length; t++) {
            var key = MaternalCousinArray[t][2];
            var midgen = MaternalCousinArray[t][0];
            var mid = MaternalCousinArray[t][1];

            if(pid=="") {
                var pid = MaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
            else if(pid == MaternalCousinArray[t][3]){
                var pid = MaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
            else if(pid != MaternalCousinArray[t][3]){
                var pid = MaternalCousinArray[t][3];
                var groupkey = $('#' + pid).attr('datakey');
                nr = 0;
                DATAARRAY.push({"id": groupkey, "value": [midgen, mid, pid], "nr": nr})
            }
        }

        //alert ("MATERNAL DATAARRAY ARRAY Information:" + JSON.stringify(DATAARRAY, null, 2) );

        //mtemp.sort( SortById_IE);
        DATAARRAY = DATAARRAY.sort(SortByNr_IE);
        LOAD_MATERNAL_COUSINS_OBJECTS_IE(DATAARRAY);

    }

    function LOAD_MATERNAL_COUSINS_OBJECTS_IE(ARRAY) {
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
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                var p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, Level3M, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);

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
                    ps = RIGHT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                    var p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = RIGHT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    var p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);

                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level3M, rr, rr, 1, 1, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level3F, cr, {
                            id: MID,
                            fill: gencolor,
                            stroke: 'black',
                            strokeWidth: 2,
                            genders: 'female',
                            cursor: 'pointer'
                        });
                    }
                }

                LOAD_SPOUCE_MATERNAL_IE(PID, PIDGEN);



            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                var p1 = ps[0];

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
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }


        CONNECTOR_IE(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT_IE(objectsarray, 'test');
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
        //OBJECTS_CONNECT_IE(objectsarray, 'ltest');
    }

    function PATERNAL_COUSINS_LOAD_IE() {
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
            var midgen = PaternalCousinArray[t][0];
            var mid = PaternalCousinArray[t][1];


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
        }

        //alert ("PATERNAL DATAARRAY ARRAY Information:" + JSON.stringify(DATAARRAY, null, 2) );

        //ptemp.sort( SortById_IE);
        DATAARRAY = DATAARRAY.sort(SortByNr_IE);
        LOAD_PATERNAL_COUSINS_OBJECTS_IE(DATAARRAY);

    }


    function LOAD_PATERNAL_COUSINS_OBJECTS_IE(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("LOAD_PATERNAL_COUSINS_OBJECTS_IE ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);
                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL_IE(PID, PIDGEN);
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
                    ps = LEFT_START_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = LEFT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];

                    //var ps = LEFT_COUSINS_GEN_IE(PIDGEN, PID, MIDGEN);
                    //p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                    left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, Level3M);
                }

                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL_IE(PID, PIDGEN);
                //Connect to parent
            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = LEFT_COUSINS_GEN_IE(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                p1 = ps[0];

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {
                    svg.rect(p1, mastery, rr, rr, 1, 1, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'male',
                        cursor: 'pointer'
                    });
                }
                else if (MIDGEN == 'FEMALE') {
                    svg.circle(p1, Level3F, cr, {
                        id: MID,
                        fill: gencolor,
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
                        cursor: 'pointer'
                    });
                }
            }
        }

        CONNECTOR_IE(ARRAY,'TEST');

        //var id = "0";
        //for (var p in ARRAY) {
        //    var tmp = new Array();
        //    if (id == "0") {
        //        id = ARRAY[p].id;
        //        tmp.push(ARRAY[p].value[0], ARRAY[p].value[1]);
        //        objectsarray.push(tmp);
        //    }
        //    else if (id != ARRAY[p].id) {
        //        OBJECTS_CONNECT_IE(objectsarray, 'test');
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
        //OBJECTS_CONNECT_IE(objectsarray, 'ltest');
    }


    function CONNECTOR_IE(ARRAY,ID){


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
                OBJECTS_CONNECT_IE(objectsarray, 'test');
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

        OBJECTS_CONNECT_IE(objectsarray, ID);
    }

    function STACK_CONNECTOR_IE(ARRAY,ID){


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
                //OBJECTS_CONNECT_IE(objectsarray, 'test');
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

        OBJECTS_CONNECT_IE(objectsarray, ID);
    }


    function SINGLE_SIDE_START_PATERNAL_CORNER_CONNECTOR_IE(PID, PIDGEN, MID, MIDGEN, LEVEL, target1) {
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

    function SINGLE_SIDE_START_MATERNAL_CORNER_CONNECTOR_IE(PID, PIDGEN, MID, MIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx')) - 20;
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
            [parseInt(target1)+20, parseInt(LEVEL)-20]
        ]);
        svg.polyline(xl, {id: 'Mss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }


    function SINGLE_SIDE_CORNER_CONNECTOR_IE(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
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
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 0;
        else var target1 = parseInt(target1) + 20;

        xl.push([[target1, parseInt(LEVEL)-20], [target1, parseInt(LEVEL)-20],[target1,parseInt(LEVEL)-20],[parseInt(p1)+45, parseInt(LEVEL)-20]]);
        svg.polyline(xl, {id: 'Hbss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }


    function SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR_IE(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
        var xl = new Array();

        if (PIDGEN == "FEMALE") {
            var p1 = parseInt($('#' + PID).attr('cx')) - 45;
            var p2 = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else {
            var p1 = parseInt($('#' + PID).attr('x')) - 20;
            var p2 = parseInt($('#' + PID).attr('y')) + 0;
            //target1 = parseInt(target1)+20;
        }
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 0 ;
        else var target1 = parseInt(target1) + 20;

        xl.push([[target1, parseInt(LEVEL)-20], [target1, parseInt(LEVEL)-20],[target1,parseInt(LEVEL)-20],[parseInt(p1)+45, parseInt(LEVEL)-20]]);
        svg.polyline(xl, {id: 'Hbss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }

    function SINGLE_LEFT_CORNER_CONNECTOR_IE(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
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

    function SINGLE_RIGHT_CORNER_CONNECTOR_IE(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
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

    function right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, LEVEL) {
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

    function single_right_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, LEVEL) {
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

    function left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, LEVEL) {
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

    function single_left_parent_child_connector_ie(PID, MID, MIDGEN, PIDGEN, LEVEL) {
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


    var w = svgw.getAttribute('width');


    var offset = $('#svgframe').offset().left;
    var wit = $(window).height();
    var hei = $('#svgframe').height();
    var X = $('#me').attr('x');
    var DIVL = $('#family_pedigree').attr('width');
    var SVGW = svgw.getAttribute('width');
    var SVGH = svgw.getAttribute('height');

    var DIALOGWIDTH =  $(mdialog).width();
    var DIALOGHEIGHT =  $(mdialog).height();
    var DIALOGOUTERWIDTH =  $(mdialog).outerWidth();
    var TABLEHEIGHT = $('health_table').height();

    var allXarray = new Array();
    var allYarray = new Array();
    var container = $('#svgframe');

    $("#svgframe").each(function() {
        $('circle').each(function (index) {
            var cla = $(this).attr('genders')
            var cx = $(this).attr('cx');
            var cy = $(this).attr('cy');
            if (typeof cla != 'undefined') {
                cla = $(this).attr('genders').toLowerCase();
                if ($.inArray(cx, allXarray) == -1 && cla == 'female') {
                    allXarray.push(cx);
                    allYarray.push(cy);
                }
            }
        });
    });
    $("#svgframe").each(function() {
        $('rect').each(function (index) {
            var cla = $(this).attr('genders')
            var x = $(this).attr('x');
            var y = $(this).attr('y');
            if (typeof cla != 'undefined') {
                cla = $(this).attr('genders').toLowerCase();
                if ($.inArray(x, allXarray) == -1 && cla == 'male') {
                    allXarray.push(x);
                    allYarray.push(y);
                }
            }
        });
    });

    allXarray = allXarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]
    allYarray = allYarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]


    var FARLEFT = allXarray[0];
    var FARRIGHT = allXarray[allXarray.length - 1];

    var FARUP = allXarray[0];
    var FARDOWN = allXarray[allXarray.length - 1];
    var DIAHEIGHT = parseInt(FARDOWN) - parseInt(FARUP);

    var DIAWIDTH = parseInt(FARRIGHT) - parseInt(FARLEFT);

    var absleft = 0;

    if(FARLEFT < 0 )absleft = Math.abs(FARLEFT);
    if(FARRIGHT > DIALOGWIDTH )FARRIGHT = FARRIGHT - DIALOGWIDTH;

    //1786 <--@@ 942 <--## 1445
    var wscale,hscale;

    /**
     * Start the Scaling for large pics
     */

    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
        if (DIAWIDTH > SVGW) {
            var svgdoc = document.getElementById("svgframe");
            var FRAMEHEIGHT = svgdoc.getAttribute("height");
            var FRAMEWIDTH = svgdoc.getAttribute("width");

            var COMBINEDHEIGHT= parseInt(FARDOWN)*0.2;

            var wscale = parseInt(DIAWIDTH) + 200;
            var hscale = parseInt(SVGH);

            var LARGELEFT = parseInt(FARLEFT) - 150;

            svgdoc.setAttribute("viewBox", + LARGELEFT + ' 100 ' + wscale + ' 400');

            var arr = new Array();
            var T = svgdoc.getAttribute("viewBox");
            arr = T.split(' ');

            //var PANEL = $('#panel').attr('y');
            var PANEL =parseInt(arr[1]);

            //$('#family_pedigree').setAttribute("margin-top", '250px');
            $('#family_pedigree_info').css("margin-top", PANEL+'px')
            $('#svgframe').css("border-bottom", '0');

        }
        else {

            var svgdoc = document.getElementById("svgframe");
            var FRAMEHEIGHT = svgdoc.getAttribute("height");
            var FRAMEWIDTH = svgdoc.getAttribute("width");

            var COMBINEDHEIGHT= parseInt(TABLEHEIGHT) + parseInt(FRAMEHEIGHT) + 300;

            var wscale = parseInt(SVGW) + 200;
            var hscale = parseInt(hei) + 100;

            if(FARLEFT<0) {

                var FULLSCALE = parseInt(wscale) + 300;
                svgdoc.setAttribute("viewBox", FARLEFT + ' 400 ' + FULLSCALE + ' 260');
                //svgdoc.setAttribute("preserveAspectRatio","none");

                var arr = new Array();
                T = TOPCLONE.getAttribute("viewBox");
                //var T = svgdoc.getAttribute("viewBox");
                arr = T.split(' ');

                //var PANEL = $('#panel').attr('y');
                var PANEL =parseInt(arr[3]);
                //$('#family_pedigree').setAttribute("margin-top", '250px');
                $('#svgframe').css("height", '10px');
                //$('#svgframe').css("margin-top", '270px');
                $('#svgframe').css("border-bottom", '0');
                $('#family_pedigree_info').css("margin-top", PANEL+'px')
            }
            else{
                var FULLSCALE = parseInt(wscale) + 300;

                svgdoc.setAttribute("viewBox", '20 100 ' + FULLSCALE + '100');
                //svgdoc.setAttribute("preserveAspectRatio","none");

                var arr = new Array();
                T = TOPCLONE.getAttribute("viewBox");
                //var T = svgdoc.getAttribute("viewBox");
                arr = T.split(' ');

                //var PANEL = $('#panel').attr('y');
                var PANEL =parseInt(arr[3]);
                //$('#svgframe').css("height", '280px');
                $('#svgframe').css("margin-top", '10px');
                $('#svgframe').css("border-bottom", '0');


                $('#family_pedigree_info').css("margin-top", PANEL+'px')
            }
        }
    }
    /*
     Chrome and FF
     */
    else if(/chrome/i.test( navigator.userAgent )){

        if (DIAWIDTH > SVGW) {
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            var wscale = parseInt(RIGHT_X)*1.2;
            var left = parseInt(LEFT_X) - 10;
            var right = parseInt(RIGHT_X)*0.8;
            hscale = parseInt(SVGH);

            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + ' ' + right);
            svgw.setAttribute("preserveAspectRatio","xMinYMin slice");
            svgw.setAttribute("width",wscale + "px");
            svgw.setAttribute("height","1000px");
            var lft = parseInt(absleft) / 2;

            $('#topsvg').css("overflow-y", "scroll")
            $('#topsvg').css('width', parseInt(masterRight)-100);
            $('#topsvg').css('overflow', 'visible');
            $('#svgframe').css("margin-top", '10px');



            //$('#the2').css('display', 'none');
            infoframemargin = $('#family_pedigree_info').css("margin-top");
            topdivheight = $('#topsvg').css('height');
            topdivwidht = $('#topsvg').css('width');
            TOPCLONE = svg.clone( null, svgw)[0];
            TOPCLONE.setAttribute('visibility','hidden');
            TOPCLONE.setAttribute('height','500px');

        }
        else {
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            var wscale = parseInt(RIGHT_X) + 100;
            var left = parseInt(LEFT_X) - 100;
            //wscale = parseInt(SVGW) + 100;
            hscale = parseInt(hei) + 0;
            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + ' 900');
            $('#svgframe').css("margin-top", '10px');
            $('#svgframe').css("height", '1000px');
            $('#topsvg').css('overflow', 'hidden');


            $('#the2').css('display', 'none');

            infoframemargin = $('#family_pedigree_info').css("margin-top");
            topdivheight = $('#topsvg').css('height');
            topdivwidht = $('#topsvg').css('width');
            TOPCLONE = svg.clone( null, svgw)[0];
            TOPCLONE.setAttribute('visibility','hidden');
            TOPCLONE.setAttribute('height','500px');

        }



        //var TLEFT = parseInt(masterRight) - parseInt(TOTWIDTH);
        //if (TLEFT < 0) {
        //    var REALLONG = parseInt(masterRight) * 1.2;
        //    height = parseInt(arr[3]) * 0.60;
        //    width = parseInt(arr[2]) * 0.95;
        //    X = - 100;
        //    Y = 10;
        //    TOTWIDTH = parseInt(TOTWIDTH);
        //    //alert(X)
        //    svgdoc.setAttribute("viewBox", [X + " " + Y + " " + width + " " + 1000]);
        //    //svgdoc.setAttribute("preserveAspectRatio","none");
        //
        //    //$('#topsvg').css("overflow", "auto");
        //    $('#topsvg').css("height", "750px");
        //    $('#topsvg').css("overflow-x", "scroll")
        //    var ALLWIDTH = 2 * parseInt(masterRight);
        //    $('#topsvg').css('width', masterRight);
        //    $('#theclone').css("width", TOTWIDTH);
        //}
        //else{
        //    height = parseInt(arr[3]) * 0.85;
        //    width = parseInt(arr[2]) * 1.70;
        //    X = -10 ;
        //    Y = -25;
        //    svgdoc.setAttribute("viewBox", [X + " " + Y + " " + width + " " + height]);
        //    $('#theclone').css("width", TOTWIDTH);
        //}
    }
    else {


        //alert([DIAWIDTH,SVGW])

        if (DIAWIDTH > SVGW) {

            wscale = parseInt(DIAWIDTH) + 400;
            hscale = parseInt(SVGH);
            svgw.setAttribute('viewBox', +(parseInt(FARLEFT) - 50) + ' 0 ' + wscale + ' 1200');
            var lft = parseInt(absleft) / 2;
            //svgw.setAttribute('transform', 'translate('+ (parseInt(absleft)/2.2) +',10)');

            $('#svgframe').css("margin-top", '10px');
            $('#topsvg').css('overflow', 'visible');

            //$('#the2').css('display', 'none');
            infoframemargin = $('#family_pedigree_info').css("margin-top");
            topdivheight = $('#topsvg').css('height');
            topdivwidht = $('#topsvg').css('width');
            TOPCLONE = svg.clone( null, svgw)[0];
            TOPCLONE.setAttribute('visibility','hidden');
            TOPCLONE.setAttribute('height','500px');

        }
        else {

            //alert ("allXarray ARRAY Information:" + JSON.stringify(allXarray, null, 2) );
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            var wscale = parseInt(RIGHT_X) + 100;
            var left = parseInt(LEFT_X) - 100;
            hscale = parseInt(hei) + 0;
            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + ' 900');
            //if(FARLEFT<0) svgw.setAttribute('transform', 'translate('+absleft+',10  )');
            $('#svgframe').css("margin-top", '10px');
            $('#svgframe').css("height", '1000px');
            $('#topsvg').css('overflow', 'hidden');


            $('#the2').css('display', 'none');

            infoframemargin = $('#family_pedigree_info').css("margin-top");
            topdivheight = $('#topsvg').css('height');
            topdivwidht = $('#topsvg').css('width');
            TOPCLONE = svg.clone( null, svgw)[0];
            TOPCLONE.setAttribute('visibility','hidden');
            TOPCLONE.setAttribute('height','500px');

        }


        //TOPCLONE.setAttribute('id','svgframe');


    }

    /*
     Start clone and hide
     */
    //TOPCLONE = svg.clone( null, svgw)[0];
    //TOPCLONE.setAttribute('visibility','hidden');

}


//Build a table of health issues
function LOAD_HEALTH_TABLE_IE(){
    var DISEASESARRAY = new Array();
    var item;

    //Add my self to table
    var TABLE_DATA_ARRAY = new Array();
    var temp1 = new Array();
    var temp2 = new Array();
    var MYPRIMARY_DISEASE = new Array();
    var MYSECONDARY_DISEASE = new Array();
    var mystatics = new Array();
    var MYSTART_COD = new Array();

    var diss;

    temp1.push(-1);
    temp1.push(personal_information.name + '( Self )');
    //if(personal_information.cause_of_death == 'undefined')
    var cod = ((typeof personal_information.cause_of_death == 'undefined') ? 'Yes' : 'No / ' + personal_information.cause_of_death);

    /*
     Load first Self Information
     */
    var myhealth = new Array();
    myhealth = personal_information['Health History'];

    //var cols = new Array();

    for (var k=0; k<STATICDISEASES.length;k++){
        MYPRIMARY_DISEASE[k] = "-";
    }

    for (var k=0; k<diseasearray.length;k++){
        MYSECONDARY_DISEASE[k] = "-";
    }


    MYSTART_COD = LOAD_DATA_IE(cod,0);
    mystatics = $.merge( $.merge( [], temp1 ), MYSTART_COD );

    //cols = LOAD_DATA_IE(cod,diseasearray.length)


    if(myhealth.length>0) {
        $.each(myhealth, function (key, item) {
            var tmp = item['Disease Name'];
            var details = item['Detailed Disease Name'];
            if(tmp)tmp = tmp.toLowerCase();
            if(details)details=details.toLowerCase();
            if(details=='diseases:null') details = "";

            if(($.inArray(tmp, STATICDISEASES) != -1) || ($.inArray(details, STATICDISEASES) != -1)) {
                var nr = STATICDISEASES.indexOf(details.toLowerCase());
                for (var k=0; k<STATICDISEASES.length;k++){
                    if (k==nr){
                        if(details==null || typeof details=='undefined')details = tmp;
                        MYPRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                        break;
                    }
                }
            }

            for(var i =0;i<diseasearray.length;i++){
                var b = diseasearray[i][1];
                if(b==details){
                    if (details == null || typeof details == 'undefined')details = tmp;
                    MYSECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                    break;
                }
            }
        });

        TABLE_DATA_ARRAY = $.merge($.merge( $.merge( [], mystatics ), MYPRIMARY_DISEASE ), MYSECONDARY_DISEASE);
    }
    else{
        TABLE_DATA_ARRAY = $.merge($.merge( $.merge( [], mystatics ), MYPRIMARY_DISEASE ), MYSECONDARY_DISEASE);
    }

    DISEASESARRAY.push(TABLE_DATA_ARRAY);

    /*
     Load remaining family
     */
    var TABLE_DATA_ARRAY = new Array();
    var que = 0;

    $.each(personal_information, function(key, item) {
        var temp1 = new Array();
        var temp2 = new Array();
        var statics = new Array();
        var PRIMARY_DISEASE = new Array();
        var SECONDARY_DISEASE = new Array();
        var TOTAL_DISEASE = new Array();


        //alert ("diseasearray ARRAY Information:" + JSON.stringify(diseasearray, null, 2) );

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
                temp1.push(que);
                var NAMEREL = NAME + '(' + RELATION + ')';
                temp1.push(NAMEREL);

                var COD = ((typeof item.cause_of_death == 'undefined') ? 'Yes' :  'No / ' + item.cause_of_death);
                var START_COD = new Array();
                statics = new Array();
                var diss;

                START_COD = LOAD_DATA_IE(COD,0);
                statics = $.merge( $.merge( [], temp1 ), START_COD );

                for (var k=0; k<STATICDISEASES.length;k++){
                    PRIMARY_DISEASE[k] = "-";
                }

                for (var k=0; k<diseasearray.length;k++){
                    SECONDARY_DISEASE[k] = "-";
                }

                if (typeof item['Health History'] != 'undefined') {
                    var temp_stat = new Array();
                    if (item['Health History'].length > 0) {
                        $.each(item['Health History'], function (key, item) {
                            var tmp = item['Disease Name'];
                            var details =  item['Detailed Disease Name'] ;

                            if(tmp)tmp=tmp.toLowerCase();
                            if(details)details=details.toLowerCase();
                            if(details=='diseases:null') details = "Other";


                            if(($.inArray(tmp, STATICDISEASES) != -1) || ($.inArray(details, STATICDISEASES) != -1)) {
                                var nr = STATICDISEASES.indexOf(details.toLowerCase());
                                for (var k=0; k<STATICDISEASES.length;k++){
                                    if (k==nr){
                                        if(details==null || typeof details=='undefined')details = tmp;
                                        PRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                                        break;
                                    }
                                }
                            }

                            for(var i =0;i<diseasearray.length;i++){
                                var b = diseasearray[i][1];
                                if(b==details){
                                    if (details == null || typeof details == 'undefined')details = tmp;
                                    SECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                                    break;
                                }
                            }
                        });
                    }
                    else {
                        var START_COD = new Array();
                        //alert(diseasearray.length)
                        START_COD = LOAD_DATA_IE(cod, diseasearray.length)
                        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), START_COD );
                    }
                }
                else {
                    var START_COD = new Array();
                    START_COD = LOAD_DATA_IE(cod, diseasearray.length)
                    TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), START_COD );
                }

                TABLE_DATA_ARRAY = $.merge($.merge( $.merge( [], statics ), PRIMARY_DISEASE ), SECONDARY_DISEASE);

                DISEASESARRAY.push(TABLE_DATA_ARRAY);
            }
        }
    });
    /*
     Add disease headers
     */
    // oTable.fnAddData(DISEASESARRAY);


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
            '<button id="' + TXT + '" class="closer"  data-column="' + ID + '" onClick="openTab_Ie(this.id)" style="background-color: darkslategrey;color: white;border: none;padding-right: 25px;cursor:pointer">' +
            '<img src="../static/images/open.gif" title="Add to the table" style="padding-right: 15px;padding-top: 4px;"/>' + NAME + '</button>' +
            '</td>');
        }
        else{
            $('#closed_table tr').append('<td>' +
            '<button id="' + TXT + '" class="closer"  data-column="' + ID + '" onClick="openTab_Ie(this.id)" style="background-color: darkslategrey;color: white;border: none;padding-right: 25px;cursor:pointer">' +
            '<img src="../static/images/open.gif" title="Add to the table" style="padding-right: 15px;padding-top: 4px;"/>' + NAME + '</button>' +
            '</button>' +
            '</td>');

        }
        $("#closed_table").show();
    } );


}

function openTab_Ie(TXT){
    var ID = TXT.substr(TXT.indexOf('_')+1 , TXT.length);
    oTable.fnSetColumnVis( ID, true );
    $('#'+TXT).remove();
}



function ADOPTED_FAMILY_IE(){
    $.each(personal_information, function (key, item) {
        if(item) {
            var adopt = item.adopted;
            if (typeof adopt != 'undefined') {
                if (adopt == 'true') {
                    var id = item.id;
                    $('#' + id).attr({fill: 'palegoldenrod'});
                }
            }
        }
    });

}

function LOAD_TR_IE(cod,nr){
    var START_COD = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) START_COD.push('<td>'+ cod + '</td>');
        else START_COD.push('<td></td>');

    }
    return START_COD;
}

function LOAD_DATA_IE(cod,nr){
    var START_COD = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) START_COD.push(cod.toString());
        else START_COD.push(" - ");

    }
    return START_COD;
}


function getAge_Ie(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
function BMI_CALCULATE_IE(W,H) {
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


function createDialog_Ie() {
    var allnames = new Array();

    if($("#optionsPanel").dialog( "isOpen" ) == true) {
        $("#optionsPanel").dialog( "open" );
    }
    else {
        var array = new Array();
        array.push("<option value='0' selected></option>")

        /**
         * Me values
         */
        $.each(personal_information['Health History'], function (k, data) {

            //var health = new Array();
            //health = data['Health History'];

            var thename, temp;
            var disname = data['Disease Name'];
            var detdisname = data['Detailed Disease Name'];
            if(detdisname=='diseases:null') detdisname = null;
            if (detdisname == null) thename = disname;
            else thename = detdisname;

            if ($.inArray(thename, allnames) == -1) {
                allnames.push(thename);
                array.push("<option id=" + disname + " value='" + detdisname + "'>" + thename + "</option>")
            }
        });

        /**
         * family Values
         */
        $.each(personal_information, function (key, item) {
            if(item) {
                if (typeof item.id != 'undefined') {
                    if (item['Health History']) {
                        var health = new Array();
                        health = item['Health History'];
                        $.each(health, function (k, data) {
                            var thename, temp;
                            var disname = data['Disease Name'];
                            var detdisname = data['Detailed Disease Name'];
                            if(detdisname=='diseases:null') detdisname = null;
                            if (detdisname == null) thename = disname;
                            else thename = detdisname;
                            if ($.inArray(thename, allnames) == -1) {
                                allnames.push(thename);
                                array.push("<option id=" + disname + " value='" + detdisname + "'>" + thename + "</option>")
                            }
                        });
                    }
                }
            }
        });


        //alert ("detdisname ARRAY Information:" + JSON.stringify(array, null, 2) );


        var $optdialog = $("<div id='optionsPanel' width='800px' class='instructions option_dialog' style='width:800px;'><p>"
        + "You can view, save or print your family health history to share with your health care provider. They can assess your risk for certain diseases, and develop disease prevention strategies that are right for you. You can also share the table with other family members to your your family's disease history. You can change what is shown in the table yourself by selecting from the options below. Please select from the options below what you would like to show on your table."
        + "<table>"
        + "<tr>"
        + "<td>"
        + "<label for='diseaseopts'>Choose a disease or condition to highlight in the diagram:  </label>"
        + "<select id='diseaseopts' onchange='DiseaseDna_Ie()'>"
        + array.toString()
        + "<option value='one'></option>"
        + "</select>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
        + "<input id='bmi' type='checkbox' name='chk_group' value='bmi' onclick='HideInfo_Ie()' checked /> Show my personal information (age, height, weight, and body mass index) at the top of the diagram and table.<br />"
        + "<input id='names' type='checkbox' name='chk_group' value='names' onclick='HideInfo_Ie()' checked /> Show the names of family members in the diagram and table.<br />"
        + "<input id='diagram' type='checkbox' name='chk_group' value='diagram' onclick='HideInfo_Ie()' checked/> Show drawing (the tree diagram of your family's health history)<br />"
        + "<input id='table' type='checkbox' name='chk_group' value='table' onclick='HideInfo_Ie()' checked/> Show table (your family's health history displayed as a listing table)<br />"
        + "</td>"
        + "</tr></table>"


        + "</p></div>").dialog({
            width: 900,
            position: ['top',100],
            title: 'Diagram & Table Options',
            close: function (ev, ui) {
                $(this).empty();
                $(this).dialog('destroy').remove();
            }
        });

        //Reset All to Original
        ResetInfo_Ie();

        return $optdialog
    }

}

function ClearDna_Ie(){
    $.each(personal_information, function (key, item) {
        if (typeof item != 'undefined'){
            var ID = item.id;
            if (typeof ID != 'undefined') {
                $('#' + ID).attr({fill: 'silver', stroke: 'red'});
            }
        }
    });
}

function ClearNames_Ie(comp){
    if(comp=='hide') {
        $.each(personal_information, function (key, item) {
            if (typeof item != 'undefined') {
                var ID = item.id;
                var name1 = 'name1_' + ID;
                var name2 = 'name2_' + ID;
                if (typeof ID != 'undefined') {
                    $('#' + name1).hide();
                    $('#' + name2).hide();
                }
            }
        });
        oTable.fnSetColumnVis( 0, false );

    }
    else{
        $.each(personal_information, function (key, item) {
            if(typeof item != 'undefined') {
                var ID = item.id;
                var name1 = 'name1_' + ID;
                var name2 = 'name2_' + ID;
                if (typeof ID != 'undefined') {
                    $('#' + name1).show();
                    $('#' + name2).show();
                }
            }
        });
        oTable.fnSetColumnVis( 0, true );
    }
}

function DiseaseDna_Ie(){

    ClearDna_Ie();

    var selectBox = document.getElementById("diseaseopts");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;


    /**
     * Me values
     */
    $.each(personal_information['Health History'], function (k, data) {
        if(typeof data !='undefined') {
            var ID = 'me';
            var health = new Array();
            //health = data['Health History'];
            health = data;
            $.each(health, function (t, value) {

                if (selectedValue == value) {
                    $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                }
                else if (selectedValue == value) {
                    $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                }
            });
        }
    });


    $.each(personal_information, function (key, item) {
        if(typeof item !='undefined') {
            var ID = item.id;
            if (typeof ID != 'undefined') {
                if (item['Health History']) {
                    var health = new Array();
                    health = item['Health History'];
                    $.each(health, function (k, data) {

                        var detdisname = data['Detailed Disease Name'];
                        var disname = data['Disease Name'];

                        if (selectedValue == detdisname) {
                            $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                        }
                        else if (selectedValue == disname) {
                            $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                        }
                    });
                }
            }
        }
    });

}

function HideInfo_Ie(){

    if(document.getElementById("bmi").checked == true) $('#bmi_table').show();
    else if(document.getElementById("bmi").checked == false) $('#bmi_table').hide();

    if(document.getElementById("names").checked == true) ClearNames_Ie('show');
    else if(document.getElementById("names").checked == false) ClearNames_Ie('hide');

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

function ResetInfo_Ie(){
    $('#bmi_table').show();
    ClearNames_Ie('show');
    $('#svgframe').show();
    $('#health_table').show();

}

function printCoupon_Ie() {
    window.print();

    var timer = setInterval(function() {
        if(window.close()) {
            clearInterval(timer);
            $('.sticky').show();
            //$('#health_table').show();
        }
    }, 1000);

    //endPrintCoupon();
}



function ToTop_Ie(){
    $('html,body').animate({
            scrollTop: $("#dialogtext").offset().top},
        'slow');
    return;
}
function ToTable(){
    $('html,body').animate({
            scrollTop: $("#bmi_table").offset().top},
        'slow');
}

function closedialog_ie(){
    ToTop_Ie();
    setTimeout(
        function()
        {
            $(mdialog).dialog("close");
        }, 3000);
}

function TheZoom_Ie(sel) {

    var allXarray = new Array();
    var allYarray = new Array();

    $("#svgframe").each(function() {
        $('circle').each(function (index) {
            var cla = $(this).attr('genders')
            var cx = $(this).attr('cx');
            var cy = $(this).attr('cy');
            if (typeof cla != 'undefined') {
                cla = $(this).attr('genders').toLowerCase();
                if ($.inArray(cx, allXarray) == -1 && cla == 'female') {
                    allXarray.push(cx);
                    allYarray.push(cy);
                }
            }
        });
    });
    $("#svgframe").each(function() {
        $('rect').each(function (index) {
            var cla = $(this).attr('genders')
            var x = $(this).attr('x');
            var y = $(this).attr('y');
            if (typeof cla != 'undefined') {
                cla = $(this).attr('genders').toLowerCase();
                if ($.inArray(x, allXarray) == -1 && cla == 'male') {
                    allXarray.push(x);
                    allYarray.push(y);
                }
            }
        });
    });

    allXarray = allXarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]
    allYarray = allYarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]

    var selectedVal = sel.options[sel.selectedIndex].value;

    var arr = new Array();
    var X=0;
    var Y=0;
    var width=500;
    var height=600;
    var newX=100;
    var newY=100;

    if (selectedVal == '200') {
        if(nowselected=='200')return;
        nowselected = selectedVal;

        var svgdoc = document.getElementById("svgframe");
        var FRAMEHEIGHT = svgdoc.getAttribute("height");
        var FRAMEWIDTH = svgdoc.getAttribute("width");
        var BOX = svgdoc.getAttribute("viewBox");
        arr = BOX.split(' ');
        var Xarray = new Array()

        $("#svgframe").each(function () {
            $('rect').each(function (index) {
                var cla = $(this).attr('genders')
                var x = $(this).attr('x');
                var y = $(this).attr('y');
                if (typeof cla != 'undefined') {
                    cla = $(this).attr('genders').toLowerCase();
                    if ($.inArray(x, Xarray) == -1 && cla == 'male') {
                        Xarray.push(x);
                    }
                }
            });
        });

        Xarray = Xarray.sort(function (a, b) {
            return a - b
        }) //Array now becomes [7, 8, 25, 41]

        var FARLEFT = Xarray[0];

        width = parseInt(arr[2]) * 0.99;
        height = parseInt(arr[3]) * 1.50;

        X = -200;
        Y = 30;
        var REALLONG = parseInt(masterRight) * 1.3;

        var TOTWIDTH = parseInt(width) + (2 * parseInt(X));

        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ) {
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            if (arr[0] < 0)X = parseInt(arr[0]) - 100;
            else X = -100;

            var wscale = parseInt(RIGHT_X)*0.5;
            var left = -Math.abs(RIGHT_X);
            var right = parseInt(RIGHT_X)*0.01;
            var REALLONG = parseInt(masterRight) * 3.1;


            height = parseInt(arr[3]) * 0.40;
            width = parseInt(arr[2]) * 1.99;
            X = -200;
            Y = 80;

            svgdoc.setAttribute("viewBox",  '-350 100 ' + -20 + ' -15');
            svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
            svgdoc.setAttribute("width",REALLONG + "px");
            svgdoc.setAttribute("height","1000px");

            $('#topsvg').css("height", "1000px");
            $('#topsvg').css("overflow", "scroll");
            $('#theclone').css("left", '50px');
            $('#theclone').css("margin-top", '10px');
            /*overflow: scroll;*/
            //svgdoc.setAttribute("viewBox", [X + " " + Y + " " + width + " " + height]);

            svgdoc.setAttribute('id', 'theclone');
            $('#theclone').css("width", '3000px');
            $('#theclone').css("height", '600px');
            $('#theclone').css("left", '50px');
            $('#theclone').css("z-index", '99999');

            $('#pattext').css("font-size", '20px');
            $('#mattext').css("font-size", '20px');
            $('#f1text').css("font-size", '20px');
            $('#f2text').css("font-size", '20px');
            $('#f3text').css("font-size", '20px');
            $('#f4text').css("font-size", '20px');


            //$('#theclone').attr("transform", 'translate(2000 300)');
        }
        else if(/chrome/i.test( navigator.userAgent )){
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            if (arr[0] < 0)X = parseInt(arr[0]) - 100;
            else X = -100;
            var REALLONG = parseInt(masterRight) * 3.1;
            svgdoc.setAttribute("viewBox", [X + " -10 " + REALLONG + " 1200"]);
            //svgdoc.setAttribute("preserveAspectRatio","none");
            svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
            svgdoc.setAttribute("width",REALLONG + "px");
            svgdoc.setAttribute("height","1000px");
            $('#topsvg').css("overflow-y", "scroll")
            $('#topsvg').css('width', parseInt(masterRight)-100);
            svgdoc.setAttribute('id', 'theclone');
            $('#theclone').css("height", '1000px');
            $('#theclone').css("left", '50px');
            $('#theclone').css("margin-top", '10px');

        }
        else {

            if (arr[0] < 0)X = parseInt(arr[0]) - 100;
            else X = -100;
            var REALLONG = parseInt(masterRight) * 2.8;
            TOTWIDTH = parseInt(TOTWIDTH);
            svgdoc.setAttribute("viewBox", [X + " -10 " + REALLONG + " 1000"]);
            svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
            svgdoc.setAttribute("width",REALLONG + "px");
            svgdoc.setAttribute("height","1000px");
            //svgdoc.setAttribute("preserveAspectRatio","none");

            $('#topsvg').css("overflow-y", "scroll")
            $('#topsvg').css('width', parseInt(masterRight)-100);
            svgdoc.setAttribute('id', 'theclone');
            $('#theclone').css("height", '1000px');
            $('#theclone').css("left", '50px');
            $('#theclone').css("margin-top", '10px');
            //$('#theclone').attr("transform", 'translate(2000 300)');

        }
        var ALLHEIGHT = 2 * parseInt(height);
        $('.namebox').css('font-size','15px');
    }
    else if(selectedVal == '100') {

        nowselected = selectedVal;
        $(mdialog).dialog("close");
        //$(mdialog).find('form')[0].reset();
        xmlload();


    }
}



