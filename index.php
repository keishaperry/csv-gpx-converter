<?php

// Kickstart the framework
$f3=require('lib/base.php');
include('./class-gpx-file.php');

$f3->set('DEBUG',1);
if ((float)PCRE_VERSION<8.0)
	trigger_error('PCRE version is out of date');

// Load configuration
$f3->config('config.ini');

$f3->route('GET /',
	function($f3) {
		$f3->set('content','default.htm');
		echo View::instance()->render('layout.htm');
	}
);
$f3->route('POST /test',
	function($f3) {
		if ($_POST["action"] !== "gpx_uploads") return false;
		$str = urldecode($_POST["FileData"]);
		$data = explode(PHP_EOL,$str);
		$file = new GPXFile(json_encode($data));
		die();
	}
);

$f3->run();
