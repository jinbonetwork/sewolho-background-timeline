<?php
require_once "libs/get_content.php";
$timeline = get_timeline("data/timeline.json");
$date = $timeline['date'];
$chapter = $timeline['chapter'];
$tags = $timeline['tag'];
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
	<title>세월호는 왜..</title>
	<meta property="og:title" content="세월호는 왜.." />
	<meta property="og:site_name" content="Taogi Special Project: 세월호" />
	<meta property="og:url" content="http://www.taogi.net/special/sewolho/background/" />
	<meta property="og:description" content="세월호 참사의 구조적인 원인 타임라인" />
	<meta property="og:image" content="http://www.taogi.net/special/sewolho/background/images/og.jpg" />
	<link rel="shortcut icon" href="./images/favicon.ico" />
	<link rel="stylesheet" type="text/css" href="./css/layout.css">
	<link rel="stylesheet" type="text/css" href="./fsbb/BookBlock/css/bookblock.css">
	<link rel="stylesheet" type="text/css" href="./fsbb/perfect-scrollbar/min/perfect-scrollbar.min.css">
	<link rel="stylesheet" type="text/css" href="./fsbb/OpeningSequence/css/component.css">
	<link rel="stylesheet" type="text/css" href="./fsbb/css/fsbb.component.css">
	<link rel="stylesheet" type="text/css" href="./css/sewol.timeline.css">
	<link rel="stylesheet" type="text/css" href="./css/marsa.diagram.css">
	<link rel="stylesheet" type="text/css" href="./css/style.css">
	<!--[if IE]>
	<script type="text/javascript" src="./js/script.html5.js"></script>
	<![endif]-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="./fsbb/BookBlock/js/jquerypp.custom.js"></script>
	<script src="./fsbb/BookBlock/js/modernizr.custom.js"></script>
	<script src="./fsbb/BookBlock/js/jquery.bookblock.js"></script>
	<script src="./fsbb/perfect-scrollbar/min/perfect-scrollbar.min.js"></script>
	<script src="./fsbb/OpeningSequence/js/jquery.lettering.js"></script>
	<script src="./fsbb/js/jquery.fsbb.js"></script>
	<script type="text/javascript" src="./js/jquery.sewol-timeline.js"></script>
	<script type="text/javascript" src="./js/jquery.marsa-diagram.js"></script>
	<script type="text/javascript" src="./contrib/jquery.actual/jquery.actual.min.js"></script>
	<script type="text/javascript" src="./js/app.js"></script>
</head>
<body>
	<div id="frame">
		<header id="site-header">
		</header>
		<div id="site-main">
			<div id="article-flip" class="four-slide">
				<h1 id="headline_title">
					<svg version="1.0" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="420px" height="78px" viewBox="0 0 420 78" enable-background="new 0 0 420 78" xml:space="preserve"><image xlink:href="./images/title.svg" src="./images/title.png" width="420px" height="78px" /></svg>
					<div class="subtitle"><h2>타임라인으로 탐구하는 세월호 참사원인</h2></div>
				</h1>
				<div id="chapter1-item" class="four-item" data-label="2012.9" data-title="<?php print $chapter[1]['headline']; ?>">
					<div class="item-wrapper">
						<div id="chapter1-content" class="item-inner">
							<h2 class="subject">
								<svg version="1.0" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
									 width="259px" height="29px" viewBox="0 0 259 29" enable-background="new 0 0 259 29" xml:space="preserve">
									<image xlink:href="./images/chapter-1.svg" src="./images/chapter-1.png" width="259px" height="29px" />
								</svg>
							</h2>
							<section class="summary">
<?php							print $chapter[1]['text']; ?>
							</section>
							<section class="content">
								<ul id="chapter1-timeline" class="sewol-timeline">
<?php						if($date[1]) {
								foreach($date[1] as $startDate => $data) {?>
									<li class="timeline-item">
										<div class="date"><span><?php print $startDate; ?></span></div>
<?php								for($i=0; $i<@count($data); $i++) {?>
										<article class="item-content <?php print implode(" ",$data[$i]['tag']); ?>" data-tags="<?php print implode(" ",$data[$i]['tag']); ?>">
											<h3 class="headline"><?php print $data[$i]['headline']; ?></h3>
											<div class="text">
												<div class="text-wrap">
													<div class="description">
														<div class="inner noswipe">
															<div class="pubdate"><?php print $startDate; ?></div>
															<h3 class="title"><?php print $data[$i]['headline']; ?></h3>
															<?php print $data[$i]['text']; ?>
<?php													if($data[$i]['asset'] || $data[$i]['media']) {?>
															<dl class="reference">
																<dt>자료</dt>
<?php														if($data[$i]['media']) {
																for($j=0; $j<@count($data[$i]['media']); $j++) {?>
																	<dd>
<?php																if($data[$i]['media'][$j]['caption'] || $data[$i]['media'][$j]['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php if($data[$i]['media'][$j]['credit']) {?> <span class="credit"><?php print $data[$i]['media'][$j]['credit']; ?></span> <?php } print $data[$i]['media'][$j]['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php print $data[$i]['media'][$j]['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php															}
															} else if($data[$i]['asset']) {?>
																	<dd>
<?php																if($data[$i]['asset']['caption'] || $data[$i]['asset']['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php if($data[$i]['asset']['credit']) {?> <span class="credit"><?php print $data[$i]['asset']['credit']; ?></span> <?php } print $data[$i]['asset']['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php print $data[$i]['asset']['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php														}?>
															</dl>
<?php													}?>
														</div>
													</div>
													<div class="organiztion">
														<dl>
															<dt>행위 주체</dt>
<?php												if($data[$i]['tag']) {
														foreach($data[$i]['tag'] as $t) {?>
															<dd><div class="organize <?php print $t; ?>" data-tag="<?php print $t; ?>"><button class="btn"><?php print $tags[$t]['name']; ?><span class="after"></span></button><?php if($tags[$t]['description']) {?><div class="org-description"><?php print $tags[$t]['description']; ?></div><?php } ?></div></dd>
<?php													}
													}?>
														</dl>
													</div>
												</div>
											</div>
										</article>
<?php								}?>
									</li>
<?php							}
							}?>
								</ul>
							</section> 
						</div>
					</div>
				</div>
				<div id="chapter2-item" class="four-item" data-label="2013.3" data-title="<?php print $chapter[2]['headline']; ?>">
					<div class="item-wrapper">
						<div id="chapter2-content" class="item-inner">
							<h2 class="subject">
								<svg version="1.0" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
									 width="245px" height="29px" viewBox="0 0 245 29" enable-background="new 0 0 245 29" xml:space="preserve">
									<image xlink:href="./images/chapter-2.svg" src="./images/chapter-2.png" width="245px" height="29px" />
								</svg>
							</h2>
							<section class="summary">
<?php							print $chapter[2]['text']; ?>
							</section>
							<section class="content">
								<ul id="chapter2-timeline" class="sewol-timeline">
<?php						if($date[2]) {
								foreach($date[2] as $startDate => $data) {?>
									<li class="timeline-item">
										<div class="date"><?php print $startDate; ?></div>
<?php								for($i=0; $i<@count($data); $i++) {?>
										<article class="item-content <?php print implode(" ",$data[$i]['tag']); ?>" data-tags="<?php print implode(" ",$data[$i]['tag']); ?>">
											<h3 class="headline"><?php print $data[$i]['headline']; ?></h3>
											<div class="text">
												<div class="text-wrap">
													<div class="description">
														<div class="inner noswipe">
															<div class="pubdate"><?php print $startDate; ?></div>
															<h3 class="title"><?php print $data[$i]['headline']; ?></h3>
															<?php print $data[$i]['text']; ?>
<?php													if($data[$i]['asset'] || $data[$i]['media']) {?>
															<dl class="reference">
																<dt>자료</dt>
<?php														if($data[$i]['media']) {
																for($j=0; $j<@count($data[$i]['media']); $j++) {?>
																	<dd>
<?php																if($data[$i]['media'][$j]['caption'] || $data[$i]['media'][$j]['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php if($data[$i]['media'][$j]['credit']) {?> <span class="credit"><?php print $data[$i]['media'][$j]['credit']; ?></span> <?php } print $data[$i]['media'][$j]['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php print $data[$i]['media'][$j]['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php															}
															} else if($data[$i]['asset']) {?>
																	<dd>
<?php																if($data[$i]['asset']['caption'] || $data[$i]['asset']['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php if($data[$i]['asset']['credit']) {?> <span class="credit"><?php print $data[$i]['asset']['credit']; ?></span> <?php } print $data[$i]['asset']['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php print $data[$i]['asset']['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php														}?>
															</dl>
<?php													}?>
														</div>
													</div>
													<div class="organiztion">
														<dl>
															<dt>행위 주체</dt>
<?php												if($data[$i]['tag']) {
														foreach($data[$i]['tag'] as $t) {?>
															<dd><div class="organize <?php print $t; ?>" data-tag="<?php print $t; ?>"><button class="btn"><?php print $tags[$t]['name']; ?><span class="after"></span></button><?php if($tags[$t]['description']) {?><div class="org-description"><?php print $tags[$t]['description']; ?></div><?php }?></div></dd>
<?php													}
													}?>
														</dl>
													</div>
												</div>
											</div>
										</article>
<?php								}?>
									</li>
<?php							}
							}?>
								</ul>
							</section>
						</div>
					</div>
				</div>
				<div id="chapter3-item" class="four-item" data-label="~ 2014.4.16" data-title="<?php print $chapter[3]['headline']; ?>">
					<div class="item-wrapper">
						<div id="chapter3-content" class="item-inner">
							<h2 class="subject">
								<svg version="1.0" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
									 width="365px" height="28px" viewBox="0 0 365 28" enable-background="new 0 0 365 28" xml:space="preserve">
									<image xlink:href="./images/chapter-3.svg" src="./images/chapter-3.png" width="365px" height="28px" />
								</svg>
							</h2>
							<section class="summary">
<?php							print $chapter[3]['text']; ?>
							</section>
							<section class="content">
								<ul id="chapter3-timeline" class="sewol-timeline">
<?php						if($date[3]) {
								foreach($date[3] as $startDate => $data) {?>
									<li class="timeline-item">
										<div class="date"><?php print $startDate; ?></div>
<?php								for($i=0; $i<@count($data); $i++) {?>
										<article class="item-content <?php print implode(" ",$data[$i]['tag']); ?>" data-tags="<?php print implode(" ",$data[$i]['tag']); ?>">
											<h3 class="headline"><?php print $data[$i]['headline']; ?></h3>
											<div class="text">
												<div class="text-wrap">
													<div class="description">
														<div class="inner noswipe">
															<div class="pubdate"><?php print $startDate; ?></div>
															<h3 class="title"><?php print $data[$i]['headline']; ?></h3>
															<?php print $data[$i]['text']; ?>
<?php													if($data[$i]['asset'] || $data[$i]['media']) {?>
															<dl class="reference">
																<dt>자료</dt>
<?php														if($data[$i]['media']) {
																for($j=0; $j<@count($data[$i]['media']); $j++) {?>
																	<dd>
<?php																if($data[$i]['media'][$j]['caption'] || $data[$i]['media'][$j]['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php if($data[$i]['media'][$j]['credit']) {?> <span class="credit"><?php print $data[$i]['media'][$j]['credit']; ?></span> <?php } print $data[$i]['media'][$j]['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php print $data[$i]['media'][$j]['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php															}
															} else if($data[$i]['asset']) {?>
																	<dd>
<?php																if($data[$i]['asset']['caption'] || $data[$i]['asset']['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php if($data[$i]['asset']['credit']) {?> <span class="credit"><?php print $data[$i]['asset']['credit']; ?></span> <?php } print $data[$i]['asset']['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php print $data[$i]['asset']['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php														}?>
															</dl>
<?php													}?>
														</div>
													</div>
													<div class="organiztion">
														<dl>
															<dt>행위 주체</dt>
<?php												if($data[$i]['tag']) {
														foreach($data[$i]['tag'] as $t) {?>
															<dd><div class="organize <?php print $t; ?>" data-tag="<?php print $t; ?>"><button class="btn"><?php print $tags[$t]['name']; ?><span class="after"></span></button><?php if($tags[$t]['description']) {?><div class="org-description"><?php print $tags[$t]['description']; ?></div><?php }?></div></dd>
<?php													}
													}?>
														</dl>
													</div>
												</div>
											</div>
										</article>
<?php								}?>
									</li>
<?php							}
							}?>
								</ul>
							</section>
						</div>
					</div>
				</div>
				<div id="chapter4-item" class="four-item" data-label="2014.4.16" data-title="<?php print $chapter[4]['headline']; ?>">
					<div class="item-wrapper">
						<div id="chapter4-content" class="item-inner">
							<h2 class="subject">
								<svg version="1.0" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
									 width="322px" height="28px" viewBox="0 0 322 28" enable-background="new 0 0 322 28" xml:space="preserve">
									<image xlink:href="./images/chapter-4.svg" src="./images/chapter-4.png" width="322px" height="28px" />
								</svg>
							</h2>
							<section class="summary">
<?php							print $chapter[4]['text']; ?>
							</section>
							<section class="content">
								<ul id="chapter4-timeline" class="sewol-timeline">
<?php						if($date[4]) {
								foreach($date[4] as $startDate => $data) {?>
									<li class="timeline-item">
										<div class="date"><?php print $startDate; ?></div>
<?php								for($i=0; $i<@count($data); $i++) {?>
										<article class="item-content <?php print implode(" ",$data[$i]['tag']); ?>" data-tags="<?php print implode(" ",$data[$i]['tag']); ?>">
											<h3 class="headline"><?php print $data[$i]['headline']; ?></h3>
											<div class="text">
												<div class="text-wrap">
													<div class="description">
														<div class="inner noswipe">
															<div class="pubdate"><?php print $startDate; ?></div>
															<h3 class="title"><?php print $data[$i]['headline']; ?></h3>
															<?php print $data[$i]['text']; ?>
<?php													if($data[$i]['asset'] || $data[$i]['media']) {?>
															<dl class="reference">
																<dt>자료</dt>
<?php														if($data[$i]['media']) {
																for($j=0; $j<@count($data[$i]['media']); $j++) {?>
																	<dd>
<?php																if($data[$i]['media'][$j]['caption'] || $data[$i]['media'][$j]['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php if($data[$i]['media'][$j]['credit']) {?> <span class="credit"><?php print $data[$i]['media'][$j]['credit']; ?></span> <?php } print $data[$i]['media'][$j]['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['media'][$j]['media']; ?>" target="_blank"><?php print $data[$i]['media'][$j]['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php															}
															} else if($data[$i]['asset']) {?>
																	<dd>
<?php																if($data[$i]['asset']['caption'] || $data[$i]['asset']['credit']) {?>
																		<div class="caption">
																			<a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php if($data[$i]['asset']['credit']) {?> <span class="credit"><?php print $data[$i]['asset']['credit']; ?></span> <?php } print $data[$i]['asset']['caption']; ?></a>
																		</div>
<?php																} else {?>
																		<div class="media"><a href="<?php print $data[$i]['asset']['media']; ?>" target="_blank"><?php print $data[$i]['asset']['media']; ?></a></div>
<?php																}?>
																	</dd>
<?php														}?>
															</dl>
<?php													}?>
														</div>
													</div>
													<div class="organiztion">
														<dl>
															<dt>행위 주체</dt>
<?php												if($data[$i]['tag']) {
														foreach($data[$i]['tag'] as $t) {?>
															<dd><div class="organize <?php print $t; ?>" data-tag="<?php print $t; ?>"><button class="btn"><?php print $tags[$t]['name']; ?><span class="after"></span></button><?php if($tags[$t]['description']) {?><div class="org-description"><?php print $tags[$t]['descriptions']; ?></div><?php }?></div></dd>
<?php													}
													}?>
														</dl>
													</div>
												</div>
											</div>
										</article>
<?php								}?>
									</li>
<?php							}
							}?>
								</ul>
							</section>
						</div>
					</div>
				</div>
			</div>
<?php		include "marsa.php"; ?>
		</div>
		<footer id="site-footer">
			<ul class="nav">
				<li id="mobile-menu">
					<div><span>메뉴</span></div>
				</li>
				<li id="foot-logo">
					<div><span>세월호는 왜.</span></div>
				</li>
				<li id="go-marsa">
					<div><span>해양구조협회 관계도</span></div>
				</li>
				<li id="share" for="share-content" class="box-info">
					<div><span>공유하기</span></div>
				</li>
				<li id="creator" for="creator-content" class="box-info">
					<div><span>만든이들</span></div>
				</li>
			</ul>
			<div id="spin-off">
				<div class="spin"><span>따오기 스핀오프</span></div>
			</div>
			<ul class="site-info">
				<li id="share-content" class="boxinfo">
					<div class="wrapper">
						<div class="icon-close"><span>Close</span></div>
						<ul>
							<li class="twitter"><a href="https://twitter.com/share?text=<?php print rawurlencode('타임라인으로 탐구하는 세월호는 왜.'); ?>" title="트위터 리트윗하기" target="_blank"><span>Twitter</span></a></li>
							<li class="facebook"><a href="https://facebook.com/sharer.php?u=<?php print rawurlencode('http://www.taogi.net/special/sewolho/background/'); ?>" title="페이스북 좋아요" target="_blank"><span>FaceBook</span></a></li>
							<li class="github"><a href="https://github.com/jinbonetwork/sewolho-background-timeline" title="GitHub 소스 공유하기" target="_blank"><span>GitHub</span></a></li>
						</ul>
						<div class="arrow"></div>
					</div>
				</li>
				<li id="creator-content" class="boxinfo">
					<div class="wrapper">
						<div class="icon-close"><span>Close</span></div>
						<ul class="banner">
							<li class="jinbonet"><a href="http://www.jinbo.net" target="_blank" title="진보네트워크센터"><img src="./images/jinbonet.svg" alt="진보네트워크센터"></a></li>
							<li class="opengirok"><a href="http://www.opengirok.or.kr/" target="_blank" title="정보공개센터"><img src="./images/opengirok.svg" alt="정보공개센터"></a></li>
						</ul>
						<ul class="worker">
							<li><label>콘텐츠기획</label>강성국 <a href="http://www.opengirok.or.kr/" target="_blank">정보공개센터</a></li>
							<li><label>디자인</label>뎡야핑 <a href="http://www.jinbo.net" target="_blank">진보네트워크센터</a></li>
							<li><label>프로그램</label>황규만 <a href="http://www.jinbo.net" target="_blank">진보네트워크센터</a></li>
						</ul>
						<div class="arrow"></div>
					</div>
				</li>
			</ul>
		</footer>
		<footer id="mobile-site-footer">
			<div class="mobile-nav">
				<div class="m-navi-wrapper">
					<ul id="m-main-navi">
						<li class="go-home">
							<div><span>홈으로</span></div>
						</li>
						<li class="chapter">
							<div><span>목차</span></div>
							<ul class="chapter-navi">
								<li class="go-chapter" data-chapter="1"><span>19년차 중고선박 수입</span></li>
								<li class="go-chapter" data-chapter="2"><span>불법개조와 부당승인</span></li>
								<li class="go-chapter" data-chapter="3"><span>불법과적단속과 안전진단 미비</span></li>
								<li class="go-chapter" data-chapter="4"><span>진도해역 침목과 구조실패</span></li>
							</ul>
						</li>
						<li class="go-marsa">
							<div><span>해양구조협회 관계도</span></div>
						</li>
						<li class="share box-info" for="share-content">
							<div><span>공유하기</span></div>
						</li>
						<li class="creator box-info" for="creator-content">
							<div><span>만든이들</span></div>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	</div>
</body>
</html>
