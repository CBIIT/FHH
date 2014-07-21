var personal_information = null;

// Constants From SNOMED_CT
var SNOMED_CT_CODES = {'IDENTICAL_TWIN_CODE': '313415001', 'FRATERNAL_TWIN_CODE':'313416000' }

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

var disease_list = new Array();


function loaded (evt) {
	var fileString = evt.target.result;	
	parse_xml(fileString);
	build_family_history_data_table();

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
//	alert ("Parsing the XML: " + $(data).find("patientPerson").html());
//	alert (JSON.stringify(disease_list, null, 2));
	
	$(data).find("patientPerson > relative").each( function () {
		var relative = new Object();
		
		var relationship_code = $(this).find("code").attr("code");
		relative.name = $(this).find("relationshipHolder > name").attr("formatted");
		
		relative.gender = $(this).find("administrativeGenderCode").attr("displayName").toUpperCase();
		relative.date_of_birth = $(this).find("relationshipHolder > birthTime").attr("value");

		relative.twin_status = 'NO';
		$(this).find("relationshipHolder > subjectOf2 > clinicalObservation > code").each( function() {
			if ($(this).parent().html().indexOf(SNOMED_CT_CODES.IDENTICAL_TWIN_CODE) > -1) relative.twin_status = 'IDENTICAL';
			if ($(this).parent().html().indexOf(SNOMED_CT_CODES.FRATERNAL_TWIN_CODE) > -1) relative.twin_status = 'FRATERNAL';
		});
		
		current_health_history = new Array();
		// Looking for diseases, first we need to pull out the displayNames for every code tag
		$(this).find("code").each( function() {
			var detailedDiseaseName = $(this).attr('displayName');
			if ($.inArray(detailedDiseaseName, disease_list) != -1) {
				// We have the detailed disease name, now we need the high-level disease name
				var keys = Object.keys(diseases);
				for (var i=0; i<keys.length;i++) {
					if (diseases[keys[i]].length == 0) {
						highLevelDiseaseName = detailedDiseaseName;
						break;
					}
					if ($.inArray(detailedDiseaseName, diseases[keys[i]]) != -1) {
						highLevelDiseaseName = keys[i];
						break;
					}
				}
				// Now have to get age at diagnosis
				ageAtDiagnosis = get_age_at_diagnosis(relative.name + ","+ highLevelDiseaseName + ", " + detailedDiseaseName, 
						$(this).parent().find('subject > dataEstimatedAge'));
								
				var specific_health_issue = {"Disease Name": highLevelDiseaseName,
                        "Detailed Disease Name": detailedDiseaseName,
                        "Age At Diagnosis": ageAtDiagnosis};
				
				// Do not want to push duplicates
				var duplicate = false;
				for (var i=0;i<current_health_history.length;i++) {
					if 		(specific_health_issue["Disease Name"] == current_health_history[i]["Disease Name"] &&
							 specific_health_issue["Detailed Disease Name"] == current_health_history[i]["Detailed Disease Name"]) {
						duplicate=true;break;
					}
				}
				if (!duplicate) current_health_history.push(specific_health_issue);
				
//				alert(relative.name + ":"+ highLevelDiseaseName + ", " + detailedDiseaseName + ": " + ageAtDiagnosis);
			}
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

		if (relationship_code == "NMTH") personal_information.mother = relative;
		if (relationship_code == "NFTH") personal_information.father = relative;
		if (relationship_code == "MGRMTH") personal_information.maternal_grandmother = relative;
		if (relationship_code == "MGRFTH") personal_information.maternal_grandfather = relative;
		if (relationship_code == "PGRMTH") personal_information.paternal_grandmother = relative;
		if (relationship_code == "PGRFTH") personal_information.paternal_grandfather = relative;

		if (relationship_code == "NBRO") {
			var i = 0;
			while (personal_information["brother_" + i] != null) i++;
			personal_information["brother_" + i] = relative;
		}
		if (relationship_code == "NSIS") {
			var i = 0;
			while (personal_information["sister_" + i] != null) i++;
			personal_information["sister_" + i] = relative;
		}
		if (relationship_code == "SON") {
			var i = 0;
			while (personal_information["son_" + i] != null) i++;
			personal_information["son_" + i] = relative;
		}
		if (relationship_code == "DAU") {
			var i = 0;
			while (personal_information["daughter_" + i] != null) i++;
			personal_information["daughter_" + i] = relative;
		}
		
		if (relationship_code == "MAUNT") {
			var i = 0;
			while (personal_information["maternal_aunt_" + i] != null) i++;
			personal_information["maternal_aunt_" + i] = relative;
		}
		if (relationship_code == "MUNCLE") {
			var i = 0;
			while (personal_information["maternal_uncle_" + i] != null) i++;
			personal_information["maternal_uncle_" + i] = relative;
		}
		if (relationship_code == "PAUNT") {
			var i = 0;
			while (personal_information["paternal_aunt_" + i] != null) i++;
			personal_information["paternal_aunt_" + i] = relative;
		}
		if (relationship_code == "PUNCLE") {
			var i = 0;
			while (personal_information["paternal_uncle_" + i] != null) i++;
			personal_information["paternal_uncle_" + i] = relative;
		}
		
		if (relationship_code == "HBRO") {
			if ($(this).find("relationshipHolder > relative").html().indexOf("NMTH") > -1) {
				var i = 0;
				while (personal_information["maternal_halfbrother_" + i] != null) i++;
				personal_information["maternal_halfbrother_" + i] = relative;				
			} else {
				var i = 0;
				while (personal_information["paternal_halfbrother_" + i] != null) i++;
				personal_information["paternal_halfbrother_" + i] = relative;				
			}
		}
		if (relationship_code == "HSIS") {
			if ($(this).find("relationshipHolder > relative").html().indexOf("NMTH") > -1) {
				var i = 0;
				while (personal_information["maternal_halfsister_" + i] != null) i++;
				personal_information["maternal_halfsister_" + i] = relative;				
			} else {
				var i = 0;
				while (personal_information["paternal_halfsister_" + i] != null) i++;
				personal_information["paternal_halfsister_" + i] = relative;				
			}
		}

		if (relationship_code == "NEPHEW") {
			var i = 0;
			while (personal_information["nephew_" + i] != null) i++;
			personal_information["nephew_" + i] = relative;
		}
		if (relationship_code == "NIECE") {
			var i = 0;
			while (personal_information["niece_" + i] != null) i++;
			personal_information["niece_" + i] = relative;
		}

		if (relationship_code == "MCOUSN") {
			var i = 0;
			while (personal_information["maternal_cousin_" + i] != null) i++;
			personal_information["maternal_cousin_" + i] = relative;
		}
		if (relationship_code == "PCOUSN") {
			var i = 0;
			while (personal_information["paternal_cousin_" + i] != null) i++;
			personal_information["paternal_cousin_" + i] = relative;
		}
		if (relationship_code == "GRNSON") {
			var i = 0;
			while (personal_information["grandson_" + i] != null) i++;
			personal_information["grandson_" + i] = relative;
		}
		if (relationship_code == "GRNDAU") {
			var i = 0;
			while (personal_information["granddaughter_" + i] != null) i++;
			personal_information["granddaughter_" + i] = relative;
		}
		
		relative = null;
	});
	
//	alert (JSON.stringify(personal_information, null, 2));
	
}

function get_age_at_diagnosis (text, xml_snippet) {
	
	if (xml_snippet.html() && xml_snippet.html().indexOf("pre-birth") > -1) return 'Pre-Birth';
	var estimated_age = xml_snippet.html();
	if (estimated_age && estimated_age.indexOf('unit="day"') > -1) {
		if (estimated_age.indexOf('value="0"') > -1) return "NewBorn";
		if (estimated_age.indexOf('value="29"') > -1) return "In Infancy";
	}
	if (estimated_age && estimated_age.indexOf('unit="year"') > -1) {
		if (estimated_age.indexOf('value="2"') > -1) return "In Childhood";
		if (estimated_age.indexOf('value="10"') > -1) return "In Adolescence";
		if (estimated_age.indexOf('value="20"') > -1) return "20-29 Years";
		if (estimated_age.indexOf('value="30"') > -1) return "30-39 Years";
		if (estimated_age.indexOf('value="40"') > -1) return "40-49 Years";
		if (estimated_age.indexOf('value="50"') > -1) return "50-59 Years";
		if (estimated_age.indexOf('value="60"') > -1) return "60 years or older";
	}
	if (xml_snippet.html() && xml_snippet.html().indexOf("unknown") > -1) return 'Unknown';

	return 'Unknown';
}
