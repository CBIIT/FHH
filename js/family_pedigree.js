/**
 * Created by hendrikssonm on 9/4/2014.
 */


var mdialog,tdialog;
var original;
var clone;
var masterleft=Math.floor(parseInt($(window).width())/2);
var mastery,masterx;
var x = new Array();
var y = new Array();
var xl = new Array();
var ex,ey;
var diseasearray=['Heart Disease','Stroke','Diabetes','Colon Cancer','Breast Cancer','Ovarian Cancer','Additional Diseases'];

function xmlload() {
    mdialog = $('<div id="family_pedigree" width="100%" class="family_dialog">' +
        '<input align="right" type="button" value="print" onclick="openWin()"/>' +
        '<input align="right" type="button" value="pivot" onclick="GET_FAMILY()"/>' +
        '<div id="family_pedigree_info">' +
        '<table id="health_table">' +
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
        height: 1000,
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

    //$('#view_diagram_and_table_button').click(function() {
    //    mdialog.dialog('open');
    //    //$('#family_pedigree').dialog('open');
    //        // prevent the default action, e.g., following a link
    //        return false;
    //    });


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
    var top=350
    var corner;
    var gencolor = 'silver';
    var spoucecolor = 'white';

    var array = new Array();
    var grantparentalsarray = new Array();
    var grantmaternalsarray = new Array();
    var fatherarray = new Array();
    var motherarray = new Array();
    var healtharray = new Array();
    var widtharray = new Array();
    var niecearray = new Array();
    var nephewarray = new Array();
    var siblingsarray = new Array();
    var brotherssarray = new Array();
    var sistersarray = new Array();
    //var level1 = new Array();
    var daughter1 = new Array();
    var childrenarray = new Array();
    var maternalcousin = new Array();
    var paternalcousin = new Array();
    var paternalrelatives = new Array();
    var maternalrelatives = new Array();
    //var son1 = new Array();
    //var levelneg1 = new Array();
    //var levelneg2 = new Array();

    //Start SVG
    mdialog.dialog('open');
    mdialog.svg();

    //Set SVG frame
    var svg = mdialog.svg('get');
    var g = svg.group({stroke: 'black', strokeWidth: 2});
    var svgw = mdialog.find('svg')[0];

    svgw.setAttribute('id', 'svgframe');
    svgw.setAttribute('width', '100%');
    svgw.setAttribute('height', '100%');
    //svgw.setAttribute('viewBox','-700 -25 2200 1800');
    svgw.setAttribute('viewBox','0 0 2200 1800');

    svgw.setAttribute('preserveAspectRatio', 'xMinYMin meet')

    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 1, 1, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft-120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft+120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});

    svg.line(g, masterleft-100, 220, masterleft + 120, 220,{id: 'mel', stroke: 'black'});
    svg.line(g,  masterleft+25, 220,  masterleft+25, top,{id: 'mei', stroke: 'black'});

    svg.line(g,  masterleft+25, 220,  masterleft+25, top,{id: 'grmei', stroke: 'black'});

    svg.line(g, masterleft-140, 220,  masterleft+180, 220,{id: 'grmei1', stroke: 'black'});

    svg.line(g, masterleft-140, 200,  masterleft-140, 70,{id: 'grmei2', stroke: 'black'});
    svg.line(g, masterleft+180, 200,  masterleft+180, 70,{id: 'grmei3', stroke: 'black'});


    //Gender
    if (personal_information.gender == 'MALE') {
        //Center Me
        svg.rect( masterleft, top, rr, rr, 1, 1, {
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

        svg.circle(masterleft+25, top, cr, {
            id: 'me',
            class: 'female',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
        masterx = parseInt($('#me').attr('cx'));
        mastery = parseInt($('#me').attr('cy'));
    }
    $.each(personal_information, function (key, item) {
        if (item == 'undefined' || item == null) item = "";

        if (item.id) {
            var ids = new Array();
            ids.push(item.id)
            ids.push(item.name)
            $.each(item['Health History'], function (k, data) {
                ids.push(data['Disease Name'])
            });
            healtharray.push(ids);
        }
    });


    //Set the master Y levels

    var Level4F = mastery + 170;
    var Level4M = mastery + 150;

    var Level3F = mastery;
    var Level3M = mastery -20 ;


    var Level2F = mastery -130;
    var Level2M = mastery - 150;
    var NAMEARRY = new Array();





    //Prepare all data to array formats for processing
    $.each(personal_information, function (key, item) {
        var rand = Math.floor((Math.random() * 10000) + 1);
        if(item == 'undefined' || item == null) item = "";

        //if (item.id) {
        //    var ids = new Array();
        //    ids.push(item.id)
        //    ids.push(item.name)
        //    $.each(item['Health History'], function (key, item) {
        //        ids.push(item['Disease Name'])
        //    });
        //    healtharray.push(ids);
        //}
        if (key=='paternal_grandmother' || key=='paternal_grandfather' ){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            grantparentalsarray.push([item.gender,id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        if (key=='maternal_grandmother' || key=='maternal_grandfather' ){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            grantmaternalsarray.push([item.gender,id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        if (key=='father' ){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            fatherarray.push([item.gender,id,item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        if (key=='mother' ){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            motherarray.push([item.gender,id,item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }

        if(key.substring(0,13) == "paternal_aunt"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            array.push('PARENTALS');

            paternalrelatives.push([item.gender,id,'PA_' + key.substring(14,15),item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,14) == "paternal_uncle"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            array.push('PARENTALS');
            paternalrelatives.push([item.gender,id,'PU_' + key.substring(15,16),item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,13) == "maternal_aunt"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            array.push('MATERNALS');
            maternalrelatives.push([item.gender,id,'MA_' + key.substring(14,15),item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,14) == "maternal_uncle"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            array.push('MATERNALS');
            maternalrelatives.push([item.gender,id,'MU_' + key.substring(15,16),item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,6) == "nephew" || key.substring(0,5) == "niece") {
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            nephewarray.push([item.gender,id,item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,15) == "maternal_cousin"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            //maternalcousin.push([item.gender,id,key.substring(16,17),item.parent_id]);
            //alert(id + " -- " + item.parent_id)
            maternalcousin.push([item.gender,id,item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,15) == "paternal_cousin"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            paternalcousin.push([item.gender,id,item.parent_id]);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 7) == "brother") {
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            brotherssarray.push(['MALE',id,'PB_'+key.substring(8,9),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 20) == "paternal_halfbrother") {
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            brotherssarray.push(['MALE',id,'PHB_' +key.substring(21,22),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 20) == "maternal_halfbrother") {
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            brotherssarray.push(['MALE',id,'MHB_' +key.substring(21,22),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,6) == "sister"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            sistersarray.push(['FEMALE',id,'MS_' +key.substring(7,8),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,19) == "paternal_halfsister"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            sistersarray.push(['FEMALE',id,'PHS_' +key.substring(21,21),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        else if(key.substring(0,19) == "maternal_halfsister"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            sistersarray.push(['FEMALE',id,'MHS_' +key.substring(21,21),'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
        //else if(key.substring(0,6) == "sister") {
        //    var id;
        //    if(item.id=="" || item.id==null)id=key+rand;
        //    else id=item.id;
        //    siblingsarray.push(['FEMALE',id,key,item.parent_id]);
        //    var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
        //    NAMEARRY.push(t);
        //}
        else if(key.substring(0,8) == "daughter"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            childrenarray.push(['FEMALE',id,key,'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);

        }
        else if(key.substring(0,3) == "son"){
            var id;
            if(item.id=="" || item.id==null)id=key+rand;
            else id=item.id;
            childrenarray.push(['MALE',id,'me']);
            var t = {"id":[item.id], "name":[item.name], "gender":[item.gender]};
            NAMEARRY.push(t);
        }
    });


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
    if(childrenarray.length>0) children_load(p1, p2, pid);


    //Begin process
    $.each(personal_information, function (key, item) {

        if (key=='paternal_grandmother' ){
            var mleft = masterleft-30;
            var id = item['id'];
            if(id=="" || id==null)id="pGM";
            //Prepare line shift in case of aunts/uncles
            //if ( ($.inArray('PARENTALS', array) > -1) == true){
            svg.circle(mleft-45, 70, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //}
            //else{
            //    svg.circle(mleft, 70, cr, {id: item['id'], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //}

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key=='paternal_grandfather' ){
            var mleft = masterleft-185;
            var id = item['id'];
            if(id=="" || id==null)id="pGF";
            //Prepare line shift in case of aunts/uncles
            //if ( ($.inArray('PARENTALS', array) > -1) == true){
            svg.rect(mleft-35, 50, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //svg.line(g, mleft, 70, mleft + 130, 70, {id: 'pgl', stroke: 'blue'});
            //}
            //else {
            //    svg.rect(mleft, 47, rr, rr, 1, 1, {id: item['id'], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //    svg.line(g, mleft, 70, mleft + 130, 70, {id: 'pgl', stroke: 'black'});
            //}

            SPOUCE_CONNECT(id);

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Paternal Grand Parents
        if (key=='maternal_grandmother' ){
            var mleft = masterleft+200;
            var id = item['id'];
            if(id=="" || id==null)id="mGM";
            //if ( ($.inArray('MATERNALS', array) > -1) == true){
            svg.circle(mleft+45, 70, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //svg.line(g, mleft-80, 70, mleft+50, 70,{id: 'mgl', stroke: 'black'});
            //svg.line(g, mleft-20, 70,  mleft-20, 170,{id: 'mline', stroke: 'black'});
            //}
            //else{
            //    svg.circle(mleft, 70, cr, {id: item['id'], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //    svg.line(g, mleft-140, 70, mleft+10, 70,{id: 'mgl', stroke: 'black'});
            //    svg.line(g, mleft-60, 70, mleft-60, 170,{id: 'mline', stroke: 'black'});
            //}

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key=='maternal_grandfather' ){
            var mleft = masterleft+60;
            var id = item['id'];
            if(id=="" || id==null)id="mGF";
            //if ( ($.inArray('MATERNALS', array) > -1) == true){
            svg.rect(mleft+40, 50, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //}
            //else{
            //    svg.rect(mleft, 47, rr, rr, 1, 1, {id: item['id'], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            //}
            SPOUCE_CONNECT(id);
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Father
        if (key=='father' ){
            var mleft = masterleft-160;
            svg.rect(mleft, 200, rr, rr, 1, 1, {id: fatherarray[0][1], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            svg.line(g, mleft+20, 170, mleft+20, 200,{id: 'fst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Mother
        if (key=='mother'){
            var mleft = masterleft+180;
            svg.circle(mleft, 220, cr, {id: motherarray[0][1], fill: gencolor, stroke: 'red', strokeWidth: 2, cursor: 'pointer', class: item.gender });
            svg.line(g, mleft, 170, mleft, 200,{id: 'mst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }




        if (typeof item == 'object') {
            var otop=280;
            var mtop=otop+20;
            var ftop=otop+40;
            var mats = 0;
            var pats = 0;

            if (key.substring(0, 7) == "brother") {
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,6) == "sister"){
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus(item['id']);
                }
            }

            else if(key.substring(0,13) == "paternal_aunt"){
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus(item['id']);
                }
            }

            else if(key.substring(0,14) == "paternal_uncle"){
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,13) == "maternal_aunt"){
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus(item['id']);
                }
            }

            else if(key.substring(0,14) == "maternal_uncle"){
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,15) == "maternal_cousin"){
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,15) == "paternal_cousin") {
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,5) == "niece") {
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
                    right_end_line(p1,p2,r,pw);
                    nieces(no,p1,p2,pid,mid);
                }
                else {
                    sl = sl + 80;
                    right_end_line(p1,p2,sl,pw);
                    nieces(no,p1,p2,pid,mid);
                }
            }
        }
        else{

        }

        var pos = 550;
        var k = svg.group({stroke: 'red', strokeWidth: 2, 'z-index' : '9999'});

        //Index keys
        svg.rect(30, 570, 400, 100, 1, 1, {
            id: 'panel',
            fill: 'none',
            stroke: 'silver',
            strokeWidth: 1
        });

        var kcr = 21;
        var krr = 40;

        //Live
        svg.text(100, 10+pos, "Alive", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
        svg.circle(75, 75+pos, kcr,{id: 'kfd',fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(120, 54+pos, krr, krr, 1, 1, {id: 'kma',fill: gencolor, stroke: 'red', strokeWidth: 2});

        //Deceased
        svg.text(270, 10+pos, "Deceased", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
        svg.circle(270, 75+pos, kcr, {id: 'kf', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(325, 53+pos, krr, krr, 1, 1, {id: 'kmd',fill: gencolor, stroke: 'red', strokeWidth: 2});

        //Set live status
        circlestatus('kf');
        rectstatus('kmd');

    });

    //Grand parents loading
    parental_grans_load();
    maternal_grans_load();
    //Load Brothers
    brothers_load();
    //Load Sisters
    sisters_load();

    //Load Maternal Uncle/Aunt
    maternals_load();
    //Load Maternal Cousins
    maternalcousins_load();
    //Load Paternal Uncle/Aunt
    paternals_load();
    //Load paternal Cousins
    paternalcousins_load();
    //Load Nephews
    maternal_nephews_load();
    paternal_nephews_load()


    //tableCreate();

    //Ensure the table is belw
    var SVG = document.getElementById('svgframe');
    var parent = SVG.parentNode;
    var TBL = parent.firstChild;
    parent.insertBefore(SVG, TBL);

    LOAD_NAMES(NAMEARRY);
    LOAD_TEXT(healtharray);



    $.each( healtharray, function( key, value ) {
        var temp="";
        var e,name;

        for (var item in value) {
            e = value[0];
            name = value[1];

            if(value.length>1 && item!=0 && item!=1) temp =  temp + '<li>' + value[item] + '</li>';
            else  temp + '<li> No Disease Report </li>';
        };

        $('#' + e).qtip({
            overwrite: false,
            content: {
                text: '<div align="left" width="300px" class="pop">' +
                '<ul class="navlist">' + temp + '</ul></div>',
                title: {
                    text: '<p class="qtitle">' + name + ': Diseases</p>',
                    button: true
                }
            },
            show: {
                event: 'click',
                solo: true,
                ready: false,
                effect: function(offset) {
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
                target: $('#'+e)
            },
            position: {
                target: 'mouse', // Position at the mouse...
                adjust: { mouse: false } // ...but don't follow it!
            },
            hide: {
                leave: false,
                distance: 100,
                effect: function(offset) {
                    $(this).slideDown(100); // "this" refers to the tooltip
                }
            },
            prerender: true,
            overwrite: true,
            //onHide: function() { $(this).qtip('destroy'); },
            events: {
                show: function(api, event) {
                    $('#'+e).attr('stroke', 'blue');

                },
                hide: function(api, event) {
                    $('#' + e).attr('stroke', 'red');
                    //$('#' + e).qtip('destroy');
                    //return $(this).qtip('destroy');
                }
                //hide: function(event, api) {
                //    api.destroy(true); // Destroy it immediately
                //}
            },
            style: {
                classes: 'qtip-bootstrap'
            }
        });
    });

    function LOAD_NAMES(NAMEARRY) {
        var k;
        var dis = new Array();
        $.each(NAMEARRY, function () {
            //$(NAMEARRY).each(function() {
            var temp = new Array();
            var ID=this.id;
            var NAME = this.name;
            var GEN = this.gender;
            var p1,p2,name1,name2;
            if(ID!=""){

                if(GEN == "FEMALE"){
                    p1 = parseInt($('#'+ID).attr('cx'))  -20;
                    p2 =  parseInt($('#'+ID).attr('cy'))+ 40;
                    temp = NAME.toString().split(' ');
                    name1 = temp[0].substr(0,10);
                    name2 = temp[1].substr(0,10);

                    svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '14.5', fill: 'red'});
                    svg.text(p1, p2+20, name2.toString(), {fontWeight: 'bold', fontSize: '14.5', fill: 'red'});
                }
                else{

                    p1 =  parseInt($('#'+ID).attr('x')) + 5;
                    p2 =  parseInt($('#'+ID).attr('y')) + 60;

                    temp = NAME.toString().split(' ');
                    name1 = temp[0].substr(0,8);
                    name2 = temp[1].substr(0,8);

                    svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '14.5', fill: 'red'});
                    svg.text(p1, p2+20, name2.toString(), {fontWeight: 'bold', fontSize: '14.5', fill: 'red'});
                }


            }
        });
    }


    function LOAD_TEXT(healtharray){
        var k;
        var dis = new Array();


        for(t==0;t<healtharray.length;t++) {

            var tmp = new Array();
            var id = healtharray[t][0];
            var name = healtharray[t][1];

            var dis1 = healtharray[t][2];
            var dis2 = healtharray[t][3];
            var dis3 = healtharray[t][4];

            if (dis1!=null)tmp.push(dis1)
            if (dis2!=null)tmp.push(dis2)
            if (dis3!=null)tmp.push(dis3)
            dis.push({"id":id, "name":name, "value":tmp});
        }

        for(k=0;k<dis.length;k++) {
            var tid = dis[k].id;
            var tname = dis[k].name;
            var tvals = dis[k].value;
            var tsplit = new Array();


            //if(tname)

            var gender = $('#' + tid).attr("class");
            if(typeof gender == 'undefined')gender="NA";
            if (gender.toUpperCase() == 'FEMALE') {
                p1 = $('#' + tid).attr("cx") - 20;
                p2 = parseInt($('#' + tid).attr("cy")) + 55;
            }
            else {
                p1 = $('#' + tid).attr("x");
                p2 = parseInt($('#' + tid).attr("y")) + 75;
            }

            if(tname.indexOf(' ')!=-1){
                tsplit = tname.split(' ');

                //svg.text(p1, parseInt(p2), tsplit[0].substr(0,5), {
                //    fontWeight: 'bold',
                //    fontSize: '12.5',
                //    fill: 'navy',
                //    stroke: 'navy',
                //    'stroke-width': '0.5',
                //    //textLength: '50px',
                //    lengthAdjust: 'spacingAndGlyphs',
                //    class: 'infobox'
                //});
                //svg.text(p1, parseInt(p2)+10, tsplit[1].substr(0,5), {
                //    fontWeight: 'bold',
                //    fontSize: '12.5',
                //    fill: 'navy',
                //    stroke: 'navy',
                //    'stroke-width': '0.5',
                //    //textLength: '50px',
                //    lengthAdjust: 'spacingAndGlyphs',
                //    class: 'infobox'
                //});
                if(tvals.length>0) {
                    var r = 0;
                    for(t=0;t<tvals.length;t++) {
                        if(t==0) r = parseInt(r) + 25;
                        else r = parseInt(r) + 12;
                        svg.text(p1, parseInt(p2) + r, ' - ' + tvals[t].substring(0,5), {
                            fontWeight: 'bold',
                            fontSize: '12.5',
                            fill: 'navy',
                            stroke: 'red',
                            'stroke-width': '0.5',
                            //textLength: '50px',
                            lengthAdjust: 'spacingAndGlyphs',
                            class: 'infobox'
                        });
                    }
                }

            }
            else {
                svg.text(p1, parseInt(p2), tname, {
                    fontWeight: 'bold',
                    fontSize: '12.5',
                    fill: 'navy',
                    stroke: 'navy',
                    'stroke-width': '0.5',
                    //textLength: '50px',
                    lengthAdjust: 'spacingAndGlyphs',
                    class: 'infobox'
                });
                if(tvals.length>0) {
                    var r = 0;
                    for(t=0;t<tvals.length;t++) {
                        if(t==0) r = parseInt(r) + 15;
                        else r = parseInt(r) + 12;
                        svg.text(p1, parseInt(p2) + r, ' - ' + tvals[t].substring(0, 5), {
                            fontWeight: 'bold',
                            fontSize: '12.5',
                            fill: 'navy',
                            stroke: 'red',
                            'stroke-width': '0.5',
                            height: '200',
                            //textLength: '50px',
                            lengthAdjust: 'spacingAndGlyphs',
                            class: 'infobox'
                        });
                    }
                }
            }




        }
    }








    //Draws polyline to the left side of the diagram
    //Draws polyline to the left side of the diagram
    function left_line(pid,mid,mode) {
        var t1x,t1y,t2,t3,l1, l2;

        var tid = $('#' + pid).attr('id');
        var points = $('#P_' + pid).attr('points');
        if(typeof points != 'undefined'){
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

        swapline(pid,l1,l2,t1x,t1y,t2,t3,mode,'left')
    }

    //    svg.polyline(
    //        [
    //            [parseInt(p1),parseInt(p2)+20],
    //            [parseInt(p1), parseInt(p2)+45],
    //            [parseInt(p1)-130, parseInt(p2)+45],
    //            [parseInt(p1)-130,parseInt(p2)+90]
    //        ],
    //        {fill: 'none', stroke: 'black', strokeWidth: 2});
    //}

    //Draws connecting polyline rect
    function connect_rect_line(a1,a2,no){
        svg.polyline(
            [
                [parseInt(a1)+20,parseInt(a2)+100],
                [parseInt(a1)+20, parseInt(a2)+85],
                [parseInt(a1)+80, parseInt(a2)+85],
                [parseInt(a1)+80,parseInt(a2)+100]
            ],
            {fill: 'none', stroke: 'green', strokeWidth: 2});
    }

    //Draws connecting polyline circle
    function connect_circle_line(a1,a2,no){
        svg.polyline(
            [
                [parseInt(a1),parseInt(a2)+100],
                [parseInt(a1), parseInt(a2)+65],
                [parseInt(a1)+60, parseInt(a2)+65],
                [parseInt(a1)+60,parseInt(a2)+100]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    //Draws ending polyline to the left side of the diagram
    function left_end_line(p1,p2,c,pw){
        var col = parseInt(c-p1);
        svg.polyline(
            [
                [parseInt(p1)+pw/2,parseInt(p2)],
                [parseInt(p1)+pw/2, parseInt(p2)-20],
                [parseInt(p1)+col, parseInt(p2)-20],
                [parseInt(p1)+col,parseInt(p2)+20]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 2});

    }

    //Draws ending polyline to the right side of the diagram
    function right_end_line(p1,p2,c,pw){
        var col = parseInt(p1-c);

        svg.polyline(
            [
                [parseInt(p1)+pw/2,parseInt(p2)],
                [parseInt(p1)+pw/2, parseInt(p2)-20],
                [parseInt(p1)-col, parseInt(p2)-20],
                [parseInt(p1)-col,parseInt(p2)+20]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 2});


        //svg.polyline(
        //    [
        //        [parseInt(p1)+(merr/2),parseInt(p2)],
        //        [parseInt(p1)+(merr/2), parseInt(p2)-20],
        //        [parseInt(p1)+col, parseInt(p2)-20],
        //        [parseInt(p1)+col,parseInt(p2)+20]
        //    ],
        //    {fill: 'none', stroke: 'red', strokeWidth: 2});

    }


    function polyline(p1,p2){
        svg.polyline(
            [
                [parseInt(p1)+105,parseInt(p2)+110],
                [parseInt(p1)+105,parseInt(p2)+90],
                [parseInt(p1)+170,parseInt(p2)+90],
                [parseInt(p1)+170,parseInt(p2)+110]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    function circlestatus(id){
        var p1 = $('#'+id).attr('cx');
        var p2 = $('#'+id).attr('cy');
        svg.polyline([[parseInt(p1)-35, parseInt(p2)+30],[parseInt(p1)+35,parseInt(p2)-30]],
            {fill: 'none', stroke: 'red', strokeWidth: 5});
        return false;
    }

    function rectstatus(id){
        var p1 = $('#'+id).attr('x');
        var p2 = $('#'+id).attr('y');
        svg.polyline([[parseInt(p1-15), parseInt(p2)+50],[parseInt(p1)+55,parseInt(p2)-10]],
            {fill: 'none', stroke: 'red', strokeWidth: 5});
        return false;
    }

    //Collect the daughters
    function daughters(no,d1,d2,pid,mid) {

        //Prevent too many hooks
        $.each(daughter1, function (key, value) {

            //Prevent too many hooks
            if((parseInt(no)) < key) connect_circle_line(d1,d2,no);

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
            };
        });
    }

    //Collect the children
    function children_load(d1,d2,pid) {
        var MIDGEN = $('#me').attr("class");
        //Load my spouce
        LOAD_SPOUCE_MATERNAL('me', $('#me').attr("class"))

        if(MIDGEN.toUpperCase()=="MALE")svg.line(g, masterx + 65, mastery + 25, masterx + 65, mastery + 130, {id: 'childs', stroke: 'black'});
        else svg.line(g, masterx + 45, mastery + 0, masterx + 45, mastery + 130, {id: 'childs', stroke: 'black'});

        //Prevent too many hooks
        if (childrenarray.length > 1) {

            $.each(childrenarray, function (key, value) {
                var temp = "";
                var id = "";
                //for (var item in value) {
                g = value[0];
                id = value[1];
                if (id == "" || id == null) id = 'chl_' + key;
                if (key == 0) p1 = parseInt(masterx);
                else p1 = parseInt(masterx) + 20 + (parseInt(key) * 50);

                if (g == 'FEMALE') {
                    svg.circle(p1 + 60, Level4F, cr, {
                        id: id,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                else if (g == 'MALE') {
                    svg.rect(p1 + 25, Level4M, rr, rr, 1, 1, {
                        id: id,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
            });
        }
        else{
            $.each(childrenarray, function (key, value) {
                var temp = "";
                var id = "";
                //for (var item in value) {
                g = value[0];
                id = value[1];
                if (id == "" || id == null) id = 'chl_' + key;
                if (key == 0) p1 = parseInt(masterx) + 20;
                //else p1 = parseInt(masterx) + 20 + (parseInt(key) * 50);

                if (g == 'FEMALE') {
                    svg.circle(p1+45, Level4F - 20, cr, {
                        id: id,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'female',
                        cursor: 'pointer'
                    });
                }
                else if (g == 'MALE') {
                    svg.rect(p1+5, Level4M -20, rr, rr, 1, 1, {
                        id: id,
                        fill: gencolor,
                        stroke: 'red',
                        strokeWidth: 2,
                        class: 'male',
                        cursor: 'pointer'
                    });
                }
            });

        }


        OBJECTS_CONNECT(childrenarray, 'ctest');
    }

    //Collect the nieces
    function nieces(no,a1,a2,pid,mid) {

        //Prevent too many hooks
        $.each(niecearray, function (key, value) {

            //Prevent too many hooks
            if((parseInt(no)) < key) connect_circle_line(a1,a2,no);

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
                }
            };
        });
    }

    //Load paternal aunt / uncle
    function paternals_load(){
        var lx = 0;
        var ly = 0;
        var g, MID, gen, MIDGEN,PERVMID;
        var p1,p2;
        var pid,mid;
        var xl = new Array();

        $.each(paternalrelatives, function (key, value) {
            MIDGEN = value[0];
            MID = value[1];
            pid = value[3];
            var xy;
            var datakey = value[2];
            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */
            if ( brotherssarray.length > 0) {
                var d = brotherssarray[brotherssarray.length - 1];
                if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                else lx = parseInt($('#' + d[1]).attr('cx'));
            }
            else{lx = 60}

            if(paternalrelatives.length > 1) {
                if(key == 0) {

                    //alert([pid,MID])

                    //Get father location
                    var check = IS_IN_ARRAY(paternalcousin, MID);
                    //Get mother location
                    var PARENTID = fatherarray[0][1];
                    var PARENTGEN = fatherarray[0][0];
                    var ps = PAT_GENLINE(PARENTGEN,PARENTID);
                    p1 = ps[0];
                    p2 = ps[1];
                    if (i % 2 == 0) {xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);}
                    else if (i % 2 != 0) {xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);}
                    //Get brother location
                    if (brotherssarray.length > 0) {
                        p1 = parseInt(lx) - 20;
                    }
                    if(check != -1){p1 = p1 - 100}
                    if(MIDGEN=='MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (paternalrelatives.length - 1)) {
                    var PERVMID = paternalrelatives[key - 1][1];
                    var PERVGEN = paternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(paternalcousin,PERVMID);
                    var ps = LEFT_PATERALS_GEN(PERVGEN,PERVMID,MIDGEN);
                    p1 = ps[0];
                    if(check!=-1){p1 = p1 - 100}
                    if(MIDGEN=='MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (paternalrelatives.length - 1))) {
                    var PERVMID = paternalrelatives[key - 1][1];
                    var PERVGEN = paternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(paternalcousin,PERVMID);
                    var ps = LEFT_PATERALS_GEN(PERVGEN,PERVMID,MIDGEN);
                    p1 = ps[0];
                    if(check!=-1){p1 = p1 - 100}
                    if(MIDGEN=='MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }
            else{
                var PARENTID = fatherarray[0][1];
                var PARENTGEN = fatherarray[0][0];
                var ps = GENLINE(fatherarray[0][0],temp);
                var check = IS_IN_ARRAY(paternalcousin,MID);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                p1 = p1 - parseInt(lx);

                if(MIDGEN=='MALE') {svg.rect(p1,Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
        });

        //PAT_PARENT_CHILD_POLYLINES(paternalrelatives,fatherarray);

        //Draw connecting polyline
        for(i=0;i<paternalrelatives.length;i++) {
            var value = paternalrelatives[i];
            var mid = value[1];
            var ps = GENLINE(value[0],value[1]);
            p1 = ps[0];
            p2 = ps[1];
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

        }
        var temp =GENLINE(fatherarray[0][0],fatherarray[0][1]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }


    //Load paternal aunt / uncle
    function maternals_load(){
        var lx = 0;
        var ly = 0;
        var g, MID, gen, MIDGEN,PERVMID;
        var p1,p2,lx;
        var pid,mid;
        var xl = new Array();

        $.each(maternalrelatives, function (key, value) {
            MIDGEN = value[0];
            MID = value[1];
            pid = value[3];
            var xy;
            var datakey = value[2];
            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */
            if (sistersarray.length > 0) {
                var d = sistersarray[sistersarray.length - 1];
                if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                else lx = parseInt($('#' + d[1]).attr('cx'));
            }
            else{lx = 60}

            if(maternalrelatives.length > 1) {
                if(key == 0){

                    var check = IS_IN_ARRAY(maternalcousin,MID);
                    //Get mother location
                    var PARENTID = motherarray[0][1];
                    var PARENTGEN = motherarray[0][0];
                    var ps = MAT_GENLINE(PARENTGEN,PARENTID);
                    p1 = ps[0];
                    p2 = ps[1];
                    if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                    else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                    //Get sisters location
                    if (sistersarray.length > 0) {
                        p1 = parseInt(lx) + 20;
                    }
                    if(check != -1){p1 = p1 + 100}
                    if(MIDGEN=='MALE') {svg.rect(p1,Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (maternalrelatives.length - 1)) {
                    var PERVMID = maternalrelatives[key - 1][1];
                    var PERVGEN = maternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(maternalcousin,PERVMID);
                    var ps = RIGHT_MATERALS_GEN(PERVGEN,PERVMID,MIDGEN);
                    p1 = ps[0];
                    if(check!=-1){p1 = p1 + 100}
                    //p2 = ps[1];
                    //if(IS_IN_ARRAY(maternalcousin,PERVMID)=='found') p1 = parseInt(p1) + 100;

                    if(MIDGEN=='MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (maternalrelatives.length - 1))) {
                    var PERVMID = maternalrelatives[key - 1][1];
                    var PERVGEN = maternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(maternalcousin,PERVMID);
                    var ps = RIGHT_MATERALS_GEN(PERVGEN,PERVMID,MIDGEN);
                    p1 = ps[0];
                    p2 = ps[1];
                    if(check!=-1){p1 = p1 + 100}
                    if(MIDGEN=='MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(MIDGEN=='FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }

            else{
                var PARENTID = motherarray[0][1];
                var PARENTGEN = motherarray[0][0];
                var ps = MAT_GENLINE(motherarray[0][0],PARENTID);
                var check = IS_IN_ARRAY(maternalcousin,MID);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                if (sistersarray.length > 0) {
                    p1 = parseInt(lx) + 20;
                }

                if(MIDGEN=='MALE') {svg.rect(p1, mastery-150, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if(MIDGEN=='FEMALE') {svg.circle(p1, mastery-130, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

            }
        });

        //Load the polylines
        MAT_PARENT_CHILD_POLYLINES(maternalrelatives,motherarray);
        //Draw connecting polyline
        //for(i=0;i<maternalrelatives.length;i++) {
        //    var value = maternalrelatives[i];
        //    mid = value[1];
        //    var ps = GENLINE(value[0],value[1]);
        //    p1 = ps[0];
        //    p2 = ps[1];
        //    if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        //    else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        //
        //}
        //var temp =GENLINE(motherarray[0][0],motherarray[0][1]);
        //xl.push([temp[0],temp[1]-20],[temp[0],temp[1]]);
        ////Load the polyline
        //svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    function MAT_PARENT_CHILD_POLYLINES(ARRAY1,ARRAY2) {
        var PARENTGEN = ARRAY2[0][0];
        var PARENTID = ARRAY2[0][1];
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
        svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});

    }
    function PAT_PARENT_CHILD_POLYLINES(ARRAY1,ARRAY2) {
        var PARENTGEN = ARRAY2[0][0];
        var PARENTID = ARRAY2[0][1];
        //Draw connecting polyline
        for (i = 0; i < ARRAY1.length; i++) {
            var value = ARRAY1[i];
            mid = value[1];
            var ps = GENLINE(value[0], value[1]);
            p1 = ps[0];
            p2 = ps[1];

            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

            //if (i % 2 == 0) {xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);}
            //else if (i % 2 != 0) {xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);}

        }
        //var temp = GENLINE(PARENTGEN, PARENTID);
        //xl.push([temp[0], temp[1] - 20], [temp[0], temp[1]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});

    }
    /*
     * These functions load the x and y values for lines on objects
     */
    function LEFTGEN(PIDGEN,ID,MIDGEN){
        var p1,p2;
        if (PIDGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) -40;
            p2 = parseInt($('#' + ID).attr('y'))+20;
            if(MIDGEN=="FEMALE"){p1 = p1 - 10}
            else{p1 = p1 - 20}
        }
        else if (PIDGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'))-40;
            p2 = parseInt($('#' + ID).attr('cy'));
            if(MIDGEN=="MALE"){p1 = parseInt(p1) - 45}
            else{p1 = p1 - 15}
        }
        return [p1,p2]
    }

    function RIGHTGEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;

        if (PREIOUSGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))+40;
            p2 = parseInt($('#' + ID).attr('y'))+20;
            if(MIDGEN=="FEMALE"){p1 = p1 + 20}
            else{p1 = p1 + 20}
        }
        else if (PREIOUSGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'))+60;
            p2 = parseInt($('#' + ID).attr('cy'));
            //if(MIDGEN=="MALE"){p1 = p1 + 5}
            //else{p1 = p1 + 20}
        }
        //if($('#SP_' + ID))p1 = p1 + 100;
        return [p1,p2]
    }

    function RIGHT_NEPHEWS_GEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;

        if(MIDGEN=='MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))+40;
                p2 = parseInt($('#' + ID).attr('y'))+20;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))+25;
                p2 = parseInt($('#' + ID).attr('cy'));
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
                //else{p1 = p1 + 20}
            }
        }
        else{
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))+40;
                p2 = parseInt($('#' + ID).attr('y'))+20;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))+45;
                p2 = parseInt($('#' + ID).attr('cy'));
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
                //else{p1 = p1 + 20}
            }
        }


        return [p1,p2]
    }

    function LEFT_NEPHEWS_GEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;
        if(MIDGEN=='MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
                p2 = parseInt($('#' + ID).attr('y'))+20;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'));
                p2 = parseInt($('#' + ID).attr('cy'));
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
            }
        }
        else{
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
                p2 = parseInt($('#' + ID).attr('y'))+20;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'));
                p2 = parseInt($('#' + ID).attr('cy'));
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
                //else{p1 = p1 + 20}
            }
        }


        return [p1,p2]
    }

    function RIGHT_MATERALS_GEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;
        if(MIDGEN=='MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))+60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                //if ($('#SP_' + ID))p1 = p1 + 80;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))+60;
                p2 = parseInt($('#' + ID).attr('cy'));
                //if ($('#SP_' + ID))p1 = p1 + 80;
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
                //else{p1 = p1 + 20}
            }
        }
        else{
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))+40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                //if ($('#SP_' + ID))p1 = p1 + 80;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))+60;
                p2 = parseInt($('#' + ID).attr('cy'));
                //if ($('#SP_' + ID))p1 = p1 + 160;
                //if(MIDGEN=="MALE"){p1 = p1 + 5}
                //else{p1 = p1 + 20}
            }
        }
        return [p1,p2]
    }

    function LEFT_PATERALS_GEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;
        if(MIDGEN=='MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))-60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))-80;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else{
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) - 60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 60;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1,p2]
    }

    function RIGHT_COUSINS_GEN(PREIOUSGEN,ID,MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 40;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 25;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 100;
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 40;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1,p2]
    }

    function RIGHT_START_COUSINS_GEN(PREIOUSGEN,ID,MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'));
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'));
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1,p2]
    }

    function LEFT_START_COUSINS_GEN(PREIOUSGEN,ID,MIDGEN) {

        //alert(PREIOUSGEN + " ** " +ID + "  -  "+MIDGEN)
        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) ;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) ;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'));
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) ;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1,p2]
    }

    function LEFT_COUSINS_GEN(PREIOUSGEN,ID,MIDGEN){

        var p1,p2;
        if(MIDGEN=='MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))- 0;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx'))- 60;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        else{
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x'))- 65;
                p2 = parseInt($('#' + ID).attr('y'));
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) - 45;
                p2 = parseInt($('#' + ID).attr('cy'));
            }
        }
        return [p1,p2]
    }






    function PULLX(PIDGEN,ID){

        var p1,p2;
        if (PIDGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))+40;
        }
        else if (PIDGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'))+40;
        }
        return p1
    }

    function GENLINE(GEN,ID){
        var p1,p2;
        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))+20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy'))-20;
        }


        return [p1,p2]
    }

    function PAT_GENLINE(GEN,ID){
        var p1,p2;

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))+20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy'))-20;
        }
        return [p1,p2]
    }

    function MAT_GENLINE(GEN,ID){
        var p1,p2;

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))+20;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'));
            p2 = parseInt($('#' + ID).attr('cy'))-20;
        }
        return [p1,p2]
    }

    //Load parental grand parents
    function parental_grans_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2;
        var pid = 'me';
        var xl = new Array();


        for(i=0;i<grantparentalsarray.length;i++) {
            //Draw connecting polyline
            var ps = GENLINE(grantparentalsarray[i][0],grantparentalsarray[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {xl.push([[p1-20, p2+20],[p1-20, p2+20],[p1-20, p2+20]]);}
            else if (i % 2 != 0) {xl.push([[p1+20, p2+20],[p1+20, p2+20],[p1+20, p2+20]]);}
            //Load the polyline
            svg.polyline(xl, {id: 'Tpgp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }

    //Load maternal grand parents
    function maternal_grans_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2;
        var pid = 'me';
        var xl = new Array();

        for(i=0;i<grantmaternalsarray.length;i++) {
            //Draw connecting polyline
            var ps = GENLINE(grantmaternalsarray[i][0],grantmaternalsarray[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {xl.push([[p1-20, p2+20],[p1-20, p2+20],[p1-20, p2+20]]);}
            else if (i % 2 != 0) {xl.push([[p1+20, p2+20],[p1+20, p2+20],[p1+20, p2+20]]);}
            //Load the polyline
            svg.polyline(xl, {id: 'Tpgm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
        }

    }


    //Load brothers
    function brothers_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G,MIDGEN,MID;
        var p1,p2;
        var pid = 'me';
        var xl = new Array();

        if(brotherssarray.length>0) {
            p2 = mastery;
            $.each(brotherssarray, function (key, value) {
                MIDGEN = value[0];
                MID = value[1];
                var mid = value[1];
                var pid = 'me';
                var datakey = value[2];

                if (childrenarray.length > 0) {
                    var d = childrenarray[0];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                    else lx = parseInt($('#' + d[1]).attr('cx'));
                }

                if(brotherssarray.length>1) {

                    //Parse array and build diagram
                    if (key > 0 && (key < (brotherssarray.length - 1))) {
                        var mid = brotherssarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray,mid);
                        p1 = parseInt($('#' + mid).attr('x')) - 60;
                        if(check!='-1') p1 = parseInt(p1) - 100;

                        //p2 = parseInt($('#' + mid).attr('y')) + 25;
                    }
                    else if (key == (brotherssarray.length - 1)) {
                        var mid = brotherssarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray,mid);
                        p1 = parseInt($('#' + mid).attr('x')) - 60;
                        if(check!=-1) p1 = parseInt(p1) - 100;
                        //p1 = parseInt($('#' + mid).attr('x')) - 60;
                        //p2 = parseInt($('#' + mid).attr('y')) + 25;
                    }
                    else {
                        if($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) - 60;
                        else p1 = parseInt($('#' + pid).attr('cx')) - 100;
                        //p1 = parseInt($('#' + pid).attr('x')) - 60;
                        //p2 = parseInt($('#' + pid).attr('y')) + 25;
                    }
                }
                else {
                    if($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) - 60;
                    else p1 = parseInt($('#' + pid).attr('cx')) - 100;
                    //p1 = parseInt($('#' + pid).attr('x')) - 60;
                    //p1 = parseInt($('#' + pid).attr('x')) - 60;
                    //p2 = parseInt($('#' + pid).attr('y')) + 25;
                }
                //if (G == 'MALE') {
                svg.rect(p1, mastery-20, rr, rr, 1, 1, {
                    id: MID,
                    datakey: datakey,
                    fill: gencolor,
                    stroke: 'red',
                    strokeWidth: 2,
                    class: 'male',
                    cursor: 'pointer'
                });
                //}
            });
        }

        //Prevent too many hooks
        for(i=0;i<brotherssarray.length;i++) {
            var value = brotherssarray[i];
            mid = value[1];

            //Confirm my gender
            p1 = parseInt($('#' + mid).attr('x'))+20;
            p2 = parseInt($('#' + mid).attr('y'));

            if (value % 2 == 0) {xl.push([[p1, p2],[p1, p2-20]]);}
            else if (value % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        }

        var mx = $('#mei').attr("x1");
        var my = $('#mei').attr("y1");
        xl.push([[p1, p2-20],[mx, parseInt(my)+90]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tb_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    function IS_IN_ARRAY(ARRAY,ID){
        var res = -1;
        $.each(ARRAY, function (k, data) {
            if(ID == data[2]){

                var ps = GENLINE(data[0],ID);
                res = ps[0];
                return false;
            }
        });
        return [res];
    }

    //Load sisters
    function sisters_load(){
        var lx = 0;
        var ly = 0;
        var MIDGEN, MID, SPID;
        var p1,p2,lx;
        var pid = 'me';
        var xl = new Array();

        if(sistersarray.length>0) {
            p2 = mastery;
            $.each(sistersarray, function (key, value) {
                MIDGEN = value[0];
                MID = value[1];
                var mid = value[1];
                var datakey = value[2];

                if (childrenarray.length > 0) {
                    var d = childrenarray[childrenarray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                    else lx = parseInt($('#' + d[1]).attr('cx'));
                }


                if(sistersarray.length>1) {
                    //Parse array and build diagram
                    if (key > 0 && (key < (sistersarray.length - 1))) {
                        var mid = sistersarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray,mid);
                        p1 = parseInt($('#' + mid).attr('cx')) + 60;
                        if(check!=-1) p1 = parseInt(p1) + 100;
                        //if($('#SP_' + mid))p1 = p1 + 100;
                        //if($('#SP_' + mid)){
                        //    p1 = parseInt($('#SP_' + mid).attr('x')) + 20;
                        //}
                        //p2 = parseInt($('#' + mid).attr('cy')) + 25;
                    }
                    else if (key == (sistersarray.length - 1)) {
                        var mid = sistersarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray,mid);
                        p1 = parseInt($('#' + mid).attr('cx')) + 60;
                        if(check!=-1) p1 = parseInt(p1) + 100;
                        //p2 = parseInt($('#' + mid).attr('cy')) + 25;
                        //if(IS_IN_ARRAY(nephewarray,MID)==1)p1 + 100;
                        //if($('#SP_' + mid))p1 = p1 + 60;

                    }
                    else {
                        //if($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) + 60;
                        //else p1 = parseInt($('#' + pid).attr('cx')) + 100;
                        p1 = lx + 60;
                        //p1 = parseInt($('#' + pid).attr('x')) + 150;
                        //p2 = parseInt($('#' + pid).attr('y')) + 25;
                    }

                }
                else {
                    p1 = parseInt($('#' + pid).attr('x')) + 150;
                    if(lx>0){
                        p1 = lx + 20;

                    }
                    else {
                        if ($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) + 150;
                        else {
                            p1 = parseInt($('#' + pid).attr('cx')) + 40;
                            p2 =  mastery + 20;
                        }
                    }

                    //p2 = parseInt($('#' + pid).attr('y')) + 25;
                }
                svg.circle(p1, p2, cr, {
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
        for(i=0;i<sistersarray.length;i++) {
            var value = sistersarray[i];
            mid = value[1];

            //Confirm my gender
            p1 = parseInt($('#' + mid).attr('cx'));
            p2 = parseInt($('#' + mid).attr('cy')-20);

            if (value % 2 == 0) {xl.push([[p1, p2],[p1, p2-20]]);}
            else if (value % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        }


        var mx = $('#mei').attr("x1");
        var my = $('#mei').attr("y1");
        xl.push([[p1, p2-20],[mx, parseInt(my)+90]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Td_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    //Sort the array values by female / male
    //function SortByName(a, b){
    //    var aName = a[0].toLowerCase();
    //    var bName = b[0].toLowerCase();
    //    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    //}
    //
    //function SortById(a, b){
    //    a = a.id.split("_");
    //    b = b.id.split("_");
    //    var aName = a[1].toLowerCase();
    //    var bName = b[1].toLowerCase();
    //    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    //}


    function paternal_nephews_load(){
        var lx = 0;
        var ly = 0;
        var pid,mid, G,midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID,PIDGEN,MID,MIDGEN,DATAKEY;
        var P1 = new Array();
        var ptemp = new Array();
        var mtemp = new Array();
        var ALLPAT = new Array();
        //var ALLMAT = new Array();
        var pids = new Array();
        //var mids = new Array();
        var pidsarray = new Array();

        var ln = nephewarray.length;

        for (t = 0; t <ln; t++) {
            var midgen = nephewarray[t][0];
            var mid = nephewarray[t][1];
            var id = $('#' + nephewarray[t][2]).attr('datakey');
            //if (id.substring(0, 1) == 'P') {
                if (ln > 1) {
                    if (t == 0) {
                        pid = nephewarray[t][2];
                        if (id.substring(0, 1) == 'P') {

                            pids.push([[midgen, mid]]);
                        }
                    }
                    else if (pid == nephewarray[t][2]) {
                        pid = nephewarray[t][2];
                        if (id.substring(0, 1) == 'P') {

                            pids.push([[midgen, mid]]);
                        }
                    }
                    else if (pid != nephewarray[t][2]) {
                        var id = $('#' + pid).attr('datakey');
                        if (id.substring(0, 1) == 'P') {
                            ALLPAT.push({"id": id, "pid": pid, "value": pids});
                            pids = new Array();
                        }
                        pid = nephewarray[t][2];
                        var id = $('#' + pid).attr('datakey');
                        if (id.substring(0, 1) == 'P') {
                            pids.push([[midgen, mid, pid]]);
                            ALLPAT.push({"id": id, "pid": pid, "value": pids});
                            pids = new Array();
                        }
                    }
                }

                else {
                    pid = maternalcousin[t][2];
                    var id = $('#' + pid).attr('datakey');
                    if (id.substring(0, 1) == 'P') {
                        pids.push([[midgen, mid, pid]]);
                        ALLPAT.push({"id": id, "pid": pid, "value": pids});
                    }
                }
            }
        //}
        LOAD_PATERNAL_OBJECTS(ALLPAT);

    }

    function LOAD_PATERNAL_OBJECTS(ARRAY){
        var coodinates = new Array();
        var NPIG="";
        var COORD=0;
        $.each( ARRAY, function( q, data ) {
            var temp="";
            var objectsarray = new Array();
            var e,name;
            var temp = new Array();
            var MIDGEN;
            var MID;
            var DATAKEY=null;
            var PID = ARRAY[q].pid;
            var CODE = ARRAY[q].id;

            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            temp = data.value;
            var ln =  temp.length;

            //LOOP
            for (k = 0; k < ln; k++) {
                //alert(temp[k])
                var d = new Array();
                var coord = new Array();
                d = temp[k];
                var MIDGEN = d[0][0];
                var MID = d[0][1];


                if(NPIG==""){
                    NPIG = PID;
                    DATAKEY = CODE;
                    ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                    p1 =parseInt(ps[0]) - 50;
                    //p2 = ps[1];
                    COORD=p1;

                }
                else if(NPIG!=PID){
                    NPIG = PID;
                    DATAKEY = CODE;
                    ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                    p1 =parseInt(ps[0]) - 50;
                    //p2 = ps[1];
                    COORD=p1;
                }
                else{
                    NPIG = PID;
                    p1 = parseInt(COORD) - 80;
                    COORD=p1;
                    //p2 = ps[1];
                }

                //alert(PID + "code-->"+ CODE + " -MID " + MID + " GEN-- "+MIDGEN)

                DATAKEY = CODE;
                //alert(PID)
                //var ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                //p1 = ps[0];
                //p2 = ps[1];

                coord.push(MIDGEN,MID);
                objectsarray.push(coord);

                //if(k==0 && ln==1) {
                //    if (MIDGEN == 'MALE') p1 = parseInt(p1) - 50;
                //    else p1 = parseInt(p1) - 35;
                //}
                //else if(k>0) p1 = parseInt(p1) - 80;

                if (MIDGEN == 'MALE') {svg.rect(p1, Level4M, rr, rr, 1, 1, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                left_parent_nephews_connector(PID, MID, MIDGEN, PIDGEN, Level4M, ln);
            }

            LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
            COORD_OBJECTS_CONNECT(objectsarray, 'ptest');
        });
    }



    function maternal_nephews_load(){
        var lx = 0;
        var ly = 0;
        var pid,mid, G,midgen;
        var xl = new Array();
        var start = new Array();
        var PIDS = new Array();
        var MIDS = new Array();
        var PID,PIDGEN,MID,MIDGEN,DATAKEY;
        var P1 = new Array();
        var ptemp = new Array();
        var mtemp = new Array();
        //var ALLPAT = new Array();
        var ALLMAT = new Array();
        //var pids = new Array();
        var mids = new Array();
        var pidsarray = new Array();

        var ln = nephewarray.length;

        for (t = 0; t <ln; t++) {
            var midgen = nephewarray[t][0];
            var mid = nephewarray[t][1];
            var id = $('#' + nephewarray[t][2]).attr('datakey');
            //if (id.substring(0, 1) == 'M') {
                if (ln > 1) {

                    if (t == 0) {
                        pid = nephewarray[t][2];
                        if (id.substring(0, 1) == 'M') {
                            mids.push([[midgen, mid]]);
                        }
                    }
                    else if (pid == nephewarray[t][2]) {
                        pid = nephewarray[t][2];
                        if (id.substring(0, 1) == 'M') {
                            mids.push([[midgen, mid]]);
                        }
                    }
                    else if (pid != nephewarray[t][2]) {
                        var id = $('#' + pid).attr('datakey');
                        if (id.substring(0, 1) == 'M') {
                            ALLMAT.push({"id": id, "pid": pid, "value": mids});
                            mids = new Array();
                        }
                        pid = nephewarray[t][2];
                        var id = $('#' + pid).attr('datakey');
                        if (id.substring(0, 1) == 'M') {
                            mids.push([[midgen, mid, pid]]);
                            ALLMAT.push({"id": id, "pid": pid, "value": mids});
                            mids = new Array();
                        }
                    }
                }
                else {
                    pid = maternalcousin[t][2];
                    var id = $('#' + pid).attr('datakey');
                    if (id.substring(0, 1) == 'M') {
                        mids.push([[midgen, mid, pid]]);
                        ALLMAT.push({"id": id, "pid": pid, "value": mids});
                    }
                }
            }
        //}


        LOAD_MATERNAL_OBJECTS(ALLMAT);




    }



    function LOAD_MATERNAL_OBJECTS(ARRAY){
        var coodinates = new Array();
        var NPIG="";
        var COORD=0;
        //$.each( ARRAY, function( q, data ) {
            for (var w = 0; w < ARRAY.length; w++) {
                var temp = "";
                var ALLPIDS = new Array();
                var objectsarray = new Array();
                var e, name;
                var temp = new Array();
                var MIDGEN;
                var MID;
                var DATAKEY = null;
                var PID = ARRAY[w].pid;
                var CODE = ARRAY[w].id;
                var PIDGEN = $('#' + PID).attr('class').toUpperCase();

                //Parse
                temp = ARRAY[w].value;
                var ln = temp.length;



                //LOOP
                for (k = 0; k < ln; k++) {
                    var ps;
                    var d = new Array();
                    var coord = new Array();
                    d = temp[k];
                    var MIDGEN = d[0][0];
                    var MID = d[0][1];
                    coord.push(MIDGEN, MID);
                    objectsarray.push(coord);

                    if(NPIG==""){
                        NPIG = PID;
                        DATAKEY = CODE;
                        ps = RIGHT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                        p1 = ps[0];

                        COORD=p1;

                    }
                    else if(NPIG!=PID){
                        NPIG = PID;
                        DATAKEY = CODE;
                        ps = RIGHT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                        p1 = ps[0];

                        COORD=p1;
                    }
                    else{
                        NPIG = PID;
                        p1 = parseInt(COORD) + 80;
                        COORD=p1;
                        //p2 = ps[1];
                    }

                    //if (k == 0 && ln == 1) {
                    //    if (MIDGEN == 'MALE') p1 = parseInt(p1) + (parseInt(w) * 50);
                    //    else p1 = parseInt(p1) + 35;
                    //}
                    //else if (k > 0) p1 = parseInt(p1) + (parseInt(w) * 30);

                    //p1 = coodinates[coodinates-1];
                    if (MIDGEN == 'MALE') {
                        svg.rect(p1, Level4M, rr, rr, 1, 1, {
                            id: MID,
                            fill: 'purple',
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (MIDGEN == 'FEMALE') {
                        svg.circle(p1, Level4F, cr, {
                            id: MID,
                            fill: 'purple',
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'female',
                            cursor: 'pointer'
                        });
                    }
                    right_parent_nephews_connector(PID, MID, MIDGEN, PIDGEN, Level4M, ln);
                }

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
                COORD_OBJECTS_MATERNAL_CONNECT(objectsarray, 'ptest');
            }
        //});
    }



    function LOAD_MATERNAL_OBJECTS_OLD(ARRAY){
        var PID,PIDGEN,MID,MIDGEN,DATAKEY;
        var P1 = new Array();
        var idarray=new Array();
        var DATAKEY=null;
        var objectsarray = new Array();

        for (var p in ARRAY) {
            var idarray=new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if ( p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //if (childrenarray.length > 0) {
                //    var d = childrenarray[childrenarray.length - 1];
                //    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                //    else lx = parseInt($('#' + d[1]).attr('cx'));
                //    p1 = lx + 60;
                //}

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {svg.rect(p1, Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                //Connect to parent
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level4M);
            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                DATAKEY = ARRAY[p].id;


                var ps = RIGHT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //Get previous object coordninates
                //p1 = P1[P1.length - 1][2] + 60;

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);

                if (MIDGEN == 'MALE') {svg.rect(p1, Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1,Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                //Connect to parent
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level4M);

            }
            else {
                DATAKEY = ARRAY[p].id;

                var ps = RIGHT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //Get previous object coordninates
                p1 = P1[P1.length - 1][2] + 60;
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1,Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }

            LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

        }

        var id="0";
        for (var p in ARRAY) {
            var tmp = new Array();
            if(id=="0"){
                id = ARRAY[p].id;
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id != ARRAY[p].id){
                OBJECTS_CONNECT(objectsarray, 'test');
                objectsarray = new Array();
                id = ARRAY[p].id
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id == ARRAY[p].id){
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
        }
        OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function LOAD_PATERNAL_OBJECTS_OLD(ARRAY){
        var PID,PIDGEN,MID,MIDGEN,DATAKEY;
        var P1 = new Array();
        var idarray=new Array();
        var DATAKEY=null;
        var objectsarray = new Array();

        //$.each(ARRAY, function (datakey, data) {
        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //if (childrenarray.length > 0) {
                //    var d = childrenarray[0];
                //    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                //    else lx = parseInt($('#' + d[1]).attr('cx'));
                //    p1 = lx - 60;
                //}

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                //Connect to parent
                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level4M);
            }
            //The Next Parent is Loaded
            else if (DATAKEY != ARRAY[p].id) {
                DATAKEY = ARRAY[p].id;

                var ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //Get previous object coordninates
                //p1 = P1[P1.length - 1][2] - 60;

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1,Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                //Connect to parent
                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level4M);

            }
            else {
                DATAKEY = ARRAY[p].id;

                var ps = LEFT_NEPHEWS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                //Get previous object coordninates
                p1 = P1[P1.length - 1][2] - 90;
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level4M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level4F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
            LOAD_SPOUCE_PATERNAL(PID, PIDGEN);

        }

        var id="0";
        for (var p in ARRAY) {
            var tmp = new Array();
            if(id=="0"){
                id = ARRAY[p].id;
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id != ARRAY[p].id){
                OBJECTS_CONNECT(objectsarray, 'test');
                objectsarray = new Array();
                id = ARRAY[p].id
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id == ARRAY[p].id){
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
        }
        OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function LOAD_SPOUCE_MATERNAL(ID, GEN){
        var ID,GEN,SPOUCE;
        var objectsarray = new Array();
        var mdia,fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_"+ID;
        if(ID=='me'){
            if (GEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 70;
                p2 = parseInt($('#' + ID).attr('cy')) - 20;
                svg.line(g, masterx, mastery,  p1, mastery,{id: 'spuces', stroke: 'black'});
            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                svg.line(g, masterx, mastery+20,  p1, mastery+20,{id: 'spuces', stroke: 'black'});
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
        //Build a spuce sign
        if (GEN == 'FEMALE') {svg.rect(p1, p2, rr, rr, 1, 1, {id: SPOUCE, fill: spoucecolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
        else if (GEN == 'MALE') {svg.circle(p1, p2, cr, {id: SPOUCE, fill: spoucecolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    }

    function LOAD_SPOUCE_PATERNAL(ID, GEN){

        var ID,GEN,SPOUCE;
        var objectsarray = new Array();
        var mdia,fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_"+ID;

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
        if (GEN == 'FEMALE') {svg.rect(p1, p2, rr, rr, 1, 1, {id: SPOUCE, fill: spoucecolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
        else if (GEN == 'MALE') {svg.circle(p1, p2, cr, {id: SPOUCE, fill: spoucecolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
        ;
    }

    function LOAD_SPOUCE_PATERNAL1(ID, GEN){
        var ID,GEN,SPOUCE;
        var objectsarray = new Array();
        var mdia,fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_"+ID;
        if(ID=='me'){
            if (GEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 70;
                p2 = parseInt($('#' + ID).attr('cy')) + 20;

                //p1 = masterx + 150;
                //p2 = mastery;
            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                //p1 = masterx + 150;
                //p2 = mastery + 25;
            }
            svg.line(g, masterx, p2,  p1, p2,{id: 'spuces', stroke: 'black'});
        }
        else {
            if (GEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 70;
                p2 = parseInt($('#' + ID).attr('cy')) - 20;

                //p1 = masterx + 150;
                //p2 = mastery;
            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 70;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                //p1 = masterx + 150;
                //p2 = mastery + 25;
            }
            SPOUCE_CONNECT(ID);
        }
        //mdia = rr;
        //fdia = cr;
        //Build a spuce sign
        if (GEN == 'FEMALE') {svg.rect(p1, p2, rr, rr, 1, 1, {id: SPOUCE, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
        else if (GEN == 'MALE') {svg.circle(p1, p2, cr, {id: SPOUCE, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    }

    //Connect object rows
    function OBJECTS_CONNECT(ARRAY,ID) {
        var xl = new Array();
        for (i = 0; i < ARRAY.length; i++) {
            var ps = GENLINE(ARRAY[i][0], ARRAY[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //Begin of the objects coord recorder
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
        }

        if (ARRAY.length > 1) {
            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }

    //Connect object rows
    function COORD_OBJECTS_CONNECT(ARRAY,ID) {
        var xl = new Array();
        for (i = 0; i < ARRAY.length; i++) {

            var ps = PAT_GENLINE(ARRAY[i][0], ARRAY[i][1]);
            var p1 = ps[0];
            var p2 = ps[1];
            //Begin of the objects coord recorder
            if (i % 2 == 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
        }

        if (ARRAY.length > 1) {
            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }

    function COORD_OBJECTS_MATERNAL_CONNECT(ARRAY,ID) {
        var xl = new Array();
        for (i = 0; i < ARRAY.length; i++) {

            var ps = MAT_GENLINE(ARRAY[i][0], ARRAY[i][1]);
            var p1 = ps[0];
            var p2 = ps[1];
            //Begin of the objects coord recorder
            if (i % 2 == 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
            }
        }

        if (ARRAY.length > 1) {
            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }


    //Connect spouces rows
    function SPOUCE_CONNECT(ID){
        var xl = new Array();
        var p1,p2;
        var GEN = $('#' + ID).attr('class').toUpperCase();

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'));
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'))-20;
            p2 = parseInt($('#' + ID).attr('cy'))-20;
        }
        xl.push([[p1+40, p2+20],[p1+125, p2+20]]);
        //svg.line(g,parseInt(p1), p2,  parseInt(p1) + 225, p2,{id: 'spl_', stroke: 'red', strokeWidth: 2});
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});

        return;
    }

    //Connect spouces rows
    function PATERNAL_SPOUCE_CONNECT(ID){

        var xl = new Array();
        var p1,p2;
        var GEN = $('#' + ID).attr('class').toUpperCase();

        if (GEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x'))-100;
            p2 = parseInt($('#' + ID).attr('y'));
        }
        else if (GEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx'))-120;
            p2 = parseInt($('#' + ID).attr('cy'))-20;
        }
        xl.push([[p1+40, p2+20],[p1+100, p2+20]]);
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});

        return;
    }

    //Load maternal cousins
    function maternalcousins_load(){
        var pid,mid,midgen;
        var mtemp = new Array();
        var macs = new Array();
        var pidsarray = new Array();
        var ALLMACS = new Array();
        var pid;

        var ln = maternalcousin.length;

        for (t = 0; t <ln; t++) {
            var midgen = maternalcousin[t][0];
            var mid = maternalcousin[t][1];

            if(ln>1) {
                if (t == 0) {
                    pid = maternalcousin[t][2];
                    macs.push([[midgen, mid]]);
                }
                else if (pid == maternalcousin[t][2]) {
                    pid = maternalcousin[t][2];
                    macs.push([[midgen, mid]]);
                }
                else if (pid != maternalcousin[t][2]) {
                    var id = $('#' + pid).attr('datakey');
                    //pids.push([[midgen, mid, pid]]);
                    ALLMACS.push({"id": id, "pid": pid, "value": macs});
                    macs = new Array();
                    pid = maternalcousin[t][2];
                    var id = $('#' + pid).attr('datakey');
                    //pid = maternalcousin[t][2];
                    macs.push([[midgen, mid, pid]]);
                    ALLMACS.push({"id": id, "pid": pid, "value": macs});
                    macs = new Array();
                }
            }
            else{
                    pid = maternalcousin[t][2];
                    var id = $('#' + pid).attr('datakey');
                    macs.push([[midgen, mid, pid]]);
                    ALLMACS.push({"id": id, "pid": pid, "value": macs});
            }
        }


        //for(t=0;t<maternalcousin.length;t++) {
        //    var midgen = maternalcousin[t][0];
        //    var mid = maternalcousin[t][1];
        //    var pid = maternalcousin[t][2];
        //    var id = $('#' + pid).attr('datakey');
        //    var side = $('#' + pid).attr('datakey').substring(0,1);
        //    if(side == 'M')mtemp.push({"id":id, "value":[midgen,mid,pid]});
        //}
        //mtemp.sort(SortById);
        //LOAD_MATERNAL_COUSINS_OBJECTS_OLD(mtemp);
        LOAD_MATERNAL_COUSINS_OBJECTS(ALLMACS);

    }



    function LOAD_MATERNAL_COUSINS_OBJECTS(ARRAY){
        var NPIG="";
        var COORD=0;
        var NMID="";
        $.each( ARRAY, function( q, data ) {
            var temp="";
            var objectsarray = new Array();
            var e,name;
            var temp = new Array();
            var MIDGEN;
            var MID;
            var DATAKEY=null;
            var PID = ARRAY[q].pid;
            var CODE = ARRAY[q].id;
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            temp = data.value;
            var ln = temp.length;
            for (k = 0; k < temp.length; k++) {
                //alert(temp[k])
                var d = new Array();
                var coord = new Array();
                d = temp[k];
                var MIDGEN = d[0][0];
                var MID = d[0][1];

                DATAKEY = CODE;
                //alert(CODE + " - " + PID + " --mid " + MID + " GEN " +  MIDGEN)
                //var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                //p1 = ps[0];
                //p2 = ps[1];

                coord.push(MIDGEN,MID);
                objectsarray.push(coord);

                if(NPIG==""){
                    NPIG = PID;
                    DATAKEY = CODE;
                    NMID = MID;
                    ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    //p1 = parseInt(ps[0]);
                    if (MIDGEN == 'MALE') p1 = parseInt(ps[0]) + 45;
                        else p1 = parseInt(ps[0]) + 55;
                    //p1 = parseInt(ps[0]) + 50;

                    COORD=p1;

                }
                else if(NPIG!=PID){
                    NPIG = PID;
                    DATAKEY = CODE;
                    ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    //ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = parseInt(ps[0]) + 35;

                    NMID = MID;

                    //if (MIDGEN == 'MALE') p1 = parseInt(ps[0]) + 20;
                    //else p1 = parseInt(ps[0]) + 65;
                    //p1 = ps[0];

                    COORD=p1;
                }
                else if(NPIG==PID){
                    NPIG = PID;
                    ps = GENLINE(MIDGEN,NMID);

                    if (MIDGEN == 'MALE') p1 = parseInt(COORD) + 50;
                    else p1 = parseInt(COORD) + 55;
                    //p1 = parseInt(COORD) + 65;
                    COORD=p1;
                    //p2 = ps[1];
                }


                //if(k==0 && ln==1) {
                //    if (MIDGEN == 'MALE') p1 = parseInt(p1) + 50;
                //    else p1 = parseInt(p1) + 65;
                //}
                //else if(k>0) p1 = parseInt(p1) + 60;

                if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}


                //Connect to parent

                right_parent_cousins_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M, ln);
            }
            LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
            COORD_OBJECTS_MATERNAL_CONNECT(objectsarray, 'ptest');
        });
    }




    function LOAD_MATERNAL_COUSINS_OBJECTS_OLD(ARRAY){
        var PID,PIDGEN,MID,MIDGEN,DATAKEY;
        var P1 = new Array();
        var DATAKEY=null;
        var objectsarray = new Array();

        for (var p in ARRAY) {
            //var idarray=new Array();
            var MIDGEN = ARRAY[p].value[0];
            var MID = ARRAY[p].value[1];
            var PID = ARRAY[p].value[2];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var CODE = ARRAY[p].id;
            var p1temp = new Array();

            if ( p == 0) {
                DATAKEY = CODE;
                var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'black', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'black', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);

                //Connect to parent
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M);
            }
            //The Next Parent is Loaded
            else if (DATAKEY != CODE) {
                var PREVCHILDGEN = ARRAY[p-1].value[0];
                var PREVCHILDID = ARRAY[p-1].value[1];
                var cs = GENLINE(PREVCHILDGEN,PREVCHILDID)

                DATAKEY = CODE;
                //Begin new element
                //var ps = RIGHT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                //p1 = ps[0];

                p1 = cs[0] + 60;

                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
                //Connect to parent
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M);
            }
            else {
                DATAKEY = CODE;
                var PREVGEN = P1[P1.length - 1][0];
                var SPACE = P1[P1.length - 1][2];
                //var ps = RIGHT_COUSINS_GEN(PREVGEN, MID, MIDGEN);
                //p1 = ps[0];
                //Get previous object coordninates
                if(MIDGEN=='MALE'){
                    if(PREVGEN == 'FEMALE') p1 = SPACE + 45;
                    else p1 = SPACE + 60;
                }
                else{
                    if(PREVGEN == 'FEMALE') p1 = SPACE + 55;
                    else p1 = SPACE + 75;
                }
                p1temp.push(MIDGEN, MID, p1);
                P1.push(p1temp);
                if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
        }

        var id="0";
        for (var p in ARRAY) {
            var tmp = new Array();
            if(id=="0"){
                id = ARRAY[p].id;
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id != ARRAY[p].id){
                OBJECTS_CONNECT(objectsarray, 'test');
                objectsarray = new Array();
                id = ARRAY[p].id
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
            else if(id == ARRAY[p].id){
                tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
                objectsarray.push(tmp);
            }
        }
        OBJECTS_CONNECT(objectsarray, 'ltest');
    }


    function paternalcousins_load() {
        var pid, mid, midgen;
        var ptemp = new Array();
        //paternalcousin.sort(SortByName);
        var pids = new Array();
        var pidsarray = new Array();
        var ALLPIDS = new Array();
        var pid;
        var ln = paternalcousin.length;

        for (t = 0; t < ln; t++) {
            var midgen = paternalcousin[t][0];
            var mid = paternalcousin[t][1];
            if(ln>1) {
                if (t == 0) {
                    pid = paternalcousin[t][2];
                    pids.push([[midgen, mid]]);
                }
                else if (pid == paternalcousin[t][2]) {
                    pid = paternalcousin[t][2];
                    pids.push([[midgen, mid]]);
                }
                else if (pid != paternalcousin[t][2]) {
                    var id = $('#' + pid).attr('datakey');
                    //pids.push([[midgen, mid, pid]]);
                    ALLPIDS.push({"id": id, "pid": pid, "value": pids});
                    pids = new Array();
                    pid = paternalcousin[t][2];
                    var id = $('#' + pid).attr('datakey');
                    //pid = paternalcousin[t][2];
                    pids.push([[midgen, mid, pid]]);
                    ALLPIDS.push({"id": id, "pid": pid, "value": pids});
                    pids = new Array();
                }
            }
            else{
                pid = paternalcousin[t][2];
                var id = $('#' + pid).attr('datakey');
                macs.push([[midgen, mid, pid]]);
                ALLMACS.push({"id": id, "pid": pid, "value": pids});
            }
        }

        LOAD_PATERNAL_COUSINS_ARRAY(ALLPIDS);

        //for (t = 0; t < paternalcousin.length; t++) {
        //
        //    var midgen = paternalcousin[t][0];
        //    var mid = paternalcousin[t][1];
        //    var pid = paternalcousin[t][2];
        //    var id = $('#' + pid).attr('datakey');
        //    var side = $('#' + pid).attr('datakey').substring(0, 1);
        //    if (side == 'P')ptemp.push({"id": id, "value":[midgen, mid, pid]});
        //}
        //ptemp.sort(SortById);
        //LOAD_PATERNAL_COUSINS_OBJECTS(ptemp);



    }

    function LOAD_PATERNAL_COUSINS_ARRAY(ARRAY){

        $.each( ARRAY, function( q, data ) {
            var temp="";
            var objectsarray = new Array();
            var e,name;
            var temp = new Array();
            var MIDGEN;
            var MID;
            var DATAKEY=null;
            var PID = ARRAY[q].pid;
            var CODE = ARRAY[q].id;
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            temp = data.value;
            var ln = temp.length;
            for (k = 0; k < temp.length; k++) {
                //alert(temp[k])
                var d = new Array();
                var coord = new Array();
                d = temp[k];
                var MIDGEN = d[0][0];
                var MID = d[0][1];

                DATAKEY = CODE;
                var ps = LEFT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                p2 = ps[1];

                coord.push(MIDGEN,MID);
                objectsarray.push(coord);

                if(k==0 && ln==1) {
                    if (MIDGEN == 'MALE') p1 = parseInt(p1) - 55;
                    else p1 = parseInt(p1) - 55;
                }
                else if(k>0) p1 = parseInt(p1) - 65;

                if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);

                //Connect to parent

                left_parent_cousins_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M, ln);
            }
            COORD_OBJECTS_CONNECT(objectsarray, 'ptest');
        });
    }


    //function LOAD_PATERNAL_COUSINS_OBJECTS_OLD(ARRAY){
    //    var PID,PIDGEN,MID,MIDGEN,DATAKEY;
    //    var P1 = new Array();
    //    var DATAKEY=null;
    //    var objectsarray = new Array();
    //
    //    for (var p in ARRAY) {
    //        //var idarray = new Array();
    //        var MIDGEN = ARRAY[p].value[0];
    //        var MID = ARRAY[p].value[1];
    //        var PID = ARRAY[p].value[2];
    //        var PIDGEN = $('#' + PID).attr('class').toUpperCase();
    //        var CODE = ARRAY[p].id;
    //        var p1temp = new Array();
    //
    //        if (p == 0) {
    //            DATAKEY = CODE;
    //            //alert(PID)
    //            //alert(MID)
    //            var ps = LEFT_START_COUSINS_GEN(PIDGEN, PID, MIDGEN);
    //            p1 = ps[0];
    //            //Get previous object coordninates
    //            p1temp.push(MIDGEN, MID, p1);
    //            P1.push(p1temp);
    //            if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
    //            else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    //
    //            LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
    //
    //            //Connect to parent
    //            left_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M);
    //        }
    //        //The Next Parent is Loaded
    //        else if (DATAKEY != CODE) {
    //            var PREVCHILDGEN = ARRAY[p-1].value[0];
    //            var PREVCHILDID = ARRAY[p-1].value[1];
    //            LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
    //
    //            //var cs = GENLINE(PREVCHILDGEN,PREVCHILDID)
    //
    //            var cs = LEFT_COUSINS_GEN(PREVCHILDGEN,PREVCHILDID,MIDGEN)
    //
    //            //var cs = LEFT_COUSINS_GEN(PREVCHILDGEN,PREVCHILDID,MIDGEN)
    //
    //            DATAKEY = CODE;
    //            //var ps = LEFT_COUSINS_GEN(PIDGEN, PID, MIDGEN);
    //            //p1 = ps[0];
    //
    //            p1 = cs[0] - 60;
    //            p1temp.push(MIDGEN, MID, p1);
    //            P1.push(p1temp);
    //            if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
    //            else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    //
    //            //Connect to parent
    //            left_parent_child_connector(PID, MID, MIDGEN, PIDGEN,Level3M);
    //        }
    //        else {
    //            DATAKEY = CODE;
    //            var PREVGEN = P1[P1.length - 1][0];
    //            var SPACE = P1[P1.length - 1][2];
    //            //Get previous object coordninatess
    //            if(MIDGEN=='MALE'){
    //                if(PREVGEN == 'FEMALE') p1 = SPACE - 40;
    //                else p1 = SPACE - 60;
    //            }
    //            else{
    //                if(PREVGEN == 'FEMALE') p1 = SPACE - 55;
    //                else p1 = SPACE - 60;
    //            }
    //            p1temp.push(MIDGEN, MID, p1);
    //            P1.push(p1temp);
    //            if (MIDGEN == 'MALE') {svg.rect(p1, Level3M, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
    //            else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
    //        }
    //    }
    //
    //    var id="0";
    //    for (var p in ARRAY) {
    //        var tmp = new Array();
    //        if(id=="0"){
    //            id = ARRAY[p].id;
    //            tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
    //            objectsarray.push(tmp);
    //        }
    //        else if(id != ARRAY[p].id){
    //            OBJECTS_CONNECT(objectsarray, 'test');
    //            objectsarray = new Array();
    //            id = ARRAY[p].id
    //            tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
    //            objectsarray.push(tmp);
    //        }
    //        else if(id == ARRAY[p].id){
    //            tmp.push(ARRAY[p].value[0],ARRAY[p].value[1]);
    //            objectsarray.push(tmp);
    //        }
    //    }
    //    OBJECTS_CONNECT(objectsarray, 'ptest');
    //}
    //

    //Right Side Child Parent Coonect
    function right_parent_child_connector(PID,MID,MIDGEN,PIDGEN,LEVEL){
        var xl=new Array();
        var x, y,ex,ey;

        if(PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx')) + 45;
            y = parseInt($('#' + PID).attr('cy')) -20;
        }
        else if(PIDGEN == "MALE"){
            x = parseInt($('#' + PID).attr('x'))+ 65;
            y = parseInt($('#' + PID).attr('y'));
        }
        xl.push([[x, y+20],[x, LEVEL-20]]);

        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    //Right Side Child Parent Coonect
    function right_parent_cousins_child_connector(PID,MID,MIDGEN,PIDGEN,LEVEL,LN){
        var xl=new Array();
        var x, y,ex,ey;

        if(PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx'))+50;
            y = parseInt($('#' + PID).attr('cy'))-20;
        }
        else if(PIDGEN == "MALE"){
            x = parseInt($('#' + PID).attr('x'))+65;
            y = parseInt($('#' + PID).attr('y'));
        }
        if(LN==1)xl.push([[x, y+20],[x, LEVEL]]);
        else xl.push([[x, y+20],[x, LEVEL-20]]);

        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    //Right Side Child Parent Coonect
    function right_parent_nephews_connector(PID,MID,MIDGEN,PIDGEN,LEVEL,LN){
        var xl=new Array();
        var x, y,ex,ey;
        if(PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx')) + 45;
            y = parseInt($('#' + PID).attr('cy')) -20;
        }
        else if(PIDGEN == "MALE"){
            x = parseInt($('#' + PID).attr('x'))+ 65;
            y = parseInt($('#' + PID).attr('y'));
        }

        //line not shortened when only one child
        if(LN==1)xl.push([[x, y + 20], [x, LEVEL]]);
        else xl.push([[x, y + 20], [x, LEVEL - 20]]);


        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    function left_parent_child_connector(PID,MID,MIDGEN,PIDGEN,LEVEL){
        var xl=new Array();

        if(PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx')) - 45;
            var y = parseInt($('#' + PID).attr('cy'));
            //xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex, ey-20]]);
        }
        else{
            var x = parseInt($('#' + PID).attr('x')) - 30;
            var y = parseInt($('#' + PID).attr('y')) + 20;
        }
        xl.push([[x, y],[x, LEVEL-20]]);

        svg.polyline(xl, {id: 'Tlr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    function left_parent_cousins_child_connector(PID,MID,MIDGEN,PIDGEN,LEVEL, LN){
        var xl=new Array();

        if(PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx')) - 45;
            var y = parseInt($('#' + PID).attr('cy'));
            //xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex, ey-20]]);
        }
        else{
            var x = parseInt($('#' + PID).attr('x')) - 30;
            var y = parseInt($('#' + PID).attr('y')) + 20;
        }

        //line not shortened when only one child
        if(LN==1) xl.push([[x, y],[x, LEVEL]]);
        else if(LN>1) xl.push([[x, y],[x, LEVEL-20]]);
        //xl.push([[x, y],[x, LEVEL-20]]);

        svg.polyline(xl, {id: 'Tlr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    function left_parent_nephews_connector(PID,MID,MIDGEN,PIDGEN,LEVEL, LN){
        var xl=new Array();

        if(PIDGEN == "FEMALE") {
            var x = parseInt($('#' + PID).attr('cx')) - 45;
            var y = parseInt($('#' + PID).attr('cy'));
            //xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex, ey-20]]);
        }
        else{
            var x = parseInt($('#' + PID).attr('x')) - 30;
            var y = parseInt($('#' + PID).attr('y')) + 20;
        }

        //line not shortened when only one child
        if(LN==1) xl.push([[x, y],[x, LEVEL]]);
        else xl.push([[x, y],[x, LEVEL-20]]);

        svg.polyline(xl, {id: 'Tlr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }



    if(nephewarray.length>10) {
        //if(paternalcousin.length>10){
        //    svgw.setAttribute('viewBox', '-700 -25 2200 1800');
        //}
        //else {
        //    svgw.setAttribute('viewBox', '0 0 1800 1500');
        //    svgw.setAttribute('align','right');
        //}
    }

}


function openWin() {
    var myWindow = window.open('', '', 'width=200,height=100');
    //myWindow.document.write("<p>'Select you printer'</p>");
    //
    //myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();

}




//Build a table of health issues
function tableCreate(){
    var ids = new Array();
    var item;

    $("#health_table").find('thead')
        .append($('<tr>')
            .append(' - ')
            .append($('<th>').append('Still Living'))
            .append($('<th>').append(diseasearray[0]))
            .append($('<th>').append(diseasearray[1]))
            .append($('<th>').append(diseasearray[2]))
            .append($('<th>').append(diseasearray[3]))
            .append($('<th>').append(diseasearray[4]))
            .append($('<th>').append(diseasearray[5]))
            .append($('<th>').append(diseasearray[6]))
    );



    $.each(personal_information, function(key, item) {
        var temp = new Array();


        if(item!=null && typeof item != 'undefined') {
            if (item.name != null && typeof item.name != 'undefined') {
                //var d = ((typeof item.cause_of_death == 'undefined') ? 'Yes' : item.cause_of_death);
                temp.push(item.id);
                temp.push(item.name);
                temp.push(((typeof item.cause_of_death == 'undefined') ? 'Yes' : item.cause_of_death));
                //Is in Disease array
                $.each(item['Health History'], function (key, item) {
                    var cols = ['<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>'];
                    var tmp = item['Disease Name'];
                    if ($.inArray(item['Disease Name'], diseasearray) != -1) {
                        for (var i = 0, l = diseasearray.length; i < l; i++) {
                            if (diseasearray[i] === tmp) {
                                cols[i] = '<td>' + tmp + '</td>';
                                break;
                            }
                        }

                        temp.push(cols)
                    }
                    else temp.push('NA');
                });
                ids.push(temp);
            }
        }
    });



    //var otable = $("#health_table").dataTable();
    //otable.fnClearTable();
    $.each(ids, function (key, value) {


        if (value[3] == "NA" || value[3] == null) {
            $("#health_table").find('tbody')
                .append($('<tr>')
                    .append($('<td>').append(value[1]))
                    .append($('<td>').append(value[2]))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
                    .append($('<td>').append(''))
            );
        }
        else{
            $("#health_table").find('tbody')
                .append($('<tr>')
                    .append($('<td>').append(value[1]))
                    .append($('<td>').append(value[2]))
                    .append(value[3])

            );
        }

    });

}

