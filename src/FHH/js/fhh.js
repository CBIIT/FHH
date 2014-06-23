var personal_information = null;
var current_health_history = [];
var current_relationship = "Self";

var diseases = {
		'Clotting Disorder': ['Deep Vein Thrombosis (DVT)', 'Pulmonary Embolism', 'Clotting Disorder', 'Unknown Clotting Disorder'],
		'Cancer': 			 ['Bone Cancer', 'Breast Cancer', 'Colon Cancer', 'Esophageal Cancer', 'Gastric Cancer', 'Kidney Cancer',
				   			  'Leukemia', 'Lung Cancer', 'Muscle Cancer', 'Ovarian Cancer', 'Prostate Cancer', 'Skin Cancer', 'Thyroid Cancer',
				   			  'Uterine Cancer', 'Hereditary onpolyposis colon cancer', 'Pancreatic cancer', 'Liver cancer', 'Brain Cancer',
				   		 	  'Colorectal Cancer', 'Other Cancer', 'Unknown Cancer'],
		'Diabetes': 		 ['Type 1 Diabetes', 'Type 2 Diabetes', 'Gestational Diabetes', 'Diabetes Mellitus', 'Unknown Diabetes'],
		'Gastrointestinal Disorder': ['Familial adenomatous polyposis', 'Colon Polyp', 'Crohn\'s Disease', 'Irritable Bowel Syndrome',
									  'Ulcerative Colitis', 'Gastrointestinal Disorder', 'Unknown Gastrointestinal Disorder'],
		'Heart Disease': 			 ['Heart Disease', 'Heart Attack', 'Coronary Artery Disease', 'Angina', 'Unknown Heart Disease'],					  
		'High Cholesterol' : [],
		'Hypertension': [],
		'Kidney Disease': ['Cystic Kidney Disease', 'Diabetic Kidney Disease', 'Nephritis', 'Kidney Nephrosis', 'Nephrotic Syndrome',
						   'Unknown Kidney Disease', 'Kidney Disease Present from Birth', 'Other Kidney Disease'],
		'Lung Disease': ['Asthma', 'Chronic Bronchitis', 'Chronic Lower Respiratory Disease', 'COPD', 'Emphysema', 'Influenza/Pneumonia',
					     'Unknown Lung Disease'],
		'Dementia/Alzheimer\'s': [],
		'Osteoporosis': [],
		'Mental Disorder': ['Anxiety', 'Attention Deficit Disorder-Hyperactivity', 'Autism', 'Bipolar Disorder', 'Dementia',  'Depression',
						    'Eating Disorder', 'Obsessive Compulsive Disorder', 'Panic Disorder', 'Personality Disorder', 
						    'Post Traumatic Stress Disorder', 'Schizophrenia', 'Social Phobia', 'Unspecified', 'Unknown Psychological Disorder'],
		'Septicemia': [],
		'Stroke/Brain Attack': [],
		'Sudden Infant Death Syndrome': [],
		'Other Disease': [],
		'Unknown Disease': []
	};


$(document).ready(function() {

	// personal_information_dialog
	$("#add_personal_information_dialog").load ("add_personal_information_dialog.html", function () {
		build_personal_health_information_section();
		build_personal_race_ethnicity_section();
		bind_personal_submit_button_action();
		bind_personal_cancel_button_action();
	});

	$("#add_personal_information_dialog").dialog({
		title:"Enter Personal Information",
		autoOpen: false,
		height:500,
		width:800,
	});		

	$("#create_new_personal_history_button").on("click", function(){
		if (personal_information != null) {
		    if (confirm("This will delete all data and restart,  Are you sure you want to do this?") == true) {
		    	// Do nothing
		    } else {
		        return false;
		    }
		}
		$( "#add_personal_information_dialog" ).dialog( "open" );
	});
	
	// family_member_information_dialog
	$("#update_family_member_health_history_dialog").load ("update_family_member_health_history_dialog.html", function () {
		build_family_health_information_section();
		build_family_race_ethnicity_section();
		bind_family_member_submit_button_action();
		bind_family_member_cancel_button_action();
	});

	$("#update_family_member_health_history_dialog").dialog({
		title:"Enter Family Member's Health History",
		autoOpen: false,
		height:500,
		width:800,
	});		

	// This is the second page when you are initially creating a personal history, it asks how many of each type of member
	$("#add_all_family_members_dialog").load ("add_all_family_members_dialog.html", function () {
		bind_add_all_family_members_submit_button_action();
		bind_add_all_family_members_cancel_button_action();
	});

	$("#add_all_family_members_dialog").dialog({
		title:"Add Immediate Family Members",
		autoOpen: false,
		height:450,
		width:600,
	});


	
	// Disease Risk Calculator
	$("#disease_risk_calculator").dialog({
		title:"Disease Risk Calculators",
		autoOpen: false,
		height:500,
		width:800,
	});

	$("#navRiskCalculator").on("click", function(){ 
		$("#disease_risk_calculator").dialog("open");
		load_risk_links();
	});

	// Below function is temporary to allow debuging of the pedigree
	$("#nav_help").on("click", function(){ 
		alert ("Personal Information:" + JSON.stringify(personal_information, null, 2) );
	});
});

function bind_personal_submit_button_action () {
	$("#addPersonInformationSubmitButton").on("click", function(){ 
		
		// Determine the values from the form
		personal_information = new Object();
		personal_information['name'] = $("#personal_info_form_name").val();
		personal_information['gender'] = $('input[name="person.gender"]:checked').val();
		personal_information['date_of_birth'] = $('#personal_info_form_date_of_birth').val();
		personal_information['twin_status'] = $('input[name="person.twin_status"]:checked').val();
		personal_information['adopted'] = $('input[name="person.adopted"]:checked').val();
		personal_information['height_feet'] = $('#personal_height_feet').val();
		personal_information['height_inches'] = $('#personal_height_inches').val();
		personal_information['height_centimeters'] = $('#personal_height_centimeters').val();
		personal_information['weight'] = parseInt($('#personal_weight').val());
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

		personal_information['ethnicity'] = new Object();
		personal_information['ethnicity']['Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		personal_information['ethnicity']['Ashkenazi Jewish'] = $("#personal_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		personal_information['ethnicity']['Not Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-3").is(':checked');

		
//		build_family_history_data_table();
		$("#add_personal_information_dialog").dialog("close");
		$("#add_all_family_members_dialog").dialog("open");
	});	
}

function bind_personal_cancel_button_action () {
	$("#addPersonInformationCancelButton").on("click", function(){ 
		alert ("Cancelling Personal Information");
		$("#add_personal_information_dialog").dialog("close");
	});
}

function bind_family_member_submit_button_action () {
	$("#addFamilyMemberSubmitButton").on("click", function(){ 
//		alert ("Updating Family Member Information for:" + current_relationship);

		var family_member_information = new Object();
		family_member_information['name'] = $("#family_member_info_form_name").val();
		family_member_information['gender'] = $('input[name="family.member.gender"]:checked').val();
		family_member_information['dateOfBirth'] = $('#family_member_info_form_date_of_birth').val();
		family_member_information['twinStatus'] = $('input[name="family.member.twin_status"]:checked').val();
		family_member_information['adopted'] = $('input[name="family.member.adopted"]:checked').val();

		family_member_information['height_feet'] = $('#family_member_height_feet').val();
		family_member_information['height_inches'] = $('#family_member_height_inches').val();
		family_member_information['height_centimeters'] = $('#family_member_height_centimeters').val();
		family_member_information['weight'] = parseInt($('#family_member_weight').val());
		family_member_information['weight_unit'] = $('#family_member_weight_unit').val();

		family_member_information['Health History'] = current_health_history;

		family_member_information['race'] = new Object();
		family_member_information['race']['American Indian or Alaska Native'] = $("#family_race_ethnicity").find("#selectedRaces-1").is(':checked');
		family_member_information['race']['Asian'] = $("#family_race_ethnicity").find("#selectedRaces-2").is(':checked');
		family_member_information['race']['Black or African-American'] = $("#family_race_ethnicity").find("#selectedRaces-3").is(':checked');
		family_member_information['race']['Native Hawaiian or Other Pacific Islander'] = $("#family_race_ethnicity").find("#selectedRaces-4").is(':checked');
		family_member_information['race']['White'] = $("#family_race_ethnicity").find("#selectedRaces-5").is(':checked');

		family_member_information['ethnicity'] = new Object();
		family_member_information['ethnicity']['Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		family_member_information['ethnicity']['Ashkenazi Jewish'] = $("#family_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		family_member_information['ethnicity']['Not Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-3").is(':checked');
		
		personal_information[current_relationship] = family_member_information;

		
		update_family_history_row(current_relationship, family_member_information);
		
//		alert ("Personal Information:" + JSON.stringify(personal_information, null, 2) );
		
		$("#update_family_member_health_history_dialog").dialog("close");
	});	
}

function bind_family_member_cancel_button_action () {
	$("#addFamilyMemberCancelButton").on("click", function(){ 
		alert ("Cancelling Family Member Information");
		$("#update_family_member_health_history_dialog").dialog("close");
	});
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
		
		
		for (var i=0; i<number_brothers;i++) personal_information['brother_' + i] = new Object();
		for (var i=0; i<number_sisters;i++) personal_information['sister_' + i] = new Object();
		for (var i=0; i<number_sons;i++) personal_information['son_' + i] = new Object();
		for (var i=0; i<number_daughters;i++) personal_information['daughter_' + i] = new Object();
		for (var i=0; i<number_maternal_uncles;i++) personal_information['maternal_uncle_' + i] = new Object();
		for (var i=0; i<number_maternal_aunts;i++) personal_information['maternal_aunt_' + i] = new Object();
		for (var i=0; i<number_paternal_uncles;i++) personal_information['paternal_uncle_' + i] = new Object();
		for (var i=0; i<number_paternal_aunts;i++) personal_information['paternal_aunt_' + i] = new Object();
		build_family_history_data_table();

		$("#add_all_family_members_dialog").dialog("close");
	});
	
}

function bind_add_all_family_members_cancel_button_action() {
	$("#create_immediate_family_cancel").on("click", function(){ 
		alert ("Cancelling Adding of Family Members");
		$("#add_all_family_members_dialog").dialog("close");
	});	
}

function load_risk_links() {
	$.getJSON( "./risk/risks.json", function( data ) {
		$("#risk_section").empty();
        $.each(data, function(index) {
            var risk_calculator = $("#risk_section").append($("<div class='assessmentContainer risk_calculator' href='" + data[index].link + "'>")
            	.append($("<h3></h3>").append(data[index].name))
            	.append($("<P>").append(data[index].description)));
            
            $("#risk_section").append(risk_calculator).append("<br>");
        });
        
        $(".risk_calculator").on("click", function() { 
        	$( "#risk_section" ).load( "risk/" + $(this).attr("href"), function(data) {
        		$(data).find("[pullfrom]").each(function (i, field) {
        			var pullfrom = $(field).attr("pullfrom");
        			var v = personal_information[pullfrom];
        			
        			// Do not know why using field directly doesn't work but this does
        			$("#" + $(field).attr("id")).val(v);
            	});
        	});        	
        });
	});
}


function build_family_history_data_table () {
	var table = $("#history_summary_table");
	
	add_family_history_header_row(table);
	
	add_new_family_history_row(table, personal_information['name'], "Self", "self", true, false);
	add_new_family_history_row(table, "", "Father", "father", false, false);
	add_new_family_history_row(table, "", "Mother", "mother", false, false);
	add_new_family_history_row(table, "", "Paternal Grandfather", "paternal_grandfather", false, false);
	add_new_family_history_row(table, "", "Paternal Grandmother", "paternal_grandmother", false, false);
	add_new_family_history_row(table, "", "Maternal Grandfather", "maternal_grandfather", false, false);
	add_new_family_history_row(table, "", "Maternal Grandmother", "maternal_grandmother", false, false);

	var i = 0;
	while (personal_information['brother_' + i] != null) {
		add_new_family_history_row(table, "", "Brother", "brother_" + i, false, false);
		i++;
	}
	i = 0;
	while (personal_information['sister_' + i] != null) {
		add_new_family_history_row(table, "", "Sister", "sister_" + i, false, false);
		i++;
	}
	i = 0;
	while (personal_information['son_' + i] != null) {
		add_new_family_history_row(table, "", "Son", "son_" + i, false, false);
		i++;
	}
	i = 0;
	while (personal_information['daughter_' + i] != null) {
		add_new_family_history_row(table, "", "Daughter", "daughter_" + i, false, false);
		i++;
	}

	i = 0;
	while (personal_information['maternal_uncle_' + i] != null) {
		add_new_family_history_row(table, "", "Maternal Uncle", "maternal_uncle_" + i, false, false);
		i++;
	}
	i = 0;
	while (personal_information['maternal_aunt_' + i] != null) {
		add_new_family_history_row(table, "", "Maternal Aunt", "maternal_aunt_" + i, false, false);
		i++;
	}
	while (personal_information['maternal_cousin_' + i] != null) {
		add_new_family_history_row(table, "", "Maternal Cousin", "maternal_cousin_" + i, false, false);
		i++;
	}

	
	i = 0;
	while (personal_information['paternal_uncle_' + i] != null) {
		add_new_family_history_row(table, "", "Paternal Uncle", "paternal_uncle_" + i, false, false);
		i++;
	}
	i = 0;
	while (personal_information['paternal_aunt_' + i] != null) {
		add_new_family_history_row(table, "", "Paternal Aunt", "paternal_aunt_" + i, false, false);
		i++;
	}
	while (personal_information['paternal_cousin_' + i] != null) {
		add_new_family_history_row(table, "", "Paternal Cousin", "paternal_cousin_" + i, false, false);
		i++;
	}

}

function add_family_history_header_row(table) {
	var header_row = $("<tr></tr>");
	header_row.append("<th scope='col' class='nowrap'>Name</th>");
	header_row.append("<th scope='col' abbr='Relationship' class='nowrap'>Relationship to Me</th>");
	header_row.append("<th scope='col' abbr='Add' class='nowrap'>Add History</th>");
	header_row.append("<th scope='col' abbr='Update' class='nowrap'>Update History</th>");
	header_row.append("<th scope='col' abbr='Remove' class='nowrap'>Remove Relative</th>");
	header_row.append("");
	table.empty().append(header_row);
}

function add_new_family_history_row(table, name, relationship, relationship_id, is_already_defined, is_removeable) {
	
	// Html requires that all blank fields have at least 1 char or it will not show border
	if (name == "") name = "&nbsp;";
	if (relationship == "") relationship = "&nbsp;";
	
	var new_row = $("<tr id='" + relationship_id + "'></tr>");
	new_row.addClass("proband");
	new_row.append("<td class='information' id='relatives_name'>" + name + "</td>");
	new_row.append("<td class='information' >" + relationship + "</td>");
	if (is_already_defined) {
		new_row.append("<td class='action add_history'>&nbsp;</td>");
		var update_history = $("<td class='action update_history'><img src='images/icon_edit.gif' alt='Update History' title='Update History'></td>");

		update_history.on("click", function(){ 
			alert("Updating history for: " + name)
			//			$( "#addPersonalInformation" ).dialog( "open" );
		});
		
		new_row.append(update_history);
		
		if (is_removeable) new_row.append("<td class='action remove_history'><img src='images/icon_trash.gif' alt='Remove History' title='Remove History'></td>");
		else new_row.append("<td class='action remove_history'>&nbsp;</td>");
		
	} else {
		var add_history = $("<td class='action add_history'><img src='images/icon_add.gif' alt='Add History' title='Add History'></td>")

		add_history.on("click", function(){ 
//			alert("Updating history for: " + relationship)
			$("#accordian_title_relationship").html(" <h2> Your " + relationship + "'s Health Information</h2>");
			
			current_relationship = relationship_id;
			clear_family_member_health_history_dialog();
			$( "#update_family_member_health_history_dialog" ).dialog( "open" );
		});

		
		new_row.append(add_history);
		new_row.append("<td class='action update_history'>&nbsp;</td>");
		new_row.append("<td class='action remove_history'>&nbsp;</td>");
	}
	table.append(new_row);
}

function update_family_history_row(relationship_id, family_member_information) {
	$("#" + relationship_id).find("#relatives_name").html(family_member_information["name"]);

	var update_history = $("<td class='action update_history'><img src='images/icon_edit.gif' alt='Update History' title='Update History'></td>");

	$("#" + relationship_id).find(".update_history").html("<img src='images/icon_edit.gif' alt='Update History' title='Update History'>");
	$("#" + relationship_id).find(".add_history").html("&nbsp;");
	
	$("#" + relationship_id).find(".update_history").on("click", function(){ 
		alert("Updating history for: " + name)
		//			$( "#addPersonalInformation" ).dialog( "open" );
	});

	$("#" + relationship_id).find(".add_history").off("click");
	
}

function build_history_edit_dialog () {
	
}


//  Information Sections

function build_family_health_information_section() {
	var information = $("#family_health_information");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='hi-title'>");
	bar.append("Your Family's Health Information");
	information.empty().append(bar);
	information.append($("<p class='instructions'>In the list below, select a Disease or Condition (if any) from the dropdown box. " +
	"Then select the Age at Diagnosis and press the Add button. You may repeat this process as necessary.</p>"))

	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>Disease or Condition</th>");
	hi_header_row.append("<th>Age at Diagnosis</th>");
	hi_header_row.append("<th>Action</th>");
	hi_health_history_table.append(hi_header_row);

	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");
	
	var disease_choices = get_disease_choice_select();
	hi_data_entry_row.append($("<td>").append(disease_choices).append("<br />&nbsp;&nbsp;"));
	
	var age_at_diagnosis_pulldown = get_age_at_diagnosis_pulldown();
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_pulldown));
	
	var add_new_disease_button = $("<button id='family_add_new_disease_button' name='Add' value'Add'> Add </button>");
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
	bar.append("Your Health Information");
	information.empty().append(bar);
	
	information.append($("<p class='instructions'>In the list below, select a Disease or Condition (if any) from the dropdown box. " +
			"Then select the Age at Diagnosis and press the Add button. You may repeat this process as necessary.</p>"))
	
	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>Disease or Condition</th>");
	hi_header_row.append("<th>Age at Diagnosis</th>");
	hi_header_row.append("<th>Action</th>");
	hi_health_history_table.append(hi_header_row);

	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");
	
	var disease_choices = get_disease_choice_select('');
	hi_data_entry_row.append($("<td>").append(disease_choices).append("<br />&nbsp;&nbsp;"));
	
	var age_at_diagnosis_pulldown = get_age_at_diagnosis_pulldown();
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_pulldown));
	
	var add_new_disease_button = $("<button id='add_new_disease_button' name='Add' value'Add'> Add </button>");
	add_new_disease_button.on('click', add_disease);

	
	hi_data_entry_row.append($("<td>").append(add_new_disease_button) );
	hi_health_history_table.append(hi_data_entry_row);
	
	information.append(hi_health_history_table);
	information.append("<br />");
}

function get_disease_choice_select () {
	var choice_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	choice_select.append("<option value='none'> Please Select a Disease </option>");
	for (disease_name in diseases) {
		choice_select.append("<option> " + disease_name + " </option>");		
	}
	
	choice_select.on('change', function() {
		var chosen_disease_name = $.trim($(this).find("option:selected" ).text());
		var disease_box = choice_select.parent();
		$(this).next().remove();
//		$("#detailed_disease_choice_select").remove();
		detailed_disease = get_detailed_disease(chosen_disease_name);
		var detailed_disease_list = "";
		detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
		if (detailed_disease.length > 0) {
			disease_box.append(detailed_disease_select);
			detailed_disease_select.append("<option value='none'> Please Select a Specific Subtype </option>");
			
			for (var i = 0; i < detailed_disease.length;i++) {
				detailed_disease_select.append("<option> " + detailed_disease[i] + " </option>");					
			}			
		}
	});
	return choice_select;
}

function get_detailed_disease (disease_name) {
	return diseases[disease_name];
}

function get_age_at_diagnosis_pulldown() {
	var age_at_diagnosis_select = $("<select name='age_at_diagnosis_select' id='age_at_diagnosis_select'></select>");
	age_at_diagnosis_select.append("<option value='Unknown'> --Select Age at Diagnosis </option>");
	age_at_diagnosis_select.append("<option> Pre-Birth </option>");
	age_at_diagnosis_select.append("<option> Newborn </option>");
	age_at_diagnosis_select.append("<option> In Infancy </option>");
	age_at_diagnosis_select.append("<option> In Childhood </option>");
	age_at_diagnosis_select.append("<option> In Adolescence </option>");
	age_at_diagnosis_select.append("<option> 20-29 years </option>");
	age_at_diagnosis_select.append("<option> 30-39 years </option>");
	age_at_diagnosis_select.append("<option> 40-49 years </option>");
	age_at_diagnosis_select.append("<option> 50-59 years </option>");
	age_at_diagnosis_select.append("<option> 60 years or older </option>");
	age_at_diagnosis_select.append("<option> Unknown </option>");
	
	return age_at_diagnosis_select;
}

function add_disease() {
//	alert($(this).parent().parent().parent().html());
	var disease_name = $(this).parent().parent().find("#disease_choice_select").val();
	var disease_detail = $(this).parent().parent().find("#detailed_disease_choice_select").val();
	var age_at_diagnosis = $(this).parent().parent().find("#age_at_diagnosis_select").val();
	
	specific_health_issue = {"Disease Name": disease_name,
	                          "Detailed Disease Name": disease_detail,
	                          "Age At Diagnosis": age_at_diagnosis};
	current_health_history.push(specific_health_issue);
	var row_number = current_health_history.length;
	
	
	var new_row=$("<tr class='disease_detail'>");
	if (disease_detail != null && disease_detail != 'none') {
		new_row.append("<td>" + disease_detail + "</td>");
	} else {
		new_row.append("<td>" + disease_name + "</td>");		
	}
	new_row.append("<td>" + age_at_diagnosis + "</td>");
	
	var remove_disease_button = $("<button id='remove_disease_button' row_number='" + row_number + "'> Remove </button>");
	remove_disease_button.on('click', remove_disease);
	new_row.append($("<td>").append(remove_disease_button));
	
//	$("#health_data_entry_row").before(new_row);
	$(this).parent().parent().parent().find("#health_data_entry_row").before(new_row);
	
	// Reset the fields
	$("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());
	
//	alert ("Adding: " + disease_name + ":" + disease_detail + ":" + age_at_diagnosis);
	return false;
}

function remove_disease() {
	var row_number = $(this).attr("row_number");

	// row_number starts at 1, the array starts at 0 so we need to subtract 1
	current_health_history.splice(row_number-1, 1);	
	
	$(this).parent().parent().remove();
//	alert ("Removing Disease Row: " + row_number);
	
	
	return false;
}

// Family Background Section

// Health Information Section

function build_personal_race_ethnicity_section() {
	var race_ethnicity = $("#personal_race_ethnicity");
	// First put up accordion entry
	var bar = $("<div class='title-bar'>Your Family Background Information</div>");
	race_ethnicity.empty().append(bar);
	
	
	var race_checkboxes = $("<td>" +
			"<input tabindex='21' name='selectedRaces' value='1' id='selectedRaces-1'  type='checkbox'>" +
			"<label for='selectedRaces-1' class='checkboxLabel'>American Indian or Alaska Native</label>" +
			"<input tabindex='21' name='selectedRaces' value='2' id='selectedRaces-2' type='checkbox'>" +
			"<label for='selectedRaces-2' class='checkboxLabel'>Asian</label>" +
			"<input tabindex='21' name='selectedRaces' value='3' id='selectedRaces-3' type='checkbox'>" +
			"<label for='selectedRaces-3' class='checkboxLabel'>Black or African-American</label>" +
		    "<br>" +
			"<input tabindex='21' name='selectedRaces' value='4' id='selectedRaces-4'  type='checkbox'>" +
			"<label for='selectedRaces-4' class='checkboxLabel'>Native Hawaiian or Other Pacific Islander</label>" +
			"<input tabindex='21' name='selectedRaces' value='5' id='selectedRaces-5'  type='checkbox'>" +
			"<label for='selectedRaces-5' class='checkboxLabel'>White</label>" +
			"</td>");

	var ethnicity_checkboxes = $("<td>" +
			"<input tabindex='24' name='selectedEthnicities' value='1' id='selectedEthnicities-1' type='checkbox'>" +
			"<label for='selectedEthnicities-1' class='checkboxLabel'>Hispanic or Latino</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='2' id='selectedEthnicities-2' type='checkbox'>" +
			"<label for='selectedEthnicities-2' class='checkboxLabel'>Ashkenazi Jewish</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='3' id='selectedEthnicities-3' type='checkbox'>" +
			"<label for='selectedEthnicities-3' class='checkboxLabel'>Not Hispanic or Latino</label>" +
			"</td>");

	race_ethnicity.
		append($("<table>")
				.append($("<tr>")
						.append("<td colspan='2'>Check here if your parents are related to each other in any way other than marriage.</td>")
						.append("<td><input name='person.consanguinity' value='true' tabindex='20' " +
									"id='person_consanguinity' type='checkbox'></td>"))
				.append($("<tr>")
						.append("<td colspan='2'>Multiple races and ethnicities may be selected.</td>") )
				.append($("<tr>")
						.append("<td>Race:</td>")
						.append(race_checkboxes) )
				.append($("<tr>")
						.append("<td> Ethnicity </td>")
						.append(ethnicity_checkboxes))
				.append($("<tr>")
						.append("<td colspan='2'><a tabindex='29' href='#' >Why are we asking about Ashkenazi Jewish heritage?</a></td>")));
	
}

function build_family_race_ethnicity_section() {
	var race_ethnicity = $("#family_race_ethnicity");
	// First put up accordion entry
	var bar = $("<div class='title-bar'>This Person's Family Background Information</div>");
	race_ethnicity.empty().append(bar);
	
	
	var race_checkboxes = $("<td>" +
			"<input tabindex='21' name='selectedRaces' value='1' id='selectedRaces-1'  type='checkbox'>" +
			"<label for='selectedRaces-1' class='checkboxLabel'>American Indian or Alaska Native</label>" +
			"<input tabindex='21' name='selectedRaces' value='2' id='selectedRaces-2' type='checkbox'>" +
			"<label for='selectedRaces-2' class='checkboxLabel'>Asian</label>" +
			"<input tabindex='21' name='selectedRaces' value='3' id='selectedRaces-3' type='checkbox'>" +
			"<label for='selectedRaces-3' class='checkboxLabel'>Black or African-American</label>" +
		    "<br>" +
			"<input tabindex='21' name='selectedRaces' value='4' id='selectedRaces-4'  type='checkbox'>" +
			"<label for='selectedRaces-4' class='checkboxLabel'>Native Hawaiian or Other Pacific Islander</label>" +
			"<input tabindex='21' name='selectedRaces' value='5' id='selectedRaces-5'  type='checkbox'>" +
			"<label for='selectedRaces-5' class='checkboxLabel'>White</label>" +
			"</td>");

	var ethnicity_checkboxes = $("<td>" +
			"<input tabindex='24' name='selectedEthnicities' value='1' id='selectedEthnicities-1' type='checkbox'>" +
			"<label for='selectedEthnicities-1' class='checkboxLabel'>Hispanic or Latino</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='2' id='selectedEthnicities-2' type='checkbox'>" +
			"<label for='selectedEthnicities-2' class='checkboxLabel'>Ashkenazi Jewish</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='3' id='selectedEthnicities-3' type='checkbox'>" +
			"<label for='selectedEthnicities-3' class='checkboxLabel'>Not Hispanic or Latino</label>" +
			"</td>");

	race_ethnicity.
		append($("<table>")
				.append($("<tr>")
						.append("<td colspan='2'>Multiple races and ethnicities may be selected.</td>") )
				.append($("<tr>")
						.append("<td>Race:</td>")
						.append(race_checkboxes) )
				.append($("<tr>")
						.append("<td> Ethnicity </td>")
						.append(ethnicity_checkboxes))
				.append($("<tr>")
						.append("<td colspan='2'><a tabindex='29' href='#' >Why are we asking about Ashkenazi Jewish heritage?</a></td>")));
	
}

function clear_family_member_health_history_dialog() {
	$("#family_member_info_form_name").val("");
	$('#family_member_info_form_gender_male').attr('checked',false);
	$('#family_member_info_form_gender_female').attr('checked',false);
	$("#family_member_info_form_date_of_birth").val("");
	$("#family_member_info_form_twin_status_no").attr('checked',true);
	$("#family_member_info_form_twin_status_identical").attr('checked',false);
	$("#family_member_info_form_twin_status_fraternal").attr('checked',false);
	$("#family_member_info_form_adopted_no").attr('checked',false);
	$("#family_member_height_feet").val("");
	$("#family_member_height_inches").val("");
	$("#family_member_height_centimeters").val("");
	$("#family_member_weight").val("");
	$("#family_member_weight_unit").val("US");
	
	$(".disease_detail").each(function () {
		$(this).remove();
	});
	
	$("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());
	current_health_history = [];
	
	$("#family_race_ethnicity").find("#selectedRaces-1").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-2").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-3").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-4").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-5").attr('checked',false);
	
	$("#family_race_ethnicity").find("#selectedEthnicities-1").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-2").attr('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-3").attr('checked',false);
	
}



