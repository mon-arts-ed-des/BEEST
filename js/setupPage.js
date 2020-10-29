function setupNav(){
	$('#beestNav').load('common/beestnav.html');
	$('#beestFooter').load('common/beestfooter.html');
	
	activeNav();
};

function activeNav() {
	var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
	 $(".nav-link").each(function(){
		  if($(this).attr("href") == pgurl || $(this).attr("href") == '' ){
		  $(this).addClass("active");
		  $(this).removeClass("text-white");
		  $(this).append('<span class="sr-only">(current)</span>');
		  $(this).closest('.nav-item').css({"background": "#004DAE"});
	 }
	});
}

function setupToolTips(longTime,shortTime){
	if (longTime==undefined){
		longTime = 7000
	}
	if (shortTime == undefined){
		shortTime = 2500
	}
	
	longShowToolTip(longTime)
	shortHideToolTipOnClick('copyCodeBtn',shortTime)
	shortHideToolTipOnClick('toggleHelp',shortTime)
}

function longShowToolTip(longTime) {
	$(document).on('shown.bs.tooltip', function (e) {
		setTimeout(function () {
			$(e.target).tooltip('hide');
		}, longTime);
	});
}

function shortHideToolTipOnClick(id,shortTime){
	$('#'+id).on('click', function (e) {
		setTimeout(function () {
			$(e.target).tooltip('hide');
		}, shortTime);
	});
}

function setupGoogleAnalytics(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-152392632-3');
}