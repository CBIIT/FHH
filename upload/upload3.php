<?php

$file = $_FILES["file"]["tmp_name"];

if(file_exists($file)) {
	header('Content-Description: File Transfer');
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	//header('Content-Disposition: attachment; filename='.basename($file));
	//header('Content-Transfer-Encoding: binary');
	header('Expires: 0');
	header('Cache-Control: post-check=0, pre-check=0');
	header('Pragma: no-cache');
	//ob_clean();
	//flush();
	$json_output = make_json_output(file_get_contents($file));
	header('Content-Length: ' . strlen($json_output));
	
	echo $json_output;

}
exit;

function make_json_output($file) {
	global $disease_list, $pi;
	$pi = array();
	
	read_disease_list();
	$dis = get_disease_name_from_detailed_name("Lung Cancer");
	$pi['test'] = $dis;
	
	$familyHistory = new SimpleXMLElement($file);
	
	$subjectTypeCode = $familyHistory->subject[0]['typeCode'];
	if ($subjectTypeCode == 'SBJ') $code = "Yes"; else $code = "No";
	
//	$pi['id'] = reset($familyHistory->subject[0]->patient->patientPerson->id['extention']);
//	if ($pi['id'] == "") $pi['id'] = reset($familyHistory->subject[0]->patient->patientPerson->id['extension']);
	
	// the old site had a misspelling of extension, so we chekc either form.
	$pi['id'] = g($familyHistory->subject->patient->patientPerson->id['extension']);
	if (!isset($pi['id'])) $pi['id'] = g($familyHistory->subject->patient->patientPerson->id['extention']);
	
	$pi['name'] = g($familyHistory->subject->patient->patientPerson->name['formatted']);
	$pi['gender'] = strtoupper(g($familyHistory->subject->patient->patientPerson->administrativeGenderCode['displayName']));
	$pi['date_of_birth'] = g($familyHistory->subject->patient->patientPerson->birthTime['value']);

	$clinical_observations = $familyHistory->subject->patient->patientPerson->subjectof2->clinicalObservation;
	// sometimes subjectOf2 is done as subjectof2 (note capital O)
	if (!isset($clinical_observations)) $clinical_observations = $familyHistory->subject->patient->patientPerson->subjectOf2->clinicalObservation;

	$diseases = array();
	
	if (isset($clinical_observations)) {	
		foreach ($clinical_observations as $co) {
			if ($co->code['displayName'] == 'height') {
				$height = $co->value['value'];
				$height_unit = $co->value['unit'];
			} else if ($co->code['displayName'] == 'weight') {
				$weight = $co->value['value'];
				$weight_unit = $co->value['unit'];
			} else if ($co->code['displayName'] == 'Physically Active') {
				if ($co->value['value'] == 'true') $physically_active = true;
				else $physically_active = false;
			} else if ($co->code['originalText'] == 'Parental consanguinity indicated') {
				$consanguinity = true;
			} else if ($co->code['code'] == '313415001') {
				$twin_status = 'IDENTICAL';
			} else if ($co->code['code'] == '313416000') {
				$twin_status = 'FRATERNAL';
			} else if ($co->code['code'] == '160496001') {
				$adopted = true;
			} else {
				$new_disease = load_disease($co);
				if (count($new_disease) > 0) array_push($diseases, $new_disease);
			}
		}
	}
	
	// Race
	$race_list = $familyHistory->subject->patient->patientPerson->raceCode;
	
	$races = array();
	foreach ($race_list as $race_code) {
		$race_name = reset($race_code['displayName']);
		if ($race_name == "Asian - Not Specified") $race_name = 'Unknown Asian';
		if ($race_name == "Unspecified Native Hawaiian or Other Pacific Islander") $race_name = 'Unknown South Pacific Islander';
		$races[$race_name] = true;		
	}
	
	$ethnicity_list = $familyHistory->subject->patient->patientPerson->ethnicGroupCode;
	
	$ethnicities = array();
	foreach ($ethnicity_list as $ethnicity_code) {
		$ethnicity_name = reset($ethnicity_code['displayName']);
		$ethnicities[$ethnicity_name] = true;		
	}
	
	// All that is left are relatives
	$relatives = $familyHistory->subject->patient->patientPerson->relative;
	$pi['relative_count'] = count($relatives);
	add_all_relatives($relatives);
	
	if (isset($height)) $pi['height'] = reset($height);
	if (isset($height_unit)) $pi['height_unit'] = reset($height_unit);
	if (isset($weight)) $pi['weight'] = reset($weight);
	if (isset($weight_unit)) $pi['weight_unit'] = reset($weight_unit);
	if (isset($physically_active) && $physically_active == 'true') $pi['physically_active'] = true;
	if (isset($consanguinity) && $consanguinity == 'true') $pi['consanguinity'] = true;
	if (isset($twin_status)) $pi['twin_status'] = $twin_status;
	if (isset($adopted) && $adopted == 'true') $pi['adopted'] = true;

	if (count($races) > 0) $pi['race'] = $races;
	if (count($ethnicities) > 0) $pi['ethnicity'] = $ethnicities;
	if (count($diseases) > 0) $pi['Health History'] = $diseases;
	
	return json_encode($pi);
	
}

function add_all_relatives($relatives) {
	global $pi;
	foreach ($relatives as $r) {
		$relationship = get_relationship_from_relationship_code(reset($r->code['code']));
		$new_relative = array();
		
		$new_relative['name'] = reset($r->relationshipHolder->name['formatted']);
		$new_relative['gender'] = strtoupper(g($r->relationshipHolder->administrativeGenderCode['displayName']));
		$new_relative['id'] = g($r->relationshipHolder->id['extension']);
		if (!isset($new_relative['id'])) $new_relative['id'] = g($r->relationshipHolder->id['extention']);
			
		$pi[$relationship] = $new_relative;
		
	}
	$relationship_code = $relatives;
}

function get_relationship_from_relationship_code($code) {
	switch ($code) {
		case "NMTH": return "mother";
		case "NFTH": return "father";
		case "MGRMTH": return "maternal_grandmother";
		case "MGRFTH": return "maternal_grandfather";
		case "PGRMTH": return "paternal_grandmother";
		case "PGRFTH": return "paternal_grandfather";
		case "NBRO": return get_next_available("brother"); 
		case "NSIS": return get_next_available("sister"); 
			
		default: return $code;
	}
}

function get_next_available($relative) {
	global $pi;
	$i = 0;

	while (isset($pi[$relative . "_" . $i]) && $i < 10) $i++;
	
	return $relative . "_" . $i;
}

function g ($xml_element) {
	if ($xml_element) return reset($xml_element);
	else return NULL;
}

function read_disease_list () {
	global $disease_list;
	$diseases_str = file_get_contents( "../data/diseases.json");
	$disease_list = json_decode($diseases_str, true);
}



function load_disease($co) {
	$new_disease = array();

	$disease_detailed_name = $co->code['displayName'];
	$disease_code = $co->code['code'];
	$disease_code_system = $co->code['codeSystemName'];
	
	if (isset($disease_detailed_name)) {
		$new_disease['Detailed Disease Name'] = reset($disease_detailed_name);
		$new_disease['Disease Name'] = get_disease_name_from_detailed_name($new_disease['Detailed Disease Name']);
	}
	if (isset($disease_code) && isset($disease_code_system)) {
		$new_disease['Disease Code'] = reset($disease_code_system) . '-' . reset($disease_code);
	}
	$estimated_age = $co->subject->dataEstimatedAge;
	$age_at_diagnosis = get_age_at_diagnosis($estimated_age);
	
	if (isset($age_at_diagnosis)) $new_disease['Age At Diagnosis'] = $age_at_diagnosis;

	return $new_disease;
}

function get_disease_name_from_detailed_name($detailedDiseaseName) {
	global $disease_list;
	
	$high_level_disease_list = array_keys($disease_list);
	foreach ($high_level_disease_list as $hld) {
		$subdisease_list = $disease_list[$hld];
		foreach ($subdisease_list as $sub) {
			$name = $sub['name'];
			if ($name == $detailedDiseaseName) return $hld;
		}
	}
	return 'other';
}

function get_age_at_diagnosis ($estimated_age) {
	$originalText = $estimated_age->code['originalText'];
	if (isset($originalText) && reset($originalText) == 'pre-birth') return "prebirth";
	if (isset($originalText) && reset($originalText) == 'unknown') return "unknown";
	
	$unit = $estimated_age->value['unit'];
	$low = $estimated_age->value->low['value'];
	
	if (isset($unit) && reset($unit) == 'day') {
		if (isset($low) && reset($low) == '0') return "newborn";
		if (isset($low) && reset($low) == '29') return "infant";
	} 
	if (isset($unit) && reset($unit) == 'year') {
		if (isset($low) && reset($low) == '2') return "child";
		if (isset($low) && reset($low) == '10') return "teen";
		if (isset($low) && reset($low) == '20') return "twenties";
		if (isset($low) && reset($low) == '30') return "thirties";
		if (isset($low) && reset($low) == '40') return "fourties";
		if (isset($low) && reset($low) == '50') return "fifties";
		if (isset($low) && reset($low) == '60') return "senior";
	}
	
	return "unknown";
}
// Javascript below
/*
function get_age_at_diagnosis (xml_snippet) {
	if (xml_snippet == null) return null;
	
	if (xml_snippet.html() && xml_snippet.html().indexOf("prebirth") > -1) return 'Pre-Birth';
	var estimated_age = xml_snippet.html();
	if (estimated_age && estimated_age.indexOf('unit="day"') > -1) {
		if (estimated_age.indexOf('value="0"') > -1) return "newborn";
		if (estimated_age.indexOf('value="29"') > -1) return "infant";
	}
	if (estimated_age && estimated_age.indexOf('unit="year"') > -1) {
		if (estimated_age.indexOf('value="2"') > -1) return "child";
		if (estimated_age.indexOf('value="10"') > -1) return "teen";
		if (estimated_age.indexOf('value="20"') > -1) return "twenties";
		if (estimated_age.indexOf('value="30"') > -1) return "thirties";
		if (estimated_age.indexOf('value="40"') > -1) return "fourties";
		if (estimated_age.indexOf('value="50"') > -1) return "fifties";
		if (estimated_age.indexOf('value="60"') > -1) return "senior";
	}
	if (xml_snippet.html() && xml_snippet.html().indexOf("unknown") > -1) return 'unknown';

	return null;
}
*/
?>