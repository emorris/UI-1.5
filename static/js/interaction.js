$(document.ready( function () {

	var query = $('#query').val();

	load_interaction_table(query);
	load_ext_links(query);
}

function load_interaction_table(query) {

	var query = query;

	var cit_link = "http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=";
	var gene_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?locus=';
	var go_term_link = 'http://yeastgenome.org/cgi-bin/GO/goTermFinder.pl";
	var go_slim_link = 'http://yeastgenome.org/cgi-bin/GO/goSlimMapper.pl";
	var spell_link = 'http.//spell.yeastgenome.org/';
	var yeastmine_link = 'http://yeastmine.yeastgenome.org/yeastmine/portal.do';

	var gene_list = [];

	$.getJSON('http://sgd-dev-2.stanford.edu:5757/gene/display_name/' + query, function(data) {
		
		// make HTML table	
		
		$('#interactions').append("<table id='int-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Description</th><th>Experiment Type</th><th>Annotation Type</th><th>Modification</th><th>Phenotype</th><th>Note</th><th>Reference</th></tr></thead><tbody>");

		$.each(data, function (index, row) {
			$('#int-table').append('<tr><td><a href=\''+ gene_link + row.dbid +'\'> + row.feature_name + '</a></td><td>' + row.gene_name + '</td><td>' + row.description + '</td><td>' +row.expt_type + '</td><td>' + row.annotation + '</td><td>' + row.mod + '</td><td>' + row.phenotype + '</td><td>' + row.note + '<td>' + row.citation + '; PMID:<a href=\'' + cit_link + row.pmid + '\'>' + row.pmid + '</a></td></tr>')

		 	gene_list[index] = row.feature_name;

		}); // end each

		if (data.length > 10) {
			$('#int-table').dataTable();
		};

		$('#go-term-link').append('<a href=\'' + go_term_link + gene_list + '>GO Term Finder</a>Find common features of the genes displayed above')
	});


} // end load_interaction_table
