$(document).ready( function () {

	var query = $('#query').val();

	load_interaction_table(query, "all");

//	load_interaction_table(query, "physical");
//	load_interaction_table(query, "genetic");
	


});

function load_interaction_table(query, type) {

	var query = query;
	var int_type = type
	var table_id = "#" + int_type + "-int-table";

	var cit_link = "http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=";
	var gene_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?locus=';


	var gene_list = [];

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/interaction/' + int_type + '/' + query, function(data) {
	//	console.log('got interactions for :' + int_type + ': ' + data);		

		// make HTML table	
		
	//	$('#interactions').append("<h5>" + int_type + " Interactions</h5>");

		$('#interactions').append("<table id='" + int_type + "-int-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Description</th><th>Interaction Type</th><th>Experiment Type</th><th>Annotation Type</th><th>Modification</th><th>Phenotype</th><th>Note</th><th>Reference</th></tr></thead><tbody>");

		$.each(data, function (index, row) {
			$(table_id).append('<tr><td><a href=\''+ gene_link + row.dbid +'\'>' + row.feature_name + '</a></td><td>' + row.gene_name + '</td><td>' + row.description + '</td><td>' + row.interaction_type +'</td><td>' +row.experiment_type + '</td><td>' + row.annotation_type + '</td><td>' + row.modification + '</td><td>' + row.phenotype + '</td><td>' + row.note + '<td>' + row.citation + '; PMID:<a href=\'' + cit_link + row.pmid + '\'>' + row.pmid + '</a></td></tr>')

		 //	gene_list[index] = row.feature_name;

		}); // end each

		if (data.length > 10) {
			$(table_id).dataTable();
		};

	//	$('#go-term-link').append('<a href=\'' + go_term_link + gene_list + '>GO Term Finder</a>Find common features of the genes displayed above')

	$("#interactions").append("<div class='spacer'></div>");
	
	load_analyze_links(query, type);

	}); // end get JSON


} // end load_interaction_table


function load_analyze_links(query, type) {
	
	var go_term_link = "http://yeastgenome.org/cgi-bin/GO/goTermFinder.pl";
	var go_slim_link = "http://yeastgenome.org/cgi-bin/GO/goSlimMapper.pl";
	var spell_link = 'http.//spell.yeastgenome.org/';
	var yeastmine_link = 'http://yeastmine.yeastgenome.org/yeastmine/portal.do';



}

function load_ext_links(query) {

 

}