<?php 

display_header();
display_nav_bar();



if (isset($_REQUEST["action"])) {
	$action = $_REQUEST["action"];
	if ($action == "change_theme") {
		do_change_theme();
	} 
}

if (isset($_REQUEST["view"])) {
	$view = $_REQUEST["view"];
	if ($view == "theme") {
		display_theme_selector();
	} else if ($view == "risk") {
		display_risk_calculator_admin();
	} else if ($view == "disease") {
		display_disease_admin();
	} else if ($view == "authorization") {
		display_authorization_admin();
	}
}

function display_header() {
	echo "<HTML>\n";
	echo "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>\n";
	echo "<link rel='stylesheet' type='text/css' href='fhh_admin.css'>\n";
	echo "<TITLE> FHH Admin Panel </TITLE>\n";
	echo "<BODY>\n";	
}

function display_nav_bar() {
	echo "<TABLE class='nav_bar'><TR>\n";
	echo "<TD id='theme' onclick='location.href=\"admin.php?view=theme\"'>Theme Selector</TD>\n";	
	echo "<TD id='risk' onclick='location.href=\"admin.php?view=risk\"'>Risk Calculator Admin</TD>\n";	
	echo "<TD id='disease' onclick='location.href=\"admin.php?view=disease\"'>Disease List Admin</TD>\n";	
	echo "<TD id='authorization' onclick='location.href=\"admin.php?view=authorization\"'>Admin Site Functions</TD>\n";	
	echo "</TR></TABLE>\n";
}

function display_theme_selector() {
	echo "<DIV id='theme_selector' class='form_area'>";

	$dir = "../FHH/themes";
	$files = array_diff(scandir($dir), array('.','..','deploy'));
//	print_r($files); 
	
	echo "<FORM method='get' action='admin.php'>\n";
	echo "<INPUT type='hidden' name='view' value='theme' />";
	echo "<INPUT type='hidden' name='action' value='change_theme' />";
	
	echo "Select Template to use: \n";
	echo "<SELECT name='theme_choice'>\n";
	echo "<OPTION></OPTION>\n";
	foreach ($files as $file) {
		echo "<OPTION>$file</OPTION>\n";
	}
	echo "</SELECT>\n";
	echo "<INPUT type='submit' value='Change Template' \>\n";
	echo "</FORM>\n";
	
	echo"</DIV>\n";
}

function display_risk_calculator_admin() {
	echo "<DIV id='risk_calculator_admin' class='form_area'>Risk Calculator</DIV>\n";
}
function display_disease_admin() {
	echo "<DIV id='disease_admin' class='form_area'>Disease List Administration</DIV>\n";
}
function display_authorization_admin() {
	echo "<DIV id='authorization_admin' class='form_area'>Authorized Administrator List</DIV>\n";
}

function display_footer() {
	echo "</BODY>\n";	
	echo "</HTML>\n";
}


function do_change_theme () {
	if (isset($_REQUEST["theme_choice"]) && $_REQUEST["theme_choice"] != "") {
		$theme_choice = $_REQUEST["theme_choice"];
		$str = "Theme: [" . $theme_choice . "]<br />\n";
		
		$str .= move_file($theme_choice, "fhh.css");
		$str .= move_file($theme_choice, "banner_left.png");
		$str .= move_file($theme_choice, "banner_right.png");
		$str .= move_file($theme_choice, "favicon.ico");
		
		show_info($str);
	} else {
		show_error("No Theme Chosen");
	}		
}

function move_file ($theme_choice, $filename) {
	$str = "Moving $theme_choice/$filename to deploy/$filename: ";
	$status = copy ("../FHH/themes/" . $theme_choice . "/$filename" , "../FHH/themes/deploy/$filename");
	if ($status) $str .= "SUCCESS"; else $str .= "FAILURE";
	$str .= "<br />\n";
	
	return $str;
}

function show_error($message) {
	// Make this a dialog eventually
	echo "<div class='error'>ERROR: $message </DIV>";
	
}

function show_info($message) {
	// Make this a dialog eventually
	echo "<div class='info'> $message </DIV>";

}
// Below function from php.net documentation

?>