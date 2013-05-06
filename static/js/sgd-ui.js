 var windowSizeArray = [ "width=1200,height=1200",
                            "width=1200,height=1200,scrollbars=yes" ];

num_reg_targets = "";

$(document).ready( function() {

	$('#main-header').load('http://fasolt.stanford.edu/cgi-bin/toolbar.pl');
	$('#footer-holder').load('http://fasolt.stanford.edu/cgi-bin/footer.pl');

	query = $('#query').val();

	console.log('q=' + query);

	// global variables //

	display_name = $('#display').val();
	title_name = $('#title').val();
	protein_name = $('#protein_name').val();
	dbid = $('#dbid').val();
	filename = title_name + "_Regulation";
	file = filename.replace("/","_");
	
	pubmed_url = 'http://www.ncbi.nlm.nih.gov/pubmed/';
	ref_url = 'http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=';
	feat_url = 'http://yeastgenome.org/cgi-bin/locus.fpl?dbid=';
	go_url = 'http://yeastgenome.org/cgi-bin/GO/goTerm.pl?goid=';
	gbrowse_url = 'http://browse.yeastgenome.org/'
	
	//****************************************//
	//  object to map URLs and databases for domains/sites //
	//***************************************//
		domain_mapping_obj = new Object();
		domain_mapping_obj.HMMSmart = {"database": "SMART", "url": "http://smart.embl-heidelberg.de/smart/do_annotation.pl?DOMAIN="};
		domain_mapping_obj.PatternScan = {"database": "PROSITE", "url": "http://prodom.prabi.fr/prodom/cgi-bin/prosite-search-ac?"};
		domain_mapping_obj.ProfileScan = {"database": "PROSITE", "url": "http://prodom.prabi.fr/prodom/cgi-bin/prosite-search-ac?"};
		domain_mapping_obj.FPrintScan = {"database": "PRINTS", "url": "http:////www.bioinf.man.ac.uk/cgi-bin/dbbrowser/sprint/searchprintss.cgi?display_opts=Prints&amp;category=None&amp;queryform=false&amp;prints_accn="};
		domain_mapping_obj.HMMPfam = {"database": "Pfam", "url": "http://pfam.sanger.ac.uk/family?type=Family&entry="};
		domain_mapping_obj.BlastProDom = {"database": "ProDom", "url": "http://prodom.prabi.fr/prodom/current/cgi-bin/request.pl?question=DBEN&amp;query="};
		domain_mapping_obj.HMMTigr = {"database": "TIGRFAMs", "url": "http://cmr.tigr.org/tigr-scripts/CMR/HmmReport.cgi?hmm_acc="};
		domain_mapping_obj.superfamily = {"database": "SUPERFAMILY", "url": "http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid="};
		domain_mapping_obj.HMMPIR= {"database": "PIR superfamily", "url": "http://pir.georgetown.edu/cgi-bin/ipcSF?"};
		domain_mapping_obj.HMMPanther = {"database": "PANTHER", "url": "http://www.pantherdb.org/panther/family.do?clsAccession="};
		domain_mapping_obj.Gene3D = {"database": "Gene3D", "url": "http://www.cathdb.info/cathnode/"};
		domain_mapping_obj.JASPAR = {"database": "JASPAR", "url": "http:///jaspar"};

	//*************************************//

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

function no_pagination_dataTable_obj(table_name) {
   var id = table_name;

oTable = $('#' + id).dataTable({
	"sDom": 'Tfrtip<"clear">',
	  "oLanguage": {
	    "sSearch": "Filter: ",
	    "sInfo": "Showing _START_ to _END_ of _TOTAL_ rows",
	    "sLengthMenu":"Display _MENU_ rows"

	  },
	"aaSorting": [],
	"bPaginate" : false,
	"oTableTools": {
			"sSwfPath": "../../static/js/swf/copy_csv_xls_pdf.swf",
			"aButtons": ["copy",
				     {"sExtends": "csv",
					"sTitle": file },
					{"sExtends": "xls",
					"sTitle": file},
					{"sExtends": "pdf",
					  "sTitle": file},
					"print",
				]
	}

});
}

function custom_dataTable_obj(table_name) {
   var id = table_name;

//	console.log('table id: ' + id);
oTable = $('#' + id).dataTable({
	"sDom": 'l<"clear">Tfrtip<"clear">', 
	  "oLanguage": {
	    "sSearch": "Filter: ",
	    "sInfo": "Showing _START_ to _END_ of _TOTAL_ rows",
	    "sLengthMenu":"Display _MENU_ rows"

	  },
	"sPaginationType": "bootstrap",
	"aaSorting": [],
//	"aoColumnDefs": [{"sType": "numeric", "aTargets": [0]}],
	"oTableTools": {
			"sSwfPath": "../../static/js/swf/copy_csv_xls_pdf.swf",
			"aButtons": ["copy",
				     {"sExtends": "csv",
					"sTitle": file },
					{"sExtends": "xls",
					"sTitle": file},
					{"sExtends": "pdf",
					  "sTitle": file},
					{"sExtends": "print",
					  "sTitle": file }]
			}
	});
}

function custom_dataTable_numSort_obj(table_name) {
   var id = table_name;

//	console.log('table id: ' + id);
oTable = $('#' + id).dataTable({
	"sDom": 'l<"clear">Tfrtip<"clear">', 
	  "oLanguage": {
	    "sSearch": "Filter: ",
	    "sInfo": "Showing _START_ to _END_ of _TOTAL_ rows",
	    "sLengthMenu":"Display _MENU_ rows"

	  },
	"sPaginationType": "bootstrap",
	"aaSorting": [],
	"aoColumnDefs": [{"sType": "numeric", "aTargets": [0]}],
	"oTableTools": {
			"sSwfPath": "../../static/js/swf/copy_csv_xls_pdf.swf",
	}

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
//	console.log("SUMM POS: " + $("#summary").position().top);
    });
}

function hide_nav(section) {
	var sect_id = section;
	
	console.log("hide :" + sect_id);
	$("#" + sect_id + "-li").hide();
	$("section#" + sect_id).replaceWith("<!-- " + sect_id + " removed -->");
}


function replace_text(name, text, element) {
	var class_name = name;
	var textToUse = text;
	var element = element;
	
	console.log('replacing text for ' + class_name + ", for element: "+ element + ", new text: "+textToUse);
	
	$("."+ class_name + " " + element).text(textToUse);
}

	