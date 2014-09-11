var personal_information = null;

// Constants From SNOMED_CT
var SNOMED_CT_CODES = {
		'IDENTICAL_TWIN_CODE': '313415001', 
		'FRATERNAL_TWIN_CODE':'313416000',
		'ADOPTED_CODE': '160496001'
}

function bind_load_xml() {
	$("#file_upload_button").on("click", function () {
    $("#view_diagram_and_table_button").attr('onclick', 'xmlload()');
		personal_information = new Object();
		
		var fsize = $('#pedigree_file')[0].files[0].size;
//		alert ("Filename is (" + fsize + "): " + $("#pedigree_file").val());
		
		var reader = new FileReader();
		reader.readAsText($('#pedigree_file')[0].files[0], "UTF-8");
		reader.onload = loaded;

		$("#load_personal_history_dialog").dialog("close");
		
		return false;
	});
	
	var button = $("<BUTTON id='dropbox_load_button'> Load from Dropbox </BUTTON>");
	button.on("click", function () {
		personal_information = new Object();
		Dropbox.choose({
		   multiselect: false,
		   linkType: "direct",
		   extensions: ['.xml'],
			 success: function (files) { 
				$.get( files[0].link, function( xmlData ) {
					var out = (new XMLSerializer()).serializeToString(xmlData);
					
					parse_xml(out);
					build_family_history_data_table();
					$("#add_another_family_member_button").show();
				}); 
			 },
			 error: function (errorMessage) { alert ("ERROR:" + errorMessage);}
		});
		$("#load_personal_history_dialog").dialog("close");
		
		return false;
	});
	$("#load_from_dropbox").append(button);	
}


function loaded (evt) {
	var fileString = evt.target.result;	
	parse_xml(fileString);
	build_family_history_data_table();
	$("#add_another_family_member_button").show();
}

function make_disease_array () {
	var keys = Object.keys(diseases);
	for (var i=0; i<keys.length;i++) {
		disease_list.push(keys[i]);
		for (var j=0; j<diseases[keys[i]].length; j++) {
			disease_list.push(diseases[keys[i]][j]);
		}
	}	
}

function parse_xml(data) {
	personal_information.id = $(data).find("patientPerson > id").attr("extension");
	// Handle the misspelling from the previous version of the software
	if (personal_information.id == null) personal_information.id = $(data).find("patientPerson > id").attr("extention");
	personal_information.name = $(data).find("patientPerson > name").attr("formatted");
	if (personal_information.name == null || personal_information.name.length == 0) personal_information.name = "";

	personal_information.date_of_birth = $(data).find("patientPerson > birthTime").attr("value");
	personal_information.gender = $(data).find("patientPerson > administrativeGenderCode").attr("displayName").toUpperCase();
	consanguity_flag = $(data).find('patientPerson > subjectOf2 > ClinicalObservation > code[originalText="Parental consanguinity indicated"]')
	if (consanguity_flag && consanguity_flag.length > 0) personal_information.consanguinity = true;
	
	// Twin and Adopted Status
	var identical_twin_status_field = $(data).find("patientPerson > subjectOf2 > ClinicalObservation > code[code="
			+ SNOMED_CT_CODES.IDENTICAL_TWIN_CODE + "]");
	if (identical_twin_status_field.length > 0) personal_information.twin_status = "IDENTICAL";
	var fraternal_twin_status_field = $(data).find("patientPerson > subjectOf2 > ClinicalObservation > code[code="
			+ SNOMED_CT_CODES.FRATERNAL_TWIN_CODE + "]");
	if (fraternal_twin_status_field.length > 0) personal_information.twin_status = "FRATERNAL";
	
	var adopted_status_field = $(data).find("patientPerson > subjectOf2 > ClinicalObservation > code[code="
			+ SNOMED_CT_CODES.ADOPTED_CODE + "]");
	if (adopted_status_field.length > 0) personal_information.adopted = "true";
	
	
	
	// Race and Ethnicity
	personal_information.ethnicity = load_ethnicity($(data) );
	personal_information.race = load_race(data); 

	// Height and Weight and actvity
	$(data).find("patientPerson > subjectOf2 > ClinicalObservation").each(function () {
		w = $(this).find("code[displayName='weight']").parent().find("value");
		if (w.attr("value")) {
			personal_information.weight = w.attr("value");
			personal_information.weight_unit = w.attr("unit");
		}
		h = $(this).find("code[displayName='height']").parent().find("value");
		if (h.attr("value")) {
			personal_information.height = h.attr("value");
			personal_information.height_unit = h.attr("unit");
		}
		active = $(this).find("code[displayName='Physically Active']").parent().find("value");
		if (active.attr("value")) {
			if (active.attr("value") == 'true') personal_information.physically_active = true;
			else personal_information.physically_active = false;
		}
	});
	
	// Personal Diseases
		current_health_history = new Array();
		// Looking for diseases, first we need to pull out the displayNames for every code tag
		$(data).find("patientPerson > subjectOf2 > ClinicalObservation > code").each( function() {

			specific_health_issue = get_specific_health_issue("Self", this);
//			alert("Me "+ JSON.stringify(specific_health_issue, null, 2));
			// Do not want to push duplicates
			var duplicate = false;
			for (var i=0;i<current_health_history.length;i++) {
				if 		(specific_health_issue && specific_health_issue["Disease Name"] ==  [i]["Disease Name"] &&
						 specific_health_issue["Detailed Disease Name"] == current_health_history[i]["Detailed Disease Name"]) {
					duplicate=true;break;
				}
			}
			if (specific_health_issue != null && !duplicate && specific_health_issue["Age At Diagnosis"] != null) 
				current_health_history.push(specific_health_issue);

//				alert(relative.name + ":"+ highLevelDiseaseName + ", " + detailedDiseaseName + ": " + ageAtDiagnosis);
		});
		personal_information["Health History"] = current_health_history;


	// All Relatives
	$(data).find("patientPerson > relative").each( function () {
		var relative = new Object();
		
		var relationship_code = $(this).find("code").attr("code");
		relative.id = $(this).find("> relationshipHolder > id").attr("extension");
		// Handle the misspelling from the previous version of the software
		if (relative.id == null) relative.id = $(this).find("> relationshipHolder > id").attr("extention");
		relative.name = $(this).find("relationshipHolder > name").attr("formatted");
		if (relative.name == null || relative.name.length == 0) relative.name = "";
//		alert(relative.name + ":" +relative.id);
		
//		var boo = $(this).find("> relationshipHolder > relative > relationshipHolder").html();
	// For the purpose of connecting the tree we only need one parent, also check for spelling error
		var parent_id = $(this).find("> relationshipHolder > relative > relationshipHolder > id").attr("extention");
		if (parent_id == null || parent_id.length == 0) 
			parent_id = $(this).find("> relationshipHolder > relative > relationshipHolder > id").attr("extension");
		
		if (parent_id  && parent_id.length > 0) {
			relative.parent_id = parent_id;
//			alert (relative.name + ":P(" + parent_id + ")");
		}			

		var gender_code =  $(this).find("administrativeGenderCode").attr("displayName");
		if (gender_code) relative.gender = gender_code.toUpperCase();
		relative.date_of_birth = $(this).find("relationshipHolder > birthTime").attr("value");

		relative.twin_status = 'NO';
		relative.adopted = 'false';
		$(this).find("relationshipHolder > subjectOf2 > clinicalObservation > code").each( function() {
			if ($(this).parent().html().indexOf(SNOMED_CT_CODES.IDENTICAL_TWIN_CODE) > -1) relative.twin_status = 'IDENTICAL';
			if ($(this).parent().html().indexOf(SNOMED_CT_CODES.FRATERNAL_TWIN_CODE) > -1) relative.twin_status = 'FRATERNAL';
			if ($(this).parent().html().indexOf(SNOMED_CT_CODES.ADOPTED_CODE) > -1) relative.adopted = 'true';
		});

		// Cause of Death
		

		var death = $(this).find("relationshipHolder > subjectOf2 > clinicalObservation > sourceOf > code[displayName='death']");
		if (death.length) {
			var death_age = get_age_at_diagnosis("", $(this).find("relationshipHolder > subjectOf1 > deceasedEstimatedAge"));
			var cause_of_death = death.parent().parent().children("code").attr("displayName");
			
//			alert (relative.name + " died around [" + death_age + "] of :[" + cause_of_death+ "]");
			relative.cause_of_death = get_disease_name_from_detailed_name(cause_of_death);
			if (relative.cause_of_death != cause_of_death) relative.detailed_cause_of_death = cause_of_death;
			relative.estimated_death_age = death_age;
		}
		
		current_health_history = new Array();
		// Looking for diseases, first we need to pull out the displayNames for every code tag
		$(this).find("code").each( function() {
			
//			alert(relative.name +" "+ $(this).attr("displayName"));

			specific_health_issue = get_specific_health_issue(relative.name, this);

			// Do not want to push duplicates
			var duplicate = false;
			for (var i=0;i<current_health_history.length;i++) {
				if 		(specific_health_issue && specific_health_issue["Disease Name"] ==  [i]["Disease Name"] &&
						 specific_health_issue["Detailed Disease Name"] == current_health_history[i]["Detailed Disease Name"]) {
					duplicate=true;break;
				}
			}
			if (specific_health_issue != null && !duplicate && specific_health_issue["Age At Diagnosis"] != null) 
				current_health_history.push(specific_health_issue);

//				alert(relative.name + ":"+ highLevelDiseaseName + ", " + detailedDiseaseName + ": " + ageAtDiagnosis);
		});
		relative['Health History'] = current_health_history;


		// Race and Ethnicity
		relative.ethnicity = new Object();
		$(this).find("ethnicGroupCode").each(function () {
			ethnicity = $(this).attr("displayName");
			relative.ethnicity[ethnicity] = true;
		});

		relative.race = new Object(); 
		$(this).find("raceCode").each(function () {
			race = $(this).attr("displayName");
			relative.race[race] = true;
		});

		if (relationship_code == "NMTH") {
			relative.relationship = 'mother';
			personal_information.mother = relative;
		}
		if (relationship_code == "NFTH") {
			relative.relationship = 'father';
			personal_information.father = relative;
		}
		if (relationship_code == "MGRMTH") {
			relative.relationship = 'maternal_grandmother';
			personal_information.maternal_grandmother = relative;
		}
		if (relationship_code == "MGRFTH") {
			relative.relationship = 'maternal_grandfather';
			personal_information.maternal_grandfather = relative;
		}
		if (relationship_code == "PGRMTH") {
			relative.relationship = 'paternal_grandmother';
			personal_information.paternal_grandmother = relative;
		}
		if (relationship_code == "PGRFTH") {
			relative.relationship = 'paternal_grandfather';
			personal_information.paternal_grandfather = relative;
		}
		
		if (relationship_code == "NBRO") {
			var i = 0;
			while (personal_information["brother_" + i] != null) i++;
			relative.relationship = 'brother';
			personal_information["brother_" + i] = relative;
		}
		if (relationship_code == "NSIS") {
			var i = 0;
			while (personal_information["sister_" + i] != null) i++;
			relative.relationship = 'sister';
			personal_information["sister_" + i] = relative;
		}
		if (relationship_code == "SON") {
			var i = 0;
			while (personal_information["son_" + i] != null) i++;
			relative.relationship = 'son';
			personal_information["son_" + i] = relative;
		}
		if (relationship_code == "DAU") {
			var i = 0;
			while (personal_information["daughter_" + i] != null) i++;
			relative.relationship = 'daughter';
			personal_information["daughter_" + i] = relative;
		}
		
		if (relationship_code == "MAUNT") {
			var i = 0;
			while (personal_information["maternal_aunt_" + i] != null) i++;
			relative.relationship = 'maternal_aunt';
			personal_information["maternal_aunt_" + i] = relative;
		}
		if (relationship_code == "MUNCLE") {
			var i = 0;
			while (personal_information["maternal_uncle_" + i] != null) i++;
			relative.relationship = 'maternal_uncle';
			personal_information["maternal_uncle_" + i] = relative;
		}
		if (relationship_code == "PAUNT") {
			var i = 0;
			while (personal_information["paternal_aunt_" + i] != null) i++;
			relative.relationship = 'paternal_aunt';
			personal_information["paternal_aunt_" + i] = relative;
		}
		if (relationship_code == "PUNCLE") {
			var i = 0;
			while (personal_information["paternal_uncle_" + i] != null) i++;
			relative.relationship = 'paternal_uncle';
			personal_information["paternal_uncle_" + i] = relative;
		}
		
		if (relationship_code == "HBRO") {
			if ($(this).find("relationshipHolder > relative").html().indexOf("NMTH") > -1) {
				var i = 0;
				while (personal_information["maternal_halfbrother_" + i] != null) i++;
				relative.relationship = 'maternal_halfbrother';
				personal_information["maternal_halfbrother_" + i] = relative;				
			} else {
				var i = 0;
				while (personal_information["paternal_halfbrother_" + i] != null) i++;
				relative.relationship = 'paternal_halfbrother';
				personal_information["paternal_halfbrother_" + i] = relative;				
			}
		}
		if (relationship_code == "HSIS") {
			if ($(this).find("relationshipHolder > relative").html().indexOf("NMTH") > -1) {
				var i = 0;
				while (personal_information["maternal_halfsister_" + i] != null) i++;
				relative.relationship = 'maternal_halfsister';
				personal_information["maternal_halfsister_" + i] = relative;				
			} else {
				var i = 0;
				while (personal_information["paternal_halfsister_" + i] != null) i++;
				relative.relationship = 'paternal_halfsister';
				personal_information["paternal_halfsister_" + i] = relative;				
			}
		}

		if (relationship_code == "NEPHEW") {
			var i = 0;
			while (personal_information["nephew_" + i] != null) i++;
			relative.relationship = 'nephew';
			personal_information["nephew_" + i] = relative;
		}
		if (relationship_code == "NIECE") {
			var i = 0;
			while (personal_information["niece_" + i] != null) i++;
			relative.relationship = 'neice';
			personal_information["niece_" + i] = relative;
		}

		if (relationship_code == "MCOUSN") {
			var i = 0;
			while (personal_information["maternal_cousin_" + i] != null) i++;
			relative.relationship = 'maternal_cousin';
			personal_information["maternal_cousin_" + i] = relative;
		}
		if (relationship_code == "PCOUSN") {
			var i = 0;
			while (personal_information["paternal_cousin_" + i] != null) i++;
			relative.relationship = 'paternal_cousin';
			personal_information["paternal_cousin_" + i] = relative;
		}
		if (relationship_code == "GRDSON") {
			var i = 0;
			while (personal_information["grandson_" + i] != null) i++;
			relative.relationship = 'grandson';
			personal_information["grandson_" + i] = relative;
		}
		if (relationship_code == "GRDDAU") {
			var i = 0;
			while (personal_information["granddaughter_" + i] != null) i++;
			relative.relationship = 'granddaughter';
			personal_information["granddaughter_" + i] = relative;
		}
		
		relative = null;
	});
	
//	alert (JSON.stringify(personal_information, null, 2));
	
}

function get_specific_health_issue (relative_name, data) {
	
//	alert(relative_name + " " + $(data).attr('displayName'));
	var detailedDiseaseName = $(data).attr('displayName');

		highLevelDiseaseName = get_disease_name_from_detailed_name(detailedDiseaseName);
		// Now have to get age at diagnosis
	if (highLevelDiseaseName) {
		ageAtDiagnosis = get_age_at_diagnosis(relative_name + ","+ highLevelDiseaseName + ", " + detailedDiseaseName, 
				$(data).parent().find('subject > dataEstimatedAge'));
					
		var specific_health_issue = {"Disease Name": highLevelDiseaseName,
                    "Detailed Disease Name": detailedDiseaseName,
                    "Age At Diagnosis": ageAtDiagnosis};
		return specific_health_issue;
	}
	// no disease found
	return null;
}

function get_disease_name_from_detailed_name(detailedDiseaseName) {
	if ($.inArray(detailedDiseaseName, disease_list) != -1) {
		// We have the detailed disease name, now we need the high-level disease name
		var keys = Object.keys(diseases);
		for (var i=0; i<keys.length;i++) {
			if (diseases[keys[i]].length == 0) {
				highLevelDiseaseName = detailedDiseaseName;
				break;
			}
			// We can also accept a disease that is at the high level
			if ($.inArray(detailedDiseaseName, diseases[keys[i]]) != -1) {
				highLevelDiseaseName = keys[i];
				break;
			}
		}
		return highLevelDiseaseName;
	} else {
		return null;
	}
}


function load_ethnicity(node) {
	// Race and Ethnicity
	ethnicity = new Object(); 
	node.find("patientPerson > ethnicGroupCode").each(function () {
		ethnicity_tag = $(this).attr("displayName");
		ethnicity[ethnicity_tag] = true;
	});
	return ethnicity;
}

function load_race(data) {
	race = new Object(); 
	$(data).find("patientPerson > raceCode").each(function () {
		race_tag = $(this).attr("displayName");
		race[race_tag] = true;
	});
	return race;
}


function get_age_at_diagnosis (text, xml_snippet) {
	if (xml_snippet == null) return "";
	
	if (xml_snippet.html() && xml_snippet.html().indexOf("pre-birth") > -1) return 'Pre-Birth';
	var estimated_age = xml_snippet.html();
	if (estimated_age && estimated_age.indexOf('unit="day"') > -1) {
		if (estimated_age.indexOf('value="0"') > -1) return "NewBorn";
		if (estimated_age.indexOf('value="29"') > -1) return "In Infancy";
	}
	if (estimated_age && estimated_age.indexOf('unit="year"') > -1) {
		if (estimated_age.indexOf('value="2"') > -1) return "In Childhood";
		if (estimated_age.indexOf('value="10"') > -1) return "In Adolescence";
		if (estimated_age.indexOf('value="20"') > -1) return "20-29 years";
		if (estimated_age.indexOf('value="30"') > -1) return "30-39 years";
		if (estimated_age.indexOf('value="40"') > -1) return "40-49 years";
		if (estimated_age.indexOf('value="50"') > -1) return "50-59 years";
		if (estimated_age.indexOf('value="60"') > -1) return "60 years or older";
	}
	if (xml_snippet.html() && xml_snippet.html().indexOf("unknown") > -1) return 'Unknown';

	return null;
}

