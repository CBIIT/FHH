
var data = [];
//var options = {};

var unit = 50;
var space = 400;
var vertical = 400;
var offset;
var max_generation = 7;

var page_x;
var page_y;
var original_x;
var original_y;
var object_being_moved;
var dragging = false;
var target = null;

(function ( $ ) {
$.widget("fhh.pedigree",{

    options: {
      data:[]
    },
    display: function () {

      var d = this.options.data;
      if (!d || d.length == 0) return;

      data = d;
      options = this.options;

      // The following sets the patners for all has_children
      find_and_set_partners();
      find_and_set_blood_relatives();

      // The following fake person is necessary to space the childless people correctly (each childless person needs a fake child)
      d["people"]["placeholder"] = {};
      d["people"]["placeholder"]["demographics"] = {};
      d["people"]["placeholder"]["demographics"]["gender"] = "Unknown";

      var proband_id = data["proband"];
      var father_id = data["people"][proband_id]["father"];
      var mother_id = data["people"][proband_id]["mother"];

      var paternal_grandfather_id = data["people"][father_id]["father"];
      var paternal_grandmother_id = data["people"][father_id]["mother"];
      var maternal_grandfather_id = data["people"][mother_id]["father"];
      var maternal_grandmother_id = data["people"][mother_id]["mother"];

      var great_grandparents = find_great_grandparents();
      find_and_set_blood_relatives_for_great_grandparents(great_grandparents);

      var dads_siblings = find_children(paternal_grandfather_id, father_id);
      var dads_extra_partners = find_dads_extra_partners(father_id);

      var moms_siblings = find_children(maternal_grandfather_id, mother_id);
      var moms_extra_partners = find_moms_extra_partners(mother_id);

      var paternal_cousins = find_all_children_from_list(dads_siblings);
      if (paternal_cousins) paternal_cousins.reverse();

      var maternal_cousins = find_all_children_from_list(moms_siblings);
      var paternal_half_siblings = find_paternal_half_siblings(father_id, mother_id);

      var full_siblings = find_full_siblings(father_id, mother_id, proband_id);
      var proband_and_siblings = find_full_siblings(father_id, mother_id);
      var older_siblings = find_older_siblings(father_id, mother_id, proband_id);
      var younger_siblings = subtract_array(full_siblings, older_siblings);

//      var younger_siblings = find_younger_siblings(father_id, mother_id, proband_id);

//      var full_brothers = find_full_sons(father_id, mother_id, proband_id);
//      var full_sisters = find_full_daughters(father_id, mother_id, proband_id);

      var maternal_half_siblings = find_maternal_half_siblings(father_id, mother_id);

      var siblings_children = find_all_children_from_list(full_siblings);
//      var brothers_children = find_all_children_from_list(full_brothers);
//      var sisters_children = find_all_children_from_list(full_sisters);
      var older_siblings_children = find_all_children_from_list(older_siblings);
//      if (older_siblings_children) older_siblings_children.reverse();

      var younger_siblings_children = find_all_children_from_list(younger_siblings);

      var children = find_children_from_one_parent(proband_id);
//      var sons = find_sons_from_one_parent(proband_id);
//      var daughters = find_daughters_from_one_parent(proband_id);

      var paternal_cousins_children = find_all_children_from_list(paternal_cousins);
      if (paternal_cousins_children) paternal_cousins_children.reverse();

      var maternal_cousins_children = find_all_children_from_list(maternal_cousins);

      var siblings_children = find_all_children_from_list(children);

      var grandchildren = find_all_children_from_list(children);
//      var sons_children = find_all_children_from_list(sons);
//      var daughters_children = find_all_children_from_list(daughters);


// Now, Starting at the bottom, set the Pedigree Location for each couple

      set_location_grandchildren_generation(grandchildren);
      set_location_children_generation(paternal_cousins_children, older_siblings_children, children, younger_siblings_children, maternal_cousins_children);
      set_location_proband_generation(paternal_cousins, paternal_half_siblings, older_siblings,
          proband_id, younger_siblings, maternal_half_siblings, maternal_cousins);
      set_location_parents_generation(dads_siblings, dads_extra_partners, father_id, mother_id, moms_extra_partners, moms_siblings);
      set_location_grandparents_generation(paternal_grandfather_id, paternal_grandmother_id, maternal_grandfather_id, maternal_grandmother_id);
      set_location_great_grandparents_generation(great_grandparents, paternal_grandfather_id, paternal_grandmother_id, maternal_grandfather_id, maternal_grandmother_id);

//      var proband_row = build_row();

      var min_index_left = 0;
      var max_index_right = 0;
      $.each(data["people"], function (person, details) {
        if (details && details["pedigree"] && details["pedigree"]["location"] < min_index_left) min_index_left = details["pedigree"]["location"];
        if (details && details["pedigree"] && details["pedigree"]["location"] > max_index_right) max_index_right = details["pedigree"]["location"];
      });
      max_index_right++;

      var all_blood_relatives = [];

      all_blood_relatives = all_blood_relatives.concat(grandchildren);
      all_blood_relatives = all_blood_relatives.concat(paternal_cousins_children, older_siblings_children, children,
        younger_siblings_children, maternal_cousins_children,);
      all_blood_relatives = all_blood_relatives.concat(paternal_cousins, paternal_half_siblings, full_siblings,
        maternal_half_siblings, maternal_cousins);
      all_blood_relatives = all_blood_relatives.concat(dads_siblings,moms_siblings);
      all_blood_relatives.push(proband_id);
      all_blood_relatives.push(father_id);
      all_blood_relatives.push(paternal_grandfather_id, maternal_grandfather_id);

      //We might have a problem because the gg_parents may be drawn twice because we draw a couple at a time
      $.each(great_grandparents, function (index, person_id) {
        all_blood_relatives.push(person_id);
      });

      var patriarchs = [paternal_grandfather_id, maternal_grandfather_id];
      $.each(data['people'], function (person_id, details) {
        var generation = get_generation_of_relative(person_id, patriarchs);
        if (details['blood']) details["gen"] = generation;
      });

//      $.each(data['people'], function (person_id, details) {
//        if (details['blood']) console.log (person_id + "(" + details['name'] + "):" + details['gen'])
//      });
//      console.log(all_blood_relatives);

      display_svg(-min_index_left, all_blood_relatives, max_index_right);

    },
    _create: function() {

    },
    data: function (d) {
      this.options.data = d;
    },
    show_id: function(flag) {
      this.options.show_id = flag;
    },
    get_options: function() {
      return this.options;
    },
    set_style: function(style) {
      set_style(style, this.options)
    },
    set_quadrants: function(quadrant1, quadrant2, quadrant3, quadrant4) {
      console.log("1[" + quadrant1 + "] 2[" + quadrant2 + "] 3[" + quadrant3 + "] 4[" + quadrant4 +"]");
      this.options.quadrant1 = quadrant1;
      this.options.quadrant2 = quadrant2;
      this.options.quadrant3 = quadrant3;
      this.options.quadrant4 = quadrant4;
    },
    person_id: function(p_id) {
      this.options.person_id = p_id;
    },
    relationship: function(relationship) {
      this.options.relationship = relationship;
    }
  });
}( jQuery ));

function set_options(height) {
//  unit = options.unit_size;
//  space = options.spacing;
  vertical = parseInt(height);
//  offset;
//  max_generation = 7;
}

function set_style(style, options) {
  // The styles determine how compact or expanded the tree will be.
  // Compact has little room for text (ID and Name only) and relies on the quadrants to display key information
  // Basic has room for ID&Name,  Birthdate (age) DeathDate, and upto two key disesases
  // Expanded shows ID&Name, Birthdate (age) DeathDate, 3 diseases, and 3 procedures (configurable if needed) for 8 rows total

  console.log (style);
  if (style == "compact") {
    console.log(options);
    vertical = 200;
    space = 250;
    unit = 70;
    options["show_id"] = false;
    options["show_diseases"] = 0;
    options["show_procedures"] = 0;
    options["max_chars"] = 10;
  } else if (style == "basic") {
    vertical = 250;
    space = 300;
    unit = 50;
    options["show_id"] = true;
    options["show_diseases"] = 3;
    options["show_procedures"] = 0;
    options["max_chars"] = 35;
  } else if (style == "expanded") {
    vertical = 400;
    space = 400;
    unit = 50;
    options["show_id"] = true;
    options["show_diseases"] = 3;
    options["show_procedures"] = 3;
    options["max_chars"] = 35;
  }
}

function display_svg(left_side, all_blood_relatives, right_side) {
  const diagram_width = (left_side + 1 + right_side) * space;
  const diagram_height = vertical * 7
  offset = (left_side + 1);

  var diagram = $("#fhh_pedigree");
  var svg = $(createSvg("svg"))
    .attr("id", "svg")
    .attr('width', diagram_width)
    .attr('height', diagram_height);
  diagram.empty().append(svg);

  // Add event listeners HERE
  svg.on("mouseup", function (e) { stop_dragging(e); });
  svg.on("mousemove", function (e) { if(dragging) drag_object(e); } );
  svg.on("mouseleave", function (e) { stop_dragging(e); } );


  var already_part_of_couple = [];

  $.each(all_blood_relatives, function (index, person) {
//    if (person != "placeholder" && data['people'][person]["pedigree"]["generation"] == 6) console.log(data['people'][person]);

    if (already_part_of_couple.indexOf(person) === -1) {
      var couple;
      if (data['people'][person] && data['people'][person]['partners'] && data['people'][person]['partners'][0]) {
        var partner_id=data['people'][person]['partners'][0];
//        console.log ("Making Couple:"+ data['people'][person]['name'] + " " + data['people'][partner_id]['name']);
        couple = make_couple(person, partner_id);
      } else {
        couple = make_couple(person);
      }
      draw_couple(svg, couple, offset);
      already_part_of_couple.push(person);
    }
  });
// Special Case for half Siblings
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  if (data["people"][father_id]["partners"][1]) {
    console.log(data["people"][father_id]["partners"][1]);
    draw_paternal_half_sibling_parent(svg, father_id);
  }
  if (data["people"][mother_id]["partners"][1]) {
    console.log(data["people"][mother_id]["partners"][1]);
    draw_maternal_half_sibling_parent(svg, mother_id);
  }

  draw_proband_arrow(svg, offset);
}

function make_couple (first_person, second_person = null) {
  var pedigree = data['people'][first_person]['pedigree'];

  var couple = {"male":null, "female":null, "pedigree":pedigree};

  if (!second_person) {
    if (data["people"][first_person]["demographics"] && data["people"][first_person]["demographics"]["gender"] == "Male") {
      couple['male'] = first_person;
    } else {
      // Note: Unknown will occupied female spot
      couple['female'] = first_person;
    }
  } else {
    if (data["people"][first_person]["demographics"]["gender"] == "Male") {
      couple['male'] = first_person;
      couple['female'] = second_person;
    } else {
      couple['male'] = second_person;
      couple['female'] = first_person;
    }
  }
  return couple;
}

function draw_couple(svg, couple) {
  // Do not draw the "placeholder" id, it is there to line up childless people

  var male_id = couple["male"];
  var female_id = couple["female"];
  if (data["people"][male_id] && data["people"][male_id]["placeholder"]) return;
  if (data["people"][female_id] && data["people"][female_id]["placeholder"]) return;

  if (male_id == null && does_person_have_children(female_id)) {
    male_id = "Unknown";
  }
  if (female_id == null && does_person_have_children(male_id)) {
    female_id = "Unknown";
  }


  var proband_id = data["proband"];

//  console.log(couple);
  var location = couple["pedigree"]["location"];
  var generation = couple["pedigree"]["generation"];

  if (male_id) {
    if (data["people"][male_id] && data["people"][male_id]["miscarriage"]) draw_miscarriage(svg, male_id, location, generation, "male");
    else draw_male (svg, male_id, female_id, location, generation);
    if (data["people"][male_id]) {
      var name = data["people"][male_id]["name"];
      draw_details (svg, male_id, female_id, location, generation, true);

      connect_to_parent(svg, male_id, "Male", offset, generation, location);
    }
  }

  if (female_id) {
    if (data["people"][female_id] && data["people"][female_id]["miscarriage"]) draw_miscarriage(svg, female_id, location, generation, "female");
    else if (data["people"][female_id] && data["people"][female_id]['demographics'] && data["people"][female_id]['demographics']['gender'] == "Female") {
      draw_female (svg, female_id, male_id, location, generation);
    } else if (female_id == "Unknown") {
      draw_female (svg, female_id, male_id, location, generation);
    } else {
      draw_unknown (svg, female_id, location, generation);
    }
    var name = "";
    if (data["people"][female_id] && data["people"][female_id]["name"]) name = data["people"][female_id]["name"];
    draw_details(svg, female_id, male_id, location, generation, false);

    connect_to_parent(svg, female_id, "Female", offset, generation, location);
  }

  if (male_id && female_id) {
    draw_link (svg, male_id, female_id, location, generation);
  }
}

function draw_paternal_half_sibling_parent(svg, father_id) {
  var exception_id = data["proband"];
  var nonblood_mother_pedigree = find_last_child_pedigree(father_id);

  console.log(nonblood_mother_pedigree);
  draw_female (svg, "Unknown", father_id, nonblood_mother_pedigree["location"], nonblood_mother_pedigree["generation"]+1);
  var father_pedigree = data["people"][father_id]["pedigree"];
  draw_paternal_long_link(svg, nonblood_mother_pedigree["location"], father_pedigree["location"], father_pedigree["generation"]);
}

function draw_maternal_half_sibling_parent(svg, mother_id) {
  var exception_id = data["proband"];
  var nonblood_father_pedigree = find_last_child_pedigree(mother_id);

  console.log(nonblood_father_pedigree);
  draw_male (svg, "Unknown", mother_id, nonblood_father_pedigree["location"], nonblood_father_pedigree["generation"]+1);
  var mother_pedigree = data["people"][mother_id]["pedigree"];
  draw_maternal_long_link(svg, nonblood_father_pedigree["location"], mother_pedigree["location"], mother_pedigree["generation"]);
}

function draw_details (svg, id, partner_id, location, generation, male=true) {
  var lines = [];
  var person_details = data["people"][id];

  if (!person_details) return;  // If there is no details on a perswon, skip

  // Always show name
  var line_num = 0;
  var key_line_num = 0;

  if (config.show_full_name) {
    lines[line_num] = get_full_name(person_details);
    line_num += 1;
    key_line_num++;
  }

  if (config.show_initials) {
    lines[line_num] = getFirstLetters(get_full_name(person_details));
    lines[line_num]
    line_num += 1;
    key_line_num++;
  }

  if (config.show_id) {
    if (!config.display_id_size || config.display_id_size < 10) config.display_id_size = 10;
    lines[line_num] = id.substring(0, config.display_id_size);

    line_num++;
    key_line_num++;
  }
  if (config.show_dates) {
    var birthdate = get_birthdate(person_details);
    if (birthdate) {
      lines[line_num] = birthdate
      line_num++;
      key_line_num++;
    }
    var deathdate = get_deathdate(person_details);
    if (deathdate) {
      lines[line_num] = deathdate
      line_num++;
      key_line_num++;
    }

  }

  if (config.show_diseases && config.key_diseases) {
    lines[line_num] = "";
    $.each(config.key_diseases, function (index, key_disease) {
      $.each(person_details["diseases"], function (disease, details) {
        if (key_disease.code == details.code) {
          lines[line_num] += key_disease.shorthand;
          if (config.show_age_of_diagnosis && details.age_of_diagnosis) {
            lines[line_num] += "(" + Math.floor(details.age_of_diagnosis) + ") "
          }
        }
      });
    });
    line_num++;
  }

  if (config.show_procedures && config.key_procedures) {
    lines[line_num] = "";
    $.each(config.key_procedures, function (index, key_procedure) {
      $.each(person_details["procedures"], function (disease, details) {
//        console.log(key_procedure.code + " " + details.code);
        if (key_procedure.code == details.code) {
          lines[line_num] += key_procedure.shorthand;
          if (config.show_age_of_procedure && details.age_at_procedure) {
            lines[line_num] += "(" + Math.floor(details.age_at_procedure) + ") "
          }
        }
      });
    });
    line_num++;
  }

  // Old Code
  if (options["show_procedures"]  && false) {
    $.each(person_details["procedures"], function (procedure_name, details) {
      lines[line_num] = procedure_name
      if (details["age_at_procedure"]) lines[line_num] = lines[line_num] + " [" + parseInt(details["age_at_procedure"]) + "]";
      line_num++;
      if (line_num > 3 + options["show_diseases"] + options["show_diseases"]) return false; // Only room for procedures to go to row 6
    });
  }

  $.each (lines, function (index, contents) {
    var x = (offset+location)*space;
    var y = (max_generation - generation)*vertical;


    var str;
    if (contents && contents.length > config.max_chars) str =  contents.substring(0, config.max_chars) + "..";
    else str = contents;

    var anchor
    if (male) {
      anchor = "end";
      gender_offset = unit/2;
    } else {
      anchor = "start";
      gender_offset = 2*unit-unit/2;
    }

    var fw = "normal";
    var fs = "14"
    var boldlines = 1;
    var center = false;

    if (index < key_line_num) {
      fw = "bolder";
      fs= "16"
    }
    var text = $(createSvg("text"))
      .attr("x", x+gender_offset).attr("y", y+unit/2 + 20 +(index*20) )
      .attr("partner_id", partner_id)
      .attr("id", id)
      .attr("font-family", "arial")
      .attr("font-size", fs)
      .attr("font-weight", fw)
      .attr("text-anchor", anchor)
      .append(str);
    svg.append(text);
  });
}

function get_full_name(person_details) {
  if (person_details["name"]) return person_details["name"];
  else if (person_details["first_name"] && person_details["last_name"]) {
    return person_details["first_name"] + " " + person_details["last_name"];
  } else if (person_details["first_name"]) {
    return person_details["first_name"];
  } else if (person_details["last_name"]){
    return person_details["last_name"];
  }
  return "Unknown";
}

function get_birthdate(person_details) {

  if (person_details["demographics"] && person_details["demographics"]["birthdate"]) {
    var birthdate = new Date(person_details["demographics"]["birthdate"]);
    var combined_date = person_details["demographics"]["birthdate"] ;
    var now = new Date();
    if (!person_details['deceased']) {
      var current_age = diff_years(now, birthdate);
      combined_date += " (" + current_age + "y)"
    }
    return combined_date;
  }
  return null;
}

function get_deathdate(person_details) {

  if (person_details["demographics"] && person_details["demographics"]["deathdate"]) {
    var combined_date = person_details["demographics"]["deathdate"] ;

    if (person_details["demographics"]["birthdate"]) {
      var deathdate = new Date(person_details["demographics"]["deathdate"]);
      var birthdate = new Date(person_details["demographics"]["birthdate"]);
      var age_at_death = diff_years(deathdate, birthdate);
      combined_date += " (d " + age_at_death + "y)"

    }
    return combined_date;
  }
  return null;
}

function get_birth_and_death_dates(person_details) {

  if (person_details["demographics"]) {
    if (person_details["demographics"]["birthdate"] && person_details["demographics"]["deathdate"]) {
      var birthdate = new Date(person_details["demographics"]["birthdate"]);
      var deathdate = new Date(person_details["demographics"]["deathdate"]);
      var age_at_death = diff_years(deathdate, birthdate);
      var combined_date = person_details["demographics"]["birthdate"] + " - " + person_details["demographics"]["deathdate"];
      combined_date += " (d " + age_at_death + "y)"
      return combined_date;
    } else if (person_details["demographics"]["birthdate"]) {
      var birthdate = new Date(person_details["demographics"]["birthdate"]);
      var now = new Date();
      var current_age = diff_years(now, birthdate);
      var combined_date = person_details["demographics"]["birthdate"] ;
      combined_date += " (" + current_age + "y)"
      return combined_date;
    }
  }
  return null;
}

function draw_male(svg, id, partner_id, location, generation) {

  var x = (offset+location)*space;
  var y = (max_generation - generation)*vertical;
  var color = "yellow";
  if (id == "Unknown") color = "white";
  var has_parent = false;
  if (data["people"][id] && data["people"][id]["father"]) has_parent = true;
  if (data["people"][id] && data["people"][id]["mother"]) has_parent = true;

  if (data["people"][id] && data["people"][id]['partners']) color = 'grey';
  if (data["people"][id] && data["people"][id]["blood"]) color = "yellow";

  // Set the actual map location of the person_id
  if (data["people"][id]) {
    data["people"][id]["map"] = {"x": x, "y": y}
  }

  var rect = $(createSvg("rect"))
    .attr("id",id)
    .attr("partner_id", partner_id)
    .attr("x",x-unit/2).attr("y",y-unit/2)
    .attr("height",unit).attr("width",unit)
    .attr("stroke","black")
    .attr("fill",color);
  svg.append(rect);
  if (id && id != "Unknown" && has_parent) {
    var line = $(createSvg("line"))
      .attr("id", id)
      .attr("partner_id", partner_id)
      .attr("x1",x).attr("y1",y-unit/2)
      .attr("x2",x).attr("y2",y-unit)
      .attr("stroke","black");

    if (data["people"][id] && data["people"][id]["adopted_in"]) line.attr("stroke-dasharray", "2");
    svg.append(line);
  }
//  rect.on("click", function (e) { sayHi(e)});
  rect.on("mousedown", function (e) { start_dragging(e); });
//  rect.on("mouseup", function (e) { stop_dragging(e); });
//  rect.on("mousemove", function (e) { if(dragging) drag_object(e); } );
//  rect.on("mouseout", function (e) { stop_dragging(e); } );

  if (data["people"][id] && data["people"][id]["deceased"]) {
    var line = $(createSvg("line"))
      .attr("deceased", "Deceased")
      .attr("id", id)
      .attr("x1",x+unit/2+5).attr("y1",y-unit/2-5)
      .attr("x2",x-unit/2-5).attr("y2",y+unit/2+5)
      .attr("stroke","black");
    svg.append(line);
  }

  if (data["people"][id] && (data["people"][id]["adopted_in"] || data["people"][id]["adopted_out"])) draw_adopted(svg, "male", location, generation);
  if (options["quadrant1"] && options["quadrant1"].length > 0 && has_disease(options["quadrant1"], id) == true) {
    fill_quadrant_male(svg, 1, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant2"] && options["quadrant2"].length > 0 && has_disease(options["quadrant2"], id) == true) {
    fill_quadrant_male(svg, 2, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant3"] && options["quadrant3"].length > 0 && has_disease(options["quadrant3"], id) == true) {
    fill_quadrant_male(svg, 3, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant4"] && options["quadrant4"].length > 0 && has_disease(options["quadrant4"], id) == true) {
    fill_quadrant_male(svg, 4, id, partner_id, x, y, "#404040");
  }

}

// Functions to help with drawing
function draw_female(svg, id, partner_id, location, generation) {
  var x = ((offset+location)*space)+2*unit;
  var y = (max_generation - generation)*vertical;


  var color = "yellow";
  if (id == "Unknown") color = "white";
  var has_parent = false;
  if (data["people"][id] && data["people"][id]["father"]) has_parent = true;
  if (data["people"][id] && data["people"][id]["mother"]) has_parent = true;

  if (data["people"][id] && data["people"][id]['partners']) color = 'grey';
  if (data["people"][id] && data["people"][id]["blood"]) color = "yellow";

  // Set the actual map location of the person_id
  if (data["people"][id]) {
    data["people"][id]["map"] = {"x": x, "y": y}
  }

  var circle = $(createSvg("circle"))
    .attr("id",id)
    .attr("partner_id", partner_id)
    .attr("cx",x).attr("cy",y)
    .attr("r",unit/2)
    .attr("stroke","black")
    .attr("fill",color);
  svg.append(circle);
//  circle.on("click", function (e) { sayHi(e)});
  if (id && id != "Unknown" && has_parent) {
    var line = $(createSvg("line"))
      .attr("id", id)
      .attr("partner_id", partner_id)
      .attr("x1",x).attr("y1",y-unit/2)
      .attr("x2",x).attr("y2",y-unit)
      .attr("stroke","black");

    if (data["people"][id] && data["people"][id]["adopted_in"]) line.attr("stroke-dasharray", "2");
    svg.append(line);
  }

//  rect.on("click", function (e) { sayHi(e)});
  circle.on("mousedown", function (e) { start_dragging(e); });
//  circle.on("mouseup", function (e) { stop_dragging(e); });
//  circle.on("mousemove", function (e) { if(dragging) drag_object(e); } );
//  circle.on("mouseout", function (e) { stop_dragging(e); } );

  if (data["people"][id] && data["people"][id]["deceased"]) {
    var line = $(createSvg("line"))
      .attr("deceased", "Deceased")
      .attr("id", id)
      .attr("x1",x+unit/2+5).attr("y1",y-unit/2-5)
      .attr("x2",x-unit/2-5).attr("y2",y+unit/2+5)
      .attr("stroke","black");
    svg.append(line);
  }

  if (data["people"][id] && (data["people"][id]["adopted_in"] || data["people"][id]["adopted_out"])) draw_adopted(svg, "female", location, generation);

  if (options["quadrant1"] && options["quadrant1"].length > 0 && has_disease(options["quadrant1"], id) == true) {
    fill_quadrant_female(svg, 1, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant2"] && options["quadrant2"].length > 0 && has_disease(options["quadrant2"], id) == true) {
    fill_quadrant_female(svg, 2, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant3"] && options["quadrant3"].length > 0 && has_disease(options["quadrant3"], id) == true) {
    fill_quadrant_female(svg, 3, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant4"] && options["quadrant4"].length > 0 && has_disease(options["quadrant4"], id) == true) {
    fill_quadrant_female(svg, 4, id, partner_id, x, y, "#404040");
  }
}


function draw_unknown(svg, id, location, generation) {
  var x = ((offset+location)*space)+2*unit;
  var y = (max_generation - generation)*vertical;

  var color = "yellow";
  if (id == "Unknown") color = "white";
  var has_parent = false;
  if (data["people"][id] && data["people"][id]["father"]) has_parent = true;
  if (data["people"][id] && data["people"][id]["mother"]) has_parent = true;

  // Set the actual map location of the person_id
  if (data["people"][id]) {
    data["people"][id]["map"] = {"x": x, "y": y}
  }

  var points = "";
  points += (x) + "," + (y-unit/2) + " ";
  points += (x+unit/2) + "," + (y) + " ";
  points += (x) + "," + (y + unit/2) + " ";
  points += (x-unit/2) + "," + (y);

  var polygon = $(createSvg("polygon"))
    .attr("id",id)
    .attr("points", points)
    .attr("stroke","black")
    .attr("fill",color);
  svg.append(polygon);
  polygon.on("click", function (e) { sayHi(e)});
  if (id && id != "Unknown" && has_parent) {
    var line = $(createSvg("line"))
      .attr("id", id)
      .attr("x1",x).attr("y1",y-unit/2)
      .attr("x2",x).attr("y2",y-unit)
      .attr("stroke","black");
    svg.append(line);
  }

  polygon.on("mousedown", function (e) { start_dragging(e); });

  if (data["people"][id] && data["people"][id]["deceased"]) {
    var line = $(createSvg("line"))
      .attr("deceased", "Deceased")
      .attr("id", id)
      .attr("x1",x+unit/2+5).attr("y1",y-unit/2-5)
      .attr("x2",x-unit/2-5).attr("y2",y+unit/2+5)
      .attr("stroke","black");
    svg.append(line);
  }
  if (data["people"][id] && (data["people"][id]["adopted_in"] || data["people"][id]["adopted_out"])) draw_adopted(svg, "female", location, generation);
  if (options["quadrant1"] && options["quadrant1"].length > 0 && has_disease(options["quadrant1"], id) == true) {
    fill_quadrant_unknown(svg, 1, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant2"] && options["quadrant2"].length > 0 && has_disease(options["quadrant2"], id) == true) {
    fill_quadrant_unknown(svg, 2, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant3"] && options["quadrant3"].length > 0 && has_disease(options["quadrant3"], id) == true) {
    fill_quadrant_unknown(svg, 3, id, partner_id, x, y, "#404040");
  }
  if (options["quadrant4"] && options["quadrant4"].length > 0 && has_disease(options["quadrant4"], id) == true) {
    fill_quadrant_unknown(svg, 4, id, partner_id, x, y, "#404040");
  }

}

function fill_quadrant_male(svg, quadrant, id, partner_id, x, y, color) {

  var center_x = x; var center_y = y;
  var start_x = x+unit/2; var start_y = y;


  if (quadrant == 1) {
    start_x = x; var start_y = y-unit/2;
  } else if (quadrant == 2) {
    start_x = x-unit/2; var start_y = y - unit/2;
  } else if (quadrant == 3) {
    start_x = x-unit/2; var start_y = y;
  } else if (quadrant == 4) {
    start_x = x; var start_y = y;
  }

  var rect = $(createSvg("rect"))
    .attr("id",id)
    .attr("partner_id", partner_id)
    .attr("x",start_x).attr("y",start_y)
    .attr("height",unit/2).attr("width",unit/2)
    .attr("stroke","black")
    .attr("fill-opacity", ".5")
    .attr("fill",color);
  svg.append(rect);
}

function fill_quadrant_female(svg, quadrant, id, partner_id, x, y, color) {

  var center_x = x; var center_y = y;
  var start_x = x+unit/2; var start_y = y;
  var end_x = x; var end_y = y - unit/2;
  var radius = unit/2;

  if (quadrant == 1) {
    start_x = x+unit/2; var start_y = y;
    end_x = x; var end_y = y - unit/2;
  } else if (quadrant == 2) {
    start_x = x; var start_y = y - unit/2;
    end_x = x-unit/2; var end_y = y;
  } else if (quadrant == 3) {
    start_x = x-unit/2; var start_y = y;
    end_x = x; var end_y = y + unit/2;
  } else if (quadrant == 4) {
    start_x = x; var start_y = y + unit/2;
    end_x = x + unit/2; var end_y = y;
  }
  pathStr = "M" + center_x + "," + center_y + "\nL" + start_x + "," + start_y
    + "\nA" + radius + "," + radius + " 0 0,0 " + end_x + "," + end_y + "\nz";

  var path = $(createSvg("path"))
    .attr("id",id)
    .attr("partner_id", partner_id)
    .attr("d", pathStr)
    .attr("fill",color)
    .attr("stroke","black")
    .attr("fill-opacity", ".5");
  svg.append(path);
}

function fill_quadrant_unknown(svg, quadrant, id, partner_id, x, y, color) {

  var center_x = x; var center_y = y;
  var start_x = x+unit/2; var start_y = y;
  var end_x = x; var end_y = y - unit/2;
  var radius = unit/2;

  if (quadrant == 1) {
    start_x = x+unit/2; var start_y = y;
    end_x = x; var end_y = y - unit/2;
  } else if (quadrant == 2) {
    start_x = x; var start_y = y - unit/2;
    end_x = x-unit/2; var end_y = y;
  } else if (quadrant == 3) {
    start_x = x-unit/2; var start_y = y;
    end_x = x; var end_y = y + unit/2;
  } else if (quadrant == 4) {
    start_x = x; var start_y = y + unit/2;
    end_x = x + unit/2; var end_y = y;
  }
  pathStr = "M" + center_x + "," + center_y + " L" + start_x + "," + start_y
    + " L" + end_x + "," + end_y + " z";

  var path = $(createSvg("path"))
    .attr("id",id)
    .attr("partner_id", partner_id)
    .attr("d", pathStr)
    .attr("fill",color)
    .attr("stroke","black")
    .attr("fill-opacity", ".5");
  svg.append(path);
}


function draw_miscarriage(svg, id, location, generation, gender) {
  var x = ((offset+location)*space);
  if (gender != "male") x = x+2*unit;

  var y = (max_generation - generation)*vertical;

  var color = "yellow";
  if (id == "Unknown") color = "white";
  var has_parent = false;
  if (data["people"][id] && data["people"][id]["father"]) has_parent = true;
  if (data["people"][id] && data["people"][id]["mother"]) has_parent = true;

  var points = "";
  points += (x) + "," + (y-unit/2) + " ";
  points += (x+unit/2) + "," + (y) + " ";
  points += (x-unit/2) + "," + (y);

  var polygon = $(createSvg("polygon"))
    .attr("id",id)
    .attr("points", points)
    .attr("stroke","black")
    .attr("fill",color);
  svg.append(polygon);
  polygon.on("click", function (e) { sayHi(e)});
  if (id && id != "Unknown" && has_parent) {
    var line = $(createSvg("line"))
      .attr("id", id)
      .attr("x1",x).attr("y1",y-unit/2)
      .attr("x2",x).attr("y2",y-unit)
      .attr("stroke","black");
    svg.append(line);
  }
}


function draw_adopted(svg, gender, location, generation) {
  var x;
  if (gender == "female") x = ((offset+location)*space)+2*unit;
  else x = ((offset+location)*space);

  var y = (max_generation - generation)*vertical;

  var l_x1 = x - unit/2 + unit/10; var l_y1 = y - unit/2 - unit/10;
  var l_x2 = x - unit/2 - unit/10; var l_y2 = y - unit/2 - unit/10;
  var l_x3 = x - unit/2 - unit/10; var l_y3 = y + unit/2 + unit/10;
  var l_x4 = x - unit/2 + unit/10; var l_y4 = y + unit/2 + unit/10;

  var r_x1 = x + unit/2 - unit/10; var r_y1 = y - unit/2 - unit/10;
  var r_x2 = x + unit/2 + unit/10; var r_y2 = y - unit/2 - unit/10;
  var r_x3 = x + unit/2 + unit/10; var r_y3 = y + unit/2 + unit/10;
  var r_x4 = x + unit/2 - unit/10; var r_y4 = y + unit/2 + unit/10;

  var left_str = l_x1 + "," + l_y1 + " " + l_x2 + "," + l_y2 + " " + l_x3 + "," + l_y3 + " " + l_x4 + "," + l_y4;
  var right_str = r_x1 + "," + r_y1 + " " + r_x2 + "," + r_y2 + " " + r_x3 + "," + r_y3 + " " + r_x4 + "," + r_y4;

  var polyline_left = $(createSvg("polyline"))
    .attr("points", left_str)
    .attr("stroke","black")
    .attr("fill","none");
  svg.append(polyline_left);
  var polyline_right = $(createSvg("polyline"))
    .attr("points", right_str)
    .attr("stroke","black")
    .attr("fill","none");
  svg.append(polyline_right);

}


function draw_link(svg, male_id, female_id, location, generation) {
  var x = (offset+location)*space+unit;
  var y = (max_generation - generation)*vertical;

  var x1 = x - unit/2;
  var x2 = x + unit/2;
  var y1 = y;
  var y2 = y;


  var line = $(createSvg("line"))
    .attr("male_id",male_id)
    .attr("female_id",female_id)
    .attr("type","connector")
    .attr("x1",x1).attr("y1",y1)
    .attr("x2",x2).attr("y2",y2)
    .attr("stroke","black");
  svg.append(line);
  var line = $(createSvg("line"))
    .attr("male_id",male_id)
    .attr("female_id",female_id)
    .attr("type","link")
    .attr("x1",x).attr("y1",y)
    .attr("x2",x).attr("y2",y+vertical-unit)
    .attr("stroke","black");
  svg.append(line);

}

function draw_paternal_long_link(svg, nonblood_location, blood_location, generation) {
  var x_nonblood = (offset+nonblood_location)*space+unit;
  var x_blood = (offset+blood_location)*space+unit;
  var y = (max_generation - generation)*vertical;

  var x1 = x_nonblood + unit + unit/2;
  var x2 = x_blood - unit - unit/2;
  var y1 = y;
  var y2 = y;


  var line = $(createSvg("line"))
    .attr("x1",x1).attr("y1",y1)
    .attr("x2",x2).attr("y2",y2)
    .attr("stroke","black");
  svg.append(line);
  var line = $(createSvg("line"))
    .attr("x1",x_nonblood+(2*unit)).attr("y1",y)
    .attr("x2",x_nonblood+(2*unit)).attr("y2",y+vertical-unit)
    .attr("stroke","black");
  svg.append(line);

}

function draw_maternal_long_link(svg, nonblood_location, blood_location, generation) {
  var x_nonblood = (offset+nonblood_location)*space+unit;
  var x_blood = (offset+blood_location)*space+unit;
  var y = (max_generation - generation)*vertical;

  var x1 = x_nonblood - unit - unit/2;
  var x2 = x_blood + unit + unit/2;
  var y1 = y;
  var y2 = y;


  var line = $(createSvg("line"))
    .attr("x1",x1).attr("y1",y1)
    .attr("x2",x2).attr("y2",y2)
    .attr("stroke","black");
  svg.append(line);
  var line = $(createSvg("line"))
    .attr("x1",x_nonblood-(2*unit)).attr("y1",y)
    .attr("x2",x_nonblood-(2*unit)).attr("y2",y+vertical-unit)
    .attr("stroke","black");
  svg.append(line);

}

function draw_connector(svg, id, partner_id, father_id, mother_id, x1, y1, x2, y2) {
  var line = $(createSvg("line"))
    .attr("child_id", id)
    .attr("partner_child_id", partner_id)
    .attr("father_id", father_id)
    .attr("mother_id", mother_id)
    .attr("x1",x1).attr("y1",y1)
    .attr("x1",x1).attr("y1",y1)
    .attr("x2",x2).attr("y2",y2)
    .attr("stroke","black");
  svg.append(line);

}

function connect_to_parent(svg, id, gender, offset, generation, location) {
  // Protects against the non-real people
  if (!data["people"][id]) return;

  if (gender == "Male") gender_offset = 0;
  else gender_offset = 2*unit;

  var parental_pedigree = null;
  var father_id = data["people"][id]["father"];
  var mother_id = data["people"][id]["mother"];

  // Need partner to keep connection with their parents
  var partner_id = null;
  if (data["people"][id]["partners"]) partner_id = data["people"][id]["partners"][0];

  var parent_id;
  // Will Have to Go Back to determine Half-Siblings connection
  if (father_id == "Unknown") {
    console.log("Father Unknown");
    var mother_pedigree = data['people'][mother_id]['pedigree'];
    var nonblood_pedigree = find_last_child_pedigree(mother_id);
    var nonblood_location = nonblood_pedigree["location"];

    console.log(location + "," + nonblood_location);
    draw_connector(svg, id, partner_id, null, mother_id, (location+offset)*space+gender_offset, (max_generation-generation)*vertical-unit,
                        (nonblood_location+offset)*space-unit,(max_generation-generation)*vertical-unit);

  } else if (mother_id == "Unknown") {
    console.log("Mother Unknown");
    var father_pedigree = data['people'][father_id]['pedigree'];
    var nonblood_pedigree = find_last_child_pedigree(father_id);
    var nonblood_location = nonblood_pedigree["location"];

    console.log(location + "," + nonblood_location);
    draw_connector(svg, id, partner_id, father_id, null, (location+offset)*space+gender_offset, (max_generation-generation)*vertical-unit,
                        (nonblood_location+offset)*space+(3*unit), (max_generation-generation)*vertical-unit);

  } else if (father_id && data['people'][father_id]['pedigree']) {
    parental_pedigree = data['people'][father_id]['pedigree'];
  } else if (mother_id && data['people'][mother_id]['pedigree']) {
    parental_pedigree = data['people'][mother_id]['pedigree'];
  }

  if (parental_pedigree) {
    var parental_parent_location = parental_pedigree["location"];
    draw_connector(svg, id, partner_id, father_id, mother_id, (location+offset)*space+gender_offset, (max_generation-generation)*vertical-unit,
                        (parental_parent_location+offset)*space+unit,(max_generation-generation)*vertical-unit);
  }
}

function draw_proband_arrow (svg, offset) {

  var proband_center_y = vertical * (max_generation-3); // Always 3rd generation
  var proband_center_x = offset * space;

  var points = "";

  var proband_id = data["proband"];
  var gender = data["people"][proband_id]["demographics"]["gender"];
  if (gender == "Male") {
    points += (proband_center_x - unit/2) + "," + (proband_center_y) + " ";
    points += (proband_center_x-unit/2-unit/4) + "," + (proband_center_y-unit/8) + " ";
    points += (proband_center_x-unit/2-unit/4) + "," + (proband_center_y+unit/8);
    x1 = (proband_center_x - unit/2);
    x2 = (proband_center_x - unit);
  } else {
    points += (proband_center_x + 2*unit + unit/2) + "," + (proband_center_y) + " ";
    points += (proband_center_x + 2*unit + unit/2+unit/4) + "," + (proband_center_y-unit/8) + " ";
    points += (proband_center_x + 2*unit + unit/2+unit/4) + "," + (proband_center_y+unit/8);

//    points += (proband_center_x + unit*2+unit/2) + "," + (proband_center_y+unit/4) + " ";
//    points += (proband_center_x + unit*2+unit/2+unit/4) + "," + (proband_center_y+unit/4) + " ";
//    points += (proband_center_x + unit*2+unit/2) + "," + (proband_center_y+unit/2);
    x1 = (proband_center_x + 3*unit);
    x2 = (proband_center_x + 2*unit + unit/2);
  }

  var polygon = $(createSvg("polygon"))
    .attr("id", proband_id)
    .attr("points", points)
    .attr("proband_id",proband_id)
    .attr("stroke","black")
    .attr("fill","black");
  svg.append(polygon);

  var line = $(createSvg("line"))
    .attr("id", proband_id)
    .attr("x1",x1).attr("y1",proband_center_y)
    .attr("x2",x2).attr("y2",proband_center_y)
    .attr("proband_id",proband_id)
    .attr("stroke","black");
  svg.append(line);

}
///////////////////////////////////////////////////////////////////////////////

function find_last_child_pedigree(parent_id) {
  var children = find_children(parent_id);
  var num_children = children.length;
  if (num_children > 0) {
    var pedigree = data["people"][children[num_children-1]]["pedigree"];
    if (!pedigree) console.log ("Missing Pedigree:" + children[num_children-1]);
    return pedigree;
  } else {
    return 0;
  }
}

function find_first_child_pedigree(parent_id) {
  var children = find_children(parent_id);
  var num_children = children.length;
  if (num_children && num_children > 0) {
    var pedigree = data["people"][children[0]]["pedigree"];
    return pedigree;
  } else {
    return 0;
  }
}

function find_great_grandparents() {
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var pp = data["people"][father_id]["father"];
  var pm = data["people"][father_id]["mother"];
  var mp = data["people"][mother_id]["father"];
  var mm = data["people"][mother_id]["mother"];

  var great_grandparents = {};
  if (data["people"][pp]["father"]) great_grandparents['ppp'] = data["people"][pp]["father"];
  if (data["people"][pp]["mother"]) great_grandparents['ppm'] = data["people"][pp]["mother"];
  if (data["people"][pm]["father"]) great_grandparents['pmp'] = data["people"][pm]["father"];
  if (data["people"][pm]["mother"]) great_grandparents['pmm'] = data["people"][pm]["mother"];

  if (data["people"][mp]["father"]) great_grandparents['mpp'] = data["people"][mp]["father"];
  if (data["people"][mp]["mother"]) great_grandparents['mpm'] = data["people"][mp]["mother"];
  if (data["people"][mm]["father"]) great_grandparents['mmp'] = data["people"][mm]["father"];
  if (data["people"][mm]["mother"]) great_grandparents['mmm'] = data["people"][mm]["mother"];

  return great_grandparents;
}

///  Locations in the Peigree Functions

// This generation has no children so spacing is easy, left of center are sons_children, right is daughters_children,
// should be possible to add brothers and sisters grandchildren

// Below is a recursive function to determine which generation the person is in.
// patriarchs is a list of all the males from the first generation (grandparents?)
function get_generation_of_relative(person_id, patriarchs, generation = 1) {
  var father_id = data['people'][person_id]["father"];
  var mother_id = data['people'][person_id]["mother"];
  if (data['people'][father_id] && data['people'][father_id]['father']) generation = get_generation_of_relative(father_id, patriarchs, generation);
  else if (data['people'][mother_id] && data['people'][mother_id]['father']) generation = get_generation_of_relative(mother_id, patriarchs, generation);
  if (!father_id && !mother_id) return generation;
  else return generation + 1;
}

function set_relatives_location(relatives) {
  $.each(relatives, function(index, person_id) {
    var child_pedigree = find_last_child_pedigree(person_id);
    var num_children = find_children(person_id).length;
    data["people"][person_id]["pedigree"] = [];
    data["people"][person_id]["pedigree"]["generation"] = 3;
    if (child_pedigree) {
      data["people"][person_id]["pedigree"]["location"] = child_pedigree["location"] + 1;
      index_left = child_pedigree["location"];
    } else {
      index_left = index_left - 1;
      data["people"][person_id]["pedigree"]["location"] = index_left;
    }

  });
}

function set_location_grandchildren_generation(grandchildren) {
  var starting_index = -Math.floor(grandchildren.length / 2) - 1;
  console.log (starting_index);

  var ending_index = set_location_general(grandchildren, +1, starting_index, 1);
}

function set_location_children_generation(paternal_cousins_children, older_siblings_children, children, younger_siblings_children, maternal_cousins_children) {

  var index_left = -Math.floor(children.length/2)-1;
  var index_right = -Math.floor(children.length/2)-1;

  index_left = set_location_general(older_siblings_children, -1, index_left, 2);
  index_left = set_location_general(paternal_cousins_children, -1, index_left, 2);

  index_right = set_location_general(children, +1, index_right, 2) ;
  index_right = set_location_general(younger_siblings_children, +1, index_right, 2);
  index_right = set_location_general(maternal_cousins_children, +1, index_right, 2);

}

function set_location_proband_generation(paternal_cousins, paternal_half_siblings, older_siblings, proband_id, younger_siblings, maternal_half_siblings, maternal_cousins) {
  var starting_index = -Math.floor( (older_siblings.length + younger_siblings.length + 1) / 2)
  var index_left = 0;
  var index_right = 0;

  data["people"][proband_id]["pedigree"] = {"location":0,"generation":3};

  index_left = set_location_general(older_siblings, -1, index_left, 3);
  console.log(older_siblings);
  index_left = set_location_general(paternal_half_siblings, -1, index_left, 3);
  index_left = set_location_general(paternal_cousins, -1, index_left, 3);
  console.log(paternal_cousins);
  index_right = set_location_general(younger_siblings, +1, index_right, 3);
  console.log(younger_siblings);
  console.log(index_right);
  index_right = set_location_general(maternal_half_siblings, +1, index_right, 3);
  console.log(index_right);

  index_right = set_location_general(maternal_cousins, +1, index_right, 3);
  console.log(maternal_cousins);
}

function set_location_parents_generation(dads_siblings, dads_extra_partners, father_id, mother_id, moms_extra_partners, moms_siblings) {
  var index_left = 0;
  var index_right = 1;

//  data["people"][father_id]["pedigree"] = {"location":0,"generation":4};
//  data["people"][mother_id]["pedigree"] = {"location":0,"generation":4};


  set_location_individual(father_id, +1, 0, 4);
  set_location_individual(mother_id, +1, 0, 4);

  set_location_general(dads_siblings, -1, index_left, 4);
  console.log(dads_siblings);
  set_location_general(moms_siblings, +1, index_right, 4);
  console.log(moms_siblings);
}


function set_location_grandparents_generation(paternal_grandfather_id, paternal_grandmother_id, maternal_grandfather_id, maternal_grandmother_id) {
//  data["people"][paternal_grandfather_id]["pedigree"] = {"location":-1,"generation":5};
//  data["people"][paternal_grandmother_id]["pedigree"] = {"location":-1,"generation":5};
//  data["people"][maternal_grandfather_id]["pedigree"] = {"location":1,"generation":5};
//  data["people"][maternal_grandmother_id]["pedigree"] = {"location":1,"generation":5};;

  set_location_individual(paternal_grandfather_id, +1, 0, 5);

  set_location_individual(paternal_grandmother_id, +1, 0, 5);
  set_location_individual(maternal_grandfather_id, +1, 0, 5);
  set_location_individual(maternal_grandmother_id, +1, 0, 5);
}

function set_location_great_grandparents_generation(great_grandparents,
  paternal_grandfather_id, paternal_grandmother_id, maternal_grandfather_id, maternal_grandmother_id) {

  // Maximum 8 great grandparents, defined as ppp -> mmm for pop's pop's pop to mom's mom's mom
  $.each(great_grandparents, function (index, person_id){
//    set_location_individual(person_id, +1, 0, 6);  // This will onlyh work when great uncles/aunts are done


// Note half uncles/aunts are not yet done, so alway use grandfather
    if (index == 'ppp') data['people'][person_id]['pedigree'] =
      {'location':data['people'][paternal_grandfather_id]['pedigree']['location']-1, 'generation':6};
    if (index == 'ppm') data['people'][person_id]['pedigree'] =
      {'location':data['people'][paternal_grandfather_id]['pedigree']['location']-1, 'generation':6};
    if (index == 'pmp') data['people'][person_id]['pedigree'] =
      {'location':data['people'][paternal_grandfather_id]['pedigree']['location']+1, 'generation':6};
    if (index == 'pmm') data['people'][person_id]['pedigree'] =
      {'location':data['people'][paternal_grandfather_id]['pedigree']['location']+1, 'generation':6};
    if (index == 'mpp') data['people'][person_id]['pedigree'] =
      {'location':data['people'][maternal_grandfather_id]['pedigree']['location']-1, 'generation':6};
    if (index == 'mpm') data['people'][person_id]['pedigree'] =
      {'location':data['people'][maternal_grandfather_id]['pedigree']['location']-1, 'generation':6};
    if (index == 'mmp') data['people'][person_id]['pedigree'] =
      {'location':data['people'][maternal_grandfather_id]['pedigree']['location']+1, 'generation':6};
    if (index == 'mmm') data['people'][person_id]['pedigree'] =
      {'location':data['people'][maternal_grandfather_id]['pedigree']['location']+1, 'generation':6};
  });


}

function set_location_individual (person_id, direction, starting_index, generation) {
  if (person_id == "579704002") console.log ("HERE");
  var location_index = starting_index;

  var child_pedigree = find_last_child_pedigree(person_id);
  var first_child_pedigree = find_first_child_pedigree(person_id);
  var num_children = find_children(person_id).length;

  data["people"][person_id]["pedigree"] = {};
  data["people"][person_id]["pedigree"]["generation"] = generation;
  if (child_pedigree != null && child_pedigree["location"] != null) {
    if (person_id == "579704001") console.log (location_index);
    if (person_id == "579704002") console.log (location_index);
    location_index = child_pedigree["location"] + direction;
    var new_location = Math.floor( (child_pedigree["location"] + first_child_pedigree["location"]) / 2);
    data["people"][person_id]["pedigree"]["location"] = new_location;

  } else {
    location_index = location_index + direction;
    data["people"][person_id]["pedigree"]["location"] = location_index;
  }
}

function set_location_general(group, direction, starting_index, generation) {
  var location_index = starting_index;

  $.each(group, function(index, person_id){

    var child_pedigree = find_last_child_pedigree(person_id);
    var first_child_pedigree = find_first_child_pedigree(person_id);
    var num_children = find_children(person_id).length;

    data["people"][person_id]["pedigree"] = {};
    data["people"][person_id]["pedigree"]["generation"] = generation;

    if (child_pedigree && child_pedigree["location"] != null) {
      if (direction == -1) location_index = first_child_pedigree["location"] + direction;
      else location_index = child_pedigree["location"];
      var new_location = Math.floor( (child_pedigree["location"] + first_child_pedigree["location"]) / 2);
      if (direction == 1) new_location++; // round up instead of down when on right
      data["people"][person_id]["pedigree"]["location"] = new_location;
//      data["people"][person_id]["pedigree"]["location"] = child_pedigree["location"] - (direction * Math.floor((num_children)/2));
//      data["people"][person_id]["pedigree"]["location"] = child_pedigree["location"];

    } else {
      location_index = location_index + direction ;
      data["people"][person_id]["pedigree"]["location"] = location_index;
    }
  });
  return location_index;
}

function determine_age(id) {
  if (!data['people'][id]) return 0;
  if (!data['people'][id]['demographics']) return 0;

  if (data['people'][id]['demographics']['age']) return data['people'][id]['demographics']['age'];

  if (data['people'][id]['demographics']['birthdate']) {
    var birthdate = new Date(data['people'][id]['demographics']['birthdate']);
    console.log(birthdate);
    var age = calculate_age(birthdate);
    return age;
  }

  if (data['people'][id]['demographics']['estimated_age']) {
    var estimated_age = data['people'][id]['demographics']['estimated_age'];
    switch (estimate_age) {
      case "Unknown": return 0;
      case "Pre-Birth": return 0;
      case "Newborn": return 0;
      case "In Infancy": return 0;
      case "In Childhood": return 10;
      case "20-29 Years": return 25;
      case "30-29 Years": return 35;
      case "40-29 Years": return 45;
      case "50-29 Years": return 55;
      case "60 Years or older": return 65;
      default: return 0;
    }
  }
  return 0;
}

// Short function from stackoverflow
function calculate_age(birthday) { // birthday is a date
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Comparing two arrays to see if anything in one is in the other
function has_disease(diseases_to_show, id) {
  if (!data["people"][id]) return false;
  var diseases = data["people"][id]["diseases"];

  var has_disease = false;
  if (diseases) {
    $.each(diseases, function (disease, details) {
      var code = details["code"];
      if (diseases_to_show.includes(code)) {
        has_disease = true;
      }
    });
  }

  return has_disease;
}

// Below function needed for svg to work.
function createSvg(tagName) {
    return document.createElementNS("http://www.w3.org/2000/svg", tagName);
}

function sayHi(e) {
  var id = e.target.attributes.id.value;
  alert(id + "\n" + JSON.stringify(data["people"][id], null, 2));
  console.log(id);
  console.log(data["people"][id]);
}

function start_dragging(e) {
  target = e.target;

  var id = e.target.attributes.id.value;

  if (id && id != "Unknown") {
    dragging = true;
    page_x = e.pageX;
    page_y = e.pageY;
    original_x = e.pageX;
    original_y = e.pageY;

    // Move to the front
//    $(e.target).appendTo("#svg");
    // Also move all associated graphics to front as well, this includes
    // Adopted, deceased, and Quadrant information
    $('*[id*=' + id + ']').each(function() {
      $(this).appendTo("#svg");
    });
  }

}

function drag_object(e) {
  var diff_x = page_x - e.pageX;
  var diff_y = page_y - e.pageY;
  page_x = e.pageX;
  page_y = e.pageY;
  var id = target.attributes.id.value;
  var obj = $(target);

// First you move the shape representing the person, this also moves the text under the person,
// It also moves all other objects associated with the person including proband arrow and quadrants
  $('*[id*=' + id + ']').each(function() {
    move_object(this, diff_x, diff_y);
  });

  // Then you move the partner of the person
  $('*[partner_id*=' + id + ']').each(function() {
    move_object(this, diff_x, diff_y);
  });

  // The the link between the couple
  $('*[male_id*=' + id + ']').each(function() {
    move_link(this, diff_x, diff_y);
  });
  $('*[female_id*=' + id + ']').each(function() {
    move_link(this, diff_x, diff_y);
  });

  // Now resize the link to the parent if there is done
  $('*[child_id*=' + id + ']').each(function() {
    resize_link_child(this, diff_x, diff_y);
  });
  $('*[partner_child_id*=' + id + ']').each(function() {
    resize_link_child(this, diff_x, diff_y);
  });
  $('*[father_id*=' + id + ']').each(function() {
    resize_link_parent(this, diff_x, diff_y);
  });
  $('*[mother_id*=' + id + ']').each(function() {
    resize_link_parent(this, diff_x, diff_y);
  });


}

function move_object(obj, diff_x, diff_y) {
  if (obj.tagName == "rect") move_rect(obj, diff_x, diff_y);
  if (obj.tagName == "circle") move_circle(obj, diff_x, diff_y);
  if (obj.tagName == "polygon") move_poly(obj, diff_x, diff_y);
  if (obj.tagName == "path") move_path(obj, diff_x, diff_y);
  else if (obj.tagName == "line") move_line(obj, diff_x, diff_y);
  else if (obj.tagName == "text") move_text(obj, diff_x, diff_y);
}

function move_rect(obj, diff_x, diff_y) {
  var current_x = $(obj).attr("x");
  var new_x = current_x - diff_x;
  $(obj).attr("x", new_x);
}

function move_poly(obj, diff_x, diff_y) {
  var current_points_str = $(obj).attr("points");
  var current_points = current_points_str.split(" ");

  var new_points = "";
  $.each(current_points, function (index, point) {
    [x, y] = point.split(",");
    var new_x = parseInt(x)-parseInt(diff_x);
    var new_point = new_x + "," + y + " ";
    if (Number.isInteger(new_x) ) new_points += new_point;
  });
  $(obj).attr("points", new_points);
}

function move_path(obj, diff_x, diff_y) {
  var current_path_str = $(obj).attr("d");
  var current_path = current_path_str.split("\n");

  var new_path = "";
  $.each(current_path, function (index, point) {
    if (point[0] == "M") {
      [x, y] = point.substring(1).split(",");
      var new_x = parseInt(x)-parseInt(diff_x);
      var new_point = "M" + new_x + "," + y + "\n";
      if (Number.isInteger(new_x) ) new_path += new_point;
    } else if (point[0] == "L") {
      [x, y] = point.substring(1).split(",");
      var new_x = parseInt(x)-parseInt(diff_x);
      var new_point = "L" + new_x + "," + y + "\n";
      if (Number.isInteger(new_x) ) new_path += new_point;
    } else if (point[0] == "A") {
      end_point = point.split(" ");
      [x, y] = end_point[3].split(",");
      var new_x = parseInt(x)-parseInt(diff_x);
      if (Number.isInteger(new_x) )
        new_path += end_point[0] + " " + end_point[1] + " " + end_point[2] + " " + new_x + "," + y + "\n";
    } else if ((point[0] == "z")) {
      new_path += "z";
    }
    $(obj).attr("d", new_path);
  });

}

function move_line(obj, diff_x, diff_y) {
  var current_x1 = $(obj).attr("x1");
  var current_x2 = $(obj).attr("x2");

  var new_x1 = current_x1 - diff_x;
  var new_x2 = current_x2 - diff_x;
  $(obj).attr("x1", new_x1);
  $(obj).attr("x2", new_x2);
}


function move_circle(obj, diff_x, diff_y) {
  var current_x = $(obj).attr("cx");
  var new_x = current_x - diff_x;
  $(obj).attr("cx", new_x);
}

function move_text(obj, diff_x, diff_y) {
  var current_x = $(obj).attr("x");
  var new_x = current_x - diff_x;
  $(obj).attr("x", new_x);

}

function move_link(obj, diff_x, diff_y) {
  if ($(obj).attr("type") == "connector") {
    var current_x1 = $(obj).attr("x1");
    var new_x1 = current_x1 - diff_x;
    var current_x2 = $(obj).attr("x2");
    var new_x2 = current_x2 - diff_x;
    $(obj).attr("x1", new_x1);
    $(obj).attr("x2", new_x2);
  } else if ($(obj).attr("type") == "link") {
    var current_x = $(obj).attr("x1");
    var new_x = current_x - diff_x;
    $(obj).attr("x1", new_x);
    $(obj).attr("x2", new_x);
  }

}

function resize_link_child(obj, diff_x, diff_y) {
  var current_x1 = $(obj).attr("x1");
  var new_x1 = current_x1 - diff_x;
  $(obj).attr("x1", new_x1);
}

function resize_link_parent(obj, diff_x, diff_y) {
  var current_x2 = $(obj).attr("x2");
  var new_x2 = current_x2 - diff_x;
  $(obj).attr("x2", new_x2);
}

function stop_dragging(e) {
  dragging = false;
  target = null;
}

// From https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function diff_years(dt2, dt1) {
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60 * 24);
  return Math.abs(Math.floor(diff/365.25));
}

function getFirstLetters(str) {
  const firstLetters = str
    .split(' ')
    .map(word => word[0])
    .join('');

  return firstLetters;
}
