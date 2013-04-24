var windowSizeArray = [ "width=1200,height=1200",
                            "width=1200,height=1200,scrollbars=yes" ];

num_reg_targets = "";

$(document).ready( function() {

	$('#main-header').load('http://fasolt.stanford.edu/cgi-bin/toolbar.pl');
	$('#footer-holder').load('http://fasolt.stanford.edu/cgi-bin/footer.pl');

	query = $('#query').val();

	console.log('q=' + query);

	// global variable //

	display_name = $('#display').val();
	title_name = $('#title').val();
	protein_name = $('#protein_name').val();
	dbid = $('#dbid').val();

	pubmed_url = 'http://www.ncbi.nlm.nih.gov/pubmed/';
	ref_url = 'http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=';
	feat_url = 'http://yeastgenome.org/cgi-bin/locus.fpl?dbid=';
	go_url = 'http://yeastgenome.org/cgi-bin/GO/goTerm.pl?goid=';
	

	$('.sect-title').append(title_name);
	$('.protein-name').append(protein_name);

	$('a.tab-link').each(function() {
		var href = $(this).attr('href');	
		$(this).attr('href', href + dbid);
	});


     $('.newWindow').click(function (event){
 
            var url = $(this).attr("href");
            var windowName = "popUp";//$(this).attr("name");
            var windowSize = windowSizeArray[ $(this).attr("rel") ];
 
            window.open(url, windowName, windowSize);
 
            event.preventDefault();
 
     });

	$('.close_link').replaceWith('</a>');


}); // end document ready function

$(document).ajaxStop(function() {
	console.log("all ajax is done");
	refresh_scrollspy();
});

function custom_dataTable_obj(table_name) {
   var id = table_name;

//	console.log('table id: ' + id);
oTable = $('#' + id).dataTable({
  "oLanguage": {
    "sSearch": "Filter: "
  },
});
}

function sci_not_sort_dataTable(table_name, columns) {
	var columnArray = columns;

	oTable = $('#' + id).dataTable({
		"aoColumn": [null, { "sType": "scientific", "aTargets": [3]}, null ],
		"oLanguage" : { "sSearch": "Filter: "}
	});
	
}

function open_new_window(url) {

    $('.newWindow').click(function (event){
 
            var url = $(this).attr("href");
            var windowName = "popUp";//$(this).attr("name");
            var windowSize = windowSizeArray[ $(this).attr("rel") ];
 
            window.open(url, windowName, windowSize);
 
            event.preventDefault();
 
        });

}

function refresh_scrollspy() {
//	$('body').scrollspy('refresh');


   $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
	console.log("SUMM POS: " + $("#summary").position().top);
    });
}

function hide_nav(section) {
	var sect_id = section;
	
	console.log("hide :" + sect_id);
	$("#" + sect_id + "-li").hide();
}


function replace_text(name, text, element) {
	var class_name = name;
	var textToUse = text;
	var element = element;
	
	console.log('replacing text for ' + class_name + ", for element: "+ element + ", new text: "+textToUse);
	
	$("."+ class_name + " " + element).text(textToUse);
}

	