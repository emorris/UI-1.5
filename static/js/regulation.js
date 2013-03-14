
$(document).ready ( function() {

	var query = $('#query').val();
 // console.log('query: ' + query);
 
	load_summary(query);	
	load_bind_logo(query);
	load_pred_bind_sites(query);	
	load_expt_bind_sites(query); 
	load_reg_targets(query);
	load_go_processes(query);
	load_domains(query);
	load_regulators(query);


 $('#page-nav').affix({
	offset:$('#page-nav').position()
});

}); // end document ready

function get_feat_info(query) {
	var query = query

	$.getJSON('http://sgd-dev-2.stanford.edu:5757/gene/summary_name/'+query,

	 function(data) {
	
 		return data;
	});


}

function load_summary(query) {
	var query = query;

//	console.log("sum:" + $('#paragraph').position().top);
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/summary/'+query, function(data) {
	   
		var summary = data.summary;
	        var refs = []; 

		$("#paragraph").append("<p>"+ summary + "</p>");
		

	    // alert(data.publication[0].citation);
	
	     	$.each(data.publication, function(index, obj) {
			var num = index + 1;

	         	 $("#ref-list").append("<div class='citation'>" + obj.citation + "; PMID:<a href='http://yeastgenome.org/cgi-bin/reference/reference.pl?pmid=" + obj.pmid + "'>"+obj.pmid+"</a></div>");
		});

//		console.log("after sum: " + $('#paragraph').position().top);
		refresh_scrollspy();
	});
}

function load_bind_logo(query) {
	var query = query;
	
//	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/motif/'+query, function($) {
//		each.data(data, function(index, row) {
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotBiewLong.php?PME_sys_qf2=';
			$('#binding-logo').append('<a href="' + url + '"><img src="/static/imgs/bind-site-seq-logo.png" alt="Gal4p Binding Site Sequence Logo"></a>');
//	
//			$('#binding-logo').append('<a href="' + url + row.motifid + '"><img src="/static/imgs/YeTFaSCo_Logos/' + row.name + '_' + row.motifid + '.' + row.submotif +'.png" alt="Gal4p Binding Site Sequence Logo"></a>');
//		});
//
//		refresh_scrollspy();
//	});
}

function load_pred_bind_sites(query) {
	var feat = query;

	// pred-circos-modal (lg img)

	$("#pred-circos-modal").append("<div id='pred-circos' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h3 id=\"pred-Modal\">Circos image of predicted binding sites</h3></div><div class=\"modal-body\"><img src=\"/static/imgs/circos-lg.png\"></div><div class=\"modal-footer\"><button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button></div></div>");

	
	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/predicted_binding_site/'+feat, function(data) {
		

		$("#pred-table").append("<table id='predict-bind-site-table'><thead><tr><th># Intergenic Sites</th><th># Intragenic Sites</th><th>p-value</th></tr></thead><tbody>");

		$.each(data, function(index, obj) {
			var numIntra = obj.intragenic;
			var numInter = obj.intergenic;
			var pVal = obj.pvalue;
	
			$("#predict-bind-site-table").append("<tr><td>"+ numIntra +"</td><td>" + numInter + "</td><td>" + pVal + "</td></tr>");
		});

		if (data.length > 10) {
			$('#predict-bind-site-table').dataTable();
		}

		refresh_scrollspy();
	}); // end getJSON
	
} // end load_pred_bind_sites


function load_expt_bind_sites(query) {

	var query = query;
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/experimental_binding_site/'+ query, function(data) { 	
		console.log("expt#" + data);
		$('#expt-bind-site-num').append(data);
	});


// expt-circos-modal (lg img)
	$("#expt-circos-modal").append("<div id='expt-circos' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button><h3 id=\"myModalLabel\">Circos image of experimental binding sites</h3></div><div class=\"modal-body\"><img src=\"/static/imgs/circos-lg.png\"></div><div class=\"modal-footer\"><button class=\"btn\" data-dismiss=\"modal\" aria-hidden=\"true\">Close</button></div></div>");

	refresh_scrollspy();

} // end expt_bind_sites


function load_reg_targets(query) {
	
	var feat = query;
	var cit_link = 'http://www.yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=';
	var feat_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?dbid='

	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/target/' + query, function(data) {
		$("#num-targets").append(data.length);

		$("#regulatory-targets").append("<table id='target-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>Reference</th><th>Source</th></tr></thead><tbody>");

		$.each(data, function(index, obj) {
			$('#target-table').append('<tr><td><a href=\''+feat_link + obj.dbid + '\'>'+ obj.feature_name+'</a></td><td>' + obj.gene_name + '</td><td>' + 
				obj.evidence + '</td><td>' +obj.citation + '; PMID:' + '<a href=\'' + cit_link + obj.pmid + '\'>'+ obj.pmid + '</a></td><td>'+ obj.source + '</td></tr>')
		});
		
		if (data.length > 10) {
			$('#target-table').dataTable();
		}

		refresh_scrollspy();
	});
	

} // end load_reg_targets

function load_go_processes(query) {

	var feat = query;
	var go_url = 'http://yeastgenome.org/cgi-bin/GO/goTerm.pl?goid=';
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/shared_go_process/' + feat, function(data) {

		$("#shared-GO-processes").append("<table id='GO-table'><thead><tr><th>GO Term</th><th>P-value</th><th>Number of genes</th></tr></thead><tbody>");
		$.each(data, function(index, obj) {

			var goArray = obj.goid.split(":");
			

			$('#GO-table').append('<tr><td><a href=\'' + go_url + goArray[1] + '\'>'+ obj.go_term +'</a></td><td>' + obj.pvalue + '</td><td>' + obj.matches + '</td></tr>')
		});

		if (data.length > 10) {
			$('#GO-table').dataTable();
		}

		refresh_scrollspy();
	});
	
} // end go_processes


function load_domains(feat_name) {
	var query = feat_name;

	var pbrowse ="http://browse.yeastgenome.org/fgb2/gbrowse_img/scproteome/?src=scproteome&name=" + query;
	var pbrowse_link = "http://yeastgenome.org/cgi-bin/protein/proteinPage.pl?locus=" + query;
	//"http://browse.yeastgenome.org/fgb2/gbrowse/scproteome/"+ query;

	$("#pBrowse").append("<div><a href='"+ pbrowse_link +"'><img id='pbrowse_img' src='" + pbrowse + "'></img></a></div>");
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/domain/' + query, function(data) {
		
		$("#domains").append("<div><table id='jaspar-table'><thead><tr><th>Jaspar Class</th><th>Jaspar Family</th></tr></thead><tbody>");
		$.each(data, function(index, obj) {
			$('#jaspar-table').append('<tr><td>'+ obj.class +'</td><td>' + obj.family + '</td></tr>')
		});

		if (data.length > 10) {

			$('#jaspar-table').dataTable();

		}
		refresh_scrollspy();

	});


}

function load_regulators(query) {
	
	var query = query;
	var cit_link = "http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=";
	var gene_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?locus=';

	$.getJSON('http://sgd-dev-2.stanford.edu:5757/regulation/regulator/' + query, function(data) {
		
		
		$('#num-regs').append(data.length);
		
		$("#regulators").append("<table id='regulator-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>References</th><th>Source</th></tr></thead><tbody>");

		$.each(data, function(index, obj) {
			$('#regulator-table').append('<tr><td><a href=\''+gene_link + obj.dbid +'\'>' + obj.feature_name +'</a></td><td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td>' +obj.citation + '; PMID:<a href=\'' + cit_link + obj.pmid + '\'>' + obj.pmid + '</a></td><td>' + obj.source + '</td></tr>')
		});

		if (data.length > 10) {
			$('#regulator-table').dataTable();
		}

		refresh_scrollspy();

	});
}

function refresh_scrollspy() {
   $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
//	console.log("SUMM POS: " + $('#summary').position().top);
    });
}

function linkGenes(text, display_name) {
	var linkTextArray = text.split(" ");
	var linkedArray  = [];
	var nameArray = display_name.split("/");	
	var gene_name = nameArray[0];
	var feat_name = nameArray[1];

	console.log("before:"+ linkedArray);

	$.each(linkTextArray, function(index, word) {
		if (word.length > 3 && word.length < 8) {

		var no_punc = word.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"");
		var cleanWord = no_punc.replace(/\s{2,}/g," ");

			$.getJSON('http://sgd-dev-2.stanford.edu:5757/gene/display_name/'+cleanWord, function(word_data) {
	
				if (word_data.display_name == cleanWord && (word_data.display_name != query && word_data.dbid != query)) {
					linkedArray[index] = "<a href='http://yeastgenome.org/cgi-bin/locus.fpl?locus="+ feat_name +"'>"+word+"</a>";
						//	alert(index + ": " + [index]);
				} else {
					linkedArray[index] = word;
				}
				console.log(index + ":" +linkedArray[index])
			});
		}	
	});
	console.log('after' + linkedArray.join(" "));

	//$("#paragraph").append("<p>"+ linkedArray.join(" ") + "</p>");

}