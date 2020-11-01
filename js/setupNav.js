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

function setupToolTips(){
	longShowToolTip()
	shortHideToolTipOnClick('copyCodeBtn')
	shortHideToolTipOnClick('toggleHelp')
}

function longShowToolTip() {
	$(document).on('shown.bs.tooltip', function (e) {
		setTimeout(function () {
			$(e.target).tooltip('hide');
		}, 7000);
	});
}

function shortHideToolTipOnClick(id){
	$('#'+id).on('click', function (e) {
		setTimeout(function () {
			$(e.target).tooltip('hide');
		}, 2500);
	});
}