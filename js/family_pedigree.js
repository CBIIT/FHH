


function xmlload() {

    $("#family_pedigree").dialog({
        title:"Family Pedigree",
        position:['middle',0],
        autoOpen: false,
        height:1000,
        width:['95%'],
        backgroundColor: 'white'

    });

    var masterleft=600;
    var merr = 50;
    var cr = 21;
    var rr = 40;

    var l = 355;
    var r = 350;
    var ml = 350;
    var pl = 350;
    var dl = 350;
    var sl = 350;

    var top=300

    var array = new Array();

    //Open the template
    $("#family_pedigree").dialog("open");

    //Start SVG
    $('#family_pedigree').svg();
    var svg = $('#family_pedigree').svg('get');
    var g = svg.group({stroke: 'black', strokeWidth: 2});

    //Outer Frame
    svg.rect(25, 5, ['80%'], 700, 10, 10, {fill: 'none', stroke: 'slateblue', strokeWidth: 1});
    svg.text(masterleft-120, 30, "Paternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});
    svg.text(masterleft+120, 30, "Maternal", {fontWeight: 'bold', fontSize: '14.5', fill: 'gray'});

    //Check the Twin/adoption Status
//    if (personal_information.twin_status == 'IDENTICAL') {
//        svg.text( masterleft+55, top + 50, "tt", {fontWeight: 'bold', fontSize: '18.5', fill: 'black'});
//        svg.line(g, masterleft-100, 220, masterleft + 120, 220,{stroke: 'black'});
//        svg.line(g,  masterleft+25, 220,  masterleft+25, top,{stroke: 'black'});
//
//    }
//    else if (personal_information.twin_status == 'NO') {
//        svg.text( masterleft+55, top + 50, "k", {fontWeight: 'bold', fontSize: '18.5', fill: 'black'});
//        svg.line(g, masterleft-100, 220, masterleft + 120, 220,{stroke: 'black'});
//        svg.line(g,  masterleft+25, 220,  masterleft+25, top,{stroke: 'black'});
//    }
//    else if (personal_information.twin_status == 'FRATERNAL') {
//        svg.text( masterleft+55, top + 50, "b", {fontWeight: 'bold', fontSize: '18.5', fill: 'black'});
//        svg.line(g, masterleft-100, 220, masterleft + 120, 220,{stroke: 'black'});
//        svg.line(g,  masterleft+25, 220,  masterleft+25, top,{stroke: 'black'});
//    }
//    else{
//        svg.text( masterleft+55, top + 50, "k", {fontWeight: 'bold', fontSize: '18.5', fill: 'black'});
//        svg.line(g, masterleft-100, 220, masterleft + 120, 220,{stroke: 'black'});
//        svg.line(g,  masterleft+25, 220,  masterleft+25, top,{stroke: 'black'});
//
//    }

    //Gender
    if (personal_information.gender == 'MALE') {
        //Center Me
        svg.rect( masterleft, top, merr, merr, 10, 10, {
            id: 'me',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
    }
    else if (personal_information.gender == 'FEMALE') {

        svg.circle(masterleft+25, top, 30, {
            id: 'me',
            fill: 'slateblue',
            stroke: 'red',
            strokeWidth: 2,
            cursor: 'pointer'
        });
    }

    $.each(personal_information, function (key, item) {

        if(key.substring(0,13) == "paternal_aunt" || key.substring(0,14) == "paternal_uncle"){
            array.push('PARENTALS');
        }
        else if(key.substring(0,13) == "maternal_aunt" || key.substring(0,14) == "maternal_uncle"){

            array.push('MATERNALS');
        }
    });


    //Begin process
    $.each(personal_information, function (key, item) {

        if (key=='paternal_grandmother' ){
            var mleft = masterleft-30;
            //Prepare line shift in case of aunts/uncles
            if ( ($.inArray('PARENTALS', array) > -1) == true){
                svg.circle(mleft-45, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-100, 120, "Grand Mother", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }
            else{
                svg.circle(mleft, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-60, 120, "Grand Mother", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
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
                svg.rect(mleft-35, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-70, 120, "Grand Father", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft-35, 70, mleft+110, 70,{id: 'pgl',stroke: 'black'});
                svg.line(g, mleft+50, 70, mleft+50, 170,{id: 'fline', stroke: 'black'});
            }
            else {
                svg.rect(mleft, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-30, 120, "Grand Father", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft, 70, mleft + 130, 70, {id: 'pgl', stroke: 'black'});
                svg.line(g, mleft+85, 70, mleft+85, 170,{id: 'fline', stroke: 'black'});
//                svg.line(g, mleft+20, 70, mleft+20, 170,{id: 'fline', stroke: 'blue'});
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
                svg.text(mleft, 120, "Grand Mother", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, mleft-80, 70, mleft+50, 70,{id: 'mgl', stroke: 'black'});
                svg.line(g, mleft-20, 70,  mleft-20, 170,{id: 'mline', stroke: 'black'});
            }
            else{
                svg.circle(mleft, 70, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-50, 120, "Grand Mother", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
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
                svg.rect(mleft+40, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft+10, 120, "Grand Father", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }
            else{
                svg.rect(mleft, 47, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
                svg.text(mleft-30, 120, "Grand Father", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            }

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus(item['id']);
            }
        }

        //Mother
        if (key=='father' ){
            var mleft = masterleft-120;
            svg.rect(mleft, 200, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
            svg.text(mleft+40, 180, "Father", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            svg.line(g, mleft+20, 170, mleft+20, 200,{id: 'fst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                rectstatus('f');
            }
        }

        //Father
        if (key=='mother'){
            var mleft = masterleft+140;
            svg.circle(mleft, 220, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, cursor: 'pointer' });
            svg.text(mleft-60, 180, "Mother", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
            svg.line(g, mleft, 170, mleft, 200,{id: 'mst', stroke: 'black'});

            //Check the live status
            if (typeof item.estimated_death_age != 'undefined') {
                circlestatus('m');
            }
        }

        if (typeof item == 'object') {
            var otop=280;
            var mtop=otop+20;
            var ftop=otop+40;
            var mats = 0;
            var pats = 0;

//                alert(key)

            if (key.substring(0, 7) == "brother") {
                var mleft = masterleft-20;
                var no = key.substring(8, 9);
                if (no == "0") {
                    l = mleft - 55;
                }
                else {
                    l = l - 75;
                }
                svg.rect(l, mtop, rr, rr, 10, 10, {
//                    id: 'bro'+no,
                    id: item['id'],
                    fill: 'white',
                    stroke: 'red',
                    strokeWidth: 2,
                    class: 'male',
                    cursor: 'pointer'
                });

                svg.text(565, otop-10, "Brothers", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, l + 20, otop, 625, otop,{stroke: 'black'});
                svg.line(g, l + 20, otop, l + 20, 340,{stroke: 'black'});

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus('bro'+no);
                }
            }

            else if(key.substring(0,6) == "sister"){
                var mleft = masterleft-10;
                var no = key.substring(7,8);
                if(no == "0"){r = mleft + 110; }
                else {r = r + 60; }

                svg.circle(r, ftop, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female' ,cursor: 'pointer' });
                svg.text(655, otop-10, "Sisters", {fontWeight: 'bold', fontSize: '12.5', fill: 'gray'});
                svg.line(g, r, otop, 625, otop,{stroke: 'black'});
                svg.line(g, r, otop, r, 340,{stroke: 'black'});

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus('sis-'+no);
                }
            }

            else if(key.substring(0,13) == "paternal_aunt"){
                var mleft = masterleft-50;
                var no = key.substring(14, 15);
                if(no == "0" && ml==350){
                    ml = mleft - 135;
                }
                else {ml = ml - 65; }
                svg.circle(ml+15, 220, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer' });
                svg.line(g,ml+85, 170,ml+20, 170,{stroke: 'black'});
                svg.line(g, ml+20, 170, ml+20, 220,{stroke: 'black'});
                mats = ml;

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus('pat-'+no);
                }
            }

            else if(key.substring(0,14) == "paternal_uncle"){

                var mleft = masterleft-25;

                var no = key.substring(15,16);
                if(no == "0" && ml==350){
                    ml = mleft - 285;
                }
                else {ml = ml - 65; }
                svg.rect(ml, 200,  rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer' });
                svg.line(g, ml+90, 170,ml+20, 170,{stroke: 'black'});
                svg.line(g, ml+20, 170, ml+20, 220,{stroke: 'black'});
                mats = ml;

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus('pun'+no);
                }
            }

            else if(key.substring(0,13) == "maternal_aunt"){
                var mleft = masterleft-50;
                var no = key.substring(14,15);
                if(no == "0" && pl==350){
                    pl = mleft + 260;
                }
                else if(no!="0"){pl = pl + 65; }
                else {pl = pl + 85; }

                svg.circle(pl, 220, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer' });
                svg.line(g, pl-70, 170, pl, 170,{stroke: 'black'});
                svg.line(g, pl, 170, pl, 220,{stroke: 'black'});

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus('mat-'+no);
                }
            }

            else if(key.substring(0,14) == "maternal_uncle"){
                var mleft = masterleft-25;
                var no = key.substring(15,16);
                if(no == "0" && pl==350){
                    pl = mleft + 220;
                }
                else {pl = pl + 60; }
                svg.rect(pl-10, 200,  rr, rr, 10, 10, {id: 'mun-'+no, fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer' });
                svg.line(g, pl-60, 170, pl+15, 170,{stroke: 'black'});
                svg.line(g, pl+15, 170, pl+15, 220,{stroke: 'black'});

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus('mun'+no);
                }
            }

            else if(key.substring(0,15) == "maternal_cousin"){
                var no = key.substring(16, 17);
                var gen = item['gender'];
                var pid = item['parent_id'];

                if ($('#' + pid).attr('class') == 'male') {
                    var p1 = parseInt($('#' + pid).attr('x'));
                    var p2 = parseInt($('#' + pid).attr('y')) + 45;
                }
                if ($('#' + pid).attr('class') == 'female') {
                    var p1 = parseInt($('#' + pid).attr('cx'));
                    var p2 = parseInt($('#' + pid).attr('cy')) + 45;
                }


                if(gen=="MALE"){
                    if (no == "0") {sl = p1 - 20;}
                    else {sl = sl + 60;}
                    svg.rect(sl, p2, rr, rr, 10, 10, {
                        id: item['id'],
                        fill: 'white',
                        stroke: 'red',
                        strokeWidth: 2,
                        class: gen,
                        cursor: 'pointer'
                    });
                    svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
                    svg.line(g, sl + 20, p2 - 20, sl + 20, p2 + 25, {stroke: 'black'});
                }
                else{
                    if (no == "0") {sl = p1;}
                    else {sl = sl + 60;}
                    svg.circle(sl, p2 + 25  , cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer' });
//                    svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
                    svg.line(g, sl, p2 - 25, sl, p2 + 25, {stroke: 'black'});
                }

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,15) == "paternal_cousin"){
                var no = key.substring(16, 17);
                var gen = item['gender'];
                var pid = item['parent_id'];
                if ($('#' + pid).attr('class') == 'male') {
                    var p1 = parseInt($('#' + pid).attr('x'));
                    var p2 = parseInt($('#' + pid).attr('y')) + 45;
                }
                if ($('#' + pid).attr('class') == 'female') {
                    var p1 = parseInt($('#' + pid).attr('cx'));
                    var p2 = parseInt($('#' + pid).attr('cy')) + 45;
                }


                if(gen=="MALE"){
                    if (no == "0") {sl = p1 - 20;}
                    else {sl = sl + 60;}
                    svg.rect(sl, p2, rr, rr, 10, 10, {
                        id: item['id'],
                        fill: 'white',
                        stroke: 'red',
                        strokeWidth: 2,
                        class: gen,
                        cursor: 'pointer'
                    });
                    svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
                    svg.line(g, sl + 20, p2 - 30, sl + 20, p2 + 25, {stroke: 'black'});
                }
                else{
                    if (no == "0") {sl = p1 - 20;}
                    else {sl = sl + 60;}
                    svg.circle(sl, p2, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer' });
                    svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
                    svg.line(g, sl + 20, p2 - 20, sl + 20, p2 + 25, {stroke: 'black'});
                }
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }

            else if(key.substring(0,8) == "daughter"){
                var mleft = masterleft-25;
                var no = key.substring(9,10);
                if(no == "0"){dl = mleft + 100; }
                else {dl = dl + 70; }
                svg.circle(dl, 450, cr, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'female', cursor: 'pointer' });
                svg.line(g, 625, 410, dl, 410,{stroke: 'black'});

                svg.line(g, dl,410, dl, 440,{stroke: 'black'});
                //Connect to me
                svg.line(g, masterleft+25,330, masterleft+25, 410,{stroke: 'black'});
                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    circlestatus(item['id']);
                }
            }

            else if(key.substring(0,3) == "son"){
                var mleft = masterleft-25;
                var no = key.substring(4,5);
                if(no == "0"){sl = mleft - 30; }
                else {sl = sl - 55; }
                svg.rect(sl, 450, rr, rr, 10, 10, {id: item['id'], fill: 'white', stroke: 'red', strokeWidth: 2, class: 'male', cursor: 'pointer' });
                svg.line(g, sl+25, 410, sl+80, 410,{stroke: 'black'});

                svg.line(g, sl+25, 410, sl+25, 440  ,{stroke: 'black'});
                //Connect to me
                svg.line(g, masterleft+25,330, masterleft+25, 410,{stroke: 'black'});

                //Check the live status
                if (typeof item.estimated_death_age != 'undefined') {
                    rectstatus(item['id']);
                }
            }
            else if(key.substring(0,6) == "nephew") {
                var no = key.substring(7, 8);
                var gen = item['gender'];
                var pid = item['parent_id'];
                    if ($('#' + pid).attr('class') == 'female') {
                        var p1 = parseInt($('#' + pid).attr('cx'));
                        var p2 = parseInt($('#' + pid).attr('cy'));
                        if (no == "0") {
                            sl = parseInt(p1)+85;
                        }
                        else {
                            sl = sl + 65;
                        }
//                        circlelink(pid);
                        svg.rect(sl, parseInt(p2)+110, rr, rr, 10, 10, {
                            id: item['id'],
                            fill: 'white',
                            stroke: 'red',
                            strokeWidth: 2,
                            class: gen,
                            cursor: 'pointer'
                        });


                        svg.polyline(
                            [
                                [parseInt(p1),parseInt(p2+20)],
                                [parseInt(p1), parseInt(p2)+45],
                                [parseInt(p1)+130, parseInt(p2)+45],
                                [parseInt(p1)+130,parseInt(p2)+90]
                            ],
                            {fill: 'none', stroke: 'black', strokeWidth: 2});

                        svg.polyline(
                            [
                                [parseInt(p1)+105,parseInt(p2)+110],
                                [parseInt(p1)+105,parseInt(p2)+90],
                                [parseInt(p1)+170,parseInt(p2)+90],
                                [parseInt(p1)+170,parseInt(p2)+110]
                            ],
                            {fill: 'none', stroke: 'black', strokeWidth: 2});

//                        svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
//                        svg.line(g, sl + 20, p2 - 20, sl + 20, p2 + 25, {stroke: 'red'});
                    }
//                }
            }
            else if(key.substring(0,5) == "niece") {
                var no = key.substring(6, 7);
                var gen = item['gender'];
                var pid = item['parent_id'];
//                alert("id--> " +item['id'])
//                alert("pid-->"+item['parent_id'])
//                if (gen == "MALE") {
                if ($('#' + pid).attr('class') == 'female') {
                    var p1 = parseInt($('#' + pid).attr('cx'));
                    var p2 = parseInt($('#' + pid).attr('cy')) + 45;
                    if (no == "0") {
                        sl = p1 - 20;
                    }
                    else {
                        sl = sl + 60;
                    }
//                        circlelink(pid);
                    svg.rect(sl, p2, rr, rr, 10, 10, {
                        id: item['id'],
                        fill: 'white',
                        stroke: 'red',
                        strokeWidth: 2,
                        class: gen,
                        cursor: 'pointer'
                    });
                    svg.line(g, p1 + 10, p2 - 20, sl + 20, p2 - 20, {stroke: 'black'});
                    svg.line(g, sl + 20, p2 - 20, sl + 20, p2 + 25, {stroke: 'black'});

//                    svg.polyline([[parseInt(p1)-35, parseInt(p2)+30],[parseInt(p1)+35,parseInt(p2)-30]],
//                        {fill: 'none', stroke: 'red', strokeWidth: 5});
                }
//                }
            }
            else{
            }
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

        //Qtip loader
        $("#family_pedigree").find("circle").each(function() {

            var e = this.id;
            var content1 = "<a href='#' onclick=readjson('" + e + "')>Edit</a>";
            var content2 = "<a href='#' onclick=readjson('" + e + "')>Add Daughter</a>";
            var content3 = "<a href='#' onclick=readjson('" + e + "')>Add Son</a>";

            $('#'+e).qtip({
                content: {
                    text: function() {
                        return $(this).attr("data-info");
                    },
                    title: {
                        text: '<div align="left" width="300px" class="pop">' +
                        '<ul id="navlist" width="300px" style="font-size: 10px">' +
                        '<li>'+content1+'</li>' +
                        '<li>'+content2+'</li>' +
                        '<li>'+content3+'</li>' +
                        '</ul>' +
                        '</div>',
                        button: true
                    }
                },
                show: {
                    event: 'click',
                    solo: false,
                    modal: true
                },
                position: {
                    my: 'top right', // ...at the center of the viewport
                    at: 'center',
                    target: $('#'+e)
                },
                hide: false,
                events: {
                    show: function(api, event) {
                        $('#'+e).attr('stroke', 'blue');

                    },
                    hide: function(api, event) {
                        $('#'+e).attr('stroke', 'red');
                        return $('.qtip').qtip('destroy');
                    },
                    hide: function(event, api) {
                        api.destroy(true); // Destroy it immediately
                    }
                },
                style: {
                    classes: 'qtip-bootstrap'
                }
            });
        });



    });

//    function circlelink(id){
//        var p1 = $('#'+id).attr('cx');
//        var p2 = $('#'+id).attr('cy');
//        alert("cxcy-->" + p1 + " -- " + p2)
//
////        svg.polyline([[parseInt(p1)-35, parseInt(p2)+30],[parseInt(p1)+35,parseInt(p2)-30]],
////            {fill: 'none', stroke: 'red', strokeWidth: 5});
//        return false;
//    }
//
//    function buildrect(){
//        svg.rect(sl, parseInt(p2)+95+25, 40, 40, 10, 10, {
//            id: item['id'],
//            fill: 'white',
//            stroke: 'red',
//            strokeWidth: 2,
//            class: gen,
//            cursor: 'pointer'
//        });
//    }

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


//    var found = $.inArray('PARENTALS', array) > -1;
//    alert(found)

//    if ( ($.inArray('PARENTALS', array) > -1) == true){
//            $('#pgm').attr("cx", parseInt($('#pgm').attr("cx")) - 35);
//            $('#pgf').attr("x", parseInt($('#pgf').attr("x")) - 35);
//            $('#fline').attr("x1", parseInt($('#fline').attr("x1")) - 34);
//            $('#fline').attr("x2", parseInt($('#fline').attr("x2")) - 34);
//    }
//    if ( ($.inArray('MATERNALS', array) > -1) == true){
//            $('#mgm').attr("cx",  parseInt($('#mgm').attr("cx"))+35);
//            $('#mgf').attr("x", parseInt($('#mgf').attr("x")) + 35);
//            $('#mline').attr("x1", parseInt($('#mline').attr("x1")) + 34);
//            $('#mline').attr("x2",parseInt( $('#mline').attr("x2")) + 34);
//    }



}