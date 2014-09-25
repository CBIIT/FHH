
function build_copy_for_family_member_dialog() {
	give_instructions();
	relative_select = create_family_member_select();	
	relative_select.on("change", bind_relative_select_change);
}

function bind_relative_select_change() {
	relative_being_exported = $(this).val();


	// Deep Copy of the information
	
	var my_gender = personal_information.gender 
	
  if (relative_being_exported.substring(0,7) == 'brother') pi = export_brother_or_sister(relative_being_exported, my_gender);
  else if (relative_being_exported.substring(0,6) == 'sister') pi = export_brother_or_sister(relative_being_exported, my_gender);
  else if (relative_being_exported.substring(0,6) == 'father') pi = export_father(relative_being_exported, my_gender);
  else if (relative_being_exported.substring(0,6) == 'mother') pi = export_mother(relative_being_exported, my_gender);
  else if (relative_being_exported.substring(0,3) == 'son') pi = export_son_or_daughter(relative_being_exported, my_gender);
  else if (relative_being_exported.substring(0,8) == 'daughter') pi = export_son_or_daughter(relative_being_exported, my_gender);

	var xml_document = make_export_string(pi);

	$("#export_to_relative").remove();
	var export_button = $("<A id='export_to_relative' class='link-button'>" + $.t("fhh_js.export") + "</A>");
	export_button.on("click", function () {
		$("#copy_for_family_member").empty().dialog("close");
	});
	$("#copy_for_family_member").append("&nbsp;&nbsp;").append(export_button);
	save_document($("#export_to_relative"), xml_document, pi);	
}

function export_brother_or_sister(relative_being_exported, my_gender) {
	var pi = new Object();
	set_personal_information_based_on_relative(pi, personal_information[relative_being_exported]);	
	
	var my_information_as_a_relative = get_personal_information_of_relative (personal_information) ;	

	if (my_gender == 'MALE') my_relationship = 'brother';
	else my_relationship = 'sister';

	var i = 0;
	while (pi[my_relationship + "_" + i] != null) i++;
	
	new_relationship = my_relationship + "_" + i;
	pi[new_relationship] = my_information_as_a_relative;

	move_single_relative(pi, 'paternal_grandfather', 'paternal_grandfather');
	move_single_relative(pi, 'paternal_grandmother', 'paternal_grandmother');
	move_single_relative(pi, 'maternal_grandfather', 'maternal_grandfather');
	move_single_relative(pi, 'maternal_grandmother', 'maternal_grandmother');
	move_single_relative(pi, 'father', 'father');
	move_single_relative(pi, 'mother', 'mother');
	move_relatives(pi, 'brother', 'brother', 'except', relative_being_exported);
	move_relatives(pi, 'sister', 'sister', 'except', relative_being_exported);
	move_relatives(pi, 'paternal_uncle', 'paternal_uncle');
	move_relatives(pi, 'paternal_aunt', 'paternal_aunt');
	move_relatives(pi, 'maternal_uncle', 'maternal_uncle');
	move_relatives(pi, 'maternal_aunt', 'maternal_aunt');
	move_relatives(pi, 'paternal_cousin', 'paternal_cousin');
	move_relatives(pi, 'maternal_cousin', 'maternal_cousin');
	move_relatives(pi, 'grandson', 'grandson');
	move_relatives(pi, 'granddaughter', 'granddaughter');
	move_relatives(pi, 'paternal_halfbrother', 'paternal_halfbrother');
	move_relatives(pi, 'paternal_halfsister', 'paternal_halfsister');
	move_relatives(pi, 'maternal_halfbrother', 'maternal_halfbrother');
	move_relatives(pi, 'maternal_halfsister', 'maternal_halfsister');
	move_relatives(pi, 'nephew', 'nephew');
//	move_relatives(pi, 'niece', 'niece');
	move_nieces_to_daughters_or_nieces(pi,  personal_information[relative_being_exported].id); 
	move_nephews_to_sons_or_nephews(pi,  personal_information[relative_being_exported].id); 
	move_relatives(pi, 'son', 'nephew');
	move_relatives(pi, 'daughter', 'niece');


	
	return pi;	
}

function export_father(relative_being_exported, my_gender) {
	var pi = new Object();
	set_personal_information_based_on_relative(pi, personal_information[relative_being_exported]);	
	
	
	var my_information_as_a_relative = get_personal_information_of_relative (personal_information) ;	

	if (my_gender == 'MALE') my_relationship = 'son';
	else my_relationship = 'daughter';

	var i = 0;
	while (pi[my_relationship + "_" + i] != null) i++;
	
	new_relationship = my_relationship + "_" + i;
	pi[new_relationship] = my_information_as_a_relative;

	move_single_relative(pi, 'paternal_grandfather', 'father');
	move_single_relative(pi, 'paternal_grandmother', 'mother');
	move_relatives(pi, 'brother', 'son');
	move_relatives(pi, 'sister', 'daughter');
	move_relatives(pi, 'paternal_uncle', 'brother');
	move_relatives(pi, 'paternal_aunt', 'sister');
	move_relatives(pi, 'paternal_cousin', 'niece/nephew');
	move_relatives(pi, 'son', 'grandson');
	move_relatives(pi, 'daughter', 'granddaughter');
	move_relatives(pi, 'paternal_halfbrother', 'son');
	move_relatives(pi, 'paternal_halfsister', 'daughter');
	move_relatives(pi, 'nephew', 'grandson');
	move_relatives(pi, 'niece', 'granddaughter');
	
	pi.paternal_grandfather = new Object(); pi.paternal_grandfather.gender = 'MALE';
	pi.paternal_grandmother = new Object(); pi.paternal_grandmother.gender = 'FEMALE';
	pi.maternal_grandfather = new Object(); pi.maternal_grandfather.gender = 'MALE';
	pi.maternal_grandmother = new Object(); pi.maternal_grandmother.gender = 'FEMALE';
	
	return pi;	
}

function export_mother(relative_being_exported, my_gender) {
	var pi = new Object();
	set_personal_information_based_on_relative(pi, personal_information[relative_being_exported]);	
	
	
	var my_information_as_a_relative = get_personal_information_of_relative (personal_information) ;	

	if (my_gender == 'MALE') my_relationship = 'son';
	else my_relationship = 'daughter';

	var i = 0;
	while (pi[my_relationship + "_" + i] != null) i++;
	
	new_relationship = my_relationship + "_" + i;
	pi[new_relationship] = my_information_as_a_relative;

	move_single_relative(pi, 'maternal_grandfather', 'father');
	move_single_relative(pi, 'maternal_grandmother', 'mother');
	move_relatives(pi, 'brother', 'son');
	move_relatives(pi, 'sister', 'daughter');
	move_relatives(pi, 'maternal_uncle', 'brother');
	move_relatives(pi, 'maternal_aunt', 'sister');
	move_relatives(pi, 'maternal_cousin', 'niece/nephew');
	move_relatives(pi, 'son', 'grandson');
	move_relatives(pi, 'daughter', 'granddaughter');
	move_relatives(pi, 'maternal_halfbrother', 'son');
	move_relatives(pi, 'maternal_halfsister', 'daughter');
	move_relatives(pi, 'nephew', 'grandson');
	move_relatives(pi, 'niece', 'granddaughter');


	pi.paternal_grandfather = new Object(); pi.paternal_grandfather.gender = 'MALE';
	pi.paternal_grandmother = new Object(); pi.paternal_grandmother.gender = 'FEMALE';
	pi.maternal_grandfather = new Object(); pi.maternal_grandfather.gender = 'MALE';
	pi.maternal_grandmother = new Object(); pi.maternal_grandmother.gender = 'FEMALE';

	return pi;	
}

function export_son_or_daughter(relative_being_exported, my_gender) {
	var pi = new Object();
	set_personal_information_based_on_relative(pi, personal_information[relative_being_exported]);	
	
	
	var my_information_as_a_relative = get_personal_information_of_relative (personal_information) ;	

	if (my_gender == 'MALE') my_relationship = 'father';
	else my_relationship = 'mother';

// Nephew, Nieces, Aunts, Uncles, Granparents, Cousins all drop off
	if (my_gender == 'MALE') {
		pi.father = my_information_as_a_relative;
		pi.mother = new Object(); pi.mother.gender = 'FEMALE';
		move_single_relative(pi, 'father', 'paternal_grandfather');
		move_single_relative(pi, 'mother', 'paternal_grandmother');
		move_relatives(pi, 'brother', 'paternal_uncle');
		move_relatives(pi, 'sister', 'paternal_aunt');
		move_relatives(pi, 'son', 'brother', 'except', relative_being_exported);
		move_relatives(pi, 'daughter', 'sister', 'except', relative_being_exported);
		move_relatives(pi, 'paternal_halfbrother', 'paternal_uncle');
		move_relatives(pi, 'paternal_halfsister', 'paternal_aunt');

		pi.maternal_grandfather = new Object(); pi.maternal_grandfather.gender = 'MALE';
		pi.maternal_grandmother = new Object(); pi.maternal_grandmother.gender = 'FEMALE';
		
	} else {
		pi.mother = my_information_as_a_relative;
		pi.father = new Object(); pi.mother.gender = 'FEMALE';
		move_single_relative(pi, 'father', 'maternal_grandfather');
		move_single_relative(pi, 'mother', 'maternal_grandmother');
		move_relatives(pi, 'brother', 'maternal_uncle');
		move_relatives(pi, 'sister', 'maternal_aunt');
		move_relatives(pi, 'son', 'brother', 'except', relative_being_exported);
		move_relatives(pi, 'daughter', 'sister', 'except', relative_being_exported);
		move_relatives(pi, 'maternal_halfbrother', 'maternal_uncle');
		move_relatives(pi, 'maternal_halfsister', 'maternal_aunt');

		pi.paternal_grandfather = new Object(); pi.maternal_grandfather.gender = 'MALE';
		pi.paternal_grandmother = new Object(); pi.maternal_grandmother.gender = 'FEMALE';
	}
	
	return pi;	
}

// Special Cases: 
//   For copying siblings, we cannot copy the exported relative as a sibling
//   For brothers/sisters we need to copy nieces/nephews of the exported relative as sons/daughters and sons/daughters become nieces

function move_relatives(pi, from, to, special_type, special_value) {
	var num_to_move = find_first_available_relative_location(pi, to);
	var i = 0;
	while (personal_information[from + "_" + i] != null ) {
		if ( special_type = 'except' && (from + "_" + i) == special_value) {i++; continue;}  // Skip copying the exported sibling
		if (to == 'niece/nephew') {
			if (personal_information[from + "_" + i].gender == 'MALE') {
				pi['nephew' + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));
			} else {
				pi['niece' + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));				
			}
		} else {
			pi[to + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));
		}
		num_to_move = find_first_available_relative_location(pi, to);
		i++;
	}
}

// If nieces are of the exported parent, then we need to move them to daughters else leave them as nieces
function move_nieces_to_daughters_or_nieces(pi, parent_id) {
	var i = 0;
	while (personal_information["niece_" + i] != null ) {
		if (personal_information["niece_" + i].parent_id == parent_id) {
			daughter_num_to_move = find_first_available_relative_location(pi, 'daughter');
			pi['daughter_' + daughter_num_to_move] = JSON.parse(JSON.stringify(personal_information["niece_" + i]));
		} else {
			niece_num_to_move = find_first_available_relative_location(pi, 'niece');
			pi['niece_' + niece_num_to_move] = JSON.parse(JSON.stringify(personal_information["niece_" + i]));
		}
		i++;
	}
}

// If nephews are of the exported parent, then we need to move them to sons else leave them as nephews
function move_nephews_to_sons_or_nephews(pi, parent_id) {
	var i = 0;
	while (personal_information["nephew_" + i] != null ) {
		if (personal_information["nephew_" + i].parent_id == parent_id) {
			son_num_to_move = find_first_available_relative_location(pi, 'son');
			pi['son_' + son_num_to_move] = JSON.parse(JSON.stringify(personal_information["nephew_" + i]));
		} else {
			nephew_num_to_move = find_first_available_relative_location(pi, 'nephew');
			pi['nephew_' + nephew_num_to_move] = JSON.parse(JSON.stringify(personal_information["nephew_" + i]));
		}
		i++;
	}
}
function move_single_relative(pi, from, to) {
		pi[to] = JSON.parse(JSON.stringify(personal_information[from]));
}

function find_first_available_relative_location (pi, relationship) {
	var i=0;
	while (pi[relationship + "_" + i] != null) i++;
	return i;
}

function get_personal_information_of_relative (pi) {
	pi_of_relative = new Object();
	pi_of_relative.id = pi.id;
	pi_of_relative.name = pi.name;
	pi_of_relative.gender = pi.gender;
	pi_of_relative.date_of_birth = pi.date_of_birth;
	pi_of_relative.ethnicity = pi.ethnicity;
	pi_of_relative.race = pi.race;
	pi_of_relative.twin_status = pi.twin_status;
	pi_of_relative.adopted = pi.adopted;
	pi_of_relative["Health History"] = JSON.parse(JSON.stringify(pi["Health History"]));

	return 	pi_of_relative;
}

function set_personal_information_based_on_relative(pi, relative) {
	pi.id = relative.id;
	pi.name = relative.name;
	pi.date_of_birth = relative.date_of_birth;
	pi.gender = relative.gender;
	pi.ethnicity = relative.ethnicity;
	pi.race = relative.race;
	pi.twin_status = relative.twin_status;
	pi.adopted = relative.adopted;
	delete(pi.height);
	delete(pi.height_unit);
	delete(pi.weight);
	delete(pi.weight_unit);
	delete(pi.physically_active);
	
	pi["Health History"] = JSON.parse(JSON.stringify(relative["Health History"]));
}

function make_export_string(pi) {
	doc = document.implementation.createDocument("urn:hl7-org:v3", "FamilyHistory", null);
	var root = doc.createElement("FamilyHistory");
	add_root_information(root);
	root.appendChild(add_personal_history(pi));
	var s = new XMLSerializer();
	var output_string = s.serializeToString(root);
	var filename = "family_health_history.xml";
	if (pi && pi.name) {
		filename = pi.name.replace(/ /g,"_") + "_Health_History.xml";
	} 
	return root;
}

function give_instructions() {
	$("#copy_for_family_member").empty().append("<DIV class='instructions'>" + $.t("fhh_js.export_instructions") + "</DIV><br/>");
	$("#copy_for_family_member").append("<DIV class='instructions'>" + $.t("fhh_js.export_instructions2") + "</DIV><br/>");	
}

function create_family_member_select() {
	$("#copy_for_family_member").append("<LABEL for='choose_a_relative'>" + $.t("fhh_js.choose_relative") + "</LABEL><br /><br />");
	var relative_select = $("<SELECT id='choose_a_relative'></SELECT>");
	relative_select.append("<OPTION>" + $.t("fhh_js.please_select_relative") + " </OPTION>");
	$("#copy_for_family_member").append(relative_select);
	
	$.each(personal_information, function (key, item) {
    var temp = key.substring(0,4);
    if(temp == 'brot' || temp == 'sist' || temp == 'fath' || temp == 'moth' || temp == 'daug' || temp == 'son_') {
    	var relative_name = item.name;
    	relative_select.append("<OPTION value='" + key + "'>" + relative_name + "</OPTION>");
    }
	});
	return relative_select;	
}