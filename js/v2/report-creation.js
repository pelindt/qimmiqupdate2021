'use strict';

function checkAuth() {
  $('#current_status').html("Authorizing Access...");
  gapi.auth.authorize({
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': false
  }, handleAuthResult);
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    requestReport();
  } else {
    handleAuthClick();
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({
      'client_id': CLIENT_ID, 
      'scope': SCOPES, 
      'immediate': false
  }, handleAuthResult);

  return false;
}

function logInfo() {
  // Tracking
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/sheetLogger", true);
  xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var body = "report=" + encodeURIComponent("qimmiq") +
             "&date_range=" + encodeURIComponent(dateRange) +
             "&conversion_action=" + encodeURIComponent(conversionAction) +
             "&history_window=" + encodeURIComponent(historyWindow) +
             "&total_conversions=" + encodeURIComponent(totalConversions) +
             "&cd_conv_based_on_impr=" + encodeURIComponent(crossDeviceConvBasedOnImpr) +
             "&cd_conv_based_on_clck=" + encodeURIComponent(crossDeviceConvBasedOnClicks) +
             "&avg_click_path_length=" + encodeURIComponent(averageClickPathLength) +
             "&avg_impr_path_length=" + encodeURIComponent(averageImprPathLength) +
             "&unique_cd_click_paths=" + encodeURIComponent(uniqueCrossDeviceClickPaths) +
             "&unique_cd_impr_paths=" + encodeURIComponent(uniqueCrossDeviceImprPaths) +
             "&desktop_last_click=" + encodeURIComponent(desktopLastClickConv) +
             "&tablet_last_click=" + encodeURIComponent(tabletLastClickConv) + 
             "&mobile_last_click=" + encodeURIComponent(mobileLastClickConv) +
             "&mobile_tablet=" + encodeURIComponent(pathsCombs.Mobile.Tablet) + 
             "&mobile_desktop=" + encodeURIComponent(pathsCombs.Mobile.Desktop) + 
             "&tablet_mobile=" + encodeURIComponent(pathsCombs.Tablet.Mobile) +
             "&tablet_desktop=" + encodeURIComponent(pathsCombs.Tablet.Desktop) + 
             "&desktop_mobile=" + encodeURIComponent(pathsCombs.Desktop.Mobile) +
             "&desktop_tablet=" + encodeURIComponent(pathsCombs.Desktop.Tablet) +
             "&desktop_desktop=" + encodeURIComponent(pathsCombs.Desktop.Desktop) +
             "&mobile_mobile=" + encodeURIComponent(pathsCombs.Mobile.Mobile) +
             "&tablet_tablet=" + encodeURIComponent(pathsCombs.Tablet.Tablet) +
             "&mobile_any=" + encodeURIComponent(pathsContaining.Mobile.any) +
             "&tablet_any=" + encodeURIComponent(pathsContaining.Tablet.any) +
             "&desktop_any=" + encodeURIComponent(pathsContaining.Desktop.any) +
             "&mobile_start=" + encodeURIComponent(pathsContaining.Mobile.start) +
             "&tablet_start=" + encodeURIComponent(pathsContaining.Tablet.start) +
             "&desktop_start=" + encodeURIComponent(pathsContaining.Desktop.start) +
             "&first_mobile=" + encodeURIComponent(models.first.Mobile) +
             "&first_tablet=" + encodeURIComponent(models.first.Tablet) +
             "&first_desktop=" + encodeURIComponent(models.first.Desktop) +
             "&ushaped_mobile=" + encodeURIComponent(models.ushaped.Mobile) +
             "&ushaped_tablet=" + encodeURIComponent(models.ushaped.Tablet) +
             "&ushaped_desktop=" + encodeURIComponent(models.ushaped.Desktop) +
             "&linear_mobile=" + encodeURIComponent(models.linear.Mobile) +
             "&linear_tablet=" + encodeURIComponent(models.linear.Tablet) +
             "&linear_desktop=" + encodeURIComponent(models.linear.Desktop) +
             "&last_mobile=" + encodeURIComponent(models.last.Mobile) +
             "&last_tablet=" + encodeURIComponent(models.last.Tablet) +
             "&last_desktop=" + encodeURIComponent(models.last.Desktop) +
             "&desktop_assist_ratio=" + encodeURIComponent(desktopAssistRatio) +
             "&mobile_assist_ratio=" + encodeURIComponent(mobileAssistRatio) +
             "&total_conv_value=" + encodeURIComponent(totalConversionValue) +
             "&cd_conv_value=" + encodeURIComponent(crossDeviceConvValue) +
             "&non_cd_conv_value=" + encodeURIComponent(nonCrossDevConvValue) +
             "&conv_value_ratio=" + encodeURIComponent(convValueRatio) +
             "&username=" + encodeURIComponent($('#ldap').val()) +
             "&division=" + encodeURIComponent($('#division').val()) +
             "&not_ending_on_same_device=" + encodeURIComponent(notEndingOnSameDevice) + 
             "&total_conversion_value=" + encodeURIComponent(totalConversionValue);

  xhttp.send(body);
}

/*

API load
.. Copy Sheets
.... batchUpdate Sheets
.... get Sheet info
...... copy Slides
...... then get Slides
...... then batchUpdate Slides
...... then update Permissions
......      update Permissions

*/

function requestReport() {
  // Read Slides

  Promise.all([gapi.client.load('drive', 'v3'),
    gapi.client.load('sheets', 'v4'),
    gapi.client.load('slides', 'v1')]).then(function() {

    if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }

    // Copy Spreadsheet for Charts
    $('#current_status').html("Copying Sheets for Charts...");

    dataLayer.push({
      'event':'VirtualPageview',
      'virtualPageURL':'sheet_copy',
      'virtualPageTitle' : 'Copying Sheets for Charts...'
    });

    var copySheet = gapi.client.drive.files.copy({
      'fileId': '1Gt61y2micSpijvUnA3xGQPypDZn-DFsoEplHNqESEBs',
      'name': '[qimmiq Backend] ' + $('#division').val()
    });

    copySheet.then(function(bc) {
      if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }

      $('#current_status').html("Updating Values in Sheets...");

      dataLayer.push({
        'event':'VirtualPageview',
        'virtualPageURL':'sheet_updating',
        'virtualPageTitle' : 'Updating Values in Sheets...'
      });

      gapi.client.sheets.spreadsheets.values.batchUpdate({
        'spreadsheetId': bc.result.id,
        'valueInputOption': 'USER_ENTERED',
        'data': [{
          'range': 'FirstAndConverting!B2:B10',
          'values': [[pathsCombs.Mobile.Tablet], 
                     [pathsCombs.Mobile.Desktop], 
                     [pathsCombs.Tablet.Mobile], 
                     [pathsCombs.Tablet.Desktop], 
                     [pathsCombs.Desktop.Mobile], 
                     [pathsCombs.Desktop.Tablet], 
                     [pathsCombs.Mobile.Mobile], 
                     [pathsCombs.Tablet.Tablet], 
                     [pathsCombs.Desktop.Desktop]
                    ]
        }, {
          'range': 'Attribution!B2:D5',
          'values': [
                      [
                        models.last.Mobile,
                        models.last.Tablet,
                        models.last.Desktop
                      ],
                      [
                        models.ushaped.Mobile,
                        models.ushaped.Tablet,
                        models.ushaped.Desktop
                      ],
                      [
                        models.linear.Mobile,
                        models.linear.Tablet,
                        models.linear.Desktop
                      ],
                      [
                        models.first.Mobile,
                        models.first.Tablet,
                        models.first.Desktop
                      ],
                    ]
        }]
      }).then(function () {}, function (reason) { 
        executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
      });

      if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }

      gapi.client.sheets.spreadsheets.get({
        'spreadsheetId': bc.result.id
      }).then(function (ss) {
        if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }
        $('#current_status').html("Copying Slides...");

        dataLayer.push({
          'event':'VirtualPageview',
          'virtualPageURL':'slides_copying',
          'virtualPageTitle' : 'Copying Slides...'
        });

        gapi.client.drive.files.copy({
          'fileId': '1Pd9-6fPkaWqHYUVnsZn5PM0nNGw4goTxBpo9-2NP47A',
          'name': '[qimmiq] ' + $('#division').val()
        }).then(function(pr) {
          // Read Presentation
          if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }
          return gapi.client.slides.presentations.get({
            'presentationId': pr.result.id,
          });
        }, function (reason) { 
          executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
        }).then(function(pr) {
          // Update Presentation copy
          if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }
          $('#current_status').html("Updating Slides...");

          dataLayer.push({
            'event':'VirtualPageview',
            'virtualPageURL':'slides_updating',
            'virtualPageTitle' : 'Updating Slides...'
          });

          var totalBatchUpdates = [];

          // Push Chart Updates
          totalBatchUpdates.push({
              'createSheetsChart': {
                'spreadsheetId': bc.result.id,
                'chartId': ss.result.sheets[0].charts[0].chartId,
                "linkingMode": "LINKED",
                'elementProperties': {
                  'pageObjectId': pr.result.slides[3].objectId,
                  'size': {
                    'width': {
                      'magnitude': 150,
                      'unit': 'PT'
                    },
                    'height': {
                      'magnitude': 150,
                      'unit': 'PT'
                    }
                  },
                  'transform': {
                    'scaleX': 2,
                    'scaleY': 2,
                    'translateX': 40,
                    'translateY': 110,
                    'unit': 'PT'
                  }
                }
              }
            }, {
              'createSheetsChart': {
                'spreadsheetId': bc.result.id,
                'chartId': ss.result.sheets[1].charts[0].chartId,
                "linkingMode": "LINKED",
                'elementProperties': {
                  'pageObjectId': pr.result.slides[7].objectId,
                  'size': {
                    'width': {
                      'magnitude': 150,
                      'unit': 'PT'
                    },
                    'height': {
                      'magnitude': 150,
                      'unit': 'PT'
                    }
                  },
                  'transform': {
                    'scaleX': 2,
                    'scaleY': 2,
                    'translateX': 40,
                    'translateY': 100,
                    'unit': 'PT'
                  }
                }
              }
            });

            var monthNames = ["January", "February", "March", "April", "May", 
              "June", "July", "August", "September", "October", "November", 
              "December"];

            var todayD = new Date();
            var todayDate = monthNames[todayD.getMonth()] + ' ' +
                            todayD.getDate() + ', ' +
                            todayD.getFullYear();

            // Push Text changes
            var textChanges = [
              ['{advertiserName}', $('#division').val()],
              ['{today}', todayDate],
              ['{dateRange}', dateRange],
              ['{conversionAction}', conversionAction],
              ['{historyWindow}', historyWindow],
              ['{totalConversions}', totalConversions.toString()],
              ['{multipleDevicesBasedOnImpr}', Math.round(100 * (
                crossDeviceConvBasedOnImpr / totalConversions)).toString()],
              ['{multipleDevicesBasedOnClicks}', Math.round(100 * (
                crossDeviceConvBasedOnClicks / totalConversions)).toString()],
              ['{notEndingOnSameDevice}', notEndingOnSameDevice.toString()],
              ['{uniqueCrossDeviceImprPaths}', uniqueCrossDeviceImprPaths.toString()],
              ['{startMobile}', Math.round(100 * (pathsContaining.Mobile.start / crossDeviceConvBasedOnClicks)).toString()],
              ['{startDesktop}', Math.round(100 * (pathsContaining.Desktop.start / crossDeviceConvBasedOnClicks)).toString()],
              ['{endMobile}', Math.round(100 * (mobileLastClickConv / totalConversions)).toString()],
              ['{anyMobile}', mobileInvolv.toString()],
              ['{endDesktop}', Math.round(100 * (desktopLastClickConv / totalConversions)).toString()],
                  ['{mobileSubheading}', mobileSubheading],
              ['{roleOfMobile}', roleOfMobile],
              ['{roleOfMobileSub}', roleOfMobileSub],
              ['{convValueRatio}', (Math.round(100 * (convValueRatio)) / 100).toString()],
              ['{s2trHeading}', s2trHeading],
              ['{s2trMain}', s2trMain],
              ['{s2trFooter}', s2trFooter],
              ['{attributionHeadline}', attributionHeadline],
              ['{mobileAssistRatio}', (Math.round(100 * mobileAssistRatio)).toString()],
              ['{desktopAssistRatio}', (Math.round(100 * desktopAssistRatio)).toString()],
              ['{assistHeading}', assistHeading],
              ['{attributionValue}', Math.round(100 * (crossDeviceConvBasedOnClicks / totalTouchPoints)).toString()],
              ['{keyMobileTouchpoint}', keyMobileTouchpoint],
              ['{mobileCredit}', (Math.round(100 * Math.min(models.first.Mobile, 
                models.last.Mobile, 
                models.ushaped.Mobile, 
                models.linear.Mobile) / 
                crossDeviceConvBasedOnClicks).toString() + ' - ' + 
                  Math.round(100 * Math.max(models.first.Mobile, 
                    models.last.Mobile, 
                    models.ushaped.Mobile, 
                    models.linear.Mobile) / 
                    crossDeviceConvBasedOnClicks).toString())],
              ['{desktopCredit}', (Math.round(100 * Math.min(models.first.Desktop, 
                models.last.Desktop, 
                models.ushaped.Desktop, 
                models.linear.Desktop) / 
                crossDeviceConvBasedOnClicks).toString() + ' - ' + 
                  Math.round(100 * Math.max(models.first.Desktop, 
                    models.last.Desktop, 
                    models.ushaped.Desktop, 
                    models.linear.Desktop) / 
                    crossDeviceConvBasedOnClicks).toString())]
            ];

            for (var i = textChanges.length - 1; i >= 0; i--) {
              totalBatchUpdates.push({
                'replaceAllText': {
                  'containsText': {'text': textChanges[i][0],
                                  'matchCase' : true},
                  'replaceText': textChanges[i][1]
                }
              });
            }

            // Push Slide deletion change
            if (!convValueRatio || convValueRatio <1.05) {
              totalBatchUpdates.push({
                'deleteObject': {
                  'objectId': pr.result.slides[4].objectId
                }
              });
            }

          return gapi.client.slides.presentations.batchUpdate({
            'presentationId': pr.result.presentationId,
            'requests': totalBatchUpdates
          });
        }, function (reason) { 
          executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
        }).then(function(rs) {
          if ($("#drop_zone-inner").html().indexOf('error') > -1) { return; }
          $('#drop_zone-inner').html('<i class="material-icons">done_all</i> <br><a href="https://docs.google.com/presentation/d/' + rs.result.presentationId + '/" target="_blank">Done, you may download your report <u>here</u>.</a>');

          dataLayer.push({
            'event':'VirtualPageview',
            'virtualPageURL':'report_success',
            'virtualPageTitle' : rs.result.presentationId
          });

          gapi.client.drive.permissions.create({
            'fileId': rs.result.presentationId,
            'resource': { 
              'role': 'reader',
              'type': 'user',
              'emailAddress': 'oliverkiderle@google.com'
            }
          }).then(function() {
            gapi.client.drive.permissions.create({
              'fileId': rs.result.presentationId,
              'resource': { 
                'role': 'reader',
                'type': 'user',
                'emailAddress': 'meijerhof@google.com'
              }
            }).execute();
          });
        });
      }, function (reason) { 
        executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
      });
    });
  }, function (reason) { 
    executionError('Execution Failure', 
      reason.result.error.code,
      reason.result.error.message);
  });
}