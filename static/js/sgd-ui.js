$(document).ready( function() {

	$('#main-header').load('http://fasolt.stanford.edu/cgi-bin/toolbar.pl');
	$('#footer-holder').load('http://fasolt.stanford.edu/cgi-bin/footer.pl');

//, function() {
//			$('#footer-holder .spacer').remove();
//	});


	var query = $('#query').val();

	console.log('q=' + query);

	$.getJSON('http://sgd-dev-2.stanford.edu:5757/gene/display_name/'+query, function(data) {
		var display_name = data.display_name;

	     	$('.sect-title').append(data.title_name);
	        $('.protein-name').append(data.protein_name);

		$('a.tab-link').each(function() {
			var href = $(this).attr('href');	
			$(this).attr('href', href + data.dbid);
		});
	});
}); // end document ready function

