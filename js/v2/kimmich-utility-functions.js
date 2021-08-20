function asPct(value, digits) {
	return toFixed((value * 100), digits);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Inserts thousand delimiters
function delimInsert(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toFixed( num, precision ) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

function extractCurrency(value) {
	var delim = value.match(/([,.])/g)[value.match(/([,.])/g).length - 1];
	delim = escapeRegExp(delim);

	var newValue = value.replace(new RegExp('[^\\d' + delim + ']', 'g'), '')
	if (delim == '\,') {
		newValue = newValue.replace(',', '.');
	}

	return parseFloat(newValue);
}

function readCsv(input) {
  var objPattern = new RegExp(
    (
      // Delimiters.
      "(\\" + ',' + "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      // Standard fields.
      "([^\"\\" + ',' + "\\r\\n]*))"
    ),
    "gi"
  );

  var arrData = [[]];
  var arrMatches = null;

  while (arrMatches = objPattern.exec(input)) {
    var strMatchedDelimiter = arrMatches[ 1 ];
        
    if (strMatchedDelimiter.length && (strMatchedDelimiter != ',')) {
      arrData.push( [] );
    }
    
    if (arrMatches[ 2 ]) {
      var strMatchedValue = arrMatches[ 2 ].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );
    } else {
      var strMatchedValue = arrMatches[ 3 ];
    }
    arrData[arrData.length - 1 ].push(strMatchedValue);
  }

  return(arrData);
}

function determineReportType(input) {
	var attributionModellingReportConfig = {
		'# compare models': {'lang': 'en', 'enName': 'Attribution Modeling'},
		'# modelle vergleichen': {'lang': 'de', 'enName': 'Attribution Modeling'},
		'# confronta i modelli': {'lang': 'it', 'enName': 'Attribution Modeling'},
		'# comparar modelos': {'lang': 'es', 'enName': 'Attribution Modeling'},
		'# cравнение моделей': {'lang': 'ru', 'enName': 'Attribution Modeling'},
		'# モデルを比較': {'lang': 'ja', 'enName': 'Attribution Modeling'},
		'# modellen vergelijken': {'lang': 'nl', 'enName': 'Attribution Modeling'},
		'': {'lang': 'ar', 'enName': 'Attribution Modeling'},
		'# comparar modelos': {'lang': 'pt', 'enName': 'Attribution Modeling'},
		'# comparer des modèles': {'lang': 'fr', 'enName': 'Attribution Modeling'}
    }

    var topPathsReportConfig = {
		'# top paths': {
            'device path': {'lang': 'en', 'enName': 'Device Paths'},
            'campaign path (clicks)': {'lang': 'en', 'enName': 'Top Paths'},
            'campaign path': {'lang': 'en', 'enName': 'Top Paths'}
        },
		'# wichtigste pfade': {
            'gerätepfad': {'lang': 'de', 'enName': 'Device Paths'},
            'kampagnenpfad (klicks)': {'lang': 'de', 'enName': 'Top Paths'},
            'kampagnenpfad': {'lang': 'de', 'enName': 'Top Paths'}
        },
		'# percorsi più frequenti': {
            'percorsco dispositivo': {'lang': 'it', 'enName': 'Device Paths'},
            'percorso campagna (clic)': {'lang': 'it', 'enName': 'Top Paths'},
            'percorso campagna': {'lang': 'it', 'enName': 'Top Paths'}
        },
		'# rutas principales': { 
            'ruta de dispositivo': {'lang': 'es', 'enName': 'Device Paths'},
            'ruta de campaña (clics)': {'lang': 'es', 'enName': 'Top Paths'},
            'ruta de campaña': {'lang': 'es', 'enName': 'Top Paths'}
        },
		'# Основные последовательности': { 
            'Путь устройства': {'lang': 'ru', 'enName': 'Device Paths'},
            'Путь кампании (клики)': {'lang': 'ru', 'enName': 'Top Paths'},
            'Путь кампании': {'lang': 'ru', 'enName': 'Top Paths'}
        },
		'# コンバージョン経路': {
            'デバイスの経路': {'lang': 'ja', 'enName': 'Device Paths'},
            'キャンペーンの経路（クリック）': {'lang': 'ja', 'enName': 'Top Paths'},
            'キャンペーンの経路': {'lang': 'ja', 'enName': 'Top Paths'}
        },
		'# toppaden': {
            'apparaatpad': {'lang': 'nl', 'enName': 'Device Paths'},
            'campagnepad (klikken)': {'lang': 'nl', 'enName': 'Top Paths'},
            'campagnepad': {'lang': 'nl', 'enName': 'Top Paths'}
        },
		'# أهم المسارات': {
            'Device Paths': {'lang': 'ar', 'enName': 'Device Paths'},
            'Campaign Path (Clicks)': {'lang': 'ar', 'enName': 'Top Paths'}
        },
		'# caminhos mais comuns': {
            'caminho do dispositivo': {'lang': 'pt', 'enName': 'Device Paths'},
            'caminho da campanha (cliques)': {'lang': 'pt', 'enName': 'Top Paths'},
            'caminho da campanha': {'lang': 'pt', 'enName': 'Top Paths'}
        },
    '# chemins les plus fréquents': {
            'path by device': {'lang': 'fr', 'enName': 'Device Paths'},
            'campaign path (clicks)': {'lang': 'fr', 'enName': 'Top Paths'},
            'campaign path': {'lang': 'fr', 'enName': 'Top Paths'}
        }
	}

	if (attributionModellingReportConfig.hasOwnProperty(input[0][0].toLowerCase())) {
		return attributionModellingReportConfig[input[0][0].toLowerCase()];
	} else if (topPathsReportConfig.hasOwnProperty(input[0][0].toLowerCase())) {
        if (topPathsReportConfig[input[0][0].toLowerCase()].hasOwnProperty(input[7][0].toLowerCase())) {
            return topPathsReportConfig[input[0][0].toLowerCase()][input[7][0].toLowerCase()];
        } else {
            console.log('Unrecognized report')
            $('#warnings').html("<div class='row'><div class='col-xs-12'><span class='label label-danger'>Unrecognized report</span></div></div>")
        }
    } else {
		langFlag = true;
		$('#warnings').html("<div class='row'><div class='col-xs-12'><span class='label label-danger'>You either uploaded the wrong reports or one of them is in an unknown language, which cannot be processed</span></div></div>")
		return {'lang': '?', 'enName': '?'}
	}
}

function buildFile(input) {
	var output;
	var type = determineReportType(input).enName;
	var lang = determineReportType(input).lang;

	var sliceRow = 0;
	while (input[sliceRow].length == 1) sliceRow++;
	if (sliceRow == 0) {
		$('#warnings').html("<div class='row'><div class='col-xs-12'><span class='label label-danger'>Your report seems malformed - did you make any edits to the file after downloading?</span></div></div>");
		return '';
	}
	sliceRow += 1;

	if (type == "Attribution Modeling") {
        sliceRow += 1;
		attributionModellingReport = { 
			header: input.slice(0,sliceRow), 
			body: delimAdjustment(input.slice(sliceRow), lang, 2)
		}

		$('#amt-report-icon').removeClass('report-not-uploaded');
      	$('#amt-report-icon').addClass('report-uploaded');
	} else if (type == "Top Paths") {
		topPathsReport = {
			header: input.slice(0,sliceRow),
			body: delimAdjustment(input.slice(sliceRow), lang, 1)
		}

		$('#top-path-report-icon').removeClass('report-not-uploaded');
      	$('#top-path-report-icon').addClass('report-uploaded');
	} else if (type == "Device Paths") {
		devicePathsReport = {
			header: input.slice(0,sliceRow),
			body: devLangAdjustment(delimAdjustment(input.slice(sliceRow), lang, 1), lang)
		}

		$('#device-path-report-icon').removeClass('report-not-uploaded');
      	$('#device-path-report-icon').addClass('report-uploaded');
	}
}

function brief(word, maxlength) {
	if (word.length > maxlength) {
		return word.substring(0, maxlength) + '...';
	} else {
		return word;
	}
}

function delimAdjustment(report, language, strColumns) {
  var lang_nums = {
    'en': [[/,/g, ''], ['', '']],   // Check
    'de': [[/\./g, ''], [/,/g, '.']], // Check
    'es': [[/\./g, ''], [/,/g, '.']], // Check
    'it': [[/\./g, ''], [/,/g, '.']], // Check
    'ru': [[/ /g, ''], [/,/g, '.']], // Check
    'fr': [[/ /g, ''], [/,/g, '.']],  // Check
    'pt': [[/\./g, ''], [/,/g, '.']],  // Check
    'ja': [[/,/g, ''], ['', '']],   // Check
    'nl': [[/\./g, ''], [/,/g, '.']]
    // Arabic
  }[language];

  for (var i = report.length - 1; i >= 0; i--) {
    for (var j = report[i].length - 1; j >= 0; j--) {
      if (j > strColumns - 1) {
        // lang_num - other columns
        report[i][j] = parseFloat(report[i][j].replace(lang_nums[0][0],
                                                       lang_nums[0][1])
                                              .replace(lang_nums[1][0],
                                                       lang_nums[1][1])) || 0;
      }
    }
  }
  return report;
}

function devLangAdjustment(report, language) {
  var lang_text = {
    'en': [/Desktop/g, /Tablet/g, /Mobile/g], 
    'de': [/Desktop-Computer/g, /Tablet/g, /Mobilgerät/g],
    'es': [/Ordenador/g, /Tablet/g, /Móvil/g],
    'it': [/Computer desktop/g, /Tablet/g, /Dispositivo mobile/g],
    'ru': [/Компьютеры/g, /Планшеты/g, /Мобильные устройства/g],
    'fr': [/Ordinateur/g, /Tablette/g, /Mobile/g],
    'pt': [/Computador/g, /Tablet/g, /Celular/g],
    'ja': [/パソコン/g, /タブレット/g, /モバイル/g],
    'nl': [/Desktopcomputer/g, /Tablet/g, /Mobiel/g]
    // Arabic
  }[language];

  for (var i = report.length - 1; i >= 0; i--) {
    for (var j = report[i].length - 1; j >= 0; j--) {
      if (j <= 0) {
        // lang_text - first column
        report[i][0] = report[i][0].replace(lang_text[0], 'Desktop');
        report[i][0] = report[i][0].replace(lang_text[1], 'Tablet');
        report[i][0] = report[i][0].replace(lang_text[2], 'Mobile');
      }
    }
  }
  return report;
}

function validateData() {
	$('#warnings').empty();
	var warnings = [];
	var errors = [];

	// http://getbootstrap.com/components/#alerts
	// ct paper alerts

    warnings.push('As of Jan 31 we are using a new version of qimmiq due to recent Google Ads Frontend changes. Please report any bugs you find - we apologize for any inconveniences.');

	if (!((results.metaData.dateRange.topPathsReport == 
		   results.metaData.dateRange.devicePathsReport) &&
		  (results.metaData.dateRange.attributionModellingReport ==
		   results.metaData.dateRange.devicePathsReport))) {
		console.log('Date Range Flag');
		warnings.push('Date Ranges differ between reports');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Date Range Flag',
          'virtualEValue': 0
        });
	}

	if (topPathsReport.body.length >= 60000) {
		console.log('Report Limit Flag');
		warnings.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.sofk11sq3voa" target="_blank">Top Paths Report seems to have 60k+ rows - some rows may be missing. Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Report Limit Flag',
          'virtualEValue': 0
        });
	}

	if (/Path Length/.test(topPathsReport.header[6][0])) {
		console.log('Path Flag');
		errors.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.qfjry332iljr" target="_blank">Did you select "Any" Path Length in the Top Path Report? Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Path Flag',
          'virtualEValue': 0
        });
	}

	if (!((results.metaData.conversionAction.topPathsReport == 
		   results.metaData.conversionAction.devicePathsReport) &&
		  (results.metaData.conversionAction.attributionModellingReport ==
		   results.metaData.conversionAction.devicePathsReport))) {
		console.log('Conversion Action Flag');
		warnings.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.glha5cyc12cb" target="_blank">Conversion actions differ between reports. Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Conversion Action Flag',
          'virtualEValue': 0
        });
	}

	if (results.totalAMTConversions / results.totalPathConversions > 1.1 || 
		results.totalAMTConversions / results.totalPathConversions < 0.9) {
		console.log('Conversion Equality Flag');	
		warnings.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.c3jnaehalq68" target="_blank">Conversions differ substantially between AMT and Top Path Report. Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Conversion Equality Flag',
          'virtualEValue': 0
        });
	}

	// if (attributionModellingReport.header[attributionModellingReport.header.length-1][0] != topPathsReport.header[topPathsReport.header.length-1][0].match(/^(.*?) /)[1]) {
	// 	console.log('Not the same AMT and Top Path Key');	
	// 	errors.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.dt7e1mbv64s9" target="_blank">Your AMT and Top Path Report use different dimensions (' + results.metaData.keyDimension.topPathsReport + ' and ' + results.metaData.keyDimension.attributionModellingReport + '. Click for more info.</a>)');

	// 	dataLayer.push({
 //          'event':'VirtualEvent',
 //          'virtualECategory': 'kimmich-warnings',
 //          'virtualEAction': 'displayed',
 //          'virtualELabel': 'Not the same AMT and Top Path Key',
 //          'virtualEValue': 0
 //        });
	// }

	if (results.touchpointAnalysis.oneTp == 0) {
		console.log('No single touchpoint conversions');	
		warnings.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.7wov40dumck6" target="_blank">There are no paths with only one touchpoint - does your advertiser use > in their campaign names? Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'No single touchpoint conversions',
          'virtualEValue': 0
        });
	}

	if (attributionModellingReport.body[0].length > 8) {
		console.log('Too many columns in AMT');	
		errors.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.7vxbnox866le" target="_blank">It appears you have selected multiple dimensions in the Attribution Modelling Report - we currently only accept one. Click for more infos</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Too many columns in AMT',
          'virtualEValue': 0
        });
	}

	if (gtFlag) {
		console.log('> in Campaign names');	
		errors.push('<a href="https://docs.google.com/document/d/1a2tRHO5tJJY3Wk7CBFTi0OnDkLgWfYxToHq6CMSl0WI/edit#bookmark=id.n6ojmykvfo9d" target="_blank">It appears your campaign names include > symbols, thus making it impossible to understand paths.  Click for more info.</a>');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': '> in Campaign names',
          'virtualEValue': 0
        });
	}

	if (determineReportType(topPathsReport.header).lang == '?' || 
		determineReportType(attributionModellingReport.header).lang == '?' ||
		determineReportType(devicePathsReport.header).lang == '?') {
		errors.push("One of your reports is in an unknown language, which cannot be processed")

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'One of your reports is in an unknown language, which cannot be processed',
          'virtualEValue': 0
        });
	} else if (determineReportType(topPathsReport.header).lang != 'en' || 
		determineReportType(attributionModellingReport.header).lang != 'en' ||
		determineReportType(devicePathsReport.header).lang != 'en') {
		warnings.push("One of your reports is not in English, which could lead to problems")

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'One of your reports is not in English, which could lead to problems',
          'virtualEValue': 0
        });
	}

	if (results.metaData.modelsToCompare.before != 'Last Click' && results.metaData.modelsToCompare.after != 'Last Click') {
		console.log('Not using Last click as previous model');	
		warnings.push('Your AMT report doesn\'t use Last click in the comparison, so the story will not necessarily make sense)');

		dataLayer.push({
          'event':'VirtualEvent',
          'virtualECategory': 'kimmich-warnings',
          'virtualEAction': 'displayed',
          'virtualELabel': 'Not using Last click as previous model',
          'virtualEValue': 0
        });
	}

	if (errors) {
		for (var i = errors.length - 1; i >= 0; i--) {
			$('#warnings').append("<div class='row'><div class='col-xs-12'><span class='label label-danger'>" + errors[i] + "</span></div></div>")
		}	
	}

	if (warnings) {
		for (var i = warnings.length - 1; i >= 0; i--) {
			$('#warnings').append("<div class='row'><div class='col-xs-12'><span class='label label-warning'>" + warnings[i] + "</span></div></div>")
		}	
	}

	$(".collapse").collapse('hide');
}