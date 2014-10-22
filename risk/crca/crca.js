var final_risk = false;

if (personal_information == null) alert ("Need to enter personal and family histories");

set_icon($("#past_cancers"), 'calculating');
setTimeout(test_past_cancer, 500);

/// End of main script

function test_past_cancer() {
	var h = personal_information['Health History'];
	if (h == null) h={};
	var risk = false;
	risk_reason = "";
	for (i=0;i<h.length;i++) {
		if (h[i]['Detailed Disease Name'] == 'Colon Cancer') {
				risk_reason += "You have had colon cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
				risk_reason += "You have had colorectal cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
				risk_reason += "You have had rectal cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Uterine Cancer') {
				risk_reason += "You have had uterine cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Pancreatic Cancer') {
				risk_reason += "You have had pancreatic cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Ovarian Cancer') {
				risk_reason += "You have had ovarian cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Gastric Cancer') {
				risk_reason += "You have had gastric cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Brain Cancer') {
				risk_reason += "You have had brain cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Liver Cancer') {
				risk_reason += "You have had liver cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Kidney Cancer') {
				risk_reason += "You have had kidney cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Hereditary nonpolyposis colon cancer') {
				risk_reason += "You have had hereditary nonpolyposis colon cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Lynch Syndrome/Hereditary non-polyposis colon cancer') {
				risk_reason += "You have had lynch syndrome/hereditary non-polyposis colon cancer cancer in the past.<br />";
				risk=true;
		}
	}
	if (risk) {
		set_icon($("#past_cancers"), 'positive');
		set_reason($("#past_cancers"), risk_reason);
	} else {
		set_icon($("#past_cancers"), 'negative');
		set_reason($("#past_cancers"), "You have never had any of the following cancer types: " 
		  + "colon, colorectal, rectal, lynch syndrome/hereditary non-polyposis colon cancer, uterine, pancreatic, ovarian, gastric, brain, liver, or kidney cancer.");
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
		if (h[i]['Detailed Disease Name'] == 'Colon Polyp') {
				risk_reason += "You have had colon polyps in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Familial adnenomatous polyposis (FAP)') {
				risk_reason += "You have had familial adnenomatous polyposis (FAP) in the past.<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#polyps"), 'positive');
		set_reason($("#polyps"), risk_reason);
	} else {
		set_icon($("#polyps"), 'negative');
		set_reason($("#polyps"), "You have never had any polyps.");
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
		if (h[i]['Detailed Disease Name'] == "Crohn's Disease") {
				risk_reason += "You have had crohn's disease in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Ulcerative Colitis') {
				risk_reason += "You have had ulcerative colitis in the past.<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#inflammatory_bowel_disease"), 'positive');
		set_reason($("#inflammatory_bowel_disease"), risk_reason);
	} else {
		set_icon($("#inflammatory_bowel_disease"), 'negative');
		set_reason($("#inflammatory_bowel_disease"), "You have never had inflammatory bowel disease (either ulcerative colitis or crohn's disease).");
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
					if (h[i]['Detailed Disease Name'] == 'Hereditary nonpolyposis colon cancer') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had hereditary nonpolyposis colon cancer in the past.<br />";
						risk=true;
					}
					if (h[i]['Detailed Disease Name'] == 'Lynch Syndrome/Hereditary non-polyposis colon cancer') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had lynch syndrome/non-hereditary polyposis colon cancer in the past.<br />";
						risk=true;
					}
					if (h[i]['Detailed Disease Name'] == 'Familial adnenomatous polyposis (FAP)') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had familial adnenomatous polyposis (FAP) in the past.<br />";
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
		set_reason($("#any_family_members_fap_hnpcc"), 
			"None of your family members have had hereditary nonpolyposis colon cancer, lynch syndrome or familial adnenomatous polyposis (FAP)");
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
					if (h[i]['Detailed Disease Name'] == 'Colon Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colon cancer in the past.<br />";
							risk=true;
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colorectal cancer in the past.<br />";
							risk=true;
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had rectal cancer in the past.<br />";
							risk=true;
						}
						if (h[i]['Detailed Disease Name'] == 'Gastric Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had gastric cancer in the past.<br />";
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
		set_reason($("#immediate_family_members_cancer"), 
			"None of your immediate relatives (father, mother, brothers, sisters, children) have had colon cancer.");
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
							risk_reason += name + " has had colon polyps in the past.<br />";
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
		set_reason($("#immediate_family_members_polyps"), 
			"None of your immediate relatives (father, mother, brothers, sisters, children) have had polyps.");
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
						if (h[i]['Detailed Disease Name'] == 'Colon Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colon cancer in the past.<br />";
							count++;
							break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colorectal cancer in the past.<br />";
							count++;
							break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had rectal cancer in the past.<br />";
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
		risk_reason = 
			"None of your secondary relatives (aunts, uncles, grandparents, grandchildren, halfsiblings) have had colon, rectal, or colorectal cancer. (There should be two or more to trigger this test.)"
		
	} else if (count == 1) {
		risk = false;
		risk_reason = "It takes two or more of your secondary relatives to trigger this test: <br />" + risk_reason;
		
	} else {
		risk = true;
		risk_reason = "It takes two or more of your secondary relatives to trigger this test: <br />" + risk_reason;
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
						if (h[i]['Detailed Disease Name'] == 'Colon Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colon cancer before the age of 60.<br />";
							risk=true;
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had colorectal cancer before the age of 60.<br />";
							risk=true;
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had rectal cancer before the age of 60.<br />";
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
		set_reason($("#secondary_family_members_colon_cancer_before_60"), 			
			"None of your secondary relatives (aunts, uncles, grandparents, grandchildren, halfsiblings) " +
			"have had colon, rectal, or colorectal cancer before the age of 60.");
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
						if (h[i]['Detailed Disease Name'] == 'Uterine Cancer' && is_age_before('Under50', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had uterine cancer before the age of 50.<br />";
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
		set_reason($("#secondary_family_members_uterine_cancer_before_50"), 			
			"None of your primary or secondary relatives (mother, father, sisters, brothers, sons, daughters, "
			+ "aunts, uncles, grandparents, grandchildren, halfsiblings) "
			+ "have had uterine cancer before the age of 50.");
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
						if (h[i]['Detailed Disease Name'] == 'Uterine Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had uterine cancer in the past.<br />";
							count++;
						}
					}
				}
			}
		}
	});
	if (count == 0) {
		risk = false;
		risk_reason = 
			"None of your secondary relatives (aunts, uncles, grandparents, grandchildren, halfsiblings) have had uterine cancer. (There should be two or more to trigger this test.)"
		
	} else if (count == 1) {
		risk = false;
		risk_reason = "It takes two or more of your secondary relatives to trigger this test: <br />" + risk_reason;
		
	} else {
		risk = true;
		risk_reason = "It takes two or more of your secondary relatives to trigger this test: <br />" + risk_reason;
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
		set_reason($("#final"), 			
			"You have at least one of the above risk factors.  Based on this your risk of colorectal cancer is increased.");
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	} else {
		set_icon($("#final"), 'negative');
		set_reason($("#final"), "You have none of the above risks.  Therefore your risk of colorectal cancer is average");
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
			$(field).find("#test").empty().append("<IMG src='../risk/crca/blue_waiting.png' height='40'/>");
			break;
		case 'calculating':
			$(field).find("#test").empty().append("<IMG src='../risk/crca/blue_calculating.gif' height='40'/>");
			break;
		case 'negative':
			$(field).find("#test").empty().append("<IMG src='../risk/crca/green_x.png' height='40'/>");
			break;
		case 'positive':
			$(field).find("#test").empty().append("<IMG src='../risk/crca/red_check.png' height='40'/>");
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
		if (typeof personal_information[relative].id != 'undefined') {
			if (personal_information[relative].id == id) return relative;
		}
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
	if (personal_information.adopted == true || personal_information.adopted == 'true') {
		if (! (relative.substring(0,3) == 'son'     || relative.substring(0,8) == 'daughter' 
		 || relative.substring(0,8) == 'grandson' || relative.substring(0,13) == 'granddaughter')) {
			return false;
		}
	}
	
	// All cases check if that person is adopted, if they are, they are not blood relative
	if (typeof personal_information[relative] != 'undefined')
	{
//		alert (personal_information[relative].name + ":" + (personal_information[relative].adopted == 'true') );
		if (personal_information[relative].adopted == 'true') return false;
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
	 	if (typeof personal_information['mother'] != 'undefined'  && personal_information['mother'].adopted == 'true') return false;
	 	else return true;
	}

	if (relative.substring(0,13) == 'paternal_aunt' || relative.substring(0,14) == 'paternal_uncle'
	 || relative.substring(0,20) == 'paternal_grandfather' || relative.substring(0,20) == 'paternal_grandmother') {
	 	if (typeof personal_information['father'] != 'undefined'  && personal_information['father'].adopted == 'true') return false;
	 	else return true;
	}
	
// Grandchildren need to check the child as well
	if (relative.substring(0,8) == 'grandson' || relative.substring(0,13) == 'granddaughter') {
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
   if (personal_information[parent_of_relative].adopted == true || personal_information[parent_of_relative].adopted == 'true') return false;
	 return true;
	}

	
// For 3rd degree relatives, check parent of the person and the mother or father as well
	if (relative.substring(0,15) == 'maternal_cousin' ) {
	 if (typeof personal_information['mother'] != 'undefined'  && personal_information['mother'].adopted == 'true') return false;
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
//	 alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
	 	if (personal_information[parent_of_relative].adopted == true || personal_information[parent_of_relative].adopted == 'true') return false;
	 return true;
	}
	
	if (relative.substring(0,15) == 'paternal_cousin') {
	 if (typeof personal_information['father'] != 'undefined'  && personal_information['father'].adopted == 'true') return false;
	 var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
	 	if (personal_information[parent_of_relative].adopted == true || personal_information[parent_of_relative].adopted == 'true') return false;
	 return true;
	}
	
	if (relative.substring(0,5) == 'niece' || relative.substring(0,6) == 'nephew' ) {
		var parent_of_relative = get_relative_by_id(personal_information[relative].parent_id);
//		alert (personal_information[parent_of_relative].name + ":" + personal_information[parent_of_relative].adopted);
	 	if (personal_information[parent_of_relative].adopted == true || personal_information[parent_of_relative].adopted == 'true') return false;
		return true;
	}
	
	return true; // Non-relative entries should be ignored
}