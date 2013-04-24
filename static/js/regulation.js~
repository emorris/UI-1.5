$(document).ready ( function() {

	 console.log('query: ' + display_name);

	load_summary(dbid); 
	load_domains(dbid, protein_name);
	load_bind_logo(dbid, protein_name);
	load_bind_sites(dbid, protein_name);	
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
	
					var citArray = obj.citation.split(") ");
					citArray[0] = '<a href=' + ref_url + '>' + citArray[0] + ')</a>';
					
	        	 		 $("#ref-list").append("<div class='citation'>" + citArray.join(" ") + "</div>");
				});
	
			} // end if
		 //	$('#refs').append("<hr>");
		} // end else
	refresh_scrollspy(); 
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
				" Binding Site Motifs <span class='pull-right'><small><em> \
				Click on a motif to view <a href='http://yetfasco.ccbr.utoronto.ca'>YeTFaSCo</a> record</small></em></span></h4>");

		//	console.log('data: ' + data);

		$.each(data, function(index, row) {
			var img_name = $.trim(row);

			var filename_array = img_name.split(".");
			var link = filename_array[0].split("_");
				
			var url = 'http://yetfasco.ccbr.utoronto.ca/MotViewLong.php?PME_sys_qf2='+ link[1];

//		//	console.log(row + "* NEW URL: " + url );
		
			$('#binding-site-seq-logos').append('<a href="' + url + '"><img class="yetfasc"  src="/static/imgs/YeTFaSCo_Logos/' + row + '" alt="Binding Site Sequence Logo"></a>');
		});

	
		} // end else
	refresh_scrollspy();
	});
}

//*************** EXPT AND PREDICTED BINDING SITE DATA **************//

function load_bind_sites(query, protein) {
	var feat = query;
	var img_name = 'circos-lg.png';
	var prot = protein;

	var predicted = $.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/predicted_binding_site/'+ feat)
	.done(function(data) {
		console.log('retrieved predicted data');

		if ($.isEmptyObject(data)) { // no predicted binding site data -- check for expt data

			$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/experimental_binding_site/'+ feat)
			.done(function(e_data) {  

			    if($.isPlainObject(e_data)) {  // no expt or pred binding site data

				console.log("No pred or expt binding sites returned");

				hide_nav('predicted-binding-sites');

			    } else {  // only expt data; no pred. binding data
				
		    		$("#binding-sites").append("<div class='spacer'><hr></div>");

				$("#binding-sites").append("<h2>Predicted and Experimental Binding Sites</h2>");
				$("binding-sites").append("<div id='binding-sites-table' class='span5'></div>");
			
			// 	$("#binding-sites").append("<h4>There are " + e_data + " experimentally determined " + protein +" binding sites in the genome.</h4> \
			//	$("#binding-sites").append("<div class='circos span3'><img id='binding-sites-img' src='/static/imgs/circos_sm.png'></div>");
		//	console.log("#: " + data);

		//	var img = $('#binding-sites-img').attr('src');

			//$('#binding-sites-img').replaceWith('<a href="/circos/' + img_name + '" rel="1" class="newWindow"><img src="' + img + '"></a>');

			$("#binding-sites").append("<hr>");
	
			}
		 }); // end getJSON for expt. data

		} else {  // has pred binding site data

			
		    	$("#binding-sites").append("<div class='spacer'><hr></div>");
			
			$("#binding-sites").append("<h2>Predicted and Experimental Binding Sites</h2>");
			$("#binding-sites").append("<div id='binding-sites-table'></div>"); 
//			"<div class='circos span3'><img id='binding-sites-img' src='/static/imgs/circos_sm.png'></div>");

			$("#binding-sites-table").append("<table id='bind-sites-table'><thead>" +
				"<tr><th>***fake data**</th><th>Experimental</th><th>Predicted</th></tr></thead><tbody");
	// <th># Intergenic Sites</th><th># Intragenic Sites</th><th>p-value</th></tr></thead><tbody>");

			tableData = {};
			tableData['intragenic'] = [];
			tableData['intergenic'] = [];
			tableData['pval'] = [];

			$.each(data, function(index, obj) {

			//	console.log(index + ': from yeastmine: ' + obj);
		
				tableData['intragenic'].push(obj.intragenic);
				tableData['intergenic'].push(obj.intergenic);	
				tableData['pval'].push(obj.pvalue);
			});

		//	console.log("table data: "+ tableData['intergenic']);
		//	console.log("data: "+ tableData['intragenic']);
console.log("data: "+ tableData['pval']);

			for (var key in tableData) {
			//	console.log('key: ' + key);

				$("#bind-sites-table").append("<tr id='" + key + "-row'><td>" + key +"</td>");

				$.each(tableData[key], function(inner_i, item) { 
					if (inner_i > 1) {
						return;  
					}
				//	console.log(inner_i +" val:" + item);
					$("#"+key+"-row").append("<td>" + item + "</td>");
				});
			};

	//		var img = $('#binding-sites-img').attr('src');

		//	$('#binding-sites-img').replaceWith('<a href="/circos/' + img_name + '" rel="1" class="newWindow"><img src="' + img + '"></a>');	
			$('#binding-sites').append("<div class='spacer'></div>");

			if (data.length > 10) {
				custom_dataTable_obj('bind-sites-table');
			}

			//********** expt tf binding data ************//

			$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/experimental_binding_site/'+ feat)
			.done(function(e_data) {  

			    if($.isPlainObject(e_data)) {  // no expt or pred binding site data

				console.log("No expt binding sites returned, only pred. info");

			    } else {  // append expt data after pred. binding data
		
				$("#binding-sites").append("<h4 class='span9'>There are " + e_data + 
				" experimentally determined " + protein +" binding sites in the genome.</h4>");
	
		       	   }// end else 


			}); // end get expt data

		} // end else

		refresh_scrollspy(); 
	}); 
	
} // end load_bind_sites


function load_expt_bind_sites(query, protein) {

	var query = query;
	var img_name = 'circos-lg.png';
	var protein = protein;
	
	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/experimental_binding_site/'+ query)
	.done(function(data) { 
		if ($.isPlainObject(data)) {
			console.log("No expt binding data");
			hide_nav('expt-binding-sites');
		} else {
			$("#expt-binding-sites").append("<h2>Summary of Experimentally Determined " + protein + " Binding Sites</h2> \
			<p>There are " + data + " experimentally determined " + protein +" binding sites in the genome.</p> \
			<div class='circos'><img id='expt-img' src='/static/imgs/circos_sm.png'></div>");
		//	console.log("#: " + data);

			var img = $('#expt-img').attr('src');

			$('#expt-img').replaceWith('<a href="/circos/' + img_name + '" rel="1" class="newWindow"><img src="' + img + '"></a>');

			$("#expt-binding-sites").append("<hr>");
		} // end else
	refresh_scrollspy();
	});
} // end expt_bind_sites


//************** REGULATORY TARGETS *****************//

function load_reg_targets(query, protein) {
	
	var feat = query;
	var prot_name = protein;

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

			});
			
		} // end else
			

		if (data.length > 10) {
			custom_dataTable_obj('regulatory-targets-table');
		}

		load_go_processes(dbid, prot_name, data.length);

		$(".num-targets").append(data.length);

		refresh_scrollspy();

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
			hide_nav('shared-GO-processes');
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
			}

			//$("#shared-GO-processes").append("<div class='spacer'></div><hr>");

		} // end else
	refresh_scrollspy();
	});

} // end go_processes


// ******* LOAD DOMAIN SECTION ******//

function load_domains(feat_name, protein) {
	var query = feat_name;
	var protein = protein;

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

			$("#domains").append("<h2>"+protein+ " Domains and Motifs (# residues total)</h2>" +
				"<div><table id='domain-table'><thead><tr><th>Protein coordinates</th><th>Accession Id</th><th>Description</th><th>Source</th></tr></thead><tbody>");
			$.each(data, function(index, obj) {
				$('#jaspar-table').append('<tr><td>'+ obj.coord +'</td><td>' + obj.accession + '</td><td>' + obj.description + '</td><td>' + obj.source + '</td></tr>')
			});

			if (data.length > 10) {
				custom_dataTable_obj('domain-table');
			}

		} // end else
	refresh_scrollspy();
	});
}

function load_regulators(query,feat_title) {
	
	var query = query;
	var display = feat_title;

	$.getJSON('http://sgd-dev-2.stanford.edu/yeastmine_backend/regulation/regulator/' + query)
	.done(function(data) {
		if ($.isEmptyObject(data)) {
			console.log('no regulators returned');
		} else {
			$('#regulators').append("<div class='spacer'><hr></spacer>");
			$('#regulators').append("<h2>Regulators of " + display + " (<span id='num-regs'></span> total)</h2>");

			$('#num-regs').append(data.length);
		
			$("#regulators").append("<table id='regulator-table'><thead><tr><th>Systematic name</th><th>Gene name</th><th>Evidence</th><th>References</th><th>Source</th></tr></thead><tbody>");

			$.each(data, function(index, obj) {
				$('#regulator-table').append('<tr><td><a href=\''+ feat_url + obj.dbid +'\'>' + obj.feature_name +'</a></td><td>' + obj.gene_name + '</td><td>' + obj.evidence + '</td><td><a href=\'' + ref_url + obj.pmid + '\'>' + obj.citation + '</a></td><td>' + obj.source + '</td></tr>')
			});

			if (data.length > 10) {
				custom_dataTable_obj('regulator-table');
			}
		
			$('#regulators-li').removeClass('hide');
		} // end else

		refresh_scrollspy();
	});
}

