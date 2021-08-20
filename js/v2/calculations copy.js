'use strict';

function isClickInteraction(current, former, reportType) {
  if (reportType == 'Assisting Devices') {
    return (/click/i).test(current[8][3]);
  }

  if (reportType == 'Device Paths') {
    var c = 10;
    var sumCurrent = 0;
    var sumFormer = 0;

    while (current[c] || former[c]) {
      if (current[c] && current[c][0] !== '') {
        sumCurrent += current[c][1]; 
      }

      if (former[c] && former[c][0] !== '') { 
        sumFormer += former[c][1]; 
      }

      c++;
    }
    return sumCurrent < sumFormer;
  }
}

function sumColumn(report, ix) {
  var body = report.body;
  var sum = 0;

  for (var i = body.length - 1; i >= 0; i--) {
    sum += parseFloat(body[i][ix]);
  }
  return sum;
}

function pathPoints (report) {
  var total = 0;
  var pathPoints = {};
  var channelPoints = {};
  var devices = ['Mobile', 'Tablet', 'Desktop'];
  var touchpoint = ['start', 'any', 'end'];
  var channel = ['Youtube', 'Shopping', 'Search', 'Display']

  for (var i = devices.length - 1; i >= 0; i--) {
    pathPoints[devices[i]] = {};
    for (var j = touchpoint.length - 1; j >= 0; j--) {
      pathPoints[devices[i]][touchpoint[j]] = 0;
    }
  }
  // creates the numbers where each channel takes place at the start, end or at any point in user journey
  for (var i=0; i<report.length; i++ ) {
    for (var j = devices.length - 1; j >= 0; j--) {
      if (report[i][0].match(new RegExp('^' + devices[j], 'g'))) { //Match any character where device is at the beginning
        pathPoints[devices[j]].start += parseInt(report[i][1]);
      }

      if (report[i][0].match(new RegExp(devices[j] + '$', 'g'))) { //Match any character where device is at the end
        pathPoints[devices[j]].end += parseInt(report[i][1]);
      }

      if (report[i][0].match(new RegExp(devices[j], 'g'))) {
        pathPoints[devices[j]].any += parseInt(report[i][1]);
      }
    }
  }

  return pathPoints;
}

function channelPoints (report) {
  var total = 0;
  var channelPoints = {};
  var touchpoint = ['start', 'any', 'end'];
  var channel = ['Youtube', 'Shopping', 'Search', 'Display']

  for (var i = channel.length - 1; i >= 0; i--) {
    channelPoints[channel[i]] = {};
    for (var j = touchpoint.length - 1; j >= 0; j--) {
      channelPoints[channel[i]][touchpoint[j]] = 0;
    }
  }
  for (var i=0; i<report.length; i++ ) {
    for (var j = channel.length - 1; j >= 0; j--) {
      if (report[i][0].match(new RegExp('^' + channel[j], 'g'))) { //Match any character where device is at the beginning
        channelPoints[channel[j]].start += parseInt(report[i][1]);
      }

      if (report[i][0].match(new RegExp(channel[j] + '$', 'g'))) { //Match any character where device is at the end
        channelPoints[channel[j]].end += parseInt(report[i][1]);
      }

      if (report[i][0].match(new RegExp(channel[j], 'g'))) {
        channelPoints[devices[j]].any += parseInt(report[i][1]);
      }
    }
  }

  return channelPoints;
}

function totalTouchPointsFunc(report) {
  var totalTouchPoints = 0;

  for ( var i=0; i<report.length; i++ ) {
    totalTouchPoints += (report[i][0].match(/Mobile|Tablet|Desktop/g) || []).length * parseInt(report[i][1]);
  }

  return totalTouchPoints;
}

function notEndsWithButContainsFunc (report, device) {
  var total = 0;
  
  for ( var i=0; i<report.length; i++ ) {
    total += parseInt(report[i][1] || 0) * (!(new RegExp(device + '$').test(report[i][0])) && (new RegExp(device).test(report[i][0])));
  }

  return total;
}

function pathPointCombinations (report) {
  var total = 0;
  var pathPoints = {};
  var devices = ['Mobile', 'Tablet', 'Desktop'];

  for (var i = devices.length - 1; i >= 0; i--) {
    pathPoints[devices[i]] = {};
    for (var j = devices.length - 1; j >= 0; j--) {
      pathPoints[devices[i]][devices[j]] = 0;
    }
  }
  
  for ( var i=0; i<report.length; i++ ) {
    for (var j = devices.length - 1; j >= 0; j--) {
      for (var k = devices.length - 1; k >= 0; k--) {
        if (report[i][0].match(new RegExp('^' + devices[j], 'g')) && 
          report[i][0].match(new RegExp(devices[k] + '$', 'g'))) {
          pathPoints[devices[j]][devices[k]] += parseInt(report[i][1]);
        }
      }
    }
  }

  return pathPoints;
}

function channelPointCombinations (report) {
  var total = 0;
  var channelPoints = {};
  var channels = ['Youtube', 'Display', 'Search', 'Shopping'];

  for (var i = channels.length - 1; i >= 0; i--) {
    channelPoints[channels[i]] = {};
    for (var j = channels.length - 1; j >= 0; j--) {
      channelPoints[channels[i]][channels[j]] = 0;
    }
  }
  
  for ( var i=0; i<report.length; i++ ) {
    for (var j = channels.length - 1; j >= 0; j--) {
      for (var k = channels.length - 1; k >= 0; k--) {
        if (report[i][0].match(new RegExp('^' + channels[j], 'g')) && 
          report[i][0].match(new RegExp(channels[k] + '$', 'g'))) {
          channelPoints[channels[j]][channels[k]] += parseInt(report[i][1]);
        }
      }
    }
  }

  return pathPoints, channelPoints;
}

function avgPathLength(range) {
  var total = 0;
  var sum_product = 0;
  
  for (var i=0; i<range.length; i++) {
    sum_product += range[i][0].split(">").length * (parseInt(range[i][1]));
    total += parseInt(range[i][1]);
  }

  return (sum_product / total);
}

function model(report) {
  var sum_product = 0;
  var regxm;
  var devices = ['Mobile', 'Tablet', 'Desktop'];
  var models = ['first', 'ushaped', 'last', 'linear'];
  var model = {};

  for (var i = models.length - 1; i >= 0; i--) {
    model[models[i]] = {};
    for (var j = devices.length - 1; j >= 0; j--) {
       model[models[i]][devices[j]] = 0;
     } 
    for (var j = channels.length - 1; j >= 0; j--) {
       model[models[i]][channels[j]] = 0;
    } 
  }
    
  //linear

  for (var i=0; i<report.length; i++) {
    for (var j = devices.length - 1; j >= 0; j--) {
      model.linear[devices[j]] += parseInt(report[i][1]) * 
        ((report[i][0].match(new RegExp(devices[j], 'g')) || []).length / 
          report[i][0].split(">").length);
    }
  }

  for (var i=0; i<report.length; i++) {
    for (var j = devices.length - 1; j >= 0; j--) {
      model.linear[devices[j]] += parseInt(report[i][1]) * 
        ((report[i][0].match(new RegExp(devices[j], 'g')) || []).length / 
          report[i][0].split(">").length);
    }
  }

  //ushaped, first, last
  for (var i=0; i<report.length; i++) {
    for (var j = devices.length - 1; j >= 0; j--) {
      regxm = '^' + devices[j];
      model.first[devices[j]] += parseInt(report[i][1]) * (report[i][0].match(
          new RegExp(regxm, 'g')) || []).length;
    }

    for (var k = devices.length - 1; k >= 0; k--) {
      regxm = devices[k] + '$';
      model.last[devices[k]] += parseInt(report[i][1]) * (report[i][0].match(
          new RegExp(regxm, 'g')) || []).length;
    }
  }

  for (var i = devices.length - 1; i >= 0; i--) {
    model.ushaped[devices[i]] = (model.first[devices[i]] + 
      model.last[devices[i]]) / 2;
  }

  return model;
}