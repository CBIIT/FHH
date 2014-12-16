var exported_pi;
var relative_being_exported;

// For IE8 and Safari, we need to use downloadify

//  For downliadify to support Safari and IE downloading
function load_export_downloadify(){
	Downloadify.create('export_downloadify',{
		filename: function(){
			if (exported_pi.name != null || exported_pi.name != "") exported_filename = exported_pi.name + "_Health_History.xml";
			else exported_filename = "Exported_Family_Member_Health_History.xml";
			return exported_filename;
		},
		data: function(){ 
			return make_export_string(exported_pi);
		},
		onComplete: function(){ alert('Your File Has Been Saved!'); },
		onCancel: function(){ alert('You have cancelled the saving of this file.'); },
		onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
		swf: '../downloadify/media/downloadify.swf',
		downloadImage: '../downloadify/images/download2.png',
		width: 105,
		height: 32,
		transparent: true,
		append: false
	});
}

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

	exported_pi = pi; // global to pass data to export
	var xml_document = make_export_string(pi);
	var filename = make_filename(pi);

	var a = document.createElement('a');

	if (typeof a.download != "undefined") {
		$("#export_to_relative").remove();
		$("#export_downloadify").remove();
		// var export_button = $("<A id='export_to_relative' class='link-button'>" + $.t("fhh_js.export") + "</A>");
		var export_button = $("<button id='export_to_relative' >" + $.t("fhh_js.export") + "</button>");
		export_button.on("click", function () {
			$("#copy_for_family_member").empty().dialog("close");
		});
		$("#copy_for_family_member").append("&nbsp;&nbsp;").append(export_button);
		save_document($("#export_to_relative"), xml_document, filename);	
	} else {
		$("#export_to_relative").remove();
		var export_downloadify = $("<P id='export_downloadify'>" + $.t("fhh_js.export") + "</P>");
		$("#copy_for_family_member").append("&nbsp;&nbsp;").append(export_downloadify);
		load_export_downloadify();
	}

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
	move_relatives(pi, 'paternal_halfbrother', 'paternal_halfbrother');
	move_relatives(pi, 'paternal_halfsister', 'paternal_halfsister');
	move_relatives(pi, 'maternal_halfbrother', 'maternal_halfbrother');
	move_relatives(pi, 'maternal_halfsister', 'maternal_halfsister');
//	move_relatives(pi, 'nephew', 'nephew');
//	move_relatives(pi, 'niece', 'niece');
	move_nieces_to_daughters_or_nieces(pi,  personal_information[relative_being_exported].id); 
	move_nephews_to_sons_or_nephews(pi,  personal_information[relative_being_exported].id); 
	move_relatives(pi, 'son', 'nephew', 'add_parent_id', my_information_as_a_relative.id);
	move_relatives(pi, 'daughter', 'niece', 'add_parent_id', my_information_as_a_relative.id);
	
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
	move_relatives(pi, 'son', 'grandson', 'add_parent_id', my_information_as_a_relative.id);
	move_relatives(pi, 'daughter', 'granddaughter', 'add_parent_id', my_information_as_a_relative.id);
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
	move_relatives(pi, 'son', 'grandson','add_parent_id', my_information_as_a_relative.id);
	move_relatives(pi, 'daughter', 'granddaughter', 'add_parent_id', my_information_as_a_relative.id);
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

		move_relatives(pi, 'grandson', 'niece/nephew', 'except_descendants', pi.id);
		move_relatives(pi, 'granddaughter', 'niece/nephew', 'except_descendants', pi.id);
		move_relatives(pi, 'grandson', 'son', 'only_descendants', pi.id);
		move_relatives(pi, 'granddaughter', 'daughter', 'only_descendants', pi.id);
		
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

		move_relatives(pi, 'grandson', 'niece/nephew', 'except_descendants', pi.id);
		move_relatives(pi, 'granddaughter', 'niece/nephew', 'except_descendants', pi.id);
		move_relatives(pi, 'grandson', 'son', 'only_descendants', pi.id);
		move_relatives(pi, 'granddaughter', 'daughter', 'only_descendants', pi.id);

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
		if ( special_type == 'except' && (from + "_" + i) == special_value) {i++; continue;}  // Skip copying the exported sibling
		if ( special_type == 'except_descendants' && personal_information[from + "_" + i].parent_id == special_value) {
			i++; continue;
		}
		if ( special_type == 'only_descendants' && personal_information[from + "_" + i].parent_id != special_value) {
			i++; continue;
		}
		if ( special_type == 'only_if_parent_moved' && !is_parent_in_new_pedigree(personal_information[from + "_" + i].parent_id) ) {
			i++; continue;
		}
		
		// Because half-siblings have nieces and nephews that should not move if their parent 
		// is not part of the move we need to exclude them
		if (to == 'grandson' || to == 'granddaughter') {
			var parent_id = personal_information[from + '_' + i].parent_id;
			if (!is_in_new_pedigree_as_child(pi, parent_id)&& parent_id != null) {
				i++; continue;
			}
		}		
		if (to == 'niece/nephew') {
			if (personal_information[from + "_" + i].gender == 'MALE') {
				pi['nephew' + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));
			} else {
				pi['niece' + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));				
			}
		} else {
			pi[to + '_' + num_to_move] = JSON.parse(JSON.stringify(personal_information[from + '_' + i]));
		}



	// Adds Id of proband as parents of his children
		if (special_type == 'add_parent_id') {
			pi[to + "_" + num_to_move].parent_id = special_value;
		}
		
		
		num_to_move = find_first_available_relative_location(pi, to);
		i++;
	}
}
// Special function that checks to see if an id is already in the new pedigree as son or daughter
function is_in_new_pedigree_as_child(pi, id_to_check) {
	var i = 0;
	while (pi["son_" + i] != null ) {
		if (pi["son_" + i].id == id_to_check) return true;
		i++;
	}
	i=0;
	while (pi["daughter_" + i] != null ) {
		if (pi["daughter_" + i].id == id_to_check) return true;
		i++;
	}
	return false;
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
	if (pi['Health History'] != null) pi_of_relative['Health History'] = JSON.parse(JSON.stringify(pi['Health History']));

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
	
	if (relative['Health History'] != null) pi['Health History'] = JSON.parse(JSON.stringify(relative['Health History']));
}

function make_export_string(pi) {
//	doc = document.implementation.createDocument("urn:hl7-org:v3", "FamilyHistory", null);
	var root = doc.createElement("FamilyHistory");
	add_root_information(root);
	root.appendChild(add_personal_history(pi));
	
	var str = serializeXmlNode(root)
	return(str);
}

function make_filename(pi) {
	var filename = "family_health_history.xml";
	if (pi && pi.name) {
		filename = pi.name.replace(/ /g,"_") + "_Health_History.xml";
	} 
	return filename	
}

function give_instructions() {
	$("#copy_for_family_member").empty().append($("<TABLE>")
			.append($("<TR>")
				.append("<TD rowspan='2' style='padding:5px;'><IMG src='../images/export_xml.gif' alt='Export Picture'></IMG></TD>"
							+ "<TD class='instructions'style='padding:5px;'>" + $.t("fhh_js.export_instructions") + "</TD>"))
			.append($("<TR>")
				.append("<TD class='instructions' style='padding:5px;'>" + $.t("fhh_js.export_instructions2") + "</TD>"))
			.append($("<TR>")
				.append("<TD class='instructions' style='padding:5px;' colspan='2'>" + $.t("fhh_js.export_instructions3") + "</TD>")));	
}

function create_family_member_select() {
	$("#copy_for_family_member").append("<LABEL for='choose_a_relative'>" + $.t("fhh_js.choose_relative") + "</LABEL>:&nbsp;&nbsp;");
	var relative_select = $("<SELECT id='choose_a_relative'></SELECT>");
	relative_select.append("<OPTION>" + $.t("fhh_js.please_select_relative") + " </OPTION>");
	$("#copy_for_family_member").append(relative_select);
	
	$.each(personal_information, function (key, item) {
    var temp = key.substring(0,4);
    if(temp == 'brot' || temp == 'sist' || temp == 'fath' || temp == 'moth' || temp == 'daug' || temp == 'son_') {
    	var relative_name = item.name;
    	if (relative_name == null || relative_name == "") relative_name = $.t("fhh_js." + get_relationship_from_relationship_id(key));
    	relative_select.append("<OPTION value='" + key + "'>" + relative_name + "</OPTION>");
    }
	});
	return relative_select;	
}