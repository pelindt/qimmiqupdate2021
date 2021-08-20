function calculations() {
	if (topPathsReport && attributionModellingReport && devicePathsReport && brandGetter()) {
		var brandName = brandGetter();
		results.advertiserName = $('#division').val();
		results.brandTerms = $('#brandterm').val();
		metaData();
		todaysDate();

		var campaignObj = createCampaignObj(topPathsReport.body);
	
		campaignFunnels(campaignObj); // 1

		deviceTouchpoints(devicePathsReport.body); //3
		creditUnderLastClick(topPathsReport.body); // 8
		funnelSlide(campaignObj, topPathsReport.body);

		brandTouchpoints(topPathsReport.body, brandName); // 5
		brandRatios(results.brandTouchpoints); // 1
		//genericBeforeBrand(topPathsReport.body, brandName); // 1
		amtAnalysis(attributionModellingReport.body, campaignObj, brandName); // 3
		creditForModel(results.metaData);
		campaignClassification(campaignObj, brandName);
	
		if (results.shiftToGenericRatio >= 5) {
			results.genericGain = '(eg. Generics gain ' + results.shiftToGenericRatio + '%)'
		} else {
			results.genericGain = ''
		}

		validateData();
		brandValidator();
	}
}

function brandGetter () {
	var brandName;
	var cs = $('#case_sensitive').is(':checked') ? 'g' : 'gi';
	if ($('#regex').is(':checked')) {
		brandName = new RegExp($('#brandterm').val(), cs);
	} else {
		brandName = escapeRegExp($('#brandterm').val());
		brandName = new RegExp(brandName.replace(/\s*,\s*/, '|', 'g'), cs);
	}

	return brandName
}

function translate(term) {
	var headerInfoTrans = {
		'Date Range': {'lang': 'en', 'enLang': 'Date Range'},
		'Periode': {'lang': 'nl', 'enLang': 'Date Range'},
		'Zeitraum': {'lang': 'de', 'enLang': 'Date Range'},
		'Intervallo di date': {'lang': 'it', 'enLang': 'Date Range'},
		'Periodo': {'lang': 'es', 'enLang': 'Date Range'},
		'期間': {'lang': 'ja', 'enLang': 'Date Range'},
		'Диапазон дат': {'lang': 'ru', 'enLang': 'Date Range'},
		//'لنطاق الزمني': {'lang': 'ar', 'enLang': 'Date Range'},
		'Período': {'lang': 'pt', 'enLang': 'Date Range'},
		'Plage de dates': {'lang': 'fr', 'enLang': 'Date Range'},

		'Conversion Action': {'lang': 'en', 'enLang': 'Conversion Action'},
		'Conversieactie': {'lang': 'nl', 'enLang': 'Conversion Action'},
		'Conversion-Aktion': {'lang': 'de', 'enLang': 'Conversion Action'},
		'Azione di conversione': {'lang': 'it', 'enLang': 'Conversion Action'},
		'Acción de conversión': {'lang': 'es', 'enLang': 'Conversion Action'},
		'コンバージョン アクション': {'lang': 'ja', 'enLang': 'Conversion Action'},
		'Действие-конверсия': {'lang': 'ru', 'enLang': 'Conversion Action'},
		//'إجراء التحويل': {'lang': 'ar', 'enLang': 'Conversion Action'},
		'Ação de conversão': {'lang': 'pt', 'enLang': 'Conversion Action'},
		'Action de conversion': {'lang': 'fr', 'enLang': 'Conversion Action'},

		'History Window': {'lang': 'en', 'enLang': 'History Window'},
		'Geschiedenisperiode': {'lang': 'nl', 'enLang': 'History Window'},
		'Verlaufsfenster': {'lang': 'de', 'enLang': 'History Window'},
		'Finestra della cronologia': {'lang': 'it', 'enLang': 'History Window'},
		'Ventana del historial': {'lang': 'es', 'enLang': 'History Window'},
		'計測期間': {'lang': 'ja', 'enLang': 'History Window'},
		'Период ретроспективного анализа': {'lang': 'ru', 'enLang': 'History Window'},
		//'': {'lang': 'ar', 'enLang': 'History Window'},
		'Janela do histórico': {'lang': 'pt', 'enLang': 'History Window'},
		'Fenêtre d\'historique': {'lang': 'fr', 'enLang': 'History Window'},

		'Last click': {'lang': 'en', 'enLang': 'Last click'},
		'Laatste klik': {'lang': 'nl', 'enLang': 'Last click'},
		'Letzter Klick': {'lang': 'de', 'enLang': 'Last click'},
		'Ultimo clic': {'lang': 'it', 'enLang': 'Last click'},
		'Último clic': {'lang': 'es', 'enLang': 'Last click'},
		'ラストクリック': {'lang': 'ja', 'enLang': 'Last click'},
		'По последнему клику': {'lang': 'ru', 'enLang': 'Last click'},
		//'النقرة الأخيرة': {'lang': 'ar', 'enLang': 'Last click'},
		'Último clique': {'lang': 'pt', 'enLang': 'Last click'},
		'Dernier clic': {'lang': 'fr', 'enLang': 'Last click'},

		'Data-Driven': {'lang': 'en', 'enLang': 'Data-Driven'},
		'Gegevensgestuurd': {'lang': 'nl', 'enLang': 'Data-Driven'},
		'Datengetrieben': {'lang': 'de', 'enLang': 'Data-Driven'},
		'Basato sui dati': {'lang': 'it', 'enLang': 'Data-Driven'},
		'Basado en datos': {'lang': 'es', 'enLang': 'Data-Driven'},
		'データドリブン': {'lang': 'ja', 'enLang': 'Data-Driven'},
		'На основе данных': {'lang': 'ru', 'enLang': 'Data-Driven'},
		//'الاعتماد على البيانات': {'lang': 'ar', 'enLang': 'Data-Driven'},
		'Orientado a dados': {'lang': 'pt', 'enLang': 'Data-Driven'},
		'Basé sur les données': {'lang': 'fr', 'enLang': 'Data-Driven'},

		'Linear': {'lang': 'en', 'enLang': 'Linear'},
		'Lineair': {'lang': 'nl', 'enLang': 'Linear'},
		//'Linear': {'lang': 'de', 'enLang': 'Linear'},
		'Lineare': {'lang': 'it', 'enLang': 'Linear'},
		'Lineal': {'lang': 'es', 'enLang': 'Linear'},
		'線形': {'lang': 'ja', 'enLang': 'Linear'},
		'Линейная': {'lang': 'ru', 'enLang': 'Linear'},
		//'خطي': {'lang': 'ar', 'enLang': 'Linear'},
		//'Linear': {'lang': 'pt', 'enLang': 'Linear'},
		'Attribution linéaire': {'lang': 'fr', 'enLang': 'Linear'},

		'Position-based': {'lang': 'en', 'enLang': 'Position-based'},
		'Positiegebaseerd': {'lang': 'nl', 'enLang': 'Position-based'},
		'Positionsbasiert': {'lang': 'de', 'enLang': 'Position-based'},
		'In base alla posizione': {'lang': 'it', 'enLang': 'Position-based'},
		'Según la posición': {'lang': 'es', 'enLang': 'Position-based'},
		'接点ベース': {'lang': 'ja', 'enLang': 'Position-based'},
		'С привязкой к позиции': {'lang': 'ru', 'enLang': 'Position-based'},
		//'على أساس الموضع': {'lang': 'ar', 'enLang': 'Position-based'},
		'': {'lang': 'pt', 'enLang': 'Position-based'},
		'Attribution en fonction de la position': {'lang': 'fr', 'enLang': 'Position-based'},

		'Time decay': {'lang': 'en', 'enLang': 'Time decay'},
		'Tijdsverval': {'lang': 'nl', 'enLang': 'Time decay'},
		'Zeitverlauf': {'lang': 'de', 'enLang': 'Time decay'},
		'Svalorizzazione temporale': {'lang': 'it', 'enLang': 'Time decay'},
		'Depreciación temporal': {'lang': 'es', 'enLang': 'Time decay'},
		'減衰': {'lang': 'ja', 'enLang': 'Time decay'},
		'С учетом давности взаимодействий': {'lang': 'ru', 'enLang': 'Time decay'},
		//'مرور الوقت': {'lang': 'ar', 'enLang': 'Time decay'},
		'Redução de tempo': {'lang': 'pt', 'enLang': 'Time decay'},
		'Dépréciation dans le temps': {'lang': 'fr', 'enLang': 'Time decay'},

		'Ad Group': {'lang': 'en', 'enLang': 'Ad Group'},
		'Eerste klik': {'lang': 'nl', 'enLang': 'Ad Group'},
		'Erster Klick': {'lang': 'de', 'enLang': 'Ad Group'},
		'Primo clic': {'lang': 'it', 'enLang': 'Ad Group'},
		'Primer clic': {'lang': 'es', 'enLang': 'Ad Group'},
		'ファースト クリック': {'lang': 'ja', 'enLang': 'Ad Group'},
		'По первому клику': {'lang': 'ru', 'enLang': 'Ad Group'},
		//'النقرة الأولى': {'lang': 'ar', 'enLang': 'Ad Group'},
		'Primeiro clique': {'lang': 'pt', 'enLang': 'Ad Group'},
		'Premier clic': {'lang': 'fr', 'enLang': 'Ad Group'},

		'Account': {'lang': 'en', 'enLang': 'Account'},
		//'Account': {'lang': 'nl', 'enLang': 'Account'},
		'Konto': {'lang': 'de', 'enLang': 'Account'},
		//'Account': {'lang': 'it', 'enLang': 'Account'},
		'Cuenta': {'lang': 'es', 'enLang': 'Account'},
		'アカウント': {'lang': 'ja', 'enLang': 'Account'},
		'Аккаунт': {'lang': 'ru', 'enLang': 'Account'},
		//'': {'lang': 'ar', 'enLang': 'Account'},
		'Conta': {'lang': 'pt', 'enLang': 'Account'},
		'Compte': {'lang': 'fr', 'enLang': 'Account'},

		'Campaign': {'lang': 'en', 'enLang': 'Campaign'},
		'Campagne': {'lang': 'nl', 'enLang': 'Campaign'},
		'Kampagne': {'lang': 'de', 'enLang': 'Campaign'},
		'Campagna': {'lang': 'it', 'enLang': 'Campaign'},
		'Campaña': {'lang': 'es', 'enLang': 'Campaign'},
		'キャンペーン': {'lang': 'ja', 'enLang': 'Campaign'},
		'Кампания': {'lang': 'ru', 'enLang': 'Campaign'},
		//'': {'lang': 'ar', 'enLang': 'Campaign'},
		'Campanha': {'lang': 'pt', 'enLang': 'Campaign'},
		//'Campagne': {'lang': 'fr', 'enLang': 'Campaign'},

		'Keyword': {'lang': 'en', 'enLang': 'Keyword'},
		'Zoekwoord': {'lang': 'nl', 'enLang': 'Keyword'},
		//'Keyword': {'lang': 'de', 'enLang': 'Keyword'},
		'Parola chiave': {'lang': 'it', 'enLang': 'Keyword'},
		'Palabra clave': {'lang': 'es', 'enLang': 'Keyword'},
		'キーワード': {'lang': 'ja', 'enLang': 'Keyword'},
		'Ключевое слово': {'lang': 'ru', 'enLang': 'Keyword'},
		//'': {'lang': 'ar', 'enLang': 'Keyword'},
		'Palavra-chave': {'lang': 'pt', 'enLang': 'Keyword'},
		'Mot clé': {'lang': 'fr', 'enLang': 'Keyword'},

		'Ad Group': {'lang': 'en', 'enLang': 'Ad Group'},
		'Advertentiegroep': {'lang': 'nl', 'enLang': 'Ad Group'},
		'Anzeigengruppe': {'lang': 'de', 'enLang': 'Ad Group'},
		'Gruppo di annunci': {'lang': 'it', 'enLang': 'Ad Group'},
		'Grupo de anuncios': {'lang': 'es', 'enLang': 'Ad Group'},
		'広告グループ': {'lang': 'ja', 'enLang': 'Ad Group'},
		'Группа объявлений': {'lang': 'ru', 'enLang': 'Ad Group'},
		//'': {'lang': 'ar', 'enLang': 'Ad Group'},
		'Grupo de anúncios': {'lang': 'pt', 'enLang': 'Ad Group'},
		'Groupe d\'annonces': {'lang': 'fr', 'enLang': 'Ad Group'},
	}

	try {
		return headerInfoTrans[term].enLang
	} catch (e) {
		return  term;	
	}
}

function metaData () {


	var meta = {'amt': {}, 'tpr': {}, 'dpr': {}};

	for (var i = attributionModellingReport.header.length - 1; i >= 0; i--) {
		var tempMatch;
		if (attributionModellingReport.header[i][0].match(/^# (.*?): (.*)$/)) {
			tempMatch = attributionModellingReport.header[i][0].match(/^# (.*?): (.*)$/);
			meta.amt[translate(tempMatch[1])] = tempMatch[2];
		}
	}

	for (var i = topPathsReport.header.length - 1; i >= 0; i--) {
		var tempMatch;
		if (topPathsReport.header[i][0].match(/^# (.*?): (.*)$/)) {
			tempMatch = topPathsReport.header[i][0].match(/^# (.*?): (.*)$/);
			meta.tpr[translate(tempMatch[1])] = tempMatch[2];
		}
	}

	for (var i = devicePathsReport.header.length - 1; i >= 0; i--) {
		var tempMatch;
		if (devicePathsReport.header[i][0].match(/^# (.*?): (.*)$/)) {
			tempMatch = devicePathsReport.header[i][0].match(/^# (.*?): (.*)$/);
			meta.dpr[translate(tempMatch[1])] = tempMatch[2];
		}
	}

	results['metaData'] = {
		'dateRange' : {
			'topPathsReport': meta.tpr['Date Range'],
			'devicePathsReport': meta.dpr['Date Range'],
			'attributionModellingReport': meta.amt['Date Range']
		},
		'conversionAction' : {
			'topPathsReport': meta.tpr['Conversion Action'],
			'devicePathsReport': meta.dpr['Conversion Action'],
			'attributionModellingReport': meta.amt['Conversion Action']	
		},
		'historyWindow': {
			'topPathsReport': meta.tpr['History Window'],
			'devicePathsReport': meta.dpr['History Window'],
		},
		'modelsToCompare' : {
			'before': translate(attributionModellingReport.header[attributionModellingReport.header.length-1][2]),
			'after': translate(attributionModellingReport.header[attributionModellingReport.header.length-1][3]),
		},
		'keyDimension': {
			'attributionModellingReport': translate(attributionModellingReport.header[attributionModellingReport.header.length-2][0]),
			'topPathsReport': translate(topPathsReport.header[topPathsReport.header.length-1][0])
		}
	} 
}

function todaysDate() {
	var monthNames = ["January", "February", "March", "April", "May", 
              "June", "July", "August", "September", "October", "November", 
              "December"];

    var todayD = new Date();
    var todayDate = monthNames[todayD.getMonth()] + ' ' +
                    todayD.getDate() + ', ' +
                    todayD.getFullYear();

    results.today = todayDate;
}

function createCampaignObj (report) {
	// Input is topPathsReport
	// Output is campaignTouchpoints, an object with key = Campaign, 
	//           value = information of path involvement

	var path;
	var campaignTouchpoints = {};

	for (var i = report.length - 1; i >= 0; i--) {
		var iteratedPathElements = []; // Without this we count the conversions for a campaign with multiple touchpoints in between first and last touchpoint double
		var non_unique = [];

		path = report[i][0].split(' > ');

		for (var j = path.length - 1; j >= 0; j--) {

			if (!campaignTouchpoints[path[j]]) { // Initialize Object for campaign
				campaignTouchpoints[path[j]] = { multitouchStage:
					[0,0,0], multitouchTotalconvs: 0, singletouch:0
				};	
				// Note that multitouchStage[1] is only not-last, not-first, it's not the any- of the devices
			}

			if (j == 0 && path.length > 1) { // if first element in path
				campaignTouchpoints[path[j]]['multitouchStage'][0] += report[i][1] || 0;
			} 

			if (j == path.length - 1 && path.length > 1) { // if last element in path
				campaignTouchpoints[path[j]]['multitouchStage'][2] += report[i][1] || 0;
			} 

			if (j != 0 && j != path.length - 1 && iteratedPathElements.indexOf(path[j]) < 0 && path.length > 1) { 
				campaignTouchpoints[path[j]]['multitouchStage'][1] += report[i][1] || 0;
				iteratedPathElements.push(path[j]);
			}

			if (non_unique.indexOf(path[j]) < 0) {
				// This non_unique makes sure that a campaign is only considered once per Path
				if (path.length > 1) {
					campaignTouchpoints[path[j]]['multitouchTotalconvs'] += report[i][1] || 0;
				} else {
					campaignTouchpoints[path[j]]['singletouch'] += report[i][1] || 0;
				}
				non_unique.push(path[j]);
			}
		}
	}

	delete campaignTouchpoints[''];

	for (var key in campaignTouchpoints) {
  		if (campaignTouchpoints.hasOwnProperty(key)) {
			campaignTouchpoints[key]['upperFunnelRatio'] = 
				campaignTouchpoints[key]['multitouchStage'][0] /
				campaignTouchpoints[key]['multitouchTotalconvs'],
			campaignTouchpoints[key]['lowerFunnelRatio'] = 
				campaignTouchpoints[key]['multitouchStage'][2] /
				campaignTouchpoints[key]['multitouchTotalconvs'],
			campaignTouchpoints[key]['startVsFinish'] = 
				toFixed((campaignTouchpoints[key]['multitouchStage'][0] / 
				campaignTouchpoints[key]['multitouchStage'][2]), 1),
			campaignTouchpoints[key]['finishVsStart'] = 
				toFixed((campaignTouchpoints[key]['multitouchStage'][2] / 
				campaignTouchpoints[key]['multitouchStage'][0]), 1)
  		}
	}
	return campaignTouchpoints;
}

function campaignFunnels(report) {
	// Input is CampaignObj
	// Output is results.campaignPosition, i.e. top campaigns for upper and lower funnel

	var funnelList = [];

	for (var k in report) {
		if (report[k]['multitouchTotalconvs'] > 100) {
			funnelList.push([k, 
				report[k]['startVsFinish'] / 
					report[k]['finishVsStart'],
				report[k]['startVsFinish'],
				report[k]['finishVsStart']
			])
		}
	}

	funnelList.sort(function(a,b) {
		return b[1] - a[1]
	})

	if (funnelList.length >= 4 && funnelList.length < 6) { 
		results['campaignPosition'] = {
			upperFunnelCampaigns: funnelList.slice(0,2),
			lowerFunnelCampaigns: funnelList.slice(2,4)
		}
	} else if (funnelList.length >= 6) { 
		results['campaignPosition'] = {
			upperFunnelCampaigns: funnelList.slice(0,3),
			lowerFunnelCampaigns: funnelList.slice(3,6)
		}
	} else {
		results['campaignPosition'] = {
			upperFunnelCampaigns: [['0', 0, '', ''],
								   ['0', 0, '', ''],
								   ['0', 0, '', '']],
			lowerFunnelCampaigns: [['0', 0, '', ''],
								   ['0', 0, '', ''],
								   ['0', 0, '', '']]
		}
	}
}

function deviceTouchpoints (report) {
	// Input is Device Path Report
	// Output is results.totalDeviceConversions
	//           results.deviceTouchpoints
	//           results.deviceRatios

  	var totalConversions = 0;
  	var pathPoints = {};
  	mobileBeforeDeskTab = 0;
  	var devices = ['Mobile', 'Tablet', 'Desktop'];
  	var touchpoint = ['start', 'any', 'end'];

  	pathPoints = {
  		'Mobile': { 'start': 0, 'any': 0, 'end': 0 },
  		'Desktab': { 'start': 0, 'any': 0, 'end': 0 }
  	};
  	
  	for (var i=0; i<report.length; i++ ) {
  		totalConversions += parseInt(report[i][1] || 0);

  	    if (report[i][0].match(new RegExp('^Mobile', 'g'))) {
  	      pathPoints.Mobile.start += parseInt(report[i][1]);
  	    }
	
  	    if (report[i][0].match(new RegExp('Mobile$', 'g'))) {
  	      pathPoints.Mobile.end += parseInt(report[i][1]);
  	    }
	
  	    if (report[i][0].match(new RegExp('Mobile', 'g'))) {
  	      pathPoints.Mobile.any += parseInt(report[i][1]);
  	    }

  	    if (report[i][0].match(new RegExp('^(Desktop|Tablet)', 'g'))) {
  	      pathPoints.Desktab.start += parseInt(report[i][1]);
  	    }
	
  	    if (report[i][0].match(new RegExp('(Desktop|Tablet)$', 'g'))) {
  	      pathPoints.Desktab.end += parseInt(report[i][1]);
  	    }
		
  	    if (report[i][0].match(new RegExp('(Desktop|Tablet)', 'g'))) {
  	      pathPoints.Desktab.any += parseInt(report[i][1]);
  	    }
  	 }

  	results.totalDeviceConversions = totalConversions;

  	results.deviceTouchpoints = pathPoints;
  	results.deviceRatios = {
  		'mobile': {
  			'beginning': asPct(pathPoints.Mobile.start / totalConversions, 0),
  			'any': asPct(pathPoints.Mobile.any / totalConversions, 0),
  			'end': asPct(pathPoints.Mobile.end / totalConversions, 0),
  			'beginningTotal': pathPoints.Mobile.start,
  			'anyTotal': pathPoints.Mobile.any,
  			'endTotal': pathPoints.Mobile.end
  		},
		'desktab': {
  			'beginning': asPct((pathPoints.Desktab.start) / totalConversions, 0),
  			'any': asPct((pathPoints.Desktab.any) / totalConversions, 0),
  			'end': asPct((pathPoints.Desktab.end) / totalConversions, 0),
  			'beginningTotal': pathPoints.Desktab.start,
  			'anyTotal': pathPoints.Desktab.any,
  			'endTotal': pathPoints.Desktab.end,
  		},
  		'mobileBeginningVsEnd': toFixed((pathPoints.Mobile.start / (pathPoints.Mobile.end)),1),
  		'mobileRatioAny': asPct(pathPoints.Mobile.any / (totalConversions), 0),
  		'desktabRatioAny': asPct(pathPoints.Desktab.any / (totalConversions), 0)
  	}
}

function creditUnderLastClick (report) {
	// Input is Top Path Report
	// Output is results.creditUnderLastClickMultiple
	//           results.totalMultitouchConversions
	//           results.touchpointAnalysis
	//           results.valueOfMultiTouchpointRatio
	//           results.creditUnderLastClick
	//           results.touchpointsAtEndMultiple
	//           results.totalPathConversions
	//           results.multiTpAnalysis

	var totalTouchpoints = 0;
	var touchpointsAtEnd = 0;
	var totalTouchpointsMultiple = 0;
	var touchpointsAtEndMultiple = 0;
	var totalPathConversions = 0;
	var pathLengths = [0,0]; // 0: 1 touch, 1: 2+ touches
	var path;
	var valueOfSingleTouchpoint = 0;
	var valueOfMultiTouchpoint = 0;
	var totalMultitouchConversions = 0;

	for (var i = report.length - 1; i >= 0; i--) {
		path = report[i][0].split(' > ');

		totalPathConversions += (report[i][1] || 0);

		for (var j = path.length - 1; j >= 0; j--) {
			touchpointsAtEnd += (report[i][1] || 0);
		}

		if (path.length == 1) {
			pathLengths[0] += (report[i][1] || 0);
			try {
				valueOfSingleTouchpoint += (report[i][2] || 0);	
			} catch(e) {}
		} else {
			totalTouchpoints += path.length * (report[i][1] || 0);
			totalMultitouchConversions += (report[i][1] || 0);
			pathLengths[1] += (report[i][1] || 0);
			totalTouchpointsMultiple += path.length * (report[i][1] || 0);
			touchpointsAtEndMultiple += (report[i][1] || 0);
			try {
				valueOfMultiTouchpoint += (report[i][2] || 0);	
			} catch(e) {}
		}
	} 


	try {
		results.valueOfMultiTouchpointRatio = (valueOfMultiTouchpoint / pathLengths[1]) / 
										 	 (valueOfSingleTouchpoint / pathLengths[0]);	
	}
	catch (e) {
		// console.log(valueOfMultiTouchpoint);
		// console.log(valueOfSingleTouchpoint);
		// console.log(pathLengths[1]);
		// console.log(pathLengths[0]);
	}

	results.touchpointAnalysis = {
		oneTp: pathLengths[0],
		multiTp: pathLengths[1],
		singleTpRatio: asPct(pathLengths[0] / (pathLengths[0] + pathLengths[1]), 0),
		multiTpRatio: asPct(pathLengths[1] / (pathLengths[0] + pathLengths[1]), 0)
	}

	results.creditUnderLastClickMultiple = touchpointsAtEndMultiple / totalTouchpointsMultiple;

	results.totalMultitouchConversions = totalMultitouchConversions;
	results.creditUnderLastClick = touchpointsAtEnd / totalTouchpoints;
	results.touchpointsAtEndMultiple = touchpointsAtEndMultiple;
	results.totalPathConversions = totalPathConversions;
	results.multiTpAnalysis = {
		lastTps: pathLengths[1],
		totalTps: totalTouchpoints,
		unaccountedTps: totalTouchpoints - pathLengths[1],
		unaccountedRatio: toFixed(((totalTouchpoints - pathLengths[1]) /
						  pathLengths[1]),1)
	}
}

function brandTouchpoints(report, brandName) {
	// Input: topPathsReport and BrandName
	// Output: results.brandTouchpoints
	// 		   results.genericBeforeBrandRatio

	var path;
	var ContainingGenericBeforeBrandEnd = 0;
	var brandAndGeneric = 0;
	var genericStartBrandEnd = 0;

	var brandTouchpoints = {
		'brand': { 'multitouchStage': {'start':0,
									   'middle': 0,
									   'end': 0,
									   'any': 0,
									   'touchpoints': 0}, 
					'totalconvs': 0},
		'generic': { 'multitouchStage': {'start':0,
									   'middle': 0,
									   'end': 0,
									   'any': 0,
									   'touchpoints': 0},
					 'totalconvs': 0}
	}; 

	for (var i = report.length - 1; i >= 0; i--) {
		var tempPath = '';
		path = report[i][0].split(' > ');

		for (var j = path.length - 1; j >= 0; j--) {
			tempPath += path[j].match(brandName) ? 'b' : 'g';
		}

		if (path.length > 1) {
			if (tempPath.match(/^g/, 'g')) brandTouchpoints.generic.multitouchStage.start += report[i][1] || 0;
			if (tempPath.match(/^b/, 'g')) brandTouchpoints.brand.multitouchStage.start += report[i][1] || 0;
			if (tempPath.match(/^[bg][g]+[bg]$/, 'g')) brandTouchpoints.generic.multitouchStage.middle += report[i][1] || 0;
			if (tempPath.match(/^[bg][b]+[bg]$/, 'g')) brandTouchpoints.brand.multitouchStage.middle += report[i][1] || 0;
			if (tempPath.match(/g$/, 'g')) brandTouchpoints.generic.multitouchStage.end += report[i][1] || 0;
			if (tempPath.match(/b$/, 'g')) brandTouchpoints.brand.multitouchStage.end += report[i][1] || 0;
			if (tempPath.match(/g/, 'g')) brandTouchpoints.generic.multitouchStage.any += report[i][1] || 0;
			if (tempPath.match(/b/, 'g')) brandTouchpoints.brand.multitouchStage.any += report[i][1] || 0;

			brandTouchpoints.brand.multitouchStage.touchpoints += (tempPath.match(/b/g) || []).length;
			brandTouchpoints.generic.multitouchStage.touchpoints += (tempPath.match(/g/g) || []).length;
			if (tempPath.match(/^g.*b$/, 'g')) genericStartBrandEnd += report[i][1] || 0;

			if (tempPath.match(/g.*b$/, 'g')) ContainingGenericBeforeBrandEnd += report[i][1] || 0;
			if (tempPath.match(/b/, 'g') && tempPath.match(/g/, 'g')) brandAndGeneric += report[i][1] || 0;
		} 
	}

	results.brandTouchpoints = brandTouchpoints;
	results.ContainingGenericBeforeBrandEnd = ContainingGenericBeforeBrandEnd;
	results.brandAndGeneric = brandAndGeneric;
	results.genericStartBrandEnd = genericStartBrandEnd;
}

function campaignClassification(report, brandName) {
	// Input: CampaignTouchpoints
	// Output: results.campaignClassification
	var campaignClassification = {'brand': 0, 'generic': 0};

	for (k in report) {
		if (k.match(brandName)) {
			campaignClassification.brand += 1;
		} else {
			campaignClassification.generic += 1;
		}
	}

	results.campaignClassification = campaignClassification;	
	results.genericBeforeBrandEndRatio = results.ContainingGenericBeforeBrandEnd / results.brandTouchpoints.brand.multitouchStage.end;
} 

function brandRatios(brandTouchpoints) {
	// Input: results.brandTouchpoints
	// Output: results.brandRatios
	//		   results.genericConvsOfTotal
	//         results.brandConvsOfTotal

	results.genericConvsOfTotal = asPct(brandTouchpoints.generic.multitouchStage.any / 
								  results.touchpointAnalysis.multiTp,0);
	results.brandConvsOfTotal = asPct(brandTouchpoints.brand.multitouchStage.any / 
								  results.touchpointAnalysis.multiTp,0);
	
	results.brandRatios = { 
		'brand': {
			'beginning': asPct(brandTouchpoints.brand.multitouchStage.start / results.totalMultitouchConversions, 0),
			'end': asPct(brandTouchpoints.brand.multitouchStage.end / results.totalMultitouchConversions, 0)
		},
		'generic': {
			'beginning': asPct(brandTouchpoints.generic.multitouchStage.start / results.totalMultitouchConversions, 0),
			'end': asPct(brandTouchpoints.generic.multitouchStage.end / results.totalMultitouchConversions, 0)
		},
		'genericBeginningVsBrand': toFixed((((brandTouchpoints.generic.multitouchStage.start) / (brandTouchpoints.generic.multitouchStage.end)) - 1) * 100, 1)
	}
}

function amtAnalysis (report, campaigns, brandName) {
	// Input: AMT Report
	//        CampaignObj
	//        BrandName
	// Output: results.shiftToGenericRatio
	//         results.totalAMTConversions
	//         results.fullBrandAnalysis

	var genericConversions = [0,0]; // 0: before, 1: after
	var spendDistribution = {'generic':0,'brand':0,'ratio':''}; // note: this is not 2+ paths! 
													 // also doesn't contain (not set)
	var totalAMTConversions = 0;
	var aggReport = {}; // key = index, value = List of conversion before, 
						// conversion after, isGeneric, cost
	var fullBrandAnalysis = [];

	// Summarize the report

	for (var i = report.length - 1; i >= 0; i--) {
		if(report[i][2] != '' && report[i][0] != '' && report[i][0]) {
			if (aggReport.hasOwnProperty(report[i][0])) {
				aggReport[report[i][0]][0] += Math.abs(report[i][2] || 0);
				aggReport[report[i][0]][1] += Math.abs(report[i][3] || 0); 
				aggReport[report[i][0]][3] += extractCurrency(report[i][1]) || 0;
			} else {
				if (report[i][0].indexOf('>') > -1) { gtFlag = true };
				aggReport[report[i][0]] = [Math.abs(report[i][2] || 0), 
										   Math.abs(report[i][3] || 0),
										   !report[i][0].match(brandName), 
										   extractCurrency(report[i][1]) || 0];
			}
			totalAMTConversions += report[i][2] || 0;
		}
	} 

	for (var key in aggReport) {
		try {
			if (aggReport[key][2]) {
				genericConversions[0] += aggReport[key][0] - campaigns[key].singletouch;
				genericConversions[1] += aggReport[key][1] - campaigns[key].singletouch;
				spendDistribution.generic += aggReport[key][3];
			} else {
				spendDistribution.brand += aggReport[key][3];
			}

			fullBrandAnalysis.unshift([key, 
									aggReport[key][2] ? 'Generic' : 'Brand',
									campaigns[key].singletouch,
									aggReport[key][0] - campaigns[key].singletouch,
									aggReport[key][1] - campaigns[key].singletouch,
									((aggReport[key][1] - campaigns[key].singletouch) / (aggReport[key][0] - campaigns[key].singletouch)) - 1])
		} catch(e) {
			if (e instanceof TypeError) {
				console.log('TypError - ' + key);
			} else {
				throw e
			}
		}
	}

	spendDistribution.ratio = spendDistribution.brand / (spendDistribution.brand + spendDistribution.generic);
	results.spendDistribution = spendDistribution;

	results.shiftToGenericRatio = asPct((genericConversions[1] - genericConversions[0]) / genericConversions[0],2);
	results.totalAMTConversions = totalAMTConversions;
	results.fullBrandAnalysis = fullBrandAnalysis;
}

function creditForModel(meta) {
	// Input: metaData
	// Output: results.altCredit

	if (meta.modelsToCompare.after == 'Linear') {
    	results.altCredit = [25,25,25,25];
    } else if (meta.modelsToCompare.after == 'Time decay') {
    	results.altCredit = [10,20,30,40];
    } else if (meta.modelsToCompare.after == 'Position-based') {
    	results.altCredit = [40,10,10,40];
    } else {
    	results.altCredit = [0,0,0,0];
    }
}

function funnelSlide(campaignObj, report) {
	// Input: CampaignObj
	// Output: 

	var topLcCmpCreditAbs = 0;
	var topLcCmp = '';
	var path;
	var uqOnPath = [];
	var maxlength = 20;

	for (var k in campaignObj) {
		if (campaignObj[k].multitouchStage[2] > topLcCmpCreditAbs) {
			topLcCmpCreditAbs = campaignObj[k].multitouchStage[2];
			topLcCmp = k;
		}
	}

	results.funnelSlide = {topLcCmp : '',
						   topLcCmpCreditAbs : 0,
						   topLcCmpCredit : 0,
						   uqOnPath : 0};	

	for (var i = report.length - 1; i >= 0; i--) {

		path = report[i][0].split(' > ');

		if (path.length > 1 && path[path.length - 1] == topLcCmp) {
			for (var j = path.length - 1; j >= 0; j--) {
				if (uqOnPath.indexOf(path[j]) <= -1 && path[j] != topLcCmp) {
					uqOnPath.push(path[j]);
				}
			}	
		}
	}

	results.funnelSlide.topLcCmp = topLcCmp;
	results.funnelSlide.topLcCmpCreditAbs = topLcCmpCreditAbs;
	results.funnelSlide.topLcCmpCredit = topLcCmpCreditAbs / results.multiTpAnalysis.lastTps;
	results.funnelSlide.uqOnPath = uqOnPath.length;
	if (uqOnPath.length >= 3) {
		results.funnelSlide.topPre = [brief(uqOnPath[0], maxlength), 
									  brief(uqOnPath[1], maxlength), 
									  brief(uqOnPath[2], maxlength)];	
	} else if (uqOnPath.length == 2) {
		results.funnelSlide.topPre = [brief(uqOnPath[0], maxlength), 
									  brief(uqOnPath[1], maxlength), 
									  brief(uqOnPath[0], maxlength)];
	} else if (uqOnPath.length == 1) {
		results.funnelSlide.topPre = [brief(uqOnPath[0], maxlength), 
									  brief(uqOnPath[0], maxlength), 
									  brief(uqOnPath[0], maxlength)];
	} else {
		results.funnelSlide.topPre = [brief("None", maxlength), 
									  brief("None", maxlength), 
									  brief("None", maxlength)];
	}
}

function brandValidator () {
	var brandName = brandGetter();
	var result = {};
	var isGeneric;
	var brand = 0;
	var generic = 0;
	var brandAndGenericCounts = [0,0];
	
	if (brandGetter() && attributionModellingReport) {
		var report = attributionModellingReport.body;
		for (var i = report.length - 1; i >= 0; i--) {
			if (report[i][2] != '' && report[i][0] != '') {
				isGeneric = !report[i][0].match(brandName);

				if (result.hasOwnProperty(report[i][0])) {
					result[report[i][0]][0] += Math.abs(report[i][2] || 0);
				} else {
					result[report[i][0]] = [
						Math.abs(report[i][2] || 0),
						isGeneric
					];
					isGeneric ? brandAndGenericCounts[0] += 1 : brandAndGenericCounts[1] += 1;
				}
			}
		}	
	}

	$('#brandvalidator-body').empty();

	var table = $('<table></table>').addClass('brandvalidator-table');
	table.append($('<tr></tr>').addClass('brandvalidator-title-row')
				 .append($('<td></td>').text('Campaign'))
				 .append($('<td></td>').text('Brand/Generic'))
	);

	for (var key in result) {
		if ((!result[key][1] && brand < 20) || (result[key][1] && generic < 20)) {
			var row = $('<tr></tr>').addClass('brandvalidator-row');
			row.append($('<td></td>').text(key));
			row.append($('<td></td>').text(result[key][1] ? 'Generic' : 'Brand'));
    		table.append(row);
    		result[key][1] ? generic++ : brand++;
		}
    }

    $('#brandvalidator-body').append(
    	$('<span>Total campaigns: ' + (brandAndGenericCounts[0] + brandAndGenericCounts[1]) + '<br>' + 
    	  		'Generic campaigns: ' + brandAndGenericCounts[0] + '<br>' + 
    	  		'Brand campaigns: ' + brandAndGenericCounts[1] + '<br><br>' + '</span>'))
	$('#brandvalidator-body').append(table);
	$('#brandvalidator-body').append(
    	$('<span><br>Note that this is merely a preview and does not necessarily include all campaigns<br></span>'))
	$('.brandvalidator-button').show()
}