  function determineReportType(report) {
    var rx = /^# (.*)?/;
    return rx.exec(report[0][0])[1];
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

      while (arrMatches = objPattern.exec(input)){
        var strMatchedDelimiter = arrMatches[ 1 ];
        
        if (strMatchedDelimiter.length && (strMatchedDelimiter != ',')) {
          arrData.push( [] );
        }
    
        if (arrMatches[ 2 ]){
          var strMatchedValue = arrMatches[ 2 ].replace(
            new RegExp( "\"\"", "g" ),
            "\""
          );
        } else {
          var strMatchedValue = arrMatches[ 3 ];
        }
    
        arrData[ arrData.length - 1 ].push( strMatchedValue );
      }

      return( arrData );
  }