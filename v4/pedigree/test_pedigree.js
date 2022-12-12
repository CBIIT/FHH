var data = {};
var config = {};

$(document).ready(function() {
//  Functions from the top NAVBAR Buttons

  $.getJSON('./pedigree/config.json', function(d) {
    config = d
    console.log(config);
    start_pedigree();
  });

  $("#log").click(function() {
    console.log(data);
  });


  $("#load").click(function() {
    data = JSON.parse(localStorage.getItem('fhh_data'));
    $(".fhh_pedigree").pedigree("display");
  });


  $("#import_from_file").click(function() {
    $("#import_file").click();
  });

  $("#import_file").change(function(e) {

    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = function(e) {
      data = JSON.parse(e.target.result);
      $("#fhh_pedigree").pedigree("data", data);
      $("#fhh_pedigree").pedigree("display");
    };
    document.getElementById('import_file').value= null; // resets the value to allow reload
  });

  $("#import_from_url").click(function() {
    var pick_url_dialog = $("<DIV id='pick_url_dialog' title='Choose URL Dialog'>")
      .append("<LABEL for='d_pick_url_input'>Choose URL</LABEL>")
      .append(": ")
      .append("<INPUT type='text' id='d_pick_url_input' size='30'></INPUT>");

    pick_url_dialog.dialog({
      modal:true,
      position: {my:"center top", at:"center top"},
      buttons: [
        {
          text: "Cancel", click: function() {
            $( this ).dialog( "close" );
          }
        }, {
          text: "Submit", click: function() {
            $( this ).dialog( "close" );
            var url = $("#d_pick_url_input").val()
            $.getJSON(url, function (json) {
              data = json;
              $(".fhh_pedigree").pedigree("display");
            });
          }
        }
      ]
   });

  });

  $("#clear").click(function() {
    data = {};
    display_fhh();
    create_add_person_to_fhh_widget();
    $("#remove_person_from_fhh").empty();
  });

  $("#details").click(function() {
    var options = $(".fhh_pedigree").pedigree("get_options");
    if (options && options["show_id"] == true) $(".fhh_pedigree").pedigree("show_id",false);
    else $(".fhh_pedigree").pedigree("show_id",true);
    $(".fhh_pedigree").pedigree("display");

  });

  $("#save_svg").click(function() {
    saveSvg($("#svg")[0], 'pedigree.svg')
  });

});

//// ************************************ ////

function start_pedigree() {
  console.log(config);
  $(".fhh_pedigree").pedigree();

  var queryString = getUrlVars();

  // Config variables will be set from the config file, but can be overridden by the querystring
  if (config && config.style) $(".fhh_pedigree").pedigree("set_style", config.style);

  var quadrant1, quadrant2, quadrant3, quadrant4;
  if (config && config.quadrant1) quadrant1 = config.quadrant1;
  if (config && config.quadrant2) quadrant2 = config.quadrant2;
  if (config && config.quadrant3) quadrant3 = config.quadrant3;
  if (config && config.quadrant4) quadrant4 = config.quadrant4;
  $(".fhh_pedigree").pedigree("set_quadrants", quadrant1, quadrant2, quadrant3, quadrant4);


  if (queryString) {
    update_config_from_querystring(queryString);
  }
}

function update_config_from_querystring (queryString) {
  var options = false;
  var quadrant1, quadrant2, quadrant3, quadrant4;
  var style;

  if (queryString["style"]) {
    style = queryString["style"];
    $(".fhh_pedigree").pedigree("set_style", style);
  }
  if (queryString["quadrant1"]) {
    quadrant1_str = queryString["quadrant1"];
    quadrant1 = quadrant1_str.split(",");
  } else {
    quadrant1 = config.quadrant1;
  }
  if (queryString["quadrant2"]) {
    quadrant2_str = queryString["quadrant2"];
    quadrant2 = quadrant2_str.split(",");
  } else {
    quadrant2 = config.quadrant2;
  }
  if (queryString["quadrant3"]) {
    quadrant3_str = queryString["quadrant3"];
    quadrant3 = quadrant3_str.split(",");
  } else {
    quadrant3 = config.quadrant3;
  }
  if (queryString["quadrant4"]) {
    quadrant4_str = queryString["quadrant4"];
    quadrant4 = quadrant4_str.split(",");
  } else {
    quadrant4 = config.quadrant4;
  }
  
  console.log(style);
  $(".fhh_pedigree").pedigree("set_quadrants", quadrant1, quadrant2, quadrant3, quadrant4);

  if (queryString["family_id"]) {
    var filename = "sampledata/families/" + queryString["family_id"] + ".json";

    $.getJSON(filename, function(data) {
      console.log(data);
      $("#fhh_pedigree").pedigree("data", data);
      $("#fhh_pedigree").pedigree("display");
      if (queryString["test"]) check_svg();
    });
  }
}
// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


//  To support automated Testing

function check_svg() {

  var test_passed = 0;
  var test_failed = 0;

  var max_x = parseInt($("svg").attr("width"));
  var max_y = parseInt($("svg").attr("height"));

  console.log ("MAX_X: " + max_x + "  MAX_Y: " + max_y);
  $("svg line").each(function() {
    var line = $(this);
    var deceased = line.attr("deceased");
    var id = line.attr("id");
    var x1 = parseInt(line.attr("x1"));
    var y1 = parseInt(line.attr("y1"));
    var x2 = parseInt(line.attr("x2"));
    var y2 = parseInt(line.attr("y2"));

//    console.log(x1 + "," + y1 + " -> " + x2 + "," + y2);
    var passed = true;
    if (!check_inRange(max_x, max_y, x1, y1)) passed = false;
    if (!check_inRange(max_x, max_y, x2, y2)) passed = false;
    if (!passed) console.log ("RANGE FAILED TEST");

    if ((deceased != "Deceased") && (check_vertical(x1,y1, x2,y2) || check_horizontal(x1,y1, x2,y2)) ) passed = passed && true;
    else {
      console.log(id + "(" + deceased + "): " + x1 + "," + y1 + " -> " + x2 + "," + y2);
      passed = false;
    }
    if (!passed) console.log ("FAILED TEST");
    if (passed) test_passed++;
    else test_failed++;
  });

  console.log("Test Passed:" + test_passed);
  console.log("Test Failed:" + test_failed);
}

function check_inRange (max_x, max_y, x1, y1) {
  if (x1 <=0 ) return false;
  if (y1 <= 0) return false;
  if (x1 >= max_x) return false;
  if (y1 >= max_y) return false;
  return true;
}

function check_vertical(x1,y1, x2,y2) {
  if (y1 == y2) return true;
  return false;
}

function check_horizontal(x1,y1, x2,y2) {
  if (x1 == x2) return true;
  return false;
}
