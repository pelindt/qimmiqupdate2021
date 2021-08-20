'use strict';

var lang_id = {
  '# Device Paths' : ['en', 'Device Paths'],
  '# Assisting Devices' : ['en','Assisting Devices'],
  '# Vorbereitende Geräte' : ['de','Assisting Devices'],
  '# Gerätepfade' : ['de','Device Paths'],
  '# Rutas de dispositivos' : ['es','Device Paths'],
  '# Dispositivos de asistencia' : ['es','Assisting Devices'],
  '# Dispositivi che generano conversioni' : ['it','Assisting Devices'],
  '# Percorsi per i dispositivi' : ['it','Device Paths'],
  '# Пути устройств' : ['ru','Device Paths'],
  '# Вспомогательные устройства' : ['ru','Assisting Devices'],
  '# Appareils indirects' : ['fr','Assisting Devices'],
  "# Chemins d'accès par appareils" : ['fr','Device Paths'],
  '# Dispositivos de assistência' : ['pt', 'Assisting Devices'],
  '# Caminhos de dispositivos' : ['pt', 'Device Paths'],
  '# مسارات الأجهزة' : ['ar', 'Device Paths'],
  '# الأجهزة المساعدة' : ['ar', 'Assisting Devices'],
  '# アシストしたデバイス' : ['ja', 'Assisting Devices'],
  '# デバイス経路' : ['ja', 'Device Paths'],
  '# Apparaatpaden' : ['nl', 'Device Paths'],
  '# Ondersteunende apparaten' : ['nl', 'Assisting Devices']
};

function determineReportType(report) {
  try {
    return lang_id[report[0][0]][1];
  }
  catch (e) {
    dataLayer.push({
      'event':'VirtualEvent',
      'virtualECategory':'Minor Exception',
      'virtualEAction' : report[0][0],
      'virtualELabel' : 'Wrong language/report',
      'virtualEValue' : 0
    });

    if (report[0][0] == '# Devices') {
      $('#drop_zone-inner').html('Did you accidentally upload a Devices Report? <br> qimmiq only needs the Assisting Devices and Device Paths reports. <br> Check step 2 for details and then try again by dropping the correct files here.');
    }
    else { 
      $('#drop_zone-inner').html('Did you upload the right report? Is the report you uploaded using a supported language?');
    }
    

    return;
  }
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

function determineLanguage(header) {  
  // Tracking missing
  return lang_id[header[0][0]][0];
}

function determineHeaderRow(data, rt) {
  if ((rt == 'Device Paths' && data[7][0] == '') || (rt == 'Assisting Devices' && data[6][0] == '')) {
    return 9;
  }
  else {
    conversionAction = 'All Conversions';
    return 8;
  }
}

function languageAdjustment(report, language) {
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
      if (j === 0) {
        // lang_text - first column
        report[i][0] = report[i][0].replace(lang_text[0], 'Desktop');
        report[i][0] = report[i][0].replace(lang_text[1], 'Tablet');
        report[i][0] = report[i][0].replace(lang_text[2], 'Mobile');
      }
      else {
        // lang_num - other columns
        report[i][j] = parseFloat(report[i][j].replace(lang_nums[0][0],
                                                       lang_nums[0][1])
                                              .replace(lang_nums[1][0],
                                                       lang_nums[1][1]));
      }
    }
  }
  return report;
}