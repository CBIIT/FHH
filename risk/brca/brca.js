// Key Codes
/*
	"SNOMED_CT-363406005": "Colon Cancer",
	"SNOMED_CT-363349007": "Gastric Cancer",
	"SNOMED_CT-1000001": "breast Cancer",
	"SNOMED_CT-254582000": "Rectal Cancer",
	"SNOMED_CT-72900001": "Familial adnenomatous polyposis (FAP)",
	"SNOMED_CT-68496003": "Colon Polyp",
	"SNOMED_CT-371973000": "Uterine Cancer",
	"SNOMED_CT-363418001": "Pancreatic Cancer",
	"SNOMED_CT-363443007": "Ovarian Cancer",
	"SNOMED_CT-363418001": "Pancreatic Cancer",
	"SNOMED_CT-93870000": "Liver Cancer",
	"SNOMED_CT-1000000": "Brain Cancer",
	"SNOMED_CT-315058005": "Lynch Syndrome/Hereditary non-polyposis breast cancer (HNPCC)",
	"SNOMED_CT-34000006": "Crohn's Disease",
	"SNOMED_CT-64766004": "Ulcerative Colitis",
	"SNOMED_CT-363518003": "Kidney Cancer",
	"SNOMED_CT-399068003": "Prostate Cancer",
*/
var initial_risk = false;
var risk1 = false;
var risk2 = false;
var risk3 = false;
var risk4 = false;
var risk5 = false;
var risk6 = false;
var risk7 = false;
var risk8 = false;
var risk9 = false;
var risk10 = false;
var risk11 = false;
var risk12 = false;
var final_risk = false;

// get lng and set to variable. used to open correct pdf //
var lng = window.i18n.lng();
if (lng == 'en-US') {
	lng = 'en';
};
//debugger;
if (personal_information == null) alert($.t("fhh_breast_calculator.personal_information"));

$(document).ready(function () {


	$('.aradio').buttonset();

	get_required_info_dialog();
});


function get_required_info_dialog() {
	$("#extra_info_dialog").show()
		.append("<P class='instructions'><B>" + $.t("fhh_breast_calculator.initial_popup_desc_line1") + "</B></P>");

	$("#extra_info_dialog").show()
		.append("<P class='instructions'>" + $.t("fhh_breast_calculator.initial_popup_desc_line2") + "</P>");

	var input_table = $("<TABLE>");
	$("#extra_info_dialog").append(input_table);

	if (test_initial()) {
		input_table.append($("<TR>")
			.append("<TD><label for='both_choice'>" + $.t("fhh_breast_calculator.initial_popup_had_both_breast_cancer_description") + "</label></TD>")
			.append($("<TD>")
				.append($("<SELECT id='both_choice'>")
					.append("<OPTION value='false'>" + $.t("fhh_breast_calculator.initial_popup_no_value") + "</OPTION>")
					.append("<OPTION value='true'>" + $.t("fhh_breast_calculator.initial_popup_yes_value") + "</OPTION>"))));

	}

	input_table.append($("<TR>")
		.append("<TD><label for='brca_choice'>" + $.t("fhh_breast_calculator.initial_popup_had_brca_description") + "</label></TD>")
		.append($("<TD>")
			.append($("<SELECT id='brca_choice'>")
				.append("<OPTION value='false'>" + $.t("fhh_breast_calculator.initial_popup_no_value") + "</OPTION>")
				.append("<OPTION value='true'>" + $.t("fhh_breast_calculator.initial_popup_yes_value") + "</OPTION>"))));

	//			.append("Physical activity is defined as 150 minutes of moderate exercise per week<br/>")


	var continue_button = $("<BUTTON> " + $.t("fhh_diabetes_calculator.initial_popup_continue_button") + " </BUTTON>");
	continue_button.click(apply_required_additional_data_entry_button);

	$("#extra_info_dialog").append(continue_button);
	$("#crca_content").hide();

	fourthVari = angular.copy(personal_information);
}

function apply_required_additional_data_entry_button() {

	if (!personal_information.both) {
		if ($("#both_choice").val() == 'true') personal_information.both = true;
		else personal_information.both = false;
	}




	if (!personal_information.brca) {
		if ($("#brca_choice").val() == 'true') personal_information.brca = true;
		else personal_information.brca = false;
	}

	$("#extra_info_dialog").hide();
	$("#crca_content").show();


	start();

}

function start() {
	//debugger;
	set_icon($("#test_risk1"), 'calculating');
	setTimeout(test_risk1, 500);

	/// End of main script
}

function test_initial() {
	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;

	for (i = 0; i < h.length; i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-254837009' || h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
			risk = true;
		}
	}

	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];

			debugger;
			if (h != null) {
				for (i = 0; i < h.length; i++) {
					if (h[i]['Disease Code'] == 'SNOMED_CT-254837009' || h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
						risk = true;
					}

				}

			}
		}

	});
	//risk_initial |= risk;


	return risk;
}
function test_risk1() {
	var risk = false;
	risk_reason = "";
	all_names = "";
	$.each(personal_information, function (key, item) {
		//debugger;
		if (item != null) {
			var h = item['Health History'];

			if (h != null) {
				var temp = key.substring(0, 4);
				if (temp == 'fath' || temp == 'moth' || temp == 'brot' || temp == 'sist' || temp == 'daug' || temp == 'son_') {
					if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i = 0; i < h.length; i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-254837009' || h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
							name = get_name_or_relationship(this.name, key);
							//debugger;
							all_names += titleCase(name) + ", ";
							risk = true;
						}
					}
				}
			}
		}
	});

	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.family_members_cancer_breast") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}
	//debugger;
	if (risk) {
		set_icon($("#test_risk1"), 'positive');
		set_reason($("#test_risk1"), risk_reason);
	} else {
		set_icon($("#test_risk1"), 'negative');
		set_reason($("#test_risk1"), $.t("fhh_breast_calculator.test_risk1_negative"));
	}

	risk1 |= risk;
	// Goto Next test
	set_icon($("#test_risk2"), 'calculating');
	setTimeout(test_risk2, 500);
}

function test_risk2() {
	var risk = false;
	risk_reason = "";
	all_names = "";

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";

	if (personal_information['gender'] == 'FEMALE') {
		for (i = 0; i < h.length; i++) {
			if (h[i]['Disease Code'] == 'SNOMED_CT-363443007') {
				all_names = "Yourself, ";
				//risk_reason += $.t("fhh_breast_calculator.test_risk2_ovarian_you") + "<br />";
				risk = true;
			}
			/*
						if (h[i]['Disease Code'] == 'SNOMED_CT-363492001') {
							risk_reason += $.t("fhh_breast_calculator.test_risk2_peritoneal_you") + "<br />";
							risk = true;
						}*/
		}
	}


	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];

			if (item['gender'] == 'FEMALE') {
				if (h != null) {
					for (i = 0; i < h.length; i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-363443007') {
							name = get_name_or_relationship(this.name, key);
							all_names += titleCase(name) + ", ";
							risk = true;
						}
						/*if (h[i]['Disease Code'] == 'SNOMED_CT-363492001') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_breast_calculator.test_risk2_peritoneal") + "<br />";
							risk = true;
						}*/
					}
				}
			}
		}

	});

	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk2_ovarian") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}

	if (risk) {
		set_icon($("#test_risk2"), 'positive');
		set_reason($("#test_risk2"), risk_reason);
	} else {
		set_icon($("#test_risk2"), 'negative');
		set_reason($("#test_risk2"), $.t("fhh_breast_calculator.test_risk2_negative"));
	}

	risk2 |= risk;
	// Goto Next test
	set_icon($("#test_risk3"), 'calculating');
	setTimeout(test_risk3, 500);
}

function test_risk3() {
	var risk = false;
	risk_reason = "";
	all_names = "";

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";
	for (i = 0; i < h.length; i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-363418001') {
			all_names = "Yourself ";
			//risk_reason += $.t("fhh_breast_calculator.test_risk3_pancreatic_you") + "<br />";
			risk = true;
		}
	}


	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];

			if (h != null) {
				for (i = 0; i < h.length; i++) {
					if (h[i]['Disease Code'] == 'SNOMED_CT-363418001') {
						name = get_name_or_relationship(this.name, key);
						all_names += titleCase(name) + " ";
						risk = true;
						//risk_reason += name + " " + $.t("fhh_breast_calculator.test_risk3_pancreatic") + "<br />";
						risk = true;
					}

				}
			}
		}
	});

	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk3_pancreatic") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}

	if (risk) {
		set_icon($("#test_risk3"), 'positive');
		set_reason($("#test_risk3"), risk_reason);
	} else {
		set_icon($("#test_risk3"), 'negative');
		set_reason($("#test_risk3"), $.t("fhh_breast_calculator.test_risk3_negative"));
	}

	risk3 |= risk;
	// Goto Next test
	set_icon($("#test_risk4"), 'calculating');
	setTimeout(test_risk4, 500);
}

function test_risk4() {
	var risk = false;
	risk_reason = "";
	risk_summary = "";
	risk_reason = "";
	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";

	if (personal_information['gender'] == 'MALE') {

		for (i = 0; i < h.length; i++) {
			if (h[i]['Disease Code'] == 'SNOMED_CT-399068003') {
				all_names = "Yourself, ";
				//risk_reason += $.t("fhh_breast_calculator.test_risk4_prostate_you") + "<br />";
				risk = true;
			}
		}
	}

	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];
			if (item['gender'] == 'MALE') {

				if (h != null) {
					for (i = 0; i < h.length; i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-399068003') {
							name = get_name_or_relationship(this.name, key);
							all_names += titleCase(name) + ", ";
							//risk_reason += name + " " + $.t("fhh_breast_calculator.test_risk4_prostate") + "<br />";
							risk = true;
						}

					}
				}
			}
		}
	});
	//debugger;
	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk4_prostate") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}
	if (risk) {
		set_icon($("#test_risk4"), 'positive');
		risk_reason += "<em>" + $.t("fhh_breast_calculator.test_risk4_prostate_summary") + "</em>";
		set_reason($("#test_risk4"), risk_reason);
	} else {
		set_icon($("#test_risk4"), 'negative');
		set_reason($("#test_risk4"), $.t("fhh_breast_calculator.test_risk4_negative"));
	}

	risk4 |= risk;
	// Goto Next test
	set_icon($("#test_risk5"), 'calculating');
	setTimeout(test_risk5, 500);
}

function test_risk5() {

	var risk = false;
	risk_reason = "";
	//debugger;

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";
	for (i = 0; i < h.length; i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-254837009') {
			if (is_age_before('Under30', h[i]['Age At Diagnosis'])) {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_breast_you_under40") + "<br />";
				risk = true;
			}
			else if (h[i]['Age At Diagnosis'] == 'fourties') {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_breast_you_40s") + "<br />";
				risk = true;
			}
			else if (h[i]['Age At Diagnosis'] == 'fifties') {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_breast_you_50s") + "<br />";
				risk = true;
			}
		}

		if (h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
			if (is_age_before('Under30', h[i]['Age At Diagnosis'])) {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_triple_breast_you_under40") + "<br />";
				risk = true;
			}
			else if (h[i]['Age At Diagnosis'] == 'fourties') {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_triple_breast_you_40s") + "<br />";
				risk = true;
			}
			else if (h[i]['Age At Diagnosis'] == 'fifties') {
				risk_reason += $.t("fhh_breast_calculator.test_risk5_triple_breast_you_50s") + "<br />";
				risk = true;
			}
		}
	}


	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];
			//debugger;
			if (item['gender'] == 'FEMALE') {
				if (h != null) {
					for (i = 0; i < h.length; i++) {

						if (h[i]['Disease Code'] == 'SNOMED_CT-254837009') {
							name = get_name_or_relationship(this.name, key);

							if (is_age_before('Under30', h[i]['Age At Diagnosis'])) {
								risk_reason += titleCase(name) + $.t("fhh_breast_calculator.test_risk5_breast_under40") + "<br />";
								risk = true;
							}
							else if (h[i]['Age At Diagnosis'] == 'fourties') {
								risk_reason += titleCase(name) + " " + $.t("fhh_breast_calculator.test_risk5_breast_40s") + "<br />";
								risk = true;
							}
							else if (h[i]['Age At Diagnosis'] == 'fifties') {
								risk_reason += titleCase(name) + " " + $.t("fhh_breast_calculator.test_risk5_breast_50s") + "<br />";
								risk = true;
							}
						}

						if (h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
							name = get_name_or_relationship(this.name, key);
							if (is_age_before('Under30', h[i]['Age At Diagnosis'])) {
								risk_reason += titleCase(name) + " " + $.t("fhh_breast_calculator.test_risk5_triple_breast_under40") + "<br />";
								risk = true;
							}
							else if (h[i]['Age At Diagnosis'] == 'fourties') {
								risk_reason += titleCase(name) + " " + $.t("fhh_breast_calculator.test_risk5_triple_breast_40s") + "<br />";
								risk = true;
							}
							else if (h[i]['Age At Diagnosis'] == 'fifties') {
								risk_reason += titleCase(name) + " " + $.t("fhh_breast_calculator.test_risk5_triple_breast_50s") + "<br />";
								risk = true;
							}
						}

					}
				}
			}
		}
	});


	if (risk) {
		set_icon($("#test_risk5"), 'positive');
		risk_reason = "<p style=\"color:red;\">" + risk_reason + "</p>";
		set_reason($("#test_risk5"), risk_reason);
	} else {
		set_icon($("#test_risk5"), 'negative');
		set_reason($("#test_risk5"), $.t("fhh_breast_calculator.test_risk5_negative"));
	}

	risk5 |= risk;

	//if (test_initial()) {
	// Goto Next test
	set_icon($("#test_risk6"), 'calculating');
	setTimeout(test_risk6, 500);
	//}
	//else
	//{
	//set_icon($("#test_final"), 'calculating');
	//setTimeout(test_final, 500);
	//}
}

function test_risk6() {

	risk_summary = "";

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";

	if (personal_information['both']) {

		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk6_both") + "</p>";
		risk = true;
	}


	//debugger;

	if (risk) {
		set_icon($("#test_risk6"), 'positive');
		set_reason($("#test_risk6"), risk_reason);
	} else {
		set_icon($("#test_risk6"), 'negative');
		set_reason($("#test_risk6"), $.t("fhh_breast_calculator.test_risk6_negative"));
	}

	risk6 |= risk;
	// Goto Next test
	set_icon($("#test_risk7"), 'calculating');
	setTimeout(test_risk7, 500);
}
function test_risk7() {
	var risk = false;
	risk_reason = "";
	all_names = "";

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";

	if (personal_information['gender'] == 'MALE') {
		for (i = 0; i < h.length; i++) {
			if (h[i]['Disease Code'] == 'SNOMED_CT-254837009' || h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
				all_names = "Yourself, ";
				//risk_reason += $.t("fhh_breast_calculator.test_risk2_ovarian_you") + "<br />";
				risk = true;
			}
			/*
						if (h[i]['Disease Code'] == 'SNOMED_CT-363492001') {
							risk_reason += $.t("fhh_breast_calculator.test_risk2_peritoneal_you") + "<br />";
							risk = true;
						}*/
		}
	}

	//debugger;
	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];

			if (item['gender'] == 'MALE') {
				if (h != null) {
					for (i = 0; i < h.length; i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-254837009' || h[i]['Disease Code'] == 'SNOMED_CT-706970001') {
							name = get_name_or_relationship(this.name, key);
							all_names += titleCase(name) + ", ";
							risk = true;
						}

					}
				}
			}
		}

	});

	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk7_male") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}

	if (risk) {
		set_icon($("#test_risk7"), 'positive');
		set_reason($("#test_risk7"), risk_reason);
	} else {
		set_icon($("#test_risk7"), 'negative');
		set_reason($("#test_risk7"), $.t("fhh_breast_calculator.test_risk7_negative"));
	}

	risk7 |= risk;
	// Goto Next test
	set_icon($("#test_risk8"), 'calculating');
	setTimeout(test_risk8, 500);
}

function test_risk8() {
	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";
	//debugger;
	if (personal_information['ethnicity']['Ashkenazi Jewish']) {

		//risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk8_jewish") + "</p>";
		all_names = "Yourself, ";
		risk = true;
	}


	$.each(personal_information, function (key, item) {
		//debugger;
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;


			if (key == 'father' || key == 'mother' || key == 'paternal_grandfather' || key == 'maternal_grandfather' || key == 'paternal_grandmother' || key == 'maternal_grandmother') {

				if (item['ethnicity'] != null) {
					if (item['ethnicity']['Ashkenazi Jewish']) {
						name = get_name_or_relationship(this.name, key);
						all_names += titleCase(name) + ", ";
						risk = true;
					}
				}
			}
		}
	});

	//debugger;

	if (all_names != "") {
		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk8_jewish") + ": <b>" + removeLastComma(all_names) + "</b></p>";
	}

	if (risk) {
		set_icon($("#test_risk8"), 'positive');
		risk_reason += "<em>" + $.t("fhh_breast_calculator.test_risk8_jewish_summary") + "</em>";

		set_reason($("#test_risk8"), risk_reason);
	} else {
		set_icon($("#test_risk8"), 'negative');
		set_reason($("#test_risk8"), $.t("fhh_breast_calculator.test_risk8_negative"));
	}

	risk8 |= risk;
	// Goto Next test
	set_icon($("#test_risk9"), 'calculating');
	setTimeout(test_risk9, 500);
}

function test_risk9() {

	risk_summary = "";

	var h = personal_information['Health History'];
	if (h == null) h = {};
	var risk = false;
	risk_reason = "";

	if (personal_information['brca']) {

		risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk9_brca") + "</p>";
		risk = true;
	}


	//debugger;

	if (risk) {
		set_icon($("#test_risk9"), 'positive');
		set_reason($("#test_risk9"), risk_reason);
	} else {
		set_icon($("#test_risk9"), 'negative');
		set_reason($("#test_risk9"), $.t("fhh_breast_calculator.test_risk9_negative"));
	}

	risk9 |= risk;
	// Goto Next test
	set_icon($("#test_risk10"), 'calculating');
	setTimeout(test_risk10, 500);
}

function test_risk10() {
	var risk = false;
	var risk_me = false;
	var risk_mother_side = false;
	var risk_father_side = false;
	var mother_side_count = 0;
	var father_side_count = 0;
	var count = 0;

	me_disease = "";
	all_names = "";
	risk_reason = "";
	risk_summary = "";
	risk_reason = "";
	var h = personal_information['Health History'];
	if (h == null) h = {};

	for (i = 0; i < h.length; i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-254837009') {//breast cancer
			risk_me = true;
			me_disease += "Breast Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-706970001') {//breast cancer (triple negative)
			risk_me = true;
			me_disease += "Breast cancer (triple negative)|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-1000000') {//brain cancer
			risk_me = true;
			me_disease += "Brain Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-93143009') {//leukemia
			risk_me = true;
			me_disease += "Leukemia|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-363406005') {//colon cancer
			risk_me = true;
			me_disease += "Colon Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-371973000') {//uterine cancer
			risk_me = true;
			me_disease += "Uterine Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-363478007') {//thyroid cancer
			risk_me = true;
			me_disease += "Thyroid Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-363518003') {//kidney cancer
			risk_me = true;
			me_disease += "Kidney Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-363349007') {//gastric cancer
			risk_me = true;
			me_disease += "Gastric Cancer|"
		}
		else if (h[i]['Disease Code'] == 'SNOMED_CT-399068003') {//prostate cancer
			risk_me = true;
			me_disease += "Prostate Cancer"
		}
	}

	if (me_disease != "")
		all_names = "<br>Yourself (" + me_disease + ")";


	$.each(personal_information, function (key, item) {
		if (item != null) {
			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
			if (key.substring(0, 8) == 'maternal' && personal_information['mother'].adopted == true) return true;
			if (key.substring(0, 8) == 'paternal' && personal_information['father'].adopted == true) return true;
			// Got to figure out grandchildren for adopted parents.
			if (key.substring(0, 8) == 'granddau' || key.substring(0, 8) == 'grandson') {
				var relative = get_relative_by_id(item.parent_id);
				if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];

			if (h != null) {
				var temp = key.substring(0, 8);
				relative_disease = "";
				name = get_name_or_relationship(this.name, key);

				if (check_blood_relative(key) == false) return true; // Skip adopted relatives

				for (i = 0; i < h.length; i++) {
					if (h[i]['Disease Code'] == 'SNOMED_CT-254837009') {//breast cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Breast cancer|";

					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-706970001') {//breast cancer (triple negative)
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Breast cancer (triple negative)|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-1000000') {//brain cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Brain cancer|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-93143009') {//leukemia
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Leukemia|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-363406005') {//colon cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Colon cancer|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-371973000') {//uterine cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Uterine cancer|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-363478007') {//thyroid cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;
						relative_disease += "Thyroid cancer|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-363518003') {//kidney cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Kidney cancer|";

					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-363349007') {//gastric cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Gastric cancer|";
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-399068003') {//prostate cancer
						if (temp == 'maternal' || key == 'mother') {
							mother_side_count++;
							count++;
						}
						else if (temp == 'paternal' || key == 'father') {
							father_side_count++;
							count++;
						}
						else
							count++;

						relative_disease += "Prostate cancer";
					}
				}

				if (relative_disease != "")
					all_names += "<br>" + titleCase(name) + "(" + removeLastBar(relative_disease) + ")";
			}
		}
	});


	if (personal_information['consanguinity'] == null) {
		if ((risk_me && father_side_count > 1) || (risk_me && mother_side_count > 1) || (!risk_me && mother_side_count > 2) || (!risk_me && father_side_count > 2)) {

			risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk10_nocheck") + "<b>" + all_names + "</b></p>";
			risk = true;
		}
		else
			risk_reason = $.t("fhh_breast_calculator.test_risk10_negative_nocheck");
	}

	if (personal_information['consanguinity'] != null) {
		if ((risk_me && count > 1) || (!risk_me && count > 2)) {
			risk_reason = "<p style=\"color:red;\">" + $.t("fhh_breast_calculator.test_risk10_check") + "<b>" + all_names + "</b></p>";
			risk = true;
		}
		else
			risk_reason = $.t("fhh_breast_calculator.test_risk10_negative_check");
	}

	if (risk) {
		set_icon($("#test_risk10"), 'positive');
		risk_reason += "<em>" + $.t("fhh_breast_calculator.test_risk10_summary") + "</em>";
		set_reason($("#test_risk10"), risk_reason);
	} else {
		set_icon($("#test_risk10"), 'negative');
		set_reason($("#test_risk10"), risk_reason);
	}

	risk10 |= risk;
	// Goto Next test
	set_icon($("#test_final"), 'calculating');
	setTimeout(test_final, 500);
}

function test_final() {

	debugger;
	var age = getAge(personal_information['date_of_birth']);

	if ((personal_information['gender'] == "FEMALE" && risk1) && (!risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10)) {
		if (age < 40) {
			set_icon_final($("#final"), 'positive');
			set_reason($("#final"), $.t("fhh_breast_calculator.final_risk1_40"));
			$("#explanation_low_risk").hide();
			$("#explanation_high_risk").show();
		}
		else if (age > 39 && age < 50) {
			set_icon_final($("#final"), 'positive');
			set_reason($("#final"), $.t("fhh_breast_calculator.final_risk1_50"));
			$("#explanation_low_risk").hide();
			$("#explanation_high_risk").show();
		}
		else {
			set_icon_final($("#final"), 'positive');
			set_reason($("#final"), $.t("fhh_breast_calculator.final_risk1_60"));
			$("#explanation_low_risk").hide();
			$("#explanation_high_risk").show();
		}
	}
	else if (risk2 || risk3 || risk4 || risk5 || risk6 || risk7 || risk8 || risk9 || risk10) {
		set_icon_final($("#final"), 'positive');
		set_reason($("#final"), $.t("fhh_breast_calculator.final_risk2_g"));
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	}
	else if ((personal_information['gender'] == "MALE") && ((risk1 && !risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10) ||
		(!risk1 && !risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10))) {
		set_icon_final($("#final"), 'negative');
		set_reason($("#final"), $.t("fhh_breast_calculator.final_risk_negative1"));
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	}
	else if ((personal_information['gender'] == "FEMALE") && (riskNum() == 0)) {
		set_icon_final($("#final"), 'negative');
		set_reason($("#final"), $.t("fhh_breast_calculator.final_risk_negative2"));
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	}
	else {
		set_icon_final($("#final"), 'negative');
		set_reason($("#final"), $.t("fhh_breast_calculator.final_risk2"));
		$("#explanation_high_risk").hide();
		$("#explanation_low_risk").show();
	}
}

function main_test_breast() {

	debugger;
	var final_main_test = false;

	test_risk1();
	test_risk2();
	test_risk3();
	test_risk4();
	test_risk5();
	test_risk6();
	test_risk7();
	test_risk8();
	test_risk9();
	test_risk10();



	var age = getAge(personal_information['date_of_birth']);

	if ((personal_information['gender'] == "FEMALE" && risk1) && (!risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10)) {
		if (age < 40) {
			final_main_test = true;
		}
		else if (age > 39 && age < 50) {
			final_main_test = true;
		}
		else {
			final_main_test = true;
		}
	}
	else if (risk2 || risk3 || risk4 || risk5 || risk6 || risk7 || risk8 || risk9 || risk10) {
		final_main_test = true;
	}
	else if ((personal_information['gender'] == "MALE") && ((risk1 && !risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10) ||
		(!risk1 && !risk2 && !risk3 && !risk4 && !risk5 && !risk6 && !risk7 && !risk8 && !risk9 && !risk10))) {
			final_main_test = false;
	}
	else if ((personal_information['gender'] == "FEMALE") && (riskNum() == 0)) {
		final_main_test = false;
	}
	else {
		final_main_test = false;
	}

	return final_main_test;
}
///  Support functions 

// Basically a lookup table
// Note as 60 and older includes 60 we need to be consevative and say that they are 60 or under
// Same with 50,40,30,20,10

function riskNum() {
	var count = 0;
	if (risk1)
		count += 1;
	if (risk2)
		count += 1;
	if (risk3)
		count += 1;
	if (risk4)
		count += 1;
	if (risk5)
		count += 1;
	if (risk6)
		count += 1;
	if (risk7)
		count += 1;
	if (risk8)
		count += 1;
	if (risk8)
		count += 1;
	if (risk9)
		count += 1;
	if (risk10)
		count += 1;

	return count;

}
function titleCase(str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
}

function is_age_before(age_to_check, age_at_diagnosis) {
	//debugger;
	switch (age_to_check) {
		case 'Under60':
			if (age_at_diagnosis == 'senior') return true;
		case 'Under50':
			if (age_at_diagnosis == 'fifties') return true;
		case 'Under40':
			if (age_at_diagnosis == 'fourties') return true;
		case 'Under30':
			if (age_at_diagnosis == 'thirties') return true;
		case 'Under20':
			if (age_at_diagnosis == 'twenties') return true;
		case 'Under10':
			if (age_at_diagnosis == 'teen') return true;
			if (age_at_diagnosis == 'child') return true;
			if (age_at_diagnosis == 'infant') return true;
			if (age_at_diagnosis == 'newborn') return true;
			if (age_at_diagnosis == 'prebirth') return true;
			if (age_at_diagnosis == 'Unknown') return true;
			if (age_at_diagnosis == 'unknown') return true;
	}
	return false;
}

function set_icon(field, state) {
	switch (state) {
		case 'waiting':
			$(field).find("#test").empty().append("<IMG alt='waiting' src='../risk/image/blue_waiting.png' height='40'/>");
			break;
		case 'calculating':
			$(field).find("#test").empty().append("<IMG alt='calculating' src='../risk/image/blue_calculating_sm.gif' height='20'/>");
			break;
		case 'negative':
			$(field).find("#test").empty().append("<IMG alt='good_because_negative' src='../risk/image/green_check_sm.gif' height='20'/>");
			break;
		case 'positive':
			$(field).find("#test").empty().append("<IMG alt='bad_because_positive' src='../risk/image/red_x_sm.gif' height='20'/>");
			break;

	}
}

function set_icon_final(field, state) {
	switch (state) {
		case 'waiting':
			$(field).find("#test").empty().append("<IMG alt='waiting' src='../risk/image/blue_waiting.png' height='40'/>");
			break;
		case 'calculating':
			$(field).find("#test").empty().append("<IMG alt='calculating' src='../image/brca/blue_calculating.gif' height='40'/>");
			break;
		case 'negative':
			$(field).find("#test").empty().append("<IMG alt='good_because_negative' src='../risk/image/smiley.gif' height='40'/>");
			break;
		case 'positive':
			$(field).find("#test").empty().append("<IMG alt='bad_because_positive' src='../risk/image/triangle.gif' height='40'/>");
			break;

	}
}

function set_reason(field, text) {
	$(field).find("#reason").empty().append(text);
}

function set_summary(field, text) {
	$(field).find("#summary").empty().append(text);
}

function removeLastComma(str) {
	return str.replace(/,(\s+)?$/, '');
}
function removeLastBar(str) {
	return str.replace(/(\s?\|)+$/g, '');
}

function get_name_or_relationship(name, relationship) {
	//if (name && name.length > 0) return name;
	//debugger;
	var n = relationship.lastIndexOf('_');
	if (n > 0) {
		s = relationship.substring(0, n == -1 ? n : relationship.length);
		s = s.replace("_", " ");
		s = s.replace(/[0-9]/g, ''); //remove number
		s = s.replace(/_/g, "");//remove underscore

	}
	else
		s = relationship;

	if (name && name.length > 0)
		return s + " (" + name + ") ";
	else
		return s + " ";
}


// Used for determining if relative is adopted
function get_relative_by_id(id) {
	for (var relative in personal_information) {
		if (personal_information[relative]) { // line added to prevent undefined error on id property
			if (typeof personal_information[relative].id != 'undefined') {
				if (personal_information[relative].id == id) return relative;
			}
		} //

	}
	return null;
}

function getAge(birth) {
	var today = new Date();
	var curr_date = today.getDate();
	var curr_month = today.getMonth() + 1;
	var curr_year = today.getFullYear();

	var pieces = birth.split('/');
	var birth_date = pieces[0];
	var birth_month = pieces[1];
	var birth_year = pieces[2];

	if (curr_month == birth_month && curr_date >= birth_date) return parseInt(curr_year - birth_year);
	if (curr_month == birth_month && curr_date < birth_date) return parseInt(curr_year - birth_year - 1);
	if (curr_month > birth_month) return parseInt(curr_year - birth_year);
	if (curr_month < birth_month) return parseInt(curr_year - birth_year - 1);
}

// Three different checks for blood relatives.
// 1st, 2nd, 3rd level
// 1st: brother, sister, mother, father, son, daughter
// 2nd: grandparents, grandchildren, aunts, uncles, half-siblings (but halfsiblings count as primary in this case only)
// 3rd: cousins, niece/nephews

function check_blood_relative(relative) {
	// If the proband is adopted, then only son,daughter, grandson, granddaughter could possibly be blood
	if (personal_information.adopted == true) {
		if (!(relative.substring(0, 3) == 'son' || relative.substring(0, 8) == 'daughter'
			|| relative.substring(0, 8) == 'grandson' || relative.substring(0, 13) == 'granddaughter')) {
			return false;
		}
	}

	// All cases check if that person is adopted, if they are, they are not blood relative
	if (typeof personal_information[relative] != 'undefined') {
		//		alert (personal_information[relative].name + ":" + (personal_information[relative].adopted == 'true') );
		// If your relative is adopted and not your mom, dad, grandparents, then not a blood relative
		if (personal_information[relative].adopted == true &&
			!(relative.substring(0, 6) == 'mother' || relative.substring(0, 6) == 'father'
				|| relative.substring(0, 20) == 'maternal_grandfather' || relative.substring(0, 20) == 'maternal_grandmother'
				|| relative.substring(0, 20) == 'paternal_grandfather' || relative.substring(0, 20) == 'paternal_grandmother')) return false;
	}
	// Primary, no other tests required
	if (relative.substring(0, 7) == 'brother' || relative.substring(0, 6) == 'sister'
		|| relative.substring(0, 6) == 'mother' || relative.substring(0, 6) == 'father'
		|| relative.substring(0, 3) == 'son' || relative.substring(0, 8) == 'daughter') {
		return true;
	}

	// Half-siblings also do not need another test
	if (relative.substring(0, 20) == 'maternal_halfbrother' || relative.substring(0, 19) == 'maternal_halfsister'
		|| relative.substring(0, 20) == 'paternal_halfbrother' || relative.substring(0, 19) == 'paternal_halfsister') {
		return true;
	}

	// For 2nd degree relatives, check mother or father as well
	if (relative.substring(0, 13) == 'maternal_aunt' || relative.substring(0, 14) == 'maternal_uncle'
		|| relative.substring(0, 20) == 'maternal_grandfather' || relative.substring(0, 20) == 'maternal_grandmother') {
		if (typeof personal_information['mother'] != 'undefined' && personal_information['mother'].adopted == true) return false;
		else return true;
	}

	if (relative.substring(0, 13) == 'paternal_aunt' || relative.substring(0, 14) == 'paternal_uncle'
		|| relative.substring(0, 20) == 'paternal_grandfather' || relative.substring(0, 20) == 'paternal_grandmother') {
		if (typeof personal_information['father'] != 'undefined' && personal_information['father'].adopted == true) return false;
		else return true;
	}

	// Grandchildren need to check the child as well
	if (relative.substring(0, 8) == 'grandson' || relative.substring(0, 13) == 'granddaughter') {
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
		if (typeof personal_information[parent_of_relative] != 'undefined' && personal_information[parent_of_relative].adopted == true) return false;
		return true;
	}


	// For 3rd degree relatives, check parent of the person and the mother or father as well
	if (relative.substring(0, 15) == 'maternal_cousin') {
		if (typeof personal_information['mother'] != 'undefined' && personal_information['mother'].adopted == 'true') return false;
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
		//	 alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
		if (typeof personal_information[parent_of_relative] != 'undefined' && personal_information[parent_of_relative].adopted == true) return false;
		return true;
	}

	if (relative.substring(0, 15) == 'paternal_cousin') {
		if (typeof personal_information['father'] != 'undefined' && personal_information['father'].adopted == 'true') return false;
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
		if (typeof personal_information[parent_of_relative] != 'undefined' && personal_information[parent_of_relative].adopted == true) return false;
		return true;
	}

	if (relative.substring(0, 5) == 'niece' || relative.substring(0, 6) == 'nephew') {
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
		//		alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
		if (typeof personal_information[parent_of_relative] != 'undefined' && personal_information[parent_of_relative].adopted == true) return false;
		return true;
	}

	return true; // Non-relative entries should be ignored
}