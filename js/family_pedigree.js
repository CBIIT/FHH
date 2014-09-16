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
var healtharray = new Array();
var ex,ey;
var MYNAME,MYGENDER;
var svgw;
var diseasearray=['Heart Disease','Stroke','Diabetes','Colon Cancer','Breast Cancer','Ovarian Cancer','Additional Diseases'];

function xmlload() {
    mdialog = $('<div id="family_pedigree" class="family_dialog" >' +
        '<input id="printer" align="right" type="button" value="print"/>' +
        //'<input align="right" type="button" value="pivot" onclick="GET_FAMILY()"/>' +
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
        open: function () {
            $(this).dialog("open");
            $(this).load(LOAD_HEALTH_TABLE());
        },
        close: function () {
            $(this).empty();
            $(this).dialog('destroy').remove()
        }
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
    var grantparentalsarray = new Array();
    var grantmaternalsarray = new Array();
    var fatherarray = new Array();
    var motherarray = new Array();

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
    //svgw.setAttribute('width', '100%');
    svgw.setAttribute('height', '100%');
    //svgw.setAttribute('overflow-x','scroll');

    //svgw.setAttribute('viewBox','-1000 -350 2800 1000');
    //svgw.setAttribute('viewBox','0 0 1000 1300');
    //svgw.setAttribute('style','overflow-x:scroll; overflow-y:scroll');

    //Outer Frame
    //svg.rect(25, 5, ['95%'], 700, 1, 1, {id: 'diagramframe', fill: 'none', stroke: 'navy', strokeWidth: 1});
    svg.text(masterleft - 120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft + 120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.line(g, masterleft - 100, 220, masterleft + 120, 220, {id: 'mel', stroke: 'black'});
    svg.line(g, masterleft + 25, 220, masterleft + 25, top, {id: 'mei', stroke: 'black'});
    svg.line(g, masterleft + 25, 220, masterleft + 25, top, {id: 'grmei', stroke: 'black'});
    svg.line(g, masterleft - 140, 220, masterleft + 180, 220, {id: 'grmei1', stroke: 'black'});
    svg.line(g, masterleft - 140, 200, masterleft - 140, 70, {id: 'grmei2', stroke: 'black'});
    svg.line(g, masterleft + 180, 200, masterleft + 180, 70, {id: 'grmei3', stroke: 'black'});




    //Gender
    if (personal_information.gender == 'MALE') {
        //Center Me
        svg.rect(masterleft, top, rr, rr, 1, 1, {
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


    //Build health array
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

    var ids = new Array();
    ids.push('me');
    ids.push(personal_information.name);
    $.each(personal_information['Health History'], function (key, item) {
        var dis = item['Disease Name'];
        ids.push(dis)
    });
    healtharray.push(ids);

    //alert ("healtharray ARRAY Information:" + JSON.stringify(healtharray, null, 2) );

    //Set the master Y levels
    var Level4F = mastery + 170;
    var Level4M = mastery + 150;

    var Level3F = mastery + 20;
    var Level3M = mastery - 0;


    var Level2F = 220;
    var Level2M = 200;


    var NAMEARRY = new Array();



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
            grantparentalsarray.push([item.gender, id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        if (key == 'maternal_grandmother' || key == 'maternal_grandfather') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            grantmaternalsarray.push([item.gender, id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        if (key == 'father') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            fatherarray.push([item.gender, id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        if (key == 'mother') {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            motherarray.push([item.gender, id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }

        if (key.substring(0, 13) == "paternal_aunt") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            array.push('PARENTALS');

            paternalrelatives.push([item.gender, id, 'PA_' + key.substring(14, 15), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 14) == "paternal_uncle") {
            var id;

            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            array.push('PARENTALS');
            paternalrelatives.push([item.gender, id, 'PU_' + key.substring(15, 16), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 13) == "maternal_aunt") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            array.push('MATERNALS');
            maternalrelatives.push([item.gender, id, 'MA_' + key.substring(14, 15), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 14) == "maternal_uncle") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            array.push('MATERNALS');
            maternalrelatives.push([item.gender, id, 'MU_' + key.substring(15, 16), item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);

        }
        else if (key.substring(0, 6) == "nephew" || key.substring(0, 5) == "niece") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            nephewarray.push([item.gender, id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 15) == "maternal_cousin") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            maternalcousin.push([item.gender, id, item.parent_id, key]);

            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 15) == "paternal_cousin") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;

            paternalcousin.push([item.gender, id, item.parent_id]);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 7) == "brother") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            brotherssarray.push(['MALE', id, 'PB_' + key.substring(8, 9), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 20) == "paternal_halfbrother") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            brotherssarray.push(['MALE', id, 'PPHB_' + key.substring(21, 22), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 20) == "maternal_halfbrother") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            brotherssarray.push(['MALE', id, 'PMHB_' + key.substring(21, 22), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 6) == "sister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            sistersarray.push(['FEMALE', id, 'MS_' + key.substring(7, 8), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 19) == "paternal_halfsister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            sistersarray.push(['FEMALE', id, 'MPHS_' + key.substring(21, 21), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 19) == "maternal_halfsister") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            sistersarray.push(['FEMALE', id, 'MMHS_' + key.substring(21, 21), 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
        else if (key.substring(0, 8) == "daughter") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            childrenarray.push(['FEMALE', id, key, 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);

        }
        else if (key.substring(0, 3) == "son") {
            var id;
            if (item.id == "" || item.id == null)id = key + rand;
            else id = item.id;
            childrenarray.push(['MALE', id, 'me']);
            var t = {"id": [item.id], "name": [item.name], "gender": [item.gender], key: [key]};
            NAMEARRY.push(t);
        }
    });

    //Set self up
    var t = {"id": 'me', "name": [personal_information.name], "gender": [personal_information.gender], key: 'self'};
    NAMEARRY.push(t);
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
    if (childrenarray.length > 0) children_load(p1, p2, pid);


    //Begin process
    $.each(personal_information, function (key, item) {

        if (key == 'paternal_grandmother') {
            var mleft = masterleft - 30;
            var id = item['id'];
            if (id == "" || id == null)id = "pGM";
            svg.circle(mleft - 45, 70, cr, {
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
            var mleft = masterleft - 185;
            var id = item['id'];
            if (id == "" || id == null)id = "pGF";
            svg.rect(mleft - 35, 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });

            SPOUCE_CONNECT(id);

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Paternal Grand Parents
        if (key == 'maternal_grandmother') {
            var mleft = masterleft + 200;
            var id = item['id'];
            if (id == "" || id == null)id = "mGM";
            svg.circle(mleft + 45, 70, cr, {
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
            var mleft = masterleft + 60;
            var id = item['id'];
            if (id == "" || id == null)id = "mGF";
            svg.rect(mleft + 40, 50, rr, rr, 1, 1, {
                id: id,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });
            SPOUCE_CONNECT(id);
            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Father
        if (key == 'father') {
            var mleft = masterleft - 160;
            svg.rect(mleft, 200, rr, rr, 1, 1, {
                id: fatherarray[0][1],
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });
            svg.line(g, mleft + 20, 170, mleft + 20, 200, {id: 'fst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Mother
        if (key == 'mother') {
            var mleft = masterleft + 180;
            svg.circle(mleft, 220, cr, {
                id: motherarray[0][1],
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                cursor: 'pointer',
                class: item.gender
            });
            svg.line(g, mleft, 170, mleft, 200, {id: 'mst', stroke: 'black'});

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

            if (key.substring(0, 7) == "brother") {
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if (key.substring(0, 6) == "sister") {
                //Check the live status
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

            else if (key.substring(0, 15) == "maternal_cousin") {
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if (key.substring(0, 15) == "paternal_cousin") {
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if (key.substring(0, 5) == "niece") {
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

        var pos = 750;
        var k = svg.group({stroke: 'red', strokeWidth: 2, 'z-index': '9999'});

        //Index keys
        svg.rect(30, 20 + pos, 400, 100, 1, 1, {
            id: 'panel',
            fill: 'none',
            stroke: 'silver',
            strokeWidth: 1
        });

        var kcr = 21;
        var krr = 40;

        //Live
        svg.text(100, 10 + pos, "Alive", {fontWeight: 'bold', fontSize: '16.5', fill: 'gray'});
        svg.circle(75, 75 + pos, kcr, {id: 'kfd', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(120, 54 + pos, krr, krr, 1, 1, {id: 'kma', fill: gencolor, stroke: 'red', strokeWidth: 2});

        //Deceased
        svg.text(270, 10 + pos, "Deceased", {fontWeight: 'bold', fontSize: '16.5', fill: 'gray'});
        svg.circle(270, 75 + pos, kcr, {id: 'kf', fill: gencolor, stroke: 'red', strokeWidth: 2});
        svg.rect(325, 53 + pos, krr, krr, 1, 1, {id: 'kmd', fill: gencolor, stroke: 'red', strokeWidth: 2});

        //Set live status
        circlestatus('kf');
        rectstatus('kmd');

    });

    //Grand parents loading
    PATERNAL_GRANS_LOAD();
    MATERNAL_GRANS_LOAD();
    //Load Brothers
    BROTHERS_LOAD();
    //Load Sisters
    SISTERS_LOAD();
    //Load Maternal Uncle/Aunt
    MATERNALS_LOAD();
    //Load Paternal Uncle/Aunt
    PATERNALS_LOAD();
    //Load Nephews
    NEPHEWS_LOAD();

    //Load paternal Cousins
    PATERNAL_COUSINS_LOAD();
    //Load Maternal Cousins
    MATERNAL_COUSINS_LOAD();

    //LOAD_HEALTH_TABLE();

    //Ensure the table is belw
    var SVG = document.getElementById('svgframe');
    var parent = SVG.parentNode;
    var TBL = parent.firstChild;
    parent.insertBefore(SVG, TBL);

    LOAD_NAMES(NAMEARRY);
    LOAD_HEALTH(healtharray);

    $( "#printer" ).click(function() {
        //var popUpAndPrint = function () {
        var container = $('#family_pedigree');
        var width = parseFloat(svgw.getAttribute("width"))
        var height = parseFloat(svgw.getAttribute("height"))
        var printWindow = window.open('', 'PrintMap',
            'width=' + width + ',height=' + height);
        printWindow.document.writeln($(container).html());
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
        //};
        setTimeout(popUpAndPrint, 500);
    });

    $.each(healtharray, function (key, value) {
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
                    text: '<p class="qtitle">' + name + ': Diseases</p>',
                    button: true
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
                classes: 'qtip-bootstrap'
            }
        });
    });

    //var printSVG = function() {
    //
    //    var popUpAndPrint = function () {
    //        var container = $('#family_pedigree');
    //        var width = parseFloat(svgw.attr("width"))
    //        var height = parseFloat(svgw.attr("height"))
    //        var printWindow = window.open('', 'PrintMap',
    //            'width=' + width + ',height=' + height);
    //        printWindow.document.writeln($(container).html());
    //        printWindow.document.close();
    //        printWindow.print();
    //        printWindow.close();
    //    };
    //    setTimeout(popUpAndPrint, 500);
    //};




    function LOAD_NAMES(NAMEARRY) {
        var k;
        var dis = new Array();
        $.each(NAMEARRY, function () {
            //$(NAMEARRY).each(function() {
            var temp = new Array();
            var ID = this.id;
            var NAME = this.name;
            var GEN = this.gender;
            var TITLE = this.key;
            var p1, p2, name1, name2;


            if (NAME == "") {
                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) + 5;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;
                }

                svg.text(p1, p2, TITLE.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
            }
            else if (ID != "") {

                if (GEN == "FEMALE") {
                    p1 = parseInt($('#' + ID).attr('cx')) - 20;
                    p2 = parseInt($('#' + ID).attr('cy')) + 40;
                    temp = NAME.toString().split(' ');

                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                    }
                }
                else {
                    p1 = parseInt($('#' + ID).attr('x')) + 5;
                    p2 = parseInt($('#' + ID).attr('y')) + 60;

                    temp = NAME.toString().split(' ');
                    if (temp.length >= 2) {
                        name1 = temp[0].substr(0, 8);
                        name2 = temp[1].substr(0, 8);
                        svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                        svg.text(p1, p2 + 20, name2.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                    }
                    else {
                        name1 = temp[0].substr(0, 8);
                        name2 = "";
                        svg.text(p1, p2, name1.toString(), {fontWeight: 'bold', fontSize: '16.5', fill: 'red'});
                    }
                }
            }

        });
    }


    function LOAD_HEALTH(healtharray) {
        var k;
        var dis = new Array();

        for (t == 0; t < healtharray.length; t++) {

            var tmp = new Array();
            var id = healtharray[t][0];
            var name = healtharray[t][1];

            var dis1 = healtharray[t][2];
            var dis2 = healtharray[t][3];
            var dis3 = healtharray[t][4];

            if (dis1 != null)tmp.push(dis1)
            if (dis2 != null)tmp.push(dis2)
            if (dis3 != null)tmp.push(dis3)


            dis.push({"id": id, "name": name, "value": tmp});
        }

        for (k = 0; k < dis.length; k++) {
            var tid = dis[k].id;
            var tname = dis[k].name;
            var tvals = dis[k].value;
            var tsplit = new Array();

            var gender = $('#' + tid).attr("class");
            if (typeof gender == 'undefined')gender = "NA";
            if (gender.toUpperCase() == 'FEMALE') {
                p1 = $('#' + tid).attr("cx") - 20;
                p2 = parseInt($('#' + tid).attr("cy")) + 55;
            }
            else {
                p1 = $('#' + tid).attr("x");
                p2 = parseInt($('#' + tid).attr("y")) + 75;
            }
            if (tname.indexOf(' ') != -1) {
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

                if (tvals.length > 0) {
                    var r = 0;
                    for (t = 0; t < tvals.length; t++) {
                        if (t == 0) r = parseInt(r) + 25;
                        else r = parseInt(r) + 12;
                        svg.text(p1, parseInt(p2) + r, ' - ' + tvals[t].substring(0, 5), {
                            //fontWeight: 'bold',
                            //fontSize: '12.5',
                            fill: 'black',
                            stroke: 'black',
                            'stroke-width': '0.5',
                            //textLength: '50px',
                            lengthAdjust: 'spacingAndGlyphs',
                            class: 'infobox'
                        });
                    }
                }

            }
            else {
                //svg.text(p1, parseInt(p2), tname, {
                //    //fontWeight: 'bold',
                //    //fontSize: '12.5',
                //    fill: 'navy',
                //    stroke: 'navy',
                //    //'stroke-width': '0.5',
                //    //textLength: '50px',
                //    lengthAdjust: 'spacingAndGlyphs',
                //    class: 'infobox'
                //});
                if (tvals.length > 0) {
                    var r = 0;
                    for (t = 0; t < tvals.length; t++) {
                        if (t == 0) r = parseInt(r) + 15;
                        else r = parseInt(r) + 12;
                        svg.text(p1, parseInt(p2) + r, ' - ' + tvals[t].substring(0, 5), {
                            //fontWeight: 'bold',
                            //fontSize: '12.5',
                            fill: 'black',
                            stroke: 'black',
                            //'stroke-width': '0.5',
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
            {fill: 'none', stroke: 'green', strokeWidth: 2});
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
            {fill: 'none', stroke: 'black', strokeWidth: 2});
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
            {fill: 'none', stroke: 'black', strokeWidth: 2});
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
            {fill: 'none', stroke: 'black', strokeWidth: 2});
    }


    function polyline(p1, p2) {
        svg.polyline(
            [
                [parseInt(p1) + 105, parseInt(p2) + 110],
                [parseInt(p1) + 105, parseInt(p2) + 90],
                [parseInt(p1) + 170, parseInt(p2) + 90],
                [parseInt(p1) + 170, parseInt(p2) + 110]
            ],
            {fill: 'none', stroke: 'black', strokeWidth: 2});
    }

    //Build active statuses for deceosed
    function circlestatus(id) {
        var p1 = $('#' + id).attr('cx');
        var p2 = $('#' + id).attr('cy');
        svg.polyline([[parseInt(p1) - 17, parseInt(p2) + 12], [parseInt(p1) + 18, parseInt(p2) - 15]],
            {fill: 'none', stroke: 'red', strokeWidth: 2});
        return false;
    }

    function rectstatus(id) {
        var p1 = $('#' + id).attr('x');
        var p2 = $('#' + id).attr('y');
        svg.polyline([[parseInt(p1 - 0), parseInt(p2) + 40], [parseInt(p1) + 40, parseInt(p2) - 0]],
            {fill: 'none', stroke: 'red', strokeWidth: 2});
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

    //Collect the children
    function children_load(d1, d2, pid) {
        var MIDGEN = $('#me').attr("class");
        //Load my spouce
        LOAD_SPOUCE_MATERNAL('me', $('#me').attr("class"))

        if (MIDGEN.toUpperCase() == "MALE")svg.line(g, masterx + 65, mastery + 25, masterx + 65, mastery + 130, {
            id: 'childs',
            stroke: 'black'
        });
        else svg.line(g, masterx + 45, mastery + 20, masterx + 45, mastery + 130, {id: 'childs', stroke: 'black'});

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
                else p1 = parseInt(masterx) + 20 + (parseInt(key) * 60);

                if (g == 'FEMALE') {svg.circle(p1 + 50, Level4F, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if (g == 'MALE') {svg.rect(p1 + 25, Level4M, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            });
        }
        else {
            $.each(childrenarray, function (key, value) {
                var temp = "";
                var id = "";
                //for (var item in value) {
                g = value[0];
                id = value[1];
                if (id == "" || id == null) id = 'chl_' + key;
                if (key == 0) p1 = parseInt(masterx) + 20;

                if (g == 'FEMALE') {svg.circle(p1 + 45, Level4F - 20, cr, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                else if (g == 'MALE') {svg.rect(p1 + 0, Level4M - 20, rr, rr, 1, 1, {id: id, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
            });

        }


        OBJECTS_CONNECT(childrenarray, 'ctest');
    }

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

    //Load paternal aunt / uncle
    function PATERNALS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, MID, gen, MIDGEN, PERVMID;
        var p1, p2;
        var pid, mid;
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
            if (brotherssarray.length > 0) {
                var d = brotherssarray[brotherssarray.length - 1];
                if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                //else lx = parseInt($('#' + d[1]).attr('cx'));
            }
            else {
                lx = 60
            }

            if (paternalrelatives.length > 1) {
                if (key == 0) {
                    //Get father location
                    var check = IS_IN_ARRAY(paternalcousin, MID);
                    var PARENTID = fatherarray[0][1];
                    var PARENTGEN = fatherarray[0][0]
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
                    if (brotherssarray.length > 0) {
                        p1 = parseInt(lx) - 40;
                    }
                    else{
                        p1 = parseInt(p1) - 80;
                    }
                    if (check != -1)p1 = parseInt(p1) - 80;
                    //else p1 = parseInt(p1) - 40;
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (paternalrelatives.length - 1)) {
                    var PERVMID = paternalrelatives[key - 1][1];
                    var PERVGEN = paternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(paternalcousin, PERVMID);
                    var ps = LEFT_PATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(paternalcousin, PERVMID);
                        if (c <= 4){p1 = parseInt(p1) - 140;}
                        else if (c > 4 && c < 6){p1 = parseInt(p1) - 200;}
                        else{p1 = parseInt(p1) - 260;}
                    }
                    else {
                        p1 = parseInt(p1) - 60;
                    }

                    //if (check != -1) {
                    //    p1 = parseInt(p1) - 140
                    //}
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key > 0 && (key < (paternalrelatives.length - 1))) {
                    PERVMID = paternalrelatives[key - 1][1];
                    var PERVMID = paternalrelatives[key - 1][1];
                    var PERVGEN = paternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(paternalcousin, PERVMID);
                    var ps = LEFT_PATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(paternalcousin, PERVMID);
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
                var PARENTID = fatherarray[0][1];
                var PARENTGEN = fatherarray[0][0];
                var ps = PAT_GENLINE(PARENTGEN, PARENTID);
                var check = IS_IN_ARRAY(paternalcousin, MID);
                p1 = ps[0];
                p2 = ps[1];
                if (i % 2 == 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                else if (i % 2 != 0) {
                    xl.push([[p1, p2 - 20], [p1, p2], [p1, p2 - 20]]);
                }
                p1 = parseInt(p1) - 80;

                if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'})}
            }
        });

        //Draw connecting polyline
        for (i = 0; i < paternalrelatives.length; i++) {
            var value = paternalrelatives[i];
            var mid = value[1];
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
        //var temp =GENLINE(fatherarray[0][0],fatherarray[0][1]);
        //Load the polyline
        svg.polyline(xl, {id: 'Tp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }


    //Load paternal aunt / uncle
    function MATERNALS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, MID, gen, MIDGEN, PERVMID;
        var p1, p2, lx;
        var pid, mid;
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
            else {
                lx = 60
            }

            if (maternalrelatives.length > 1) {
                if (key == 0) {

                    var check = IS_IN_ARRAY(maternalcousin, MID);
                    //Get mother location
                    var PARENTID = motherarray[0][1];
                    var PARENTGEN = motherarray[0][0]
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
                    if (sistersarray.length > 0) {
                        p1 = parseInt(lx) + 20;
                    }
                    if (check != -1) {
                        p1 = parseInt(p1) + 80
                    }
                    if (MIDGEN == 'MALE') {svg.rect(p1, Level2M, rr, rr, 1, 1, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                    else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level2F, cr, {id: MID, datakey: datakey, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                }
                else if (key == (maternalrelatives.length - 1)) {
                    var PERVMID = maternalrelatives[key - 1][1];
                    var PERVGEN = maternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(maternalcousin, PERVMID);
                    var ps = RIGHT_MATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];

                    //if (check != -1) {
                    //    p1 = parseInt(p1) + 140
                    //}

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(paternalcousin, PERVMID);
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
                else if (key > 0 && (key < (maternalrelatives.length - 1))) {
                    var PERVMID = maternalrelatives[key - 1][1];
                    var PERVGEN = maternalrelatives[key - 1][0];
                    var check = IS_IN_ARRAY(maternalcousin, PERVMID);
                    var ps = RIGHT_MATERALS_GEN(PERVGEN, PERVMID, MIDGEN);
                    p1 = ps[0];
                    p2 = ps[1];
                    //if (check != -1) {
                    //    p1 = parseInt(p1) + 140
                    //}

                    if (check != -1){
                        var c = COUNT_IN_ARRAY(paternalcousin, PERVMID);
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
                var PARENTID = motherarray[0][1];
                var PARENTGEN = motherarray[0][0];
                var ps = MAT_GENLINE(PARENTGEN, PARENTID);
                var check = IS_IN_ARRAY(maternalcousin, MID);
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
        MAT_PARENT_CHILD_POLYLINES(maternalrelatives, motherarray);

    }

    function MAT_PARENT_CHILD_POLYLINES(ARRAY1, ARRAY2) {
        var PARENTGEN = ARRAY2[0][0];
        var PARENTID = ARRAY2[0][1];
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
        svg.polyline(xl, {id: 'Tm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});

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
                p1 = parseInt($('#' + PREVIOUSID).attr('x')) + 80;
                p2 = parseInt($('#' + PREVIOUSID).attr('y')) + 20;
            }
            else if (PREVIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + PREVIOUSID).attr('cx')) + 45;
                p2 = parseInt($('#' + PREVIOUSID).attr('cy'));
            }
        }
        return [p1, p2]
    }

    function RIGHT_NEPHEWS_START_GEN(PARENTGEN, PARENTID, MIDGEN) {

        var p1, p2;

        if (MIDGEN == 'MALE') {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 40;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
                //if(MIDGEN=="FEMALE"){p1 = p1 + 20}
                //else{p1 = p1 + 20}
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 25;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        else {
            if (PARENTGEN == 'MALE') {
                p1 = parseInt($('#' + PARENTID).attr('x')) + 40;
                p2 = parseInt($('#' + PARENTID).attr('y')) + 20;
            }
            else if (PARENTGEN == 'FEMALE') {
                p1 = parseInt($('#' + PARENTID).attr('cx')) + 45;
                p2 = parseInt($('#' + PARENTID).attr('cy'));
            }
        }
        return [p1, p2]
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

    function RIGHT_MATERALS_GEN(PREIOUSGEN, ID, MIDGEN) {

        var p1, p2;
        if (MIDGEN == 'MALE') {
            if (PREIOUSGEN == 'MALE') {
                p1 = parseInt($('#' + ID).attr('x')) + 60;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
            }
            else if (PREIOUSGEN == 'FEMALE') {
                p1 = parseInt($('#' + ID).attr('cx')) + 60;
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
                p1 = parseInt($('#' + ID).attr('x')) + 65;
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


    function PULLX(PIDGEN, ID) {

        var p1, p2;
        if (PIDGEN == 'MALE') {
            p1 = parseInt($('#' + ID).attr('x')) + 40;
        }
        else if (PIDGEN == 'FEMALE') {
            p1 = parseInt($('#' + ID).attr('cx')) + 40;
        }
        return p1
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

    //Load parental grand parents
    function PATERNAL_GRANS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1, p2;
        var pid = 'me';
        var xl = new Array();


        for (i = 0; i < grantparentalsarray.length; i++) {
            //Draw connecting polyline
            var ps = GENLINE(grantparentalsarray[i][0], grantparentalsarray[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {
                xl.push([[p1 - 20, p2 + 20], [p1 - 20, p2 + 20], [p1 - 20, p2 + 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1 + 20, p2 + 20], [p1 + 20, p2 + 20], [p1 + 20, p2 + 20]]);
            }
            //Load the polyline
            svg.polyline(xl, {id: 'Tpgp_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }

    //Load maternal grand parents
    function MATERNAL_GRANS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, e, gen, G;
        var p1, p2;
        var pid = 'me';
        var xl = new Array();

        for (i = 0; i < grantmaternalsarray.length; i++) {
            //Draw connecting polyline
            var ps = GENLINE(grantmaternalsarray[i][0], grantmaternalsarray[i][1]);
            p1 = ps[0];
            p2 = ps[1];
            //if(i==0)start.push([p1, p2]);
            if (i % 2 == 0) {
                xl.push([[p1 - 20, p2 + 20], [p1 - 20, p2 + 20], [p1 - 20, p2 + 20]]);
            }
            else if (i % 2 != 0) {
                xl.push([[p1 + 20, p2 + 20], [p1 + 20, p2 + 20], [p1 + 20, p2 + 20]]);
            }
            //Load the polyline
            svg.polyline(xl, {id: 'Tpgm_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
        }
    }

    //Load brothers
    function BROTHERS_LOAD() {
        var lx = 0;
        var ly = 0;
        var g, e, gen, G, MIDGEN, MID;
        var p1, p2;
        var pid = 'me';
        var xl = new Array();

        if (brotherssarray.length > 0) {
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

                if (brotherssarray.length > 1) {

                    //Parse array and build diagram
                    if (key > 0 && (key < (brotherssarray.length - 1))) {
                        var mid = brotherssarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray, mid);
                        if ($('#' + mid).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + mid).attr('x')) - 80
                        }
                        else {
                            p1 = parseInt($('#' + mid).attr('cx')) - 100
                        }

                        //p1 = parseInt($('#' + mid).attr('x')) - 80;
                        if (check != '-1') p1 = parseInt(p1) - 140;
                        svg.rect(p1, mastery, rr, rr, 1, 1, {
                            id: MID,
                            datakey: datakey,
                            fill: gencolor,
                            stroke: 'red',
                            strokeWidth: 2,
                            class: 'male',
                            cursor: 'pointer'
                        });
                    }
                    else if (key == (brotherssarray.length - 1)) {
                        var mid = brotherssarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray, mid);
                        if ($('#' + mid).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + mid).attr('x')) - 80
                        }
                        else {
                            p1 = parseInt($('#' + mid).attr('cx')) - 100
                        }

                        //p1 = parseInt($('#' + mid).attr('x')) - 80;
                        if (check != -1) p1 = parseInt(p1) - 140;
                        svg.rect(p1, mastery, rr, rr, 1, 1, {
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
                        if ($('#' + pid).attr("class").toUpperCase() == "MALE") {
                            p1 = parseInt($('#' + pid).attr('x')) - 80
                        }
                        else {
                            p1 = parseInt($('#' + pid).attr('cx')) - 100
                        }
                        svg.rect(p1, mastery, rr, rr, 1, 1, {
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
                    if ($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) - 80;
                    else p1 = parseInt($('#' + pid).attr('cx')) - 100;
                    svg.rect(p1, mastery, rr, rr, 1, 1, {
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
        for (i = 0; i < brotherssarray.length; i++) {
            var value = brotherssarray[i];
            mid = value[1];

            //Confirm my gender
            p1 = parseInt($('#' + mid).attr('x')) + 20;
            p2 = parseInt($('#' + mid).attr('y'));

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

        svg.polyline(xl, {id: 'Tb_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
    }

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

    //Load sisters
    function SISTERS_LOAD() {
        var lx = 0;
        var ly = 0;
        var MIDGEN, MID, SPID;
        var p1, p2, lx;
        var pid = 'me';
        var xl = new Array();

        if (sistersarray.length > 0) {
            p2 = mastery;
            $.each(sistersarray, function (key, value) {
                MIDGEN = value[0];
                MID = value[1];
                var mid = value[1];
                var datakey = value[2];

                if ((childrenarray.length == 1)) {
                    var d = childrenarray[childrenarray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x')) + 150;
                    else lx = parseInt($('#' + d[1]).attr('cx')) + 150;
                }
                else if (childrenarray.length > 0) {
                    var d = childrenarray[childrenarray.length - 1];
                    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                    else lx = parseInt($('#' + d[1]).attr('cx'));
                }


                if (sistersarray.length > 1) {
                    //Parse array and build diagram
                    if (key > 0 && (key < (sistersarray.length - 1))) {
                        var mid = sistersarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray, mid);
                        p1 = parseInt($('#' + mid).attr('cx')) + 80;
                        if (check != -1) p1 = parseInt(p1) + 160;
                    }
                    else if (key == (sistersarray.length - 1)) {
                        var mid = sistersarray[key - 1][1];
                        var check = IS_IN_ARRAY(nephewarray, mid);
                        p1 = parseInt($('#' + mid).attr('cx')) + 80;
                        if (check != -1) p1 = parseInt(p1) + 160;

                    }
                    else {
                        //if($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) + 60;
                        //else p1 = parseInt($('#' + pid).attr('cx')) + 100;
                        p1 = lx + 80;
                        //p1 = parseInt($('#' + pid).attr('x')) + 150;
                        //p2 = parseInt($('#' + pid).attr('y')) + 25;
                    }

                }
                else {
                    p1 = parseInt($('#' + pid).attr('x')) + 150;
                    if (lx > 0) {
                        p1 = lx + 20;

                    }
                    else {
                        if ($('#' + pid).attr("class").toUpperCase() == "MALE")p1 = parseInt($('#' + pid).attr('x')) + 150;
                        else {
                            p1 = parseInt($('#' + pid).attr('cx')) + 40;
                            p2 = mastery + 20;
                        }
                    }

                    //p2 = parseInt($('#' + pid).attr('y')) + 25;
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
        for (i = 0; i < sistersarray.length; i++) {
            var value = sistersarray[i];
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
        svg.polyline(xl, {id: 'Td_' + pid, fill: 'none', stroke: 'black', strokeWidth: 2});
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
        var ptemp = new Array();
        var mtemp = new Array();

        //nephewarray.sort(SortByName);
        var pnr = 0;
        var mnr = 0;
        var ptid = "";
        var mtid = "";
        for (t = 0; t < nephewarray.length; t++) {
            //var id = $('#' + nephewarray[t][2]).attr('datakey');
            var key = $('#' + nephewarray[t][2]).attr('datakey');
            var midgen = nephewarray[t][0];
            var mid = nephewarray[t][1];
            var pid = nephewarray[t][2];
            var side = $('#' + pid).attr('datakey').substring(0, 1);

            if (side == 'P') {
                if (ptid != key)pnr = 0;
                var ptid = key;
                ptemp.push({"id": ptid, "value": [midgen, mid, pid], "nr": pnr})
                pnr = pnr + 1;
            }
            if (side == 'M') {
                if (mtid != key)mnr = 0;
                var mtid = key;
                mtemp.push({"id": mtid, "value": [midgen, mid, pid], "nr": mnr});
                mnr = mnr + 1;
            }
        }
        //ptemp.sort(SortById);
        LOAD_MATERNAL_OBJECTS(mtemp);
        LOAD_PATERNAL_OBJECTS(ptemp);
    }


    function LOAD_MATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("MATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

        for (var p in ARRAY) {
            var idarray = new Array();
            var MIDGEN = ARRAY[p].value[0];
            var PID = ARRAY[p].value[2];
            var MID = ARRAY[p].value[1];
            var PIDGEN = $('#' + PID).attr('class').toUpperCase();
            var p1temp = new Array();

            if (p == 0) {
                DATAKEY = ARRAY[p].id;
                var ps = RIGHT_NEPHEWS_START_GEN(PIDGEN, PID, MIDGEN);
                p1 = ps[0];
                //p2 = ps[1];

                //if (childrenarray.length > 0) {
                //    var d = childrenarray[childrenarray.length - 1];
                //    if (d[0] == 'MALE')lx = parseInt($('#' + d[1]).attr('x'));
                //    else lx = parseInt($('#' + d[1]).attr('cx'));
                //    p1 = lx + 60;
                //}

                //Get previous object coordninates
                p1temp.push(MIDGEN, MID, p1, PID);
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

                //Connect to parent
                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
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
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = RIGHT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
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
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);

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
        OBJECTS_CONNECT(objectsarray, 'ltest');
    }

    function LOAD_PATERNAL_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("PATERNAL ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

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

                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);
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
                }
                else {
                    var PREVIOUSGEN = P1[P1.length - 1][0];
                    var PREVIOUSID = P1[P1.length - 1][1];
                    ps = LEFT_NEPHEWS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
                    p1temp.push(MIDGEN, MID, p1, PID);
                    P1.push(p1temp);
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
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level4M);

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
        OBJECTS_CONNECT(objectsarray, 'ltest');
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
                svg.line(g, masterx, mastery + 20, p1, mastery + 20, {id: 'female_spouce', stroke: 'black'});
            }
            else {
                p1 = parseInt($('#' + ID).attr('x')) + 100;
                p2 = parseInt($('#' + ID).attr('y')) + 20;
                svg.line(g, masterx, mastery + 20, p1, mastery + 20, {id: 'male_spouce', stroke: 'black'});
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

    function LOAD_SPOUCE_PATERNAL1(ID, GEN) {
        var ID, GEN, SPOUCE;
        var objectsarray = new Array();
        var mdia, fdia;
        GEN = GEN.toUpperCase();
        SPOUCE = "SP_" + ID;
        if (ID == 'me') {
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
            svg.line(g, masterx, p2, p1, p2, {id: 'spuces', stroke: 'black'});
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
        if (GEN == 'FEMALE') {
            svg.rect(p1, p2, rr, rr, 1, 1, {
                id: SPOUCE,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'male',
                cursor: 'pointer'
            });
        }
        else if (GEN == 'MALE') {
            svg.circle(p1, p2, cr, {
                id: SPOUCE,
                fill: gencolor,
                stroke: 'red',
                strokeWidth: 2,
                class: 'female',
                cursor: 'pointer'
            });
        }
    }

    //Connect object rows
    function OBJECTS_CONNECT(ARRAY, ID) {
        var xl = new Array();
        for (i = 0; i < ARRAY.length; i++) {
            var ps = GENLINE(ARRAY[i][0], ARRAY[i][1]);
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

        if (ARRAY.length > 1) {
            svg.polyline(xl, {id: 'Tn_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});
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
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});

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
        svg.polyline(xl, {id: 'spl_' + ID, fill: 'none', stroke: 'black', strokeWidth: 2});

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
        var ptemp = new Array();
        var mtemp = new Array();

        maternalcousin = maternalcousin.sort(SortById);
        var nr = 0;
        var id = "";
        for (t = 0; t < maternalcousin.length; t++) {
            var parentid = maternalcousin[t][2];
            var ckey = maternalcousin[t][3];
            var key = $('#' + parentid).attr('datakey');
            if (id != key)nr = 0;
            var id = key;
            var midgen = maternalcousin[t][0];
            var mid = maternalcousin[t][1];
            var pid = maternalcousin[t][2];
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
                //Connect to parent
                single_right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
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
                    //ps = RIGHT_COUSINS_GEN(PIDGEN, PID, MIDGEN);
                    p1 = ps[0];
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
                else {
                    ps = RIGHT_COUSINS_GEN(PREVIOUSGEN, PREVIOUSID, MIDGEN);
                    p1 = ps[0];
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

                LOAD_SPOUCE_MATERNAL(PID, PIDGEN);
                //Connect to parent
                right_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
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
        OBJECTS_CONNECT(objectsarray, 'ltest');
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
        var ptemp = new Array();
        var mtemp = new Array();

        paternalcousin = paternalcousin.sort(SortById);

        var nr = 0;
        var id = "";
        for (t = 0; t < paternalcousin.length; t++) {
            var key = $('#' + paternalcousin[t][2]).attr('datakey');
            if (id != key)nr = 0;
            var id = key;
            var midgen = paternalcousin[t][0];
            var mid = paternalcousin[t][1];
            var pid = paternalcousin[t][2];
            var side = $('#' + pid).attr('datakey').substring(0, 1);
            if (side == 'P') {
                //ptemp.push({"id": id, "value": [midgen, mid, pid]});
                ptemp.push({"id": id, "value": [midgen, mid, pid], "nr": nr})
                nr = nr + 1;
            }
        }
        //ptemp.sort(SortById);
        LOAD_PATERNAL_COUSINS_OBJECTS(ptemp);

    }


    function LOAD_PATERNAL_COUSINS_OBJECTS(ARRAY) {
        var PID, PIDGEN, MID, MIDGEN, DATAKEY;
        var P1 = new Array();
        var idarray = new Array();
        var DATAKEY = null;
        var objectsarray = new Array();

        //alert ("ARRAY ARRAY Information:" + JSON.stringify(ARRAY, null, 2) );

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
                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
                //Connect to parent
                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
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
                }

                if (MIDGEN == 'MALE') {svg.rect(p1, mastery, rr, rr, 1, 1, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer'});}
                else if (MIDGEN == 'FEMALE') {svg.circle(p1, Level3F, cr, {id: MID, fill: gencolor, stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer'});}
                LOAD_SPOUCE_PATERNAL(PID, PIDGEN);
                //Connect to parent
                left_parent_child_connector(PID, MID, MIDGEN, PIDGEN, Level3M);
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
        OBJECTS_CONNECT(objectsarray, 'ltest');
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
        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
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
            x = parseInt($('#' + PID).attr('x')) + 65;
            y = parseInt($('#' + PID).attr('y'));
        }
        xl.push([[x, y + 20], [x, LEVEL - 0]]);

        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
        return false;
    }

    function right_parent_child_connector_org(PID, MID, MIDGEN, PIDGEN, NR) {
        var xl = new Array();
        var x, y, ex, ey;
        if (PIDGEN == "FEMALE") {
            x = parseInt($('#' + PID).attr('cx')) + 45;
            y = parseInt($('#' + PID).attr('cy')) - 20;
        }
        else if (PIDGEN == "MALE") {
            x = parseInt($('#' + PID).attr('x')) + 65;
            y = parseInt($('#' + PID).attr('y'));
        }

        if (MIDGEN == "FEMALE") {
            ex = parseInt($('#' + MID).attr('cx'));
            ey = parseInt($('#' + MID).attr('cy'));
        }
        else if (MIDGEN == "MALE") {
            ex = parseInt($('#' + MID).attr('x'));
            ey = parseInt($('#' + MID).attr('y')) + 20;
            if (PIDGEN == "FEMALE") {
                ex = ex + 20
            }
            else if (PIDGEN == "MALE") {
                ex = ex + 20
            }
        }
        var rnd = (parseInt(y) + 80) - (parseInt(NR) + 8);
        xl.push([[x, y + 20], [x, rnd], [ex, rnd], [ex, ey - 20]]);
        svg.polyline(xl, {id: 'Tcr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
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
        svg.polyline(xl, {id: 'Tlr_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
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
        svg.polyline(xl, {id: 'Tcl_' + MID, fill: 'none', stroke: 'black', strokeWidth: 2});
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


    if (nephewarray.length > 5) {
        if (paternalcousin.length > 8) {
            svgw.setAttribute('viewBox', '0 -25 2200 1800');
            svgw.setAttribute('width', 3000);
        }
        else {
            svgw.setAttribute('viewBox', '-200 0 1900 1200');
            svgw.setAttribute('align', 'left');
            svgw.setAttribute('width', 2000);
        }
    }
    else if (paternalrelatives.length > 3) {

        svgw.setAttribute('viewBox', '-200 0 2000 1300');
        svgw.setAttribute('align', 'left');
        svgw.setAttribute('width', 1800);
    }
    else{
        svgw.setAttribute('viewBox', '0 0 1800 1200');
        svgw.setAttribute('align','center');
        svgw.setAttribute('width','100%');
    }






}


//function openWin(svgw) {
//    var myWindow = window.open('', '', 'width=200,height=100');
//
//    var printSVG = function() {
//
//        var popUpAndPrint = function () {
//            var container = $('#family_pedigree');
//            var width = parseFloat(svgw.attr("width"))
//            var height = parseFloat(svgw.attr("height"))
//            var printWindow = window.open('', 'PrintMap',
//                'width=' + width + ',height=' + height);
//            printWindow.document.writeln($(container).html());
//            printWindow.document.close();
//            printWindow.print();
//            printWindow.close();
//        };
//        setTimeout(popUpAndPrint, 500);
//    };

//}



//function openWin() {
//    var myWindow = window.open('', '', 'width=200,height=100');
//
//
//
//        var popUpAndPrint = function()
//        {
//            var container = $('#family_pedigree');
//            var width = parseFloat(svg.getAttribute("width"))
//            var height = parseFloat(svg.getAttribute("height"))
//            var printWindow = window.open('', 'PrintMap',
//                'width=' + width + ',height=' + height);
//            printWindow.document.writeln($(container).html());
//            printWindow.document.close();
//            printWindow.print();
//            printWindow.close();
//        };
//        setTimeout(popUpAndPrint, 500);
//
//}
//

//Build a table of health issues
function LOAD_HEALTH_TABLE(){
    var DISEASESARRAY = new Array();
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

    //Add my self to table
    var temp = new Array();
    var diss;
    temp.push('<td>'+personal_information.name+'</td>');
    var cod = ((typeof personal_information.cause_of_death == 'undefined') ? 'Yes' : 'No / ' + personal_information.cause_of_death);
//Is in Disease array
    var myhealth = new Array();
    myhealth = personal_information['Health History'];

    var cols = new Array();
    //cols.push('<td>' + cod + '</td>');
    cols.push('<td>' + cod + '</td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>');

    if(myhealth.length>0) {
        $.each(myhealth, function (key, item) {
            var tmp = item['Disease Name'];
            if ($.inArray(tmp, diseasearray) != -1) {
                diss = "";
                $.each(diseasearray, function(key, item) {
                    if(tmp == item){
                        diss = [key,item];
                    }
                });
                cols[diss[0]+1]='<td>' + diss[1] + '</td>';
            }
        });
        temp.push(cols)
    }
    else {
        var cols = new Array();
        //cols.push('<td>' + cod + '</td>');
        cols = [cod, '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>','<td></td>'];
        temp.push(cols)
    }
    DISEASESARRAY.push(temp);

    //Load remaining family
    $.each(personal_information, function(key, item) {
        var temp = new Array();
        if(item!=null && typeof item != 'undefined') {
            if (item.name != null && typeof item.name != 'undefined') {
                var NAME = item.name;
                temp.push('<td>' +NAME + '</td>');
                var cod = ((typeof item.cause_of_death == 'undefined') ? 'Yes' :  'No / ' + item.cause_of_death);
                var cols = new Array();
                var diss;
                cols.push('<td>' + cod + '</td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>','<td></td>');

                //Is in Disease array
                if (item['Health History'].length> 0) {
                    $.each(item['Health History'], function (key, item) {
                        var tmp = item['Disease Name'];

                        if ($.inArray(tmp, diseasearray) != -1) {
                            diss = "";
                            $.each(diseasearray, function(key, item) {
                                if(tmp == item){
                                    diss = [key,item];
                                }
                            });
                            cols[diss[0]+1]='<td>' + diss[1] + '</td>';
                        }
                    });
                    temp.push(cols);
                }
                else {
                    var cols = new Array();
                    cols = [cod, '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>', '<td></td>','<td></td>'];
                    temp.push(cols)
                }

                DISEASESARRAY.push(temp);
            }
        }
    });


    //alert("IDS ARRAY Information:" + JSON.stringify(DISEASESARRAY, null, 2) );

    $.each(DISEASESARRAY, function (key, value) {
        var vals = new Array();
         vals = value;
        if (vals.length>1) {
        //if (value[3] == "NA" || value[3] == null) {
            $("#health_table").find('tbody')
                .append($('<tr>')
                    .append(vals.toString())
            );
        }
        else{
            $("#health_table").find('tbody')
                .append($('<tr>')
                    .append(vals.toString())
            );
        }

    });

}

