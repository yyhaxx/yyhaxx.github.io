requirejs.config({
	paths:{
		jquery:'jquery.min',
	}
})
requirejs(['jquery','backtop'],function ($,backtop) {
	$('#backTop').backtop({
		mode:'move',
	})
})