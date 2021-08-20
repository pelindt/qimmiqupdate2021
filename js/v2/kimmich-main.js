$(document).ready(function () {
	$('#brandterm').focusout(function() {
		calculations();
	});

	$('.ttip-focus').tooltip({
    	placement: "top",
    	trigger: "focus",
    	html: true
    }); 

    $('.ttip-hover').tooltip({
    	placement: "top",
    	html: true
    }); 

	// Modal initializer
	$('.modalTriggers').click(function () {
		$('#mainModalImg').attr('src', '/static/img/screens/' + this.id + '.png');
	});
})

$("#step1_done, #step2_button_top").click(function() {

	if (brand_valid() && ldap_valid() && cid_valid() && client_valid()) {
		if($(this).attr('id') == 'step1_done') {
			$("#step2_button_top").trigger('click')
		}

		$(".lastStepPlaceholder").hide();
      	$(".lastStepRow").show();
	} else if (!ldap_valid()) {
		snackbar("Your LDAP doesn't look like an LDAP - did you include an @?");
	} else if (!cid_valid()) {
		snackbar("Your CID doesn't look like a CID - it should only include 5-20 digits.");
	} else {
		snackbar("Please enter Client Name, Customer ID, LDAP and Brand terms to continue");
	}
});

function ldap_valid() {
	return new RegExp(/^[A-Za-z0-9_-]+$/, "i").test($('#ldap').val());
}

function brand_valid() {
	return new RegExp(/^.+$/, "i").test($('#brandterm').val());
}

function client_valid() {
	return new RegExp(/^.+$/, "i").test($('#division').val());
}

function cid_valid() {
	return new RegExp(/^[0-9]{5,20}$/, "i").test($('#cid').val());
}

function snackbar(msg) {
	$('#snackbar').html(msg);
	$('#snackbar').addClass('show');
	setTimeout(function(){ $('#snackbar').removeClass('show'); }, 5000);
}

$(document).on('click', '#create_report', function() {
	// GTM - Report Requested

	checkAuth();

	$('.dz-kimmich-inner').html('<i class="material-icons rotating">loop</i> <br>Creating report - <b>DO NOT</b> close this window! <br> <span id="current_status"></span>');
	
	logInfo();
});

// Restart form when done
$("#restart_form").click(function() {
	$("#division").val('');
	$("#cid").val('');
	$("#brandterm").val('');
	$("#restart_form").hide();
	$("#step1_button_top").trigger('click');
	$(".not_class").hide();
	topPathsReport = null; 
	attributionModellingReport = null;
	devicePathsReport = null;
	results = null;
});

$('#debug').click(function() {
	var debuginfo = JSON.stringify(results);
	//$('#debug-text').val(debuginfo);
	//var copyTextarea = document.querySelector('#debug-text').select();
	//var successful = document.execCommand('copy');
	window.open('mailto:oliverkiderle@google.com?subject=Bug+Report&cc=meijerhof@google.com&body=[Please+include+your+reports+as+attachments]%0A%0A' + debuginfo, '_blank');
})

// Division form validation
$(".input-control").focusout(function() {
	if ((this.id!='cid' && this.id!='ldap' && $(this).val().length > 0) || (this.id=='ldap' && ldap_valid()) || (this.id=='cid' && cid_valid())) {
		$(this).parent().addClass("has-success");
		$(this).parent().removeClass("has-error");
	}
	else { 
		$(this).parent().addClass("has-error");
		$(this).parent().addClass("has-feedback");
		$(this).parent().removeClass("has-success");
	}
});