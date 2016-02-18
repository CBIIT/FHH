var XML_FORMAT_ID = 718163810183;
var TOOL_NAME = "Surgeon General's Family Heath History Tool";

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
// Important for generating the xml
var doc;
var filename;
var output_string;
var isHealthVaultSave; // determine if saving to healthvault to set death disease display name to english //

//  For downliadify to support Safari and IE downloading
			function load_downloadify(){
				var lng = window.i18n.lng();
				Downloadify.create('downloadify',{
					filename: function(){
						filename = get_filename(personal_information)
						return filename;
					},
					data: function(){ 
						return get_xml_string();
					},
					onComplete: function(){ alert('Your File Has Been Saved!'); },
					onCancel: function(){ alert('You have cancelled the saving of this file.'); },
					onError: function(){ alert('You must put something in the File Contents or there will be nothing to save!'); },
					swf: '../downloadify/media/downloadify.swf',
					downloadImage: '../downloadify/images/download_savetofile_'+lng+'.png',
					width: 132,
					height: 32,
					transparent: true,
					append: false
				});
			}


function bind_save_xml() {
	try {
		doc = document.implementation.createDocument("urn:hl7-org:v3", "FamilyHistory", null);
	} catch (e) {
		doc = new ActiveXObject("msxml2.DOMDocument.6.0");
	}

	
	bind_save_download();
	bind_save_dropbox ();
	bind_save_google_drive ();
	bind_save_heath_vault();

}

function get_filename(pi) {
	var filename = "family_health_history.xml";
	if (pi && pi.name) {
		filename = pi.name.replace(/ /g,"_") + "_Health_History.xml";
	} 
	return filename;	
}

function get_xml_string() {

		var root = doc.createElement("FamilyHistory");
		add_root_information(root);
		root.appendChild(add_personal_history(personal_information));
	
		var str = serializeXmlNode(root)
		return(str);
}

function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}


function bind_save_download() {
	var a = document.createElement('a');
	if (typeof a.download != "undefined") {
		$("#downloadify").hide();
	} else {
		$("#download_xml").hide();
	}
	
	$("#download_xml").on("click", function () {
		isHealthVaultSave = false; // not healthvault save		
		output_string = get_xml_string();
		filename = get_filename(personal_information);
		
		save_document($(this), output_string, filename);
		$("#save_personal_history_dialog").dialog("close");		
	});	
}

function bind_save_dropbox () {
	if (is_IE_8_or_9() ) {
		$("#save_to_dropbox").append("<I>This feature has been tested and is supported in the following browsers - Internet Explorer 10 and recent versions, Firefox, Chrome, Safari.</I>");
		return;
	}
	
	
	if (typeof DROPBOX_APP_KEY == 'undefined') {
		if (typeof DEBUG != 'undefined' && DEBUG) $("#save_to_dropbox").append("No Dropbox App Key Defined");				
		else $("#save_to_dropbox").append("Coming Soon");	
		return;
	}

	var button = $("<BUTTON id='dropbox_save_button'>" + $.t("fhh_load_save.save_dropbox_button") + "</BUTTON>");
	
	button.on("click", function () {
		isHealthVaultSave = false; // not healthvault save		
		output_string = get_xml_string();
		filename = get_filename(personal_information);
		Dropbox.save({
		   files: [ {'url': 'data:application/xml,' + output_string, 'filename': filename } ],
			 success: function () { $("#save_personal_history_dialog").dialog("close");},
			 error: function (errorMessage) { alert ("ERROR:" + errorMessage);}
		});
	});
	$("#save_to_dropbox").append(button);
}

function bind_save_google_drive () {
	if (is_IE_8_or_9() ) {
		$("#save_to_google_drive").append("<I>This feature has been tested and is supported in the following browsers - Internet Explorer 10 and recent versions, Firefox, Chrome, Safari.</I>");
		return;
	}
	
	
	if (typeof GOOGLE_CLIENT_ID == 'undefined') {
		if (typeof DEBUG != 'undefined' && DEBUG) $("#save_to_google_drive").append("No Google Drive App Key Defined");				
		else $("#save_to_google_drive").append("Coming Soon");	
		return;
	}
	var button = $("<BUTTON id='google_drive_save_button'>" + $.t("fhh_load_save.save_google_drive_button") + "</BUTTON>");
	button.on("click", function () {
		isHealthVaultSave = false; // not healthvault save		
		output_string = get_xml_string();
		filename = get_filename(personal_information);
		// this is an aysncronous call, we need to improve the user experience here somehow.
		gapi.auth.authorize( {'client_id': GOOGLE_CLIENT_ID, 'scope': GOOGLE_SCOPES, 'immediate': false}, googlePostAuthSave);
	});
	$("#save_to_google_drive").append(button);
		
}

function googlePostAuthSave(authResult) {
	// output_string is a global 

	if (authResult && !authResult.error) {
	///  See google examples for how this works
		var request = gapi.client.request({
				'path': 'drive/v2/files',
				'method': 'GET'
		});
		var	cb2 = function(data) {
			var items = data.items;
			var file_id = "";
			var request_type = 'POST';
			if (items.length > 0) {
				file_id = items[0].id;
				request_type = 'PUT'
			}
			
			var boundary = '-------314159265358979323846';
			var delimiter = "\r\n--" + boundary + "\r\n";
			var close_delim = "\r\n--" + boundary + "--";
		
			var content_type ='text/plain';
			var string_data = $("#input").val();
		  var metadata = {
		    'title': filename,
		    'mimeType': content_type
		  };
		
			var base64Data = btoa(output_string);
			var multipartRequestBody =
				delimiter +
				'Content-Type: application/json\r\n\r\n' +
				JSON.stringify(metadata) +
				delimiter +
				'Content-Type: ' + content_type + '\r\n' +
				'Content-Transfer-Encoding: base64\r\n' +
				'\r\n' +
				base64Data +
				close_delim;
			
			var request = gapi.client.request({
					'path': '/upload/drive/v2/files/' + file_id,
					'method': request_type,
					'params': {'uploadType': 'multipart'},
					'headers': {
					  'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
					},
					'body': multipartRequestBody
			});
		
			var	callback = function(file) {
				$("#save_personal_history_dialog").dialog("close");
			};
			request.execute(callback);
		};
		request.execute(cb2);
	}
}


function bind_save_heath_vault() {
	var button = $("<BUTTON id='health_vault_save_button'>" + $.t("fhh_load_save.save_health_vault_button") + "</BUTTON>");

	button.on("click", function () {
		isHealthVaultSave = true; // is healthvault save		
		var protocol = window.location.protocol;
		var hostname = window.location.hostname;
		
		output_string = get_xml_string();
		window.localStorage.setItem("outputString", output_string);
		window.localStorage.setItem("HV Status", "");
		

		var url_w_params;
		re = /ppe/;
		match = re.exec(HEATH_VAULT_PROXY_SERVER);		
		if (match) {
			if (FHH_SITE_PORT > 0) {
				url_w_params = HEATH_VAULT_PROXY_SERVER + "/redirect.aspx?target=AUTH&targetqs=?appid=" 
					+ HEATH_VAULT_APP_KEY + "%26actionqs=SAVE%26redirect=" 
					+ protocol + "//" + hostname + ":" + FHH_SITE_PORT + "/FHH/html/fhh_save_healthvault.html"
			} else {
				url_w_params = HEATH_VAULT_PROXY_SERVER + "/redirect.aspx?target=AUTH&targetqs=?appid=" 
					+ HEATH_VAULT_APP_KEY + "%26actionqs=SAVE%26redirect=" 
					+ protocol + "//" + hostname + "/FHH/html/fhh_save_healthvault.html"			
			}			
		}
		else {
			if (FHH_SITE_PORT > 0) {
				url_w_params = HEATH_VAULT_PROXY_SERVER + "/redirect.aspx?target=AUTH&targetqs=appid=" 
					+ HEATH_VAULT_APP_KEY + "%26actionqs=SAVE";
			} else {
				url_w_params = HEATH_VAULT_PROXY_SERVER + "/redirect.aspx?target=AUTH&targetqs=appid=" 
					+ HEATH_VAULT_APP_KEY + "%26actionqs=SAVE";			
			}			
		}

		window.open(url_w_params, "", "width=1000, height=600, scrollbars=yes");
		timer = setInterval(function(){
			var st = window.localStorage.getItem("HV Status");
			console.log("Checking status of save: " + st);
			if (st != null && st != "") {
				$("#save_personal_history_dialog").dialog("close");
				if (st == "Failed") {
					alert($.t("fhh_load_save.fail_to_save"));
				} 
				clearInterval(timer);
			} 
		},2000);



	});
	$("#save_to_healthvault").append(button);

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
			null, null,
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

function add_alive_status(tag, alive_text) {
	if (alive_text == null) return;
	desceased_tag = doc.createElement("deceasedIndCode");
	
	if (alive_text == 'dead') {
		desceased_tag.setAttribute("value", "true");
	} 

	else if (alive_text == 'alive') {
		desceased_tag.setAttribute("value", "alive");
	}

	else {
		desceased_tag.setAttribute("value", "UNKNOWN");
	}

	tag.appendChild(desceased_tag);
	
}

function add_name(tag, personal_name) {
	if (personal_name == null || personal_name=='undefined') personal_name="";
	name_tag = doc.createElement("name");
	name_tag.setAttribute("formatted", personal_name);

	tag.appendChild(name_tag);
}

function add_relative_estimated_age_tag(relationship_tag, estimated_age) {
	if (estimated_age == null) return;
	dataEstimatedAge_tag = doc.createElement("dataEstimatedAge");
	relationship_tag.appendChild(dataEstimatedAge_tag);
	var code_tag = doc.createElement("code");
	code_tag.setAttribute("displayName", "Estimated Age");
	code_tag.setAttribute("codeSystemName", "LOINC");
	code_tag.setAttribute("code", "21611-9");
	dataEstimatedAge_tag.appendChild(code_tag);
	add_estimated_age_tag(dataEstimatedAge_tag, code_tag, estimated_age);
}

function add_relative_age_tag(relationship_tag, age) {
	if (age == null) return;
	
	var d = new Date();
	var n = d.getFullYear();
	
	birthday_tag = doc.createElement("birthTime");
	birthday_tag.setAttribute("value", (n-parseInt(age)));

	relationship_tag.appendChild(birthday_tag);

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

	if (ethnic_group_list["Central American"]	== true) add_individual_ethnic_group(tag, "Central American");
	if (ethnic_group_list["Cuban"]	== true) add_individual_ethnic_group(tag, "Cuban");
	if (ethnic_group_list["Dominican"]	== true) add_individual_ethnic_group(tag, "Dominican");
	if (ethnic_group_list["Mexican"]	== true) add_individual_ethnic_group(tag, "Mexican");
	if (ethnic_group_list["Other Hispanic"] == true) add_individual_ethnic_group(tag, "Other Hispanic");
	if (ethnic_group_list["Puerto Rican"]	== true) add_individual_ethnic_group(tag, "Puerto Rican");
	if (ethnic_group_list["South American"]	== true) add_individual_ethnic_group(tag, "South American");
	
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
	if (race_list["Guamanian"] == true) add_individual_race(tag, "Guamanian");
	if (race_list["Native Hawaiian"] == true) add_individual_race(tag, "Native Hawaiian");
	if (race_list["Samoan"]	== true) add_individual_race(tag, "Samoan");
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
		cause_of_death_code, cause_of_death,
		twin_status,
		adopted_flag, 
		active_flag) 
{
	var subjectOfTwo_tag = doc.createElement("subjectOf2");
	tag.appendChild(subjectOfTwo_tag);

	add_twin_tag(subjectOfTwo_tag, twin_status);
	add_adopted_tag(subjectOfTwo_tag, adopted_flag);
	add_active_tag(subjectOfTwo_tag, active_flag);
	
	add_height(subjectOfTwo_tag, height, height_unit);
	add_weight(subjectOfTwo_tag, weight, weight_unit);
	add_consanguinity(subjectOfTwo_tag, consanguinity);
	add_diseases(subjectOfTwo_tag, diseases);
	add_cause_of_death(subjectOfTwo_tag, cause_of_death_code, cause_of_death);
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
	if (adopted_tag == null || !(adopted_tag == "true" || adopted_tag == true)) return;

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
		var disease_code_and_system = diseases[i]["Disease Code"];
		if (!detailed_disease_name) detailed_disease_name = disease_name;
		var age_at_diagnosis = diseases[i]["Age At Diagnosis"];
		
		var observation_tag = doc.createElement("clinicalObservation");
		tag.appendChild(observation_tag);
		var code_tag = doc.createElement("code");
		if (disease_code_and_system) {
			var dcas =  disease_code_and_system.split("-");
			var disease_code_system = dcas[0];
			var disease_code = dcas[1];
			code_tag.setAttribute("codeSystemName", disease_code_system);  
			code_tag.setAttribute("code", disease_code);
			var potential_detailed_disease_name = get_detailed_disease_name_from_code(disease_code);
			if (potential_detailed_disease_name != null) detailed_disease_name = potential_detailed_disease_name;
//			alert (potential_detailed_disease_name + "->" + detailed_disease_name);
		}
		code_tag.setAttribute("displayName", detailed_disease_name);
		code_tag.setAttribute("originalText", detailed_disease_name);
		
//		code_tag.setAttribute("codeSystemName", "SNOMED COMPLETE"); // 
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
		
		add_estimated_age_tag(dataEstimatedAge_tag, new_code_tag, age_at_diagnosis);
		}
}

function add_estimated_age_tag(tag, code_tag, estimated_age) {
	var av = get_age_values_from_estimated_age(estimated_age);
	if (estimated_age == "Pre-Birth" || estimated_age == "prebirth") {
		code_tag.setAttribute("originalText", "pre-birth");
	} else if (estimated_age == "Unknown" || estimated_age == "unknown") {
		code_tag.setAttribute("originalText", "unknown");
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
//	var deceasedIndCode_tag = doc.createElement("deceasedIndCode");
//	deceasedIndCode_tag.setAttribute("value", "true");
//	tag.appendChild(deceasedIndCode_tag);
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
	
	add_estimated_age_tag(deceasedEstimatedAge_tag, code_tag, estimated_death_age);
	
}

function add_cause_of_death(tag, cause_of_death_code, cause_of_death) {
	if (cause_of_death == null) return;
	var temp_cause_of_death = cause_of_death_code;
	var observation_tag = doc.createElement("clinicalObservation");
	tag.appendChild(observation_tag);
	var code_tag = doc.createElement("code");
	var code_system = "SNOMED_CT";
	if (isHealthVaultSave) {
		if (get_detailed_disease_name_from_code(cause_of_death_code.replace("SNOMED_CT-",""))) {
			code_tag.setAttribute("displayName", get_detailed_disease_name_from_code(cause_of_death_code.replace("SNOMED_CT-","")));
			code_tag.setAttribute("originalText", get_detailed_disease_name_from_code(cause_of_death_code.replace("SNOMED_CT-","")));
		}
		else {
			code_tag.setAttribute("displayName", cause_of_death);
			code_tag.setAttribute("originalText", cause_of_death);			
			code_system = "other";
		}


		// code_tag.setAttribute("displayName", get_detailed_disease_name_from_code(cause_of_death_code.replace("SNOMED_CT-","")));
		// code_tag.setAttribute("originalText", get_detailed_disease_name_from_code(cause_of_death_code.replace("SNOMED_CT-","")));		
	}
	else {
		code_tag.setAttribute("displayName", cause_of_death);
		code_tag.setAttribute("originalText", cause_of_death);
	}	
	console.log(code_system)
	code_tag.setAttribute("codeSystemName", code_system);

//	var cause_of_death_code = get_disease_code_from_detailed_disease(cause_of_death);

	var ind = cause_of_death_code.lastIndexOf("-");
	if (ind > 0) cause_of_death_code = cause_of_death_code.substr(ind+1);
//	alert (cause_of_death_code);
	if (cause_of_death_code.substring(0, 10) == "SNOMED_CT-") cause_of_death_code = cause_of_death_code.substring(0, 10)
	if (cause_of_death_code == null) cause_of_death_code = "OTHER";
	console.log(temp_cause_of_death)

	code_tag.setAttribute("code", cause_of_death_code);
	observation_tag.appendChild(code_tag);
	
	var sourceOf_tag = doc.createElement("sourceOf");
	observation_tag.appendChild(sourceOf_tag);
	var newcode_tag = doc.createElement("code");
	newcode_tag.setAttribute("displayName", "death");
	var re = /SNOMED_CT/;

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
		add_individual_relative(tag, "Grandson", "GRNSON", pi['grandson_' + i]);
		i++;
	}

	var i = 0;
	while (pi['granddaughter_' + i] != null) {
		add_individual_relative(tag, "GrandDaughter", "GRNDAU", pi['granddaughter_' + i]);
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
			relative.cause_of_death_code, relative.detailed_cause_of_death,
			relative.twin_status,
			relative.adopted,
			null
	); 
	add_id(relationshipHolder_tag, relative.id);
	add_name(relationshipHolder_tag, relative.name);
	add_alive_status(relationshipHolder_tag, relative.is_alive);

//	if (relative.date_of_birth != null || relative.date_of_birth != "") add_birthday(relationshipHolder_tag, relative.date_of_birth);
//	else if (relative.estimated_age != null || relative.estimated_age != "") add_relative_estimated_age_tag(relationshipHolder_tag, relative.estimated_age);
//	else if (relative.age != null || relative.age != "") add_relative_age_tag(relationshipHolder_tag,relative.age);

	add_birthday(relationshipHolder_tag, relative.date_of_birth);
	add_relative_estimated_age_tag(relationshipHolder_tag, relative.estimated_age);
	add_relative_age_tag(relationshipHolder_tag,relative.age);
		 
//	add_death_status(relationshipHolder_tag, relative.cause_of_death);

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
		case "prebirth": return null;
		case "newborn": return {unit:"day", low:"0", high:"28"};
		case "infant": return {unit:"day", low:"29", high:"729"};
		case "child": return {unit:"year", low:"2", high:"10"};
		case "teen": return {unit:"year", low:"10", high:"19"};
		case "twenties": return {unit:"year", low:"20", high:"29"};
		case "thirties": return {unit:"year", low:"30", high:"39"};
		case "fourties": return {unit:"year", low:"40", high:"49"};
		case "fifties": return {unit:"year", low:"50", high:"59"};
		case "senior": return {unit:"year", low:"60", high:null};
		case "unknown": return null;
	}
	return null;
}

function save_document(save_link, output_string, filename) {
	var DownloadAttributeSupport = 'download' in document.createElement('a');
	if (DownloadAttributeSupport) {
			save_link.attr("download", filename).attr("href", "data:application/force-download," + encodeURIComponent(output_string) ).attr("target", "download");		
	} else {
	    var blobObject = new Blob([output_string]); 
	    window.navigator.msSaveBlob(blobObject, filename); // The user only has the option of clicking the Save button.		
	}

/*
		if (isIE10) {
	    var blobObject = new Blob([output_string]); 
	    window.navigator.msSaveBlob(blobObject, filename); // The user only has the option of clicking the Save button.
		} else {
//			save_link.attr("href", "data:application/xml," + output_string ).attr("download", filename);
			save_link.attr("download", filename).attr("href", "data:application/force-download," + encodeURIComponent(output_string) ).attr("target", "download");
		}
*/
		
}


// function get_detailed_disease_name_from_code(disease_code) moved to load_xml.js

////  Helper to detect IE10

var isIE10 = false;
/*@cc_on
    if (/^10/.test(@_jscript_version)) {
        isIE10 = true;
    }
@*/
