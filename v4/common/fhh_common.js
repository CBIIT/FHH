// General function to figure out someone's age
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
}

// We need a function to remove all placeholder people from a list and return that list
function remove_placeholders(list) {
  var new_list = [];
  $.each(list, function(index, person_id) {
    if (data['people'][person_id] && !data['people'][person_id]["placeholder"]) new_list.push(person_id);
  });
  return new_list;
}


// Sometimes we need to find siblings, in which case we want to remove the person_being_checked
function find_children(parent_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details){
    if (details['father'] == parent_id || details['mother'] == parent_id) {
      if (person_id != exception_id) children.push(person_id);
    }
  });
  sort_people_by_age_name_id(children);

  return children;
}

function find_all_partners(person_id) {
  var partners = [];

  var children = find_children(person_id);
  $.each(children, function(index, child_id) {
    var mother = data['people'][child_id]['mother'];
    var father = data['people'][child_id]['father'];
    if (mother != person_id && $.inArray(mother, partners) == -1) partners.push(mother);
    if (father != person_id && $.inArray(father, partners) == -1) partners.push(father);
  });

  return partners;
}

function find_sons_from_one_parent(parent_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details){
    if (details['father'] == parent_id || details['mother'] == parent_id) {
      if (data["people"][person_id] && data["people"][person_id]["demographics"]["gender"] == "Male" && person_id != exception_id) children.push(person_id);
    }
  });
  return children;
}

function find_children_from_one_parent(parent_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details){
    if (details['father'] == parent_id || details['mother'] == parent_id) {
      if (person_id != exception_id) children.push(person_id);
    }
  });
  return children;
}

function find_full_sons(father_id, mother_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['father'] == father_id && details['mother'] == mother_id) {
      if (data["people"][person_id] && data["people"][person_id]["demographics"]["gender"] == "Male" && person_id != exception_id ) children.push(person_id);
    }
  });
  return children;
}

function find_full_siblings(father_id, mother_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['father'] == father_id && details['mother'] == mother_id) {
      if (person_id != exception_id ) children.push(person_id);
    }
  });
  return children;
}

function find_older_siblings(father_id, mother_id, proband_id) {
  var proband_age = determine_age(proband_id);

  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['father'] == father_id && details['mother'] == mother_id) {
      if (person_id != proband_id) {
        // If age of anyone is 0 then skip age check and goto name
        if (determine_age(person_id) && proband_age && determine_age(person_id) > proband_age) children.push(person_id);
        else {
          // Tiebreaker is name
          if (details['name'] && data['people'][proband_id]['name']) {
            var compare = details['name'] > data['people'][proband_id]['name'];
            if (!compare)  children.push(person_id);
          } else {
            // final tiebreaker is ID
            if (person_id > proband_id) children.push(person_id);
          }
        }
      }
    }
  });
  return children;
}

function find_younger_siblings(father_id, mother_id, proband_id) {
  var proband_age = determine_age(proband_id);

  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['father'] == father_id && details['mother'] == mother_id) {
      if (determine_age(person_id) < proband_age) children.push(person_id); // Note twins will always be here
    }
  });
  return children;
}

function subtract_array (minuend, subtrahend) {
  var difference = [];
  $.each(minuend, function (index, element) {
    if (!subtrahend.includes(element)) difference.push(element);
  });
  return difference;
}

function find_paternal_half_siblings(father_id, mother_id) {
  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['father'] == father_id && (!details['mother'] || details['mother'] != mother_id) )  { children.push(person_id); }
  });
  return children;
}

function find_maternal_half_siblings(father_id, mother_id) {
  var children = [];
  $.each(data['people'], function(person_id, details) {
    if (details['mother'] == mother_id && (!details['father'] || details['father'] != father_id) )  { children.push(person_id); }
  });
  return children;
}

function find_dads_extra_partners(father_id) {
  var extra_partners = [];
  if (data["people"][father_id]["partners"] && data["people"][father_id]["partners"].length > 1) {
    $.each (data["people"][father_id]["partners"], function (index, person_id) {
      if (index > 0) {
        extra_partners.push(person_id);
      }
    });
  }
  return extra_partners;
}

function find_moms_extra_partners(mother_id) {
  var extra_partners = [];
  if (data["people"][mother_id]["partners"] && data["people"][mother_id]["partners"].length > 1) {
    $.each (data["people"][mother_id]["partners"], function (index, person_id) {
      if (index > 0) {
        extra_partners.push(person_id);
      }
    });
  }
  return extra_partners;
}

function find_daughters_from_one_parent(parent_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details){
    if (details['father'] == parent_id || details['mother'] == parent_id) {
      if (data["people"][person_id] && data["people"][person_id]["demographics"]["gender"] == "Female" && person_id != exception_id) children.push(person_id);
    }
  });
  return children;
}

function find_full_daughters(father_id, mother_id, exception_id) {
  var children = [];
  $.each(data['people'], function(person_id, details){
    if (details['father'] == father_id && details['mother'] == mother_id) {
      if (data["people"][person_id] && data["people"][person_id]["demographics"]["gender"] == "Female" && person_id != exception_id) children.push(person_id);
    }
  });
  return children;
}

function find_all_children_from_list(list) {
  var children = [];

  // Note: go through list twice, first time is all people with children, then again to ensure the list will have all parents
  $.each(list, function (index, person) {
    var c = find_children(person);

    if (c.length > 0) children = children.concat(c);
    else {
//      children.push("placeholder");
// these lines will create a physical placeholder
      new_person = {};
      new_person['name'] = "Child " + data['people'][person]['name'].split(' ').pop();
      new_person["placeholder"] = true ;

      id = crypto.randomUUID();
      data["people"][id] = new_person;
      if (data['people'][person]["demograpics"] && data['people'][person]["demograpics"]["gender"] == "Male") {
        data["people"][id]["father"] = person;
      } else {
        data["people"][id]["mother"] = person;
      }

      children.push(id);
    }
  });

  return children;
}

function does_person_have_children(potential_parent_id) {
  var has_children = false;
  $.each(data['people'], function(person_id, details){
    if (!details["placeholder"] && (details['father'] == potential_parent_id || details['mother'] == potential_parent_id ) ) {
      has_children = true;
    }
  });
  return has_children;
}

function find_and_set_partners() {
  $.each(data['people'], function(person_id, details){
    if (details['father'] && details['mother']) {
      var father_id = details['father'];
      var mother_id = details['mother'];

      if (father_id && father_id != "Unknown") {
        if (!data['people'][father_id]['partners']) {
          data['people'][father_id]['partners'] = [ mother_id ];
        } else if (data['people'][father_id]['partners'].indexOf(mother_id) === -1) {
          data['people'][father_id]['partners'].push(mother_id);
        }
      }

      if (mother_id && mother_id != "Unknown") {
        if (!data['people'][mother_id]['partners']) {
          data['people'][mother_id]['partners'] = [ father_id ];
        } else if (data['people'][mother_id]['partners'].indexOf(father_id) === -1) {
          data['people'][mother_id]['partners'].push(father_id);
        }
      }
    }
  });
}

function find_and_set_blood_relatives() {
  // Blood Relative shares paternal or maternal maternal_grandfather_id
  var proband_id = data["proband"];
  var father_id = data["people"][proband_id]["father"];
  var mother_id = data["people"][proband_id]["mother"];

  var paternal_grandfather_id = data["people"][father_id]["father"];
  var paternal_grandmother_id = data["people"][father_id]["mother"];
  var maternal_grandfather_id = data["people"][mother_id]["father"];
  var maternal_grandmother_id = data["people"][mother_id]["mother"];

  set_blood_and_check_children(paternal_grandfather_id);
  set_blood_and_check_children(maternal_grandfather_id);

  data["people"][paternal_grandmother_id]["blood"] = true;
  data["people"][maternal_grandmother_id]["blood"] = true;
}

function find_and_set_blood_relatives_for_great_grandparents(great_grandparents) {
  $.each(great_grandparents, function(index, person_id) {
    data["people"][person_id]['blood'] = true;
  });
}

function set_blood_and_check_children(id) {
  data['people'][id]['blood'] = true;

  var children = find_children(id);
  $.each(children, function(index, child){
    set_blood_and_check_children(child);
  });
}

function compare_by_age_name_id(first_person_id, second_person_id) {
    if (first_person_id == second_person_id) return 0;


// First Check Age
    var age_1 = determine_age(data['people'][first_person_id]);
    var age_2 = determine_age(data['people'][second_person_id]);
    if (age_1 > age_2) return 1;
    if (age_1 < age_2) return -1;

// Then check Name alphabetically
    var name_1 = data['people'][first_person_id]['name'];
    var name_2 = data['people'][second_person_id]['name'];
    if (name_1 > name_2) return 1;
    if (name_1 < name_2) return -1;

    if (first_person_id > second_person_id) return 1;
    if (first_person_id < second_person_id) return -1;

    return 0;
}

function sort_people_by_age_name_id (list) {
  list.sort(compare_by_age_name_id);
}
