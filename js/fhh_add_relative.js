// These functions support the 'Add Another Family Member' Dialog

function bind_add_another_family_member_button_action() {
	var new_family_member_dialog;
	if ($("#new_family_member_dialog").length == 0) {
		new_family_member_dialog = $("<div id='new_family_member_dialog'>");
		new_family_member_dialog.dialog({
			position:['middle',0],
			title:$.t("fhh_js.define_family_relationship_dialog_title"),
			height:'auto',
			width:500
		});
	} else {
		new_family_member_dialog = $("#new_family_member_dialog");
		new_family_member_dialog.empty().dialog("open");
	}

	add_new_family_member_instructions(new_family_member_dialog);
	var new_family_member_select = add_new_family_member_select();	

	new_family_member_select.on("change", new_family_member_relationship_selection_change_action);
	new_family_member_dialog.append(new_family_member_select);
	return new_family_member_dialog;
}



function add_new_family_member_select() {
	var new_family_member_select = 
	$("<SELECT id='new_family_member_relationship' name='new_family_member_relationship'>")
		.append("<OPTION value=''> " + $.t("fhh_js.select_relationship") + " </OPTION>")
		.append("<OPTION value='aunt'> " + $.t("fhh_js.aunt") + " </OPTION>")
		.append("<OPTION value='uncle'> " + $.t("fhh_js.uncle") + " </OPTION>")
		.append("<OPTION value='daughter'> " + $.t("fhh_js.daughter") + " </OPTION>")
		.append("<OPTION value='son'> " + $.t("fhh_js.son") + " </OPTION>")
		.append("<OPTION value='brother'> " + $.t("fhh_js.brother") + " </OPTION>")
		.append("<OPTION value='sister'> " + $.t("fhh_js.sister") + " </OPTION>")
		.append("<OPTION value='halfsister'> " + $.t("fhh_js.half_sister") + " </OPTION>")
		.append("<OPTION value='halfbrother'> " + $.t("fhh_js.half_brother") + " </OPTION>");
		
	if (any_relatives(personal_information, 'maternal_aunt') || any_relatives(personal_information, 'maternal_uncle')
			|| any_relatives(personal_information, 'paternal_aunt') || any_relatives(personal_information,'paternal_uncle')) { 
		new_family_member_select.append("<OPTION value='cousin'> " + $.t("fhh_js.cousin") + " </OPTION>");
	}

	if (personal_information.brother_0 != null || personal_information.sister_0 != null) { 
		new_family_member_select
			.append("<OPTION value='niece'> " + $.t("fhh_js.niece") + " </OPTION>")
			.append("<OPTION value='nephew'> " + $.t("fhh_js.nephew") + " </OPTION>");
	}
		
	if (personal_information.son_0 != null || personal_information.daughter_0 != null) { 
		new_family_member_select
			.append("<OPTION value='granddaughter'> " + $.t("fhh_js.granddaughter") + " </OPTION>")
			.append("<OPTION value='grandson'> " + $.t("fhh_js.grandson") + " </OPTION>")
	}
	
	return new_family_member_select;
}

function add_new_family_member_instructions(new_family_member_dialog) {
	new_family_member_dialog.append("<h3> " + $.t("fhh_js.add_relative_title") + " </h3>");
	new_family_member_dialog.append("<P class='instructions'>" + $.t("fhh_js.add_relative_para") + "</P>");
	new_family_member_dialog.append("<label for='new_family_member_relationship'> " + $.t("fhh_js.relationship_to_me") + " </label>");	
}

function new_family_member_relationship_selection_change_action() {
	
	// For some of the selects, we need to ask additional information
	relationship = $(this).val();
	var new_family_member_dialog = $("#new_family_member_dialog");

	// Must remove current exact relationship if there is one.
	$("#new_family_member_exact_relationship").remove();
	$("#exact_relationship_label").remove();
	
	switch (relationship) {
		case 'aunt':

			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " 
				+ $.t("fhh_js.aunt_relationship_q") + " </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>")
				.append("<OPTION value='maternal_aunt'> " + $.t("fhh_js.mother") + " </OPTION>")
				.append("<OPTION value='paternal_aunt'> " + $.t("fhh_js.father") + " </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'uncle':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " 
				+ $.t("fhh_js.uncle_relationship_q") + " </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>")
				.append("<OPTION value='maternal_uncle'> " + $.t("fhh_js.mother") + " </OPTION>")
				.append("<OPTION value='paternal_uncle'> " + $.t("fhh_js.father") + " </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'daughter':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='daughter'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'son':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='son'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'brother':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='brother'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'sister':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='sister'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'cousin':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/><B>" + $.t("fhh_js.cousin_parent_q") + " </B> </span>");
			new_family_member_select = $("<SELECT id='new_family_member_exact_relationship'>");
			new_family_member_dialog.append(new_family_member_select);
			add_cousin_select(new_family_member_select);
			break;
		case 'niece':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.niece_parent_q") + " </B> </span>");
			new_family_member_select = $("<SELECT id='new_family_member_exact_relationship'>");
			new_family_member_dialog.append(new_family_member_select);
			add_niece_select(new_family_member_select);
			break;
		case 'nephew':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.nephew_parent_q") + " </B> </span>");
			new_family_member_select = $("<SELECT id='new_family_member_exact_relationship'>");
			new_family_member_dialog.append(new_family_member_select);
			add_nephew_select(new_family_member_select);
			break;
		case 'granddaughter':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.granddaughter_parent_q") + " </B> </span>");
			new_family_member_select = $("<SELECT id='new_family_member_exact_relationship'>");
			new_family_member_dialog.append(new_family_member_select);
			add_granddaughter_select(new_family_member_select);
			break;
		case 'grandson':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.grandson_parent_q") + " </B> </span>");
			new_family_member_select = $("<SELECT id='new_family_member_exact_relationship'>");
			new_family_member_dialog.append(new_family_member_select);
			add_grandson_select(new_family_member_select);
			break;
		case 'halfbrother':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.halfbrother_parent_q") + " </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''>" + $.t("fhh_js.please_specify") + "</OPTION>")
				.append("<OPTION value='maternal_halfbrother'> " + $.t("fhh_js.mother") + " </OPTION>")
				.append("<OPTION value='paternal_halfbrother'> " + $.t("fhh_js.father") + " </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'halfsister':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> " + $.t("fhh_js.halfsister_parent_q") + " </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>")
				.append("<OPTION value='maternal_halfsister'> " + $.t("fhh_js.mother") + " </OPTION>")
				.append("<OPTION value='paternal_halfsister'> " + $.t("fhh_js.father") + " </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
	}
}

function add_dynamic_relative_to_dropdown(select_dropdown, current_relationship, parent_relationship) {
	var i = 0;
	for (var i=0;i<30;i++) {
		if (personal_information[parent_relationship + '_' + i] == null) continue;
		var parent = personal_information[parent_relationship + '_' + i];
		var parent_name = parent.name;
		if (parent_name == null || parent_name.length == 0) {
			parent_name = $.t("fhh_js." + parent_relationship) + " #" + (i+1);
		}
		select_dropdown.append("<OPTION value='" + current_relationship + ":" + parent.id + "'> " + parent_name + " </OPTION>");
		
	}
//	while (personal_information[parent_relationship + '_' + i] != null) {
//		i++;
//	}
	
}

function add_cousin_select(select_dropdown) {
	select_dropdown.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>");
	add_dynamic_relative_to_dropdown(select_dropdown, "maternal_cousin", "maternal_aunt");
	add_dynamic_relative_to_dropdown(select_dropdown, "paternal_cousin", "paternal_aunt");
	add_dynamic_relative_to_dropdown(select_dropdown, "maternal_cousin", "maternal_uncle");
	add_dynamic_relative_to_dropdown(select_dropdown, "paternal_cousin", "paternal_uncle");
	
	select_dropdown.on("change", exact_family_member_relationship_selection_change_action);
}
function add_niece_select(select_dropdown) {
	select_dropdown.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "sister");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "brother");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "maternal_halfsister");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "maternal_halfbrother");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "paternal_halfsister");
	add_dynamic_relative_to_dropdown(select_dropdown, "niece", "paternal_halfbrother");
	
	select_dropdown.on("change", exact_family_member_relationship_selection_change_action);
}

function add_nephew_select(select_dropdown) {
	select_dropdown.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "sister");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "brother");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "maternal_halfsister");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "maternal_halfbrother");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "paternal_halfsister");
	add_dynamic_relative_to_dropdown(select_dropdown, "nephew", "paternal_halfbrother");
	
	select_dropdown.on("change", exact_family_member_relationship_selection_change_action);
}

function add_grandson_select(select_dropdown) {
	select_dropdown.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>");
	add_dynamic_relative_to_dropdown(select_dropdown, "grandson", "daughter");
	add_dynamic_relative_to_dropdown(select_dropdown, "grandson", "son");
	
	select_dropdown.on("change", exact_family_member_relationship_selection_change_action);
}

function add_granddaughter_select(select_dropdown) {
	select_dropdown.append("<OPTION value=''> " + $.t("fhh_js.please_specify") + " </OPTION>");
	add_dynamic_relative_to_dropdown(select_dropdown, "granddaughter", "daughter");
	add_dynamic_relative_to_dropdown(select_dropdown, "granddaughter", "son");
	
	select_dropdown.on("change", exact_family_member_relationship_selection_change_action);
}

function exact_family_member_relationship_selection_change_action() {
	relationship = $("#new_family_member_exact_relationship").val();
	// Overloaded the value with relationship:parent_id
	parent_id = relationship.split(":")[1];
	relationship = relationship.split(":")[0];
	
//	alert (relationship);
	// for dynamic relationships, they all have _#, we need to find the first empty one to use
	
	if (personal_information == null) {
		alert("No Personal Information Set yet");
		return
	}
	
	var i=0;
	while (personal_information[relationship + "_" + i] != null) i++;
	
	current_relationship = relationship + "_" + i;
//	alert ("Exact Relationship ID: " + current_relationship);
	create_new_family_member(current_relationship, relationship, parent_id);
	family_member_information.relationship = relationship;

	clear_and_set_current_family_member_health_history_dialog(family_member_information);
	$("#new_family_member_dialog").dialog("close");
	$( "#update_family_member_health_history_dialog" ).dialog( "open" );
	
}

function create_new_family_member(current_relationship, relationship, parent_id) {
	family_member_information = new Object();
	current_health_history = [];

	if (parent_id != null && parent_id.length > 0) {
//		alert ("Adding Parent: " + parent_id);
		family_member_information.relationship = relationship;
		family_member_information.parent_id = parent_id;
	}
	family_member_information.gender = get_gender(relationship);
	personal_information[current_relationship] = family_member_information;
	
	var table = $("#history_summary_table");
	add_new_family_history_row(table, "", $.t("fhh_js." + relationship), current_relationship, false, true);
	
}

