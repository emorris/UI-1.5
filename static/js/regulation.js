 $(document).ready ( function() {

	 console.log('query: ' + display_name);

	load_summary(dbid); 
	load_go_processes(dbid, protein_name);
	load_domains(dbid, protein_name);
	load_bind_logo(dbid, protein_name);
	load_reg_targets(dbid, protein_name);
	load_regulators(dbid, title_name);


 $('#page-nav').affix({
	offset:$('#page-nav').position()
});


}); // end document ready


//********** LOAD SUMMARY AND REFS **********************//
function load_summary(query) {
	var query = query;

	$.getJSON(web_services_url + 'regulation/summary/'+query)
	.done(function(sum_data) {
		if ($.isEmptyObject(sum_data)) {
			console.log("Empty object");
			hide_nav('summary');
			hide_nav('refs');
			refresh_scrollspy();
		} else {

			if (sum_data.publication.length > 0) {
	   
				var sum = sum_data.summary;
		    	    	var refs = []; 
			
				$('#summary').append("<div id='paragraph'><p>"+ sum + "</p></div>");
				$('#refs').append("<h3>References</h3><div id='ref-list'></div>");
	
		    	 	$.each(sum_data.publication, function(index, obj) {
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
	
	$('#binding-site-seq-logos').append("<hr>");

	$('#binding-site-seq-logos').append("<h2>" + prot_name + 
	" Binding Site Motifs</h2><div><em> \
	Click on a motif to view <a href='http://yetfasco.ccbr.utoronto.ca'>YeTFaSCo</a> record</em></div>");
		
	$.getJSON(web_services_url +'regulation/logos/'+query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
		//	console.log("Empty logo obj");
			hide_nav('binding-site-seq-logos');

		} else {

		$.each(data, function(index, row) {
			var img_name = $.trim(row);

			var filename_array = img_name.split(".");
			var link = filename_array[0].split("_");
				
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotViewLong.php?PME_sys_qf2='+ link[1];

//		//	console.log(row + "* NEW URL: " + url );
		
			$('#binding-site-seq-logos').append('<a href="' + url + '"><img class="yetfasco"  src="/regulation/static//imgs/YeTFaSCo_Logos/' + row + '" alt="Binding Site Sequence Logo"></a>');
		});
		
		$('#binding-site-seq-logos').append("<div id='expt-binding-sites'></div>");
		
		$("#expt-binding-sites").append("<h4>View binding sites in <a href='" + gbrowse_url + "' target='_blank'>GBrowse</a>.</h4>");

		$('span#binding-sites-nav').replaceWith("<li id='binding-site-seq-logos-li'><a href='#binding-site-seq-logos'>Binding Site Motifs</a></li>");
	
		} // end else
	refresh_scrollspy();
	});
}


//************** REGULATORY TARGETS *****************//

function load_reg_targets(query, protein) {
	
	var feat = query;
	var prot_name = protein;
	var num_genes = new Object();
	 
	// assign number of targets to a variable //

	$.getJSON(web_services_url + 'regulation/target_count/' + feat)
	.done(function(num_targ_data) {  

		num_targets = num_targ_data;

		if (num_targets > 0) {

		// make section //
	
			$("#regulatory-targets").append("<div class='spacer'></div><hr>");

			$("#regulatory-targets").append("<h2>"+ prot_name + " Regulatory Targets (" + num_targets + " total)</h2>");
	
		//CREATE empty datatables

			$("#regulatory-targets").append("<table id='regulatory-targets-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>Reference</th><th>Source</th></tr></thead><tbody>");

			var target_table_params = new Object();
	
			if (num_targets > 10) {
	
				target_table_params = pagination_dT;

			} else {

				target_table_params = no_pagination_dT;
			}
			
			target_table_params.aoColumns = [null, null, null, null, null];		   
			target_table_params.sAjaxSource= web_services_url + 'regulation/target/' + query; 

			targetTable = $('#regulatory-targets-table').dataTable(target_table_params);
	
		
		} else { // end if > 0

		hide_nav('regulatory-targets'); 
		refresh_scrollspy();

		} // end else

	}); // end done function

} // end load_reg_targets


//************** GO PROCESSES **************//

function load_go_processes(query, protein) {

	var feat = query;
	var protein = protein; 
	
	// get number of targets //

	$.getJSON(web_services_url + 'regulation/target_count/' + feat)
	.done(function(count_data) {

	num_targets = count_data; 
 	
	if (num_targets > 0) {
		$("#shared-GO-processes").append("<div class='spacer'><hr></div>");
		$("#shared-GO-processes").append("<h2>Shared GO Processes Among " + protein + " Regulatory Targets (" + num_targets +" total)</h2>");	
		$("#shared-GO-processes").append("<table id='GO-table'><thead><tr><th>GO Term</th><th>P-value</th><th>Number of genes</th></tr></thead><tbody>");

		var go_table_params = new Object();

		go_table_params = pagination_dT;
		go_table_params.aoColumns = [null, {"sWidth":"20%", "sType": "scientific"},{"sWidth": "15%"}];		   
		go_table_params.sAjaxSource = web_services_url + 'regulation/shared_go_process/' + feat;
		goTable = $('#GO-table').dataTable(go_table_params);

	} else {
		hide_nav('shared-GO-processes');
		refresh_scrollspy();
	}

	});

	$.getJSON(web_services_url + 'regulation/shared_go_process/' + feat)
	.done(function(go_data) {

		if ($.isEmptyObject(go_data) || go_data.aaData.length == 0) {

				console.log('No GO processes returned');
				hide_nav('shared-GO-processes');
		}

		refresh_scrollspy();
	});

} // end go_processes


// ******* LOAD DOMAIN SECTION ******//


function load_domains(feat_name, protein) {
	var query = feat_name;
	var protein = protein;
	var jaspar = new Object();

	console.log('trying to load domains');

	$.getJSON(web_services_url + 'regulation/domain/' + query)
	.done(function(domain_data) {

		if ($.isEmptyObject(domain_data)) {
			console.log('No domain info retrieved.');
			hide_nav('domains');
		} else {

			console.log('retrieved domain info');
	
			$("#domains").append("<hr>");

			$("#domains").append("<h2>"+protein+ " Domains and Motifs (" + domain_data.aaData.length + " total)</h2>" +
				"<div><table id='domain-table'><thead><tr><th>Protein coordinates</th><th>Accession ID</th><th>Description</th><th>Source</th></tr></thead><tbody>");

			
			var domain_table_params = new Object();

			if (domain_data.aaData.length > 10) {
				domain_table_params = pagination_dT;
	
			} else {

				domain_table_params = no_pagination_dT;
			}

			domain_table_params.bAutoWidth = false;
			domain_table_params.aoColumns = [
				{"sWidth":"10%", "sType":"numeric"}, null, null, null
				];
			
			domain_table_params.sAjaxSource= web_services_url +'regulation/domain/' + query; 

			domainTable = $('#domain-table').dataTable(domain_table_params);
			
			$("#domains").append("<div class='spacer'></div>");

		} // end else
	refresh_scrollspy();
	});
}

//**************** Regulator section *****************//

function load_regulators(query,feat_title) {
	
	var query = query;
	var display = feat_title;
	var num_genes = new Object();
	$.getJSON(web_services_url + 'regulation/regulator_count/' + query)
	.done(function(data) {
		 num_regulators = data;

		if (num_regulators > 0) {

		$('#regulators').append("<div class='spacer'><hr></spacer>");
		$('#regulators').append("<h2>Regulators of " + display + " (" + num_regulators +" total)</h2>");

			
		$("#regulators").append("<table id='regulator-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>Reference</th><th>Source</th></tr></thead><tbody>");
	var reg_table_params = new Object();

		if (num_regulators > 10) {

			reg_table_params = pagination_dT;

		} else {

			reg_table_params = no_pagination_dT;
		}

		reg_table_params.sAjaxSource= web_services_url + 'regulation/regulator/' + query; 

		reg_table_params.aoColumns = [
				{"sWidth":"10%"}, {"sWidth":"10%"},null, null,{"sWidth":"10%"}
			];
			
		reg_oTable = $('#regulator-table').dataTable(reg_table_params);

		refresh_scrollspy();

	} else {// end if statement;
	
		hide_nav('regulators');
		refresh_scrollspy();
	} 

	});
}

