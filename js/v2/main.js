'use strict';

function executionError(vc, va, vl) {
	dataLayer.push({
		'event':'VirtualEvent',
		'virtualECategory':vc,
		'virtualEAction' : va,
		'virtualELabel' : vl,
		'virtualEValue' : 0
	});

	$('#drop_zone-inner').html('<i class="material-icons">error</i> <br>Something went wrong :(<br>' + vl);
}

$(document).ready(function (){
	gsdk.initPopovers();

	$('.ttip-focus').tooltip({
    	placement: "top",
    	trigger: "focus",
    	html: true
    }); 

	// Modal initializer
	$('.modalTriggers').click(function () {
		$('#mainModalImg').attr('src', '/static/img/screens/' + this.id + '.png');
	});

	// Validate LDAP
	function ldap_valid() {
		return new RegExp(/[A-Z0-9._%+-]+/, "i").test($('#ldap').val());
	}

	// Setup the dnd listeners.
	var dropZone = $('#drop_zone');
	$(window).on('dragover', function (evt) { handleDragOver(evt); });

	$(window).on('drop', function (evt) { handleFileSelect(evt); });

	$(document).on('dragenter', '#drop_zone', function (evt) {
		$('#drop_zone').removeClass('dz-inactive');
		$('#drop_zone').addClass('dz-hover');
		$('#drop_zone-inner').html('Go for it');
	});

	$(document).on('dragleave', '#drop_zone', function (evt) {
		$('#drop_zone').removeClass('dz-hover');
		$('#drop_zone').addClass('dz-inactive');
		$('#drop_zone-inner').html('Drop all four files simultaneously here');
	});

	function handleDragOver(evt) {
  		evt.stopPropagation();
  		evt.preventDefault();
  		evt.originalEvent.dataTransfer.dropEffect = 'copy';
	}

	function handleFileSelect(evt) {
  		evt.stopPropagation();
  		evt.preventDefault();

  		//GTM Upload Started
  		dataLayer.push({
			'event':'VirtualPageview',
			'virtualPageURL':'upload_started',
			'virtualPageTitle' : 'Upload Started'
		});
    
  		var files = evt.originalEvent.dataTransfer.files; // FileList object.

  		if (files.length != 4) {
  			dataLayer.push({
				'event':'VirtualEvent',
				'virtualECategory':'Minor Exception',
				'virtualEAction' : 'Received ' + files.length + ' reports',
				'virtualELabel' : 'Wrong number of reports',
				'virtualEValue' : 0
			});

    		$('#drop_zone-inner').html('Did you drag all four files at once? <br> Seems like we received ' + files.length.toString() + ' file' + (files.length>1?'s':'') + ' instead of 4');
    		return;
    	}

  		// Load Data
  		for (var i = 0, f; f = files[i]; i++) {

  			var allowedFiles = ['application/vnd.ms-excel',
  								'text/plain',
  								'text/csv',
  								'text/tsv',
  								'',
  								' '];

    		if (allowedFiles.indexOf(f.type) < 0) {
    			dataLayer.push({
					'event':'VirtualEvent',
					'virtualECategory':'Minor Exception',
					'virtualEAction' : f.type,
					'virtualELabel' : 'Wrong format',
					'virtualEValue' : 0
				});

    			$('#drop_zone-inner').html('Seems your files are not in CSV format (Standard output from Google Ads), but instead are ' + f.type + 'format.');
    		  	return;
    		}

    		var reader = new FileReader();

		    reader.onloadend = function(theFile) {
		      	if (theFile.target.readyState == FileReader.DONE) {
		        	var csvData = readCsv(theFile.target.result.slice(0, theFile.target.result.length-1));
		        	var reportType = determineReportType(csvData);
		
		        	language = determineLanguage(csvData);
		        	headerRow = determineHeaderRow(csvData, reportType);
		
		        	csvData = csvData.slice(0,headerRow).concat(languageAdjustment(csvData.slice(headerRow), language));

		        	if (data[reportType + ' Clicks']) {
		         		if(isClickInteraction(csvData, 
		            		data[reportType + ' Clicks'].header
		            		  .concat([['']])
		            		  .concat(data[reportType + ' Clicks'].body), reportType)) {
		            			data[reportType + ' Impressions'] = data[reportType + ' Clicks'];
		            			data[reportType + ' Clicks'] = { 
		            				header: csvData.slice(0,headerRow-1), 
                                    body: csvData.slice(headerRow)
                                };
        	  				}
        				else {
          					data[reportType + ' Impressions'] = { 
          						header: csvData.slice(0,headerRow-1), 
                                body: csvData.slice(headerRow)
                            };
          				}
        			}
        			
        			else {
        				data[reportType + ' Clicks'] = { header: csvData.slice(0,headerRow-1), body: csvData.slice(headerRow)};
        			}
      			}
    		}
    		reader.readAsText(f); // Check if still used??!
  		}
    	// Load Data End

  		function waitForElement() {
  			// typeof data['Device Paths Clicks'] !== "undefined"
    		if (Object.keys(data).length == 4) {
    			// GTM - Upload Successful
    			dataLayer.push({
					'event':'VirtualPageview',
					'virtualPageURL':'upload_success',
					'virtualPageTitle' : 'Upload Successful'
				});

      			calculateBasics();
      			updateNumbers();
      			$('#drop_zone-inner').html('<i class="material-icons">done</i> <br><span id="create_report">Click <u>here</u> to create Report! </span><br>');
    		}
    		else {
        		setTimeout(function() {
            		waitForElement();
        		},250);
    		}
  		}

  		waitForElement();
	}

	// Division form validation
	$(".input-control").focusout(function() {
		if ($(this).val().length > 0 && (this.id=='division' || ldap_valid())) {
			$(this).parent().addClass("has-success");
			$(this).parent().removeClass("has-error");
		}
		else { 
			$(this).parent().addClass("has-error");
			$(this).parent().addClass("has-feedback");
			$(this).parent().removeClass("has-success");
		}
	});

	// Step 1 done
	$("#step1_done").click(function() {

		if ($('.input-control').val().length > -1 && ldap_valid()) {
			$("#step2_button_top").trigger('click');
			
			snackbar("Don't worry - this will only take 2 minutes");

			$(".lastStepPlaceholder").hide();
	      	$(".lastStepRow").show();
		}

		else {
			snackbar("Please enter division and LDAP to continue");
		}
	});

	// Step 2 done
	$("#step2_done").click(function() {
		$("#step3_button_top").trigger('click');
	});

	// Restart form when done
	$("#restart_form").click(function() {
		$("#division").val('');
		$("#restart_form").hide();
		$("#step1_button_top").trigger('click');
		$(".not_class").hide();
	});

	$(document).on('click', '#create_report', function() {
		// GTM - Report Requested
		dataLayer.push({
			'event':'VirtualPageview',
			'virtualPageURL':'report_requested',
			'virtualPageTitle' : 'Report Requested'
		});

		checkAuth();
		$('#drop_zone').removeClass('dz-inactive');
		$('#drop_zone').addClass('dz-hover');

		$('#drop_zone-inner').html('<i class="material-icons rotating">loop</i> <br>Creating report - <b>DO NOT</b> close this window! <br> <span id="current_status"></span>');
		
		logInfo();
	});

	function snackbar(msg) {
		$('#snackbar').html(msg);
		$('#snackbar').addClass('show');
		setTimeout(function(){ $('#snackbar').removeClass('show'); }, 5000);
	}
});

