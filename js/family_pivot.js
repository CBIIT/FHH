/**
 * Created by hendrikssonm on 9/4/2014.
 */
var pdialog;
var familyarray = new Array();

function GET_FAMILY(){


    pdialog = $('<div id="pivottag" width="100%" class="">' +
        '<div id="pivot_info">' +
        '<table id="pivot_table">' +
        '<thead></thead>' +
        '<tfoot></tfoot>' +
        '<tbody></tbody>' +
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

    var ME = personal_information.name;

    $.each(personal_information, function (key, item) {
        if (item.name!=null) familyarray.push({"id":key, "value":[item.name], "relationship":[item.relationship], "pid":[item.pid]});
    });

    pdialog.dialog('open');

    var sel = $('<select>').appendTo('body');
    sel.append($("<option class='pivotlist' selected>").attr('value','me').text(ME));
    $(familyarray).each(function() {
        sel.append($("<option>").attr('value',this.id).text(this.value + ' - ' + this.relationship));
    });

    $("#pivot_table").find('tbody')
        .append(sel);

    //$.each(personal_information, function (key, item) {
    //    alert("PIVOT-->"+item.name);
    //})

}