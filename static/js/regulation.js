 var windowSizeArray = [ "width=1200,height=1200",
                            "width=1200,height=1200,scrollbars=yes" ];

$(document).ready ( function() {

	var query = $('#query').val();

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/gene/display_name/'+query, function(data) {

		var gene_name = data.display_name;
	
		 console.log('query: ' + gene_name);

		load_summary(gene_name);	
		load_bind_logo(gene_name, data.protein_name);
		load_pred_bind_sites(gene_name, data.protein_name);	
		load_expt_bind_sites(gene_name, data.protein_name); 
		load_reg_targets(gene_name, data.protein_name);
		load_go_processes(gene_name, data.protein_naem);
		load_domains(gene_name, data.protein_name);
		load_regulators(gene_name, data.title_name);

});

 $(document).ajaxStop(function() {
	refresh_scrollspy();

 });


 $('#page-nav').affix({
	offset:$('#page-nav').position()
});


    $('.newWindow').click(function (event){
 
            var url = $(this).attr("href");
            var windowName = "popUp";//$(this).attr("name");
            var windowSize = windowSizeArray[ $(this).attr("rel") ];
 
            window.open(url, windowName, windowSize);
 
            event.preventDefault();
 
        });

	$('.close_link').replaceWith('</a>');


}); // end document ready


function refresh_scrollspy() {
   $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh')
//	console.log("SUMM POS: " + $spy.position().top);
    });
}

function hide_nav(section) {
	var sect_id = section;
	
	console.log("hide :" + sect_id);
	$("#" + sect_id + "-li").hide();
}

function get_feat_info(query) {
	var query = query

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/gene/display_name/'+query,  function(data) {
	
 		return data;
	});


}


function load_summary(query) {
	var query = query;

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/summary/'+query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log("Empty object");
			hide_nav('summary');
			hide_nav('refs');
		} else {
			console.log("data: " + data + "sum length: " + data.length);

			console.log("summary query: " + query);

			if (data.publication.length > 0) {
	   
				var sum = data.summary;
		    	    	var refs = []; 
			
				$('#summary').append("<div id='paragraph'><p>"+ sum + "</p></div>");
				$('#refs').append("<h3>References</h3><div id='ref-list'></div>");
	
		    	 	$.each(data.publication, function(index, obj) {
					var num = index + 1;
	
	        	 		 $("#ref-list").append("<div class='citation'>" + obj.citation + "; PMID:<a href='http://yeastgenome.org/cgi-bin/reference/reference.pl?pmid=" + obj.pmid + "'>"+obj.pmid+"</a></div>");
				});
	
				$("#refs").append("<hr>");

			} // end if
		} // end else
	})
	.always(function() { refresh_scrollspy(); });
}


function load_bind_logo(query, protein) {
	var query = query;

	var prot_name = protein;
//	var data = new Array();
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/logos/'+query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log("Empty logo obj");
			hide_nav('binding-site-seq-logos');

		} else {
			$('#binding-site-seq-logos').append("<h2>" + prot_name + " Binding Site Sequence Logo</h2><!-- #binding-site-seq-logo -->");
		
			console.log('data: ' + data);

		$.each(data, function(index, row) {
			var img_name = $.trim(row);

			var filename_array = img_name.split(".");
			var link = filename_array[0].split("_");
				
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotViewLong.php?PME_sys_qf2='+ link[1];

//			console.log(row + "* NEW URL: " + url );

			$('#binding-site-seq-logos').append('<a href="' + url + '"><img src="/static/imgs/YeTFaSCo_Logos/' + row + '" alt="Binding Site Sequence Logo"></a>');
		});

		$('#binding-site-seq-logos').append("<hr>");
		} // end else
	})
	.always(function() { refresh_scrollspy(); });
}


function load_pred_bind_sites(query, protein) {
	var feat = query;
	var img_name = 'circos-lg.png';
	var prot = protein;

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/predicted_binding_site/'+feat)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log("No pred binding sites returned");
			hide_nav('predicted-binding-sites');
		} else {
			$("#predicted-binding-sites").append("<h2>Predicted " + prot + " Binding Sites</h2><div id='pred-table'></div><div class='circos'><img id='pred-img' src='/static/imgs/circos_sm.png'></a></div><div id='pred-circos-modal'></div>");

			$("#pred-table").append("<table id='predict-bind-site-table'><thead><tr><th># Intergenic Sites</th><th># Intragenic Sites</th><th>p-value</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {
				var numIntra = obj.intragenic;
				var numInter = obj.intergenic;
				var pVal = obj.pvalue;
	
				$("#predict-bind-site-table").append("<tr><td>"+ numIntra +"</td><td>" + numInter + "</td><td>" + pVal + "</td></tr>");
		});

			var img = $('#pred-img').attr('src');

			$('#pred-img').replaceWith('<a href="/circos/' + img_name + '" rel="1" class="newWindow"><img src="' + img + '"></a>');	

			if (data.length > 10) {
				$('#predict-bind-site-table').dataTable();
			}
			$("#predicted-binding-sites").append("<hr>");
		} // end else
	})
	.always(function() { 
		refresh_scrollspy(); 
	}); 
	
} // end load_pred_bind_sites


function load_expt_bind_sites(query, protein) {

	var query = query;
	var img_name = 'circos-lg.png';
	var protein = protein;
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/experimental_binding_site/'+ query)
	.done(function(data) { 
		if ($.isPlainObject(data)) {
			console.log("No expt binding data");
			hide_nav('binding-site-summary');
		} else {
			$("#binding-site-summary").append("<h2>Summary of Experimentally Determined " + protein + " Binding Sites</h2> \
			<p>There are " + data + " experimentally determined " + protein +" binding sites in the genome.</p> \
			<div class='circos'><img id='expt-img' src='/static/imgs/circos_sm.png'></div>");
			console.log("#: " + data);

			var img = $('#expt-img').attr('src');

			$('#expt-img').replaceWith('<a href="/circos/' + img_name + '" rel="1" class="newWindow"><img src="' + img + '"></a>');

			$("#binding-site-summary").append("<hr>");
		} // end else
	})
	.always(function() { refresh_scrollspy(); });
} // end expt_bind_sites



function load_reg_targets(query, protein) {
	
	var feat = query;
	var prot_name = protein;
	uniq_genes = new Array();

	console.log("# uniq genes b: " + uniq_genes.length);

	var cit_link = 'http://www.yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=';
	var feat_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?dbid='

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/target/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('No regulatory targets loaded');
			hide_nav('regulatory-targets');
		} else {
			$("#regulatory-targets").append("<h2>"+ prot_name + " Regulatory Targets (<span id='num-targets'></span> total)</h2>");
	
			$("#regulatory-targets").append("<table id='target-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>Reference</th><th>Source</th></tr></thead><tbody>");
		
			$.each(data, function(index, obj) {
				$('#target-table').append('<tr><td><a href=\''+feat_link + obj.dbid + '\'>'+ obj.feature_name+'</a></td> \
				<td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td>' +obj.citation + '; PMID: <a href=\'' + cit_link + obj.pmid + '\'>'+ obj.pmid + '</a></td><td>'+ obj.source + '</td></tr>');
			if ($.inArray(obj.gene_name, uniq_genes) != -1) {
				uniq_genes.push(obj.gene_name);
			}			
		});
			
		$("#num-targets").append(data.length);

		if (data.length > 10) {
			$('#target-table').dataTable();
		}

		$("#regulatory-targets").append("<div class='spacer'></div><hr>");
	} // end else
	})
	.always(function() { refresh_scrollspy(); });
} // end load_reg_targets


function load_go_processes(query, protein) {

	var feat = query;
	var protein = protein;
	var go_url = 'http://yeastgenome.org/cgi-bin/GO/goTerm.pl?goid=';
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/shared_go_process/' + feat)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('No GO processes returned');
			hide_nav('shared-GO-processes');
		} else {
		
			$("#shared-GO-processes").append("<h2>Shared GO Processes Among " + protein + " Regulatory Targets</h2>");	
			$("#shared-GO-processes").append("<table id='GO-table'><thead><tr><th>GO Term</th><th>P-value</th><th>Number of genes</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {	
				var goArray = obj.goid.split(":");			

				$('#GO-table').append('<tr><td><a href=\'' + go_url + goArray[1] + '\'>'+ obj.go_term +'</a></td><td>' + obj.pvalue + '</td><td>' + obj.matches + '</td></tr>')
			});
		
			if (data.length > 10) {
				$('#GO-table').dataTable();
			}

			$("#shared-GO-processes").append("<div class='spacer'></div><hr>");
		} // end else

	})
	.always(function() { refresh_scrollspy(); });

} // end go_processes


function load_domains(feat_name, protein) {
	var query = feat_name;
	var protein = protein;

	var pbrowse ="http://browse.yeastgenome.org/fgb2/gbrowse_img/scproteome/?src=scproteome&name=" + query;
	var pbrowse_link = "http://yeastgenome.org/cgi-bin/protein/proteinPage.pl?locus=" + query;
			
	$("#domains").append("<h2>" + protein + " Domains</h2><span id='pBrowse'></span>");
	$("#pBrowse").append("<div><a href='"+ pbrowse_link +"'><img id='pbrowse_img' src='" + pbrowse + "'></img></a></div>");
	
	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/domain/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('No domain info retrieved.');
			hide_nav('domains');
		} else {
			$("#domains").append("<div><table id='jaspar-table'><thead><tr><th>Jaspar Class</th><th>Jaspar Family</th></tr></thead><tbody>");
			$.each(data, function(index, obj) {
				$('#jaspar-table').append('<tr><td>'+ obj.class +'</td><td>' + obj.family + '</td></tr>')
			});

			if (data.length > 10) {
				$('#jaspar-table').dataTable();
			}

			$("#domains").append("<hr>");
		} // end else
	})
	.always(function() { refresh_scrollspy(); });
}

function load_regulators(query,feat_title) {
	
	var query = query;
	var display = feat_title;

	var cit_link = "http://yeastgenome.org/cgi-bin/reference/reference.pl?pubmed=";
	var gene_link = 'http://yeastgenome.org/cgi-bin/locus.fpl?locus=';

	$.getJSON('http://sgd-dev-2.stanford.edu:5000/regulation/regulator/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('no regulators returned');
		} else {
			$('#regulators').append("<h2>Regulators of " + display + " (<span id='num-regs'></span> total)</h2>");

			$('#num-regs').append(data.length);
		
			$("#regulators").append("<table id='regulator-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>References</th><th>Source</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {
				$('#regulator-table').append('<tr><td><a href=\''+gene_link + obj.dbid +'\'>' + obj.feature_name +'</a></td><td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td>' +obj.citation + '; PMID:<a href=\'' + cit_link + obj.pmid + '\'>' + obj.pmid + '</a></td><td>' + obj.source + '</td></tr>')
			});

			if (data.length > 10) {
				$('#regulator-table').dataTable();
			}
		
			$('#regulators-li').removeClass('hide');
		} // end else
	})
	.always(function() { refresh_scrollspy(); });
}

