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
	$familyHistory = new SimpleXMLElement($file);
	
	$subjectTypeCode = $familyHistory->subject[0]['typeCode'];
	if ($subjectTypeCode == 'SBJ') $code = "Yes"; else $code = "No";
	
	$pi = array();
	$pi['name'] = reset($familyHistory->subject[0]->patient->patientPerson->name['formatted']);
	$pi['gender'] = strtoupper(reset($familyHistory->subject[0]->patient->patientPerson->administrativeGenderCode['displayName']));
	$pi['date_of_birth'] = reset($familyHistory->subject[0]->patient->patientPerson->birthTime['value']);

	$clinical_observations = $familyHistory->subject[0]->patient->patientPerson->subjectOf2->clinicalObservation;
	
	$pi['observations'] = $clinical_observations[1];
	return json_encode($pi);
	
}

?>