var XML_FORMAT_ID = 718163810183;
var TOOL_NAME = "Surgeon General's Family Heath History Tool";
var doc;
var SNOMED_CODE = {
	MALE:248153007, FEMALE:248152002,
	HEIGHT:271603002, WEIGHT:107647005,
	DEATH:419620001,
	IDENTICAL_TWIN:313415001,
	FRATERNAL_TWIN:313416000,
	ADOPTED:160496001,
	PHYSICALLY_ACTIVE:228447005
};

var LOINC_CODE = {
	ESTIMATED_AGE:"21611-9",
	AGE_AT_DEATH:"39016-1"
};

var XMLNS_SCHEMA= "http://www.w3.org/2001/XMLSchema-instance";



function bind_save_xml() {
	$("#download_xml").on("click", function () {
		doc = document.implementation.createDocument("urn:hl7-org:v3", "FamilyHistory", null);

		var root = doc.createElement("FamilyHistory");
		add_root_information(root);
		root.appendChild(add_personal_history(personal_information));

		
		save_document($(this), root, personal_information);

		
		$("#save_personal_history_dialog").dialog("close");

		
	});

	var button = $("<BUTTON id='dropbox_save_button'> Save to Dropbox </BUTTON>");
	
	button.on("click", function () {
		doc = document.implementation.createDocument("urn:hl7-org:v3", "FamilyHistory", null);
		var root = doc.createElement("FamilyHistory");
		add_root_information(root);
		root.appendChild(add_personal_history(personal_information));
		var s = new XMLSerializer();
		var output_string = s.serializeToString(root);
		var filename = "family_health_history.xml";
		if (personal_information && personal_information.name) {
			filename = personal_information.name.replace(/ /g,"_") + "_Health_History.xml";
		} 

		Dropbox.save({
		   files: [ {'url': 'data:application/xml,' + output_string, 'filename': filename } ],
			 success: function () { alert ("SUCCESS"); },
			 error: function (errorMessage) { alert ("ERROR:" + errorMessage);}
		});
		
	});
	$("#save_to_dropbox").append(button);

//	var button = Dropbox.createSaveButton({
//	   files: [ {'url': 'data:application/xml,<TEST>Data</TEST>', 'filename': 'data.xml' } ],
//		 success: function () { alert ("SUCCESS"); },
//		 error: function (errorMessage) { alert ("ERROR:" + errorMessage);}
//	});
	


//	$("#save_to_dropbox").on("click", function () {
//		alert ("Here");
//	});

}
function add_root_information(root) {
	root.setAttribute("moodCode", "EVN");
	root.setAttribute("classCode", "OBS");
	id_tag = doc.createElement("id");
	id_tag.setAttribute("extention", "gov.hhs.fhh:" + XML_FORMAT_ID);
	root.appendChild(id_tag);
	effectiveTime_tag = doc.createElement("effectiveTime");
	date = new Date();
	effectiveTime_tag.setAttribute("value", date.toLocaleDateString());
	root.appendChild(effectiveTime_tag);
	methodCode_tag = doc.createElement("methodCode");
	methodCode_tag.setAttribute("displayName", TOOL_NAME);
	root.appendChild(methodCode_tag);
	
}

function add_personal_history(pi) {
	subject_tag = doc.createElement("subject");
	subject_tag.setAttribute("typeCode", "SBJ");
	
	patient_tag = doc.createElement("patient");
	patient_tag.setAttribute("classCode", "PAT");
	subject_tag.appendChild(patient_tag);
	
	patientPerson_tag = doc.createElement("patientPerson");
	patient_tag.appendChild(patientPerson_tag);
	
	add_personal_information (patientPerson_tag, pi);
	return subject_tag;
}

function add_personal_information(patient_tag, pi) {
	if (personal_information == null) return;
	
	add_id(patient_tag, pi.id);
	add_name(patient_tag, pi.name);
	add_birthday(patient_tag, pi.date_of_birth);
	add_gender(patient_tag, pi.gender);
	add_all_ethnic_groups(patient_tag, pi.ethnicity);
	add_all_races(patient_tag, pi.race);	
	add_clinical_observations(patient_tag, 
			pi.height,
			pi.height_unit,
			pi.weight,
			pi.weight_unit,
			pi.consanguinity,
			pi["Health History"],
			null,
			pi.twin_status,
			pi.adopted,
			pi.physically_active
	); 
	add_relatives(patient_tag, pi);
}

function add_id(tag, id_text) {
	if (id_text == null) return;
	id_tag = doc.createElement("id");
	id_tag.setAttribute("extension", id_text);

	tag.appendChild(id_tag);
}

function add_name(tag, personal_name) {
	if (personal_name == null || personal_name=='undefined') personal_name="";
	name_tag = doc.createElement("name");
	name_tag.setAttribute("formatted", personal_name);

	tag.appendChild(name_tag);
}

function add_birthday(tag, birthday) {
	if (birthday == null) return;
	birthday_tag = doc.createElement("birthTime");
	birthday_tag.setAttribute("value", birthday);

	tag.appendChild(birthday_tag);
}

function add_parent(tag, parent_id) {
	
	var relative_tag = doc.createElement("relative");
	tag.appendChild(relative_tag);

	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "Parent");
	code_tag.setAttribute("codeSystemName", "HL7 Family History Model");
	code_tag.setAttribute("code", "PAR");
	relative_tag.appendChild(code_tag);

	var relationshipHolder_tag = doc.createElement("relationshipHolder");
	relative_tag.appendChild(relationshipHolder_tag);

	if (parent_id != null)  {
		var id_tag = doc.createElement("id");
		id_tag.setAttribute("extension", "" + parent_id);
		relationshipHolder_tag.appendChild(id_tag);
	}
}

function add_gender(tag, gender) {
	gender_tag = doc.createElement("administrativeGenderCode");
	gender_tag.setAttribute("codeSystemName", "SNOMED_CT");

	if (gender == "MALE") {
		gender_tag.setAttribute("displayName", "male");
		gender_tag.setAttribute("code", SNOMED_CODE.MALE);
		
	} else 	if (gender == "FEMALE") {
		gender_tag.setAttribute("displayName", "female");
		gender_tag.setAttribute("code", SNOMED_CODE.FEMALE);
	}
	tag.appendChild(gender_tag);
}

function add_consanguinity(tag, consanguinity) {
	if (consanguinity) {
		var consanguinity_tag = doc.createElement("clinicalObservation");
		tag.appendChild(consanguinity_tag);
		var code_tag = doc.createElement("code");
		code_tag.setAttribute("originalText", "Parental consanguinity indicated");
		consanguinity_tag.appendChild(code_tag);
	}
}

function add_all_ethnic_groups(tag, ethnic_group_list) {
	if (ethnic_group_list == null) return
	if (ethnic_group_list["Hispanic or Latino"]	== true) add_individual_ethnic_group(tag, "Hispanic or Latino");
	if (ethnic_group_list["Ashkenazi Jewish"]	== true) add_individual_ethnic_group(tag, "Ashkenazi Jewish");
	if (ethnic_group_list["Not Hispanic or Latino"]	== true) add_individual_ethnic_group(tag, "Not Hispanic or Latino");
}

function add_individual_ethnic_group(tag, ethnic_group) {
	ethnic_group_tag = doc.createElement("ethnicGroupCode");
	ethnic_group_tag.setAttribute("displayName", ethnic_group);
	cv = get_code_for_ethnicity(ethnic_group);
	ethnic_group_tag.setAttribute("code", cv.code );
	ethnic_group_tag.setAttribute("codeSystemName", cv.code_system);
	if (cv.id) ethnic_group_tag.setAttribute("id", cv.id);
	if (cv.xsi_type) ethnic_group_tag.setAttribute("xsi:type", cv.xsi_type);
	if (cv.ns) ethnic_group_tag.setAttribute("xmlns:xsi", cv.ns);
	
	tag.appendChild(ethnic_group_tag);
}

function add_all_races(tag, race_list) {
	if (race_list == null) return

	if (race_list["American Indian or Alaska Native"]	== true) add_individual_race(tag, "American Indian or Alaska Native");
	if (race_list["Asian"]	== true) add_individual_race(tag, "Asian");
	if (race_list["Black or African-American"]	== true) add_individual_race(tag, "Black or African-American");
	if (race_list["Native Hawaiian or Other Pacific Islander"]	== true) add_individual_race(tag, "Native Hawaiian or Other Pacific Islander");
	if (race_list["White"]	== true) add_individual_race(tag, "White");

	if (race_list["Asian Indian"]	== true) add_individual_race(tag, "Asian Indian");
	if (race_list["Chinese"]	== true) add_individual_race(tag, "Chinese");
	if (race_list["Filipino"]	== true) add_individual_race(tag, "Filipino");
	if (race_list["Japanese"]	== true) add_individual_race(tag, "Japanese");
	if (race_list["Korean"]	== true) add_individual_race(tag, "Korean");
	if (race_list["Vietnamese"]	== true) add_individual_race(tag, "Vietnamese");
	if (race_list["Other Asian"]	== true) add_individual_race(tag, "Other Asian");
	if (race_list["Unknown Asian"]	== true) add_individual_race(tag, "Unknown Asian");

	if (race_list["Chamorro"]	== true) add_individual_race(tag, "Chamorro");
	if (race_list["Guamanian"]	== true) add_individual_race(tag, "Guamanian");
	if (race_list["Native Hawaiian"]	== true) add_individual_race(tag, "Native Hawaiian");
	if (race_list["Somoan"]	== true) add_individual_race(tag, "Somoan");
	if (race_list["Unknown South Pacific Islander"]	== true) add_individual_race(tag, "Unknown South Pacific Islander");

}

function add_individual_race(tag, race) {
	race_tag = doc.createElement("raceCode");
	race_tag.setAttribute("displayName", race);
	cv = get_code_for_race(race);
	race_tag.setAttribute("code", cv.code );
	race_tag.setAttribute("codeSystemName", cv.code_system);
	if (cv.id) race_tag.setAttribute("id", cv.id);
	if (cv.xsi_type) race_tag.setAttribute("xsi:type", cv.xsi_type);
	if (cv.ns) race_tag.setAttribute("xmlns:xsi", cv.ns);
	
	tag.appendChild(race_tag);
}

function add_clinical_observations(tag, 
		height, height_unit, 
		weight, weight_unit, 
		consanguinity, 
		diseases, 
		cause_of_death,
		twin_status,
		adopted_flag, 
		active_flag) 
{
	var subjectOfTwo_tag = doc.createElement("subjectof2");
	tag.appendChild(subjectOfTwo_tag);

	add_twin_tag(subjectOfTwo_tag, twin_status);
	add_adopted_tag(subjectOfTwo_tag, adopted_flag);
	add_active_tag(subjectOfTwo_tag, active_flag);
	
	add_height(subjectOfTwo_tag, height, height_unit);
	add_weight(subjectOfTwo_tag, weight, weight_unit);
	add_consanguinity(subjectOfTwo_tag, consanguinity);
	add_diseases(subjectOfTwo_tag, diseases);
	add_cause_of_death(subjectOfTwo_tag, cause_of_death);
}

function add_twin_tag(tag, twin_status) {
	if (twin_status == null || twin_status == "") return;
	if (!(twin_status == "IDENTICAL" || twin_status == "FRATERNAL")) return;
	
	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);
	
	var code_tag = doc.createElement("code");
	if (twin_status == "IDENTICAL") {
		code_tag.setAttribute("displayName", "Identical twin (person)");
		code_tag.setAttribute("codeSystemName", "SNOMED_CT");
		code_tag.setAttribute("code", SNOMED_CODE.IDENTICAL_TWIN);
	} else if (twin_status == "FRATERNAL") {
		code_tag.setAttribute("displayName", "Fraternal twin (person)");
		code_tag.setAttribute("codeSystemName", "SNOMED_CT");
		code_tag.setAttribute("code", SNOMED_CODE.FRATERNAL_TWIN);
	}
	observation_tag.appendChild(code_tag);
}

function add_adopted_tag(tag, adopted_tag) {
	if (adopted_tag == null || adopted_tag != "true") return;

	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);

	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "adopted");
	code_tag.setAttribute("codeSystemName", "SNOMED_CT");
	code_tag.setAttribute("code", SNOMED_CODE.ADOPTED);

	observation_tag.appendChild(code_tag);
}

function add_active_tag(tag, active_tag) {
	if (active_tag == null) return;

	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);

	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "Physically Active");
	code_tag.setAttribute("codeSystemName", "SNOMED_CT");
	code_tag.setAttribute("code", SNOMED_CODE.PHYSICALLY_ACTIVE);
	observation_tag.appendChild(code_tag);
	
	var value_tag = doc.createElement("value");
	value_tag.setAttribute("value", active_tag);
	observation_tag.appendChild(value_tag);

}
function add_height(tag, height, height_unit) {
	if (height == null || height == "") return;
	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);
	
	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "height");
	code_tag.setAttribute("codeSystemName", "SNOMED_CT");
	code_tag.setAttribute("code", SNOMED_CODE.HEIGHT);
	observation_tag.appendChild(code_tag);

	var value_tag = doc.createElement("value");
	value_tag.setAttribute("value", height);
	value_tag.setAttribute("unit", height_unit);
	observation_tag.appendChild(value_tag);
}

function add_weight(tag, weight, weight_unit) {
	if (weight == null || weight == "") return;
	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);
	
	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "weight");
	code_tag.setAttribute("codeSystemName", "SNOMED_CT");
	code_tag.setAttribute("code", SNOMED_CODE.WEIGHT);
	observation_tag.appendChild(code_tag);

	var value_tag = doc.createElement("value");
	value_tag.setAttribute("value", weight);
	value_tag.setAttribute("unit", weight_unit);
	observation_tag.appendChild(value_tag);
}

function add_diseases(tag, diseases) {
	if (diseases == null) return;
	for (var i=0; i<diseases.length;i++) {
		var disease_name = diseases[i]["Disease Name"];
		var detailed_disease_name = diseases[i]["Detailed Disease Name"];
		if (!detailed_disease_name) detailed_disease_name = disease_name;
		var age_at_diagnosis = diseases[i]["Age At Diagnosis"];
		
		var observation_tag = doc.createElement("clinicalObservation");
		tag.appendChild(observation_tag);

		var code_tag = doc.createElement("code");
		code_tag.setAttribute("displayName", detailed_disease_name);
		code_tag.setAttribute("originalText", detailed_disease_name);
		code_tag.setAttribute("codeSystemName", "SNOMED COMPLETE"); // 
		observation_tag.appendChild(code_tag);
		
		var subject_tag = doc.createElement("subject");
		observation_tag.appendChild(subject_tag);

		var dataEstimatedAge_tag = doc.createElement("dataEstimatedAge");
		subject_tag.appendChild(dataEstimatedAge_tag);
		
		var new_code_tag = doc.createElement("code");
		new_code_tag.setAttribute("displayName", "Estimated Age");
		new_code_tag.setAttribute("codeSystemName", "LOINC");
		new_code_tag.setAttribute("code", LOINC_CODE.ESTIMATED_AGE);
		dataEstimatedAge_tag.appendChild(new_code_tag);		
		
		add_estimated_age_tag(dataEstimatedAge_tag, age_at_diagnosis);
		}
}

function add_estimated_age_tag(tag, estimated_age) {
	var av = get_age_values_from_estimated_age(estimated_age);
	if (estimated_age == "Pre-Birth") {
		var new_code_tag = doc.createElement("code");
		new_code_tag.setAttribute("originalText", "pre-birth");
		tag.appendChild(new_code_tag);
	} else if (estimated_age == "Unknown") {
		var new_code_tag = doc.createElement("code");
		new_code_tag.setAttribute("originalText", "unknown");
		tag.appendChild(new_code_tag);
	} else {
		
		// These estimates ages have high, low, and unit tags/attr

		var new_value_tag = doc.createElement("value");
		tag.appendChild(new_value_tag);

		if (av && av.unit) {
			new_value_tag.setAttribute("unit", av.unit);
		}

		if (av && av.low) {
			var low_tag = doc.createElement("low");
			low_tag.setAttribute("value", av.low);
			new_value_tag.appendChild(low_tag);
		}		

		if (av && av.high) {
			var high_tag = doc.createElement("high");
			high_tag.setAttribute("value", av.high);
			new_value_tag.appendChild(high_tag);
		}		
	}	
}


function add_death_status (tag, cause_of_death) {
	if (cause_of_death == null) return;
	var deceasedIndCode_tag = doc.createElement("deceasedIndCode");
	deceasedIndCode_tag.setAttribute("value", "true");
	tag.appendChild(deceasedIndCode_tag);
}

function add_death_age(tag, estimated_death_age) {
	if (estimated_death_age == null) return;
	
	var subjectOfOne_tag = doc.createElement("subjectOf1");
	tag.appendChild(subjectOfOne_tag);
	var deceasedEstimatedAge_tag = doc.createElement("deceasedEstimatedAge");
	subjectOfOne_tag.appendChild(deceasedEstimatedAge_tag);
	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "Age at Death");
	code_tag.setAttribute("codeSystemName", "LOINC");
	code_tag.setAttribute("code", LOINC_CODE.AGE_AT_DEATH);
	deceasedEstimatedAge_tag.appendChild(code_tag);
	var value_tag = doc.createElement("value");
	
	add_estimated_age_tag(deceasedEstimatedAge_tag, estimated_death_age);
	
}

function add_cause_of_death(tag, cause_of_death) {
	if (cause_of_death == null) return;

	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);

	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", cause_of_death);
	code_tag.setAttribute("originalText", cause_of_death);
	code_tag.setAttribute("codeSystemName", "SNOMED COMPLETE");
	observation_tag.appendChild(code_tag);
	
	var sourceOf_tag = doc.createElement("sourceOf");
	observation_tag.appendChild(sourceOf_tag);
	var newcode_tag = doc.createElement("code");
	newcode_tag.setAttribute("displayName", "death");
	newcode_tag.setAttribute("codeSystemName", "SNOMED_CT");
	newcode_tag.setAttribute("code", SNOMED_CODE.DEATH);
	sourceOf_tag.appendChild(newcode_tag);
}

function add_relatives(tag, pi) {
	if (pi.mother) add_individual_relative(tag, "Mother", "NMTH", pi.mother);
	if (pi.father) add_individual_relative(tag, "Father", "NFTH", pi.father);
	if (pi.maternal_grandmother) add_individual_relative(tag, "Maternal Grandmother", "MGRMTH", pi.maternal_grandmother);
	if (pi.maternal_grandfather) add_individual_relative(tag, "Maternal Grandfather", "MGRFTH", pi.maternal_grandfather);
	if (pi.paternal_grandmother) add_individual_relative(tag, "Paternal Grandmother", "PGRMTH", pi.paternal_grandmother);
	if (pi.paternal_grandfather) add_individual_relative(tag, "Paternal Grandfather", "PGRFTH", pi.paternal_grandfather);

	var i = 0;
	while (pi['brother_' + i] != null) {
		add_individual_relative(tag, "Brother", "NBRO", pi['brother_' + i]);
		i++;
	}
	
	var i = 0;
	while (pi['sister_' + i] != null) {
		add_individual_relative(tag, "Sister", "NSIS", pi['sister_' + i]);
		i++;
	}

	var i = 0;
	while (pi['son_' + i] != null) {
		add_individual_relative(tag, "Son", "SON", pi['son_' + i]);
		i++;
	}

	var i = 0;
	while (pi['daughter_' + i] != null) {
		add_individual_relative(tag, "Daughter", "DAU", pi['daughter_' + i]);
		i++;
	}

	var i = 0;
	while (pi['maternal_aunt_' + i] != null) {
		add_individual_relative(tag, "Maternal Aunt", "MAUNT", pi['maternal_aunt_' + i]);
		i++;
	}

	var i = 0;
	while (pi['maternal_uncle_' + i] != null) {
		add_individual_relative(tag, "Maternal Uncle", "MUNCLE", pi['maternal_uncle_' + i]);
		i++;
	}

	var i = 0;
	while (pi['paternal_aunt_' + i] != null) {
		add_individual_relative(tag, "Paternal Aunt", "PAUNT", pi['paternal_aunt_' + i]);
		i++;
	}

	var i = 0;
	while (pi['paternal_uncle_' + i] != null) {
		add_individual_relative(tag, "Paternal Uncle", "PUNCLE", pi['paternal_uncle_' + i]);
		i++;
	}

	var i = 0;
	while (pi['maternal_cousin_' + i] != null) {
		add_individual_relative(tag, "Maternal Cousin", "MCOUSN", pi['maternal_cousin_' + i]);
		i++;
	}

	var i = 0;
	while (pi['paternal_cousin_' + i] != null) {
		add_individual_relative(tag, "Paternal Cousin", "PCOUSN", pi['paternal_cousin_' + i]);
		i++;
	}

	var i = 0;
	while (pi['niece_' + i] != null) {
		add_individual_relative(tag, "Niece", "NIECE", pi['niece_' + i]);
		i++;
	}

	var i = 0;
	while (pi['nephew_' + i] != null) {
		add_individual_relative(tag, "Nephew", "NEPHEW", pi['nephew_' + i]);
		i++;
	}

	var i = 0;
	while (pi['grandson_' + i] != null) {
		add_individual_relative(tag, "Grandson", "GRDSON", pi['grandson_' + i]);
		i++;
	}

	var i = 0;
	while (pi['granddaughter_' + i] != null) {
		add_individual_relative(tag, "GrandDaughter", "GRDDAU", pi['granddaughter_' + i]);
		i++;
	}
	
	var i = 0;
	while (pi['maternal_halfbrother_' + i] != null) {
		add_individual_relative(tag, "Maternal Halfbrother", "MHBRO", pi['maternal_halfbrother_' + i]);
		i++;
	}

	var i = 0;
	while (pi['maternal_halfsister_' + i] != null) {
		add_individual_relative(tag, "Maternal Halfsister", "MHSIS", pi['maternal_halfsister_' + i]);
		i++;
	}

	var i = 0;
	while (pi['paternal_halfbrother_' + i] != null) {
		add_individual_relative(tag, "Paternal Halfbrother", "PHBRO", pi['paternal_halfbrother_' + i]);
		i++;
	}

	var i = 0;
	while (pi['paternal_halfsister_' + i] != null) {
		add_individual_relative(tag, "Paternal Halfsister", "PHSIS", pi['paternal_halfsister_' + i]);
		i++;
	}

}

function add_individual_relative(tag, relative_type, code, relative) {
	var relative_tag = doc.createElement("relative");
	tag.appendChild(relative_tag);
	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", relative_type);
	code_tag.setAttribute("codeSystemName", "HL7 Family History Model");
	code_tag.setAttribute("code", code);	
	relative_tag.appendChild(code_tag);
	
	var relationshipHolder_tag = doc.createElement("relationshipHolder");
	relative_tag.appendChild(relationshipHolder_tag);
	
	add_parent(relationshipHolder_tag, relative.parent_id);
	add_gender(relationshipHolder_tag, relative.gender);
	add_all_ethnic_groups(relationshipHolder_tag, relative.ethnicity);
	add_all_races(relationshipHolder_tag, relative.race);	
	add_death_age(relationshipHolder_tag, relative.estimated_death_age);
	add_clinical_observations(relationshipHolder_tag, 
			null, null,
			null, null,
			null,
			relative["Health History"],
			relative.detailed_cause_of_death,
			relative.twin_status,
			relative.adopted,
			null
	); 
	add_id(relationshipHolder_tag, relative.id);
	add_name(relationshipHolder_tag, relative.name);
	add_birthday(relationshipHolder_tag, relative.date_of_birth);
	add_death_status(relationshipHolder_tag, relative.cause_of_death);

}
// Functions to convert between code systems and display names
function get_code_for_ethnicity(str) {
	switch (str) {
		case "Hispanic or Latino": return {code:"2135-2", code_system:"HL7-TBD", id:"1"};
		case "Ashkenazi Jewish": return {code:"81706006", code_system:"SNOMED_CT", id:"2"};
		case "Not Hispanic or Latino": return {code:"2186-5", code_system:"HL7-TBD", id:"3"};
		case "Central American": return {code:"2155-0", code_system:"HL7", id:"4", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "Cuban": return {code:"2182-4", code_system:"HL7", id:"5", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "Dominican": return {code:"2184-0", code_system:"HL7", id:"6", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "Mexican": return {code:"2148-5", code_system:"HL7", id:"7", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "Other Hispanic": return {code:"1000000", code_system:"TBD", id:"8", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "Puerto Rican": return {code:"2180-8", code_system:"HL7", id:"9", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
		case "South American": return {code:"2165-9", code_system:"HL7", id:"10", xsi_type:"hispanic-ethnicity-type", ns:XMLNS_SCHEMA};
	}
	return null;
}

function get_code_for_race(str) {
	switch (str) {
		case "American Indian or Alaska Native": return {code:"1002-5", code_system:"HL7", id:"1"};
		case "Asian": return {code:"1000000", code_system:"TBD", id:"2"};
		case "Black or African-American": return {code:"2054-5", code_system:"HL7", id:"3"};
		case "Native Hawaiian or Other Pacific Islander": return {code:"1000001", code_system:"TBD", id:"4"};
		case "White": return {code:"2106-3", code_system:"HL7", id:"5"};

		case "Asian Indian": return {code:"2029-7", code_system:"HL7", id:"11"};
		case "Chinese": return {code:"2034-7", code_system:"HL7", id:"12"};
		case "Filipino": return {code:"2036-2", code_system:"HL7", id:"13"};
		case "Japanese": return {code:"2039-6", code_system:"HL7", id:"14"};
		case "Korean": return {code:"2040-4", code_system:"HL7", id:"15"};
		case "Vietnamese": return {code:"2047-9", code_system:"HL7", id:"16"};
		case "Other Asian": return {code:"186046006", code_system:"SNOMED", id:"17"};
		case "Unknown Asian": return {code:"2028-9", code_system:"HL7", id:"18"};

		case "Chamorro": return {code:"2088-3", code_system:"HL7", id:"21"};
		case "Guamanian": return {code:"2087-5", code_system:"HL7", id:"22"};
		case "Native Hawaiian": return {code:"2079-2", code_system:"HL7", id:"23"};
		case "Samoan": return {code:"2080-0", code_system:"HL7", id:"24"};
		case "Unknown South Pacific Islander": return {code:"2076-8", code_system:"HL7", id:"25"};
	}
	return null;
}	

function get_age_values_from_estimated_age(age_at_diagnosis) {
	switch (age_at_diagnosis) {
		case "Pre-Birth": return null;
		case "Newborn": return {unit:"day", low:"0", high:"28"};
		case "In Infancy": return {unit:"day", low:"29", high:"729"};
		case "In Childhood": return {unit:"year", low:"2", high:"10"};
		case "In Adolescence": return {unit:"year", low:"11", high:"19"};
		case "20-29 years": return {unit:"year", low:"20", high:"29"};
		case "30-39 years": return {unit:"year", low:"30", high:"39"};
		case "40-49 years": return {unit:"year", low:"40", high:"49"};
		case "50-59 years": return {unit:"year", low:"50", high:"59"};
		case "60 years or older": return {unit:"year", low:"60", high:null};
		case "Unknown": return null;
	}
	return null;
}

function save_document(save_link, doc, pi) {
		var s = new XMLSerializer();
		var output_string = s.serializeToString(doc);
		
		var filename = "family_health_history.xml";
		if (pi && pi.name) {
			filename = pi.name.replace(/ /g,"_") + "_Health_History.xml";
		} 
		if (isIE10) {
	    var blobObject = new Blob([output_string]); 
	    window.navigator.msSaveBlob(blobObject, filename); // The user only has the option of clicking the Save button.
		} else {	
			save_link.attr("href", "data:application/xml," + output_string ).attr("download", filename);
		}
		
}

////  Helper to detect IE10

var isIE10 = false;
/*@cc_on
    if (/^10/.test(@_jscript_version)) {
        isIE10 = true;
    }
@*/
