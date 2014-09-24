<?php
function get_timeline($path) {
	$fp = fopen($path,"r");
	$json = json_decode(fread($fp,filesize($path)),true);
	fclose($fp);

	for($i = 0 ; $i < count($json['timeline']['date']); $i++) {
		$data = $json['timeline']['date'][$i];
		if(!$date[$data['chapter']])
			$date[$data['chapter']] = array();
		if(!$date[$data['chapter']][$data['startDate']])
			$date[$data['chapter']][$data['startDate']] = array();
		$data['tag'] = explode(",",$data['organization']);
		$date[$data['chapter']][$data['startDate']][] = $data;
	}
	$tdata = $json['timeline']['tag'];
	for($i = 0; $i < count($tdata); $i++) {
		$tags[$tdata[$i]['key']] = array (
			'name' => $tdata[$i]['name'],
			'description' => $tdata[$i]['description']
		);
	}
	$cdata = $json['timeline']['chapter'];
	for($i = 0; $i < count($cdata); $i++) {
		$chapter[$cdata[$i]['chapter']] = $cdata[$i];
	}
	$timeline = array('date'=>$date, 'tag'=>$tags, 'chapter'=>$chapter);

	return $timeline;
}
function get_article_content($id) {
	ob_start();
	include "data/".$id.".html";
	$content = ob_get_contents();
	ob_end_clean();
	return $content;
}
?>
