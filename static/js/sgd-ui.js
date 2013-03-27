$(document).ready( function() {

	$('#main-header').load('http://fasolt.stanford.edu/cgi-bin/toolbar.pl');
	$('#footer-holder').load('http://fasolt.stanford.edu/cgi-bin/footer.pl');

	var query = $('#query').val();

	console.log('q=' + query);

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/gene/display_name/'+query, function(data) {
		var display_name = data.display_name;

	     	$('.sect-title').append(data.title_name);
	        $('.protein-name').append(data.protein_name);

		$('a.tab-link').each(function() {
			var href = $(this).attr('href');	
			$(this).attr('href', href + data.dbid);
		});
	});
}); // end document ready function

function open_new_window (url) {

    $('.newWindow').click(function (event){
 
            var url = $(this).attr("href");
            var windowName = "popUp";//$(this).attr("name");
            var windowSize = windowSizeArray[ $(this).attr("rel") ];
 
            window.open(url, windowName, windowSize);
 
            event.preventDefault();
 
        });

}
