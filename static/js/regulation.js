 $(document).ready ( function() {

	 //	 console.log('query: ' + display_name);
	 //	 console.log('dbid: ' + dbid);

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
$('#binding-site-seq-logos').append("<h2>" + prot_name + " Binding Site Motifs</h2>");
	$.getJSON(web_services_url +'regulation/logos/'+query)
	.done(function(data) {
			if ($.isEmptyObject(data)) {
		//	//	console.log("Empty logo obj");
		//		hide_nav('binding-site-seq-logos');
			    $('#binding-site-seq-logos').append("<div><h5>No Binding site logos available.</h5></div>");

			} else {

			    $('#binding-site-seq-logos').append("<div><em> \
	Click on a motif to view <a href='http://yetfasco.ccbr.utoronto.ca' target='_blank'>YeTFaSCo</a> record</em></div>");
	        
		$.each(data, function(index, row) {
			var img_name = $.trim(row);

			var filename_array = img_name.split(".");
			var link = filename_array[0].split("_");
				
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotViewLong.php?PME_sys_qf2='+ link[1];

//		//	console.log(row + "* NEW URL: " + url );
		
			$('#binding-site-seq-logos').append('<a href="' + url + '" target="blank"><img class="yetfasco"  src="/regulation/static//imgs/YeTFaSCo_Logos/' + row + '" alt="Binding Site Sequence Logo"></a>');
		});
		
		$('#binding-site-seq-logos').append("<div id='expt-binding-sites'></div>");

	
		$('span#binding-sites-nav').replaceWith("<li id='binding-site-seq-logos-li'><a href='#binding-site-seq-logos'>Binding Site Motifs</a></li>");
	       } // end else

			//   console.log("check gbrowse: ");
			//   $.get(gbrowse_url + display_name + "_*&enable=SGD PMW motifs")
			//	   .always(function(data) {
			//		   var page_title = data;
	   
			//		  $.each(data, function(key, value) {
			//			  console.log("checking gbrowse: " + key + ":" + value);
			//	           })
	   
		       //  var has_gbrowse = _check_gbrowse(display_name);
	       
		       // console.log("has: ");

		       //if (_check_gbrowse(display_name) == 1) {
		
		    $("#expt-binding-sites").append("<h4>View predicted binding sites in the <a href='" + gbrowse_url + display_name + "_*&enable=SGD PMW motifs' target='_blank'>Genome Browser</a>.</h4>");
		    //      	}
		    //	   });

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
			target_table_params = dataTable_params;
			var table_name = "_Regulatory_targets";
			target_table_params.oTableTools.aButtons = ["copy",
								    {"sExtends": "csv",
								     "sTitle": file + table_name},
								    {"sExtends": "pdf",
								     "sTitle": file + table_name + ".pdf"},
								    "print",];
			target_table_params.oLanguage.sEmptyTable = 'No regulatory targets found';

		   
			if (num_targets > 10) {
	
			    target_table_params.bPaginate = "false"; 

			} else {

			    target_table_params.sPaginationType = "bootstrap";
			}
			
			target_table_params.aoColumns = [null, null, null, null, null];		   
			target_table_params.sAjaxSource= web_services_url + 'regulation/target/' + query; 

			targetTable = $('#regulatory-targets-table').dataTable(target_table_params);
	
		       	refresh_scrollspy();
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

		go_table_params = dataTable_params;
	
		var table_name = "_shared_GO_processes";		
		go_table_params.oTableTools.aButtons = ["copy",
	       						    {"sExtends": "csv",
	       						     "sTitle": file + table_name},
	       						    {"sExtends": "pdf",
		       					     "sTitle": file + table_name + ".pdf"},
		       					    "print",];
		
		// console.log("go: "+ go_table_params.sDom);
		go_table_params.oLanguage.sEmptyTable = 'No significant shared GO processes found';
		go_table_params.sPaginationType = "bootstrap";
		go_table_params.aoColumns = [null, {"sWidth":"20%", "sType": "scientific"},{"sWidth": "15%"}];		   
		go_table_params.sAjaxSource = web_services_url + 'regulation/shared_go_process/' + feat;
		// console.log("go2: "+ go_table_params.sAjaxSource);

	goTable = $('#GO-table').dataTable(go_table_params);

		refresh_scrollspy();

	} else {
	    	hide_nav('shared-GO-processes');
		refresh_scrollspy();
	}

	});

} // end go_processes


// ******* LOAD DOMAIN SECTION ******//


function load_domains(feat_name, protein) {
	var query = feat_name;
	var protein = protein;
	var jaspar = new Object();


	//	console.log('trying to load domains');

	$.getJSON(web_services_url + 'regulation/domain/' + query)
	.done(function(domain_data) {

		if ($.isEmptyObject(domain_data)) {
			console.log('No domain info retrieved.');
			hide_nav('domains');
		       	refresh_scrollspy();
		} else {

		    //			console.log('retrieved domain info');
	
			$("#domains").append("<hr>");

			$("#domains").append("<h2>"+protein+ " Domains and Motifs (" + domain_data.aaData.length + " total)</h2>" +
				"<div><table id='domain-table'><thead><tr><th>Protein coordinates</th><th>Accession ID</th><th>Description</th><th>Source</th></tr></thead><tbody>");

			
			var domain_table_params = new Object();
			domain_table_params = dataTable_params;

		       	var table_name = "_Domains_motifs";
			domain_table_params.oTableTools.aButtons = ["copy",
								    {"sExtends": "csv",
								     "sTitle": file + table_name},
								    {"sExtends": "pdf",
								     "sTitle": file + table_name + ".pdf"},
								    "print",];
		

			domain_table_params.oLanguage.sEmptyTable = 'No domains and motifs found';

			if (domain_data.aaData.length > 10) {
			    domain_table_params.sPaginationType = 'bootstrap';
	
			} else {

			    domain_table_params.bPaginate = 'false';
			}

			domain_table_params.bAutoWidth = false;
			domain_table_params.aoColumns = [
				{"sWidth":"10%", "sType":"numeric"}, null, null, null
				];
			
			domain_table_params.sAjaxSource= web_services_url +'regulation/domain/' + query; 

			domainTable = $('#domain-table').dataTable(domain_table_params);
			
			$("#domains").append("<div class='spacer'></div>");

			refresh_scrollspy();	
		} // end else

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
		reg_table_params = dataTable_params;

		var table_name = "_Regulators";		
		reg_table_params.oTableTools.aButtons = ["copy",
	       						    {"sExtends": "csv",
	       						     "sTitle": file + table_name},
	       						    {"sExtends": "pdf",
		       					     "sTitle": file + table_name + ".pdf"},
		       					    "print",];

		reg_table_params.oLanguage.sEmptyTable = 'No regulators found';

		if (num_regulators > 10) {

		    reg_table_params.sPaginationType = 'bootstrap';

		} else {

			reg_table_params.bPaginate = 'false';
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

