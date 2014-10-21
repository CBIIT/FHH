<?php
/**
 * upload2.php
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 */

#!! IMPORTANT: 
#!! this file is just an example, it doesn't incorporate any security checks and 
#!! is not recommended to be used in production environment as it is. Be sure to 
#!! revise it and customize to your needs.
$file = $_FILES["file"]["tmp_name"];

if(file_exists($file)) {
	header('Content-Description: File Transfer');
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	//header('Content-Type: application/octet-stream');
	//header('Content-Disposition: attachment; filename='.basename($file));
	//header('Content-Transfer-Encoding: binary');
	header('Expires: 0');
	header('Cache-Control: post-check=0, pre-check=0');
	header('Pragma: no-cache');
	header('Content-Length: ' . filesize($file));
	//ob_clean();
	//flush();
	echo file_get_contents($file);

}
exit;
