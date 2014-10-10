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
				risk_reason += "You have had Colon Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
				risk_reason += "You have had Colorectal Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
				risk_reason += "You have had Rectal Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Uterine Cancer') {
				risk_reason += "You have had Uterine Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Pancreatic Cancer') {
				risk_reason += "You have had Pancreatic Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Ovarian Cancer') {
				risk_reason += "You have had Ovarian Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Gastric Cancer') {
				risk_reason += "You have had Gastric Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Brain Cancer') {
				risk_reason += "You have had Brain Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Liver Cancer') {
				risk_reason += "You have had Liver Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Kidney Cancer') {
				risk_reason += "You have had Kidney Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Hereditary nonpolyposis colon cancer') {
				risk_reason += "You have had Colon Cancer in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Lynch Syndrome/Non-hereditary polyposis colon cancer') {
				risk_reason += "You have had Colon Cancer in the past.<br />";
				risk=true;
		}
	}
	if (risk) {
		set_icon($("#past_cancers"), 'positive');
		set_reason($("#past_cancers"), risk_reason);
	} else {
		set_icon($("#past_cancers"), 'negative');
		set_reason($("#past_cancers"), "You have never had any of the following cancer types: " 
		  + "Colon, Colorectal, Uterine, Pancreatic, Ovarian, Gastric, Brain, Liver, or Kidney Cancer.");
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
				risk_reason += "You have had Colon Polyps in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Familial adnenomatous polyposis (FAP)') {
				risk_reason += "You have had Familial adnenomatous polyposis (FAP) in the past.<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#polyps"), 'positive');
		set_reason($("#polyps"), risk_reason);
	} else {
		set_icon($("#polyps"), 'negative');
		set_reason($("#polyps"), "You have never had any Polyps.");
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
				risk_reason += "You have had Crohn's Disease in the past.<br />";
				risk=true;
		}
		if (h[i]['Detailed Disease Name'] == 'Ulcerative Colitis') {
				risk_reason += "You have had Ulcerative Colitis in the past.<br />";
				risk=true;
		}
	}

	if (risk) {
		set_icon($("#inflammatory_bowel_disease"), 'positive');
		set_reason($("#inflammatory_bowel_disease"), risk_reason);
	} else {
		set_icon($("#inflammatory_bowel_disease"), 'negative');
		set_reason($("#inflammatory_bowel_disease"), "You have never had Irritable Bowel Syndrome.");
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
			var h = item['Health History'];
			
			if (h != null) {
				for (i=0;i<h.length;i++) {
					if (h[i]['Detailed Disease Name'] == 'Hereditary nonpolyposis colon cancer') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had Hereditary nonpolyposis colon cancer in the past.<br />";
						risk=true;
						i = h.length; break;  // We do not need to check this person anyore
					}
					if (h[i]['Detailed Disease Name'] == 'Lynch Syndrome/Non-hereditary polyposis colon cancer') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had Lynch Syndrome/Non-hereditary polyposis colon cancer in the past.<br />";
						risk=true;
						i = h.length; break;  // We do not need to check this person anyore
					}
					if (h[i]['Detailed Disease Name'] == 'Familial adnenomatous polyposis (FAP)') {
						name = get_name_or_relationship(this.name, key);
						risk_reason += name + " has had Familial adnenomatous polyposis (FAP) in the past.<br />";
						risk=true;
						i = h.length; break;  // We do not need to check this person anyore
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
			"None of your family members have had Hereditary nonpolyposis colon cancer, Lynch Syndrome or Familial adnenomatous polyposis (FAP)");
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
					for (i=0;i<h.length;i++) {
					if (h[i]['Detailed Disease Name'] == 'Colon Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colon Cancer in the past.<br />";
							risk=true;
							i = h.length; break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colorectal Cancer in the past.<br />";
							risk=true;
							i = h.length; break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Rectal Cancer in the past.<br />";
							risk=true;
							i = h.length; break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Gastric Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colon Cancer in the past.<br />";
							risk=true;
							i = h.length; break;  // We do not need to check this person anyore
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
			"None of your Immediate relatives (Father, Mother, Brothers, Sisters, Children) have had Colon Cancer.");
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
						for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Colon Polyp') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colon Polyps in the past.<br />";
							risk=true;
							i = h.length; break;  // We do not need to check this person anyore
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
			"None of your Immediate Relatives (Father, Mother, Brothers, Sisters, Children) have had Polyps.");
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
						for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Colon Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colon Cancer in the past.<br />";
							count++;
							i = h.length; break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colorectal Cancer in the past.<br />";
							count++;
							i = h.length; break;  // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colorectal Cancer in the past.<br />";
							count++;
							i = h.length; break;  // We do not need to check this person anyore
						}
					}
				}
			}
		}
	});
	if (count == 0) {
		risk = false;
		risk_reason = 
			"None of your Secondary Relatives (Aunts, Uncles, Grandparents, Grandchildren, Halfsiblings) have had Colon or Colorectal Cancer."
		
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
						for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Colon Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colon Cancer before the age of 60.<br />";
							risk=true;
							i = h.length; break; // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Colorectal Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Colorectal Cancer before the age of 60.<br />";
							risk=true;
							i = h.length; break; // We do not need to check this person anyore
						}
						if (h[i]['Detailed Disease Name'] == 'Rectal Cancer' && is_age_before('Under60', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Rectal Cancer before the age of 60.<br />";
							risk=true;
							i = h.length; break; // We do not need to check this person anyore
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
			"None of your Secondary Relatives (Aunts, Uncles, Grandparents, Grandchildren, Halfsiblings) " +
			"have had Colon or Colorectal Cancer before the age of 60.");
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
						for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Uterine Cancer' && is_age_before('Under50', h[i]['Age At Diagnosis']) ) {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Uterine Cancer before the age of 50.<br />";
							risk=true;
							i = h.length; break; // We do not need to check this person anyore
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
			"None of your Primary or Secondary Relatives (Mother, Father, Sisters, Brothers, Sons, Daughters, "
			+ "Aunts, Uncles, Grandparents, Grandchildren, Halfsiblings) "
			+ "have had Uterine Cancer before the age of 50.");
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
						for (i=0;i<h.length;i++) {
						if (h[i]['Detailed Disease Name'] == 'Uterine Cancer') {
							name = get_name_or_relationship(this.name, key);
							risk_reason += name + " has had Uterine Cancer in the past.<br />";
							count++;
							i = h.length; break;  // We do not need to check this person anyore
						}
					}
				}
			}
		}
	});
	if (count == 0) {
		risk = false;
		risk_reason = 
			"None of your Secondary Relatives (Aunts, Uncles, Grandparents, Grandchildren, Halfsiblings) have had Uterine Cancer."
		
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
			"You have at least one of the above risks.  Therefore your risk of Colorectal Cancer is Elevated");
		$("#explanation_low_risk").hide();
		$("#explanation_high_risk").show();
	} else {
		set_icon($("#final"), 'negative');
		set_reason($("#final"), "You have none of the above risks.  Therefore your risk of Colorectal Cancer is Average");
		$("#explanation_high_risk").hide();
		$("#explanation_low_risk").show();
	}
}
///  Support functions 

// Basically a lookup table
function is_age_before(age_to_check, age_at_diagnosis) {
	switch(age_to_check) {
		case 'Under60':
			if (age_at_diagnosis == 'fifties') return true;
		case 'Under50':
			if (age_at_diagnosis == 'fourties') return true; 
		case 'Under40':
			if (age_at_diagnosis == 'thirties') return true;
		case 'Under30':
			if (age_at_diagnosis == 'twenties') return true;
		case 'Under20':
			if (age_at_diagnosis == 'teen') return true;
		case 'Under10':
			if (age_at_diagnosis == 'child') return true;
			if (age_at_diagnosis == 'infant') return true;
			if (age_at_diagnosis == 'newborn') return true;
			if (age_at_diagnosis == 'prebirth') return true;
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
