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
	if (test_for_necessary_info()) {
		load_age();
		load_gender();
		load_gestational_diabetes();
		load_family_diabetes();
		load_high_blood_pressure();
		load_activity();
		load_bmi();
		calculate_score();	
//	alert(JSON.stringify(score, null, 2));
	} else {
		clear_and_report_error();
	}

});

function test_for_necessary_info() {
	if (personal_information == null) return false;
	if (personal_information.date_of_birth == null) return false;
	if (personal_information.gender == null) return false;
	if (personal_information.height == null) return false;
	if (personal_information.height_unit == null) return false;
	if (personal_information.weight_unit == null) return false;
	return true;
}

function clear_and_report_error() {
	$("#diabetes_content").empty().append("<h1> Diabetes Risk Assessment Tool </h1>")
		.append($("<div class='diabetes_information_text'>")
			.append("<br />To use this tool, please enter at least:")
			.append($("<UL>")
				.append("<LI> Your Gender </LI>")
				.append("<LI> Your Birthdate </LI>")
				.append("<LI> Your Height </LI>")
				.append("<LI> Your Weight </LI>")
				.append("<LI> Your Health History (Especially if you have high bloodpressure or have had Gestational Diabetes) </LI>")
				.append("<LI> If any of your immediate family has had Diabetes </LI>")));
}

function load_age() {
	var currentYear = (new Date).getFullYear();
	var yob = personal_information.date_of_birth.substr(6,10);
	var age =  parseInt(currentYear) - parseInt(yob);
	
	if (age <= 40) set_age(0);
	else if (age >= 40 && age <= 50) set_age(1);
	else if(age >= 50 && age <= 60) set_age(2)
	else if(age >= 60) set_age(3)
	else set_age(0)
}

function set_age(age_score){
	var $element = $('#CH'+age_score);
	$element.css({'color': 'darkred'});
	$('#age').attr('value',$element.attr('value'));
	$('#age').css({'background-color': 'cornsilk'});
	score.age = age_score;
	$('label[for= CH' + age_score + ']').css({color:'darkred','textdecoration':'underline','fontweight':'bolder'});
}

function load_gender(){
	set_gender(personal_information.gender);
}

function set_gender(id) {	
  var $element = $('#'+id);
  $element.css({'color': 'darkred'});
  $('#gender').attr('value',$element.attr('value'));
  $('#gender').css({'background-color': 'cornsilk'});
	score.gender = $element.attr('value')
  $('label[for= ' + id + ']').css({color:'darkred','textdecoration':'underline','fontweight':'bolder'});
}

function load_gestational_diabetes() {
	$.each(personal_information['Health History'], function (key, item) {
	    if (item['Detailed Disease Name']=="Gestational Diabetes" && personal_information.gender == 'FEMALE') set_gestational_diabetes('gdpos')
	    else set_gestational_diabetes('gdneg')
	});	
}

function set_gestational_diabetes(id){
	var $element = $('#'+id);
	$element.css({'color': 'darkred'});
	$('#gdiabetes').attr('value',$element.attr('value'));
	$('#gdiabetes').css({'background-color': 'cornsilk'});

	score.gestational = $element.attr('value');
	$('label[for= ' + id + ']').css({color:'darkred','textdecoration':'underline','fontweight':'bolder'});
}

function load_family_diabetes(){
	$.each(personal_information, function (key, item) {
	    var temp = key.substring(0,6);
	    if(temp == 'father' || temp == 'mother' || temp == 'brothe' || temp == 'sister') {
	        if(this['Health History'].length > 0){
	            if (this['Health History'][0]['Disease Name'] == "Diabetes") set_family_diabetes('dpos');
	        }
	    }
	});
}

function set_family_diabetes(id){
    var $element = $('#'+id);
    $element.css({'color': 'darkred'});
    $('#inherited').attr('value',$element.attr('value'));
    $('#inherited').css({'background-color': 'cornsilk'});
    score.family = $element.attr('value');
    $('label[for= ' + id + ']').css({color:'darkred','textdecoration':'underline','fontweight':'bolder'});
}

function load_high_blood_pressure() {
	$.each(personal_information['Health History'], function (key, item) {
	    if (item['Disease Name']=="Hypertension") set_high_blood_pressure('prepos')
	    else set_high_blood_pressure('preneg')
	});	
}

function set_high_blood_pressure(id){
    var $element = $('#'+id);
    $element.css({'color': 'darkred'});
    $('#bloodpressure').attr('value',$element.attr('value'));
    $('#bloodpressure').css({'background-color': 'cornsilk'});
    score.bloodpressure = $element.attr('value');
    if(id=='prepos')$('label[for=preneg]').css({color:'gray','textdecoration':'underline','fontweight':'bolder'});
    $('label[for= ' + id + ']').css({color:'darkred','textdecoration':'underline','fontweight':'bolder'});
}

function load_activity() {
	// We should open a dialog on first entering the risk calculator.  This is the only question they need to answer
	
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
		$('#5E').css({'background-color': 'cornsilk'});
		$('#04').css({'background-color': 'transparent'});
		$('#higher').buttonset().show();
		$('#normal').buttonset().hide();
	}
	else if(parseInt(score.total) < 5) {
		$('#04').css({'background-color': 'cornsilk'});
		$('#5E').css({'background-color': 'transparent'});
		$('#higher').buttonset().hide();
		$('#normal').buttonset().show();
	}
}

$('.aradio').buttonset();


$(".aradio label").css({'background-color':'transparent','font-size':'12px', 'border': 'none'});
$(".aradio label").css("font-family","Verdana, Arial, Helvetica, sans-serif");

//Set the points
$('#ButtonList :radio').click(function(e) {
    var $element = $(this);
    $('#age').attr('value',$element.attr('value'));
    $('#age').css({
        'background-color': 'cornsilk'
    });
		calculate_score();
});

$('#ButtonList1 :radio').click(function(e) {
    var $element = $(this);
    $('#gender').attr('value',$element.attr('value'));
    $('#gender').css({
        'background-color': 'cornsilk'
    });
		calculate_score();
});

$('#ButtonList2 :radio').click(function(e) {
    var $element = $(this);
    $('#gdiabetes').attr('value',$element.attr('value'));
    $('#gdiabetes').css({
        'background-color': 'cornsilk'
    });
		calculate_score();
});

$('#ButtonList3 :radio').click(function(e) {
    var $element = $(this);
    $('#inherited').attr('value',$element.attr('value'));
    $('#inherited').css({
        'background-color': 'cornsilk'
    });
		calculate_score();
});

//Activity
$('#ButtonList6 :radio').click(function(e) {
    var $element = $(this);
    //Check the entered values
    if ($(this).attr('value') == 1) {
    	score.activity = 1;
    }
    else{
    	score.activity = 0;
    }
		
    var id = $(this).attr('id');

    $('label[for= 6CH0]').css({color:'gray'});
    $('label[for= 6CH1]').css({color:'gray'});
    $('label[for= ' + id + ']').css({color:'darkred'});

    $('#physical').attr('value',$element.attr('value'));
    $('#physical').css({'background-color': 'cornsilk'});
		calculate_score();
});

//BMI Table
function load_bmi() {
	// Find Height and Weight in inches and pounds first
	if (personal_information) {
		pi = personal_information;
		if (pi.height_unit == 'centimeters') p_height = Math.floor(pi.height / 2.54);
		else p_height = pi.height;
		if (pi.weight_unit == 'kilogram') p_weight = Math.floor(pi.weight * 2.20);
		else p_weight = pi.weight;
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

