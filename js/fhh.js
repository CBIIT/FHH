var personal_information = null;
var current_health_history = [];
var current_relationship = "Self";

var diseases;
var isiPad = navigator.userAgent.match(/iPad/i) != null;

$(document).ready(function() {


	// Check to see whether this browser has the FileAPI
	/* Removing to test IE8
	var FileApiSupported = window.File && window.FileReader && window.FileList && window.Blob;
	if (!FileApiSupported) {		
//		if ($("body").attr("page") != "unsupported_browser") window.location.replace("./unsupported_browser.html");
	}
	*/
	
	// test if iPad // 
	// if iPad - remove copy for family member nav item and save history button //
	if (isiPad) {
		$("#navCopyFamily").remove();
	};

	$("#view_diagram_and_table_button").on('click', function () {
		$(this).css('cursor', 'wait');
	});
	


	if (typeof i18n != "undefined") {
		var option = { 
			resGetPath: '../locales/__ns__-__lng__.json',
			ns: { 
		    namespaces: ['translation', 'diseases'], 
		    defaultNs: 'translation'
		  } 
		};

		i18n.init(option, function () {
			$(".translate").i18n();
			$.getJSON("../data/diseases.json", function (data) {
				diseases = data;
				start();
			});
		});
	};

	// get language //
	var lng = window.i18n.lng();

	// get value of dropdown and set setLng param in URL //
	$( ".language" ).change(function() {
	  location.href="?setLng=" + $(".language").val();
	});	

	// get value of dropdown and set setLng param in URL on fhh page //
	$( ".language_fhh" ).change(function() {
	  location.href="?action=create&setLng=" + $(".language_fhh").val();
	});		

	// get current language and set dropdown value //
	if (lng=='en-US') {
		$(".language").val("en");	
		$(".language_fhh").val("en");	
	}
	else {
		$(".language").val(lng);
		$(".language_fhh").val(lng);
	}
});


function start() 
{

	$("#why_ask_ashkenazi_dialog").load ("why_ask_ashkenazi.html", function () {
		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
		i18n.init(option, function () {
			$(".translate").i18n();
		});
	});
		
	$("#why_ask_ashkenazi_dialog").dialog({
		title:$.t("fhh_js.ashkenazi"),
		position:['middle',0],
		autoOpen: false,
		height:250,
		width:350
	});
	
	
	$("#dropbox_save").click(function() {
		$("#dropbox_save").attr("href", "data:application/xml," + JSON.stringify(personal_information, null, 2));
	});
	
	// personal_information_dialog
	$("#add_personal_information_dialog").load ("add_personal_information_dialog.html", function () {
		build_personal_health_information_section();
		build_race_ethnicity_section($("#personal_race_ethnicity"), true);
		bind_personal_submit_button_action();
		bind_personal_cancel_button_action();
		bind_personal_help_button_action();
		clear_and_set_personal_health_history_dialog();
		// $("#help_dialog").load ("update-help.html");
	
		
		$("#personal_race_ethnicity").find("#selectedRaces-2").on("change", function () {
			if ($(this).prop("checked") == true) $("#add_personal_information_dialog").find("#asian_checkboxes").show();
			else {
				$("#add_personal_information_dialog").find("#asian_checkboxes").hide();
				// We made need to uncheck the boxes
			}
		});
		$("#personal_race_ethnicity").find("#selectedRaces-4").on("change", function () {
			if ($(this).prop("checked") == true) $("#add_personal_information_dialog").find("#south_pacific_checkboxes").show();
			else {
				$("#add_personal_information_dialog").find("#south_pacific_checkboxes").hide();
				// We made need to uncheck the boxes
			}
		});
		$("#personal_race_ethnicity").find("#selectedEthnicities-1").on("change", function () {
			if ($(this).prop("checked") == true) $("#add_personal_information_dialog").find("#hispanic_checkboxes").show();
			else {
				$("#add_personal_information_dialog").find("#hispanic_checkboxes").hide();
				// We made need to uncheck the boxes
			}
		});

//		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
//		i18n.init(option, function () {
//			$(".translate").i18n();
//		});

	});

	$("#add_personal_information_dialog").dialog({
		title:$.t("fhh_js.pi"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:['95%']
	});		
	
	// family_member_information_dialog
	$("#update_family_member_health_history_dialog").load ("update_family_member_health_history_dialog.html", function () {
		build_family_health_information_section();
		build_race_ethnicity_section($("#family_race_ethnicity"), false);
		bind_family_member_submit_button_action();
		bind_family_member_cancel_button_action();
		bind_family_member_help_button_action();
		$("#family_race_ethnicity").find("#selectedRaces-2").on("change", function () {
			if ($(this).prop("checked") == true) $("#update_family_member_health_history_dialog").find("#asian_checkboxes").show();
			else {
				$("#update_family_member_health_history_dialog").find("#asian_checkboxes").hide();
			}
		});

		$("#family_race_ethnicity").find("#selectedRaces-4").on("change", function () {
			if ($(this).prop("checked") == true) $("#update_family_member_health_history_dialog").find("#south_pacific_checkboxes").show();
			else {
				$("#update_family_member_health_history_dialog").find("#south_pacific_checkboxes").hide();
			}
		});

		$("#family_race_ethnicity").find("#selectedEthnicities-1").on("change", function () {
			if ($(this).prop("checked") == true) $("#update_family_member_health_history_dialog").find("#hispanic_checkboxes").show();
			else {
				$("#update_family_member_health_history_dialog").find("#hispanic_checkboxes").hide();
			}
		});
		

		$("#person_is_alive").hide();
		$("#person_is_not_alive").hide();
		$("#estimated_age_select").hide();
		
		set_age_at_diagnosis_pulldown( $.t("fhh_js.select_age"), $("#estimated_age_select"));
		set_age_at_diagnosis_pulldown( $.t("fhh_js.select_age_death"), $("#estimated_death_age_select"));

		set_disease_choice_select($("#cause_of_death_select"), $("#detailed_cause_of_death_select"));
		


		$("#age_determination").on("change", function () {
			if ($("#age_determination").val() == 'date_of_birth' || $("#age_determination").val() == 'age') {
				$("#age_determination_text").show();
				$("#estimated_age_select").hide();
			} else if ($("#age_determination").val() == 'estimated_age') {
				$("#age_determination_text").hide();
				$("#estimated_age_select").show();
			}
		});

		$("#is_person_alive").on("change", function () {
			if ($("#is_person_alive").val() == 'alive') {
				$("#person_is_alive").show();
				$("#person_is_not_alive").hide();
			} else if ($("#is_person_alive").val() == 'dead') {
				$("#person_is_alive").hide();
				$("#person_is_not_alive").show();
			} else if ($("#is_person_alive").val() == 'unknown') {
				$("#person_is_alive").hide();
				$("#person_is_not_alive").hide();
			}
		});

		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
		i18n.init(option, function () {
			$(".translate").i18n();
		});

	});

	$("#update_family_member_health_history_dialog").dialog({
		title:$.t("fhh_js.family_health_history_title"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:['95%'],
		close: cancel_update_family_member
	});
	
// Dead Code
//	$("#view_diagram_and_table_dialog").dialog({
//		title:$.t("view_diagram_title"),
//		position:['middle',0],
//		autoOpen: false,
//		height:1000,
//		width:['95%']
//	});

//    $("#family_pedigree").dialog({
//        title:"Family Pedigree",
//        position:['middle',0],
//        autoOpen: false,
//        height:2000,
//        width:['95%'],
//        backgroundColor: 'white'
//    });

	// This page lets you load in a previously saved history
	$("#load_personal_history_dialog").load ("load_personal_history_dialog.html", function () {
		bind_load_personal_history_button();
		bind_load_xml();
		bind_load_help_button_action();

		// remove load option from computer //
		// removes instructions for opening from computer //
		if (isiPad) {
			$(".loadPersonalInfoFromFile").remove();
		};

		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
		i18n.init(option, function () {
			$(".translate").i18n();
		});
	});

	$("#load_personal_history_dialog").dialog({
		title:$.t("fhh_js.load_dialog_title"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:800
	});

	// This page lets you save a history
	$("#save_personal_history_dialog").load ("save_personal_history_dialog.html", function () {

		bind_save_personal_history_button();
		bind_save_xml();
		
		if (isiPad) {
			$(".savePersonalInfoFromFile").remove();
		};

		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
		i18n.init(option, function () {
			$(".translate").i18n();
		});
	});

	$("#save_personal_history_dialog").dialog({
		title:$.t("fhh_js.save_dialog_title"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:800
	});

	// This is the second page when you are initially creating a personal history, it asks how many of each type of member
	$("#add_all_family_members_dialog").load ("add_all_family_members_dialog.html", function () {
		bind_add_all_family_members_submit_button_action();
		bind_add_all_family_members_cancel_button_action();
		bind_number_only_fields();
		var option = { resGetPath: '../locales/__ns__-__lng__.json'};
		i18n.init(option, function () {
			$(".translate").i18n();
		});
	});



	$("#add_all_family_members_dialog").dialog({
		title:$.t("fhh_js.add_family_members_dialog_title"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:650
	});

// Dead Code
    // family pedigree diagram dialog
//    $("#family_pedigree").load ("family_pedigree.html", function () {});

	// Disease Risk Calculator
	$("#disease_risk_calculator").dialog({
		title:$.t("fhh_js.risk_calculator_dialog_title"),
    position:['top',0],
		autoOpen: false,
		height:'auto',
		width:1064
	});

	$("#navRiskCalculator").on("click", function(){ 
		$("#disease_risk_calculator").dialog("open");
		load_risk_links();
	});

	$("#navViewDiagram").on("click", function(){ 
     xmlload();
   });

	$("#navCopyFamily").on("click", function(){ 
     $("#copy_for_family_member").dialog("open");
     build_copy_for_family_member_dialog();
  });

	$("#copy_for_family_member").dialog({
		title:$.t("fhh_js.family_member_copy_dialog_title"),
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:600
	});


	$("#help_dialog").dialog({
		title:$.t("fhh_js.help_dialog_title"), 
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:600
	});

	$("#update_help_dialog").load ("update-help.html", function () {});
	$("#update_help_dialog").dialog({
		title:$.t("fhh_js.update_help_dialog_title"), 
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:600
	});	

	$("#load_help_dialog").load ("load-help.html", function () {});
	$("#load_help_dialog").dialog({
		title:$.t("fhh_js.load_help_dialog_title"), 
		position:['middle',0],
		autoOpen: false,
		height:'auto',
		width:600
	});		

// Dead Code?	
//	if (personal_information != null) {
//	    if (confirm($.t("fhh_js.confirm_delete")) == true) {
//	    	personal_information = new Object();
//	    	build_family_history_data_table();
//	    } else {
//	        return false;
//	    }
//	}

	// Below function is temporary to allow debuging of the pedigree
	$("#nav_help").on("click", function(){ 
		$("#help_dialog").dialog("open");

		// test if iPad // 
		// remove help items related to computer //
		if (isiPad) {
			$(".computerOnly").remove();
		};
		
	});
	
	$(".banner_right").on("click", function(){ 
//		$("#help_dialog").append(JSON.stringify(personal_information, null, 2));
//		$("#help_dialog").dialog("open");
		if (DEBUG) {
			alert ("Personal Information:" + JSON.stringify(personal_information, null, 2) );
			console.log(personal_information);
		}
	});
	
	// Hide or show the right initial buttons
	$("#create_new_personal_history_button").show().on("click", bind_create_new_personal_history_button_action);
	$("#save_personal_history_button").show().on("click", bind_save_personal_history_button_action);
	$("#add_another_family_member_button").hide().on("click", bind_add_another_family_member_button_action);
	$("#save_family_history_button").hide();
//	$("#view_diagram_and_table_button").show().on("click", bind_view_diagram_and_table_button_action);
//    $("#view_diagram_and_table_button").show().on("click",  readtable());
  $("#your_health_risk_assessment_button").hide();
	
// Check to see if there are any specific actions
	if (getParameterByName("action") == 'load') {
			$("#load_personal_history_dialog").dialog("open");
	}	else if (getParameterByName("action") == 'create') {
			personal_information = new Object();
			build_family_history_data_table();
			$("#add_personal_information_dialog").dialog("open");
	} else if (getParameterByName("action") == 'save') {
			$("#save_personal_history_dialog").dialog("open");
	}


	// create disease calculator dropdown for nav //
	var calculatorDropdown = "";	
	var lng = window.i18n.lng();
	if (lng=='en-US') {
		lng = 'en';
	};		

	$.getJSON("../risk/risks.json", function (data) {
		$.each(data, function(index) {
			if (data[index].status == 'active') {
				$("#calculatorDropdown").append('<option value="' + data[index].link + '">' + data[index]['name.'+lng] + '</option>')
			};
		});
	});


	// loads selected calculator from nav //
	$( "#calculateButton" ).click(function() {
		$("#disease_risk_calculator").dialog("open");
		$( "#risk_section" ).load( "../risk/" + $("#calculatorDropdown").val(), function(data) {		
		});
		
	});		
}

function bind_load_personal_history_button() {
	
}

function bind_save_personal_history_button() {
	$("#file_download_button").on("click", function () {
		alert($.t("fhh_js.file_save"));
		$("#save_personal_history_dialog").dialog("close");
		
		return false;
	});
}

function bind_create_new_personal_history_button_action () {
	if (personal_information != null) {
	    if (confirm($.t("fhh_js.confirm_delete")) == true) {
	    	personal_information = new Object();
//	    	current_health_history = [];
	    	build_family_history_data_table();
	    } else {
	        return false;
	    }
	}
	current_health_history = [];
	clear_and_set_personal_health_history_dialog();
	$( "#add_personal_information_dialog" ).dialog( "open" );	
}

function bind_view_diagram_and_table_button_action () {
	$("#view_diagram_and_table_dialog").dialog("open");
	
	$("#view_diagram_and_table_dialog").append("");
}

function bind_save_personal_history_button_action () {
	$( "#save_personal_history_dialog" ).dialog( "open" );	
}

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
	
	new_family_member_dialog.append("<h3> " + $.t("fhh_js.add_relative_title") + " </h3>");
	new_family_member_dialog.append("<P class='instructions'>" + $.t("fhh_js.add_relative_para") + "</P>");
	new_family_member_dialog.append("<label for='new_family_member_relationship'> " + $.t("fhh_js.relationship_to_me") + " </label>");
	new_family_member_select = 
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
	
	new_family_member_select.on("change", new_family_member_relationship_selection_change_action);
	new_family_member_dialog.append(new_family_member_select);
		
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

function get_gender(relationship) {
	switch(relationship) {
			case 'maternal_grandfather':
			case 'paternal_grandfather':
			case 'father':
			case 'brother':
			case 'son':
			case 'maternal_uncle':
			case 'paternal_uncle':
			case 'nephew':
			case 'grandson':
			case 'maternal_halfbrother':
			case 'paternal_halfbrother':
		return "MALE";
			case 'maternal_grandmother':
			case 'paternal_grandmother':
			case 'mother':
			case 'sister':
			case 'daughter':
			case 'maternal_aunt':
			case 'paternal_aunt':
			case 'niece':
			case 'granddaughter':
			case 'maternal_halfsister':
			case 'paternal_halfsister':
		return "FEMALE";
			case 'cousin':
			default:
		return "";
	}
}
function bind_personal_submit_button_action () {
	$("#addPersonInformationSubmitButton").on("click", function(){ 
		$("#invalid_name_warning").remove();
		$("#invalid_date_of_birth_warning").remove();
		$("#invalid_gender_warning").remove();
		
		var errors = false;
		if (!check_name_exists($('#personal_info_form_name').val())) {
			if (!$("#invalid_name_warning").length) {
			$('#personal_info_form_name').after(
				$("<span id='invalid_name_warning'> " + $.t("fhh_js.invalid_name") + " </span>").css("color","red"));
			}
			errors = true;
		}

		if (!check_date_of_birth_in_correct_format($('#personal_info_form_date_of_birth').val())) {
			if (!$("#invalid_date_of_birth_warning").length) {
			$('#personal_info_form_date_of_birth').after(
				$("<span id='invalid_date_of_birth_warning'> " + $.t("fhh_js.invalid_data_of_birth") + " </span>").css("color","red"));
			}
			errors = true;
		}
		if ($("#personal_info_form_gender_male").prop('checked') == false &&
				$("#personal_info_form_gender_female").prop('checked') == false) {
			if (!$("#invalid_gender_warning").length) {		
				$('#personal_info_form_gender_female').next().after(
				$("<span id='invalid_gender_warning'> " + $.t("fhh_js.invalid_gender") + " </span>").css("color","red"));
			}
			errors = true;			
		}

		if (errors) {
			alert ($.t("fhh_js.invalid_data_alert"));
			return false;
		}
		
		// Check to ensure the user has not entered anything in the disease section that they have not saved.
		var disease_name = $("#add_personal_information_dialog").find("#disease_choice_select").val();
		var disease_code = $("#add_personal_information_dialog").find("#detailed_disease_choice_select").val();
		var age_at_diagnosis = $("#add_personal_information_dialog").find("#age_at_diagnosis_select").val();

		var half_way_through_adding_disease = false;
		if (disease_name && disease_name != 'not_picked') half_way_through_adding_disease = true;
		if (disease_code && disease_code != 'not_picked') half_way_through_adding_disease = true;
		if (age_at_diagnosis && age_at_diagnosis != 'not_picked') half_way_through_adding_disease = true;
		
		if (half_way_through_adding_disease) {
			alert ($.t("fhh_js.halfway_through_adding_disease"));
			return false;
		}
		
		// Determine the values from the form
		if (personal_information == null) personal_information = new Object();
		if (personal_information.id == null) personal_information['id'] = guid();
		personal_information['name'] = $("#personal_info_form_name").val();
		personal_information['gender'] = $('input[name="person.gender"]:checked').val();
		personal_information['date_of_birth'] = $('#personal_info_form_date_of_birth').val();
		personal_information['twin_status'] = $('input[name="person.twin_status"]:checked').val();
		personal_information['adopted'] = $('input[name="person.adopted"]:checked').prop('checked');
		
		var height_inches = parseInt($('#personal_height_inches').val());
		var height_feet = parseInt($('#personal_height_feet').val());
		var height_centimeters = parseInt($('#personal_height_centimeters').val());
		if (height_feet > 0 || height_inches > 0 ) {
			if (isNaN(height_feet)) height_feet = 0;
			if (isNaN(height_inches)) height_inches = 0;
			personal_information['height'] = height_feet * 12 + height_inches;
			personal_information['height_unit'] = 'inches';
		} else if (height_centimeters > 0) {
			if (isNaN(height_centimeters)) height_centimeters = 0;
			personal_information['height'] = height_centimeters;
			personal_information['height_unit'] = 'centimeters';
		} else {
			personal_information['height'] = "";
			personal_information['height_unit'] = "";
		}
		
		personal_information['weight'] = $('#personal_weight').val();
		personal_information['weight_unit'] = $('#personal_weight_unit').val();

		personal_information['Health History'] = current_health_history;

		personal_information['consanguinity'] = $("#personal_race_ethnicity").find('input[name="person.consanguinity"]:checked').val();
		
		// Use #personal_race_ethnicity
		personal_information['race'] = new Object();
		personal_information['race']['American Indian or Alaska Native'] = $("#personal_race_ethnicity").find("#selectedRaces-1").is(':checked');
		personal_information['race']['Asian'] = $("#personal_race_ethnicity").find("#selectedRaces-2").is(':checked');
		personal_information['race']['Black or African-American'] = $("#personal_race_ethnicity").find("#selectedRaces-3").is(':checked');
		personal_information['race']['Native Hawaiian or Other Pacific Islander'] = $("#personal_race_ethnicity").find("#selectedRaces-4").is(':checked');
		personal_information['race']['White'] = $("#personal_race_ethnicity").find("#selectedRaces-5").is(':checked');

		personal_information['race']['Asian Indian'] = $("#personal_race_ethnicity").find("#selectedRaces-11").is(':checked');
		personal_information['race']['Chinese'] = $("#personal_race_ethnicity").find("#selectedRaces-12").is(':checked');
		personal_information['race']['Filipino'] = $("#personal_race_ethnicity").find("#selectedRaces-13").is(':checked');
		personal_information['race']['Japanese'] = $("#personal_race_ethnicity").find("#selectedRaces-14").is(':checked');
		personal_information['race']['Korean'] = $("#personal_race_ethnicity").find("#selectedRaces-15").is(':checked');
		personal_information['race']['Vietnamese'] = $("#personal_race_ethnicity").find("#selectedRaces-16").is(':checked');
		personal_information['race']['Other Asian'] = $("#personal_race_ethnicity").find("#selectedRaces-17").is(':checked');
		personal_information['race']['Unknown Asian'] = $("#personal_race_ethnicity").find("#selectedRaces-18").is(':checked');

		personal_information['race']['Chamorro'] = $("#personal_race_ethnicity").find("#selectedRaces-21").is(':checked');
		personal_information['race']['Guamanian'] = $("#personal_race_ethnicity").find("#selectedRaces-22").is(':checked');
		personal_information['race']['Native Hawaiian'] = $("#personal_race_ethnicity").find("#selectedRaces-23").is(':checked');
		personal_information['race']['Samoan'] = $("#personal_race_ethnicity").find("#selectedRaces-24").is(':checked');
		personal_information['race']['Unknown South Pacific Islander'] = $("#personal_race_ethnicity").find("#selectedRaces-25").is(':checked');


		personal_information['ethnicity'] = new Object();
		personal_information['ethnicity']['Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		personal_information['ethnicity']['Ashkenazi Jewish'] = $("#personal_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		personal_information['ethnicity']['Not Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-3").is(':checked');

		personal_information['ethnicity']['Central American'] = $("#personal_race_ethnicity").find("#selectedEthnicities-11").is(':checked');
		personal_information['ethnicity']['Cuban'] = $("#personal_race_ethnicity").find("#selectedEthnicities-12").is(':checked');
		personal_information['ethnicity']['Dominican'] = $("#personal_race_ethnicity").find("#selectedEthnicities-13").is(':checked');
		personal_information['ethnicity']['Mexican'] = $("#personal_race_ethnicity").find("#selectedEthnicities-14").is(':checked');
		personal_information['ethnicity']['Other Hispanic'] = $("#personal_race_ethnicity").find("#selectedEthnicities-15").is(':checked');
		personal_information['ethnicity']['Puerto Rican'] = $("#personal_race_ethnicity").find("#selectedEthnicities-16").is(':checked');
		personal_information['ethnicity']['South American'] = $("#personal_race_ethnicity").find("#selectedEthnicities-17").is(':checked');

		
//		build_family_history_data_table();
			current_health_history = [];
		$("#add_personal_information_dialog").dialog("close");
		
		//  If there already is a father object, then this is an update, do not try and recreate relatives
		if (personal_information['father'] == null) {
			$("#add_all_family_members_dialog").dialog("open");
		} else {
			update_personal_history_row();
		}
	});	
}

function check_name_exists(name) {
	if (name == null || name.length == 0) return false;	
	else return true;
}

function check_date_of_birth_in_correct_format (date_of_birth) {
	if (date_of_birth == null || date_of_birth.length == 0) return false;	

 	re = /^\d{2}\/\d{2}\/\d{4}$/; 
 	if(!date_of_birth.match(re)) { 
 		return false; 
 	}	
// 	date_info = date_of_birth.split(re);
  date_info = date_of_birth.split(/[.,\/ -]/);
  
  if (date_info[0] > 12) return false
  if (date_info[0] == 1 && date_info[1] > 31) return false;
  if (date_info[0] == 2 && date_info[1] > 29) return false;
  if (date_info[0] == 3 && date_info[1] > 31) return false;
  if (date_info[0] == 4 && date_info[1] > 30) return false;
  if (date_info[0] == 5 && date_info[1] > 31) return false;
  if (date_info[0] == 6 && date_info[1] > 30) return false;
  if (date_info[0] == 7 && date_info[1] > 31) return false;
  if (date_info[0] == 8 && date_info[1] > 31) return false;
  if (date_info[0] == 9 && date_info[1] > 30) return false;
  if (date_info[0] == 10 && date_info[1] > 31) return false;
  if (date_info[0] == 11 && date_info[1] > 30) return false;
  if (date_info[0] == 12 && date_info[1] > 31) return false;
  
  var today = new Date();
  var this_year = today.getFullYear();
  var this_month =  today.getMonth()+1;
  var this_day = today.getDate();
  
  if (date_info[2] < 1890 || date_info[2] > this_year) return false;
  if (date_info[2] == this_year && date_info[0] > this_month) return false;
  if (date_info[2] == this_year && date_info[0] == this_month && date_info[1] > this_day) return false;
   
  if (date_info[2] % 4 != 0 && date_info[0] == 2 && date_info[1] == 29) return false;
	
	return true;
}

function bind_personal_cancel_button_action () {
	$("#addPersonInformationCancelButton").on("click", function(){ 
		$("#invalid_name_warning").remove();
		$("#invalid_date_of_birth_warning").remove();
		$("#invalid_gender_warning").remove();

//		alert (typeof personal_information);
		current_health_history = [];

		$("#add_personal_information_dialog").dialog("close");
	});
}

function bind_personal_help_button_action () {
	$("#add-help").on("click", function(){ 
		$("#update_help_dialog").dialog("open");
	});
}

function bind_family_member_help_button_action () {
	$("#update-help").on("click", function(){ 
		$("#update_help_dialog").dialog("open");
	});
}

function bind_load_help_button_action() {
	$("#load-help").on("click", function(){ 
		$("#load_help_dialog").dialog("open");
	});	
}


function bind_family_member_submit_button_action () {
	// Validation age determination
	
	
	$("#addFamilyMemberSubmitButton").on("click", function(){ 
		// Cause of Death or Age/Estimated-Age variables
		var alive_flag = $("#is_person_alive").val();
		var age_determination_flag = $('#age_determination').val();
		var age_determination_text = $('#age_determination_text').val();
		var estimated_age = $('#estimated_age_select').val();
		var cause_of_death = $('#cause_of_death_select').val();

	$("#family_invalid_gender_warning").remove();
	$("#invalid_date_of_birth_warning").remove();


		var errors = false;
//		 alert("AF:["+alive_flag+"]ADF:["+(age_determination_flag=='date_of_birth')+"]ADT:["+age_determination_text+"]");
		if (alive_flag == 'alive') {
			if (age_determination_flag == 'date_of_birth'  && !check_date_of_birth_in_correct_format(age_determination_text)) {
				errors = true;
				$('#age_determination_text').after(
					$("<span id='invalid_date_of_birth_warning'> " + $.t("fhh_js.invalid_data_of_birth") + " </span>").css("color","red"));
			} else if (age_determination_flag == 'age' 
					&& !(parseInt(age_determination_text) > 0 
					&&  parseInt(age_determination_text) < 150)) {
				errors = true;
				$('#age_determination_text').after(
					$("<span id='invalid_date_of_birth_warning'> " + $.t("fhh_js.invalid_age") + " </span>").css("color","red"));			
			}
		}

		// All Family members must have a gender, most already do, but cousins may be an issue.
		if ($("#family_member_info_form_gender_male").prop('checked') == false &&
				$("#family_member_info_form_gender_female").prop('checked') == false) {
			if (!$("#family_invalid_gender_warning").length) {		
				$('#family_member_info_form_gender_female').next().after(
				$("<span id='family_invalid_gender_warning'> " + $.t("fhh_js.invalid_gender") + " </span>").css("color","red"));
			}
			errors = true;			
		}
		if (errors) {
			alert ($.t("fhh_js.invalid_data_alert"));
			return false;
		}

		// Check to ensure the user has not entered anything in the disease section that they have not saved.
		var disease_name = $("#update_family_member_health_history_dialog").find("#disease_choice_select").val();
		var disease_code = $("#update_family_member_health_history_dialog").find("#detailed_disease_choice_select").val();
		var age_at_diagnosis = $("#update_family_member_health_history_dialog").find("#age_at_diagnosis_select").val();

		var half_way_through_adding_disease = false;
		if (disease_name && disease_name != 'not_picked') half_way_through_adding_disease = true;
		if (disease_code && disease_code != 'not_picked') half_way_through_adding_disease = true;
		if (age_at_diagnosis && age_at_diagnosis != 'not_picked') half_way_through_adding_disease = true;
		
		if (half_way_through_adding_disease) {
			alert ($.t("fhh_js.halfway_through_adding_disease"));
			return false;
		}

		
		var relationship = "";
		if (current_relationship == 'father' || current_relationship == 'mother' 
		 || current_relationship == 'paternal_grandfather' || current_relationship == 'paternal_grandmother' 
		 || current_relationship == 'maternal_grandfather' || current_relationship == 'maternal_grandmother') {
		 	relationship = current_relationship;
		} else {
			relationship = current_relationship.substring(0, current_relationship.lastIndexOf('_'));
		}

		var family_member_information;
		if (personal_information[current_relationship] != null) family_member_information = personal_information[current_relationship];
		else family_member_information = new Object();

		
		family_member_information['relationship'] = relationship;
		if (family_member_information['id'] == null ) family_member_information['id'] = guid();
		family_member_information['parent_id'] = $("#family_member_parent_id").val();;
		family_member_information['name'] = $("#family_member_info_form_name").val();
		family_member_information['gender'] = $('input[name="family.member.gender"]:checked').val();
		family_member_information['twin_status'] = $('input[name="family.member.twin_status"]:checked').val();
		family_member_information['adopted'] = $('input[name="family.member.adopted"]:checked').prop("checked");

		
		if (alive_flag == 'alive') {
			family_member_information['is_alive'] = 'alive';
			if (age_determination_flag == 'date_of_birth') {
				if (family_member_information['cause_of_death']) delete family_member_information['cause_of_death'];
				if (family_member_information['detailed_cause_of_death']) delete family_member_information['detailed_cause_of_death'];
				if (family_member_information['estimated_death_age']) delete family_member_information['estimated_death_age'];
				if (family_member_information['cause_of_death_code']) delete family_member_information['cause_of_death_code'];
				
				family_member_information['date_of_birth'] = age_determination_text;
				if (family_member_information['estimated_age'] != null) delete family_member_information['estimated_age'];
				if (family_member_information['age'] != null) delete family_member_information['age'];
				
			} else if (age_determination_flag == 'age') {
				family_member_information['age'] = parseInt(age_determination_text);
				if (family_member_information['date_of_birth'] != null) delete family_member_information['date_of_birth'];
				if (family_member_information['estimated_age'] != null) delete family_member_information['estimated_age'];

			}	else if (age_determination_flag == 'estimated_age') {
				family_member_information['estimated_age'] = estimated_age;
				if (family_member_information['date_of_birth'] != null) delete family_member_information['date_of_birth'];
				if (family_member_information['age'] != null) delete family_member_information['age'];
			}
		} else if (alive_flag == 'dead') {
			family_member_information['is_alive'] = 'dead';
				var cause_of_death_code = $('#detailed_cause_of_death_select').val();
				if (cause_of_death_code != null && cause_of_death_code != "") {
					detailed_cause_of_death = $.t($('#detailed_cause_of_death_select').val());
				} else {
					if ($("#new_disease_name").val() != "") detailed_cause_of_death = $("#new_disease_name").val();
		 			else detailed_cause_of_death = cause_of_death;
				}
				var estimated_death_age = $('#estimated_death_age_select').val();
				if (estimated_death_age == 'not_picked') estimated_death_age = 'unknown';
				
				family_member_information['cause_of_death'] = cause_of_death;
				if (cause_of_death == 'other') family_member_information['detailed_cause_of_death'] = $("#new_disease_name").val();
				else family_member_information['detailed_cause_of_death'] = $.t("diseases:" + cause_of_death_code);
				family_member_information['estimated_death_age'] = estimated_death_age;			
				family_member_information['cause_of_death_code'] = detailed_cause_of_death;	
				
				// Check to see if the cause of death code is already in history.
				
				var new_disease = true;
				for (var i=0; i< current_health_history.length;i++) {
					if (family_member_information['cause_of_death_code'] == current_health_history[i]['Disease Code']) new_disease=false;
//					alert (JSON.stringify(current_health_history[i],null,2));
				}
				if (new_disease && cause_of_death != null && cause_of_death_code != null && cause_of_death_code != 'not_picked') {
					specific_health_issue = {"Disease Name": cause_of_death,
					                          "Detailed Disease Name": family_member_information['detailed_cause_of_death'],
					                          "Age At Diagnosis": 'Unknown',
					                          "Disease Code": cause_of_death_code};
					current_health_history.push(specific_health_issue);
				}
		} else if (alive_flag == 'unknown') {
			family_member_information['is_alive'] = 'unknown';
		}

		if ($('#age_determinion').val() == 'Age') family_member_information['age'] = $('#age_determinion_text').val();
		var date_of_birth = $('#age_determinion_text').val();
		
		family_member_information['Health History'] = current_health_history;

		family_member_information['race'] = new Object();
		family_member_information['race']['American Indian or Alaska Native'] = $("#family_race_ethnicity").find("#selectedRaces-1").is(':checked');
		family_member_information['race']['Asian'] = $("#family_race_ethnicity").find("#selectedRaces-2").is(':checked');
		family_member_information['race']['Black or African-American'] = $("#family_race_ethnicity").find("#selectedRaces-3").is(':checked');
		family_member_information['race']['Native Hawaiian or Other Pacific Islander'] = $("#family_race_ethnicity").find("#selectedRaces-4").is(':checked');
		family_member_information['race']['White'] = $("#family_race_ethnicity").find("#selectedRaces-5").is(':checked');

		family_member_information['race']['Asian Indian'] = $("#family_race_ethnicity").find("#selectedRaces-11").is(':checked');
		family_member_information['race']['Chinese'] = $("#family_race_ethnicity").find("#selectedRaces-12").is(':checked');
		family_member_information['race']['Filipino'] = $("#family_race_ethnicity").find("#selectedRaces-13").is(':checked');
		family_member_information['race']['Japanese'] = $("#family_race_ethnicity").find("#selectedRaces-14").is(':checked');
		family_member_information['race']['Korean'] = $("#family_race_ethnicity").find("#selectedRaces-15").is(':checked');
		family_member_information['race']['Vietnamese'] = $("#family_race_ethnicity").find("#selectedRaces-16").is(':checked');
		family_member_information['race']['Other Asian'] = $("#family_race_ethnicity").find("#selectedRaces-17").is(':checked');
		family_member_information['race']['Unknown Asian'] = $("#family_race_ethnicity").find("#selectedRaces-18").is(':checked');

		family_member_information['race']['Chamorro'] = $("#family_race_ethnicity").find("#selectedRaces-21").is(':checked');
		family_member_information['race']['Guamanian'] = $("#family_race_ethnicity").find("#selectedRaces-22").is(':checked');
		family_member_information['race']['Native Hawaiian'] = $("#family_race_ethnicity").find("#selectedRaces-23").is(':checked');
		family_member_information['race']['Samoan'] = $("#family_race_ethnicity").find("#selectedRaces-24").is(':checked');
		family_member_information['race']['Unknown South Pacific Islander'] = $("#family_race_ethnicity").find("#selectedRaces-25").is(':checked');

		family_member_information['ethnicity'] = new Object();
		family_member_information['ethnicity']['Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		family_member_information['ethnicity']['Ashkenazi Jewish'] = $("#family_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		family_member_information['ethnicity']['Not Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-3").is(':checked');
		
		family_member_information['ethnicity']['Central American'] = $("#family_race_ethnicity").find("#selectedEthnicities-11").is(':checked');
		family_member_information['ethnicity']['Cuban'] = $("#family_race_ethnicity").find("#selectedEthnicities-12").is(':checked');
		family_member_information['ethnicity']['Dominican'] = $("#family_race_ethnicity").find("#selectedEthnicities-13").is(':checked');
		family_member_information['ethnicity']['Mexican'] = $("#family_race_ethnicity").find("#selectedEthnicities-14").is(':checked');
		family_member_information['ethnicity']['Other Hispanic'] = $("#family_race_ethnicity").find("#selectedEthnicities-15").is(':checked');
		family_member_information['ethnicity']['Puerto Rican'] = $("#family_race_ethnicity").find("#selectedEthnicities-16").is(':checked');
		family_member_information['ethnicity']['South American'] = $("#family_race_ethnicity").find("#selectedEthnicities-17").is(':checked');
		
		personal_information[current_relationship] = family_member_information;

		update_family_history_row(current_relationship, family_member_information);
		
		current_health_history = [];
		$("#update_family_member_health_history_dialog").dialog("close");
	});	
}

function bind_family_member_cancel_button_action () {
	$("#addFamilyMemberCancelButton").on("click", cancel_update_family_member); 
}

function cancel_update_family_member() {
//		alert ("Cancelling Family Member Information: " + current_relationship);
	
	if (personal_information[current_relationship] == null || personal_information[current_relationship].id == null
		&& current_relationship != 'self'
		&& current_relationship != 'mother' && current_relationship != 'father' 
		&& current_relationship != 'paternal_grandmother' && current_relationship != 'paternal_grandfather' 
		&& current_relationship != 'maternal_grandmother' && current_relationship != 'maternal_grandfather' 
	) {
		remove_family_member(current_relationship, false);
	}
	
	current_health_history = [];

	$("#update_family_member_health_history_dialog").dialog("close");
}

function bind_add_all_family_members_submit_button_action() {
	$("#create_immediate_family_submit").on("click", function(){ 
		var number_brothers = parseInt($("#family_brothers").val()) || 0;
		var number_sisters = parseInt($("#family_sisters").val()) || 0;
		var number_sons = parseInt( $("#family_sons").val()) || 0;
		var number_daughters = parseInt($("#family_daughters").val()) || 0;
		var number_maternal_uncles = parseInt($("#family_maternal_uncles").val()) || 0;
		var number_maternal_aunts = parseInt($("#family_maternal_aunts").val()) || 0;
		var number_paternal_uncles = parseInt($("#family_paternal_uncles").val()) || 0;
		var number_paternal_aunts = parseInt($("#family_paternal_aunts").val()) || 0;
		
		personal_information['father'] = {'gender':'MALE'};
		personal_information['father'].id = guid();
		personal_information['father']['Health History'] = [];
		
		personal_information['mother'] = {'gender':'FEMALE'};
		personal_information['mother'].id = guid();
		personal_information['mother']['Health History'] = [];

		personal_information['maternal_grandfather'] = {'gender':'MALE'};
		personal_information['maternal_grandfather'].id = guid();
		personal_information['maternal_grandfather']['Health History'] = [];

		personal_information['maternal_grandmother'] = {'gender':'FEMALE'};
		personal_information['maternal_grandmother'].id = guid();
		personal_information['maternal_grandmother']['Health History'] = [];

		personal_information['paternal_grandfather'] = {'gender':'MALE'};
		personal_information['paternal_grandfather'].id = guid();
		personal_information['paternal_grandfather']['Health History'] = [];

		personal_information['paternal_grandmother'] = {'gender':'FEMALE'};
		personal_information['paternal_grandmother'].id = guid();
		personal_information['paternal_grandmother']['Health History'] = [];

		for (var i=0; i<number_brothers;i++) {
			personal_information['brother_' + i] = {'gender':'MALE'};
			personal_information['brother_' + i].id = guid();
			personal_information['brother_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_sisters;i++) {
			personal_information['sister_' + i] = {'gender':'FEMALE'};
			personal_information['sister_' + i].id = guid();
			personal_information['sister_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_sons;i++) {
			personal_information['son_' + i] = {'gender':'MALE'};
			personal_information['son_' + i].id = guid();
			personal_information['son_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_daughters;i++) {
			personal_information['daughter_' + i] = {'gender':'FEMALE'};
			personal_information['daughter_' + i].id = guid();
			personal_information['daughter_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_maternal_uncles;i++) {
			personal_information['maternal_uncle_' + i] = {'gender':'MALE'};
			personal_information['maternal_uncle_' + i].id = guid();
			personal_information['maternal_uncle_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_maternal_aunts;i++) {
			personal_information['maternal_aunt_' + i] = {'gender':'FEMALE'};
			personal_information['maternal_aunt_' + i].id = guid();
			personal_information['maternal_aunt_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_paternal_uncles;i++) {
			personal_information['paternal_uncle_' + i] = {'gender':'MALE'};
			personal_information['paternal_uncle_' + i].id = guid();
			personal_information['paternal_uncle_' + i]['Health History'] = [];
		}
		for (var i=0; i<number_paternal_aunts;i++) {
			personal_information['paternal_aunt_' + i] = {'gender':'FEMALE'};
			personal_information['paternal_aunt_' + i].id = guid();
			personal_information['paternal_aunt_' + i]['Health History'] = [];
		}
		build_family_history_data_table();

		$("#add_another_family_member_button").show();

		$("#add_all_family_members_dialog").dialog("close");
	});
	
}

function bind_add_all_family_members_cancel_button_action() {
	$("#create_immediate_family_cancel").on("click", function(){ 
//		alert ("Cancelling Adding of Family Members");
		$("#add_all_family_members_dialog").dialog("close");
	});	
}

function load_risk_links() {
	// get lng and set to variable. used to open correct pdf //
	var lng = window.i18n.lng();
	if (lng=='en-US') {
		lng = 'en';
	};
		
	$.getJSON( "../risk/risks.json", function( data ) {
		$("#risk_section").empty();
        $.each(data, function(index) {
        	if (data[index].status == 'active') {
            var risk_calculator = $("#risk_section").append($("<div class='assessmentContainer risk_calculator' href='" + data[index].link + "'>")
            	.append($("<h3></h3>").append(data[index]['name.'+lng]))
            	.append($("<P>").append(data[index]['description.'+lng])));
            
            $("#risk_section").append(risk_calculator).append("<br>");
          }
        });
        
        $(".risk_calculator").on("click", function() { 
        	$( "#risk_section" ).load( "../risk/" + $(this).attr("href"), function(data) {
        		$(data).find("[pullfrom]").each(function (i, field) {
        			var pullfrom = $(field).attr("pullfrom");
        			var v = personal_information[pullfrom];
        			
        			// Do not know why using field directly doesn't work but this does
        			$("#" + $(field).attr("id")).val(v);
            	});
							var option = { resGetPath: '../locales/__ns__-__lng__.json'};
							i18n.init(option, function () {
								$(".translate").i18n();
							});

        	});
        });
        
        $(".risk_calculator").hover( function() {
        	$(this).css('cursor','pointer');
        });
	});
}


function build_family_history_data_table () {
	var table = $("#history_summary_table");
	
	add_family_history_header_row(table);
	
	add_new_family_history_row_title(table, $.t("fhh_js.my_family"));	
	add_personal_history_row(table, personal_information['name'], $.t("fhh_js.self"), "self", true, false);
	add_new_family_history_row(table, personal_information.father, $.t("fhh_js.father"), "father", false);	
	add_new_family_history_row(table, personal_information.mother, $.t("fhh_js.mother"), "mother", false);

	var i = 0;
	while (personal_information['brother_' + i] != null) {
		add_new_family_history_row(table, personal_information['brother_' + i], $.t("fhh_js.brother"), "brother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['sister_' + i] != null) {
		add_new_family_history_row(table, personal_information['sister_' + i], $.t("fhh_js.sister"), "sister_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['son_' + i] != null) {
		add_new_family_history_row(table, personal_information['son_' + i], $.t("fhh_js.son"), "son_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['daughter_' + i] != null) {
		add_new_family_history_row(table, personal_information['daughter_' + i], $.t("fhh_js.daughter"), "daughter_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['grandson_' + i] != null) {
		add_new_family_history_row(table, personal_information['grandson_' + i], $.t("fhh_js.grandson"), "grandson_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['granddaughter_' + i] != null) {
		add_new_family_history_row(table, personal_information['granddaughter_' + i], $.t("fhh_js.granddaughter"), "granddaughter_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['niece_' + i] != null) {
		add_new_family_history_row(table, personal_information['niece_' + i], $.t("fhh_js.niece"), "niece_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['nephew_' + i] != null) {
		add_new_family_history_row(table, personal_information['nephew_' + i], $.t("fhh_js.nephew"), "nephew_" + i, true);
		i++;
	}



	add_new_family_history_row_title(table, $.t("fhh_js.fathers_side"));	
	add_new_family_history_row(table, personal_information.paternal_grandfather, $.t("fhh_js.paternal_grandfather"), "paternal_grandfather", false);	
	add_new_family_history_row(table, personal_information.paternal_grandmother, $.t("fhh_js.paternal_grandmother"), "paternal_grandmother", false);

	i = 0;
	while (personal_information['paternal_uncle_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_uncle_' + i], $.t("fhh_js.paternal_uncle"), "paternal_uncle_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_aunt_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_aunt_' + i], $.t("fhh_js.paternal_aunt"), "paternal_aunt_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_cousin_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_cousin_' + i], $.t("fhh_js.paternal_cousin"), "paternal_cousin_" + i, true);
		i++;
	}
	var i = 0;
	while (personal_information['paternal_halfbrother_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_halfbrother_' + i], $.t("fhh_js.paternal_halfbrother"), "paternal_halfbrother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_halfsister_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_halfsister_' + i], $.t("fhh_js.paternal_halfsister"), "paternal_halfsister_" + i, true);
		i++;
	}
	


	add_new_family_history_row_title(table, $.t("fhh_js.mothers_side"));	
	add_new_family_history_row(table, personal_information.maternal_grandfather, $.t("fhh_js.maternal_grandfather"), "maternal_grandfather", false);
	add_new_family_history_row(table, personal_information.maternal_grandmother, $.t("fhh_js.maternal_grandmother"), "maternal_grandmother", false);

	i = 0;
	while (personal_information['maternal_uncle_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_uncle_' + i], $.t("fhh_js.maternal_uncle"), "maternal_uncle_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['maternal_aunt_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_aunt_' + i], $.t("fhh_js.maternal_aunt"), "maternal_aunt_" + i, true);
		i++;
	}	
	i = 0;
	while (personal_information['maternal_cousin_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_cousin_' + i], $.t("fhh_js.maternal_cousin"), "maternal_cousin_" + i, true);
		i++;
	}
	var i = 0;
	while (personal_information['maternal_halfbrother_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_halfbrother_' + i], $.t("fhh_js.maternal_halfbrother"), "maternal_halfbrother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['maternal_halfsister_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_halfsister_' + i], $.t("fhh_js.maternal_halfsister"), "maternal_halfsister_" + i, true);
		i++;
	}
	add_new_family_history_row_title(table, $.t("fhh_js.recently_added"));	

}

function add_family_history_header_row(table) {
	var header_row = $("<tr></tr>");
	header_row.append("<th scope='col' class='nowrap'>" + $.t("fhh_js.name") + "</th>");
	header_row.append("<th scope='col' abbr='Relationship' class='nowrap'>" + $.t("fhh_js.relationship_to_me") + "</th>");
	header_row.append("<th scope='col' abbr='Add' class='nowrap'>" + $.t("fhh_js.add_history") + "</th>");
	header_row.append("<th scope='col' abbr='Update' class='nowrap'>" + $.t("fhh_js.update_history") + "</th>");
	header_row.append("<th scope='col' abbr='Remove' class='nowrap'>" + $.t("fhh_js.remove_relative") + "</th>");
	header_row.append("");
	table.empty().append(header_row);
}

function add_personal_history_row(table) {
	
	// Html requires that all blank fields have at least 1 char or it will not show border
	name = 'Self';	
	var new_row = $("<tr id='self'></tr>");
	new_row.addClass("proband");
	new_row.append("<td class='information' id='relatives_name'>" + personal_information.name + "</td>");
	new_row.append("<td class='information' >" + $.t("fhh_js.self") + "</td>");
	new_row.append("<td class='action add_history'>&nbsp;</td>");
	
	var update_history_td = $("<td style='text-align:center;border:1px solid #888; padding:2px;'>");
	var update_history = $("<A class='action update_history'><img style='border:0' src='../images/icon_edit.gif' alt='Update History' title='Update History'></A>");
	update_history_td.append(update_history);

	update_history.on("click", function() { 
		current_relationship = 'self';
		clear_and_set_personal_health_history_dialog();
		$( "#add_personal_information_dialog" ).dialog( "open" );
	});		

	new_row.append(update_history_td);
	
	new_row.append("<td class='action remove_history'>&nbsp;</td>");

	table.append(new_row);
}

function add_new_family_history_row_title(table, name) {
	var new_row = $("<tr></tr>");
	new_row.addClass("summary_category_header_row");
	new_row.append("<td colspan='5'>" + name + "</td>");
	table.append(new_row);
	
}

function add_new_family_history_row(table, family_member, relationship, relationship_id, is_removeable) {
	
	// Html requires that all blank fields have at least 1 char or it will not show border

	var name;
	if (family_member == null || family_member.name == null || 
		  family_member.name == "" || $.isEmptyObject(family_member) ) name = "&nbsp;";
	else name = family_member.name;
	
	var is_already_defined = (family_member != null && !($.isEmptyObject(family_member)));
	if (relationship == "") relationship = "&nbsp;";
	
	var new_row = $("<tr id='" + relationship_id + "'></tr>");
	new_row.addClass("proband");
	new_row.append("<td class='information' id='relatives_name'>" + name + "</td>");
	new_row.append("<td class='information' >" + relationship + "</td>");
	if (is_already_defined) {
		new_row.append("<td class='action add_history'>&nbsp;</td>");

		var update_history_td = $("<td style='text-align:center;border:1px solid #888; padding:2px;'>");

		var update_history = $("<A class='action update_history'><img style='border:0px'  src='../images/icon_edit.gif' alt='Update History' title='Update History'></A>");
		update_history_td.append(update_history);

		update_history.attr("relationship_id", relationship_id);

		update_history.on("click", function(){ 
			family_member = personal_information[$(this).attr('relationship_id')];
			current_relationship = $(this).attr('relationship_id');
			family_member.relationship = relationship_id;
			
			clear_and_set_current_family_member_health_history_dialog(family_member);
			$( "#update_family_member_health_history_dialog" ).dialog( "open" );
		});
		
		new_row.append(update_history_td);
		
		
	} else {
		var add_history = $("<td class='action add_history'><img src='../images/icon_add.gif' alt='Add History' title='Add History'></td>")

		add_history.on("click", function(){ 
//			alert("Updating history for: " + relationship)
			$("#accordian_title_relationship").html(" <h2> Your " + relationship_id + "'s Health Information</h2>");
			
			current_relationship = relationship_id;
			clear_family_member_health_history_dialog();
			$( "#update_family_member_health_history_dialog" ).dialog( "open" );
		});

		
		new_row.append(add_history);
		new_row.append("<td class='action update_history'>&nbsp;</td>");
	}
	if (is_removeable) {
		var remove_history_td = $("<td style='text-align:center;border:1px solid #888'>");
		
		var remove_history = $("<A href='#' class='action remove_history'><img style='border:0px' src='../images/icon_trash.gif' alt='Remove History' title='Remove History'></A>")
		remove_history_td.append(remove_history);
		remove_history.attr("relationship_id", relationship_id);
		remove_history.on("click", function(){ 
			remove_family_member( $(this).attr('relationship_id'), true);
		});
		
		new_row.append(remove_history_td);
	} else new_row.append("<td class='action remove_history'>&nbsp;</td>");

	table.append(new_row);
}

function remove_family_member(relationship_id, confirm_flag) {
	if (personal_information[relationship_id] == null) return;

	var name = personal_information[relationship_id]['name'];
	if (name == "") name = relationship_id;

	var should_remove_family_member = true;
	if (confirm_flag) should_remove_family_member = confirm($.t("fhh_js.remove_q") + " " + name + "?  " + $.t("fhh_js.remove_q2"));
	if (should_remove_family_member == true) {
		var children = check_for_children(personal_information[relationship_id].id);
		for (i=0;i<children.length;i++) {
			remove_family_member_by_id(children[i]);
		}

		delete personal_information[relationship_id];
		$("#" + relationship_id).remove();
	} else {
		// DO nothing
	}
	
}

function check_for_children(id) {
	var children = [];
	$.each(personal_information, function (key, item) {
    if(key.substring(0,5) == 'niece' 
    || key.substring(0,6) == 'nephew' 
    || key.substring(0,15) == 'maternal_cousin' 
    || key.substring(0,15) == 'paternal_cousin' 
    || key.substring(0,8) == 'grandson'
    || key.substring(0,13) == 'granddaughter') {
      if (item.parent_id == id) {
      	children.push(item.id);
      }
    }
	});
	return children;	
}

function remove_family_member_by_id(id) {
	$.each(personal_information, function (key, item) {
		if (item["id"] && item["id"] == id) {
			delete personal_information[key];
			$("#" + key).remove();			
		}	
	});
}


function update_family_history_row(relationship_id, family_member_information) {
//	alert ("Rel:" + relationship_id);
	$("#" + relationship_id).find("#relatives_name").html(family_member_information["name"]);

//	var update_history = $("<td class='action update_history' relationship_id='" + relationship_id 
//				+ "' ><img src='images/icon_edit.gif' alt='Update History' title='Update History'></td>");

	$("#" + relationship_id).find(".update_history").html("<img src='../images/icon_edit.gif' alt='Update History' title='Update History'>");
	$("#" + relationship_id).find(".update_history").attr("relationship_id", relationship_id);
	$("#" + relationship_id).find(".add_history").html("&nbsp;");
	
	$("#" + relationship_id).find(".update_history").unbind().on("click", function(){
		family_member = personal_information[$(this).attr('relationship_id')];
		current_relationship = $(this).attr('relationship_id');
		family_member.relationship = relationship_id;
		clear_and_set_current_family_member_health_history_dialog(family_member);
		$( "#update_family_member_health_history_dialog" ).dialog( "open" );
	});

	$("#" + relationship_id).find(".add_history").off("click");
	
	
	if (relationship_id != 'mother' && 								relationship_id != 'father' &&
			relationship_id != 'maternal_grandmother' &&	relationship_id != 'maternal_grandfather' &&
			relationship_id != 'paternal_grandmother' &&	relationship_id != 'paternal_grandfather') 
	{
		remove_history = $("#" + relationship_id).find(".remove_history");
		remove_history.html("<img src='../images/icon_trash.gif' alt='Remove History' title='Remove History'>");
		remove_history.attr("relationship_id", relationship_id);
		remove_history.on("click", function(){ 
			remove_family_member( $(this).attr('relationship_id'), true);
		});
	}
		
}

function update_personal_history_row() {
	$("#self").find("#relatives_name").html(personal_information.name);
}

function build_history_edit_dialog () {
	
}


//  Information Sections

function build_family_health_information_section() {
	var information = $("#family_health_information");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='hi-title'>");
	bar.append($.t("fhh_js.family_subtitle"));
	information.empty().append(bar);
	information.append($("<p class='instructions'>" + $.t("fhh_js.add_disease_instructions") + "</p>"))

	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>" + $.t("fhh_js.disease_or_condition") + "</th>");
	hi_header_row.append("<th>" + $.t("fhh_js.age_at_diagnosis") + "</th>");
	hi_header_row.append("<th>" + $.t("fhh_js.action") + "</th>");
	hi_health_history_table.append(hi_header_row);

	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");
	var disease_select_label = $("<label for='disease_choice_select'> &nbsp; </label>");
	var disease_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	var detailed_disease_select_label = $("<label for='detailed_disease_choice_select'> &nbsp; </label>");
	var	detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
	
	set_disease_choice_select(disease_select, detailed_disease_select);
	hi_data_entry_row.append($("<td>").append(disease_select_label).append(disease_select)
		.append("<br />&nbsp;&nbsp;")
		.append(detailed_disease_select_label).append(detailed_disease_select));
	

//	var disease_choices = get_disease_choice_select();
//	hi_data_entry_row.append($("<td>").append(disease_choices).append("<br />&nbsp;&nbsp;"));
	
	var age_at_diagnosis_select_label = $("<label for='age_at_diagnosis_select'> &nbsp; </label>");
	var age_at_diagnosis_select = $("<select name='age_at_diagnosis_select' id='age_at_diagnosis_select'></select>");
	set_age_at_diagnosis_pulldown($.t("fhh_js.age_at_diagnosis_select"), age_at_diagnosis_select);
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_select_label).append(age_at_diagnosis_select));
	
	var add_new_disease_button = $("<button id='family_add_new_disease_button' name='Add' value'Add'>" + $.t("fhh_js.add") + "</button>");
	add_new_disease_button.on('click', add_disease);

	
	hi_data_entry_row.append($("<td>").append(add_new_disease_button) );
	hi_health_history_table.append(hi_data_entry_row);
	
	
	information.append(hi_health_history_table);
	information.append("<br />");

}


function build_personal_health_information_section() {
	var information = $("#personal_health_information");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='hi-title'>");
	bar.append($.t("fhh_js.personal_health_subtitle"));
	information.empty().append(bar);
	
	information.append($("<p class='instructions'>" + $.t("fhh_js.add_disease_instructions") + "</p>"))
	
	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>" + $.t("fhh_js.disease_or_condition") + "</th>");
	hi_header_row.append("<th>" + $.t("fhh_js.age_at_diagnosis") + "</th>");
	hi_header_row.append("<th>" + $.t("fhh_js.action") + "</th>");
	hi_health_history_table.append(hi_header_row);

/*
	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");
	var disease_select_label = $("<label for='disease_choice_select'> &nbsp; </label>");
	var disease_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	var detailed_disease_select_label = $("<label for='detailed_disease_choice_select'> &nbsp; </label>");
	var	detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
	
	set_disease_choice_select(disease_select, detailed_disease_select);
	hi_data_entry_row.append($("<td>").append(disease_select_label).append(disease_select)
		.append("<br />&nbsp;&nbsp;")
		.append(detailed_disease_select_label).append(detailed_disease_select));
*/	



	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");

	var disease_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	var	detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
	
	set_disease_choice_select(disease_select, detailed_disease_select);
	hi_data_entry_row.append($("<td>").append(disease_select).append("<br />&nbsp;&nbsp;").append(detailed_disease_select));
	
	var age_at_diagnosis_select = $("<select name='age_at_diagnosis_select' id='age_at_diagnosis_select'></select>");
	set_age_at_diagnosis_pulldown($.t("fhh_js.age_at_diagnosis_select"), age_at_diagnosis_select);	
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_select));
	
	var add_new_disease_button = $("<button id='add_new_disease_button' name='Add' value'Add'>" + $.t("fhh_js.add") + "</button>");
	add_new_disease_button.on('click', add_disease);

	
	hi_data_entry_row.append($("<td>").append(add_new_disease_button) );
	hi_health_history_table.append(hi_data_entry_row);
	
	information.append(hi_health_history_table);
	information.append("<br />");
}


function set_disease_choice_select (disease_select, detailed_disease_select) {
	detailed_disease_select.hide();
	disease_select.append("<option value='not_picked'>" + $.t("fhh_js.disease_select") + "</option>");
	for (disease_name in diseases) {
		disease_select.append("<option value='" + disease_name + "'> " + $.t("diseases:" + disease_name) + " </option>");		
	}
	disease_select.append("<option value='other'>" + $.t("fhh_js.add_new") + "</option>");
	
	disease_select.on('change', function() {
		if ($(this).find("option:selected" ).val() == 'other') {
			
			if ( $("#new_disease_name").length == 0)
				$(this).after($("<span id='new_disease'><INPUT id='new_disease_name' type='text' size='20'></INPUT></span>"));
				$("#detailed_cause_of_death_select").hide();
				detailed_disease_select.empty().hide();	
		} else {
			$("#new_disease_name").remove();
			var chosen_disease_name = $.trim($(this).find("option:selected" ).val());
			var disease_box = disease_select.parent();
//		$(this).next().remove();
//		$("#detailed_disease_choice_select").remove();
			var detailed_disease = get_detailed_disease(chosen_disease_name);
			detailed_disease_select.empty().hide();
			var detailed_disease_list = "";
			if (detailed_disease && detailed_disease.length > 0) {
				if (detailed_disease.length == 1) {
//					alert ("Exactly one subtype: " + JSON.stringify(detailed_disease));
					detailed_disease_select.hide();
					detailed_disease_select.append("<option value='" + detailed_disease[0].system + "-" + detailed_disease[0].code + "'> " 
						+ $.t("diseases:" + detailed_disease[0].system + "-" + detailed_disease[0].code) + " </option>");					

//					detailed_disease_select.val( detailed_disease.system + "-" + detailed_disease.code);
				} else {
	//			disease_box.append(detailed_disease_select);
					detailed_disease_select.show().append("<option value='not_picked'>" + $.t("fhh_js.disease_subtype_select") + "</option>");
					
					for (var i = 0; i < detailed_disease.length;i++) {
						detailed_disease_select.append("<option value='" + detailed_disease[i].system + "-" + detailed_disease[i].code + "'> " 
							+ $.t("diseases:" + detailed_disease[i].system + "-" + detailed_disease[i].code) + " </option>");					
					}	
				}
			}
		}
	});
	return disease_select;
}

function get_detailed_disease (disease_name) {
//	alert (disease_name + ":" + JSON.stringify(diseases[disease_name],null,2));
	return diseases[disease_name];
}

function set_age_at_diagnosis_pulldown(instructions, age_at_diagnosis_select) {
	age_at_diagnosis_select.append("<option value='not_picked'> "+instructions+"  </option>");
	age_at_diagnosis_select.append("<option value='prebirth'>" + $.t("fhh_js.prebirth") + "</option>");
	age_at_diagnosis_select.append("<option value='newborn'>" + $.t("fhh_js.newborn") + "</option>");
	age_at_diagnosis_select.append("<option value='infant'>" + $.t("fhh_js.infant") + "</option>");
	age_at_diagnosis_select.append("<option value='child'>" + $.t("fhh_js.child") + "</option>");
	age_at_diagnosis_select.append("<option value='teen'>" + $.t("fhh_js.teen") + "</option>");
	age_at_diagnosis_select.append("<option value='twenties'>" + $.t("fhh_js.twenties") + "</option>");
	age_at_diagnosis_select.append("<option value='thirties'>" + $.t("fhh_js.thirties") + "</option>");
	age_at_diagnosis_select.append("<option value='fourties'>" + $.t("fhh_js.fourties") + "</option>");
	age_at_diagnosis_select.append("<option value='fifties'>" + $.t("fhh_js.fifties") + "</option>");
	age_at_diagnosis_select.append("<option value='senior'>" + $.t("fhh_js.senior") + "</option>");
	age_at_diagnosis_select.append("<option value='Unknown'>" + $.t("fhh_js.unknown") + "</option>");
	
	return age_at_diagnosis_select;
}

function add_disease() {
//	alert($(this).parent().parent().parent().html());
	var disease_name = $(this).parent().parent().find("#disease_choice_select").val();
	var disease_code = $(this).parent().parent().find("#detailed_disease_choice_select").val();
	var age_at_diagnosis = $(this).parent().parent().find("#age_at_diagnosis_select").val();
	var disease_detail = $.t("diseases:" + disease_code, disease_name);
	
	if (disease_name == null || disease_name == '' || disease_name == 'not_picked' || disease_name == 'diseases:null') {
		alert ($.t("fhh_js.disease_select"));
		return;		
	}

	if (disease_detail == 'not_picked' || disease_detail == $.t("diseases:not_picked") ) {
		alert ($.t("fhh_js.disease_subtype_select"));
		return;
	}

	if (age_at_diagnosis == null || age_at_diagnosis == '' || age_at_diagnosis == 'not_picked') {
		alert ($.t("fhh_js.age_at_diagnosis_select"));
		return;		
	}
	
	var new_disease_name = $(this).parent().parent().find("#new_disease_name").val();
	
	if (disease_name == 'other') {
		if (new_disease_name == null || new_disease_name != "") {
			disease_name = new_disease_name;
			disease_detail = new_disease_name;
		} else {
			alert ($.t("disease_name_enter"));
			return;		
		}
	}
	
	specific_health_issue = {"Disease Name": disease_name,
	                          "Detailed Disease Name": disease_detail,
	                          "Age At Diagnosis": age_at_diagnosis,
	                          "Disease Code": disease_code};
	current_health_history.push(specific_health_issue);
	var row_number = current_health_history.length;
	
	var new_row = create_disease_row(row_number, disease_name, disease_detail, age_at_diagnosis, disease_code);
	$(this).parent().parent().parent().find("#health_data_entry_row").before(new_row);
	
	// Reset the fields
	$(this).parent().parent().find("#new_disease").remove();
	$(this).parent().parent().find("#disease_choice_select").val($(this).parent().parent().find("#disease_choice_select").find('option').first().val());
	$(this).parent().parent().find("#detailed_disease_choice_select").empty().hide();
//	$(this).parent().parent().find("#detailed_disease_choice_select").val($(this).parent().parent().find("#detailed_disease_choice_select").find('option').first().val());
	$(this).parent().parent().find("#age_at_diagnosis_select").val($(this).parent().parent().find("#age_at_diagnosis_select").find('option').first().val());
	
//	alert ("Adding: " + disease_name + ":" + disease_detail + ":" + age_at_diagnosis);
	return false;
}

function create_disease_row(row_number, disease_name, disease_detail, age_at_diagnosis, code) {
	var new_row=$("<tr class='disease_detail' row_number='" + (row_number+1) + "'>");
	if (code != null) {
		var translated_disease = $.t("diseases:" + code);
		if (translated_disease.substr(0,9) == "diseases:") translated_disease = disease_detail;
		new_row.append("<td class='disease_name'>" + translated_disease + "</td>");
	} else if (disease_detail != null && disease_detail != 'none') {
		new_row.append("<td class='disease_name'>" + disease_detail + "</td>");
	} else {
		new_row.append("<td class='disease_name'>" + disease_name + "</td>");		
	}
	new_row.append("<td class='age_at_diagnosis'>" + $.t("fhh_js." + age_at_diagnosis) + "</td>");
//	new_row.append("<td>" +  age_at_diagnosis + "</td>");
	
	var remove_disease_button = $("<button id='remove_disease_button'>" + $.t("fhh_js.remove") + "</button>");
	remove_disease_button.attr("row_number", row_number+1);
	
	remove_disease_button.on('click', remove_disease);
	new_row.append($("<td>").append(remove_disease_button));
	return new_row;
}

function remove_disease() {
	
	var row_number = $(this).attr("row_number");
	var disease_name = $(this).parent().parent().find(".disease_name").text();

	h = current_health_history;
	
	for (i=0;i<h.length;i++) {
		if (disease_name == h[i]["Disease Name"] || disease_name == h[i]["Detailed Disease Name"]) {
			disease_row_number = i; 
			break;
		}
	}

	// row_number starts at 1, the array starts at 0 so we need to subtract 1
	
	current_health_history.splice(disease_row_number, 1);	
	
	$(this).parent().parent().remove();
//	alert ("Removing Disease Row: " + row_number);
	
	
	return false;
}

// Family Background Section

// Health Information Section

function build_race_ethnicity_section(race_ethnicity, personal_flag) {
//	var race_ethnicity = $("#personal_race_ethnicity");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='bi=title'>" + $.t("fhh_js.race_ethnicity_title") + "</div>");
	race_ethnicity.empty().append(bar);
	
	var race_checkboxes = $("<td class='race_checkbox'>" +
			"<input tabindex='21' name='selectedRaces' value='1' id='selectedRaces-1'  type='checkbox'/>" +
			"<label for='selectedRaces-1' class='checkboxLabel'>" + $.t("fhh_js.race_native_american") + "</label>" +
			"<input tabindex='21' name='selectedRaces' value='2' id='selectedRaces-2' type='checkbox'/>" +
			"<label for='selectedRaces-2' class='checkboxLabel'>" + $.t("fhh_js.race_asian") + "</label>" +
			"<input tabindex='21' name='selectedRaces' value='3' id='selectedRaces-3' type='checkbox'/>" +
			"<label for='selectedRaces-3' class='checkboxLabel'>" + $.t("fhh_js.race_black") + "</label>" +
		    "<br>" +
			"<input tabindex='21' name='selectedRaces' value='4' id='selectedRaces-4'  type='checkbox'/>" +
			"<label for='selectedRaces-4' class='checkboxLabel'>" + $.t("fhh_js.race_south_pacific") + "</label>" +
			"<input tabindex='21' name='selectedRaces' value='5' id='selectedRaces-5'  type='checkbox'/>" +
			"<label for='selectedRaces-5' class='checkboxLabel'>" + $.t("fhh_js.race_white") + "</label>" +
			"</td>");
			
	var asian_race_checkboxes = $("<td class='race_checkbox'>" +
			"<input tabindex='22' name='selectedRaces' value='11' id='selectedRaces-11'  type='checkbox'/>" +
			"<label for='selectedRaces-11' class='checkboxLabel'>" + $.t("fhh_js.race_asian_indian") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='12' id='selectedRaces-12' type='checkbox'/>" +
			"<label for='selectedRaces-12' class='checkboxLabel'>" + $.t("fhh_js.race_chinese") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='13' id='selectedRaces-13' type='checkbox'/>" +
			"<label for='selectedRaces-13' class='checkboxLabel'>" + $.t("fhh_js.race_filipino") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='14' id='selectedRaces-14' type='checkbox'/>" +
			"<label for='selectedRaces-14' class='checkboxLabel'>" + $.t("fhh_js.race_japanese") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='15' id='selectedRaces-15' type='checkbox'/>" +
			"<label for='selectedRaces-15' class='checkboxLabel'>" + $.t("fhh_js.race_korean") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='16' id='selectedRaces-16' type='checkbox'/>" +
			"<label for='selectedRaces-16' class='checkboxLabel'>" + $.t("fhh_js.race_vietnamese") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='17' id='selectedRaces-17' type='checkbox'/>" +
			"<label for='selectedRaces-17' class='checkboxLabel'>" + $.t("fhh_js.race_other_asian") + "</label>" +
			"<input tabindex='22' name='selectedRaces' value='18' id='selectedRaces-18' type='checkbox'/>" +
			"<label for='selectedRaces-18' class='checkboxLabel'>" + $.t("fhh_js.race_unknown_asian") + "</label>" +
			"</td>");

	var south_pacific_race_checkboxes = $("<td class='race_checkbox'>" +
			"<input tabindex='23' name='selectedRaces' value='21' id='selectedRaces-21'  type='checkbox'>" +
			"<label for='selectedRaces-21' class='checkboxLabel'>" + $.t("fhh_js.race_chamorro") + "</label>" +
			"<input tabindex='23' name='selectedRaces' value='22' id='selectedRaces-22' type='checkbox'>" +
			"<label for='selectedRaces-22' class='checkboxLabel'>" + $.t("fhh_js.race_guamanian") + "</label>" +
			"<input tabindex='23' name='selectedRaces' value='23' id='selectedRaces-23' type='checkbox'>" +
			"<label for='selectedRaces-23' class='checkboxLabel'>" + $.t("fhh_js.race_hawaiian") + "</label>" +
			"<input tabindex='23' name='selectedRaces' value='24' id='selectedRaces-24' type='checkbox'>" +
			"<label for='selectedRaces-24' class='checkboxLabel'>" + $.t("fhh_js.race_samoan") + "</label>" +
			"<input tabindex='23' name='selectedRaces' value='25' id='selectedRaces-25' type='checkbox'>" +
			"<label for='selectedRaces-25' class='checkboxLabel'>" + $.t("fhh_js.race_unknown_south_pacific") + "</label>" +
			"</td>");

	var ethnicity_checkboxes = $("<td class='race_checkbox'>" +
			"<input tabindex='24' name='selectedEthnicities' value='1' id='selectedEthnicities-1' type='checkbox'>" +
			"<label for='selectedEthnicities-1' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_hispanic") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='2' id='selectedEthnicities-2' type='checkbox'>" +
			"<label for='selectedEthnicities-2' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_jewish") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='3' id='selectedEthnicities-3' type='checkbox'>" +
			"<label for='selectedEthnicities-3' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_nothispanic") + "</label>" +
			"</td>");

	var hispanic_ethnicity_checkboxes = $("<td class='race_checkbox'>" +
			"<input tabindex='24' name='selectedEthnicities' value='11' id='selectedEthnicities-11' type='checkbox'>" +
			"<label for='selectedEthnicities-11' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_central_american") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='12' id='selectedEthnicities-12' type='checkbox'>" +
			"<label for='selectedEthnicities-12' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_cuban") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='13' id='selectedEthnicities-13' type='checkbox'>" +
			"<label for='selectedEthnicities-13' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_dominican") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='14' id='selectedEthnicities-14' type='checkbox'>" +
			"<label for='selectedEthnicities-14' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_mexican") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='15' id='selectedEthnicities-15' type='checkbox'>" +
			"<label for='selectedEthnicities-15' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_other_hispanic") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='16' id='selectedEthnicities-16' type='checkbox'>" +
			"<label for='selectedEthnicities-16' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_puerto_rican") + "</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='17' id='selectedEthnicities-17' type='checkbox'>" +
			"<label for='selectedEthnicities-17' class='checkboxLabel'>" + $.t("fhh_js.ethnicity_south_american") + "</label>" +
			"</td>");

	var table = $("<table>");
	race_ethnicity.append(table);
	
	if (personal_flag) {
		
		table.append($("<tr>")
						.append("<td colspan='3'><label for='person_consanguinity'>" + $.t("fhh_js.consanguinity") + "</label>"
								+ "<input name='person.consanguinity' value='true' tabindex='20' id='person_consanguinity' type='checkbox'/></td>"));
	}
	table.append($("<tr>").append("<td colspan='2'>" + $.t("fhh_js.multiple_races_selectable") + "</td>") );
	table.append($("<tr>")
						.append("<td style='width:150px;'>" + $.t("fhh_js.race") + "</td>")
						.append(race_checkboxes) );
	table.append($("<tr id='asian_checkboxes'>")
						.append("<td>" + $.t("fhh_js.more_race") + "</td>")
						.append(asian_race_checkboxes) );
	table.append($("<tr id='south_pacific_checkboxes'>")
						.append("<td>" + $.t("fhh_js.more_race") + "</td>")
						.append(south_pacific_race_checkboxes) );
	table.append($("<tr>")
						.append("<td><br />" + $.t("fhh_js.ethnicity") + "</td>")
						.append(ethnicity_checkboxes) );
	table.append($("<tr id='hispanic_checkboxes'>")
						.append("<td>" + $.t("fhh_js.more_ethnicity") + "</td>")
						.append(hispanic_ethnicity_checkboxes) );

	var why_ask_ashkenazi_link = $("<td><a tabindex='29' href='#' id='why_ask_ashkenazi_link'>" + $.t("fhh_js.ashkezani_q") + "</a></td>");
	why_ask_ashkenazi_link.click(function () {
		$("#why_ask_ashkenazi_dialog").dialog("open");
	});
	race_ethnicity.append($("<tr>").append(why_ask_ashkenazi_link));
	
}


function clear_family_member_health_history_dialog() {
	$("#family_member_parent_id").val("");
	
	var relationship ="";
	if (current_relationship == 'father' || current_relationship == 'mother' 
		 || current_relationship == 'paternal_grandfather' || current_relationship == 'paternal_grandmother' 
		 || current_relationship == 'maternal_grandfather' || current_relationship == 'maternal_grandmother') {
		 	relationship = current_relationship;
	} else {
		relationship = current_relationship.substring(0, current_relationship.lastIndexOf('_'));
	}

	
	$("#family_member_relationship").empty().append(relationship);
	$("#family_member_info_form_name").val("");
	$('#family_member_info_form_gender_male').prop('checked',false);
	$('#family_member_info_form_gender_female').prop('checked',false);
	$("#family_member_info_form_date_of_birth").val("");
	$("#family_member_info_form_twin_status_no").prop('checked',true);
	$("#family_member_info_form_twin_status_identical").prop('checked',false);
	$("#family_member_info_form_twin_status_fraternal").prop('checked',false);
	$("#family_member_info_form_adopted_yes").prop('checked',false);
	
	$(".disease_detail").each(function () {
		$(this).remove();
	});
	
	$("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());
	current_health_history = [];
	
	$("#family_race_ethnicity").find("#selectedRaces-1").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-2").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-3").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-4").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-5").prop('checked',false);
	
	$("#family_race_ethnicity").find("#selectedRaces-11").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-12").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-13").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-14").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-15").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-16").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-17").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-18").prop('checked',false);	

	$("#family_race_ethnicity").find("#selectedRaces-21").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-22").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-23").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-24").prop('checked',false);	
	$("#family_race_ethnicity").find("#selectedRaces-25").prop('checked',false);	
	
	$("#family_race_ethnicity").find("#selectedEthnicities-1").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-2").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-3").prop('checked',false);

	$("#family_race_ethnicity").find("#selectedEthnicities-11").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-12").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-13").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-14").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-15").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-16").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-17").prop('checked',false);
	
}

function clear_and_set_current_family_member_health_history_dialog(family_member) {
	var relationship_name = get_relationship_from_relationship_id(family_member.relationship);
	$("#family_member_parent_id").val(family_member.parent_id);
	$("#family_member_relationship").empty().append($.t("fhh_js." + relationship_name));
	if (family_member.name == null) family_member.name = "";
	$("#family_member_info_form_name").val(family_member.name);
	
	$("#family_invalid_gender_warning").remove();
	$("#invalid_date_of_birth_warning").remove();

	
	var person_name_or_relationship;
	if (!(family_member.name == "")) person_name_or_relationship = family_member.name;
	else person_name_or_relationship = $.t("info_dialog.your") + " " + $.t("fhh_js." + relationship_name);

	$("#update_family_member_health_history_dialog").find("#family-title")
		.text($.t("info_dialog.personal_information_for") + " " + person_name_or_relationship);
	$("#update_family_member_health_history_dialog").find("#hi-title")
		.text($.t("info_dialog.health_information_for") + " " + person_name_or_relationship);
	$("#update_family_member_health_history_dialog").find("#bi-title")
		.text($.t("info_dialog.race_ethnicity_information_for") + " " + person_name_or_relationship);
		
	
	if (family_member.gender == "MALE") $('#family_member_info_form_gender_male').prop('checked',true);
	else $('#family_member_info_form_gender_male').prop('checked',false);
	
	if (family_member.gender == "FEMALE") $('#family_member_info_form_gender_female').prop('checked',true);
	else $('#family_member_info_form_gender_female').prop('checked',false);
		
	if (relationship_name == 'maternal_cousin' || relationship_name == 'paternal_cousin' ) {
		$('#family_member_info_form_gender_male').prop('disabled',false);
		$('#family_member_info_form_gender_female').prop('disabled',false);
	} else {
		$('#family_member_info_form_gender_male').prop('disabled',true);
		$('#family_member_info_form_gender_female').prop('disabled',true);		
	}
	
	$("#age_determination_text").val(family_member.date_of_birth);
	$("#family_member_info_form_date_of_birth").val(family_member.date_of_birth);
	
	if (family_member.twin_status == "NO") $("#family_member_info_form_twin_status_no").prop('checked',true);
	else if (family_member.twin_status == "IDENTICAL") $("#family_member_info_form_twin_status_identical").prop('checked',true);
	else if (family_member.twin_status == "FRATERNAL") $("#family_member_info_form_twin_status_fraternal").prop('checked',true);
//	$("#family_member_info_form_adopted_yes").prop('checked', family_member.adopted);
	$("#family_member_info_form_adopted_yes").prop('checked', (family_member.adopted == 'true' || family_member.adopted == true));

	// Age/Estimated Age or Cause of Death
	$("#cause_of_death_select").val("");
	$("#detailed_cause_of_death_select").empty().hide();
	$('#estimated_death_age_select').val("");
	if (family_member.is_alive == 'dead') {
		$("#is_person_alive").val('dead');
		var cause_of_death = get_disease_name_from_detailed_name(family_member.detailed_cause_of_death);
		$("#cause_of_death_select").val(cause_of_death);
		$("#cause_of_death_select").trigger("change");
		if (family_member.detailed_cause_of_death) {
			if (family_member.cause_of_death == 'other') $("#new_disease_name").val(family_member.detailed_cause_of_death);
			else {
				var code = family_member.cause_of_death_code;
				$("#detailed_cause_of_death_select").show().val(code);
			}
		}
		$('#estimated_death_age_select').val(family_member.estimated_death_age);
		$("#person_is_alive").hide();
		$("#person_is_not_alive").show();
	} else if (family_member.is_alive == 'alive') {
		if (family_member.date_of_birth) {
			$("#is_person_alive").val('alive');
			$("#age_determination").val('date_of_birth');
			$('#age_determination_text').show().val(family_member.date_of_birth);
			$('#estimated_age_select').hide();
			$("#person_is_alive").show();
			$("#person_is_not_alive").hide();
		} else if (family_member.age) {
			$("#is_person_alive").val('alive');
			$("#age_determination").val('age');
			$('#age_determination_text').show().val(family_member.age);
			$('#estimated_age_select').hide();
			$("#person_is_alive").show();
			$("#person_is_not_alive").hide();
		} else if (family_member.estimated_age) {
			$("#is_person_alive").val('alive');
			$("#age_determination").val('estimated_age');
			$('#estimated_age_select').show().val(family_member.estimated_age);
			$('#age_determination_text').hide();
			$("#person_is_alive").show();
			$("#person_is_not_alive").hide();
		}
	} else {
		$("#is_person_alive").val('unknown');
		$("#person_is_alive").hide();
		$("#person_is_not_alive").hide();
	}


	$(".disease_detail").each(function () {
		$(this).remove();
	});

	data_entry_row = $("#family_health_information").find("#health_data_entry_row");

	if (family_member['Health History'] != null) {
		current_health_history = family_member['Health History'];
		for (var i=0; i<current_health_history.length;i++) {		
			new_row = create_disease_row(
					i,
					current_health_history[i]['Disease Name'], 
					current_health_history[i]['Detailed Disease Name'], 
					current_health_history[i]['Age At Diagnosis'],
					current_health_history[i]['Disease Code']);
			data_entry_row.before(new_row);
		}		
	}
	
	$("#family_health_information").find("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#family_health_information").find("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#family_health_information").find("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());

	if (family_member.race && family_member.race['Asian'] == true) {
		$("#family_race_ethnicity").find("#asian_checkboxes").show();
	} else {
		$("#family_race_ethnicity").find("#asian_checkboxes").hide();
	}

	if (family_member.race && family_member.race['Native Hawaiian or Other Pacific Islander'] == true) {
		$("#family_race_ethnicity").find("#south_pacific_checkboxes").show();
	} else {
		$("#family_race_ethnicity").find("#south_pacific_checkboxes").hide();
	}


	
	if (family_member.race != null) {
		$("#family_race_ethnicity").find("#selectedRaces-1").prop('checked',family_member.race['American Indian or Alaska Native']);
		$("#family_race_ethnicity").find("#selectedRaces-2").prop('checked',family_member.race['Asian']);
		$("#family_race_ethnicity").find("#selectedRaces-3").prop('checked',family_member.race['Black or African-American']);
		$("#family_race_ethnicity").find("#selectedRaces-4").prop('checked',family_member.race['Native Hawaiian or Other Pacific Islander']);
		$("#family_race_ethnicity").find("#selectedRaces-5").prop('checked',family_member.race['White']);

		$("#family_race_ethnicity").find("#selectedRaces-11").prop('checked',family_member.race['Asian Indian']);
		$("#family_race_ethnicity").find("#selectedRaces-12").prop('checked',family_member.race['Chinese']);
		$("#family_race_ethnicity").find("#selectedRaces-13").prop('checked',family_member.race['Filipino']);
		$("#family_race_ethnicity").find("#selectedRaces-14").prop('checked',family_member.race['Japanese']);
		$("#family_race_ethnicity").find("#selectedRaces-15").prop('checked',family_member.race['Korean']);
		$("#family_race_ethnicity").find("#selectedRaces-16").prop('checked',family_member.race['Vietnamese']);
		$("#family_race_ethnicity").find("#selectedRaces-17").prop('checked',family_member.race['Other Asian']);
		$("#family_race_ethnicity").find("#selectedRaces-18").prop('checked',family_member.race['Unknonwn Asian']);

		$("#family_race_ethnicity").find("#selectedRaces-21").prop('checked',family_member.race['Chamorro']);
		$("#family_race_ethnicity").find("#selectedRaces-22").prop('checked',family_member.race['Guamanian']);
		$("#family_race_ethnicity").find("#selectedRaces-23").prop('checked',family_member.race['Native Hawaiian']);
		$("#family_race_ethnicity").find("#selectedRaces-24").prop('checked',family_member.race['Samoan']);
		$("#family_race_ethnicity").find("#selectedRaces-25").prop('checked',family_member.race['Unknown South Pacific Islander']);

	} else {
		$("#family_race_ethnicity").find("#selectedRaces-1").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-2").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-3").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-4").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-5").prop('checked',false);

		$("#family_race_ethnicity").find("#selectedRaces-11").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-12").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-13").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-14").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-15").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-16").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-17").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-18").prop('checked',false);

		$("#family_race_ethnicity").find("#selectedRaces-21").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-22").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-23").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-24").prop('checked',false);
		$("#family_race_ethnicity").find("#selectedRaces-25").prop('checked',false);
		
	}

	if (family_member.ethnicity && family_member.ethnicity['Hispanic or Latino'] == true) {
		$("#family_race_ethnicity").find("#hispanic_checkboxes").show();
	} else {
		$("#family_race_ethnicity").find("#hispanic_checkboxes").hide();
	}

	
	if (family_member.ethnicity != null) {
		$("#family_race_ethnicity").find("#selectedEthnicities-1").prop('checked',family_member.ethnicity['Hispanic or Latino']);
		$("#family_race_ethnicity").find("#selectedEthnicities-2").prop('checked',family_member.ethnicity['Ashkenazi Jewish']);
		$("#family_race_ethnicity").find("#selectedEthnicities-3").prop('checked',family_member.ethnicity['Not Hispanic or Latino']);

		$("#family_race_ethnicity").find("#selectedEthnicities-11").prop('checked',family_member.ethnicity['Central American']);
		$("#family_race_ethnicity").find("#selectedEthnicities-12").prop('checked',family_member.ethnicity['Cuban']);
		$("#family_race_ethnicity").find("#selectedEthnicities-13").prop('checked',family_member.ethnicity['Dominican']);
		$("#family_race_ethnicity").find("#selectedEthnicities-14").prop('checked',family_member.ethnicity['Mexican']);
		$("#family_race_ethnicity").find("#selectedEthnicities-15").prop('checked',family_member.ethnicity['Other Hispanic']);
		$("#family_race_ethnicity").find("#selectedEthnicities-16").prop('checked',family_member.ethnicity['Puerto Rican']);
		$("#family_race_ethnicity").find("#selectedEthnicities-17").prop('checked',family_member.ethnicity['South American']);

	} else {
		$("#family_race_ethnicity").find("#selectedEthnicities-1").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-2").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-3").prop('checked', false);

		$("#family_race_ethnicity").find("#selectedEthnicities-11").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-12").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-13").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-14").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-15").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-16").prop('checked', false);
		$("#family_race_ethnicity").find("#selectedEthnicities-17").prop('checked', false);

	}
}

function clear_and_set_personal_health_history_dialog() {
	if (personal_information == null) personal_information = new Object();
	if (personal_information.name != null) $("#personal_info_form_name").val(personal_information.name);
	else $("#personal_info_form_name").val("");
	
	if (personal_information.gender == "MALE") $('#personal_info_form_gender_male').prop('checked',true);
	else $('#personal_info_form_gender_male').prop('checked',false);
	
	if (personal_information.gender == "FEMALE") $('#personal_info_form_gender_female').prop('checked',true);
	else $('#personal_info_form_gender_female').prop('checked',false);
	
	$("#personal_info_form_date_of_birth").val(personal_information.date_of_birth);
	
	if (personal_information.twin_status == "NO") $("#personal_info_form_twin_status_no").prop('checked',true);
	else if (personal_information.twin_status == "IDENTICAL") $("#personal_info_form_twin_status_identical").prop('checked',true);
	else if (personal_information.twin_status == "FRATERNAL") $("#personal_info_form_twin_status_fraternal").prop('checked',true);
	
	$("#personal_info_form_adopted_yes").prop('checked',personal_information.adopted == true );
	
	if (personal_information.height_unit == 'inches') {
		$("#personal_height_feet").val(Math.floor(personal_information.height/12) );
		$("#personal_height_inches").val(Math.floor(personal_information.height % 12) );
	} else if (personal_information.height_unit == 'centimeters') {
		$("#personal_height_centimeters").val(personal_information.height);
	} else {
		$("#personal_height_feet").val("");
		$("#personal_height_inches").val("");
		$("#personal_height_centimeters").val("");
	}
	$("#personal_weight").val(personal_information.weight);
	if (personal_information.weight_unit == 'kgs' || personal_information.weight_unit == 'kilogram') {
		$("#personal_weight_unit").val("kilogram");
	} else {		
		$("#personal_weight_unit").val("pound");
	}
	
	$(".disease_detail").each(function () {
		$(this).remove();
	});

	data_entry_row = $("#personal_health_information").find("#health_data_entry_row");

	if (personal_information['Health History'] != null) {
		current_health_history = personal_information['Health History'];
		for (var i=0; i<current_health_history.length;i++) {		
			new_row = create_disease_row(
					i,
					current_health_history[i]['Disease Name'], 
					current_health_history[i]['Detailed Disease Name'], 
					current_health_history[i]['Age At Diagnosis'],
					current_health_history[i]['Disease Code']);
			data_entry_row.before(new_row);
		}		
	}

	
	$("#personal_health_information").find("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#personal_health_information").find("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#personal_health_information").find("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());

	$("#personal_race_ethnicity").find('input[name="person.consanguinity"]').prop("checked", personal_information.consanguinity);


	if (personal_information.race && personal_information.race['Asian'] == true) {
		$("#personal_race_ethnicity").find("#asian_checkboxes").show();
	} else {
		$("#personal_race_ethnicity").find("#asian_checkboxes").hide();
	}

	if (personal_information.race && personal_information.race['Native Hawaiian or Other Pacific Islander'] == true) {
		$("#personal_race_ethnicity").find("#south_pacific_checkboxes").show();
	} else {
		$("#personal_race_ethnicity").find("#south_pacific_checkboxes").hide();
	}
	
	if (personal_information.race != null) {
		$("#personal_race_ethnicity").find("#selectedRaces-1").prop('checked',personal_information.race['American Indian or Alaska Native']);
		$("#personal_race_ethnicity").find("#selectedRaces-2").prop('checked',personal_information.race['Asian']);
		$("#personal_race_ethnicity").find("#selectedRaces-3").prop('checked',personal_information.race['Black or African-American']);
		$("#personal_race_ethnicity").find("#selectedRaces-4").prop('checked',personal_information.race['Native Hawaiian or Other Pacific Islander']);
		$("#personal_race_ethnicity").find("#selectedRaces-5").prop('checked',personal_information.race['White']);

		$("#personal_race_ethnicity").find("#selectedRaces-11").prop('checked',personal_information.race['Asian Indian']);
		$("#personal_race_ethnicity").find("#selectedRaces-12").prop('checked',personal_information.race['Chinese']);
		$("#personal_race_ethnicity").find("#selectedRaces-13").prop('checked',personal_information.race['Filipino']);
		$("#personal_race_ethnicity").find("#selectedRaces-14").prop('checked',personal_information.race['Japanese']);
		$("#personal_race_ethnicity").find("#selectedRaces-15").prop('checked',personal_information.race['Korean']);
		$("#personal_race_ethnicity").find("#selectedRaces-16").prop('checked',personal_information.race['Vietnamese']);
		$("#personal_race_ethnicity").find("#selectedRaces-17").prop('checked',personal_information.race['Other Asian']);
		$("#personal_race_ethnicity").find("#selectedRaces-18").prop('checked',personal_information.race['Unknown Asian']);

		$("#personal_race_ethnicity").find("#selectedRaces-21").prop('checked',personal_information.race['Chamorro']);
		$("#personal_race_ethnicity").find("#selectedRaces-22").prop('checked',personal_information.race['Guamanian']);
		$("#personal_race_ethnicity").find("#selectedRaces-23").prop('checked',personal_information.race['Native Hawaiian']);
		$("#personal_race_ethnicity").find("#selectedRaces-24").prop('checked',personal_information.race['Samoan']);
		$("#personal_race_ethnicity").find("#selectedRaces-25").prop('checked',personal_information.race['Unknown South Pacific Islander']);

	} else {
		$("#personal_race_ethnicity").find("#selectedRaces-1").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-2").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-3").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-4").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-5").prop('checked',false);

		$("#personal_race_ethnicity").find("#selectedRaces-11").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-12").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-13").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-14").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-15").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-16").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-17").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-18").prop('checked',false);

		$("#personal_race_ethnicity").find("#selectedRaces-21").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-22").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-23").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-24").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedRaces-25").prop('checked',false);
		
	}

	if (personal_information.ethnicity && personal_information.ethnicity['Hispanic or Latino'] == true) {
		$("#personal_race_ethnicity").find("#hispanic_checkboxes").show();
	} else {
		$("#personal_race_ethnicity").find("#hispanic_checkboxes").hide();
	}

	
	if (personal_information.ethnicity != null) {
		$("#personal_race_ethnicity").find("#selectedEthnicities-1").prop('checked',personal_information.ethnicity['Hispanic or Latino']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-2").prop('checked',personal_information.ethnicity['Ashkenazi Jewish']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-3").prop('checked',personal_information.ethnicity['Not Hispanic or Latino']);

		$("#personal_race_ethnicity").find("#selectedEthnicities-11").prop('checked',personal_information.ethnicity['Central American']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-12").prop('checked',personal_information.ethnicity['Cuban']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-13").prop('checked',personal_information.ethnicity['Dominican']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-14").prop('checked',personal_information.ethnicity['Mexican']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-15").prop('checked',personal_information.ethnicity['Other Hispanic']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-16").prop('checked',personal_information.ethnicity['Puerto Rican']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-17").prop('checked',personal_information.ethnicity['South American']);

	}	else {
		$("#personal_race_ethnicity").find("#selectedEthnicities-1").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-2").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-3").prop('checked',false);

		$("#personal_race_ethnicity").find("#selectedEthnicities-11").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-12").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-13").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-14").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-15").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-16").prop('checked',false);
		$("#personal_race_ethnicity").find("#selectedEthnicities-17").prop('checked',false);
		
	}
}
// Helper functions
/*
function make_disease_array () {
	var keys = Object.keys(diseases);
	for (var i=0; i<keys.length;i++) {
		disease_list.push(keys[i]);
		for (var j=0; j<diseases[keys[i]].length; j++) {
			disease_list.push(diseases[keys[i]][j]);
		}
	}	
}
*/

// Will get the querystring parameters for a url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
});
}

// Polyfill to support IE9 and Object.keys
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}


// Helper to ensure that only numerics are used in fields

function bind_number_only_fields() {
	 $(".numeric").keypress(function (e) {
     //if the letter is not digit then display error and don't type anything
     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
        //display error message
        if ($("#digit_warning").length == 0) {
	        var error_message = $("<span id='digit_warning'> " + $.t("fhh_js.digits_only") + " </span>").css("color","red");
	        $(this).parent().append(error_message);
       		 error_message.show().fadeOut("slow");
       		 window.setTimeout(function() { $("#digit_warning").remove(); }, 1000);
	      }
//        $("#errmsg").html("Digits Only").show().fadeOut("slow");
               return false;
    }
   });
}

function any_relatives (pi, relative_name) {
	var relatives_exist = false;
	for (var i=0;i<30;i++) {
		if (pi[relative_name + "_" + i] != null) relatives_exist = relatives_exist || true;
	}
	return relatives_exist;
}

function get_relationship_from_relationship_id (id) {
	if (id == 'father' || id == 'mother'
		|| id == 'maternal_grandfather' || id == 'maternal_grandmother'
		|| id == 'paternal_grandfather' || id == 'paternal_grandmother') return id;
		
	if (id.substring(0,7) == 'brother') return 'brother';
	if (id.substring(0,6) == 'sister') return 'sister';
	if (id.substring(0,20) == 'paternal_halfbrother') return 'paternal_halfbrother';
	if (id.substring(0,19) == 'paternal_halfsister') return 'paternal_halfsister';
	if (id.substring(0,20) == 'maternal_halfbrother') return 'maternal_halfbrother';
	if (id.substring(0,19) == 'maternal_halfsister') return 'maternal_halfsister';
	if (id.substring(0,14) == 'paternal_uncle') return 'paternal_uncle';
	if (id.substring(0,13) == 'paternal_aunt') return 'paternal_aunt';
	if (id.substring(0,14) == 'maternal_uncle') return 'maternal_uncle';
	if (id.substring(0,13) == 'maternal_aunt') return 'maternal_aunt';
	if (id.substring(0,15) == 'maternal_cousin') return 'maternal_cousin';
	if (id.substring(0,15) == 'paternal_cousin') return 'paternal_cousin';

	if (id.substring(0,3) == 'son') return 'son';
	if (id.substring(0,8) == 'daughter') return 'daughter';
	if (id.substring(0,8) == 'grandson') return 'grandson';
	if (id.substring(0,13) == 'granddaughter') return 'granddaughter';
	
	if (id.substring(0,5) == 'niece') return 'niece';
	if (id.substring(0,6) == 'nephew') return 'nephew';
	
	return 'unknown'
}


// Check to see whether this browser has the FileAPI
function is_IE_8_or_9 () {
	var val = which_IE();
	if (val == false) return false;  // Non IE Browsers
	if (val < 10) return true;
	return false;
}

function which_IE(){
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// To prevent losing info when leaving page



function closeEditorWarning(){
    if (personal_information) return "Leaving";
};




window.onbeforeunload = closeEditorWarning;


