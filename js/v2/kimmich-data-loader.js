'use strict';

$(document).ready(function (){

  // Validate LDAP
  function ldap_valid() {
    return new RegExp(/[A-Z0-9._%+-]+/, "i").test($('#ldap').val());
  }

  // Setup the dnd listeners.
  $('.dz-frame-kimmich').bind('dragenter', function(e){
        handleDragEnter(e);
    });

    $('.dz-frame-kimmich').bind('dragover', function(e){
        handleDragOver(e);
    });

    $('.dz-frame-kimmich').bind('dragleave', function(e){
        handleDragLeave(e);
    });

    $('.dz-frame-kimmich').bind('drop', function(e){
        handleFileSelect(e);
    });

  function handleDragEnter(e) {
    $('#report_one').removeClass('dz-inactive');
    $('#report_one').addClass('dz-hover');
    //$($(this).children()[0]).html('Go for it');
  }

  function handleDragLeave(e) {
    $(this).removeClass('dz-hover');
    $(this).addClass('dz-inactive');
    //$($(this).children()[0]).html('Drop all four files simultaneously here');
  }

  function handleDragOver(e) {
    e.stopPropagation();
      e.preventDefault();
      e.originalEvent.dataTransfer.dropEffect = 'copy';
  }

  function handleFileSelect(e) {
    var csvFile;

    e.stopPropagation();
    e.preventDefault();

      var files = e.originalEvent.dataTransfer.files; // FileList object
      
      for (var i = files.length - 1; i >= 0; i--) {
        var reader = new FileReader();

        reader.onloadend = function(f) {
      // Check if CSV and length
          if (f.target.readyState == FileReader.DONE) {
              csvFile = readCsv(f.target.result);
              buildFile(csvFile);
            }

            if (topPathsReport && attributionModellingReport && devicePathsReport) {
              $('.dz-kimmich-inner').html('<i class="material-icons rotating">loop</i> <br>Calculating - <b>DO NOT</b> close this window! <br> <span id="current_status"></span>');

              try {
                calculations();
                $('.dz-kimmich-inner').html('<i class="material-icons">done</i> <br><span id="create_report">Click <u>here</u> to create Report! </span><br><span data-toggle="modal" data-target="#brandvalidator">Optional: Click <u>here</u> to preview the Brand Classification</span>');
              } catch(e) {
                $('.dz-kimmich-inner').html('<i class="material-icons">error</i> <br>There was a problem creating your Report!</span>');
                console.log(e.stack);
              }
            }
        }

        reader.readAsText(files[i]);
      }
  }
});

