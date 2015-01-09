// Key Codes
/*
	"SNOMED_CT-363406005": "Colon Cancer",
	"SNOMED_CT-363349007": "Gastric Cancer",
	"SNOMED_CT-1000001": "Colorectal Cancer",
	"SNOMED_CT-254582000": "Rectal Cancer",
	"SNOMED_CT-72900001": "Familial adnenomatous polyposis (FAP)",
	"SNOMED_CT-68496003": "Colon Polyp",
	"SNOMED_CT-371973000": "Uterine Cancer",
	"SNOMED_CT-363418001": "Pancreatic Cancer",
	"SNOMED_CT-363443007": "Ovarian Cancer",
	"SNOMED_CT-363418001": "Pancreatic Cancer",
	"SNOMED_CT-93870000": "Liver Cancer",
	"SNOMED_CT-1000000": "Brain Cancer",
	"SNOMED_CT-315058005": "Lynch Syndrome/Hereditary non-polyposis colorectal cancer (HNPCC)",
	"SNOMED_CT-34000006": "Crohn's Disease",
	"SNOMED_CT-64766004": "Ulcerative Colitis",
	"SNOMED_CT-363518003": "Kidney Cancer",
*/

var final_risk = false;

// get lng and set to variable. used to open correct pdf //
var lng = window.i18n.lng();
if (lng=='en-US') {
	lng = 'en';
};

if (personal_information == null) alert ($.t("fhh_colorectal_calculator.personal_information"));

set_icon($("#past_cancers"), 'calculating');
setTimeout(test_past_cancer, 500);

/// End of main script

function test_past_cancer() {
	var h = personal_information['Health History'];
	if (h == null) h={};
	var risk = false;
	risk_reason = "";
	for (i=0;i<h.length;i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-363406005') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk1") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-1000001') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk2") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-254582000') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk3") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-371973000') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk4") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-363418001') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk5") + "<br />";
				risk=true;
		}
		if (h[i]['SNOMED_CT-363443007'] == 'Ovarian Cancer') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk6") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-363349007') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk7") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-1000000') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk8") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-126952004') { 
			// This code comes from the old system
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk9") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-93870000') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk10") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-363518003') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk11") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-315058005') {
				risk_reason += $.t("fhh_colorectal_calculator.past_cancer_risk12") + "<br />";
				risk=true;
		}
	}
	if (risk) {
		set_icon($("#past_cancers"), 'positive');
		set_reason($("#past_cancers"), risk_reason);
	} else {
		set_icon($("#past_cancers"), 'negative');
		set_reason($("#past_cancers"), $.t("fhh_colorectal_calculator.past_cancer_negative"));
	}

	final_risk |= risk;
	// Goto Next test
	set_icon($("#polyps"), 'calculating');
	setTimeout(test_polyps, 500);
}

function test_polyps() {
	var h = personal_information['Health History'];
	if (h == null) h={};
	var risk = false;
	risk_reason = "";
	for (i=0;i<h.length;i++) {
		if (h[i]['Disease Code'] == 'SNOMED_CT-68496003') {
				risk_reason += $.t("fhh_colorectal_calculator.polyps_risk1") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-72900001') {
				risk_reason += $.t("fhh_colorectal_calculator.polyps_risk2") + "<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#polyps"), 'positive');
		set_reason($("#polyps"), risk_reason);
	} else {
		set_icon($("#polyps"), 'negative');
		set_reason($("#polyps"),$.t("fhh_colorectal_calculator.polyps_negative"));
	}

	final_risk |= risk;
	// Goto Next test
	set_icon($("#inflammatory_bowel_disease"), 'calculating');
	setTimeout(test_inflammatory_bowel_disease, 500);
}

function test_inflammatory_bowel_disease() {
	var h = personal_information['Health History'];
	if (h == null) h={};
	var risk = false;
	risk_reason = "";
	for (i=0;i<h.length;i++) {
		if (h[i]['Disease Code'] == "SNOMED_CT-34000006") {
				risk_reason += $.t("fhh_colorectal_calculator.ibd_risk1") + "<br />";
				risk=true;
		}
		if (h[i]['Disease Code'] == 'SNOMED_CT-64766004') {
				risk_reason += $.t("fhh_colorectal_calculator.ibd_risk2") + "<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#inflammatory_bowel_disease"), 'positive');
		set_reason($("#inflammatory_bowel_disease"), risk_reason);
	} else {
		set_icon($("#inflammatory_bowel_disease"), 'negative');
		set_reason($("#inflammatory_bowel_disease"),$.t("fhh_colorectal_calculator.ibd_negative"));
	}

	final_risk |= risk;
	// Goto Next test
	set_icon($("#immediate_family_members_cancer"), 'calculating');
	setTimeout(test_any_family_members_fap_hnpcc, 500);
}

function test_any_family_members_fap_hnpcc() {
	var risk = false;
	risk_reason = "";
  $.each(personal_information, function (key, item) {
  	if (item != null) {
	  	if (check_blood_relative(key) == false) return true; // Skip adopted relatives
  		if (key.substring(0,8) == 'maternal' && personal_information['mother'].adopted == true) return true;
  		if (key.substring(0,8) == 'paternal' && personal_information['father'].adopted == true) return true;
  		// Got to figure out grandchildren for adopted parents.
			if (key.substring(0,8) == 'granddau' || key.substring(0,8) == 'grandson') {
  			var relative = get_relative_by_id(item.parent_id);
  			if (typeof personal_information[relative] != 'undefined' && personal_information[relative].adopted == true) return true;
			}

			var h = item['Health History'];
			
			if (h != null) {
				for (i=0;i<h.length;i++) {
					if (h[i]['Disease Code'] == 'SNOMED_CT-315058005') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + $.t("fhh_colorectal_calculator.fap_hnpcc_risk1") + "<br />";
						risk=true;
					}
					if (h[i]['Disease Code'] == 'SNOMED_CT-72900001') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + $.t("fhh_colorectal_calculator.fap_hnpcc_risk2") + "<br />";
						risk=true;
					}
				}
			}
		}
	});
	
	if (risk) {
		set_icon($("#any_family_members_fap_hnpcc"), 'positive');
		set_reason($("#any_family_members_fap_hnpcc"), risk_reason);
	} else {
		set_icon($("#any_family_members_fap_hnpcc"), 'negative');
		set_reason($("#any_family_members_fap_hnpcc"), $.t("fhh_colorectal_calculator.fap_hnpcc_negative"));
	}
	
	final_risk |= risk;
	// Goto Next test
	set_icon($("#immediate_family_members_cancer"), 'calculating');
	setTimeout(test_immediate_family_members_cancer, 500);
}


function test_immediate_family_members_cancer() {
	var risk = false;
	risk_reason = "";
  $.each(personal_information, function (key, item) {
  	if (item != null) {
			var h = item['Health History'];
			
			if (h != null) {
				var temp = key.substring(0,4);
				if(temp == 'fath' || temp == 'moth' || temp == 'brot' || temp == 'sist' || temp == 'daug' || temp == 'son_') {
		  		if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
					if (h[i]['Disease Code'] == 'SNOMED_CT-363406005') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.family_members_cancer_risk1") + "<br />";
							risk=true;
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-1000001') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.family_members_cancer_risk2") + "<br />";
							risk=true;
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-254582000') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.family_members_cancer_risk3") + "<br />";
							risk=true;
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-363349007') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.family_members_cancer_risk4") + "<br />";
							risk=true;
						}
					}
				}
			}
		}
	});
	
	if (risk) {
		set_icon($("#immediate_family_members_cancer"), 'positive');
		set_reason($("#immediate_family_members_cancer"), risk_reason);
	} else {
		set_icon($("#immediate_family_members_cancer"), 'negative');
		set_reason($("#immediate_family_members_cancer"),$.t("fhh_colorectal_calculator.family_members_cancer_negative"));		
		}
	
	final_risk |= risk;
	// Goto Next test
	set_icon($("#immediate_family_members_polyps"), 'calculating');
	setTimeout(test_immediate_family_members_polyps, 500);
}

function test_immediate_family_members_polyps() {
	var risk = false;
	risk_reason = "";
  $.each(personal_information, function (key, item) {
  	if (item != null) {
			var h = item['Health History'];

			if (h != null) {
				var temp = key.substring(0,4);
				if(temp == 'fath' || temp == 'moth' || temp == 'brot' || temp == 'sist' || temp == 'daug' || temp == 'son_') {
  				if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Colon Polyp') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.family_members_polyps_risk1");
							risk=true;
						}
					}
				}
			}
		}
	});
	
	if (risk) {
		set_icon($("#immediate_family_members_polyps"), 'positive');
		set_reason($("#immediate_family_members_polyps"), risk_reason);
	} else {
		set_icon($("#immediate_family_members_polyps"), 'negative');
		set_reason($("#immediate_family_members_polyps"),$.t("fhh_colorectal_calculator.family_members_polyps_negative"));
	}
	

	final_risk |= risk;
	// Goto Next test
	set_icon($("#secondary_family_members_cancer"), 'calculating');
	setTimeout(test_secondary_family_members_cancer, 500);
}

function test_secondary_family_members_cancer() {

	var risk = false;
	var count = 0;
	risk_reason = "";
  $.each(personal_information, function (key, item) {
  	if (item != null) {
 			var h = item['Health History'];
			if (h != null) {

				var temp8 = key.substring(0,8);
				var temp13 = key.substring(0,13);
				if(temp13 == 'maternal_uncl' || temp13 == 'paternal_uncl' || 
					 temp13 == 'maternal_aunt' || temp13 == 'paternal_aunt' ||
					 temp13 == 'maternal_gran' || temp13 == 'paternal_gran' ||
					 temp13 == 'maternal_half' || temp13 == 'paternal_half' ||
					 temp8 == 'granddau' || temp8 == 'grandson') {
  				if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-363406005') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk1") + "<br />";
							count++;
							break;  // We do not need to check this person anyore
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-1000001') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk2") + "<br />";
							count++;
							break;  // We do not need to check this person anyore
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-254582000') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk3") + "<br />";
							count++;
							break;  // We do not need to check this person anyore
						}
					}
				}
			}
		}
	});
	if (count == 0) {
		risk = false;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk4");		
	} else if (count == 1) {
		risk = false;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk5") +  "<br />" + risk_reason;
		
	} else {
		risk = true;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_cancer_risk6") +  "<br />" + risk_reason;
	} 
	
	if (risk) {
		set_icon($("#secondary_family_members_cancer"), 'positive');
		set_reason($("#secondary_family_members_cancer"), risk_reason);
	} else {
		set_icon($("#secondary_family_members_cancer"), 'negative');
		set_reason($("#secondary_family_members_cancer"), risk_reason);
	}
	
	final_risk |= risk;
	// Goto Next test
	set_icon($("#secondary_family_members_colon_cancer_before_60"), 'calculating');
	setTimeout(test_secondary_family_members_colon_cancer_before_60, 500);
}

function test_secondary_family_members_colon_cancer_before_60() {
	var risk = false;
	risk_reason = "";
  $.each(personal_information, function (key, item) {

  	if (item != null) {
			var h = item['Health History'];
			if (h != null) {

				var temp8 = key.substring(0,8);
				var temp13 = key.substring(0,13);
				if(temp13 == 'maternal_uncl' || temp13 == 'paternal_uncl' || 
					 temp13 == 'maternal_aunt' || temp13 == 'paternal_aunt' ||
					 temp13 == 'maternal_gran' || temp13 == 'paternal_gran' ||
					 temp13 == 'maternal_half' || temp13 == 'paternal_half' ||
					 temp8 == 'granddau' || temp8 == 'grandson') {
	  			if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-363406005' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							if (h[i]['Age At Diagnosis'] == 'Unknown') risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk1") + "<br />";
							else risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk2") + "<br />";
							risk=true;
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-1000001' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							if (h[i]['Age At Diagnosis'] == 'Unknown') risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk3") + "<br />";
							else risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk4") + "<br />";
							risk=true;
						}
						if (h[i]['Disease Code'] == 'SNOMED_CT-254582000' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							if (h[i]['Age At Diagnosis'] == 'Unknown') risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk5") + "<br />";
							else risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_risk6") + "<br />";
							risk=true;
						}
					}
				}
			}
		}
	});
	
	if (risk) {
		set_icon($("#secondary_family_members_colon_cancer_before_60"), 'positive');
		set_reason($("#secondary_family_members_colon_cancer_before_60"), risk_reason);
	} else {
		set_icon($("#secondary_family_members_colon_cancer_before_60"), 'negative');
		set_reason($("#secondary_family_members_colon_cancer_before_60"),$.t("fhh_colorectal_calculator.secondary_family_members_colon_cancer_before_60_negative"));
	}

	final_risk |= risk;
	// Goto Next test
	set_icon($("#secondary_family_members_uterine_cancer_before_50"), 'calculating');
	setTimeout(test_secondary_family_members_uterine_cancer_before_50, 500);
}

function test_secondary_family_members_uterine_cancer_before_50() {
	var risk = false;
	risk_reason = "";
  $.each(personal_information, function (key, item) {
  	if (item != null) {
			var h = item['Health History'];
			if (h != null) {

				var temp4 = key.substring(0,4);
				var temp8 = key.substring(0,8);
				var temp13 = key.substring(0,13);
				if(temp4 == 'fath' || temp4 == 'moth' || temp4 == 'brot' || temp4 == 'sist' || temp4 == 'daug' || temp4 == 'son_'
					|| temp13 == 'maternal_uncl' || temp13 == 'paternal_uncl' || temp13 == 'maternal_aunt' || temp13 == 'paternal_aunt'
					|| temp13 == 'maternal_gran' || temp13 == 'paternal_gran' || temp13 == 'maternal_half' || temp13 == 'paternal_half'
					|| temp8 == 'granddau' || temp8 == 'grandson') {
			  	if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-371973000' && is_age_before('Under50', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							if (h[i]['Age At Diagnosis'] == 'Unknown') risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_before_50_risk1") + "<br />";
							else risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_before_50_risk2") + "<br />";
							risk=true;
						}
					}
				}
			}
		}
	});
	
	if (risk) {
		set_icon($("#secondary_family_members_uterine_cancer_before_50"), 'positive');
		set_reason($("#secondary_family_members_uterine_cancer_before_50"), risk_reason);
	} else {
		set_icon($("#secondary_family_members_uterine_cancer_before_50"), 'negative');
		set_reason($("#secondary_family_members_uterine_cancer_before_50"),$.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_before_50_negative"));
	}

	final_risk |= risk;
	// Goto Next test
	set_icon($("#multiple_secondary_family_members_uterine_cancer"), 'calculating');
	setTimeout(test_secondary_family_members_uterine_cancer, 500);
}

function test_secondary_family_members_uterine_cancer() {

	var risk = false;
	var count = 0;
	risk_reason = "";
  $.each(personal_information, function (key, item) {

  	if (item != null) {
			var h = item['Health History'];
			if (h != null) {

				var temp8 = key.substring(0,8);
				var temp13 = key.substring(0,13);
				if(temp13 == 'maternal_uncl' || temp13 == 'paternal_uncl' || 
					 temp13 == 'maternal_aunt' || temp13 == 'paternal_aunt' ||
					 temp13 == 'maternal_gran' || temp13 == 'paternal_gran' ||
					 temp13 == 'maternal_half' || temp13 == 'paternal_half' ||
					 temp8 == 'granddau' || temp8 == 'grandson') {
			  	if (check_blood_relative(key) == false) return true; // Skip adopted relatives
					for (i=0;i<h.length;i++) {
						if (h[i]['Disease Code'] == 'SNOMED_CT-371973000') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " " + $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_risk1") + "<br />";
							count++;
						}
					}
				}
			}
		}
	});
	if (count == 0) {
		risk = false;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_risk2");
		
	} else if (count == 1) {
		risk = false;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_risk3") + "<br />" + risk_reason;
		
	} else {
		risk = true;
		risk_reason = $.t("fhh_colorectal_calculator.secondary_family_members_uterine_cancer_risk4") + "<br />" + risk_reason;
	} 
	
	if (risk) {
		set_icon($("#multiple_secondary_family_members_uterine_cancer"), 'positive');
		set_reason($("#multiple_secondary_family_members_uterine_cancer"), risk_reason);
	} else {
		set_icon($("#multiple_secondary_family_members_uterine_cancer"), 'negative');
		set_reason($("#multiple_secondary_family_members_uterine_cancer"), risk_reason);
	}
	
	final_risk |= risk;
	// Goto Next test
	set_icon($("#final"), 'calculating');
	setTimeout(test_final, 500);
}


function test_final() {
	if (final_risk) {
		set_icon($("#final"), 'positive');
		set_reason($("#final"),$.t("fhh_colorectal_calculator.final_risk1"));
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	} else {
		set_icon($("#final"), 'negative');
		set_reason($("#final"),$.t("fhh_colorectal_calculator.final_risk2"));
		$("#explanation_high_risk").hide();
		$("#explanation_low_risk").show();
	}
}
///  Support functions 

// Basically a lookup table
// Note as 60 and older includes 60 we need to be consevative and say that they are 60 or under
// Same with 50,40,30,20,10
 
function is_age_before(age_to_check, age_at_diagnosis) {
	switch(age_to_check) {
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
			$(field).find("#test").empty().append("<IMG alt='waiting' src='../risk/crca/blue_waiting.png' height='40'/>");
			break;
		case 'calculating':
			$(field).find("#test").empty().append("<IMG alt='calculating' src='../risk/crca/blue_calculating.gif' height='40'/>");
			break;
		case 'negative':
			$(field).find("#test").empty().append("<IMG alt='good_because_negative' src='../risk/crca/green_x.png' height='40'/>");
			break;
		case 'positive':
			$(field).find("#test").empty().append("<IMG alt='bad_because_positive' src='../risk/crca/red_check.png' height='40'/>");
			break;
			
	}
}

function set_reason(field, text) {
			$(field).find("#reason").empty().append(text);
}

function get_name_or_relationship (name, relationship) {
	if (name && name.length > 0) return name;

	var n = relationship.lastIndexOf('_');
	s = relationship.substring(0, n != -1 ? n : relationship.length);
	s = s.replace ("_", " ");
	return "Your " + s;
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

// Three different checks for blood relatives.
// 1st, 2nd, 3rd level
// 1st: brother, sister, mother, father, son, daughter
// 2nd: grandparents, grandchildren, aunts, uncles, half-siblings (but halfsiblings count as primary in this case only)
// 3rd: cousins, niece/nephews

function check_blood_relative(relative) {
	// If the proband is adopted, then only son,daughter, grandson, granddaughter could possibly be blood
	if (personal_information.adopted == true) {
		if (! (relative.substring(0,3) == 'son'     || relative.substring(0,8) == 'daughter' 
		 || relative.substring(0,8) == 'grandson' || relative.substring(0,13) == 'granddaughter')) {
			return false;
		}
	}
	
	// All cases check if that person is adopted, if they are, they are not blood relative
	if (typeof personal_information[relative] != 'undefined')
	{
//		alert (personal_information[relative].name + ":" + (personal_information[relative].adopted == 'true') );
		// If your relative is adopted and not your mom, dad, grandparents, then not a blood relative
		if (personal_information[relative].adopted == true &&
		 !(relative.substring(0,6) == 'mother'  || relative.substring(0,6) == 'father'
		 || relative.substring(0,20) == 'maternal_grandfather' || relative.substring(0,20) == 'maternal_grandmother'
		 || relative.substring(0,20) == 'paternal_grandfather' || relative.substring(0,20) == 'paternal_grandmother' ) ) return false;
	}
// Primary, no other tests required
	if (relative.substring(0,7) == 'brother' || relative.substring(0,6) == 'sister' 
	 || relative.substring(0,6) == 'mother'  || relative.substring(0,6) == 'father'
	 || relative.substring(0,3) == 'son'     || relative.substring(0,8) == 'daughter') {
		return true;
	}

// Half-siblings also do not need another test
	if (relative.substring(0,20) == 'maternal_halfbrother' || relative.substring(0,19) == 'maternal_halfsister' 
	 || relative.substring(0,20) == 'paternal_halfbrother' || relative.substring(0,19) == 'paternal_halfsister') {
	 	return true;	
	}
	
// For 2nd degree relatives, check mother or father as well
	if (relative.substring(0,13) == 'maternal_aunt' || relative.substring(0,14) == 'maternal_uncle'
	 || relative.substring(0,20) == 'maternal_grandfather' || relative.substring(0,20) == 'maternal_grandmother') {
	 	if (typeof personal_information['mother'] != 'undefined'  && personal_information['mother'].adopted == true) return false;
	 	else return true;
	}

	if (relative.substring(0,13) == 'paternal_aunt' || relative.substring(0,14) == 'paternal_uncle'
	 || relative.substring(0,20) == 'paternal_grandfather' || relative.substring(0,20) == 'paternal_grandmother') {
	 	if (typeof personal_information['father'] != 'undefined'  && personal_information['father'].adopted == true) return false;
	 	else return true;
	}
	
// Grandchildren need to check the child as well
	if (relative.substring(0,8) == 'grandson' || relative.substring(0,13) == 'granddaughter') {
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
   if (typeof personal_information[parent_of_relative] != 'undefined'  &&  personal_information[parent_of_relative].adopted == true) return false;
	 return true;
	}

	
// For 3rd degree relatives, check parent of the person and the mother or father as well
	if (relative.substring(0,15) == 'maternal_cousin' ) {
	 if (typeof personal_information['mother'] != 'undefined'  && personal_information['mother'].adopted == 'true') return false;
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
//	 alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
	 	if (typeof personal_information[parent_of_relative] != 'undefined'  &&  personal_information[parent_of_relative].adopted == true) return false;
	 return true;
	}
	
	if (relative.substring(0,15) == 'paternal_cousin') {
	 if (typeof personal_information['father'] != 'undefined'  && personal_information['father'].adopted == 'true') return false;
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
	 	if (typeof personal_information[parent_of_relative] != 'undefined'  && personal_information[parent_of_relative].adopted == true) return false;
	 return true;
	}
	
	if (relative.substring(0,5) == 'niece' || relative.substring(0,6) == 'nephew' ) {
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
//		alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
	 	if (typeof personal_information[parent_of_relative] != 'undefined'  &&  personal_information[parent_of_relative].adopted == true) return false;
		return true;
	}
	
	return true; // Non-relative entries should be ignored
}