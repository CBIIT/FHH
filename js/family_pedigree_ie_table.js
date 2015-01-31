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
    'SNOMED_CT-56265001',
    'SNOMED_CT-116288000',
    'SNOMED_CT-73211009',
    'SNOMED_CT-363406005',
    'SNOMED_CT-254837009',
    'SNOMED_CT-363443007'
]; 

function IEloadTable() {


    //IE 8


    /**
    * CLEAN RESTART 
    **/
    if( mdialog != null) {
        oTable.fnDraw(true);
        // $(mdialog).dialog('destroy').remove();
         mdialog = null;         
    }


    if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i)) isIE=1;
    else if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) isCH=1;
    else isFF=1;


    /*
     Get Date
     */
    var options = {weekday: "long", year: "numeric", month: "long", day: "numeric", hour:"numeric",minute:"numeric",hour12:"true"};             
		if (typeof lng == 'undefined') lng = 'en';
    var today = $.t("fhh_family_pedigree.date_of_report") + ": " + new Date().toLocaleString(lng, options);
    mdialog = $(
        '<div id="family_pedigree" style="background-color:white;">' +

        '<div id="main" class="">' +


        '<h1>View Diagram & Table</h1><br/>'+
        '<table class="infolayer">' +
        '<tr><td>' +
        '<p style="margin-bottom: 1px">' + $.t("fhh_diagram.instructions") + 'You can print your family health history in a diagram and table form to share with your health care provider. Talking with your health care provider about your family health history can help you stay healthy!</p><br style="line-height: 0px"/>' +
        '<p>If you would like to change the way the information below is shown, click "Diagram & Table Options." The bottom and right scroll bars are useful navigation tools when viewing larger tables and diagrams.</p>' +
        '</td></tr></table>' +


        '<h2> This feature has been tested and is supported in the following browsers - Internet Explorer 10 and recent versions, Firefox, Chrome, Safari. </h2>' +

        '<div id="dialogtext" style="position: absolute;top: 20px"></div>' +

        '<div id="nav" class="sticky">' +
        '<ul>' +
        '<li><a class="top" onclick="ToTop();return false;" href="#">Go To Diagram</a></li>' +
        '<li><a class="bottom" onclick="ToTable();return false;" href="#">Go To Table</a></li>' +
        '<li><a id="printer">Print</a></li>' +
        '<li><a href="#top" onclick="createDialog()">Diagram & Table Options</a></li>' +
        '<li>' +
        '</li>' +
        '<li>' +
        '<input class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close"' +
        'type="button"role="button" aria-disabled="false" title="close" value="close" onclick="closedialog()" style="right:50px;width:50px"></input>' +
        '</li>' +
        '</ul>' +
        '</div>' +
        '<div class="info"></div>' +
        '</div>' +


        '<div id="family_pedigree_info" class="brk">' +
        '<div style="width:100%">' +
        '<table id="closed_table" ><tr><td></td></tr></table>' +

        '<table id="health_table" class="grid" style="width:100%">' +
        '<caption style="font-size:12px;text-align: left;left:25px;">' + today + '</caption>' +
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
        position: ['left',0] ,
        //position: ['top', '10px'],
        title: 'Family Pedigree Chart',
        minHeight:450,
        height:'auto',
        width: 'auto',
        // position: 'absolute',
        modal: true,
        open: function () {
            var ex = document.getElementById('health_table');

            oTable = $('#health_table').dataTable({
                "bPaginate": true,
                "bAutoWidth": false,
                "bScrollCollapse": false,
                "bLengthChange": false,
                "bFilter": true,
                "displayLength": 100,
                "dom": '<"toolbar">t<plf>',
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
                        '<caption>My Personal Information</caption>' +
                        '<tr><td id="age">Age:</td></tr>' +
                        '<tr><td id="height">Height:</td></tr>' +
                        '<tr><td id="weight">Weight:</td></tr>' +
                        '<tr><td id="abmi">BMI:</td></tr>' +
                        '</tr></table>' +
                    '</td>' +
                    '<td style="width:70%;left:auto;right:auto">' +
                        // '<img id="legendtag" src="../static/images/Legend.png"></img>' + 
                    '</td>' + 
                '</tr></table>' +

                '</div>'
            ); 
            $('#health_table').css('width',masterRight);
            
            var target = $(this);
            $(this).dialog("open");
            $(this).load(LOAD_HEALTH_TABLE());
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
            $('#optionsPanel').dialog('destroy').remove();

            $(this).empty();
            //$(this).dialog('close', true);
            $(".ui-dialog-content").dialog("close");
            $('#maindialog').dialog('destroy').remove();

        }
    });

    $("#dialogtext").html(
    );



    //No info
    if(typeof personal_information.name == 'undefined'){
        if (confirm("Please enter valid information for a Diagram!")){
            return;
        }
    }

    $(document).ready(function() {

 if (personal_information['Health History'] && personal_information['Health History'].length > 0){

        $.each(personal_information['Health History'], function (key, item) {


            if (key == 'undefined' || key == null) key = "";
            if (item == 'undefined' || item == null) item = "";


            var dn = item['Disease Name'];
            var details =  item['Disease Code'] ;
            if(dn)dn = dn.toLowerCase();
            if(details)details = details;
            if(details=='diseases:null') details = "";

            if($.inArray(details, STATICDISEASES) == -1) {
                if (diseasearray.length == 0) diseasearray.push([dn,details])
                else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])

            }
        });

    }

if (personal_information && personal_information.length > 0){


        $.each(personal_information, function (key, item) {
            if (key == 'undefined' || key == null) key = "";
            if (item == 'undefined' || item == null) item = "";
            if (item.id) {

                if (item['Health History'] && item['Health History'].length > 0){  
                $.each(item['Health History'], function (k, data) {
                    var dn = data['Disease Name'];
                    var details =  data['Disease Code'];
                    if(dn)dn = dn.toLowerCase();
                    if(details)details = details;
                    if(details=='diseases:null') details = "";

                    if($.inArray(details, STATICDISEASES) == -1) {
                        if (diseasearray.length == 0) diseasearray.push([dn,details])
                        else if ($.inArray(details, diseasearray[1]) == -1) diseasearray.push([dn,details])
                    }
                });
            }
            }
        });
}

        HEADERS = new Array;
        HEADERS.push({"title":'Id'});
        HEADERS.push({"title":$.t("fhh_js.name_relationship")});
        HEADERS.push({"title":$.t("fhh_js.name_relationship")});
        HEADERS.push({"title":$.t("fhh_js.still_living")});

        for (var t = 0; t < STATICDISEASES.length; t++) {
            var NAME = STATICDISEASES[t];
            var COL = t + 3;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME;

            /*
             Get only values that are not static
             */

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" class="closeimg" style="border:none"/></a>' + NAME
            });
        }
        window.dA = diseasearray;
        for (var i = 0; i < diseasearray.length; i++) {
            var NAME = diseasearray[i][0];
            var COL = i + 9;
            var DID = 'D_' + COL;

            if(NAME)NAME=NAME;

            /*
             Get only values that are not static
             */

            HEADERS.push({"title": '<a class="toggle-vis"  ' +
            'data-column="' + COL + '" id="' + DID + '" name="' + NAME + '" href="#">' +
            '<img src="../static/images/close.png" class="closeimg" style="border:none"/></a>' + NAME
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

    // mdialog.dialog({ position: ['top', 20] });
     $(mdialog).css('left','10px');

    ToTop();
    setTimeout(
        function()
        {
            mdialog.dialog('open');
        }, 500);

    

     weight, height,age,weight_unit,height_unit;
     BMI;

// if (personal_information && personal_information.length > 0){
    if(typeof personal_information.weight == 'undefined' || personal_information.weight == null || personal_information.weight == 'null') {
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
    
// }


    

   


//PRINTER
    $( "#printer" ).click(function() {

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

        if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ){

            //Set the pic inside of Div

        // $('#topsvg').css('overflow', 'hidden');
        $('.sticky').hide();
        $('.closeimg').hide();
        $('#health_table_filter').hide();
        $('#health_table_info').hide();
        $('#health_table_paginate').hide();
        // $('#legendtag').css('width','300px');
        // $('#legendtag').css('height','50px');
        $(healthtable).css('width','100%');
        $(healthtable).css('font-size','12px');
       

            $('#dialogtext').hide();
            var DocumentContainer = $(mdialog);
            var WindowObject = window.open('', "Print", "width=1000,height=1000,top=200,left=200,toolbars=no,scrollbars=yes,status=no,resizable=no");
            WindowObject.document.writeln('<!DOCTYPE html>'
            + '<html><head><title>My Family Health Table</title>'
            +  '<link rel="stylesheet" type="text/css" href="../static/css/pedigree.css" media="all">'
            + '<DIV style="page-break-after:none;height:200px;left:10px"></DIV>'
            + '<p><b>My Family Health Portrait-Table</b></p>'
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
                    // $('#svgframe').draggable('enable');
                    // $('#topsvg').css('overflow', 'hidden');
                    // $('#legendtag').attr('class','');
                    // $('#legendtag').css('width','');
                    // $('#legendtag').css('height','');
                }
            }, 1000);

             WindowObject.close();
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
            var printsvg =$('#svgframe');

/**** ***/
            var mySVG=document.getElementById('svgframe')
             DISPLAY = $(mySVG).css('display');

            if( DISPLAY != 'none' ) {
                fitSVGinPrint();
                
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
                // + $(topsvgc).html()
                        + '<DIV style="page-break-after:always"></DIV>'
                + $(healthtable).html()
                    + '</head><body>'
                );
             }

            myWindow.focus();
            // myWindow.print();
            // myWindow.close();

            <!-- PRINT ENDS HERE -->


            var timer = setInterval(function() {
                if( myWindow.closed) {
                    clearInterval(timer);

            if(DISPLAY != 'none' ) {
                var mySVG=document.getElementById('svgframe')
                var bb=mySVG.getBBox()
                
                var bbw=orgwidth*5;
                var bbh=orgheight*2;
                var angle  = 180;
                mySVG.setAttribute("transform","rotate("+angle+" "+bbw+" "+bbh+")")
            }


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

            // myWindow.close();
        }
    });

    var wscale,hscale;

}


//Build a table of health issues

//IMPORTANT
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
    temp1.push(personal_information.name + ' (' + $.t("fhh_js.self") + ')');
    temp1.push(personal_information.name + ' (' + $.t("fhh_js.self") + ')');
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

    if (personal_information['Health History'] && personal_information['Health History'].length > 0){
        myhealth = personal_information['Health History'];
    }

    for (var k=0; k<STATICDISEASES.length;k++){
        MYPRIMARY_DISEASE[k] = "-";
    }
    for (var k=0; k<diseasearray.length;k++){
        MYSECONDARY_DISEASE[k] = "-";
    }
    MYSTART_COD = LOAD_DATA(cod,0);
    mystatics = $.merge( $.merge( [], temp1 ), MYSTART_COD );

    if(myhealth.length>0) {
         if (myhealth && myhealth.length > 0){  
        $.each(myhealth, function (key, item) {
            var tmp = item['Disease Name'];
            var details = item['Disease Code'];
            var diagage =  item['Age At Diagnosis'] ;
            if(tmp)tmp = tmp.toLowerCase();
            if(details)details=details;
            if(details=='diseases:null') details = "";

            if(($.inArray(tmp, STATICDISEASES) != -1) || ($.inArray(details, STATICDISEASES) != -1)) {
                var nr = STATICDISEASES.indexOf(details);
                for (var k=0; k<STATICDISEASES.length;k++){
                    if (k==nr){
                        if(details==null || typeof details=='undefined')details = tmp;
                        MYPRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + ' (' + $.t("fhh_js."+diagage) + ')' + '</div>'
                        break;
                    }
                }
            }

            for(var i =0;i<diseasearray.length;i++){
                var b = diseasearray[i][1];
                if(b==details){
                    if (details == null || typeof details == 'undefined')details = tmp;
                    MYSECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + ' (' + $.t("fhh_js."+diagage) + ')' + '</div>'
                    break;
                }
            }
        });
        }

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


if (personal_information && typeof personal_information != 'undefined'){
    $.each(personal_information, function(key, item) {
        var temp1 = new Array();
        var temp2 = new Array();
        var statics = new Array();
        var PRIMARY_DISEASE = new Array();
        var SECONDARY_DISEASE = new Array();
        var TOTAL_DISEASE = new Array();

        var fullid =  ($.inArray(key, defaultfamilyarray));
            var halfid =  ($.inArray(key.substr(0,key.lastIndexOf('_')), defaultfamilyarray));

        if(fullid >= 0 || halfid >= 0) {
            var FAMNAME = item.name;
            var RELATION = key;

            var fullid =  ($.inArray(key, defaultfamilyarray));
            var halfid =  ($.inArray(key.substr(0,key.lastIndexOf('_')), defaultfamilyarray));

            if(typeof FAMNAME == 'undefined') {
                if (fullid != -1) {
                    FAMNAME = $.t("fhh_js."+key);
                    RELATION = key.substr(key.indexOf('_') + 1, key.length);
                }
                else if (halfid != -1) {
                    index = parseInt(key.substring(key.lastIndexOf('_')+1))+1
                    FAMNAME = $.t("fhh_js." + key.substring(0,key.lastIndexOf('_'))) + ' ' + index
                    RELATION = key.substr(0, key.lastIndexOf('_'));
                }
            }
            else if (typeof FAMNAME != 'undefined') {
                // get relationship and index if exists and //
                // translate relationship //
                if (halfid != -1) {
                    index = parseInt(key.substring(key.lastIndexOf('_')+1))+1
                    RELATION = $.t("fhh_js." + key.substring(0,key.lastIndexOf('_'))) + ' ' + index
                }
                else {
                    RELATION = $.t("fhh_js." + key);
                }
                // RELATION = key.substr(0,key.indexOf('_')) + " " + key.substr(key.indexOf('_')+1,key.length);
                // RELATION = key.substr(0,key.lastIndexOf('_')) + " " + key.substr(key.lastIndexOf('_')+1,key.length);
                FAMNAME = FAMNAME + ' (' + RELATION + ')';
            }

            if (typeof FAMNAME != 'undefined') {
                var NAMEREL;
                var NAME = FAMNAME;
                temp1.push(que);

                //var NAMEREL = NAME + '(' + RELATION + ')';


                if(typeof RELATION != 'undefined'){
                    NAMEREL = FAMNAME;
                }
                else {
                    NAMEREL = RELATION;
                }


                RELATION = key.substr(0,key.indexOf('_')) + " " + key.substr(key.indexOf('_')+1,key.length);

                temp1.push(RELATION);
                temp1.push(NAMEREL);
                var COD = "";
                var EST="";

                // if(typeof item.cause_of_death == 'undefined')
                if(typeof item.estimated_death_age!= 'undefined' || item.estimated_death_age!= null) EST=item.estimated_death_age;

                if (typeof item.cause_of_death!= 'undefined'){
                    COD = $.t("fhh_js.no") + ', ' + item.cause_of_death + '(' + $.t("fhh_js."+EST) +')';
                }
                else if(typeof item.age == 'undefined' && typeof item.estimated_age == 'undefined' && typeof item.cause_of_death == 'undefined'){
                     COD = $.t("fhh_js.unknown");
                }
                else if(typeof item.age != 'undefined' || typeof item.estimated_age != 'undefined' || typeof item.date_of_birth != 'undefined'){
                    COD = $.t("fhh_js.yes");
                }
                else{
                    COD = $.t("fhh_js.no") + ', ' + item.cause_of_death  + '(' + $.t("fhh_js."+EST) +')';;
                }

                //var COD = ((typeof item.cause_of_death == 'undefined') ? 'Yes' :  'No / ' + item.cause_of_death);
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
                                if(details==null || typeof details=='undefined') details = cd;
                                PRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + '</div>'
                                break;
                            }
                        }
                    }

                    for(var i =0;i<diseasearray.length;i++){
                        var b = diseasearray[i][1];
                        if(b==details){
                            if (details == null || typeof details == 'undefined')details = cd;
                            SECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + '</div>'
                            break;
                        }
                    }
                }


                if (typeof item['Health History'] != 'undefined') {
                    var temp_stat = new Array();

                    if (item['Health History'] && item['Health History'].length > 0){  
                        $.each(item['Health History'], function (key, item) {
                            var tmp = item['Disease Name'];
                            var details =  item['Disease Code'] ;
                            var diagage =  item['Age At Diagnosis'] ;


                            if(tmp)tmp=tmp.toLowerCase();
                            if(details)details=details;
                            if(details=='diseases:null') details = "Other";


                            if(($.inArray(tmp, STATICDISEASES) != -1) || ($.inArray(details, STATICDISEASES) != -1)) {
                                var nr = STATICDISEASES.indexOf(details);
                                for (var k=0; k<STATICDISEASES.length;k++){
                                    if (k==nr){
                                        if(details==null || typeof details=='undefined')details = tmp;
                                        PRIMARY_DISEASE[k] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + ' (' + $.t("fhh_js."+diagage) + ')' + '</div>'
                                        break;
                                    }
                                }
                            }

                            for(var i =0;i<diseasearray.length;i++){
                                var b = diseasearray[i][1];
                                if(b==details){
                                    if (details == null || typeof details == 'undefined')details = tmp;
                                    SECONDARY_DISEASE[i] = '<div style="background-color: #195A88;color: white;padding: 4px 8px 4px 8px">' + $.t("diseases:"+details) + ' (' + $.t("fhh_js."+diagage) + ')' + '</div>'
                                    break;
                                }
                            }
                        });
                    }
                    else {
                        var START_COD = new Array();
                        //alert(diseasearray.length)
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

}
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
            '<span id="closedtitle" style="font-weight:bold;background-color: white; color: black; padding-right:25px;">Hidden Diseases:  </span>' +
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


function createDialog() {
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
if (personal_information['Health History'] && personal_information['Health History'].length > 0){         
        $.each(personal_information['Health History'], function (k, data) {

            //var health = new Array();
            //health = data['Health History'];

            var thename, temp;
            var disname = data['Disease Name'];
            var detdisname = data['Disease Code'];
            if(detdisname=='diseases:null') detdisname = null;
            if (detdisname == null) thename = disname;
            else thename = detdisname;

            if ($.inArray(thename, allnames) == -1) {
                allnames.push(thename);
                array.push("<option id=" + disname + " value='" + detdisname + "'>" + thename + "</option>")
            }
        });
    }

        /**
         * family Values
         */
if (personal_information && personal_information.length > 0){         
        $.each(personal_information, function (key, item) {
            if(item) {
                if (typeof item.id != 'undefined') {
                    if (item['Health History']) {
                        var health = new Array();

                         if (item['Health History'] && item['Health History'].length > 0){  
                            health = item['Health History'];

                            $.each(health, function (k, data) {
                                var thename, temp;
                                var disname = data['Disease Name'];
                                var detdisname = data['Disease Code'];
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
            }
        });
}


        //alert ("detdisname ARRAY Information:" + JSON.stringify(array, null, 2) );


        var $optdialog = $("<div id='optionsPanel' width='800px' class='instructions option_dialog' style='width:800px;'><p>"
        + "You can view, save or print your family health history to share with your health care provider. They can assess your risk for certain diseases, and develop disease prevention strategies that are right for you. You can also share the table with other family members to your your family's disease history. You can change what is shown in the table yourself by selecting from the options below. Please select from the options below what you would like to show on your table."
        + "<table>"
        + "<tr>"
        + "<td>"
        + "<label for='diseaseopts'>Select a disease or condition to highlight in the table  </label>"
        + "<select id='diseaseopts' onchange=''>"
        + array.toString()
        + "<option value='one'></option>"
        + "</select>"
        + "</td>"
        + "</tr>"
            + "<tr>"
            + "<td>"
            + "<input id='bmi' type='checkbox' name='chk_group' value='bmi' onclick='HideInfo()' checked />Show my personal information in the report (such as Date of Birth, Height, or Weight)<br />"
            + "<input id='names' type='checkbox' name='chk_group' value='names' onclick='HideInfo()' checked />Show names of family members in the report<br />"
            // + "<input id='diagram' type='checkbox' name='chk_group' value='diagram' onclick='HideInfo()' checked/>Show drawing (the tree diagram of your family's health history)<br />"
            // + "<input id='table' type='checkbox' name='chk_group' value='table' onclick='HideInfo()' checked/>Show table (your family's health history displayed as a listing table)<br />"
            + "<input type='button' onclick='CloseInfo()' value='close'></button>"
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
        ResetInfo();

        return $optdialog
    }

}



function ClearDna(){
    if (personal_information && personal_information.length > 0){ 
        $.each(personal_information, function (key, item) {
            if (typeof item != 'undefined'){
                var ID = item.id;
                if (typeof ID != 'undefined') {
                    $('#' + ID).attr({fill: 'silver', stroke: 'red'});
                }
            }
        });
    }
}

// function DiseaseDna(){

//     ClearDna();

//     var selectBox = document.getElementById("diseaseopts");
//     var selectedValue = selectBox.options[selectBox.selectedIndex].value;


//     /**
//      * Me values
//      */

//     $.each(personal_information['Health History'], function (k, data) {
//         if(typeof data !='undefined') {
//             var ID = 'me';
//             var health = new Array();
//             health = data;
//             $('#' + ID).attr({fill: 'slateblue', stroke: 'black'});
//             $.each(health, function (t, value) {
//                 if (selectedValue == value) {
//                     $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
//                     found = value;
//                 }
//                 else if (selectedValue == value) {
//                     $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
//                     found = value;
//                 }

//             });
//         }
//     });


//     $.each(personal_information, function (key, item) {
//         if(typeof item !='undefined') {
//             var ID = item.id;
//             if (typeof ID != 'undefined') {
//                 if (item['Health History']) {
//                     var health = new Array();
//                     health = item['Health History'];
//                     $.each(health, function (k, data) {

//                         var detdisname = data['Disease Code'];
//                         var disname = data['Disease Name'];

//                         if (selectedValue == detdisname) {
//                             $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
//                         }
//                         else if (selectedValue == disname) {
//                             $('#' + ID).attr({fill: 'yellow', stroke: 'black'});
//                         }
//                     });
//                 }
//             }
//         }
//     });

// }

function HideInfo(){

    if(document.getElementById("bmi").checked == true) $('#bmi_table').show();
    else if(document.getElementById("bmi").checked == false) $('#bmi_table').hide();

    if(document.getElementById("names").checked == true) ClearNames('show');
    else if(document.getElementById("names").checked == false) ClearNames('hide');

    // if(document.getElementById("diagram").checked == true) {
    //     $('#svgframe').show();
    //     $('#downoptions').hide();
    // }
    // else if(document.getElementById("diagram").checked == false) {
    //     $('#svgframe').hide();
    //     $('#downoptions').show();
    // }

    // if(document.getElementById("table").checked == true) $('#health_table').show();
    // else if(document.getElementById("table").checked == false) $('#health_table').hide();
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


function CloseInfo(){
    $('#optionsPanel').dialog('close');
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

function closedialog(){
    ToTop();
    setTimeout(
        function()
        {
            $(mdialog).dialog("close");
        }, 1000);
}

// function TheZoom(sel) {

//     var allXarray = new Array();
//     var allYarray = new Array();

//     $("#svgframe").each(function() {
//         $('circle').each(function (index) {
//             var cla = $(this).attr('genders')
//             var cx = $(this).attr('cx');
//             var cy = $(this).attr('cy');
//             if (typeof cla != 'undefined') {
//                 cla = $(this).attr('genders').toLowerCase();
//                 if ($.inArray(cx, allXarray) == -1 && cla == 'female') {
//                     allXarray.push(cx);
//                     allYarray.push(cy);
//                 }
//             }
//         });
//     });
//     $("#svgframe").each(function() {
//         $('rect').each(function (index) {
//             var cla = $(this).attr('genders')
//             var x = $(this).attr('x');
//             var y = $(this).attr('y');
//             if (typeof cla != 'undefined') {
//                 cla = $(this).attr('genders').toLowerCase();
//                 if ($.inArray(x, allXarray) == -1 && cla == 'male') {
//                     allXarray.push(x);
//                     allYarray.push(y);
//                 }
//             }
//         });
//     });

//     allXarray = allXarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]
//     allYarray = allYarray.sort(function(a,b){return a - b}) //Array now becomes [7, 8, 25, 41]

//     var selectedVal = sel.options[sel.selectedIndex].value;

//     var arr = new Array();
//     var X=0;
//     var Y=0;
//     var width=500;
//     var height=600;
//     var newX=100;
//     var newY=100;

//     if (selectedVal == '200') {
//         if(nowselected=='200')return;
//         nowselected = selectedVal;

//         var svgdoc = document.getElementById("svgframe");
//         var FRAMEHEIGHT = svgdoc.getAttribute("height");
//         var FRAMEWIDTH = svgdoc.getAttribute("width");
//         var BOX = svgdoc.getAttribute("viewBox");
//         arr = BOX.split(' ');
//         var Xarray = new Array()

//         $("#svgframe").each(function () {
//             $('rect').each(function (index) {
//                 var cla = $(this).attr('genders')
//                 var x = $(this).attr('x');
//                 var y = $(this).attr('y');
//                 if (typeof cla != 'undefined') {
//                     cla = $(this).attr('genders').toLowerCase();
//                     if ($.inArray(x, Xarray) == -1 && cla == 'male') {
//                         Xarray.push(x);
//                     }
//                 }
//             });
//         });

//         Xarray = Xarray.sort(function (a, b) {
//             return a - b
//         }) //Array now becomes [7, 8, 25, 41]

//         var FARLEFT = Xarray[0];

//         width = parseInt(arr[2]) * 0.99;
//         height = parseInt(arr[3]) * 1.50;

//         X = -200;
//         Y = 30;
//         var REALLONG = parseInt(masterRight) * 1.3;

//         var TOTWIDTH = parseInt(width) + (2 * parseInt(X));

//         if (navigator.userAgent.match(/msie/i) || navigator.userAgent.match(/trident/i) ) {
//             var RIGHT_X = allXarray.pop();
//             var LEFT_X = allXarray[0];

//             if (arr[0] < 0)X = parseInt(arr[0]) - 100;
//             else X = -100;

//             var wscale = parseInt(RIGHT_X)*0.5;
//             var left = -Math.abs(RIGHT_X);
//             var right = parseInt(RIGHT_X)*0.01;
//             var REALLONG = parseInt(masterRight) * 3.1;


//             height = parseInt(arr[3]) * 0.40;
//             width = parseInt(arr[2]) * 1.99;
//             X = -200;
//             Y = 80;

//             svgdoc.setAttribute("viewBox",  '-350 100 ' + -20 + ' -15');
//             svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
//             svgdoc.setAttribute("width",REALLONG + "px");
//             svgdoc.setAttribute("height","1000px");

//             $('#topsvg').css("height", "1000px");
//             $('#topsvg').css("overflow", "scroll");
//             $('#theclone').css("left", '50px');
//             $('#theclone').css("margin-top", '10px');
//             /*overflow: scroll;*/
//             //svgdoc.setAttribute("viewBox", [X + " " + Y + " " + width + " " + height]);

//             svgdoc.setAttribute('id', 'theclone');
//             $('#theclone').css("width", '3000px');
//             $('#theclone').css("height", '600px');
//             $('#theclone').css("left", '50px');
//             $('#theclone').css("z-index", '99999');

//             $('#pattext').css("font-size", '20px');
//             $('#mattext').css("font-size", '20px');
//             $('#f1text').css("font-size", '20px');
//             $('#f2text').css("font-size", '20px');
//             $('#f3text').css("font-size", '20px');
//             $('#f4text').css("font-size", '20px');


//             //$('#theclone').attr("transform", 'translate(2000 300)');
//         }
//         else if(/chrome/i.test( navigator.userAgent )){
//             var RIGHT_X = allXarray.pop();
//             var LEFT_X = allXarray[0];

//             if (arr[0] < 0)X = parseInt(arr[0]) - 100;
//             else X = -100;
//             var REALLONG = parseInt(masterRight) * 3.1;
//             svgdoc.setAttribute("viewBox", [X + " -10 " + REALLONG + " 1200"]);
//             //svgdoc.setAttribute("preserveAspectRatio","none");
//             svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
//             svgdoc.setAttribute("width",REALLONG + "px");
//             svgdoc.setAttribute("height","1000px");
//             $('#topsvg').css("overflow-y", "scroll")
//             $('#topsvg').css('width', parseInt(masterRight)-100);
//             svgdoc.setAttribute('id', 'theclone');
//             $('#theclone').css("height", '1000px');
//             $('#theclone').css("left", '50px');
//             $('#theclone').css("margin-top", '10px');

//         }
//         else {
//             if (arr[0] < 0)X = parseInt(arr[0]) - 100;
//             else X = -100;
//             var REALLONG = parseInt(masterRight) * 2.8;
//             TOTWIDTH = parseInt(TOTWIDTH);
//             svgdoc.setAttribute("viewBox", [X + " -10 " + REALLONG + " 1000"]);
//             svgdoc.setAttribute("preserveAspectRatio","xMinYMin slice");
//             svgdoc.setAttribute("width",REALLONG + "px");
//             svgdoc.setAttribute("height","1000px");
//             //svgdoc.setAttribute("preserveAspectRatio","none");

//             $('#topsvg').css("overflow-y", "scroll")
//             $('#topsvg').css('width', parseInt(masterRight)-100);
//             svgdoc.setAttribute('id', 'theclone');
//             $('#theclone').css("height", '1000px');
//             $('#theclone').css("left", '50px');
//             $('#theclone').css("margin-top", '10px');
//             //$('#theclone').attr("transform", 'translate(2000 300)');

//         }
//         var ALLHEIGHT = 2 * parseInt(height);
//         $('.namebox').css('font-size','15px');
//     }
//     else if(selectedVal == '100') {

//         nowselected = selectedVal;
//         $(mdialog).dialog("close");
//         //$(mdialog).find('form')[0].reset();
//         xmlload();


//     }
// }

   

var SVGId
function fitSVGinDiv(mySVG){

    var divWH=parseInt(masterRight)

     

    // svgDiv.style.width=divWH+"px"
    // svgDiv.style.height=divWH+"px"
    // var mySVG=document.getElementById('svgframe')
    var FRAMEWIDTH = mySVG.getAttribute("width");

    var bb=mySVG.getBBox()
    var bbw=bb.width
    var bbh=bb.height

    //--use greater of bbw vs bbh--
    if(bbw>=bbh){

        var factor=bbw/divWH
        // alert(masterRight + "pop =" + FRAMEWIDTH)
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
function fitSVGinPrint(){



    var divWH=parseInt(masterRight)

    // svgDiv.style.width=divWH+"px"
    // svgDiv.style.height=divWH+"px"


    var mySVG=document.getElementById('svgframe')
   



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
    
    var angle=90;
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
        mySVG.setAttribute("width","100%")
        mySVG.setAttribute("height","100%")
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
function IESVGinPrint(){

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
    if(isIE==0)
    {
        mySVG.setAttribute("width","100%")
        mySVG.setAttribute("height","100%")
    }
    else
    {
        mySVG.removeAttribute("width")
        mySVG.removeAttribute("height")
    }
}


function SetPersonalInfo(){

    if(age != ""){
        $('#age').text($.t("fhh_family_pedigree.age") + ' ' + age);
        // $('#age').append($("<span><b></b></span>").text(age));
    }
    if(height != "") $('#height').append($("<span><b></b></span>").text( height + " " + height_unit));
    if(weight != "") $('#weight').append($("<span><b></b></span>").text( weight + " " + weight_unit));
    $('#abmi').append($("<span><b></b></span>").text( BMI));
}
