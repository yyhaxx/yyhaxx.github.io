$('#index-search').bind('keyup',function () {
	var searchText = $('#index-search').val();
	$.ajax({url:'http://api.bing.com/qsonhs.aspx?type=cb&cb=jsonpcallback&q='+searchText,dataType:'jsonp'})
})
function jsonpcallback(data) {
	if (data.AS.FullResults ==0 ) {
		return;
	}
	var dataArr = data.AS.Results[0].Suggests;
	var html = '';
	dataArr.forEach(function (item) {
		temphtml='<li><a href='+item.Url+'>'+item.Txt+'</a></li>';
		html+=temphtml;
	})
	$('#asso-con').html(html).show();
}
$(document).bind('click',function () {
	$('#asso-con').hide();
})
