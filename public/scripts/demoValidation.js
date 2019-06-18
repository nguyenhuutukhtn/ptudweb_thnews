$().ready(function() {
	$("#accountForm").validate({
		onfocusout: false,
		onkeyup: false,
		onclick: false,
		rules: {
			"email": {
				required: true,
				email=true,
			},
			"password": {
				required: true,
				minlength: 6
			},
			"re-password": {
				equalTo: "#password",
				minlength: 6
			}
		}
	})
});
          