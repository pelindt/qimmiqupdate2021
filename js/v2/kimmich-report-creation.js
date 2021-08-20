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
  var body = "report=" + encodeURIComponent("kimmich") +
             "&Timestamp=" + encodeURIComponent(results.today) +
             "&LDAP=" + encodeURIComponent($('#ldap').val()) +
             "&cid=" + encodeURIComponent($('#cid').val()) + 
             "&advertiserName=" + encodeURIComponent(results.advertiserName) +
             "&today=" + encodeURIComponent(results.today) +
             "&dateRange=" + encodeURIComponent(results.metaData.dateRange.topPathsReport) +
             "&historyWindow=" + encodeURIComponent(results.metaData.historyWindow.topPathsReport) +
             "&curModel=" + encodeURIComponent(results.metaData.modelsToCompare.before) +
             "&altModel=" + encodeURIComponent(results.metaData.modelsToCompare.after) +
             "&brandTerms=" + encodeURIComponent(results.brandTerms) +
             "&regex=" + encodeURIComponent($('#regex').is(':checked').toString()) + 
             "&cs=" + encodeURIComponent($('#case_sensitive').is(':checked').toString()) + 
             "&brandSpendRatio=" + encodeURIComponent(results.spendDistribution.ratio) + 

             "&totalPathConversions=" + encodeURIComponent(delimInsert(results.totalPathConversions)) +
             "&campaignClassBrand=" + encodeURIComponent(results.campaignClassification.brand.toString()) +
             "&campaignClassGeneric=" + encodeURIComponent(results.campaignClassification.generic.toString()) +
             "&genericTotalConvs=" + encodeURIComponent(delimInsert(results.brandTouchpoints.generic.multitouchStage.any)) +
             "&brandTotalConvs=" + encodeURIComponent(delimInsert(results.brandTouchpoints.brand.multitouchStage.any)) +
             "&mobileAnyTotal=" + encodeURIComponent(delimInsert(results.deviceRatios.mobile.anyTotal)) +
             "&desktabAnyTotal=" + encodeURIComponent(delimInsert(results.deviceRatios.desktab.anyTotal)) +

             "&oneTp=" + encodeURIComponent(delimInsert(results.touchpointAnalysis.oneTp)) +
             "&multiTp=" + encodeURIComponent(delimInsert(results.touchpointAnalysis.multiTp)) +
             "&valueOfMultiTouchpointRatio=" + encodeURIComponent(toFixed(results.valueOfMultiTouchpointRatio,2)) +

             "&unaccountedTps=" + encodeURIComponent(delimInsert(results.multiTpAnalysis.unaccountedTps)) +

             "&upperFunnelCampaignValue=" + encodeURIComponent(results.campaignPosition.upperFunnelCampaigns[0][2].toString()) +
             "&lowerFunnelCampaignValue=" + encodeURIComponent(results.campaignPosition.lowerFunnelCampaigns[0][2].toString()) +
             "&genericStart=" + encodeURIComponent(results.brandTouchpoints.generic.multitouchStage.start) +
             "&genericEnd=" + encodeURIComponent(results.brandTouchpoints.generic.multitouchStage.end) +
             "&genericAny=" + encodeURIComponent(results.brandTouchpoints.generic.multitouchStage.any) +
             "&brandStart=" + encodeURIComponent(results.brandTouchpoints.brand.multitouchStage.start) +
             "&brandEnd=" + encodeURIComponent(results.brandTouchpoints.brand.multitouchStage.end) +
             "&brandAny=" + encodeURIComponent(results.brandTouchpoints.brand.multitouchStage.any) +
             "&genericBeforeBrandEndRatio=" + encodeURIComponent(results.genericBeforeBrandEndRatio) +
             "&genericStartBrandEnd=" + encodeURIComponent(results.genericStartBrandEnd) +
             "&genericTps=" + encodeURIComponent(results.brandTouchpoints.generic.multitouchStage.touchpoints) +
             "&brandTps=" + encodeURIComponent(results.brandTouchpoints.brand.multitouchStage.touchpoints) +
             
             "&mobileBeginningVsEnd=" + encodeURIComponent(results.deviceRatios.mobileBeginningVsEnd) +
             "&deskTabAtEnd=" + encodeURIComponent(results.deviceRatios.desktab.end) +
             "&deskTabAtStart=" + encodeURIComponent(results.deviceRatios.desktab.beginning) +
             "&mobileAtStart=" + encodeURIComponent(results.deviceRatios.mobile.beginning) +
             "&mobileAtEnd=" + encodeURIComponent(results.deviceRatios.mobile.end) +
             "&mobileAny=" + encodeURIComponent(results.deviceRatios.mobile.any) +
             
             "&genericGain=" + encodeURIComponent(results.genericGain) +
             "&unaccountedRatio=" + encodeURIComponent(results.multiTpAnalysis.unaccountedRatio) +
             "&uplift=" + encodeURIComponent(delimInsert(parseInt(0.05 * results.totalPathConversions))) +
             "&topPre1=" + encodeURIComponent(results.funnelSlide.topPre[0]) + 
             "&topPre2=" + encodeURIComponent(results.funnelSlide.topPre[1]) + 
             "&topPre3=" + encodeURIComponent(results.funnelSlide.topPre[2]) + 
             "&topLcCmp=" + encodeURIComponent(results.funnelSlide.topLcCmp) + 
             "&topLcCmpCredit=" + encodeURIComponent(results.funnelSlide.topLcCmpCredit);

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

    if ($(".dz-kimmich-inner").html().indexOf('error') > -1) { return; }

    // Copy Spreadsheet for Charts
    $('#current_status').html("Copying Sheets for Charts...");

    dataLayer.push({
      'event':'VirtualPageview',
      'virtualPageURL':'kimmich/sheet_copy',
      'virtualPageTitle' : 'Kimmich copying Sheets for Charts...'
    });

    var copySheet = gapi.client.drive.files.copy({
      'fileId': '1kQV27W_BuZ8-75gdQGN4whSJMXfK0l0ds2u0kGtwRM8',
      'name': '[qimmiq for Attribution Backend] ' + $('#division').val()
    });

    copySheet.then(function(bc) {

      if ($(".dz-kimmich-inner").html().indexOf('error') > -1) { return; }

      $('#current_status').html("Updating Values in Sheets...");

      dataLayer.push({
        'event':'VirtualPageview',
        'virtualPageURL':'kimmich/sheet_updating',
        'virtualPageTitle' : 'Kimmich updating Values in Sheets...'
      });

      gapi.client.sheets.spreadsheets.values.batchUpdate({
        'spreadsheetId': bc.result.id,
        'valueInputOption': 'USER_ENTERED',
        'data': [{
          'range': 'Pie!B2:B3',
          'values': [[parseFloat(results.touchpointAnalysis.singleTpRatio)],
                     [parseFloat(results.touchpointAnalysis.multiTpRatio)]]
        }, {
          'range': 'Analysis!A2:F',
          'values': results.fullBrandAnalysis
        }]
      }).then(function () {}, function (reason) { 
        executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
      });

      gapi.client.sheets.spreadsheets.get({
        'spreadsheetId': bc.result.id
      }).then(function (ss) {

        $('#current_status').html("Copying Slides...");

        dataLayer.push({
          'event':'VirtualPageview',
          'virtualPageURL':'kimmich/slides_copying',
          'virtualPageTitle' : 'Kimmich copying Slides...'
        });

        gapi.client.drive.files.copy({
          'fileId': '1MpjIXYl8ayQ1_Mukjw28u-WsmPDUjRixFjIvyWjBNdo',
          'name': '[qimmiq for AW Attribution] ' + $('#division').val()
        }).then(function(pr) {
          // Read Presentation
          return gapi.client.slides.presentations.get({
            'presentationId': pr.result.id,
          });
        }, function (reason) { 
          executionError('Execution Failure', 
          reason.result.error.code,
          reason.result.error.message);
        }).then(function(pr) {

          // Update Presentation copy
          $('#current_status').html("Updating Slides...");

          dataLayer.push({
            'event':'VirtualPageview',
            'virtualPageURL':'kimmich/slides_updating',
            'virtualPageTitle' : 'Kimmich updating Slides...'
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
                    'translateX': 410,
                    'translateY': 90,
                    'unit': 'PT'
                  }
                }
              }
            });

          var upperFunnelCampaignValue = 'This campaign is often included early in the path, generating awareness and consideration.';
          var lowerFunnelCampaignValue = 'This campaign is often included late in the path, close to the actual conversion.';

          if (results.campaignPosition.upperFunnelCampaigns[0][2] > 1) {
            upperFunnelCampaignValue = 'is ' + results.campaignPosition.upperFunnelCampaigns[0][2].toString() + ' times more likely to start a conversion path than finish it';
          } 

          if (results.campaignPosition.lowerFunnelCampaigns[0][3] > 1) {
            lowerFunnelCampaignValue = 'is ' + results.campaignPosition.lowerFunnelCampaigns[0][3].toString() + ' times more likely to end a conversion path than start it';
          }

          var valueOfMultiTouchpointRatio = '';
          if (results.valueOfMultiTouchpointRatio > 1.05) {
            valueOfMultiTouchpointRatio = 'A conversion with 2+ ad clicks is worth ' + toFixed(results.valueOfMultiTouchpointRatio,2) + 'x the value of a conversion with 1 ad click'
          }

          var exec2 = {
            'title': 'GENERICS DRIVE VALUE', 
            'num': results.shiftToGenericRatio + '%', 
            'subtitle': 'Increase in conversion credit for generic campaigns under ' + results.metaData.modelsToCompare.after + ' Attribution'}

          if ((parseFloat(results.shiftToGenericRatio) < 2 || isNaN(results.shiftToGenericRatio)) && !isNaN(results.deviceRatios.mobileBeginningVsEnd) && results.deviceRatios.mobileBeginningVsEnd > 1.2) {
            exec2.title = 'MOBILE DRIVES VALUE';
            exec2.num = results.deviceRatios.mobileBeginningVsEnd + 'x';
            exec2.subtitle = 'more likely to be at the start than at the end of conversion paths';
          } else if ((parseFloat(results.shiftToGenericRatio) < 2 || isNaN(results.shiftToGenericRatio)) && (isNaN(results.deviceRatios.mobileBeginningVsEnd) || results.deviceRatios.mobileBeginningVsEnd <= 1.2)) {
            exec2.title = 'MOBILE DRIVES VALUE';
            exec2.num = results.deviceRatios.mobile.any + '%';
            exec2.subtitle = 'of Conversions involved a Mobile Device';
          }

          // Brand vs Generics deck

          var GBDeck = {
            'GBtitle': '',
            'GBsubtitle': '',
            'GBRHSnum': '',
            'GBRHSsub': '',
            'GBLHStitle': '',
            'GBLHSsub': ''
          }

          var GBtemp; 
          var GBtemp2;

          if (results.brandTouchpoints.generic.multitouchStage.start /
              results.brandTouchpoints.generic.multitouchStage.end > 1.05) {
            GBDeck.GBtitle = 'Generic Campaigns are generally undervalued';
          } else {
            GBDeck.GBtitle = 'Generic and Brand Campaigns play distinctive roles';
          }

          if (results.brandTouchpoints.generic.multitouchStage.start /
              results.brandTouchpoints.generic.multitouchStage.end > 1.05) {
            GBtemp = asPct((results.brandTouchpoints.generic.multitouchStage.start / results.brandTouchpoints.generic.multitouchStage.end) - 1, 1);
            GBDeck.GBsubtitle = 'Generics are ' + GBtemp + '% more likely to be at the beginning as opposed to at the end of conversion paths';
          } else if (results.brandTouchpoints.generic.multitouchStage.end / results.touchpointAnalysis.multiTp < 0.2) {
            GBtemp = asPct(results.brandTouchpoints.generic.multitouchStage.any / results.touchpointAnalysis.multiTp, 0);
            GBtemp2 = asPct(results.brandTouchpoints.generic.multitouchStage.end / results.touchpointAnalysis.multiTp, 0);
            GBDeck.GBsubtitle = 'Generics are on ' + GBtemp + '% of conversion paths, but the last click on only ' +  GBtemp2 + '% of paths';
          } else {
            GBtemp = asPct(results.brandAndGeneric / results.touchpointAnalysis.multiTp, 0);
            GBDeck.GBsubtitle = GBtemp + '% of paths contain a Generic click and a Brand click';
          }

          if (results.genericBeforeBrandEndRatio > 0.35) {
            GBtemp = asPct(results.genericBeforeBrandEndRatio, 0);
            GBDeck.GBLHStitle = GBtemp + '% of Conversions with Brand as the last click had previous Generic clicks';
            GBDeck.GBLHSsub = 'Under a last-click model, Generics get no credit for these conversions';
          } else if (results.genericStartBrandEnd / results.brandTouchpoints.generic.multitouchStage.start > 0.35) {
            GBtemp = asPct(results.genericStartBrandEnd / results.brandTouchpoints.generic.multitouchStage.start, 0);
            GBDeck.GBLHStitle = GBtemp + '% of Conversions that start with a Generic click end with a Brand click';
            GBDeck.GBLHSsub = 'Under a last-click model, Generics get no credit for these conversions';
          } else {
            GBtemp = asPct(results.brandTouchpoints.generic.multitouchStage.start / results.touchpointAnalysis.multiTp, 0);
            GBtemp2 = asPct(results.brandTouchpoints.generic.multitouchStage.end / results.touchpointAnalysis.multiTp, 0);
            GBDeck.GBLHStitle = GBtemp + '% of Conversions start with a Generic click, ' + GBtemp2 + '% end with a Generic click';
            GBDeck.GBLHSsub = 'Generics are important on the whole path to conversion';
          }

          GBtemp = asPct(results.brandTouchpoints.generic.multitouchStage.any / results.touchpointAnalysis.multiTp, 0);
          GBtemp2 = asPct(results.brandTouchpoints.generic.multitouchStage.touchpoints / 
              (results.brandTouchpoints.brand.multitouchStage.touchpoints + results.brandTouchpoints.generic.multitouchStage.touchpoints), 0);

          if (GBtemp > GBtemp2) {
            GBDeck.GBRHSnum = GBtemp;
            GBDeck.GBRHSsub = 'of Conversions had a Generic click on the path to conversion';
          } else {
            GBDeck.GBRHSnum = GBtemp2;
            GBDeck.GBRHSsub = 'of clicks on conversion paths are Generic clicks';
          }

            // Push Text changes
            var textChanges = [
              ['{advertiserName}', results.advertiserName],
              ['{today}', results.today],
              ['{altModel}', results.metaData.modelsToCompare.after],
              ['{exec2title}', exec2.title],
              ['{exec2subtitle}', exec2.subtitle],
              ['{exec2num}', exec2.num],
              ['{oneTp}', delimInsert(results.touchpointAnalysis.oneTp)],
              ['{multiTp}', delimInsert(results.touchpointAnalysis.multiTp)],
              ['{multiTpRatio}', results.touchpointAnalysis.multiTpRatio],
              ['{unaccountedTps}', delimInsert(results.multiTpAnalysis.unaccountedTps)],
              ['{unaccountedRatio}', results.multiTpAnalysis.unaccountedRatio],
              ['{valueOfMultiTouchpointRatio}', valueOfMultiTouchpointRatio],
              ['{lastTps}', delimInsert(results.multiTpAnalysis.lastTps)],
              ['{upperFunnelCampaign}', results.campaignPosition.upperFunnelCampaigns[0][0]],
              ['{upperFunnelCampaignValue}', upperFunnelCampaignValue],
              ['{lowerFunnelCampaign}', results.campaignPosition.lowerFunnelCampaigns[0][0]],
              ['{lowerFunnelCampaignValue}', lowerFunnelCampaignValue],
              ['{GBtitle}', GBDeck.GBtitle],
              ['{GBsubtitle}', GBDeck.GBsubtitle],
              ['{GBRHSnum}', GBDeck.GBRHSnum],
              ['{GBRHSsub}', GBDeck.GBRHSsub],
              ['{GBLHStitle}', GBDeck.GBLHStitle],
              ['{GBLHSsub}', GBDeck.GBLHSsub],
              ['{mobileBeginningVsEnd}', results.deviceRatios.mobileBeginningVsEnd],
              ['{deskTabAtEnd}', results.deviceRatios.desktab.end],
              ['{deskTabAtStart}', results.deviceRatios.desktab.beginning],
              ['{mobileAtStart}', results.deviceRatios.mobile.beginning],
              ['{mobileAtEnd}', results.deviceRatios.mobile.end],
              ['{mobileAny}', results.deviceRatios.mobile.any],
              ['{genericGain}', results.genericGain],
              ['{uplift}', delimInsert(parseInt(0.05 * results.totalPathConversions))],
              ['{dateRange}', results.metaData.dateRange.topPathsReport],
              ['{historyWindow}', results.metaData.historyWindow.topPathsReport],
              ['{totalPathConversions}', delimInsert(results.totalPathConversions)],
              ['{curModel}', results.metaData.modelsToCompare.before],
              ['{campaignClassBrand}', results.campaignClassification.brand.toString()],
              ['{campaignClassGeneric}', results.campaignClassification.generic.toString()],
              ['{genericTotalConvs}', delimInsert(results.brandTouchpoints.generic.multitouchStage.any)],
              ['{genericConvsOfTotal}', results.genericConvsOfTotal],
              ['{brandConvsOfTotal}', results.brandConvsOfTotal],
              ['{brandTotalConvs}', delimInsert(results.brandTouchpoints.brand.multitouchStage.any)],
              ['{mobileAnyTotal}', delimInsert(results.deviceRatios.mobile.anyTotal)],
              ['{mobileRatioAny}', results.deviceRatios.mobileRatioAny],
              ['{desktabRatioAny}', results.deviceRatios.desktabRatioAny],
              ['{desktabAnyTotal}', delimInsert(results.deviceRatios.desktab.anyTotal)],
              ['{brandTerms}', results.brandTerms],
              ['{om1}', results.altCredit[0].toString()],
              ['{om2}', results.altCredit[1].toString()],
              ['{om3}', results.altCredit[2].toString()],
              ['{om4}', results.altCredit[3].toString()],
              ['{brandSpend}', asPct(results.spendDistribution.ratio, 0)],
              ['{genericSpend}', asPct(1 - results.spendDistribution.ratio, 0)],
              ['{topLcCmp}', results.funnelSlide.topLcCmp],
              ['{topLcCmpCreditAbs}', delimInsert(results.funnelSlide.topLcCmpCreditAbs)],
              ['{topLcCmpCredit}', asPct(results.funnelSlide.topLcCmpCredit, 0)],
              ['{uqOnPath}', results.funnelSlide.uqOnPath.toString()],
              ['{topPre1}', results.funnelSlide.topPre[0]],
              ['{topPre2}', results.funnelSlide.topPre[1]],
              ['{topPre3}', results.funnelSlide.topPre[2]],
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

            // Push Slide deletion changes
            if (results.metaData.modelsToCompare.after != "Data-Driven") {
              totalBatchUpdates.push({
                'deleteObject': {
                  'objectId': pr.result.slides[9].objectId
                }
              })
            } else{
              totalBatchUpdates.push({
                'deleteObject': {
                  'objectId': pr.result.slides[8].objectId
                }
              })
            }

            // if (results.campaignPosition.upperFunnelCampaigns[0][0] == "0" ||
            //     results.campaignPosition.lowerFunnelCampaigns[0][0] == "0") {
            //   totalBatchUpdates.push({
            //     'deleteObject': {
            //       'objectId': pr.result.slides[5].objectId
            //     }
            //   })
            // } 

            totalBatchUpdates.push({
              'updateTextStyle': {
                'objectId': pr.result.slides[0].pageElements[2].objectId,
                'cellLocation': {
                  'rowIndex': 0,
                  'columnIndex': 0
                },
                'style': {
                  'foregroundColor': {
                    'opaqueColor': {
                      'rgbColor': {
                        'red': 1,
                        'green': 1,
                        'blue': 1
                      }
                    }
                  },
                  'underline': true,
                  'link': {
                    "url": ss.result.spreadsheetUrl + '#gid=' + ss.result.sheets[1].properties.sheetId
                  }
                },
                'fields': '*'
              }
            })

          return gapi.client.slides.presentations.batchUpdate({
            'presentationId': pr.result.presentationId,
            'requests': totalBatchUpdates
          });
        }).then(function(rs) {
          if ($(".dz-kimmich-inner").html().indexOf('error') > -1) { return; }
          $('.dz-kimmich-inner').html('<i class="material-icons">done_all</i> <br><a href="https://docs.google.com/presentation/d/' + rs.result.presentationId + '/" target="_blank">Done, you can now access your report <u>here</u>.</a>');

          dataLayer.push({
            'event':'VirtualPageview',
            'virtualPageURL':'kimmich/report_success',
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
      });
    });
  });
}