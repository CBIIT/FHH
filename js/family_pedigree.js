
var mdialog,tdialog;
var original;
var clone;
var masterleft=Math.floor(parseInt($(window).width())/2);
var x = new Array();
var y = new Array();
var xl = new Array();
var ex,ey;
var diseasearray=['Heart Disease','Stroke','Diabetes','Colon Cancer','Breast Cancer','Ovarian Cancer','Additional Diseases'];

function xmlload() {

    mdialog = $('<div id="family_pedigree" width="100%" class="family_dialog">' +
        '<div id="family_pedigree_info">' +
            '<table id="health_table">' +
            '<thead></thead>' +
            '<tfoot></tfoot>' +
            '<tbody></tbody>' +
            '</table>' +
        '</div>' +
        '</div>'
    );

    //var clone = $(mdialog).clone().attr('id', 'dialogIdClone');
    //var saveHtml = $(mdialog).html('');
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


    var merr = 50;
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
    var top=300
    var corner;

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
    svgw.setAttribute('viewBox','0 0 1200 1000');
    svgw.setAttribute('preserveAspectRatio', 'xMinYMin meet')

    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 10, 10, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft-120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft+120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});

    svg.line(g, masterleft-100, 220, masterleft + 120, 220,{id: 'mel', stroke: 'black'});
    svg.line(g,  masterleft+25, 220,  masterleft+25, top,{id: 'mei', stroke: 'black'});
    svg.line(g,  masterleft+25, 150,  masterleft+25, top,{id: 'grmei', stroke: 'black'});
    //$('#grmei').attr('transform', 'translate(0 0) rotate(90)');

    //alert($('#Tpgm_me').attr(''))

    //Gender
    if (personal_information.gender == 'MALE') {
        //Center Me
        svg.rect( masterleft, top, merr, merr, 10, 10, {
            id: 'me',
            class: 'male',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
    }
    else if (personal_information.gender == 'FEMALE') {

        svg.circle(masterleft+25, top, 30, {
            id: 'me',
            class: 'female',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
    }

    var mastery = parseInt($('#me').attr('y'));

    //Prepare all data to array formats for processing
    $.each(personal_information, function (key, item) {

        if (item.id) {
            var ids = new Array();
            ids.push(item.id)
            ids.push(item.name)
            $.each(item['Health History'], function (key, item) {
                ids.push(item['Disease Name'])
            });
            healtharray.push(ids);
        }
        if (key=='paternal_grandmother' || key=='paternal_grandfather' ){
            grantparentalsarray.push([item.gender,item.id]);
        }
        if (key=='maternal_grandmother' || key=='maternal_grandfather' ){
            grantmaternalsarray.push([item.gender,item.id]);
        }
        if (key=='father' ){
            fatherarray.push([item.gender,item.id,item.parent_id]);
        }
        if (key=='mother' ){
            motherarray.push([item.gender,item.id,item.parent_id]);
        }
        if(key.substring(0,13) == "paternal_aunt" || key.substring(0,14) == "paternal_uncle"){
            array.push('PARENTALS');
            paternalrelatives.push([item.gender,item.id,item.parent_id]);
        }
        else if(key.substring(0,13) == "maternal_aunt" || key.substring(0,14) == "maternal_uncle"){
            array.push('MATERNALS');
            maternalrelatives.push([item.gender,item.id,item.parent_id]);
        }
        else if (key.substring(0,5) == "niece"){
            niecearray.push([item.id,key]);
        }
        //else if(key.substring(0,6) == "nephew") {
        //    nephewarray.push([item.id,key]);
        //
        //}
        else if(key.substring(0,6) == "nephew" || key.substring(0,5) == "niece") {
            nephewarray.push([item.gender,item.id,item.parent_id]);
        }
        else if(key.substring(0,15) == "maternal_cousin"){
            maternalcousin.push([item.gender,item.id,item.parent_id]);
        }
        else if(key.substring(0,15) == "paternal_cousin"){
            paternalcousin.push([item.gender,item.id,item.parent_id]);
        }
        else if (key.substring(0, 7) == "brother") {
           brotherssarray.push(['MALE',item.id,key,'me']);
        }
        else if(key.substring(0,6) == "sister"){
            sistersarray.push(['FEMALE',item.id,key,'me']);
        }
        else if(key.substring(0,6) == "sister") {
            siblingsarray.push(['FEMALE',item.id,key,item.parent_id]);
        }
        else if(key.substring(0,8) == "daughter"){
            childrenarray.push(['FEMALE',item.id,key,'me']);

        }
        else if(key.substring(0,3) == "son"){
            childrenarray.push(['MALE',item.id,'me']);
        }
    });

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
        children_load(p1, p2, pid);


    //Begin process
    $.each(personal_information, function (key, item) {

        if (key=='paternal_grandmother' ){
            var mleft = masterleft-30;
            //Prepare line shift in case of aunts/uncles
            if ( ($.inArray('PARENTALS', array) > -1) == true){
                svg.circle(mleft-45, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-80, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }
            else{
                svg.circle(mleft, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-60, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key=='paternal_grandfather' ){
            var mleft = masterleft-185;
            //Prepare line shift in case of aunts/uncles
            if ( ($.inArray('PARENTALS', array) > -1) == true){
                svg.rect(mleft-35, 50, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-70, 120,item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }
            else {
                svg.rect(mleft, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-30, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft, 70, mleft + 130, 70, {id: 'pgl', stroke: 'black'});
            }

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Paternal Grand Parents
        if (key=='maternal_grandmother' ){
            var mleft = masterleft+200;

            if ( ($.inArray('MATERNALS', array) > -1) == true){
                svg.circle(mleft+45, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft-80, 70, mleft+50, 70,{id: 'mgl', stroke: 'black'});
                svg.line(g, mleft-20, 70,  mleft-20, 170,{id: 'mline', stroke: 'black'});
            }
            else{
                svg.circle(mleft, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-45, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft-140, 70, mleft+10, 70,{id: 'mgl', stroke: 'black'});
                svg.line(g, mleft-60, 70, mleft-60, 170,{id: 'mline', stroke: 'black'});
            }

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus(item['id']);
            }
        }

        if (key=='maternal_grandfather' ){
            var mleft = masterleft+60;
            if ( ($.inArray('MATERNALS', array) > -1) == true){
                svg.rect(mleft+40, 50, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft+10, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }
            else{
                svg.rect(mleft, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-30, 120, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Father
        if (key=='father' ){
            var mleft = masterleft-120;
            svg.rect(mleft, 200, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
            svg.text(mleft+40, 180, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            svg.line(g, mleft+20, 170, mleft+20, 200,{id: 'fst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Mother
        if (key=='mother'){
            var mleft = masterleft+140;
            svg.circle(mleft, 220, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
            svg.text(mleft-60, 180, item.name, {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
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
                        //connect_circle_line(p1,p2,no);
                    }
                    else {
                        sl = sl + 80;
                        right_end_line(p1,p2,sl,pw);
                        nieces(no,p1,p2,pid,mid);
                        //connect_circle_line(p1,p2,no);
                    }
                }
            }
            else{

            }

        var pos = 550;
        var k = svg.group({stroke: 'red', strokeWidth: 2, 'z-index' : '9999'});

        //Index keys
        svg.rect(30, 570, 400, 100, 10, 10, {
            id: 'panel',
            fill: 'none',
            stroke: 'silver',
            strokeWidth: 1
        });

        var kcr = 21;
        var krr = 40;

        //Live
        svg.text(100, 10+pos, "Alive", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
        svg.circle(75, 75+pos, kcr,{id: 'kfd',fill: 'white', stroke: 'red', strokeWidth: 2});
        svg.rect(120, 54+pos, krr, krr, 10, 10, {id: 'kma',fill: 'white', stroke: 'red', strokeWidth: 2});

        //Deceased
        svg.text(270, 10+pos, "Deceased", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
        svg.circle(270, 75+pos, kcr, {id: 'kf', fill: 'white', stroke: 'red', strokeWidth: 2});
        svg.rect(325, 53+pos, krr, krr, 10, 10, {id: 'kmd',fill: 'white', stroke: 'red', strokeWidth: 2});

        //Set live status
        circlestatus('kf');
        rectstatus('kmd');

    });

    //Grand parents loading
    parental_grans_load();
    maternal_grans_load();
    //Load Maternal Uncle/Aunt
    maternals_load();
    //Load Paternal Uncle/Aunt
    paternals_load();
    //Load Brothers
    brothers_load();
    //Load Sisters
    sisters_load();
    //Load Nephews
    nephews_load();
    //Load Maternal Cousins
    maternalcousins_load();
    //Load paternal Cousins
    paternalcousins_load();

    //tableCreate();

    //Ensure the table is belw
    var SVG = document.getElementById('svgframe');
    var parent = SVG.parentNode;
    var TBL = parent.firstChild;
    parent.insertBefore(SVG, TBL);






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





    //var toSort = document.getElementById('family_pedigree').children;
    //toSort = Array.prototype.slice.call(toSort, 0);
    //
    //alert(toSort + "-->")
    //toSort.sort(function(a, b) {
    //    var aord = +a.id.split('-')[1];
    //    var bord = +b.id.split('-')[1];
    //
    //
    //
    //    return aord - bord;
    //});




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
    function objconnector(temparray,side,level) {
         x = new Array();
         y = new Array();
        var pid,mid,p1p,p2p;
        var stop = temparray.length - 1;


        //What is the level of the diagram
        corner = returnlevel(level);

        if(temparray.length == 1){
            $.each(temparray, function (key, value) {
                //if (key == stop)return false;
                mid = value[1];
                pid = value[2];
            });

            //Confirm my gender
            if ($('#' + mid).attr('class') == 'male') {
                p1 = parseInt($('#' + mid).attr('x')) + 25;
                p2 = parseInt($('#' + mid).attr('y')) - 80;
            }
            if ($('#' + mid).attr('class') == 'female') {
                p1 = parseInt($('#' + mid).attr('cx'));
                p2 = parseInt($('#' + mid).attr('cy')) - 100;
            }
            //Set connection to parent
            right_line(pid,mid,'single',level);
        }
        else{
            //Prevent too many hooks
            for(i=0;i<temparray.length;i++) {
                var value = temparray[i];

                mid = value[1];
                pid = value[2];


                //Confirm my gender
                if ($('#' + mid).attr('class') == 'male') {
                    p1 = parseInt($('#' + mid).attr('x')) + 20;
                    p2 = parseInt($('#' + mid).attr('y'));
                }
                if ($('#' + mid).attr('class') == 'female') {
                    p1 = parseInt($('#' + mid).attr('cx'));
                    p2 = parseInt($('#' + mid).attr('cy')) - 20;
                }
                if ($('#' + pid).attr('class') == 'male') {
                    p1p = parseInt($('#' + pid).attr('x')) + 20;
                    p2p = parseInt($('#' + pid).attr('y'));
                }
                if ($('#' + pid).attr('class') == 'female') {
                    p1p = $('#' + pid).attr('cx');
                    p2p = $('#' + pid).attr('cy');
                }

                //Set the top connector
                if (i==0) x.push([[p1p, parseInt(p2p)+20],[p1p, parseInt(p2p)+40],[p1, corner-20]])
                //Odd and Even values for the corners of a polyline
                if (value % 2 == 0) {x.push([[p1, p2],[p1, corner]]);}
                else if (value % 2 != 0) {x.push([[p1, corner],[p1, p2],[p1, corner]]);}
            }
            if(side=='C') svg.polyline(x, {id: 'Tr_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
            else if(side=='R') svg.polyline(x, {id: 'Tr_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
            else if(side=='L') svg.polyline(x, {id: 'Tr_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});

            //Set connection to parent
            right_line(pid,mid,'dual',level);
        }
    }

    //Set up the height position of each object from the position of master
    function returnlevel(l){
        if(l == 3)return mastery-20;
        else if (l==4)return mastery+80;
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
            {fill: 'none', stroke: 'blue', strokeWidth: 2});
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
            {fill: 'none', stroke: 'blue', strokeWidth: 2});

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
                        fill: 'red',
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

        //Prevent too many hooks
        $.each(childrenarray, function (key, value) {

            //if(key==0){
            //    left_parent_child_connector(childrenarray[0][2],childrenarray[0][1],childrenarray[0][0], $('#me').attr("class").toUpperCase())
            //}

            var temp = "";
            var e = "";
            //for (var item in value) {
            g = value[0];
            e = value[1];

            //if (e == mid) {
            if(key==0) a1 = parseInt(d1)-25;
            else a1 = parseInt(d1) + (parseInt(key) * 60);

            if(g=='FEMALE') {svg.circle(a1, mastery + 120, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female',cursor: 'pointer'});}
            else if(g=='MALE') {svg.rect(a1, mastery + 100, rr, rr, 10, 10, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
        });
        //return;

        objconnector(childrenarray,'C',4);

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
                        fill: 'white',
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
        var g, e, gen, G;
        var p1,p2;
        var pid,mid;
        var xl = new Array();

        $.each(paternalrelatives, function (key, value) {
            G = value[0];
            e = value[1];
            //mid = value[1];
            pid = value[2];
            var xy;


            //$('#' + pid).attr('fill', 'orange');



            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */
            if(paternalrelatives.length > 1) {
                if(key == 0){
                    var temp = fatherarray[0][1];

                        var ps = GENLINE(fatherarray[0][0],temp);
                        p1 = ps[0];
                        p2 = ps[1];
                        if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                        else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

                        var ps = LEFTGEN(fatherarray[0][0],temp,G);
                        p1= ps[0];
                        p2= ps[1];

                        if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                        else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (paternalrelatives.length - 1)) {
                    mid = paternalrelatives[key - 1][1];
                    var ps = LEFTGEN(paternalrelatives[key - 1][0], mid,G);
                    p1 = ps[0];
                    p2 = ps[1];
                    //if($("#" + mid).length > 0) return false;
                    if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'red', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(G=='FEMALE') {svg.circle(p1, p2, cr, {id: e, fill: 'silver', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (paternalrelatives.length - 1))) {
                    mid = paternalrelatives[key - 1][1];
                    var ps = LEFTGEN(paternalrelatives[key-1][0], mid,G);
                    p1 = ps[0];
                    p2 = ps[1];
                    //if($("#" + mid).length > 0) return false;
                    if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }

            else{

                e = value[1];
                var ps = LEFTGEN(G,e,G);
                p1= ps[0];
                p2= ps[1];

                if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

            }
        });

        //Draw connecting polyline
        for(i=0;i<paternalrelatives.length;i++) {
            var value = paternalrelatives[i];
            mid = value[1];
            var ps = GENLINE(value[0],value[1]);
            p1 = ps[0];
            p2 = ps[1];
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

        }
        var temp =GENLINE(fatherarray[0][0],fatherarray[0][1]);
        //xl.push([temp[0],temp[1]-20],[temp[0],temp[1]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }


    //Load paternal aunt / uncle
    function maternals_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2;
        var pid,mid;
        var xl = new Array();

        $.each(maternalrelatives, function (key, value) {
            G = value[0];
            e = value[1];
            //mid = value[1];
            pid = value[2];
            var xy;

            //$('#' + pid).attr('fill', 'orange');



            /** Parse array and build diagram -
             * Each array object must follow the previous object values
             * in the array when multuple person are in the array
             */
            if(maternalrelatives.length > 1) {
                if(key == 0){
                    var temp = motherarray[0][1];

                    var ps = GENLINE(motherarray[0][0],temp);
                    p1 = ps[0];
                    p2 = ps[1];
                    if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                    else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

                    var ps = RIGHTGEN(motherarray[0][0],temp,G);
                    p1= ps[0];
                    p2= ps[1];

                    if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'black', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (maternalrelatives.length - 1)) {
                    mid = maternalrelatives[key - 1][1];
                    var ps = RIGHTGEN(maternalrelatives[key - 1][0], mid,G);
                    p1 = ps[0];
                    p2 = ps[1];
                    //if($("#" + mid).length > 0) return false;
                    if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'red', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(G=='FEMALE') {svg.circle(p1, p2, cr, {id: e, fill: 'silver', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (maternalrelatives.length - 1))) {
                    mid = maternalrelatives[key - 1][1];
                    var ps = RIGHTGEN(maternalrelatives[key-1][0], mid,G);
                    p1 = ps[0];
                    p2 = ps[1];
                    //if($("#" + mid).length > 0) return false;
                    if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
            }

            else{

                var temp = motherarray[0][1];

                var ps = GENLINE(motherarray[0][0],temp);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
                else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

                var ps = RIGHTGEN(motherarray[0][0],temp,G);
                p1= ps[0];
                p2= ps[1];

                if(G=='MALE') {svg.rect(p1, mastery-100, rr, rr, 10, 10, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if(G=='FEMALE') {svg.circle(p1, mastery-80, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

            }
        });

        //Draw connecting polyline
        for(i=0;i<maternalrelatives.length;i++) {
            var value = maternalrelatives[i];
            mid = value[1];
            var ps = GENLINE(value[0],value[1]);
            p1 = ps[0];
            p2 = ps[1];
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}

        }
        var temp =GENLINE(motherarray[0][0],motherarray[0][1]);
        //xl.push([temp[0],temp[1]-20],[temp[0],temp[1]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }


    /*
    * These functions load the x and y values for lines on objects
     */
    function LEFTGEN(gen,id,G){
        var p1,p2;
        if (gen == 'MALE') {
            p1 = parseInt($('#' + id).attr('x')) -40;
            p2 = parseInt($('#' + id).attr('y'))+20;
            if(G=="FEMALE"){p1 = p1 - 20}
            else{p1 = p1 - 20}
        }
        else if (gen == 'FEMALE') {
            p1 = parseInt($('#' + id).attr('cx'))-40;
            p2 = parseInt($('#' + id).attr('cy'));
            if(G=="MALE"){p1 = p1 - 35}
            else{p1 = p1 - 15}
        }
        return [p1,p2]
    }

    function RIGHTGEN(gen,id,G){

        var p1,p2;
        if (gen == 'MALE') {
            p1 = parseInt($('#' + id).attr('x'))+40;
            p2 = parseInt($('#' + id).attr('y'))+20;
            if(G=="FEMALE"){p1 = p1 + 20}
            else{p1 = p1 + 20}
        }
        else if (gen == 'FEMALE') {
            p1 = parseInt($('#' + id).attr('cx'))+40;
            p2 = parseInt($('#' + id).attr('cy'));
            if(G=="MALE"){p1 = p1 + 5}
            else{p1 = p1 + 20}
        }
        return [p1,p2]
    }

    function GENLINE(gen,id){
        var p1,p2;
        if (gen == 'MALE') {

            p1 = parseInt($('#' + id).attr('x'))+20;
            p2 = parseInt($('#' + id).attr('y'));
        }
        else if (gen == 'FEMALE') {
            p1 = parseInt($('#' + id).attr('cx'));
            p2 = parseInt($('#' + id).attr('cy'))-20;
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
        var g, e, gen, G;
        var p1,p2;
            var pid = 'me';
            var xl = new Array();

        $.each(brotherssarray, function (key, value) {
            G = value[0];
            e = value[1];
            var mid = value[1];

            //$('#' + pid).attr('fill', 'green');

            //Parse array and build diagram
            if(key > 0 && (key < (brotherssarray.length - 1))){
                mid = brotherssarray[key - 1][1];
                p1 = parseInt($('#' + mid).attr('x')) - 60;
                p2 = parseInt($('#' + mid).attr('y')) + 25;
                //Load objects
                //if(G=='MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

            }
            else if(key == (brotherssarray.length - 1)){
                mid = brotherssarray[key-1][1];
                p1 = parseInt($('#' + mid).attr('x')) - 60;;
                p2 = parseInt($('#' + mid).attr('y')) + 25;
                //Load objects
                // if(G=='MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            }
            else{
                e = value[1];
                p1 = parseInt($('#' + pid).attr('x')) - 60;
                p2 = parseInt($('#' + pid).attr('y')) + 25;
                //Load objects
                //if(G=='MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            }
            if(G=='MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

        });

            //Prevent too many hooks
            for(i=0;i<brotherssarray.length;i++) {
                var value = brotherssarray[i];

                mid = value[1];

                //Confirm my gender
                p1 = parseInt($('#' + mid).attr('x')) + 20;
                p2 = parseInt($('#' + mid).attr('y'));

                p1p = parseInt($('#me').attr('x')) + 20;
                p2p = parseInt($('#me').attr('y'));

                if (value % 2 == 0) {xl.push([[p1, p2],[p1, p2-20]]);}
                else if (value % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            }

            var mx = $('#mei').attr("x1");
            var my = $('#mei').attr("y1");
            xl.push([[p1, p2-20],[mx, parseInt(my)+60]]);
            //Load the polyline
            svg.polyline(xl, {id: 'Td_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    //Load sisters
    function sisters_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2;
        var pid = 'me';
        var xl = new Array();

        $.each(sistersarray, function (key, value) {
            G = value[0];
            e = value[1];
            var mid = value[1];

            $('#' + pid).attr('fill', 'green');

            //Parse array and build diagram
            if(key > 0 && (key < (sistersarray.length - 1))){
                mid = sistersarray[key - 1][1];
                p1 = parseInt($('#' + mid).attr('cx')) + 60;
                p2 = parseInt($('#' + mid).attr('cy')) + 25;
                //Load objects
                //if(g=='FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

            }
            else if(key == (sistersarray.length - 1)){
                mid = sistersarray[key-1][1];
                p1 = parseInt($('#' + mid).attr('cx')) + 60;
                p2 = parseInt($('#' + mid).attr('cy')) + 25;
                //Load objects
                //if(g=='FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }
            else{
                e = value[1];
                p1 = parseInt($('#' + pid).attr('x')) + 90;
                p2 = parseInt($('#' + pid).attr('y')) + 25;
                //Load objects
                //if(g=='FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
            }

            if(G=='FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'gray', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

        });

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
        xl.push([[p1, p2-20],[mx, parseInt(my)+60]]);
        //Load the polyline
        svg.polyline(xl, {id: 'Td_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    //Sort the array values by female / male
    function SortByName(a, b){
        var aName = a[0].toLowerCase();
        var bName = b[0].toLowerCase();
        return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    }



    function nephews_load(){
        var lx = 0;
        var ly = 0;
        var pid,mid,G;
        var xl = new Array();
        var start = new Array();

        nephewarray.sort(SortByName);

            $.each(nephewarray, function (key, value) {



                //alert(value)

                if(key == 0 && (childrenarray.length>0)){
                    var d = childrenarray[childrenarray.length - 1];
                     lx = parseInt($('#' + d[1]).attr('cx'));
                     ly = parseInt($('#' + d[1]).attr('cy'));
                }
                 G =  value[0];
                 mid = value[1];
                 pid = value[2];


                $('#' + pid).attr('fill', 'blue');

                if ($('#' + pid).attr('class') == 'male') {
                    p1 = parseInt($('#' + pid).attr('x'));
                    p2 = parseInt($('#' + pid).attr('y'))  + 60;
                    p1 = parseInt(lx) + (parseInt(key) * 50) - 50;
                    if(key==0) p1 =  parseInt(lx) - (parseInt(key) * 50) - 45;
                    else p1 =  parseInt(lx) - (parseInt(key) * 50) - 60;
                }
                else if ($('#' + pid).attr('class') == 'female') {
                    p1 = parseInt($('#' + pid).attr('cx'));
                    p2 = parseInt($('#' + pid).attr('cy'))  + 80;
                    p1 = parseInt(lx) + (parseInt(key) * 50) + 50;
                    if(key==0) p1 =  parseInt(lx) + (parseInt(key) * 50) + 45;
                    else p1 =  parseInt(lx) + (parseInt(key) * 50) + 60;
                }

                //RIGHTGEN(nephewarray[key - 1][0],nephewarray[key - 1][1],G)

                if(G=='FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'gray', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if(G=='MALE') {svg.rect(p1, p2, rr, rr, 10, 10, {id: mid, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

                if(key==0){
                    var temp = $('#' + pid).attr('class').toUpperCase();
                    right_parent_child_connector(nephewarray[key][2], nephewarray[key][1],G,temp);
                }

            });

        //Draw connecting polyline
        for(i=0;i<nephewarray.length;i++) {
            var value = nephewarray[i];
            mid = value[1];
            pid = value[2];

            var ps = GENLINE(value[0],value[1]);
            p1 = ps[0];
            p2 = ps[1];
            //Begin of the objects coord recorder
            if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        }

        if ($('#' + pid).attr('class') == 'female') {
            p1 = parseInt($('#' + pid).attr('cx'));
            p2 = parseInt($('#' + pid).attr('cy'));
        }
        else{
            p1 = parseInt($('#' + pid).attr('x'));
            p2 = parseInt($('#' + pid).attr('y'));
        }
        //Load the polyline
        svg.polyline(xl, {id: 'Tn_' + pid, fill: 'none', stroke: 'blue', strokeWidth: 2});

        //objconnector(nephewarray,'R',4);

    }

    function nieces_load(){
        var lx = 0;
        var ly = 0;



        $.each(nephewarray, function (key, value) {

            if(key == 0 && (childrenarray.length>0)){
                var d = childrenarray[childrenarray.length - 1];
                lx = parseInt($('#' + d[1]).attr('cx'));
                ly = parseInt($('#' + d[1]).attr('cy'));
            }

            var mid = value[1];
            var pid = value[3];

            //$('#' + pid).attr('fill', 'blue');


            if ($('#' + pid).attr('class') == 'male') {
                p1 = parseInt($('#' + pid).attr('x'));
                p2 = parseInt($('#' + pid).attr('y'))  + 60;
            }
            if ($('#' + pid).attr('class') == 'female') {
                p1 = parseInt($('#' + pid).attr('cx'));
                p2 = parseInt($('#' + pid).attr('cy'))  + 80;
            }
            p1 = parseInt(lx) + (parseInt(key) * 50) + 60;

            svg.circle(p1, p2 + 100, cr, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});
        });
    }

//Load paternal cousins
    function maternalcousins_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2,mid,pid;

        //Sort cousins to groups
        maternalcousin.sort(SortByName);

        $.each(maternalcousin, function (key, value) {
            G = value[0];
            e = value[1];
            var mid = value[1];
            var pid = value[2];

            //$('#' + pid).attr('fill', 'yellow');

            if(maternalcousin.length>1) {

                //Parse array and build diagram
                if (key == 0) {

                    var ps = RIGHTGEN(maternalcousin[0][0], maternalcousin[0][2], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    if (sistersarray.length > 0) {
                        var d = sistersarray[sistersarray.length - 1];
                        lx = parseInt($('#' + d[1]).attr('cx'));
                        ly = parseInt($('#' + d[1]).attr('cy'));
                    }

                    p1 = parseInt(p1) + 60;

                    if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                    var ps = GENLINE(maternalcousin[0][0], maternalcousin[0][2]);
                    p1 = ps[0];
                    p2 = ps[1];
                    //Connect parent and child
                    right_parent_child_connector(pid, mid,maternalcousin[0][0],G);

                }
                else if (key == (maternalcousin.length - 1)) {
                    var ps = RIGHTGEN(maternalcousin[key - 1][0], maternalcousin[key - 1][1], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'silver', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (maternalcousin.length - 1))) {

                    var ps = RIGHTGEN(maternalcousin[key - 1][0], maternalcousin[key - 1][1], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                    var ps = GENLINE(maternalcousin[0][0], maternalcousin[0][2]);
                    p1 = ps[0];
                    p2 = ps[1];


                }
            }
            else {
                var ps = RIGHTGEN(maternalcousin[0][0], maternalcousin[0][2], G);
                p1 = ps[0];
                p2 = ps[1];

                if (sistersarray.length > 0) {
                    var d = sistersarray[sistersarray.length - 1];
                    lx = parseInt($('#' + d[1]).attr('cx'));
                    ly = parseInt($('#' + d[1]).attr('cy'));
                }

                p1 = parseInt(p1) + (parseInt(lx) - parseInt(lx) + 60);

                if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                var ps = GENLINE(maternalcousin[0][0], maternalcousin[0][2]);
                p1 = ps[0];
                p2 = ps[1];

                right_parent_child_connector(pid, e,maternalcousin[0][0],G);
            }

        });

//Draw connecting polyline
        for(i=0;i<maternalcousin.length;i++) {
            var ps = GENLINE(maternalcousin[i][0],maternalcousin[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //Begin of the objects coord recorder
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        }
        //Load the polyline
        svg.polyline(xl, {id: 'Tpmc_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

function right_parent_child_connector(pid,mid,midG,pidG){
    var xl=new Array();
    var x, y,ex,ey;

    if(pidG == "FEMALE") {
         x = parseInt($('#' + pid).attr('cx'));
         y = parseInt($('#' + pid).attr('cy'));

    }
    else if(pidG == "MALE"){
         x = parseInt($('#' + pid).attr('x'));
         y = parseInt($('#' + pid).attr('y'));
    }

    if(midG == "FEMALE") {
         ex = parseInt($('#' + mid).attr('cx'));
         ey = parseInt($('#' + mid).attr('cy'));
    }
    else if(midG == "MALE"){
         ex = parseInt($('#' + mid).attr('x'));
         ey = parseInt($('#' + mid).attr('y'));
        if(pidG=="FEMALE"){ex = ex + 20}
    }
    xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex, ey-20]]);

    //if (i % 2 == 0) {xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex,  ey-20]]);}
    svg.polyline(xl, {id: 'Tcr_' + mid, fill: 'none', stroke: 'blue', strokeWidth: 2});
    return false;
}

    function left_parent_child_connector(pid,mid,midG,pidG){
        var xl=new Array();
        if(pidG == "FEMALE") {
            var x = parseInt($('#' + pid).attr('cx'));
            var y = parseInt($('#' + pid).attr('cy'));
        }
        else{
            var x = parseInt($('#' + pid).attr('x'));
            var y = parseInt($('#' + pid).attr('y'));
        }
        if(midG == "FEMALE") {
            var ex = parseInt($('#' + mid).attr('cx'));
            var ey = parseInt($('#' + mid).attr('cy'));
        }
        else{
            var ex = parseInt($('#' + mid).attr('x'));
            var ey = parseInt($('#' + mid).attr('y'));
            if(pidG=="FEMALE"){ex = ex - 20}
        }

        xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex, ey-20]]);

        //if (i % 2 == 0) {xl.push([[x, y+20],[x, y+40],[ex,  y+40],[ex,  ey-20]]);}
        svg.polyline(xl, {id: 'Tcl_' + mid, fill: 'none', stroke: 'red', strokeWidth: 2});
        return false;
    }

    //Load paternal cousins
    function paternalcousins_load(){
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1,p2;
        xl = new Array();

        //Sort array to groups
        paternalcousin.sort(SortByName);

        $.each(paternalcousin, function (key, value) {
            G = value[0];
            e = value[1];
            var mid = value[1];
            var pid = value[2];

            if(paternalcousin.length>1) {

                if (key == 0) {
                    var ps = LEFTGEN(paternalcousin[0][0], paternalcousin[0][2], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    if(key == 0 && (brotherssarray.length>0)){
                        var d = brotherssarray[brotherssarray.length - 1];
                        lx = parseInt($('#' + d[1]).attr('x'));
                        ly = parseInt($('#' + d[1]).attr('y'));
                    }

                    p1 = parseInt(p1) - 60;

                    if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: mid, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: mid, fill: 'purple', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}

                    var ps = GENLINE(paternalcousin[0][0], paternalcousin[0][2]);
                    p1 = ps[0];
                    p2 = ps[1];
                    //Connect parent and child
                    left_parent_child_connector(pid, mid,paternalcousin[0][0],G);
                }

                //Parse array and build diagram
                else if (key == (paternalcousin.length - 1)) {

                    var ps = LEFTGEN(paternalcousin[key - 1][0], paternalcousin[key - 1][1], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    //Load objects
                    if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'red', stroke: 'yellow', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                    else if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'yellow', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

                }
                else if (key > 0 && (key < (paternalcousin.length - 1))) {
                    var ps = LEFTGEN(paternalcousin[key - 1][0], paternalcousin[key - 1][1], G);
                    p1 = ps[0];
                    p2 = ps[1];

                    //Load objects
                    if (G == 'FEMALE') {svg.circle(p1, mastery + 20, cr, {id: e, fill: 'red', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                    else if (G == 'MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'orange', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

                }
            }
            else{

                var ps = LEFTGEN(paternalcousin[0][0], paternalcousin[0][2], G);
                p1 = ps[0];
                p2 = ps[1];

                if(key == 0 && (brotherssarray.length>0)){
                    var d = brotherssarray[brotherssarray.length - 1];
                    lx = parseInt($('#' + d[1]).attr('x'));
                    ly = parseInt($('#' + d[1]).attr('y'));
                }
                p1 = parseInt(p1) + (parseInt(lx) + parseInt(lx) - 60);

                //Load objects
                if(G=='FEMALE') {svg.circle(p1, mastery+20, cr, {id: e, fill: 'red', stroke: 'blue', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if(G=='MALE') {svg.rect(p1, mastery, rr, rr, 10, 10, {id: e, fill: 'blue', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}

                left_parent_child_connector(pid, e,paternalcousin[0][0],G);
            }
        });

        //Draw connecting polyline
        for(i=0;i<paternalcousin.length;i++) {
            var ps = GENLINE(paternalcousin[i][0],paternalcousin[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //Begin of the objects coord recorder
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
            else if (i % 2 != 0) {xl.push([[p1, p2-20],[p1, p2],[p1, p2-20]]);}
        }
        //Load the polyline
        svg.polyline(xl, {id: 'Tppc_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});

    }








    //Draws polyline to the right side of the diagram
    function right_line(pid,mid,mode,level) {


        var ta = parenttargets(pid,mid,mode,level);
        var lines = [[ta[0],ta[1]],[ta[2],ta[3]],[ta[4],ta[5]]];
        //Set polylines
        swapline(pid,lines,mode,level)

    }

    //Process the targets and return
    function parenttargets(pid,mid,mode,level) {
        var t1x, t1y, t2, t3, l1, l2, tr2, tr3;
        var tid = $('#' + pid).attr('id');
        var points = $('#P_' + pid).attr('points');
        var targets = $('#Tr_' + pid).attr("points");
        corner = returnlevel(level);

        if (typeof points != 'undefined') {
            points = points.split(' ')[2].split(',');
            t2 = points[3];
            t3 = points[4];
        }

        if (typeof targets == 'undefined') {

        }
        else {

            targets = targets.split(',');


            tr2 = [targets[0]];
            tr3 = [targets[1]];
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

        //Confirm target
        if ($('#' + mid).attr('class') == 'male') {
            t1x = parseInt($('#' + mid).attr('x'));
            t1y = parseInt($('#' + mid).attr('y'));
        }
        if ($('#' + mid).attr('class') == 'female') {
            t1x = parseInt($('#' + mid).attr('cx'));
            t1y = parseInt($('#' + mid).attr('cy'));
        }
        if (mode == 'dual') {

        return [
            l1, parseInt(l2)+20,
            l1, parseInt(l2)+40,
            tr2, parseInt(tr3)
        ];
        }
        else return [
            l1,l2+20,
            l1,l2+60,
            l1+10,l2+60,
            l1+10,t1y
            //, tr2,tr3
        ];
    }

    //Polyline drawing function
    function swapline(pid,lines,mode,level) {
            if (mode == 'dual') {
                svg.polyline(
                    lines,
                    {id: 'T_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
                //{id: 'T_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2, transform:"translate(100, 0) scale(-1, 1) "});
            }
            else {
                svg.polyline(
                    lines,
                    {id: 'T_' + pid, fill: 'none', stroke: 'gray', strokeWidth: 2});
                //{id: 'T_' + pid, fill: 'none', stroke: 'green', strokeWidth: 2, transform:'translate(10,0) scale(1.5) rotate(50)'});
            }
    }

    function setTransform(elem, x, y, scale) {
        var transform = elem.data('transform');
        transform.x += (x || 0);
        transform.y += (y || 0);
        transform.scale *= (scale || 1);
        elem.data('transform', transform);
        return 'translate(' + transform.x + ' ' + transform.y + ') scale(' + transform.scale + ')';
    }

    //Viewbox resize function
    //function resize(selector) {
    //    // selector points to the enclosing g element
    //    var innerSVG = $(selector + " svg")[0];
    //    var bbox = innerSVG.getBBox();
    //    // somehow $.attr didn't work
    //    innerSVG.setAttribute("viewBox", [bbox.x, bbox.y, bbox.width, bbox.height].join(" "));
    //    $(selector).css("visibility", "visible");
    //}

if(nephewarray.length>10) {
    if(paternalcousin.length>10){
        svgw.setAttribute('viewBox', '-700 -25 2200 1800');
    }
    else {
        svgw.setAttribute('viewBox', '0 0 1800 1500');
        svgw.setAttribute('align','right');
    }
}

}




//Build a table of health issues
function tableCreate(){
    var ids = new Array();

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

        if (item.name!=null) {
            //var d = ((typeof item.cause_of_death == 'undefined') ? 'Yes' : item.cause_of_death);
            temp.push(item.id);
            temp.push(item.name);
            temp.push(((typeof item.cause_of_death == 'undefined') ? 'Yes' : item.cause_of_death));
            //Is in Disease array
            $.each(item['Health History'], function (key, item) {
                var cols = ['<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>'];
                var tmp = item['Disease Name'];
                if($.inArray( item['Disease Name'], diseasearray ) != -1){
                    for (var i=0, l = diseasearray.length; i<l; i++) {
                        if (diseasearray[i] === tmp) {
                            cols[i]='<td>' + tmp + '</td>';
                            break;}
                    }

                    temp.push(cols)
                }
                else temp.push('NA');
            });
            ids.push(temp);
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

        //alert("-->"+value)

        //otable.dataTable().fnAddData([value[1], value[0], "1", "2", "3", "4", "5", "6", "7"]);


    });

    //return tdialog;

}
//<div id="table">
//    <table>
//        <tr>
//            <td>Test</td>
//        </tr>
//    </table>
//</div>