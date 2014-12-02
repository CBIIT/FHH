var score = {
	'age':0,
	'gender': 0,
	'gestational' : 0,
	'family': 0,
	'bloodpressure':0,
	'activity':0,
	'bmi':0,
	'total':0
}

$(document).ready(function() {

	if (typeof i18n != "undefined") {
		var option = { 
			resGetPath: '../locales/__ns__-__lng__.json',
			ns: { 
		    namespaces: ['translation', 'diseases'], 
		    defaultNs: 'translation'
		  } 
		};

		i18n.init(option, function () {
			$(".translate").i18n();
			$.getJSON("../data/diseases.json", function (data) {
				diseases = data;
				start();
			});
		});
	};	
	$('.aradio').buttonset();

	build_required_information_for_personal_history();
	enable_appropriate_changers();
	
	var valid = test_for_any_missing_data();
		
	// always show this because we added a disclaimer	
	if (!valid.age || !valid.gender || !valid.gestational_diabetes || !valid.height || 
			!valid.weight || !valid.physically_active || !valid.hypertension) {
		get_required_info_dialog(valid); 
	};
	
	load_all_data_and_calculate_score();
	
});

function build_required_information_for_personal_history() {
	if (personal_information == null) personal_information = new Object();
	if (personal_information['Health History'] == null) personal_information['Health History'] = [];
	if (personal_information['father'] == null) personal_information['father'] = {'gender':'MALE'};
	if (personal_information['mother'] == null)	personal_information['mother'] = {'gender':'FEMALE'};
	if (personal_information['maternal_grandfather'] == null)	personal_information['maternal_grandfather'] = {'gender':'MALE'};
	if (personal_information['maternal_grandmother'] == null)	personal_information['maternal_grandmother'] = {'gender':'FEMALE'};
	if (personal_information['paternal_grandfather'] == null)	personal_information['paternal_grandfather'] = {'gender':'MALE'};
	if (personal_information['paternal_grandmother'] == null)	personal_information['paternal_grandmother'] = {'gender':'FEMALE'};			
}

function enable_appropriate_changers() {
// most of these should not be changed once entered.  
// Enable these if you want the user to be able to change these values on the fly.

// Physical Acitivty is the exception.  There is no way to edit this from the history, so we need to activate it here.

//	enable_changing_age();
//	enable_changing_gender();
//	enable_changing_gestational_diabetes_status();
//	enable_changing_inherited_diabetes_status();
//	enable_changing_bloodpressure_status();
	enable_changing_physical_activity_status();
//	enable_changing_height();
//	enable_changing_weight();

	
}

function load_all_data_and_calculate_score() {
		
		
		load_age();
		load_gender();
		load_gestational_diabetes();
		load_family_diabetes();
		load_high_blood_pressure();
		load_activity();
		load_bmi();
		calculate_score();	

		var diabetes_types = check_for_diabetes_prediabetes();
		if (diabetes_types.length > 0) {
			create_have_diabetes_dialog(diabetes_types);
		}
}

function create_have_diabetes_dialog(diabetes_types) {
	var automatic_elevated_diabetes_dialog = $("<div id='automatic_elevated_diabetes_dialog'></div>");
	automatic_elevated_diabetes_dialog.append("<P class='instructions'> You have indicated in your personal health history: </P>");
	var list = $("<UL>");
	for (i=0;i<diabetes_types.length;i++) {
		list.append("<LI class='instructions'>" + diabetes_types[i] + "</LI>");
	}
	automatic_elevated_diabetes_dialog.append(list);
	automatic_elevated_diabetes_dialog.append("<P class='instructions'>Due to this indicator, you are at an elevated risk for Diabetes.</P>");
	automatic_elevated_diabetes_dialog.append("<P class='instructions'>Below are links to two letters, a personal letter showing your risks and what your can do about them, and a Physician Letter that you can give to your physician about your risks.</P>");
	automatic_elevated_diabetes_dialog.append("<table class='pdf'><tr><td>"
	  + "<button id='elev_submit' onClick='submit_high()'>Get Personal <br />Elevated Risk Letter </button>"
	  + "</td><td>"
	  + "<button id='elev_letter' onClick='submit_high_provider()'>Get Provider <br />Elevated Risk Letter </button>"
	  + "</td></tr>"
	  + "</table>");
	
	
	automatic_elevated_diabetes_dialog.dialog({
		title: "You are at an Elevated Risk for Diabetes",
		position:['middle',0],
		height:400,
		width:600,
		modal: true,
		beforeClose: function( event, ui ) {
				$("#disease_risk_calculator").dialog("close");	
		},
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	$("#main_table").append(automatic_elevated_diabetes_dialog);
}

function check_for_diabetes_prediabetes() {
	var h = personal_information["Health History"];
	
	var diabetes_types = [];
	for (var i=0; i<h.length; i++) {

		if (h[i]['Detailed Disease Name'] == 'Diabetes') diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Impaired Fasting Glucose')  diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Impaired Glucose Tolerance')  diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Insulin Resistance')  diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Maturity Onset Diabetes mellitus in Young (MODY)')  diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Pre-Diabetes') diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Type 1 Diabetes') diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Type 2 Diabetes') diabetes_types.push(h[i]['Detailed Disease Name']);
		if (h[i]['Detailed Disease Name'] == 'Unknown Diabetes') diabetes_types.push(h[i]['Detailed Disease Name']);
	}
	return diabetes_types;
}

function test_for_any_missing_data() {
	var valid = {};
	valid.age = test_for_age();
	valid.gender = test_for_gender();
	valid.physically_active = test_for_physically_active();
	valid.height = test_for_height();
	valid.weight = test_for_weight();
	valid.hypertension = test_for_hypertension();
	valid.gestational_diabetes = test_for_gestational_diabetes();
	
	return valid;
}

function test_for_age() {
	if (personal_information == null) return false;
	if (personal_information.date_of_birth == null || personal_information.date_of_birth == "") return false;
	return true;
}

function test_for_gender() {
	if (personal_information == null) return false;
	if (personal_information.gender == null || personal_information.gender == "") return false;
	return true;
}
function test_for_physically_active() {
	if (personal_information == null) return false;
	if (personal_information.physically_active == null) return false;
	return true;
}

function test_for_height() {
	if (personal_information == null) return false;
	if (personal_information.height_unit == null) return false;
	if (personal_information.height == null ) return false;
	if (personal_information.height < 18) return false;
	
	return true;
}

function test_for_weight() {
	if (personal_information == null) return false;
	if (personal_information.weight == null ) return false;
	if (personal_information.weight == "" ) return false;
	if (personal_information.weight_unit == null ) return false;
	
	return true;
}

function test_for_hypertension() {
	if (personal_information == null) return false;
	var h = personal_information["Health History"]
	if (h == null) return false;
	
	var has_hypertension = false;
	for (var i=0; i<h.length; i++) {
		if (h[i]['Detailed Disease Name'] == 'Hypertension') has_hypertension = true;
	}
	
	return has_hypertension;
}

function test_for_gestational_diabetes() {
	if (personal_information == null) return false;
	if (personal_information.gender == 'MALE') return true;
	
	var h = personal_information["Health History"]
	if (h == null) return false;
	
	var has_gestational_diabetes = false;
	for (var i=0; i<h.length; i++) {
		if (h[i]['Detailed Disease Name'] == 'Gestational Diabetes') has_gestational_diabetes = true;
	}
	
	return has_gestational_diabetes;
}

function test_for_necessary_info() {
	if (personal_information == null) return false;
	if (personal_information.date_of_birth == null) return false;
	if (personal_information.gender == null) return false;
	if (personal_information.height == null) return false;
	if (personal_information.height_unit == null) return false;
	if (personal_information.weight_unit == null) return false;
	return true;
}

function get_required_info_dialog(valid) {
	$("#extra_info_dialog").show()
			.append("<P class='instructions'><B>" + $.t("fhh_diabetes_calculator.initial_popup_desc_line1") + "</B></P>");
	if (!valid.age || !valid.gender || !valid.gestational_diabetes || !valid.height || 
			!valid.weight || !valid.physically_active || !valid.hypertension) {
		$("#extra_info_dialog").show()
			.append("<P class='instructions'>" + $.t("fhh_diabetes_calculator.initial_popup_desc_line2") + "</P>");
	}
	var input_table = $("<TABLE>");
	$("#extra_info_dialog").append(input_table);
	
	if (valid.age == false) {
		input_table.append($("<TR>")
			.append("<TD><label for='date_of_birth'>" + $.t("fhh_diabetes_calculator.initial_popup_date_of_birth_description") + "</label></TD>")
			.append("<TD><INPUT size='10' value='' id='date_of_birth' type='text' /><div class='instructions'>mm/dd/yyyy</div></TD>"));
	}

	if (valid.gender== false) {
		input_table.append($("<TR>")
			.append("<TD><label for='gender_choice'>" + $.t("fhh_diabetes_calculator.initial_popup_gender_description") + "</label></TD>")
			.append($("<TD>")
				.append($("<SELECT id='gender_choice'>")
					.append("<OPTION value='MALE'>" + $.t("fhh_diabetes_calculator.initial_popup_gender_value1") + "</OPTION>")
					.append("<OPTION value='FEMALE'>" + $.t("fhh_diabetes_calculator.initial_popup_gender_value2") + "</OPTION>"))));
	}

	if (valid.gestational_diabetes == false) {
		input_table.append($("<TR>")
			.append("<TD><label for='gestational_diabetes_choice'>" +  $.t("fhh_diabetes_calculator.initial_popup_had_gestational_diabetes_description") +  "</label></TD>")
			.append($("<TD>")
				.append($("<SELECT id='gestational_diabetes_choice'>")
					.append("<OPTION value='false'>" + $.t("fhh_diabetes_calculator.initial_popup_no_value") + "</OPTION>")
					.append("<OPTION value='true'>" + $.t("fhh_diabetes_calculator.initial_popup_yes_value") + "</OPTION>"))));
	}

	if (valid.height== false) {
		input_table.append($("<TR>")
			.append("<TD><label for='height_feet'>" + $.t("fhh_diabetes_calculator.initial_popup_height_description") + "</label><label for='height_inches'>&nbsp;</label><label for='height_centimeters'></label></TD>")
			.append($("<TD>")
				.append("<INPUT size='2' value='' id='height_feet' type='text' />" + $.t("fhh_diabetes_calculator.initial_popup_height_feet") + "<INPUT size='2' value='' id='height_inches' type='text' /> " + $.t("fhh_diabetes_calculator.initial_popup_height_inches"))
				.append("&nbsp;" + $.t("fhh_diabetes_calculator.initial_popup_height_or") + "&nbsp; <INPUT size='4' value='' id='height_centimeters' type='text' /> " + $.t("fhh_diabetes_calculator.initial_popup_height_centimeters"))));
	}

	if (valid.weight== false) {
		input_table.append($("<TR>")
			.append("<TD><label for='weight'>" + $.t("fhh_diabetes_calculator.initial_popup_weight_description") + "</label><label for='weight_unit'>&nbsp;</label></TD>")
			.append($("<TD>")
				.append("<INPUT size='5' value='' id='weight' type='text' />")
				.append($("<SELECT id='weight_unit'>")
					.append("<OPTION value='pound'>" + $.t("fhh_diabetes_calculator.initial_popup_weight_value1") + "</OPTION>")
					.append("<OPTION value='kilogram'>" + $.t("fhh_diabetes_calculator.initial_popup_weight_value2") + "</OPTION>"))));
	}
	
	
	if (valid.physically_active == false) {
		input_table.append($("<TR>")
			.append("<TD><label for='physically_active_choice'>" + $.t("fhh_diabetes_calculator.initial_popup_active_description") + "</label></TD>")
			.append($("<TD>")
				.append($("<SELECT id='physically_active_choice'>")
					.append("<OPTION value='false'>" + $.t("fhh_diabetes_calculator.initial_popup_no_value") + "</OPTION>")
					.append("<OPTION value='true'>" + $.t("fhh_diabetes_calculator.initial_popup_yes_value") + "</OPTION>"))));

//			.append("Physical activity is defined as 150 minutes of moderate exercise per week<br/>")

	}
	
	if (valid.hypertension == false) {
		input_table.append($("<TR>")
			.append("<TD><label for='hypertension_choice'>" + $.t("fhh_diabetes_calculator.initial_popup_high_blood_description") + "</label></TD>")
			.append($("<TD>")
				.append($("<SELECT id='hypertension_choice'>")
					.append("<OPTION value='false'>" + $.t("fhh_diabetes_calculator.initial_popup_no_value") + "</OPTION>")
					.append("<OPTION value='true'>" + $.t("fhh_diabetes_calculator.initial_popup_no_value") + "</OPTION>"))));
	}
	
	var continue_button = $("<BUTTON> " + $.t("fhh_diabetes_calculator.initial_popup_continue_button") + " </BUTTON>");
	continue_button.click( apply_required_additional_data_entry_button );

	$("#extra_info_dialog").append(continue_button);
	$("#diabetes_content").hide();	

	// Some notes at the end of the page
	if (valid.physically_active == false) {
		$("#extra_info_dialog").append("<p class='instructions'>" + $.t("fhh_diabetes_calculator.initial_popup_physical_description") + "</p>");
	}
}

function apply_required_additional_data_entry_button () {
		if ($("#date_of_birth").val() != null && $("#date_of_birth").val() != "") personal_information.date_of_birth = $("#date_of_birth").val();
		if ($("#gender_choice").val() != null && $("#gender_choice").val() != "") personal_information.gender = $("#gender_choice").val();
		
		if (!personal_information.physically_active) {
			if ($("#physically_active_choice").val() == 'true') personal_information.physically_active = true;
			else personal_information.physically_active = false;
		}

		if ($("#height_feet").val() != "" || $("#height_inches").val() != "" || $("#height_centimeters").val() != "") {
			var height_inches = parseInt($('#height_inches').val());
			var height_feet = parseInt($('#height_feet').val());
			var height_centimeters = parseInt($('#height_centimeters').val());
			if (height_feet > 0 || height_inches > 0 ) {
				if (isNaN(height_feet)) height_feet = 0;
				if (isNaN(height_inches)) height_inches = 0;
				personal_information['height'] = height_feet * 12 + height_inches;
				personal_information['height_unit'] = 'inches';
			} else if (height_centimeters > 0) {
				if (isNaN(height_centimeters)) height_centimeters = 0;
				personal_information['height'] = height_centimeters;
				personal_information['height_unit'] = 'centimeters';
			} 
		}

		if ($("#weight").val() != null && $("#weight").val() != "") {
			personal_information['weight'] = $('#weight').val();
			personal_information['weight_unit'] = $('#weight_unit').val();
			
		}

		if ($("#hypertension_choice").val() == 'true') {
			var specific_health_issue = {"Disease Name": "Hypertension",
	                          "Detailed Disease Name": "Hypertension",
	                          "Age At Diagnosis": "Unknown",
	                          "Disease Code": "SNOMED_CT-38341003"};

			personal_information["Health History"].push(specific_health_issue);
		} 

		if ($("#gestational_diabetes_choice").val() == 'true') {
			var specific_health_issue = {"Disease Name": "Diabetes",
	                          "Detailed Disease Name": "Gestational Diabetes",
	                          "Age At Diagnosis": "Unknown",
	                          "Disease Code": "SNOMED_CT-11687002"};

			personal_information["Health History"].push(specific_health_issue);
		} 

		$("#extra_info_dialog").hide();
		$("#diabetes_content").show();

		load_all_data_and_calculate_score();

}

function load_age() {
	var date = new Date;
	
	var currentYear = date.getFullYear();
	var currentMonth = date.getMonth()+1;
	var currentDay = date.getDate();
	
	var birthYear = personal_information.date_of_birth.substr(6,4);
	var birthMonth = personal_information.date_of_birth.substr(0,2);
	var birthDay = personal_information.date_of_birth.substr(3,2);

	var yob;
	if (personal_information.date_of_birth) yob = personal_information.date_of_birth.substr(6,4);
	else yob = currentYear;
	var age =  parseInt(currentYear) - parseInt(yob);
	
	
	
	if (currentMonth < birthMonth) age--;
	else if (currentMonth == birthMonth && currentDay < birthDay) age--;
	

	// This may be off if the day of the year is in the future
	
	if (age <= 40) set_age(0);
	else if (age >= 40 && age < 50) set_age(1);
	else if(age >= 50 && age < 60) set_age(2)
	else if(age >= 60) set_age(3)
	else set_age(0)
}

function set_age(age_score){
	var $element = $('#CH'+age_score);
	$('label[for= CH' + age_score + ']').removeClass("not-selected").addClass("selected");
	$('#age').attr('value',$element.attr('value'));
	score.age = age_score;
}

function load_gender(){
	set_gender(personal_information.gender);
}

function set_gender(id) {	
  var $element = $('#'+id);
  $('#gender').attr('value',$element.attr('value'));
	score.gender = $element.attr('value')
  $('label[for= ' + id + ']').removeClass("not-selected").addClass("selected");

	// If you are male, you cannot possibly have gestation diabetes, so set to no and deactivate  
  if ($element.attr('value') == 1) {
    $('#gdiabetes').attr('value','0');
		$('#gdpos').button({disabled:true});
		$('#gdneg').button({disabled:true});
    $('#gdpos').next().removeClass("selected").addClass("not-selected");
    $('#gdneg').next().removeClass("not-selected").addClass("selected");
		score.gestational = 0;
	} 

}

function load_gestational_diabetes() {
	var gestational_diabetes = false;
	$.each(personal_information['Health History'], function (key, item) {
	    if (item['Detailed Disease Name']=="Gestational Diabetes" && personal_information.gender == 'FEMALE') gestational_diabetes = true;
	});	
	
	if (gestational_diabetes) {
		set_gestational_diabetes('gdpos');
	} else {
		set_gestational_diabetes('gdneg');
	}
	
}

function set_gestational_diabetes(id){
	var $element = $('#'+id);
	$('#gdiabetes').attr('value',parseInt($element.attr('value')));
	score.gestational = $element.attr('value');
  $('label[for= ' + id + ']').removeClass("not-selected").addClass("selected");
}

function load_family_diabetes(){
	var inherited = false;
	if (!(personal_information.adopted == true || personal_information.adopted == "true") ) {
		$.each(personal_information, function (key, item) {
	    var temp = key.substring(0,6);
	    if(temp == 'father' || temp == 'mother' || temp == 'brothe' || temp == 'sister') {
	      if (!(item.adopted == true) &&  item['Health History']) {
	      	for (i = 0;i < item['Health History'].length; i++) {
	          if (item['Health History'][i]['Detailed Disease Name'] == "Diabetes") inherited = true;
	          if (item['Health History'][i]['Detailed Disease Name'] == "Maturity Onset Diabetes mellitus in Young (MODY)") inherited = true;
	          if (item['Health History'][i]['Detailed Disease Name'] == "Type 2 Diabetes") inherited = true;
	          if (item['Health History'][i]['Detailed Disease Name'] == "Unknown Diabetes") inherited = true;
	      	}
	      }
	    }
		});
	}
	if (inherited) set_family_diabetes('dpos');
	else set_family_diabetes('dneg');
}

function set_family_diabetes(id){
  var $element = $('#'+id);
  $('#inherited').attr('value',$element.attr('value'));
  score.family = $element.attr('value');
  $('label[for= ' + id + ']').removeClass("not-selected").addClass("selected");
}

function load_high_blood_pressure() {
	var bloodpressure = false;
	$.each(personal_information['Health History'], function (key, item) {
	    if (item['Disease Name']=="Hypertension") bloodpressure = true;
	});	
	
	if (bloodpressure) set_high_blood_pressure('prepos')
	else set_high_blood_pressure('preneg');
}

function set_high_blood_pressure(id){
  var $element = $('#'+id);
  $('#bloodpressure').attr('value',$element.attr('value'));
  score.bloodpressure = $element.attr('value');
  if(id=='prepos')$('label[for=preneg]').css({color:'gray','textdecoration':'underline','fontweight':'bolder'});
  $('label[for= ' + id + ']').removeClass("not-selected").addClass("selected");
}

function load_activity() {
	// We should open a dialog on first entering the risk calculator.  This is the only question they need to answer
	if (personal_information.physically_active == true) set_activity('active_true');
	else set_activity('active_false');
}

function set_activity(id) {	
  var $element = $('#'+id);
  $('#physical').attr('value',$element.attr('value'));
	score.activity = $element.attr('value')
  $('label[for= ' + id + ']').removeClass("not-selected").addClass("selected"); 
}

function calculate_score() {
	score.total = 
			parseInt(score.age) 
		+ parseInt(score.gender)
		+ parseInt(score.gestational) 
		+ parseInt(score.family)
		+ parseInt(score.bloodpressure) 
		+ parseInt(score.activity)
		+ parseInt(score.bmi);

	$('#total').attr('value',score.total);
	
	 //Change Info
	if(parseInt(score.total) >= 5) {
		$('#04').css({'background-color': 'transparent'});
		$('#higher').buttonset().show();
		$('#normal').buttonset().hide();
	}
	else if(parseInt(score.total) < 5) {
		$('#5E').css({'background-color': 'transparent'});
		$('#higher').buttonset().hide();
		$('#normal').buttonset().show();
	}
}


function enable_changing_age () {
	$('#age-list input:radio').button({disabled:false});
	$('#age-list :radio').click(function(e) {
    $('#age').attr('value',$(this).attr('value'));
    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
    $(this).next().removeClass("not-selected").addClass("selected");
    
		score.age = $(this).attr('value');
		calculate_score();
	});
}

function enable_changing_gender() {
	$('#gender-list input:radio').button({disabled:false});
	$('#gender-list :radio').click(function(e) {
	    $('#gender').attr('value',$(this).attr('value'));
	    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
	    $(this).next().removeClass("not-selected").addClass("selected");
			score.gender = $(this).attr('value');
			// A man cannot possibly have gestational diabetes so lets set that field to no and disable
			if ($(this).attr('value') == 1) {
		    $('#gdiabetes').attr('value','0');
				$('#gdpos').button({disabled:true});
				$('#gdneg').button({disabled:true});
		    $('#gdpos').next().removeClass("selected").addClass("not-selected");
		    $('#gdneg').next().removeClass("not-selected").addClass("selected");
				score.gestational = 0;
			} else {
				$('#gdpos').button({disabled:false});
				$('#gdneg').button({disabled:false});
			}
			calculate_score();
	});
}

function enable_changing_gestational_diabetes_status () {
	$('#gdiabetes-list input:radio').button({disabled:false});
	$('#gdiabetes-list :radio').click(function(e) {
	    $('#gdiabetes').attr('value',$(this).attr('value'));
	    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
	    $(this).next().removeClass("not-selected").addClass("selected");
			score.gestational = $(this).attr('value');
			calculate_score();
	});
}

function enable_changing_inherited_diabetes_status() {
	$('#inherited-list input:radio').button({disabled:false});
	$('#inherited-list :radio').click(function(e) {
	    $('#inherited').attr('value',$(this).attr('value'));
	    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
	    $(this).next().removeClass("not-selected").addClass("selected");
			score.family = $(this).attr('value');
			calculate_score();
	});	
}

function enable_changing_bloodpressure_status () {
	$('#bloodpressure-list input:radio').button({disabled:false});
	$('#bloodpressure-list :radio').click(function(e) {
	    $('#bloodpressure').attr('value',$(this).attr('value'));
	    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
	    $(this).next().removeClass("not-selected").addClass("selected");
			score.family = $(this).attr('value');
			calculate_score();
	});	
}

function enable_changing_physical_activity_status () {
	$('#physical-list input:radio').button({disabled:false});
	$('#physical-list :radio').click(function(e) {
	    //Check the entered values
	    if ($(this).attr('value') == 1) score.activity = 1;
	    else score.activity = 0;
			
	    var id = $(this).attr('id');
	    $(this).parent().find("label").removeClass("selected").addClass("not-selected");
	    $(this).next().removeClass("not-selected").addClass("selected");
	
	    $('#physical').attr('value',$(this).attr('value'));
			calculate_score();
			
			// Only for activity do we change the official record 0=true, 1=false
  		if ($(this).attr('value') == 1) personal_information.physically_active = false; 
  		else personal_information.physically_active = true;

	});	
}

function enable_changing_height () {
}

function enable_changing_weight () {
}

//BMI Table
function load_bmi() {
	
	
	// Find Height and Weight in inches and pounds first
	if (personal_information) {
		pi = personal_information;
		if (pi.height_unit == 'centimeters') {
			$("#height_value").text(pi.height + " centimeters");
			p_height = Math.floor(pi.height / 2.54);
		} else {
			$("#height_value").text(Math.floor(pi.height/12) + " feet " + pi.height%12 + " inches");
			p_height = pi.height;
		}
		if (pi.weight_unit == 'kilogram') {
			$("#weight_value").text(pi.weight + " kilograms");
			p_weight = Math.floor(pi.weight * 2.20);
		} else {
			$("#weight_value").text(pi.weight + " pounds");
			p_weight = pi.weight;
		}
	} else {
		p_height = 0;
		p_weight = 0;
	}

	p_feet = Math.floor(p_height/12);
	p_inches = p_height % 12;

	
	$("#bmi_table").empty()
		.append("<TR><TD class='header'>Height</TD><TD colspan='4' class='header'>Weight</TD>");
	$("#bmi_table").append($("<TR>")
			.append("<TD class='header'>&nbsp;</TD>")
			.append("<TD class='header' id='weight_value_0'> &nbsp </TD>")
			.append("<TD class='header' id='weight_value_1'> &nbsp </TD>")
			.append("<TD class='header' id='weight_value_2'> &nbsp </TD>")
			.append("<TD class='header' id='weight_value_3'> &nbsp </TD>"));
			
	$("#bmi_table").append($("<TR>")
			.append("<TD class='normal'>&nbsp;</TH>")
			.append("<TD class='0_points normal'>Normal</TD>")
			.append("<TD class='1_point normal'> Overweight </TD>")
			.append("<TD class='2_points normal'> Obese </TD>")
			.append("<TD class='3_points normal'> Morbidly Obese </TD>"));
	$("#bmi_table").append($("<TR>")
			.append("<TD class='normal underline'>BMI</TH>")
			.append("<TD class='0_points normal underline'>25  or less</TD>")
			.append("<TD class='1_point normal underline'> 25 - 30 </TD>")
			.append("<TD class='2_points normal underline'>30 - 35</TD>")
			.append("<TD class='3_points normal underline'>35 or more</TD>"));
	
	for (h=58;h<=76;h++) {
		var row = $("<TR id='r_"+h+"'>")
		row.append($("<TD class='header normal'>").append(display_height(h)));
		row.append($("<TD class='0_points normal'>").append(get_bmi_weight(25,h)+ " -"));
		row.append($("<TD class='1_point normal'>").append((get_bmi_weight(25,h)+1)+"-"+get_bmi_weight(30,h)));
		row.append($("<TD class='2_points normal'>").append((get_bmi_weight(30,h)+1)+"-"+get_bmi_weight(35,h)));
		row.append($("<TD class='3_points normal'>").append((get_bmi_weight(35,h)+1)+" +"));
		$("#bmi_table").append(row);	
	}
	var points_row = $("<TR id='points_row'>")
	points_row.append($("<TD>").append("&nbsp;"));
	points_row.append($("<TD class='0_points normal' id='bmi_score_0'>").append("0 points"));
	points_row.append($("<TD class='1_point normal' id='bmi_score_1'>").append("1 point"));
	points_row.append($("<TD class='2_points normal' id='bmi_score_2'>").append("2 points"));
	points_row.append($("<TD class='3_points normal' id='bmi_score_3'>").append("3 points"));
	$("#bmi_table").append(points_row);	
	
	var bmi = get_bmi_scale(p_height, p_weight);
	if (bmi < 25) {
		$(".0_points").removeClass("normal").addClass("chosen");
		$("#weight_value_0").removeClass("header").addClass("chosen").append(p_weight+ "lbs");
		$("#bmi_score_0").css("font-weight", "bold");
		score.bmi=0;
	} else if (bmi < 30) {
		$(".1_point").removeClass("normal").addClass("chosen");
		$("#weight_value_1").removeClass("header").addClass("chosen").append(p_weight+ "lbs");
		$("#bmi_score_1").css("font-weight", "bold");
		score.bmi=1;
	}else if (bmi < 35) {
		$(".2_points").removeClass("normal").addClass("chosen");		
		$("#weight_value_2").removeClass("header").addClass("chosen").append(p_weight+ "lbs");
		$("#bmi_score_2").css("font-weight", "bold");
		score.bmi=2;
	} else if (bmi >= 35){
		$(".3_points").removeClass("normal").addClass("chosen");		
		$("#weight_value_3").removeClass("header").addClass("chosen").append(p_weight+ "lbs");
		$("#bmi_score_3").css("font-weight", "bold");
		score.bmi=3;
	} else {
		alert("In order to use this tool, you need to have entered a height and weight,\n and your family's Diabetes Type II history");
	}
	
	$("#r_" + p_height).find("TD").removeClass("normal").removeClass("header").addClass("chosen");
	
	$("#bmi_value").val(score.bmi);
}

function get_bmi_weight(bmi, h) {
	return Math.floor(h*h*bmi/703);
}
function get_bmi_scale(h, w) {
	return w*703/(h*h);
}

function display_height(h) {
	var f = Math.floor(h/12);
	var i = h % 12;
	return (f + "ft " + i + "in");
}

