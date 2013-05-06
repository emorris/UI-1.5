 $(document).ready ( function() {

	 console.log('query: ' + display_name);

	load_summary(dbid); 
	load_domains(dbid, protein_name);
	load_bind_logo(dbid, protein_name);
	load_reg_targets(dbid, protein_name);
	load_regulators(dbid, title_name);


 $('#page-nav').affix({
	offset:$('#page-nav').position()
});


}); // end document ready

num_reg_targets = "";   // number to be defined in load_reg_targets process

//********** LOAD SUMMARY AND REFS **********************//

function load_summary(query) {
	var query = query;

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/summary/'+query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log("Empty object");
			hide_nav('summary');
			hide_nav('refs');
			refresh_scrollspy();
		} else {

			if (data.publication.length > 0) {
	   
				var sum = data.summary;
		    	    	var refs = []; 
			
				$('#summary').append("<div id='paragraph'><p>"+ sum + "</p></div>");
				$('#refs').append("<h3>References</h3><div id='ref-list'></div>");
	
		    	 	$.each(data.publication, function(index, obj) {
					var num = index + 1;
					var cit_i = obj.citation.indexOf(')');
	
					var citArray = [obj.citation.slice(0, cit_i), obj.citation.slice(cit_i + 1)];

					citArray[0] = '<a href=' + ref_url + obj.pmid + '>' + citArray[0] + ')</a>';
					
	        	 		 $("#ref-list").append("<div class='citation'>" + citArray.join("") + "</div>");
				});
	
			} // end if

		$('span#summary-nav').replaceWith("<li id='summary-li'><a href='#summary'>Summary</a></li>");
		refresh_scrollspy(); 
		} // end else
	});
}

//************ LOAD BINDING SITE MOTIFS  ***************//

function load_bind_logo(query, protein) {
	var query = query;

	var prot_name = protein;
		
	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/logos/'+query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
		//	console.log("Empty logo obj");
			hide_nav('binding-site-seq-logos');

		} else {
			$('#binding-site-seq-logos').append("<hr>");

			$('#binding-site-seq-logos').append("<h2>" + prot_name + 
				" Binding Site Motifs</h2><div><em> \
				Click on a motif to view <a href='http://yetfasco.ccbr.utoronto.ca'>YeTFaSCo</a> record</em></div>");

		//	console.log('data: ' + data);

		$.each(data, function(index, row) {
			var img_name = $.trim(row);

			var filename_array = img_name.split(".");
			var link = filename_array[0].split("_");
				
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotViewLong.php?PME_sys_qf2='+ link[1];

//		//	console.log(row + "* NEW URL: " + url );
		
			$('#binding-site-seq-logos').append('<a href="' + url + '"><img class="yetfasco"  src="/static/imgs/YeTFaSCo_Logos/' + row + '" alt="Binding Site Sequence Logo"></a>');
		});
		
		$('#binding-site-seq-logos').append("<div id='expt-binding-sites'></div>");
		
		$("#expt-binding-sites").append("<h4>View binding sites in <a href='" + gbrowse_url + "'>GBrowse</a>.</h4>");

	//	load_expt_bind_sites(query, prot_name);

		$('span#binding-sites-nav').replaceWith("<li id='binding-site-seq-logos-li'><a href='#binding-site-seq-logos'>Binding Site Motifs</a></li>");
	
		} // end else
	refresh_scrollspy();
	});
}

function load_expt_bind_sites(query, protein) {

	var query = query;
	var img_name = 'circos-lg.png';
	var protein = protein;

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/experimental_binding_site/'+ query)
	.done(function(data) { 
		if ($.isPlainObject(data)) {
			console.log("No expt binding data");
	
		} else {

			$("#expt-binding-sites").append("<h4>There are <a href='"+ gbrowse_url + "'>" + data + "</a> experimentally determined " + protein +" binding sites in the genome. View in <a href='" + gbrowse_url + "'>GBrowse.</a></h4>");

		} // end else
	refresh_scrollspy();
	});
} // end expt_bind_sites


//************** REGULATORY TARGETS *****************//

function load_reg_targets(query, protein) {
	
	var feat = query;
	var prot_name = protein;
	var num_genes = new Object();

//	console.log('# genes?' + Object.keys(num_genes).length);

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/target/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {

			console.log('No regulatory targets loaded');
			hide_nav('regulatory-targets');
		} else {
			$("#regulatory-targets").append("<div class='spacer'></div><hr>");

			$("#regulatory-targets").append("<h2>"+ prot_name + " Regulatory Targets (<span class='num-targets'></span> total)</h2>");
	
			$("#regulatory-targets").append("<table id='regulatory-targets-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>Reference</th><th>Source</th></tr></thead><tbody>");
		
			$.each(data, function(index, obj) {
				$('#regulatory-targets-table').append('<tr><td><a href=\''+feat_url + obj.dbid + '\'>'+ obj.feature_name+'</a></td> \
				<td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td><a href=\''+ ref_url + obj.pmid +'\'>'+ obj.citation + '</a></td><td>'+ obj.source + '</td></tr>');

				if (num_genes.hasOwnProperty(obj.feature_name)) {
					num_genes[obj.feature_name] = num_genes[obj.feature_name] + 1;
				} else {
					num_genes[obj.feature_name] = 1;
				}
			});

		if (data.length > 10) {
			custom_dataTable_obj('regulatory-targets-table');
		} else {
			no_pagination_dataTable_obj('regulatory-targets-table');
		}

		load_go_processes(dbid, prot_name, Object.keys(num_genes).length);

		$(".num-targets").append(Object.keys(num_genes).length);

		$("span#targets-nav").replaceWith("<li id='regulatory-targets-li'><a href='#regulatory-targets'>Targets</a></li>");

		refresh_scrollspy();

		} // end else
			
	}); // end done function

} // end load_reg_targets


//************** GO PROCESSES **************//

function load_go_processes(query, protein, num_regs) {

	var feat = query;
	var protein = protein;
	var regs = num_regs;

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/shared_go_process/' + feat)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('No GO processes returned');
		//	hide_nav('shared-GO-processes');
		} else {
			$("#shared-GO-processes").append("<div class='spacer'><hr></div>");
			$("#shared-GO-processes").append("<h2>Shared GO Processes Among " + protein + " Regulatory Targets (" + num_regs +" total)</h2>");	
			$("#shared-GO-processes").append("<table id='GO-table'><thead><tr><th>GO Term</th><th>P-value</th><th>Number of genes</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {	
				var goArray = obj.goid.split(":");			

				$('#GO-table').append('<tr><td><a href=\'' + go_url + goArray[1] + '\'>'+ obj.go_term +'</a></td><td>' + obj.pvalue + '</td><td>' + obj.matches + '</td></tr>')
			});
		
			if (data.length > 10) {
				custom_dataTable_obj('GO-table');
				//sci_not_sort_dataTable('GO-table', [2]);
			}  else {
				no_pagination_dataTable_obj('GO-table');
			}

			//$("#shared-GO-processes").append("<div class='spacer'></div><hr>");

			$("span#GO-nav").replaceWith("<li id='shared-GO-processes-li'><a href='#shared-GO-processes'>Shared GO Processes</a></li>");

		} // end else
	refresh_scrollspy();
	});

} // end go_processes


// ******* LOAD DOMAIN SECTION ******//


function load_domains(feat_name, protein) {
	var query = feat_name;
	var protein = protein;
	var jaspar = new Object();

	console.log('trying to load domains');

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/domain/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('No domain info retrieved.');
			hide_nav('domains');
		} else {

			console.log('retrieved domain info');
			// var num_residues = $.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend

			$("#domains").append("<hr>");

			$("#domains").append("<h2>"+protein+ " Domains and Motifs (" + data.length + " total)</h2>" +
				"<div><table id='domain-table'><thead><tr><th>Protein coordinates</th><th>Accession ID</th><th>Description</th><th>Source</th></tr></thead><tbody>");
			$.each(data, function(index, obj) {
		
				var domain_url_obj = domain_mapping_obj[obj.source];
				var domainID = obj.domain_name;
			
				if (obj.source.match('JASPAR')) {
					jaspar.domain_name = obj.domain_name;
					jaspar.description = obj.description;
					jaspar.url = domain_url_obj.url;
					jaspar.database = domain_url_obj.database;
					
		
				} else {
					if (obj.source.match('Gene3D')) {
						domainID = domainID.replace('G3DSA:', '');
 				
					}
		
					url = domain_url_obj.url + domainID; 
						
					$('#domain-table').append('<tr><td>'+ obj.start_coord + '-' + obj.stop_coord +'</td><td><a href=\''+ url + '\'>' + obj.domain_name + '</a></td><td>' + obj.description + '</td><td>' + domain_url_obj.database + '</td></tr>')
				}
			}); 
			
			if (Object.keys(jaspar).length > 0) {
	
				$('#domain-table').append('<tr><td></td><td><a href=\'\'>' + jaspar.domain_name + '</a></td><td>' + jaspar.description + '</td><td>JASPAR</td></tr>');
			}

			if (data.length > 10) {
				custom_dataTable_obj('domain-table');
			}  else {
				no_pagination_dataTable_obj('domain-table');
			}
			
			$("#domains-nav").replaceWith("<li id='domains-li'><a href='#domains'>Domains and Motifs</a></li>");

			$("#domains").append("<div class='spacer'></div>");
	//		console.log('data length: '+ data.length);	
	//		$("#num_doms").replaceWith(data.length);

		} // end else
	refresh_scrollspy();
	});
}

function load_regulators(query,feat_title) {
	
	var query = query;
	var display = feat_title;
	var num_genes = new Object();


	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/regulator/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('no regulators returned');
		} else {
			$('#regulators').append("<div class='spacer'><hr></spacer>");
			$('#regulators').append("<h2>Regulators of " + display + " (<span id='num-regs'></span> total)</h2>");

			
			$("#regulators").append("<table id='regulator-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>References</th><th>Source</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {
				$('#regulator-table').append('<tr><td><a href=\''+ feat_url + obj.dbid +'\'>' + obj.feature_name +'</a></td><td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td><a href=\'' + ref_url + obj.pmid + '\'>' + obj.citation + '</a></td><td>' + obj.source + '</td></tr>');

				if (num_genes.hasOwnProperty(obj.feature_name)) {
					num_genes[obj.feature_name] = num_genes[obj.feature_name] + 1;
				} else {
					num_genes[obj.feature_name] = 1;
				}

			});

			if (data.length > 10) {
				custom_dataTable_obj('regulator-table');
			}

			$('#num-regs').append(Object.keys(num_genes).length);
				
			$("span#regulators-nav").replaceWith("<li id='regulators-li'><a href='#regulators'>Regulators</a></li>");
		
	//			$('#regulators-li').removeClass('hide');

		refresh_scrollspy();
		} // end else

		refresh_scrollspy();
	});
}

