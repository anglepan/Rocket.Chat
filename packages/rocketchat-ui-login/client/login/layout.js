Template.loginLayout.onRendered(function() {
	$('#initial-page-loading').remove();
	let window_height = $(window).height();
	$(".full-page").css('height', window_height);
});
