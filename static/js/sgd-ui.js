 var windowSizeArray = [ "width=1200,height=1200",
                            "width=1200,height=1200,scrollbars=yes" ];

num_reg_targets = "";

$(document).ready( function() {
	
	//	$.curCSS = function (element, attrib, val) {
	//	$(element).css(attrib, val);
	//	};

	$('#main-header').load('http://fasolt.stanford.edu/cgi-bin/toolbar.pl');
       	$('#footer-holder').load('http://fasolt.stanford.edu/cgi-bin/footer.pl?no_js=1');

	//	console.log("footer:" + $.load('http://fasolt.stanford.edu/cgi-bin/footer.pl'));
	$('#page-nav').affix({
		offset:$('#page-nav').position()
		    });
	query = $('#query').val();

	console.log('q=' + query);

	// global variables //
	web_services_url = 'http://cherry-vm25.stanford.edu/yeastmine_backend/';

	display_name = $('#display').val();
	title_name = $('#title').val();
	protein_name = $('#protein_name').val();
	dbid = $('#dbid').val();
	filename = title_name + "_Regulation";
	file = filename.replace("/","_");
	
		pubmed_url = 'http://www.ncbi.nlm.nih.gov/pubmed/';
		ref_url = 'http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=';
	//	feat_url = 'http://yeastgenome.org/cgi-bin/locus.fpl?dbid=';
	//	go_url = 'http://yeastgenome.org/cgi-bin/GO/goTerm.pl?goid=';
		gbrowse_url = 'http://browse.yeastgenome.org/cgi-bin/gbrowse/scgenome/?name=';
	
// for dataTable parameters //

	dataTable_params = {
	"sDom": 'l<"clear">Tfrtip<"clear">',
	  "oLanguage": {
	    "sSearch": "Filter: ",
	    "sInfo": "Showing _START_ to _END_ of _TOTAL_ rows",
	    "sLengthMenu":"Display _MENU_ rows",	
	    "sLoadingRecords": "<img src='../../regulation/static/imgs/dark-slow-wheel.gif'></img>",
	  },
	"aaSorting": [],
	"bAutoWidth": false,
	"oTableTools": {
			"sSwfPath": "../../regulation/static/js/swf/copy_csv_xls_pdf.swf",
			"aButtons": ["copy",
				     {"sExtends": "csv",
					"sTitle": file },
					{"sExtends": "pdf",
					  "sTitle": file},
					"print",
				]
	}

};

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

	// 	$('#page-content').scrollspy();

}); // end document ready function

$(document).ajaxStop(function() {

	console.log("all ajax is done");
	refresh_scrollspy();
});

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
    $("#page-nav a:first").tab('show');

   $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
//	console.log("SUMM POS: " + $("#summary").position().top);
    });
}

function hide_nav(section) {
	var sect_id = section;
	
	console.log("hide :" + sect_id);
	$("#" + sect_id + "-li").hide();
	$("section#" + sect_id).replaceWith("<!-- " + sect_id + " removed -->");
	$("#"+ sect_id).replaceWith("<!-- " + sect_id + " removed -->");
}


function replace_text(name, text, element) {
	var class_name = name;
	var textToUse = text;
	var element = element;
	
	console.log('replacing text for ' + class_name + ", for element: "+ element + ", new text: "+textToUse);
	
	$("."+ class_name + " " + element).text(textToUse);
}

	
