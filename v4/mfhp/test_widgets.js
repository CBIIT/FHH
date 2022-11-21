
var data = {};

$(document).ready(function() {

//  Functions from the top NAVBAR Buttons
  $("#log").click(function() {
    console.log(data);
  });

  $("#save").click(function() {
    localStorage.setItem("fhh_data", JSON.stringify(data));
    alert ("Data Saved");
  });

  $("#load").click(function() {
    data = JSON.parse(localStorage.getItem('fhh_data'));
    display_fhh();
    create_add_person_to_fhh_widget();
    create_remove_person_from_fhh_widget();
  });


  $("#export").click(function() {
    exportJson(data, "fhh_export");
  });

  $("#import_from_file").click(function() {
    $("#import_file").click();
  });

  $("#import_file").change(function(e) {

    var reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = function(e) {
      data = JSON.parse(e.target.result);
      display_fhh();
      create_add_person_to_fhh_widget();
      create_remove_person_from_fhh_widget();
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
              display_fhh();
            });
          }
        }
      ]
   });

  });

  $("#clear").click(function() {
    if (data && data != {} && data['proband']) {
      var proband = data['proband'];
      if (data['people'][proband] && data['people'][proband]['name'] && data['people'][proband]['name'] != 'Proband') {
        console.log(data['people'][proband]['name']);
        var confirmed = confirm("This will delete all data.  Is this okay?");
        if (!confirmed) return;
      }
    }

    data = {};
    create_add_person_to_fhh_widget();
    add_proband();
    display_fhh();
    $("#remove_person_from_fhh").empty();
  });

  // Expand and collapse_all
  $("#expand_all").click(function () {
    $(".fhh_card .fhh_picture_stats_box").show();
    $(".fhh_card .fhh_race_ethnicity_box").show();
    $(".fhh_card .fhh_disease_box").show();

  });

  $("#collapse_all").click(function () {
    $(".fhh_card .fhh_picture_stats_box").hide();
    $(".fhh_card .fhh_race_ethnicity_box").hide();
    $(".fhh_card .fhh_disease_box").hide();
  });

  $("#add_relative").click(add_relative_dialog);
  $("#remove_relative").click(remove_person_dialog);

  add_proband();
  create_add_person_to_fhh_widget();
});

//  These functions are used for the Add Proband and Add Relative Button

function create_add_person_to_fhh_widget() {
  if (data && data["proband"] && data["people"][data["proband"]]) {
    var add_relative_button = $("<BUTTON>Add Relative</BUTTON>");
    add_relative_button.click(add_relative_dialog);
    $("#add_person_to_fhh").empty().append(add_relative_button);

  } else {
    var add_proband_button = $("<BUTTON>Add Proband</BUTTON>");
    add_proband_button.click(add_proband);
    $("#add_person_to_fhh").empty().append(add_proband_button);
  }
}

function add_proband (event) {
  // Completely clear the data;
  data = {};
  // Add Proband
  var id = crypto.randomUUID();
  data["proband"] = id;
  data["people"] = {}
  data["people"][id] = {};
  data["people"][id]["name"] = "Proband";

  // Add Parents
  var father_id = crypto.randomUUID();
  data["people"][id]["father"] = father_id;
  data["people"][father_id]= {};
  data["people"][father_id]["name"] = "Father";
  data["people"][father_id]["demographics"] = {};
  data["people"][father_id]["demographics"]["gender"] = "Male";
  data["people"][father_id]["children"] = [];
  data["people"][father_id]["children"][0] = id;

  var mother_id = crypto.randomUUID();
  data["people"][id]["mother"] = mother_id;
  data["people"][mother_id] = {}
  data["people"][mother_id]["name"] = "Mother";
  data["people"][mother_id]["demographics"] = {};
  data["people"][mother_id]["demographics"]["gender"] = "Female";
  data["people"][mother_id]["children"] = [];
  data["people"][mother_id]["children"][0] = id;

  // Add Paternal Grandparents
  var paternal_grandfather_id = crypto.randomUUID();
  data["people"][father_id]["father"] = paternal_grandfather_id;
  data["people"][paternal_grandfather_id] = {}
  data["people"][paternal_grandfather_id]["name"] = "Paternal Grandfather";
  data["people"][paternal_grandfather_id]["demographics"] = {};
  data["people"][paternal_grandfather_id]["demographics"]["gender"] = "Male";
  data["people"][paternal_grandfather_id]["children"] = [];
  data["people"][paternal_grandfather_id]["children"][0] = father_id;

  var paternal_grandmother_id = crypto.randomUUID();
  data["people"][father_id]["mother"] = paternal_grandmother_id;
  data["people"][paternal_grandmother_id] = {}
  data["people"][paternal_grandmother_id]["name"] = "Paternal Grandmother";
  data["people"][paternal_grandmother_id]["demographics"] = {};
  data["people"][paternal_grandmother_id]["demographics"]["gender"] = "Female";
  data["people"][paternal_grandmother_id]["children"] = [];
  data["people"][paternal_grandmother_id]["children"][0] = father_id;

  // Add Maternal Grandparents
  var maternal_grandfather_id = crypto.randomUUID();
  data["people"][mother_id]["father"] = maternal_grandfather_id;
  data["people"][maternal_grandfather_id] = {}
  data["people"][maternal_grandfather_id]["name"] = "Maternal Grandfather";
  data["people"][maternal_grandfather_id]["demographics"] = {};
  data["people"][maternal_grandfather_id]["demographics"]["gender"] = "Male";
  data["people"][maternal_grandfather_id]["children"] = [];
  data["people"][maternal_grandfather_id]["children"][0] = mother_id;

  var maternal_grandmother_id = crypto.randomUUID();
  data["people"][maternal_grandmother_id] = {}
  data["people"][mother_id]["mother"] = maternal_grandmother_id;
  data["people"][maternal_grandmother_id]["name"] = "Maternal Grandmother";
  data["people"][maternal_grandmother_id]["demographics"] = {};
  data["people"][maternal_grandmother_id]["demographics"]["gender"] = "Female";
  data["people"][maternal_grandmother_id]["children"] = [];
  data["people"][maternal_grandmother_id]["children"][0] = mother_id;

  display_fhh();
  create_add_person_to_fhh_widget();
}

function add_relative_dialog (event) {
  console.log("Adding Relative");
  var add_relative_dialog = $("<DIV id='ar_add_relative_dialog'>");
  var name_label = $("<LABEL>Name: </LABEL>");
  name_label.attr("for", "ar_name");
  var name_text = $("<INPUT type='text' id='ar_name'>");
  add_relative_dialog.append(name_label).append(name_text).append("<br><br>");

  var relationship_label = $("<LABEL>Relationship: </LABEL>");
  relationship_label.attr("for", "ar_relative_select");
  var relationship_select = $("<SELECT id='ar_relative_select'>");
  relationship_select.append("<OPTION></OPTION>");
  relationship_select.append("<OPTION>Brother</OPTION>");
  relationship_select.append("<OPTION>Sister</OPTION>");
  relationship_select.append("<OPTION>Son</OPTION>");
  relationship_select.append("<OPTION>Daughter</OPTION>");
  relationship_select.append("<OPTION>Uncle</OPTION>");
  relationship_select.append("<OPTION>Aunt</OPTION>");
  relationship_select.append("<OPTION>Grandson</OPTION>");
  relationship_select.append("<OPTION>Granddaughter</OPTION>");
  relationship_select.append("<OPTION>Cousin</OPTION>");
  relationship_select.append("<OPTION>Nephew</OPTION>");
  relationship_select.append("<OPTION>Niece</OPTION>");
  relationship_select.append("<OPTION>Half Brother</OPTION>");
  relationship_select.append("<OPTION>Half Sister</OPTION>");


  relationship_select.on("change", add_parent_of_relative_select);

  add_relative_dialog.append(relationship_label).append(relationship_select).append("<br><br>");
  add_relative_dialog.append($("<DIV id='ar_choose_parent'>"));

  add_relative_dialog.dialog({
    autoOpen: true,
    position: {my:"center top", at:"center top"},
    modal:true,
    title: "Add Relative",
    buttons: {
        "Add New Relative": action_add_relative,
        Cancel: function() {
           add_relative_dialog.dialog( "close" );
           $("#ar_add_relative_dialog").remove();
        }
      }
  });

}

function add_parent_of_relative_select() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var new_relative_relationship = $("#ar_relative_select").val();

  // if Son, Daughter, Brother or Sister, then No need to know related Parent
  if (new_relative_relationship == "Son" || new_relative_relationship == "Daughter"
    || new_relative_relationship == "Brother" || new_relative_relationship == "Sister") { return; }

  var select_common_relative = $("<SELECT id='ar_select_common_relative'>");
  $("#ar_choose_parent").append(select_common_relative);

  if (new_relative_relationship == "Grandson" || new_relative_relationship == "Granddaughter") {
//    var children = data["people"][proband_id]["children"];
    var children = find_children(proband_id);
    $.each(children, function(index, person_id) {
      var name = data["people"][person_id]["name"];
      var option = $("<OPTION>" + name + "</OPTION>").val(person_id);
      select_common_relative.append(option);
    });
    $("#ar_choose_parent").prepend("Who is the parent: ");
  }
  if (new_relative_relationship == "Uncle" || new_relative_relationship == "Aunt") {
    var paternal_option = $("<OPTION>Paternal</OPTION>").val("Paternal");
    var maternal_option = $("<OPTION>Maternal</OPTION>").val("Maternal");
    select_common_relative.append(paternal_option).append(maternal_option);
    $("#ar_choose_parent").prepend("Which Side: ");

  }
  if (new_relative_relationship == "Cousin") {
    $("#ar_choose_parent").prepend("Who is the Parent: ");
    var full_uncles_aunts = get_uncles_aunts();
    full_uncles_aunts.forEach(function(person_id) {
      var name = data["people"][person_id]["name"];
      var option = $("<OPTION>" + name + "</OPTION>").val(person_id);
      select_common_relative.append(option);
    });
  }
  if (new_relative_relationship == "Nephew" || new_relative_relationship == "Niece") {
    $("#ar_choose_parent").prepend("Who is the parent: ");
    var full_siblings = get_full_siblings();
    full_siblings.forEach(function(person_id) {
      var sibling_name = data["people"][person_id]["name"];
      var option = $("<OPTION>" + sibling_name + "</OPTION>").val(person_id);
      select_common_relative.append(option);
    });

  }
  if (new_relative_relationship == "Half Brother" || new_relative_relationship == "Half Sister") {
    var paternal_option = $("<OPTION>Paternal</OPTION>").val("Paternal");
    var maternal_option = $("<OPTION>Maternal</OPTION>").val("Maternal");
    select_common_relative.append(paternal_option).append(maternal_option);
    $("#ar_choose_parent").prepend("Which Side: ");
  }

}

function action_add_relative(event) {
  var new_relative_parent_id = $("#ar_common_relative").val();
  var new_relative_relationship = $("#ar_relative_select").val();
  console.log ("Adding a new [" + new_relative_relationship + "] the child of: " + new_relative_parent_id);

  if (new_relative_relationship == "Son" || new_relative_relationship == "Daughter") {
    action_add_child();
  } else if (new_relative_relationship == "Brother" || new_relative_relationship == "Sister") {
    action_add_sibling();
  } else if (new_relative_relationship == "Nephew" || new_relative_relationship == "Niece") {
    action_add_nephew_niece();
  } else if (new_relative_relationship == "Grandson" || new_relative_relationship == "Granddaughter") {
    action_add_grandchild();
  } else if (new_relative_relationship == "Uncle" || new_relative_relationship == "Aunt") {
    action_add_uncle_aunt();
  } else if (new_relative_relationship == "Cousin") {
    action_add_cousin();
  } else if (new_relative_relationship == "Half Brother" || new_relative_relationship == "Half Sister")  {
    action_add_half_sibling();
  }

  $("#ar_add_relative_dialog").remove();
  display_fhh();

}

function action_add_child() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  console.log(name);

  var id = crypto.randomUUID();
  // Add the ID to the proband's Children
  if (!data["people"][proband]["children"]) data["people"][proband]["children"] = [id];
  else data["people"][proband]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If proband is Male, then set the Father, else if Female set the mother
  console.log(data["people"][proband]["demographics"]["gender"]);
  if (data["people"][proband]["demographics"]["gender"] == "Male") data["people"][id]["father"] = proband;
  else if (data["people"][proband]["demographics"]["gender"] == "Female") data["people"][id]["mother"] = proband;

  if ($("#ar_relative_select").val() == "Son") {
    data["people"][id]["relationship"] = "Son";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Daughter") {
    data["people"][id]["relationship"] = "Daughter";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
  console.log(data["people"][id]);

}

function action_add_sibling() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  console.log(name);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  var father_id = data["people"][proband]["father"];
  var mother_id = data["people"][proband]["mother"];


  if (!data["people"][father_id]["children"]) data["people"][father_id]["children"] = [id];
  else data["people"][father_id]["children"].push(id);
  if (!data["people"][mother_id]["children"]) data["people"][mother_id]["children"] = [id];
  else data["people"][mother_id]["children"].push(id);

  // Now create a new person_name, also add same father and mother
  data["people"][id] = {"name":name, "father": father_id, "mother":mother_id};
  data["people"][id]["demographics"] = {};

  if ($("#ar_relative_select").val() == "Brother") {
    data["people"][id]["relationship"] = "Brother";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Sister") {
    data["people"][id]["relationship"] = "Sister";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
}

function action_add_nephew_niece() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  var new_relative_parent = $("#ar_select_common_relative").val();
  console.log(name);
  console.log(new_relative_parent);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  if (!data["people"][new_relative_parent]["children"]) data["people"][new_relative_parent]["children"] = [id];
  else data["people"][new_relative_parent]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If new_relative_parent is Male, then set the Father, else if Female set the mother
  if (data["people"][new_relative_parent]["demographics"]["gender"] == "Male") data["people"][id]["father"] = new_relative_parent;
  else if (data["people"][new_relative_parent]["demographics"]["gender"] == "Female") data["people"][id]["mother"] = new_relative_parent;


  if ($("#ar_relative_select").val() == "Nephew") {
    data["people"][id]["relationship"] = "Nephew";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Niece") {
    data["people"][id]["relationship"] = "Niece";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
}

function action_add_grandchild() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  var new_relative_parent = $("#ar_select_common_relative").val();
  console.log(name);
  console.log(new_relative_parent);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  if (!data["people"][new_relative_parent]["children"]) data["people"][new_relative_parent]["children"] = [id];
  else data["people"][new_relative_parent]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If new_relative_parent is Male, then set the Father, else if Female set the mother
  if (data["people"][new_relative_parent]["demographics"]["gender"] == "Male") data["people"][id]["father"] = new_relative_parent;
  else if (data["people"][new_relative_parent]["demographics"]["gender"] == "Female") data["people"][id]["mother"] = new_relative_parent;

  if ($("#ar_relative_select").val() == "Grandson") {
    data["people"][id]["relationship"] = "Grandson";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Granddaughter") {
    data["people"][id]["relationship"] = "Granddaughter";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
}

// Note: For Unlce/Aunt we specific Paternal/Maternal and figure it out from there
function action_add_uncle_aunt() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  var new_relative_parent = $("#ar_select_common_relative").val();
  console.log(name);
  console.log(new_relative_parent);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  var parent_id;
  if (new_relative_parent == "Paternal") {
    parent_id = data["people"][proband]["father"];
  } else {
    parent_id = data["people"][proband]["mother"];
  }
  var grandfather_id = data["people"][parent_id]["father"];
  var grandmother_id = data["people"][parent_id]["mother"];

  if (!data["people"][grandfather_id]["children"]) data["people"][grandfather_id]["children"] = [id];
  else data["people"][grandfather_id]["children"].push(id);
  if (!data["people"][grandmother_id]["children"]) data["people"][grandmother_id]["children"] = [id];
  else data["people"][grandmother_id]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If new_relative_parent is Male, then set the Father, else if Female set the mother
  data["people"][id]["father"] = grandfather_id;
  data["people"][id]["mother"] = grandmother_id;


  if ($("#ar_relative_select").val() == "Uncle") {
    data["people"][id]["relationship"] = "Uncle";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Aunt") {
    data["people"][id]["relationship"] = "Aunt";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
}

function action_add_cousin() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  var new_relative_parent = $("#ar_select_common_relative").val();
  console.log(name);
  console.log(new_relative_parent);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  if (!data["people"][new_relative_parent]["children"]) data["people"][new_relative_parent]["children"] = [id];
  else data["people"][new_relative_parent]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If new_relative_parent is Male, then set the Father, else if Female set the mother
  if (data["people"][new_relative_parent]["demographics"]["gender"] == "Male") data["people"][id]["father"] = new_relative_parent;
  else if (data["people"][new_relative_parent]["demographics"]["gender"] == "Female") data["people"][id]["mother"] = new_relative_parent;

  data["people"][id]["relationship"] = "Cousin";
  data["people"][id]["demographics"]["gender"] = "Unknown";

}

function action_add_half_sibling() {
  var name = $("#ar_name").val();
  var proband = data["proband"];
  var new_relative_parent = $("#ar_select_common_relative").val();
  console.log(name);
  console.log(new_relative_parent);

  var id = crypto.randomUUID();

  // Add the ID to the proband Parents's Children
  var parent_id;
  if (new_relative_parent == "Paternal") {
    parent_id = data["people"][proband]["father"];
  } else {
    parent_id = data["people"][proband]["mother"];
  }

  if (!data["people"][parent_id]["children"]) data["people"][parent_id]["children"] = [id];
  else data["people"][parent_id]["children"].push(id);

  // Now create a new person_name
  data["people"][id] = {"name":name};
  data["people"][id]["demographics"] = {};
  // If Paternal, then set the Father, else Maternal set the mother
  if (new_relative_parent == "Paternal") {
    data["people"][id]["father"] = parent_id;
    data["people"][id]["mother"] = 'Unknown';
  } else if (new_relative_parent == "Maternal") {
    data["people"][id]["father"] = 'Unknown';
    data["people"][id]["mother"] = parent_id;
  }

  if ($("#ar_relative_select").val() == "Half Brother") {
    data["people"][id]["relationship"] = "Half Brother";
    data["people"][id]["demographics"]["gender"] = "Male";
  }
  if ($("#ar_relative_select").val() == "Half Sister") {
    data["people"][id]["relationship"] = "Half Sister";
    data["people"][id]["demographics"]["gender"] = "Female";
  }
}



//////////////////////////

function create_remove_person_from_fhh_widget() {
    var remove_relative_button = $("<BUTTON>Remove Relative</BUTTON>");
    remove_relative_button.click(remove_person_dialog);
    $("#remove_person_from_fhh").empty().append(remove_relative_button);
}

function remove_person_dialog() {
  console.log("Removing Relative");
  var remove_relative_dialog = $("<DIV id='rr_remove_relative_dialog'>");
  var remove_relative_label = $("<LABEL>Relative to Remove: </LABEL>");
  remove_relative_label.attr("for", "rr_remove_person_select");


  var relative_select = $("<SELECT id='rr_remove_person_select' />").append("<OPTION></OPTION>");

  var people = data["people"];
  $.each(people, function(person_id, details) {
    var option = $("<OPTION>" + details["name"] + "</OPTION>").attr("value", person_id);
    if (details["relationship"] != "Proband"
      && details["relationship"] != "Father"
      && details["relationship"] != "Mother"
      && details["relationship"] != "Paternal Grandfather"
      && details["relationship"] != "Paternal Grandmother"
      && details["relationship"] != "Maternal Grandfather"
      && details["relationship"] != "Maternal Grandmother")
    {
      relative_select.append(option);
    }
  });

  remove_relative_dialog.append(remove_relative_label).append(relative_select);

  remove_relative_dialog.dialog({
    autoOpen: true,
    position: {my:"center top", at:"center top"},
    modal:true,
    title: "Remove Relative",
    buttons: {
        "Remove Relative": action_remove_relative,
        Cancel: function() {
           remove_relative_dialog.dialog( "close" );
           $("#rr_remove_relative_dialog").remove();
        }
      }
  });
}

function action_remove_relative(event) {
  person_id = $("#rr_remove_person_select").val();
  if (!data["people"][person_id]["children"] || data["people"][person_id]["children"].length == 0) {
    var name = data["people"][person_id]["name"];
    // Must also remove the id from the children of both father and mother
    if (data["people"][person_id]["father"]) {
      var father_id = data["people"][person_id]["father"];
      removeElement(data["people"][father_id]["children"], person_id);
    }
    if (data["people"][person_id]["mother"]) {
      var mother_id = data["people"][person_id]["mother"];
      removeElement(data["people"][mother_id]["children"], person_id);
    }

    delete data["people"][person_id];
    var card_to_remove = $(".fhh_card[person_id='" + person_id + "']");
    console.log(card_to_remove);
    console.log($(".fhh_card").length)


    card_to_remove.remove();
    console.log($(".fhh_card").length)
    alert (name + " was removed");
  } else {
    alert ("Cannot Remove Person with active Childred, remove them first");
  }
  $("#rr_remove_relative_dialog").remove();
  display_fhh();
}

function create_remove_person_from_fhh_widget_old() {
  $("#remove_person_from_fhh").empty();
  var relative_select = $("<SELECT id='remove_person_select' />").append("<OPTION></OPTION>");

  var people = data["people"];
  $.each(people, function(person_id, details) {
    var option = $("<OPTION>" + details["relationship"] + " - " + details["name"] + "</OPTION>").attr("value", person_id);
    if (details["relationship"] != "Proband"
      && details["relationship"] != "Father"
      && details["relationship"] != "Mother"
      && details["relationship"] != "Paternal Grandfather"
      && details["relationship"] != "Paternal Grandmother"
      && details["relationship"] != "Maternal Grandfather"
      && details["relationship"] != "Maternal Grandmother")
    {
      relative_select.append(option);
    }
  });
  var remove_button = $("<BUTTON>Remove Relative</BUTTON>");
  remove_button.click(function (event) {
    person_id = $("#remove_person_select").val();
    if (!data["people"][person_id]["children"] || data["people"][person_id]["children"].length == 0) {
      var name = data["people"][person_id]["name"]

      delete data["people"][person_id];
      var card_to_remove = $(".fhh_card[person_id='" + person_id + "']");
      console.log(card_to_remove);
      card_to_remove.remove();
      alert (name + " was removed");
    } else {
      alert ("Cannot Remove Person with active Childred, remove them first");
    }
  });
  $("#remove_person_from_fhh").append(relative_select).append(remove_button);
}

function display_fhh() {
  $("#fhh_data").empty();
  if (!data  || !data["people"] || !data["proband"]) return; // Need a minimum in order to process at all

  var proband_id = data["proband"];
  data["people"][proband_id]["relationship"] = "Proband";

  // Make Proband Card
  var proband_div = $("<div></div>").addClass("fhh_card").attr("person_id", proband_id).attr("relationship", "Proband");
  $("#fhh_data").append(proband_div);

  // Make Parents Cards
  var father_id = data["people"][proband_id]["father"];
  var father_div = $("<div></div>").addClass("fhh_card").attr("person_id", father_id).attr("relationship", "Father");
  $("#fhh_data").append(father_div);

  var mother_id = data["people"][proband_id]["mother"];
  var mother_div = $("<div></div>").addClass("fhh_card").attr("person_id", mother_id).attr("relationship", "Mother");
  $("#fhh_data").append(mother_div);

  // Make Grandparents Cards
  var paternal_grandfather_id = data["people"][father_id]["father"];
  var paternal_grandfather_div = $("<div></div>").addClass("fhh_card").attr("person_id", paternal_grandfather_id).attr("relationship", "Paternal Grandfather");
  $("#fhh_data").append(paternal_grandfather_div);

  var paternal_grandmother_id = data["people"][father_id]["mother"];
  var paternal_grandmother_div = $("<div></div>").addClass("fhh_card").attr("person_id", paternal_grandmother_id).attr("relationship", "Paternal Grandmother");
  $("#fhh_data").append(paternal_grandmother_div);

  var maternal_grandfather_id = data["people"][mother_id]["father"];
  var maternal_grandfather_div = $("<div></div>").addClass("fhh_card").attr("person_id", maternal_grandfather_id).attr("relationship", "Maternal Grandfather");
  $("#fhh_data").append(maternal_grandfather_div);

  var maternal_grandmother_id = data["people"][mother_id]["mother"];
  var maternal_grandmother_div = $("<div></div>").addClass("fhh_card").attr("person_id", maternal_grandmother_id).attr("relationship", "Maternal Grandmother");
  $("#fhh_data").append(maternal_grandmother_div);

  // Make Children Cards
  var children = data["people"][proband_id]["children"];
  if (children) {
    children.forEach(function(person_id) {
      var relationship  = get_relationship(person_id, "Son", "Daughter", "Child");
      var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
      $("#fhh_data").append(person_div);
    });
  }
  // Make Sibling Cards
  var full_siblings = get_full_siblings();
  full_siblings.forEach(function(person_id) {
    var relationship  = get_relationship(person_id, "Brother", "Sister", "Sibling");
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

  // Make nephews_and_nieces cards
  var nephews_and_nieces = get_nephews_and_nieces();
  nephews_and_nieces.forEach(function(person_id) {
    var relationship  = get_relationship(person_id, "Nephew", "Niece", "Nephew/Niece");
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

  // Make Grandchildren cards
  var grandchildren = get_grandchildren();
  grandchildren.forEach(function(person_id) {
    var relationship  = get_relationship(person_id, "Grandson", "Granddaughter", "Grandchild");
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

  // Make Uncle/Aunt cards
  var uncle_aunts = get_uncles_aunts();
  uncle_aunts.forEach(function(person_id) {
    var relationship  = get_relationship(person_id, "Uncle", "Aunt", "Uncle/Aunt");
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

  // Make Cousins cards
  var cousins = get_cousins();
  cousins.forEach(function(person_id) {
    console.log(person_id);
    var relationship = "Cousin";
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

  // Make Half-Sibling cards
  var halfsiblings = get_half_siblings();
  halfsiblings.forEach(function(person_id) {
    var relationship  = get_relationship(person_id, "Half Brother", "Half Sister", "Half Sibling");
    var person_div =  $("<div></div>").addClass("fhh_card").attr("person_id", person_id).attr("relationship", relationship);
    $("#fhh_data").append(person_div);
  });

// This is where we define what the cards look like
  $(".fhh_card").card({
//    view:"complex"
  });

// This is where we add the data to all cards based on the person_id of the card

  $(".fhh_card").each(function(i) {
    var person_id = $(this).attr("person_id");
    var relationship = $(this).attr("relationship");
    $(this).card("data", data["people"][person_id]);
  });


}


function get_full_siblings() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var fathers_children = [];
  var mothers_children = [];

  if (data["people"][father_id] && data["people"][father_id]["children"])
    fathers_children = data["people"][father_id]["children"];
  if (data["people"][mother_id] != null && data["people"][mother_id]["children"] != null)
    mothers_children = data["people"][mother_id]["children"];

  var common = $(fathers_children).filter(mothers_children);

  var siblings = [];
  $.each(common, function(i,v) {
    if (v != proband_id) siblings.push(v);
  });
  return (siblings);
}

function get_nephews_and_nieces() {
  var nephews_and_nieces = [];

  var full_siblings = get_full_siblings();
  full_siblings.forEach(function(person_id) {
    var children = data["people"][person_id]["children"];
    if (children) nephews_and_nieces = nephews_and_nieces.concat(children);
  });
  return nephews_and_nieces;
}

function old_get_uncles_aunts() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var paternal_grandfather_id = data["people"][father_id]["father"];
  var maternal_grandfather_id = data["people"][mother_id]["father"];

  var paternal_uncles_and_aunts = data["people"][paternal_grandfather_id]["children"];
  var maternal_uncles_and_aunts = data["people"][maternal_grandfather_id]["children"];

  var uncles_and_aunts = [];
  if (paternal_uncles_and_aunts && maternal_uncles_and_aunts) paternal_uncles_and_aunts.concat(maternal_uncles_and_aunts);
  else if (paternal_uncles_and_aunts) uncles_and_aunts = paternal_uncles_and_aunts;
  else if (maternal_uncles_and_aunts) uncles_and_aunts = maternal_uncles_and_aunts;

  // Have to remove parents;
  removeElement(uncles_and_aunts, father_id);
  removeElement(uncles_and_aunts, mother_id);

  return uncles_and_aunts;
}

function get_uncles_aunts() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var paternal_grandfather_id = data["people"][father_id]["father"];
  var maternal_grandfather_id = data["people"][mother_id]["father"];

  var uncles_and_aunts = [];
  $.each(data["people"], function (person_id, details){
    if (data["people"][person_id]["father"] == paternal_grandfather_id ||
        data["people"][person_id]["father"] == maternal_grandfather_id) {
      if (person_id != father_id && person_id != mother_id) uncles_and_aunts.push(person_id);
    }
  });

  return uncles_and_aunts;
}

function get_grandchildren() {
  var proband_id = data["proband"];
  var grandchildren = [];

  var children = data["people"][proband_id]["children"];
  if (children) {
    children.forEach(function(person_id) {
      var gc = data["people"][person_id]["children"];
      if (gc && gc.length > 0) grandchildren = grandchildren.concat(gc);
    });
  }
  return grandchildren;
}

function get_cousins() {
  var proband_id = data["proband"];
  var cousins = [];

  var uncles_aunts = get_uncles_aunts();
  if (uncles_aunts) {
    uncles_aunts.forEach(function(person_id) {
      var c = data["people"][person_id]["children"];
      if (c && c.length > 0) cousins = cousins.concat(c);
    });
  }
  return cousins;
}

function get_half_siblings() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var fathers_children = [];
  var mothers_children = [];

  if (data["people"][father_id] && data["people"][father_id]["children"])
    fathers_children = data["people"][father_id]["children"];
  if (data["people"][mother_id] != null && data["people"][mother_id]["children"] != null)
    mothers_children = data["people"][mother_id]["children"];

  var halfsiblings = [...$(fathers_children).not(mothers_children), ...$(mothers_children).not(fathers_children)];
  return (halfsiblings);
}

/// Convenience Functions
function get_relationship(id, male, female, unknown) {
  if (get_gender(id) == "Male" ) return (male);
  else if (get_gender(id) == "Female" ) return (female);
  else return (unknown);
}

function get_gender(id) {
  if (!data["people"][id]) return "Unknown";
  if (!data["people"][id]["demographics"]) return "Unknown";
  if (!data["people"][id]["demographics"]["gender"]) return "Unknown";
  return data["people"][id]["demographics"]["gender"];
}

function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}

function exportJson(data, exportName){
  console.log(data);
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
