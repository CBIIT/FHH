/**
 * Created by hendrikssonm on 9/4/2014.
 */



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
var isIE=0;
var isCHR=0;
var isFF=0;
var HEADERS = new Array;
var weight, height,age,weight_unit,height_unit;
var BMI;
var svgM;

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

var ua = window.navigator.userAgent;
var msie = ua.indexOf("MSIE ");
function xmlload() {
    var lng = window.i18n.lng();
    if (lng=='en-US') {
        lng = 'en';
    };  

    //IE 8
    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){
        var b = parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
        if(b==7 || b==8 || b==9) {
            IEloadTable();
            return;
        }
    }

    /**
     * CLEAN RESTART
     **/
    if( mdialog != null) {
        oTable.fnDraw(true);
        $(mdialog).dialog('destroy').remove();
        mdialog = null;
    }


    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) isIE=1;
    else if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) isCH=1;
    else isFF=1;


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
    var thisMinute = currentdate.getMinutes();
    thisMinute = thisMinute < 10 ? "0"+thisMinute : thisMinute;

    var today =  $.t("fhh_family_pedigree.date_of_report") + ": " +
        day + ", " + month + " "
        + currentdate.getDate() + ", "
        + currentdate.getFullYear() + " "
        + hours + ":"
        + thisMinute + " "
        + mid;



    mdialog = $(
        '<div id="family_pedigree" style="background-color:white">' +
        '<div id="topsvg"> ' +
            //'<svg id="svgframe" version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">' +
        '<svg id="svgframe">' +
            //'<g id="glass" class="">' +
            //'</g>' +
        '</svg>' +
        '</div>' +

        '<div id="main" class="">' +

        '<div id="dialogtext" style="position: absolute;top: 20px"></div>' +

        '<div id="nav" class="sticky">' +
        '<ul>' +
        '<li><a class="top" onclick="ToTop();return false;" href="#">' + $.t("fhh_family_pedigree.go_to_diagram") + '</a></li>' +
        '<li><a class="bottom" onclick="ToTable();return false;" href="#">' + $.t("fhh_family_pedigree.go_to_table") + '</a></li>' +
        '<li><a id="printermain">' + $.t("fhh_family_pedigree.print") + '</a></li>' +
        '<li><a href="#optionsPanelMan" onclick="createDialogMain()">' + $.t("fhh_family_pedigree.diagram_options") + '</a></li>' +
        '<li>' +
        '<select id="zoomer" class="selector" onchange="TheZoomMain(this);">'+
        '<option id="the1" value="100">+100</option>' +
        '<option id="the2" value="200">+200</option>' +
        '</select>' +
        '</li>' +
        '<li>' +
        '<input class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close"' +
        'type="button"role="button" aria-disabled="false" title="close" value="' + $.t("fhh_family_pedigree.close") +'" onclick="closeOther()" style="right:50px;width:50px"></input>' +
        '</li>' +
        '</ul>' +
        '</div>' +
            //'<div id="top"></div>' +
            //'<div class="desc"></div>' +
            //'<div id="bottom" style="height:1px;border-left:solid 1px black"></div>' +
            //'<div class="scroll"></div>' +
        '<div class="info"></div>' +
        '</div>' +


        '<div id="family_pedigree_info" class="brk">' +
        '<div>' +
        '<table id="closed_table" ><tr><td></td></tr></table>' +

        '<table id="health_table" class="display compact" style="margin-top:10px;">' +
        '<caption style="font-size:12px;text-align: left">' + today + '</caption>' +
        '<thead></thead>' +
        '<tfoot></tfoot>' +
        '<tbody></tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>'
    );

    $(mdialog).dialog({
        id: 'maindialog',
        autoOpen: false,
        position: ['top',0] ,
        //position: ['top', '10px'],
        title: 'Family Pedigree Chart',
        minHeight:450,
        height:'auto',
        width: 'auto',
        position: 'fixed',
        modal: false,
        // beforeOpen: function(){



        // },
        open: function () {


            var ex = document.getElementById('health_table');

// oTable.fnDestroy();

            // if (typeof oTable == 'undefined') {

            oTable = $('#health_table').dataTable({
                // "destroy:" true,
                "bPaginate": true,
                //"scrollX": true,
                //"scrollY": "300px",
                //"sScrollY": "250px",
                "bAutoWidth": true,
                "bScrollCollapse": false,
                "bLengthChange": false,
                "bFilter": true,
                "displayLength": 100,
                "dom": '<"toolbar">t<plf>',

                // "dom": '<"top"i>rt<"bottom"flp><"clear">',
                //"dom": 'Rlfrtip','T<"clear">lfrtip',
                tableTools: {
                    "aButtons": ["print"]
                },
                "columns": HEADERS,
                "columnDefs": [
                    {
                        //"targets": [0],
                        "targets": [0, 1],
                        "visible": false,
                        "searchable": false
                    }
                ],
                "aaSortingFixed": [[0, 'desc']]

            });

            $("div.toolbar").html(
                '<div id="lightbox">' +
                '<table width="100%"><tr><td style="width:30%">' +
                '<table id="bmi_table" class="htable">' +
                '<caption>' + $.t("fhh_family_pedigree.personal_info") + '</caption>' +
                '<tr><td id="age">' + $.t("fhh_family_pedigree.age") + '</td></tr>' +
                '<tr><td id="height">' + $.t("fhh_family_pedigree.height") + ' </td></tr>' +
                '<tr><td id="weight">' + $.t("fhh_family_pedigree.weight") + ' </td></tr>' +
                '<tr><td id="abmi">' + $.t("fhh_family_pedigree.bmi") + ' </td></tr>' +
                '</tr></table>' +
                '</td>' +
                '<td style="width:70%;left:auto;right:auto">' +
                '<img id="legendtag" src="../static/images/Legend_' + lng + '.jpg"></img>' +
                '</td>' +
                '</tr></table>' +

                '</div>'
            );
            // }
            $('#health_table').css('width',masterRight);
            var target = $(this);
            $(this).dialog("open");
            $(this).load(LOAD_HEALTH_TABLE());
            PARENTWIDTH = $(this).closest("div").attr("id");
            DIALOGWIDTH = $(this).width();
            SCREENWIDTH = parseInt($(window).width())-100;
            $(this).css("width", SCREENWIDTH);
            var myDialogX = $(this).position().left - $(this).outerWidth();
            //var myDialogY = $(this).position().top - ( $(document).scrollTop() + $('.ui-dialog').outerHeight() );
            $(this).dialog( 'option', 'position', [myDialogX, 40] );
            diseasearray=new Array();
            $("#health_table tr:eq( 1 )").children().css("background-color","#ffffcc");

        },
        beforeClose: function(){
            $(this).position(['top',0]);
            $(this).position('fixed');
        },
        close: function() {
            oTable.fnDestroy();

            $("#health_table").empty();
            diseasearray=new Array();
            $('#optionsPanelMain').dialog('destroy').remove();

            $(this).empty();
            //$(this).dialog('close', true);
            $(".ui-dialog-content").dialog("close");
            $('#maindialog').dialog('destroy').remove();

            // mdialog = null;
            // oTable = null;

            //$(this).find('.ui-dialog-content').dialog('destroy').remove();


        }
    });

    $("#dialogtext").html(
        '<h1>' + $.t("fhh_family_pedigree.title") + '</h1>'+
        '<table class="infolayer">' +
        '<tr><td>' +
        '<p style="margin-bottom: 0px">' + $.t("fhh_load_save.browse") + ' ' + $.t("fhh_family_pedigree.desc_line1") + '</p><br style="line-height: 0px"/>' +
        '<p>' + $.t("fhh_family_pedigree.desc_line2") + '</p>' +
        '</td></tr></table>'
    );

    //No info
    if(typeof personal_information.name == 'undefined'){
        if (confirm("Please enter valid information for a Diagram!")){
            return;
        }
    }

    $(document).ready(function() {

        // var STATICDISEASES = [
        //     $.t("fhh_family_pedigree.heart_disease"),
        //     $.t("fhh_family_pedigree.stroke"),
        //     $.t("fhh_family_pedigree.diabetes"),
        //     $.t("fhh_family_pedigree.colon_cancer"),
        //     $.t("fhh_family_pedigree.breast_cancer"),
        //     $.t("fhh_family_pedigree.ovarian_cancer")
        //     ]

            var STATICDISEASES = [
                'heart disease',
                'stroke/brain attack',
                'diabetes',
                'colon cancer',
                'breast cancer',
                'ovarian cancer'
            ];  


        $.each(personal_information['Health History'], function (key, item) {
            if (item == 'undefined' || item == null) item = "";
            var dn = item['Disease Name'];
            var details =  item['Detailed Disease Name'] ;
            var dc =  $.t("diseases:" + item['Disease Code']);
            window.dc = dc;
            if(dn)dn = dn.toLowerCase();
            if(details)details = details.toLowerCase();
            if(details=='diseases:null') details = "";

            if($.inArray(details.toLowerCase(), STATICDISEASES) == -1) {
                if (diseasearray.length == 0) diseasearray.push([dn,details])
                else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])

            }
        });

        $.each(personal_information, function (key, item) {
            if (item == 'undefined' || item == null) item = "";
            if (item.id) {

                $.each(item['Health History'], function (k, data) {
                    var dn = data['Disease Name'];
                    var details =  data['Detailed Disease Name'];
                    var dc =  $.t("diseases:" + item['Disease Code']);
                    window.dc = dc;
                    if(dn)dn = dn.toLowerCase();
                    if(details)details = details.toLowerCase();
                    if(details=='diseases:null') details = "";

                    if($.inArray(details.toLowerCase(), STATICDISEASES) == -1) {
                        if (diseasearray.length == 0) diseasearray.push([dn,details])
                        else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])
                    }
                });
            }
        });



        HEADERS = new Array;
        HEADERS.push({"title":'Id'});
        HEADERS.push({"title":$.t("fhh_js.name_relationship")});
        HEADERS.push({"title":$.t("fhh_js.name_relationship")});
        HEADERS.push({"title":$.t("fhh_js.still_living")});
        window.da = diseasearray;
        for (var t = 0; t < STATICDISEASES.length; t++) {
            var NAME = STATICDISEASES[t];
            var COL = t + 3;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME.toLowerCase();

            /*
             Get only values that are not static
             */

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" class="closeimg"/></a>' + NAME
            });
        }

        
        for (var i = 0; i < diseasearray.length; i++) {
            var NAME = diseasearray[i][1];

            var COL = i + 9;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME.toLowerCase();

            /*
             Get only values that are not static
             */

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" class="closeimg"/></a>' + NAME
            });
        }

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

    ToTop();
    setTimeout(
        function()
        {
            mdialog.dialog('open');
        }, 500);

    /*
     Start SVG
     */
    $('#svgframe').svg();
    svg = $('#svgframe').svg('get');

    $('#svgframe').draggable();
    //.resizable();

    var LINEGROUP = svg.group({stroke: 'black', strokeWidth: 2});

    //var TOPCLONE = svg.clone( null, rect1)[0];

    var svgw = mdialog.find('#svgframe')[0];
    svgM = svgw;
    svgw.setAttribute('height', '80%');
    svgw.setAttribute('valign', 'top');
    svgw.setAttribute('width', masterRight);
    svgw.setAttribute('margin-top', '5px');


    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 1, 1, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft - 120, 30, $.t("fhh_family_pedigree.paternal"), {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'pattext'});
    svg.text(masterleft + 120, 30, $.t("fhh_family_pedigree.maternal"), {fontWeight: 'bold', fontSize: '14.5', fill: 'gray', id: 'mattext'});

    $('#optionsPanelMain').attr('width', '800px');

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

    weight, height,age,weight_unit,height_unit;
    BMI;
    if(typeof personal_information.weight == 'undefined' || personal_information.weight == null || personal_information.weight == 'null') {
        weight="";
        weight_unit="";
    }
    else{
        weight =  personal_information.weight;
        weight_unit =  personal_information.weight_unit;
        weight_unit = weight_unit + 's'; //added to show pounds or kilograms

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


    if(weight_unit=='kilogram'){
        BMI = BMI_CALCULATE_METRIC(weight, height);
    }
    else {
        BMI = BMI_CALCULATE(weight, height);
    }

    if(typeof BMI == 'undefined' || BMI == null || BMI == 'null') {
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
                ids.push([disname,disdet]);
                dis.push([disname,disdet]);
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
        ids.push([disname,disdet]);
        dis.push([disname,disdet]);
    });

    HEALTHARRAY.push(ids);
    DISEASELISTARRAY.push(dis);



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


    FatherArray.push({"key": 'father',  "id": personal_information['father'].id, "gender":'MALE'});
    var t = {"id": [personal_information['father'].id], "name": [personal_information['father'].name], "gender": ["MALE"],
        key: ['father']};
    NAMEARRAY.push(t);
    
    MotherArray.push({"key": 'mother',  "id": personal_information['mother'].id, "gender":'FEMALE'});
    var t = {"id": [personal_information['mother'].id], "name": [personal_information['mother'].name], "gender": ["FEMALE"],
        key: ['mother']};
    NAMEARRAY.push(t);
    
        

    
    $.each(personal_information, function (key, item) {


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
/*
Already put mother in earlier
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            FatherArray.push({"key": key,  "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
*/

        }
        if (key == 'mother') {
/*
Already put mother in earlier
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            MotherArray.push({"key": key,  "id": id, "gender":item.gender});
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRAY.push(t);
*/
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
                rectstatus(item['id']);
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
                rectstatus(item['id']);
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

        var skip = 650;
        var skipa = 550;

        //Index keys
        // svg.rect(parseInt(skipa) - 30, 40 + pos, 980+150, 100, 1, 1, {
        //     id: 'panel',
        //     fill: 'none',
        //     stroke: 'slategray',
        //     strokeWidth: 1
        // });

        // var kcr = 21;
        // var krr = 40;


        // //Adopted
        // svg.text(10+skipa, 30 + pos, "Adopted", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f1text'});
        // svg.circle(0+skipa, 95 + pos, kcr, {id: 'afd', fill: 'palegoldenrod', stroke: 'black', strokeWidth: 2});
        // svg.rect(50+skipa, 74 + pos, krr, krr, 1, 1, {id: 'ama', fill: 'palegoldenrod', stroke: 'black', strokeWidth: 3});

        // //Live
        // svg.text(100+skip, 30 + pos, "Alive", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f2text'});
        // svg.circle(75+skip, 95 + pos, kcr, {id: 'kfd', fill: gencolor, stroke: 'black', strokeWidth: 2});
        // svg.rect(120+skip, 74 + pos, krr, krr, 1, 1, {id: 'kma', fill: gencolor, stroke: 'black', strokeWidth: 3});

        // //Deceased
        // svg.text(270+skip, 30 + pos, "Deceased", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f3text'});
        // svg.circle(270+skip, 95 + pos, kcr, {id: 'kf', fill: gencolor, stroke: 'black', strokeWidth: 2});
        // svg.rect(325+skip, 74 + pos, krr, krr, 1, 1, {id: 'kmd', fill: gencolor, stroke: 'black', strokeWidth: 2});

        // svg.text(470+skip, 30 + pos, "A non-blood relative or relative through marriage.", {fontWeight: 'bold', fontSize: '22.5', fill: 'gray', id: 'f4text'});
        // svg.rect(570+skip, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: gencolor, stroke: 'black', strokeWidth: 2});
        // svg.circle(690+skip, 95 + pos, kcr, {id: 'ex', fill: 'white', stroke: 'black', strokeWidth: 2});
        // svg.line(LINEGROUP, 570+skip,  95 + pos, 690+skip,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        // svg.circle(820+skip, 95 + pos, kcr, {id: 'ex', fill: gencolor, stroke: 'black', strokeWidth: 2});
        // svg.rect(900+skip, 74 + pos, krr, krr, 1, 1, {id: 'exw', fill: 'white', stroke: 'black', strokeWidth: 2});
        // svg.line(LINEGROUP, 820+skip,  95 + pos, 900+skip,  95 + pos, {id: 'xl', stroke: 'black', strokeWidth: 3});

        //Set live status
        // circlestatus('kf');
        // rectstatus('kmd');

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



    /*
     Tables and other information tools
     */
    LOAD_NAMES(NAMEARRAY);

    ADOPTED_FAMILY();

    $( "#printermain" ).click(function() {

        var container = $(mdialog);
        var tableelement = $( "table" );
        var TABLE = $( container ).find( tableelement );
        var svgelement = $( "svg" );
        var SVG = $( container ).find( svgelement );
        var w = $('#svgframe').attr('width');
        var h = $('#svgframe').attr('height');
        var DISPLAY;

        //var printContent = document.getElementById('svgframe');

        var topsvg = $('#topsvg');
        var healthtable = $('#health_table_wrapper');

        var windowUrl = 'about:blank';
        var uniqueName = new Date();
        var windowName = 'Print' + uniqueName.getTime();
        $('#legendtag').css('visibility', 'hidden'); //Added to not show the Legend belowin Report

        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){

            //Set the pic inside of Div
            // IESVGinPrinter();

            $('#topsvg').css('overflow', 'hidden');
            $('.sticky').hide();
            $('.closeimg').hide();
            $('#health_table_filter').hide();
            $('#health_table_info').hide();
            $('#health_table_paginate').hide();
            $('#legendtag').css('width','300px');
            $('#legendtag').css('height','50px');

            /**** ***/
            // var mySVG=document.getElementById('svgframe')
            // var bb=mySVG.getBBox()
            // orgwidth=bb.width;
            // orgheight=bb.height;

            // var bbw=bb.width/5;
            // var bbh=bb.height/2
            // var angle  =90;
            // mySVG.setAttribute("transform","rotate("+angle+" "+bbw+" "+bbh+")")

            /**** ***/

            $('#dialogtext').hide();
            var DocumentContainer = $(mdialog);
            var WindowObject = window.open('', "Print", "width=800,height=1000,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no");
            WindowObject.document.writeln('<!DOCTYPE html>'
            + '<html><head><title>My Family Health Portrait-Diagram</title>'
            +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'

            + '<p>My Family Health Portrait-Diagram</p>'
            + $(topsvg).html()
            + '<table> <tr> <td> &nbsp;&nbsp;<br clear="all"></td></tr>'
            + '<tr> <td>&nbsp;&nbsp;<br clear="all"></td></tr><tr />'
            + '<tr> <td>&nbsp;&nbsp;<br clear="all"></td></tr>'
            + '</table>'
            + '<img id="legendtag1" height="100px" align="right" src="../static/images/Legend_' + lng + '.jpg" />'
            + '<DIV style="page-break-after:always;height:300px;left:10px"></DIV>'
            + $(healthtable).html()

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
                    $('#topsvg').css('overflow', 'hidden');
                    $('#legendtag').attr('class','');
                    $('#legendtag').css('width','');
                    $('#legendtag').css('height','');
                }
            }, 1000);

            WindowObject.close();
        }
        /**
         *CHROME
         **/
        else if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
            var myWindow=null;
            var prand = Math.floor((Math.random() * 10000) + 1);
            var DISPLAY;

            //Set the pic inside of Div
            fitSVGinPrinter();

            $('#topsvg').css('overflow', 'hidden');
            $('.sticky').hide();
            $('.closeimg').hide();
            $('#health_table_filter').hide();
            $('#health_table_info').hide();
            $('#health_table_paginate').hide();
            $('#svgframe').draggable('disable');
            $('#legendtag').css('width','300px');
            $('#legendtag').css('height','50px');

            var myWindow=window.open(prand,'Print','width=900,height=900,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no');

            $('#bmi_table').css('font-size','15px');

            // $('#svgframe').attr('class', 'gear');
            var printsvg =$('#svgframe');

            var topsvgc = $('#topsvg');
            var healthtable = $('#health_table_wrapper');


            /**** ***/
            var mySVG=document.getElementById('svgframe')
            DISPLAY = $(mySVG).css('display');

            if( DISPLAY != 'none' ) {
                fitSVGinPrinter();
            }


            //legendtag in the down area of print should not show for PRINT.
            <!-- PRINT STARTS HERE -->
            if(DISPLAY != 'none' ) {
                myWindow.document.write('<!DOCTYPE html>'
                    + '<html><head><title>My Family Health Portrait-Diagram</title>'
                    + '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="print">'

                    + '<p>My Family Health Portrait-Diagram</p>'
                    + '<div style="margin-top:100px;margin-left:auto;margin-right:auto">'
                    + $(topsvgc).html()
                    + '</div>'
                    + '<img id="legendtag" height="100px" align="right" src="../static/images/Legend_' + lng + '.jpg"></img>'
                    + '<DIV style="page-break-after:always"></DIV>'
                    + $(healthtable).html()

                    + '</head><body>'
                ); //  height=200px removed
            }
            else if(DISPLAY == 'none' ) {
                myWindow.document.write('<!DOCTYPE html>'
                    + '<html><head><title>My Family Health Portrait-Diagram</title>'
                    + '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="print">'
                    + '<DIV style="page-break-after:none"></DIV>'
                    + $(healthtable).html()
                    + '</head><body>'
                );
            }


            //myWindow.focus();
            myWindow.print();
            myWindow.close();

            <!-- PRINT ENDS HERE -->


            var timer = setInterval(function() {
                if( myWindow.closed) {
                    clearInterval(timer);
                    $('.sticky').show();
                    $('#dialogtext').show();
                    $('.closeimg').show();
                    $('#health_table_filter').show();
                    $('#health_table_info').show();
                    $('#health_table_paginate').show();
                    $('#svgframe').draggable('enable');
                    $('#topsvg').css('overflow', 'hidden');
                    $('#topsvg').attr('class','');
                    $('#legendtag').css('width','');
                    $('#legendtag').css('height','');
                }
            }, 1000);

            myWindow.close();
        }
        else {
            var myWindow=null;
            var prand = Math.floor((Math.random() * 10000) + 1);
            var orgwidth,orgheight;
            var DISPLAY;

            //Set the pic inside of Div
            // ROTATE();

            $('#bmi_table').css('font-size','10px');
            $('.closeimg').css('visibility', 'hidden');
            $('#health_table_filter').hide();
            $('#health_table_info').hide();
            $('#health_table_paginate').hide();
            $('#svgframe').draggable('disable');
            $('.sticky').hide();
            $('#legendtag').css('width','300px');
            $('#legendtag').css('height','50px');


            <!-- PRINT STARTS HERE -->
            var myWindow=window.open(prand,'Print','width=900,height=900,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no');
            var topsvgc = $('#topsvg');
            var healthtable = $('#health_table_wrapper');
            // $(healthtable).css('font-size','15px');
            var printsvg =$('#svgframe');

            /**** ***/
            var mySVG=document.getElementById('svgframe')
            DISPLAY = $(mySVG).css('display');

            if( DISPLAY != 'none' ) {
                fitSVGinPrinter();

                // var bb=mySVG.getBBox()
                // orgwidth=bb.width;
                // orgheight=bb.height;

                // var bbw=bb.width/5;
                // var bbh=bb.height/2
                // var angle  =90;
                // mySVG.setAttribute("transform","rotate("+angle+" "+bbw+" "+bbh+")")
            }

            /**** ***/


            <!-- PRINT STARTS HERE -->
            if(DISPLAY != 'none' ) {
                myWindow.document.write('<!DOCTYPE html>'
                    + '<html><head><title>My Family Health Portrait-Diagram</title>'
                    + '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="print">'

                    + '<p>My Family Health Portrait-Diagram</p>'
                    + $(topsvgc).html()
                    + '<DIV style="page-break-after:always"></DIV>'
                    + $(healthtable).html()

                    + '</head><body>'
                );
            }
            else if(DISPLAY == 'none' ) {
                myWindow.document.write('<!DOCTYPE html>'
                    + '<html><head><title>My Family Health Portrait-Diagram</title>'
                    + '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="print">'

                        // + '<p>My Family Health Portrait-Diagram</p>'
                    //+ $(topsvgc).html()
                    + '<DIV style="page-break-after:always"></DIV>'
                    + $(healthtable).html()
                    + '</head><body>'
                );
            }

            myWindow.focus();
            myWindow.print();
            myWindow.close();

            <!-- PRINT ENDS HERE -->


            var timer = setInterval(function() {
                if( myWindow.closed) {
                    clearInterval(timer);
                    $('.closeimg').show();
                    $('.sticky').show();
                    $('#dialogtext').show();

                    $('#health_table_filter').show();
                    $('#health_table_info').show();
                    $('#health_table_paginate').show();
                    $('#svgframe').draggable('enable');
                    $('#topsvg').css('overflow', 'hidden');
                    $('#topsvg').attr('class','');
                    $('#legendtag').css('width','');
                    $('#legendtag').css('height','');



                }
            }, 1000);
            myWindow.close();
        }
        $('#legendtag').css('visibility', 'visible'); //Added to show the Legend below in screen
    });


    function printDiv(elementId) {
        var popUpAndPrint = function()
        {
            var container = $('#topsvg');
            var svgframe = $('svgframe');

            var width = $('#svgframe').attr('width');
            var height = $('#svgframe').attr('height');


            //var width = parseFloat(svgframe.getAttribute("width"))
            //var height = parseFloat(svgframe.getAttribute("height"))
            var printWindow = window.open('', 'PrintMap',
                'width=' + width + ',height=' + height);
            printWindow.document.writeln(
                '<!DOCTYPE html>'
                + '<html><head><title>Disease Matrix</title>'
                +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
                + $(container).html()
                    //+ printContents
                + '</head><body>'
                //$(container).html()
            );
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        };
        setTimeout(popUpAndPrint, 500);
    }


    function printDivA(divName) {
        var printContents = $(mdialog).find('svg');

        var originalContents = document.body.innerHTML;

        document.body.innerHTML = '<!DOCTYPE html>'
        + '<html><head><title>Disease Matrix</title>'
        +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
        + $(printContents).html()
            //+ printContents
        + '</head><body>';

        //document.body.innerHTML = printContents;

        window.print();

        document.body.innerHTML = originalContents;
    }




    //Qtip app
    $.each(HEALTHARRAY, function (key, value) {
        var temp = "";
        var e, name;

        for (var item in value) {
            e = value[0];
            name = value[1];

            if (value.length > 1 && item != 0 && item != 1) temp = temp + '<li>' + value[item] + '</li>';
            else  temp + '<li> No Disease Report </li>';
        };

        if(typeof name == 'undefined')name = "";
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
            var TITLE = this.key.toString();
            var p1, p2, name1, name2,rel;


            if (NAME == "") {
                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) + 5;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;
                }

            }
            if (ID != "") {
                var splits = new Array();
                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;

                    if(TITLE.indexOf('_')>0){

                        splits = TITLE.split('_');
                        if (splits[0] == 'paternal' || splits[0] == 'maternal')rel = splits[0] + '_' + splits[1];
                        else rel = splits[0];
                    }
                    else rel = TITLE;

                    var REL = '[' + $.t("fhh_family_pedigree." + rel) + ']';
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
                        if (splits[0] == 'paternal' || splits[0] == 'maternal')rel = splits[0] + '_' + splits[1];
                        else rel = splits[0];
                    }
                    else rel = TITLE;

                    // var REL = '[' + $.t("fhh_family_pedigree." + rel) + ']';
                    var REL = '[' + $.t("fhh_family_pedigree." + rel) + ']';

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


    function LOAD_HEALTH(HEALTHARRAY){

        $.each(personal_information, function (key, item) {
            var ID = item.id;
            var NAME = item.name;
            var GEN = item.gender;
            var r = 0;

            if (typeof ID != 'undefined' && ID != null) {

                if(NAME !="") var r = 30;
                else var r = 0;

                //var GEN = $('#'+ID).attr('genders').toUpperCase();

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

        var GEN = $('#me').attr('genders').toUpperCase();

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
            'class': 'infobox'
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
        if ($('#' + mid).attr('genders') == 'male') {
            t1x = parseInt($('#' + mid).attr('x'));
            t1y = parseInt($('#' + mid).attr('y'));
        }
        if ($('#' + mid).attr('genders') == 'female') {
            t1x = parseInt($('#' + mid).attr('cx'));
            t1y = parseInt($('#' + mid).attr('cy'));
        }

        //Confirm parent
        if ($('#' + pid).attr('genders') == 'male') {
            l1 = parseInt($('#' + pid).attr('x'));
            l2 = parseInt($('#' + pid).attr('y'));
        }
        if ($('#' + pid).attr('genders') == 'female') {
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
                        stroke: 'black',
                        strokeWidth: 2,
                        genders: 'female',
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
        var MIDGEN = $('#me').attr("genders")
        var xl = new Array();
        var P1 = new Array();

        var TOTALKIDS = COUNT_FAMILY_KIDS(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS(ChildrenArray);

     //Changed line 2224 for mastery+25 to mastery+20. Was short.
        if (MIDGEN.toUpperCase() == "MALE")svg.line(LINEGROUP, masterx + 65, mastery + 20, masterx + 65, mastery + 130, {
            id: 'childs',
            stroke: 'black',
            strokeWidth: 3
        });
        else svg.line(LINEGROUP, masterx + 45, mastery + 20, masterx + 45, mastery + 130, {id: 'childs', stroke: 'black', strokeWidth: 3});


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
                    var ps = CHILD_START_LINE(PIDGEN,PID);
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
                        //p1 = HAS_RIGHT_SPOUCE(PREVIOUSID,PREVIOUSGEN);
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
        LOAD_SPOUCE_MATERNAL('me', $('#me').attr("genders"))
        CHILD_START_LINE(ChildrenArray, 'ctest');

        STACK_CONNECTOR(ARRAY,'MyKids');
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


        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_GRANDKIDS_GEN(PIDGEN, PID, MIDGEN);
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
                    ps = RIGHT_START_GRANDKIDS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
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


        CONNECTOR(ARRAY,'TEST');


    }


    //Collect the grandchildren
    function GRANDCHILDREN_LOADXX(d1, d2, pid) {
        var MIDGEN = $('#me').attr("genders")
        ////Load my spouce


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
                LOAD_SPOUCE_MATERNAL(PID, $('#'+PID).attr("genders"));
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

                if (key == 0) p1 = parseInt(p1);
                else p1 = parseInt(p1) - 20 - (parseInt(key) * 60);

                if (MIDGEN == 'FEMALE') {svg.circle(p1 + 50, Level5F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
                else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
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
                var PIDGEN = $('#'+PID).attr("genders")
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

                if (MIDGEN == 'FEMALE') {svg.circle(p1 + 45, Level5F - 20, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
                else if (MIDGEN == 'MALE') {svg.rect(p1 + 25, Level5M - 20, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
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
    //    var PIDGEN = $('#me').attr("genders")
    //    //Load my spouce
    //    LOAD_SPOUCE_MATERNAL('me', $('#me').attr("genders"))
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
    //            var ps = SPOTLINE(PID);
    //
    //            single_right_parent_child_connector(PID,MID,MIDGEN,PIDGEN,Level4F);
    //
    //            if (MIDGEN == 'FEMALE') {svg.circle(ps[0] + 65, Level4F - 20, cr, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
    //            else if (MIDGEN == 'MALE') {svg.rect(ps[0] + 20, Level4M - 20, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
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
        var FARRIGHT ="";
        var FARBROS="";

        var BROTHERS = COUNT_FAMILY_KIDS(BrothersArray);
        var NEPHEWS = COUNT_FAMILY_KIDS(NephewArray);
        var PATERNALHALFS = COUNT_FAMILY_KIDS(PaternalHalfSiblingsArray);

        /**\
         *
         * Get the most left X
         */
        if(PATERNALHALFS>0){
            FARRIGHT = COORDINATES_OF_BELOW_LEFT(PaternalHalfSiblingsArray);
        }
        else if(BROTHERS>0){
            FARBROS = COORDINATES_OF_BELOW_LEFT(BrothersArray);
        }

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
                var HALFS;
                var NEPS;
                var BROTS;
                DATAKEY = ARRAY[p].id;
                var ps = START_PAT_GENLINE(PIDGEN, PID, MIDGEN);

                var STARTX=parseInt(ps[0]);

                if(PATERNALHALFS>0){
                    STARTX = parseInt(FARRIGHT) - 100;
                }
                else if(BROTHERS>0){
                    STARTX = parseInt(FARBROS) - 100;
                }
                else {
                    STARTX = parseInt(STARTX) - 100;
                }

                p1 = parseInt(STARTX) - (50);


                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);

                SINGLE_SIDE_START_PATERNAL_CORNER_CONNECTOR(SID,SIDGEN,MID,MIDGEN,Level2M, p1);

                //single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level2M);
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

                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: DATAKEY, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
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

        CONNECTOR(ARRAY,'PATERNALS');

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
        if(MaternalRelatives.length==0)return;
        var sidgen = MotherArray[0].gender;
        var sid = MotherArray[0].id;

        for (t = 0; t < MaternalRelatives.length; t++) {
            var midgen = MaternalRelatives[t][0];
            var mid = MaternalRelatives[t][1];
            var id = MaternalRelatives[t][2];
            var pid = MaternalRelatives[t][3];

            //Do candidate have children
            var cnr = COUNT_KIDS(MaternalCousinArray, mid);

            var side = id.substring(0, 1);
            var key = id.substring(id.indexOf('_')+1, id.length);
            MATERNALDATA.push({"id": id, "value": [midgen, mid, pid], "nr": pnr, "cnr": cnr, "sid": [sidgen,sid]});
            pnr = pnr + 1;
        }
        //SORT
        MATERNALDATA = MATERNALDATA.sort(SortByNr);

        MATERNALS_LOAD(MATERNALDATA);
    }


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
        var FARRIGHT ="";
        var FARSIS="";


        var SISTERS = COUNT_FAMILY_KIDS(SistersArray);
        var NEPHEWS = COUNT_FAMILY_KIDS(NephewArray);
        var MATERNALHALFS = COUNT_FAMILY_KIDS(MaternalHalfSiblingsArray);

        /**\
         *
         * Get the most left X
         */
        if(MATERNALHALFS>0){
            FARRIGHT = COORDINATES_OF_BELOW_RIGHT(MaternalHalfSiblingsArray);
        }
        else if(SISTERS>0){
            FARSIS = COORDINATES_OF_BELOW_RIGHT(SistersArray);
        }

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
                var HALFS;
                var NEPS;
                var SIST;
                DATAKEY = ARRAY[p].id;
                var ps = START_MAT_GENLINE(PIDGEN, PID, MIDGEN);
                var STARTX=ps[0];
                if(MATERNALHALFS>0){
                    STARTX = parseInt(FARRIGHT) + 80;
                    //HALFS=parseInt(PATERNALHALFS)*80;
                }
                else if(SISTERS>0){
                    STARTX = parseInt(FARSIS) + 80;
                }
                else {
                    STARTX = parseInt(STARTX) + 80;
                }

                p1 = parseInt(STARTX) + (80);

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent

                SINGLE_SIDE_START_MATERNAL_CORNER_CONNECTOR(SID,SIDGEN,MID,MIDGEN,Level2M, p1);

                //single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level5M);
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
                //LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
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
                    var KIDS = COUNT_MY_KIDS(MaternalCousinArray, PREVIOUSID);
                    if(KIDS==0)KIDS=1;
                    p1 = parseInt(PREVIOUSP1) + (70 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }
                else {
                    var KIDS = COUNT_MY_KIDS(MaternalCousinArray, PREVIOUSID);
                    if(KIDS==0)KIDS=1;
                    p1 = parseInt(PREVIOUSP1) + (70 + (parseInt(KIDS)*70));
                    p1temp.push(MIDGEN, MID, p1);
                    P1.push(p1temp);
                }

                SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);


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

                var PREVIOUSP1 = P1[P1.length - 1][2];


                //Begin new elemnt
                //if (LINE == 0) {
                var KIDS = COUNT_MY_KIDS(MaternalCousinArray, PREVIOUSID);
                if(KIDS==0)KIDS=1;
                p1 = parseInt(PREVIOUSP1) + (70 + (parseInt(KIDS)*70));
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                //}
                //else {
                //    var KIDS = COUNT_MY_KIDS(MaternalCousinArray, PREVIOUSID);
                //    if(KIDS==0)KIDS=1;
                //    p1 = parseInt(PREVIOUSP1) + (60 + (parseInt(KIDS)*70));
                //    p1temp.push(MIDGEN, MID, p1);
                //    P1.push(p1temp);
                //}


                //var ps = PAT_GENLINE(PREVIOUSGEN, PREVIOUSID);
                //var p1 = ps[0];
                SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR(PREVIOUSID,MID,MIDGEN,PREVIOUSGEN,Level2M, p1);

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


        CONNECTOR(ARRAY,'MATERNALS');


        //Load the polylines
        //MAT_PARENT_CHILD_POLYLINES(MaternalRelatives, MotherArray);

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
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 65;
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
                    var cla = $('#SP_'+mid).attr('genders');
                    if(typeof cla == 'undefined'){count = count + 1;}
                }
            }
        }
        return count;
    }

    /** GET SPOUCE LOCATION **/
    function HAS_RIGHT_SPOUCE(PREVIOUSID,PREVIOUSGEN){
        var p1 = 0;
        var SPI = $('#SP_'+PREVIOUSID).attr('genders');

        if(typeof SPI != 'undefined') {

            var SPGEN = $('#SP_'+PREVIOUSID).attr('genders').toUpperCase();
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
        var SPID = $('#SP_'+PREVIOUSID).attr('genders');
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

    function RIGHT_START_PARENT_COUSINS_GEN(PARENTGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 80;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 25;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 80;
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

    function RIGHT_START_GRANDKIDS_GEN(PARENTGEN, ID, MIDGEN) {

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

    function START_PAT_GENLINE(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 25;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 55;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) - 20;
                p2 = parseInt($('#' + PARENTID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) - 35;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function START_MAT_GENLINE(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 55;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 85;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 50;
                p2 = parseInt($('#' + PARENTID).attr('y'));
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 30;
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
                        var p1;

                        //var check = IS_IN_ARRAY(NephewArray, BID);
                        if(KIDS==1){
                            p1 = PREVIOUSP1 - (parseInt(KIDS) * 145);
                        }
                        else{
                            p1 = PREVIOUSP1 - (parseInt(KIDS) * 105);
                        }

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
                        var check = IS_IN_ARRAY(NephewArray, BID);
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


        var FARRIGHT = COORDINATES_OF_BELOW_LEFT(BrothersArray);


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


                    var ps = LEFT_START_HALF_SIBLINGS_GEN(PIDGEN,PID,MIDGEN);

                    if(typeof FARRIGHT!= 'undefined')p1 = parseInt(FARRIGHT) - 150;
                    else p1 = ps[0] - 60;

                    SINGLE_LEFT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);

                    //Get previous object coordninates
                    p1temp.push(MIDGEN, MID, p1, CNR);
                    P1.push(p1temp);
                    //STACK_CONNECTOR(ARRAY,'PatHalfSib');

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

        var FARRIGHT = COORDINATES_OF_FAMILY(SistersArray,NephewArray);

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

                    if (SistersArray.length > 1) {
                        var d = SistersArray[SistersArray.length - 1];
                        var lx = $('#' + d[1]).attr('cx');
                        if(MIDGEN=='MALE') p1 = parseInt(lx) + 200;
                        else  p1 = parseInt(lx) + 145;
                        //SINGLE_RIGHT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }
                    else {
                        var ps = RIGHT_START_HALF_SIBLINGS_GEN(PIDGEN,PID,MIDGEN);
                        p1 = ps[0];
                        //SINGLE_RIGHT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);
                    }


                    if(typeof FARRIGHT!= 'undefined')p1 = parseInt(FARRIGHT) + 120;
                    else p1 = ps[0] + 40;

                    SINGLE_RIGHT_CORNER_CONNECTOR(PID,MID,MIDGEN,PIDGEN,Level3M, p1);

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
                    if(PREVIOUSCNR==0) var p1 = parseInt(TARGET) + 100;
                    else var p1 = parseInt(TARGET) + (parseInt(PREVIOUSCNR) * 100);

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

        //Are any family children around
        var TOTALGRANDKIDS = COUNT_FAMILY_KIDS(GrandChildrenArray);
        var TOTALMYKIDS = COUNT_FAMILY_KIDS(ChildrenArray);


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
                        var p1 = PREVIOUSP1 + (80 + (parseInt(KIDS)*(parseInt(KIDS) * 75))/parseInt(KIDS));
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
                        var check = IS_IN_ARRAY(NephewArray, SID);

                        var PREVIOUSGEN = P1[P1.length - 1][0];
                        var PREVIOUSID = P1[P1.length - 1][1];
                        var PREVIOUSP1 = P1[P1.length - 1][2];
                        var KIDS = COUNT_KIDS(NephewArray, PREVIOUSID);
                        if(KIDS==0) KIDS=1;

                        var check = IS_IN_ARRAY(NephewArray, SID);

                        var p1 = PREVIOUSP1 + (60 + (parseInt(KIDS)*(parseInt(KIDS) * 45))/parseInt(KIDS));
                        //Just like brothers load, did these steps to resolve Nephew, Niece on Sister error
                        p1 = PREVIOUSP1 + 120;
                        if (check != -1) p1 = parseInt(p1) + 120;

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
                        var KIDS = COUNT_MY_KIDS(ChildrenArray, PID);
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
                    var KIDS = COUNT_MY_KIDS(ChildrenArray, PID);
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
    function SPOTLINE(ID) {
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
                var ps = RIGHT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN, GRANDGROUPS);
                p1 = ps[0];


                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
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
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
            }
        }

        CONNECTOR(ARRAY,'TEST');

    }

    function LOAD_PATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();


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
                    ps = LEFT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
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
    //            stroke: 'black',
    //            strokeWidth: 2,
    //            genders: 'male',
    //            cursor: 'pointer'
    //        });
    //    }
    //    else if (GEN == 'MALE') {
    //        svg.circle(p1, p2, cr, {
    //            id: SPOUCE,
    //            fill: gencolor,
    //            stroke: 'black',
    //            strokeWidth: 2,
    //            genders: 'female',
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

    //Check any array condition if has children
    function COORDINATES_OF_FAMILY(ARRAY1,ARRAY2) {
        var res = -1;
        var amt=0;
        var array = new Array();
        $.each(ARRAY1, function (k, data) {
            var ID = data[1];

            var KIDS = COUNT_SIBLING_KIDS(ARRAY2,ID);
            var  x = SPOTLINE(ID);
            if (KIDS>0) {

                var Nk = parseInt(x[0]);
                array.push(parseInt(x[0])+parseInt(KIDS)*30+60)
            }
            else array.push(x[0]);

        });

        array = array.sort(function(a,b){return b - a}) //Array now becomes [7, 8, 25, 41]
        return array[0];
    }

    //Check any array condition if has children
    function COORDINATES_OF_FAMILY_LEFT(ARRAY1,ARRAY2) {
        var res = -1;
        var amt=0;
        var array = new Array();
        $.each(ARRAY1, function (k, data) {
            var ID = data[1];

            var KIDS = COUNT_SIBLING_KIDS(ARRAY2,ID);
            var  x = SPOTLINE(ID);
            if (KIDS>0) {

                var Nk = parseInt(x[0]);
                array.push(parseInt(x[0])+parseInt(KIDS)*30+60)
            }
            else array.push(x[0]);

        });

        array = array.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]

        return array[0];
    }


    //Check any array condition if has children
    function COORDINATES_OF_BELOW_LEFT(ARRAY1) {
        var res = -1;
        var amt=0;
        var array = new Array();
        $.each(ARRAY1, function (k, data) {
            var GEN = data[0];
            var ID = data[1];
            var p1="";

            if (GEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
            }
            else{
                p1 = parseInt($('#' + ID).attr('cx'));
            }
            array.push(p1);

        });

        array = array.sort(function(a,b){return a - b}) //Array now becomes [41,26,21,13,10]
        return array[0];
    }

    //Check any array condition if has children
    function COORDINATES_OF_BELOW_RIGHT(ARRAY1) {
        var res = -1;
        var amt=0;
        var array = new Array();
        $.each(ARRAY1, function (k, data) {
            var GEN = data[0];
            var ID = data[1];
            var p1="";

            if (GEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
            }
            else{
                p1 = parseInt($('#' + ID).attr('cx'));
            }
            array.push(p1);

        });

        array = array.sort(function(a,b){return b - a}) //Array now becomes [10,13,16,19]

        return array[0];
    }
    //Check array condition if has children
    function COUNT_SIBLING_KIDS(ARRAY, ID) {
        var res = -1;
        var amt=0;


        $.each(ARRAY, function (k, data) {

            if (ID == data[2]) {
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
    function PATERNAL_SPOUCE_CONNECT(ID) {

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
    function MATERNAL_COUSINS_LOAD() {
        var pid, mid, midgen;
        var DATAARRAY = new Array();
        var nr = 0;

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


        //mtemp.sort(SortById);
        DATAARRAY = DATAARRAY.sort(SortByNr);
        LOAD_MATERNAL_COUSINS_OBJECTS(DATAARRAY);

    }

    function LOAD_MATERNAL_COUSINS_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();


        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                var p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
                P1.push(p1temp);
                //Connect to parent
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
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
                    var p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);

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
                    ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    var p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
                    //Connect to parent
                    right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);

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

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);



            }
            else {
                DATAKEY = ARRAY[p].id;
                var PREVIOUSGEN = P1[P1.length - 1][0];
                var PREVIOUSID = P1[P1.length - 1][1];
                var ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
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


        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('genders').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                single_left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
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

                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'black', strokeWidth: 2, genders: 'female', cursor: 'pointer'});}
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

        OBJECTS_CONNECT(objectsarray, ID);
    }


    function SINGLE_SIDE_START_PATERNAL_CORNER_CONNECTOR(PID, PIDGEN, MID, MIDGEN, LEVEL, target1) {
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

    function SINGLE_SIDE_START_MATERNAL_CORNER_CONNECTOR(PID, PIDGEN, MID, MIDGEN, LEVEL, target1) {
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
        if(MIDGEN=='FEMALE')var target1 = parseInt(target1) - 0;
        else var target1 = parseInt(target1) + 20;

        xl.push([[target1, parseInt(LEVEL)-20], [target1, parseInt(LEVEL)-20],[target1,parseInt(LEVEL)-20],[parseInt(p1)+45, parseInt(LEVEL)-20]]);
        svg.polyline(xl, {id: 'Hbss_' + MID, fill: 'none', stroke: 'black', strokeWidth: 3});
    }


    function SINGLE_SIDE_MATERNAL_CORNER_CONNECTOR(PID, MID, MIDGEN, PIDGEN, LEVEL, target1) {
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
     //Replaced 45 with 40 to fix Maternal Uncle Uncle Connection
        xl.push([[target1, parseInt(LEVEL)-20], [target1, parseInt(LEVEL)-20],[target1,parseInt(LEVEL)-20],[parseInt(p1)+40, parseInt(LEVEL)-20]]);


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
            $('#topsvg').css('overflow', 'hidden');
            // $('#svgframe').css("border-bottom", '0');

        }
        else {


            var svgdoc = document.getElementById("svgframe");
            var FRAMEHEIGHT = svgdoc.getAttribute("height");
            var FRAMEWIDTH = svgdoc.getAttribute("width");



            var COMBINEDHEIGHT= parseInt(TABLEHEIGHT) + parseInt(FRAMEHEIGHT) + 300;

            var wscale = parseInt(SVGW) + 200;
            var hscale = parseInt(hei) + 100;

            if(FARLEFT<0) {

                var LARGELEFT = parseInt(FARLEFT) - 150;
                var FULLSCALE = parseInt(wscale) + 300;
                svgdoc.setAttribute("viewBox", LARGELEFT + ' 400 ' + FULLSCALE + ' 260');
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
                $('#topsvg').css('overflow', 'hidden');
            }
            else{
                var LARGELEFT = parseInt(FARLEFT) - 250;
                var FULLSCALE = parseInt(wscale) + 200;

                // svgdoc.setAttribute("viewBox", '20 100 ' + FULLSCALE + '100');
                svgdoc.setAttribute("viewBox",  0 + ' 200 ' + FULLSCALE + ' 260');
                //svgdoc.setAttribute("preserveAspectRatio","none");

                var arr = new Array();
                T = TOPCLONE.getAttribute("viewBox");
                arr = T.split(' ');

                var PANEL =parseInt(arr[3]);
                $('#svgframe').css("margin-top", '10px');
                $('#svgframe').css("border-bottom", '0');
                $('#family_pedigree_info').css("margin-top", PANEL+'px')
                $('#topsvg').css('overflow', 'hidden');
            }
        }
    }
    /*
     Chrome
     */
    else if(/chrome/i.test( navigator.userAgent )){

// fitSVGinDiv(svgw);

        //Draggable change made. The size of default zoom changes. So we added and commented next line
        //$('#svgframe').draggable().enabled;
        if (DIAWIDTH > SVGW) {
            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            var wscale = parseInt(RIGHT_X)*1.5;
            var left = parseInt(LEFT_X) - 110;
            var right = parseInt(RIGHT_X)*0.8;
            hscale = parseInt(SVGH);

            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + ' ' + right);
            svgw.setAttribute("preserveAspectRatio","xMinYMin slice");
            svgw.setAttribute("width",wscale + "px");
            svgw.setAttribute("height","1000px");
            var lft = parseInt(absleft) / 2;

            $('#topsvg').css("overflow-y", "scroll")
            $('#topsvg').css('width', parseInt(masterRight)-10);
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

            var wscale = parseInt(RIGHT_X) + 150;
            var left = parseInt(LEFT_X) - 50;
            var right = parseInt(RIGHT_X)*0.9;
            //wscale = parseInt(SVGW) + 100;
            hscale = parseInt(hei) + 0;
            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + " " + right);
            $('#svgframe').css("margin-top", '10px');
            $('#svgframe').css("height", '1000px');
            $('#topsvg').css('overflow', 'hidden');


            // $('#the2').css('display', 'none');

            infoframemargin = $('#family_pedigree_info').css("margin-top");
            topdivheight = $('#topsvg').css('height');
            topdivwidht = $('#topsvg').css('width');
            TOPCLONE = svg.clone( null, svgw)[0];
            TOPCLONE.setAttribute('visibility','hidden');
            TOPCLONE.setAttribute('height','500px');
        }
    }
    else {

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
            TOPCLONE.setAttribute('height','1000px');

        }
        else {



            var RIGHT_X = allXarray.pop();
            var LEFT_X = allXarray[0];

            var wscale = parseInt(RIGHT_X) + 100;
            var left = parseInt(LEFT_X) - 100;
            hscale = parseInt(hei) + 0;
            svgw.setAttribute('viewBox', left + ' 0 ' + wscale + ' 900');
            $('#svgframe').css("margin-top", '10px');
            $('#svgframe').css("height", '1000px');
            $('#topsvg').css('overflow', 'hidden');


            // $('#the2').css('display', 'none');

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
function LOAD_HEALTH_TABLE(){
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
    temp1.push(personal_information.name + '( Self )');
    var cod = "";


    if(typeof personal_information.age == 'undefined' && typeof personal_information.estimated_age == 'undefined' && typeof personal_information.cause_of_death == 'undefined'){
        cod = $.t("fhh_js.yes");
    }
    else if(typeof personal_information.age != 'undefined' || typeof personal_information.estimated_age != 'undefined' || typeof personal_information.date_of_birth != 'undefined'){
        cod = $.t("fhh_js.yes");
    }
    else{
        cod = $.t("fhh_js.no");
    }

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


    MYSTART_COD = LOAD_DATA(cod,0);
    mystatics = $.merge( $.merge( [], temp1 ), MYSTART_COD );

    //cols = LOAD_DATA(cod,diseasearray.length)


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

        //var temp = new Array();
        if(item!=null && typeof item != 'undefined') {
            var FAMNAME = item.name;
            var RELATION = item.relationship;

            var fullid =  ($.inArray(key, defaultfamilyarray));
            var halfid =  ($.inArray(key.substr(0,key.lastIndexOf('_')), defaultfamilyarray));

            if(typeof FAMNAME == 'undefined') {
                if (fullid != -1) {
                    FAMNAME = key;
                    RELATION = key.substr(key.indexOf('_') + 1, key.length);
                    //}
                }
                else if (halfid != -1) {
                    FAMNAME = key;
                    RELATION = key.substr(0, key.lastIndexOf('_'));
                    //}
                }
            }
            else if (typeof FAMNAME != 'undefined') {
                FAMNAME = FAMNAME + ' (' + RELATION + ')';
            }

            if (typeof FAMNAME != 'undefined') {
                var NAMEREL;
                var NAME = FAMNAME;
                temp1.push(que);

                //var NAMEREL = NAME + '(' + RELATION + ')';
                if(typeof item.relationship != 'undefined'){
                    NAMEREL = FAMNAME;
                }
                else {
                    NAMEREL = RELATION;
                }
                temp1.push(RELATION);
                temp1.push(NAMEREL);
                var COD = "";
                var EST="";

                // if(typeof item.cause_of_death == 'undefined')
                if(typeof item.estimated_death_age!= 'undefined' || item.estimated_death_age!= null) EST=item.estimated_death_age;

                if (typeof item.cause_of_death!= 'undefined'){
                    COD = $.t("fhh_js.no") + ', ' + item.cause_of_death + '(' + EST +')';
                }
                else if(typeof item.age == 'undefined' && typeof item.estimated_age == 'undefined' && typeof item.cause_of_death == 'undefined'){
                    COD = $.t("fhh_js.unknown");
                }
                else if(typeof item.age != 'undefined' || typeof item.estimated_age != 'undefined' || typeof item.date_of_birth != 'undefined'){
                    COD = $.t("fhh_js.yes");
                }
                else{
                    COD = $.t("fhh_js.no") + ', ' + item.cause_of_death  + '(' + EST +')';;
                }

                var START_COD = new Array();
                statics = new Array();
                var diss;

                START_COD = LOAD_DATA(COD,0);
                statics = $.merge( $.merge( [], temp1 ), START_COD );

                for (var k=0; k<STATICDISEASES.length;k++){
                    PRIMARY_DISEASE[k] = "-";
                }

                for (var k=0; k<diseasearray.length;k++){
                    SECONDARY_DISEASE[k] = "-";
                }


                /**
                 * Cause of death
                 */
                if(item.cause_of_death != null || item.detailed_cause_of_death != null){
                    var cd = "";
                    var details = "";
                    if(item.cause_of_death != null)cd = item.cause_of_death.toLowerCase();
                    if(item.cause_of_death != null)details = item.cause_of_death.toLowerCase();
                    if(($.inArray(cd, STATICDISEASES) != -1) || ($.inArray(details, STATICDISEASES) != -1)) {
                        var nr = STATICDISEASES.indexOf(cd.toLowerCase());

                        for (var k=0; k<STATICDISEASES.length;k++){
                            if (k==nr){
                                if(details==null || typeof details=='undefined')details = cd;
                                PRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                                break;
                            }
                        }
                    }

                    for(var i =0;i<diseasearray.length;i++){
                        var b = diseasearray[i][1];
                        if(b==details){
                            if (details == null || typeof details == 'undefined')details = cd;
                            SECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + details + '</div>'
                            break;
                        }
                    }
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
                        START_COD = LOAD_DATA(cod, diseasearray.length)
                        TABLE_DATA_ARRAY = $.merge( $.merge( [], temp1 ), START_COD );
                    }
                }
                else {
                    var START_COD = new Array();
                    START_COD = LOAD_DATA(cod, diseasearray.length)
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
    oTable.fnAddData(DISEASESARRAY);


    $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        // Get the column API object
        var ID = $(this).attr('data-column');
        var TXT = $(this).attr('id');
        var NAME = $(this).attr('name');
        var ID = parseInt(ID) + 1;
        oTable.fnSetColumnVis( ID, false );
        /*
         Infor of the closed diseases
         */


        if($("#closed_table tr td" ).length == 1) {
            $('#closed_table tr').append('<td>' +
                //'<span id="closedtitle" style="font-weight:bold;background-color: white; color: black; padding-right:25px;">Closed Diseases:  </span>' +
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



    SetPersonalInfo();

}


/**
 * END OF xmlload()
 **/


function openTab(TXT){
    var ID = TXT.substr(TXT.indexOf('_')+1 , TXT.length);
    var ID=parseInt(ID)+1;
    oTable.fnSetColumnVis( ID, true );
    $('#'+TXT).remove();
}

//function IS_ADOPTED_FAMILY(id){
//    $('#' + id).attr({fill: 'palegoldenrod'});
//}

function ADOPTED_FAMILY(){
    $.each(personal_information, function (key, item) {
        if(item) {
            var id = item.id;
            if (typeof item == 'object') {
                for (var data in item) {
                    if(data=='adopted'){
                        if (typeof item.adopted != 'undefine') {
                            if (item.adopted == 'true' || item.adopted == true) {
                                $('#' + id).attr({fill: 'palegoldenrod'});
                            }
                        }
                    }
                };
            }
        }
    });
}

function LOAD_TR(cod,nr){
    var START_COD = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) START_COD.push('<td>'+ cod + '</td>');
        else START_COD.push('<td></td>');

    }
    return START_COD;
}

function LOAD_DATA(cod,nr){
    var START_COD = new Array();
    for(var i=0;i<nr+1;i++){
        if(i==0) START_COD.push(cod.toString());
        else START_COD.push(" - ");

    }
    return START_COD;
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

function  BMI_CALCULATE_METRIC(W,H) {
    var finalBmi=0;
    var weight = W;
    var height = H;
    if(weight > 0 && height > 0) {
        //var weight = eval(document.form.weight.value)
        //var height = eval(document.form.height.value)
        var height2 = height / 100
        var BMI = weight / (height2 * height2)
        finalBmi = custRound(BMI, 1);
    }
    return finalBmi.toFixed(2);
}

function custRound(x,places) {
    return (Math.round(x*Math.pow(10,places)))/Math.pow(10,places)
}


function createDialogMain() {
    var allnames = new Array();

    if($("#optionsPanelMain").dialog( "isOpen" ) == true) {
        $("#optionsPanelMain").dialog( "open" );
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




        var $optdialog = $("<div id='optionsPanelMain' width='800px' class='instructions option_dialog' style='width:800px;'><p>"
        + $.t("fhh_family_pedigree.diagram_options_desc")
        + "<table>"
        + "<tr>"
        + "<td>"
        + "<label for='diseaseopts'>" + $.t("fhh_family_pedigree.diagram_options_disease") + "  </label>"
        + "<select id='diseaseopts' onchange='DiseaseDna()'>"
        + array.toString()
        + "<option value='one'></option>"
        + "</select>"
        + "</td>"
        + "</tr>"
        + "<tr>"
        + "<td>"
        + "<input id='bmi' type='checkbox' name='chk_group' value='bmi' onclick='HideInfoMain()' checked />" + $.t("fhh_family_pedigree.diagram_options_checkbox1") + "<br />"
        + "<input id='names' type='checkbox' name='chk_group' value='names' onclick='HideInfoMain()' checked />" + $.t("fhh_family_pedigree.diagram_options_checkbox2") + "<br />"
        + "<input id='diagram' type='checkbox' name='chk_group' value='diagram' onclick='HideInfoMain()' checked/>" + $.t("fhh_family_pedigree.diagram_options_checkbox3") + "<br />"
        + "<input id='table' type='checkbox' name='chk_group' value='table' onclick='HideInfoMain()' checked/>" + $.t("fhh_family_pedigree.diagram_options_checkbox4") + "<br />"
        // + "<input type='button' onclick='CloseInfoMain()' value='" + $.t("fhh_family_pedigree.close") + "'></button>"
        + "<br /><button onclick='CloseInfoMain()'>" + $.t("fhh_family_pedigree.close") + "</button>"
        + "</td>"
        + "</tr></table>"


        + "</p></div>").dialog({
            width: 900,
            position: ['top',100],
            title: $.t("fhh_family_pedigree.diagram_options"),
            close: function (ev, ui) {
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
        if (typeof item != 'undefined'){
            var ID = item.id;
            if (typeof ID != 'undefined') {
                $('#' + ID).attr({fill: 'silver', stroke: 'red'});
            }
        }
    });
}

function DiseaseDna(){

    ClearDna();

    var selectBox = document.getElementById("diseaseopts");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var found = false;

    /**
     * Me values
     */
    // Fixed below code to fix yellow and blue combinations
    $.each(personal_information['Health History'], function (k, data) {
        if(typeof data !='undefined') {
            var ID = 'me';
            var health = new Array();
            health = data;
            $('#' + ID).attr({fill: 'slateblue', stroke: 'black'});
            $.each(health, function (t, value) {
                if (selectedValue == value) {
                    $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                    //found = value;
                    found = true;
                    return false;
                }
                /*
                else if (selectedValue == value) {
                    $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
                    found = value;
                } */
            });
        }
        if (found == true)
           return false;
    });


    $.each(personal_information, function (key, item) {
        if(typeof item !='undefined') {
            var ID = item.id;
            if (typeof ID != 'undefined') {
                $('#' + ID).attr({fill: 'silver'}); //added to reset to silver when onchange comes
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

function HideInfoMain(){

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

function ClearNames(comp){
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
        //oTable.fnSetColumnVis( 0, false );
        oTable.fnSetColumnVis( [0,2],false);
        oTable.fnSetColumnVis( 1,true);

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
        //oTable.fnSetColumnVis( 0, false );
        oTable.fnSetColumnVis( [0,1],false);
        oTable.fnSetColumnVis( 2,true);
    }
}


function CloseInfoMain(){
    $('#optionsPanelMain').dialog('close');
}

function ToTop(){
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

function TheZoomMain(sel) {

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
    //var svgdoc = document. getElementById("svgframe");
    //var svgdoc1 = document.getElementById("svgframe").firstElementChild.parentElement(); //  firstChild;
    var svgdoc = svgM; //sine we have original object use that
   //var svgdoc = svgchild.parent_id("svgframe");
    //var svgdoc = (document.getElementById("svgframe")).contentDocument;

   /* var viewbox = svgdoc.getAttribute("viewBox");
    arr = viewbox.split(' ');
    alert("arr[0]" + arr[0]);
    alert("arr[1]" + arr[1]);
    alert("arr[2]" + arr[2]);
    alert("arr[3]" + arr[3]);

    var mastrght = parseInt(masterRight);
    var myheight = svgdoc.getAttribute("height");
    var mywidth = svgdoc.getAttribute("width");
    alert("mastRight=" + mastrght);
    alert("height=" + myheight);
    alert("width=" + mywidth); */

      if (selectedVal == '200') {
        if(nowselected=='200')return;
        nowselected = selectedVal;

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
            $('#theclone').css("margin-bottom", '200px'); // added margin bottom to separate legend
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
            $('#theclone').css("height", '700px'); //  from 1000px to 700px
            $('#theclone').css("left", '50px');
            $('#theclone').css("margin-top", '10px');

            //var svgdoc = document.getElementById("svgframe");
            /*
            var FRMH = svgdoc.getAttribute("height");
            var FRMW = svgdoc.getAttribute("width");
            var BOXX = svgdoc.getAttribute("viewBox");
            var arr1;
            arr1 = BOXX.split(' ');

            alert("arr1[0]="+arr1[0]);
            alert("arr1[1]="+arr1[1]);
            alert("arr1[2]="+arr1[2]);
            alert("arr1[3]="+arr1[3]);
            alert("FRMHeight="+FRMH);
            alert("FRMWidth="+FRMW);  */
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
            $('#topsvg').css('overflow', 'visible');
            $('#svgframe').css("margin-top", '10px');
            svgdoc.setAttribute('id', 'theclone');
            $('#theclone').css("height", '500px');
            $('#theclone').css("left", '50px');
            $('#theclone').css("margin-top", '10px');
            // $('#theclone').attr("transform", 'translate(2000 300)');

        }
        var ALLHEIGHT = 2 * parseInt(height);
        $('.namebox').css('font-size','15px');
    }
    else if(selectedVal == '100') {
        if(nowselected=='100')return;
        nowselected = selectedVal;

        //var svgdoc = document.getElementById("svgframe");
        //var FRAMEHEIGHT = svgdoc.getAttribute("height");
        //var FRAMEWIDTH = svgdoc.getAttribute("width");
        //var BOX = svgdoc.getAttribute("viewBox");
        //arr = BOX.split(' ');
        var Xarray = new Array();
        var REALLONG = parseInt(masterRight) / 3.1;
 // [left 0 wscale right]

        svgdoc.setAttribute("viewBox",  '-158' + ' 0 ' + '1533' + ' 817.6');
        //svgdoc.setAttribute("viewBox", [X + " -10 " + REALLONG + " 1000"]);
        svgdoc.setAttribute("preserveAspectRatio","xMinYMin meet");
        svgdoc.setAttribute("width",1533 + "px");
        svgdoc.setAttribute("height","1000px");

       // $('#topsvg').css("height", "600px");
        //$('#topsvg').css("width", "800px");
        $('#topsvg').css("width", parseInt(masterRight)-10);
        $('#topsvg').css("overflow-y", "scroll");
        $('#topsvg').css('overflow', 'visible');
        $('#svgframe').css("margin-top", '10px');

        svgdoc.setAttribute('id', 'theclone');
        $('#theclone').css("height", '500px');
        $('#theclone').css("left", '100px');
        $('#theclone').css("margin-top", '15x');


        //$('#theclone').css("left", '50px');
       //$('#theclone').css("margin-top", '10px');
        /*overflow: scroll;*/
        //svgdoc.setAttribute("viewBox", [X + " " + Y + " " + width + " " + height]);

        //svgdoc.setAttribute('id', 'theclone');
       // $('#theclone').css("width", '3000px');
       // $('#theclone').css("height", '600px');
       // $('#theclone').css("left", '50px');
        $('#theclone').css("z-index", '99999');

        $('#pattext').css("font-size", '14.5px');
        $('#mattext').css("font-size", '14.5px');
       // $('#f1text').css("font-size", '14.5px');
      ///  $('#f2text').css("font-size", '14.5px');
      //  $('#f3text').css("font-size", '14.5px');
       // $('#f4text').css("font-size", '14.5px');

       // var nC = svgdoc.createElement("circle");
       // nC.setAttributeNS("cx" , 0.000001 );
       /// nC.setAttributeNS("cy" , 0.000001 );
      //svgdoc.documentElement.appendChild(nC);

        //svgdoc.window.res .svgWindow.refresh();
        //document.body.offsetWidth ;
        //$(mdialog).dialog("close");
        //$(mdialog).find('form')[0].reset();
        //xmlload();*/

    }
}

function fit()
{
// var shrink = $('#svgframe');

    var shrink=document.getElementById('svgframe')

    var bb=shrink.getBBox()
    var bbw=bb.width
    var bbh=bb.height

    var bb=shrink.getBBox()
    var bbx=bb.x
    var bby=bb.y
    var bbw=bb.width
    var bbh=bb.height
    //---'native' center of import---
    NativeCx=bbx+0.7*bbw
    NativeCy=bby+0.7*bbh
    //---create scale: ratio of desired width vs current width--
    var width=1000
    var scale=width/bbw
    //---where to move it---
    var targetX=200
    var targetY=200
    //---move its center to target x,y ---
    var transX=(-NativeCx)*scale + targetX
    var transY=(-NativeCy)*scale + targetY


    //---string append method:---
    shrink.setAttribute("transform","translate("+transX+" "+transY+")scale("+scale+" "+scale+")")

}

var SVGId
function fitSVGinDiv(mySVG){

    var divWH=parseInt(masterRight)



    var FRAMEWIDTH = mySVG.getAttribute("width");

    var bb=mySVG.getBBox()
    var bbw=bb.width
    var bbh=bb.height

    //--use greater of bbw vs bbh--
    if(bbw>=bbh){

        var factor=bbw/divWH
    }
    else{

        var factor=bbh/divWH
    }

    var vbWH=divWH*factor

    var vbX=(bbw-vbWH)/2
    var vbY=(bbh-vbWH)/2
    //---IE/CH---


    mySVG.setAttribute('width','1000')
    mySVG.setAttribute('height','1500')
    mySVG.setAttribute("viewBox", "-100 0 3000 500");//Small
    // mySVG.setAttribute("viewBox", "-100 0 2400 400");//Bigger
    // mySVG.setAttribute("preserveAspectRatio","none");
    mySVG.setAttribute("preserveAspectRatio", "xMinYMin slice");



    //--requred for FF/CH---
    if(isIE==0)
    {
        mySVG.setAttribute("width","200%")
        // mySVG.setAttribute("height","100%")
    }
    else
    {
        mySVG.removeAttribute("width")
        mySVG.removeAttribute("height")
    }
}

var SVGId
function fitSVGinPrinter(){
    var mySVG;

    var divWH=parseInt(masterRight)

    // svgDiv.style.width=divWH+"px"
    // svgDiv.style.height=divWH+"px"


    mySVG=document.getElementById('svgframe');
    if(mySVG==null){  mySVG=document.getElementById('theclone')}

    if(mySVG!=null){
        var bb=mySVG.getBBox()
        var bbw=bb.width
        var bbh=bb.height

        var bbx=bb.x
        var bby=bb.y

        var cx=bbx+.5*bbw
        var cy=bby+.5*bbh

        //--use greater of bbw vs bbh--
        if(bbw>=bbh)
            var factor=bbw/divWH
        else
            var factor=bbh/divWH

        var vbWH=divWH*factor

        var vbX=(bbw-vbWH)/2
        var vbY=(bbh-vbWH)/2
        // mySVG.setAttribute("viewBox",vbX+" "+vbY+" "+vbWH+" "+vbWH)
    }

    // var angle=90;
    // mySVG.setAttribute("transform","rotate("+angle+" "+cx+" "+cy+")")

    //---IE/CH---
    // if(isFF==0)
    // {
    //     var ViewBox=mySVG.viewBox.baseVal
    //     ViewBox.x=vbX
    //     ViewBox.y=vbY
    //     ViewBox.width=vbWH
    //     ViewBox.height=vbWH
    // }
    // else
    //     mySVG.setAttribute("viewBox",vbX+" "+vbY+" "+vbWH+" "+vbWH)

    //--requred for FF/CH---
    if(isIE==0)
    {
        mySVG.setAttribute("width","120%")
        mySVG.setAttribute("height","120%")
    }
    else
    {
        mySVG.removeAttribute("width")
        mySVG.removeAttribute("height")
    }
}


var Finished=true
function ROTATE()
{
    // if(Finished==true) //--allows initial run---
    // {
    Finished=false

    var RotateElem=document.getElementById('svgframe')


    var bb = RotateElem.getBBox();
    var bbx = bb.x + bb.width/2;
    var bby = bb.y + bb.height/2;

    // var bb=RotateElem.getBBox()
    // var bbx=bb.x
    // var bby=bb.y
    var bbw=bb.width
    var bbh=bb.height
    var cx=bbx+.5*bbw
    var cy=bby+.5*bbh
    var angle360=360
    var FPS=100  //---frames per second---
    var duration=2000 //---ms, 1 second---
    var angle=90;
    RotateElem.setAttribute("transform","rotate("+angle+" "+cx+" "+cy+")")

    //----core animation function---
    // new AnimateJS(
    // {
    //     delay: 1000/FPS,
    //     duration: duration,
    //     delta: sineHalf,
    //     output: function(delta)
    //     {
    //         var angle=angle360*delta
    //         RotateElem.setAttribute("transform","rotate("+angle+" "+cx+" "+cy+")")

    //         if(progress==1)
    //         {
    //             RotateElem.removeAttribute("transform")
    //             Finished=true
    //             svgSourceValue.value=topsv.innerHTML
    //         }
    //     }
    // })
    // }
}

function ROTATE_OLD()
{
    var rhombus=document.getElementById('svgframe')
    var mySVG=document.getElementById('svgframe')

    var deg=parseFloat(90)
    var transformRequestObj=mySVG.createSVGTransform()

    var animTransformList=mySVG.transform
    var transformList=animTransformList.baseVal

    var centerX=parseFloat(500)
    var centerY=parseFloat(500)

    transformRequestObj.setTranslate(-centerX,-centerY)
    transformList.appendItem(transformRequestObj)
    transformList.consolidate()

    transformRequestObj.setRotate(deg,0,0)
    transformList.appendItem(transformRequestObj)
    transformList.consolidate()

    // computePolyPoints(rhombus) //--remove transform---
    // rhombus.setAttribute("transform","translate("+(centerX)+" "+(centerY)+")")

    //---show polygon as string---
    // rhombValue.value=new XMLSerializer().serializeToString(rhombus)

    // var bb=rhombus.getBBox()
    // rhombWidthValue.value=bb.width
    // rhombHeightValue.value=bb.height
}

//---changes all transformed points to screen points---
function computePolyPoints(Pgon)
{
    var sCTM = Pgon.getCTM()
    var pointsList = Pgon.points;
    var n = pointsList.numberOfItems;
    for(var m=0;m<n;m++)
    {
        var mySVGPoint = mySVG.createSVGPoint();
        mySVGPoint.x = pointsList.getItem(m).x
        mySVGPoint.y = pointsList.getItem(m).y
        mySVGPointTrans = mySVGPoint.matrixTransform(sCTM)
        pointsList.getItem(m).x=mySVGPointTrans.x
        pointsList.getItem(m).y=mySVGPointTrans.y
    }
    //---force removal of transform--
    Pgon.setAttribute("transform","")
    Pgon.removeAttribute("transform")
}

var SVGId
function IESVGinPrinter(){

    var divWH=parseInt(masterRight)

    // svgDiv.style.width=divWH+"px"
    // svgDiv.style.height=divWH+"px"
    var mySVG=document.getElementById('svgframe')

    var bb=mySVG.getBBox()
    var bbw=bb.width
    var bbh=bb.height

    //--use greater of bbw vs bbh--
    if(bbw>=bbh)
        var factor=bbw/divWH
    else
        var factor=bbh/divWH

    var vbWH=divWH*factor

    var vbX=(bbw-vbWH)/2
    var vbY=(bbh-vbWH)/2
    //---IE/CH---
    // if(isFF==0)
    // {
    //     var ViewBox=mySVG.viewBox.baseVal
    //     ViewBox.x=vbX
    //     ViewBox.y=vbY
    //     ViewBox.width=vbWH
    //     ViewBox.height=vbWH
    // }
    // else
    //     mySVG.setAttribute("viewBox",vbX+" "+vbY+" "+vbWH+" "+vbWH)

    //--requred for FF/CH---
    // if(isIE==0)
    // {
    mySVG.setAttribute("width","120%")
    mySVG.setAttribute("height","120%")
    // }
    // else
    // {
    //     mySVG.removeAttribute("width")
    //     mySVG.removeAttribute("height")
    // }
}


function SetPersonalInfo(){

    if(age != ""){
        $('#age').text('Age: ' + age);
        // $('#age').append($("<span><b></b></span>").text(age));
    }
    if(height != "") $('#height').append($("<span><b></b></span>").text( height + " " + height_unit));
    if(weight != "") $('#weight').append($("<span><b></b></span>").text( weight + " " + weight_unit));
    $('#abmi').append($("<span><b></b></span>").text( BMI));
}

function closeOther() {
  $(mdialog).dialog("close");
}