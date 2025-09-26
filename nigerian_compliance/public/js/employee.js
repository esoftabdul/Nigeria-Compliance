frappe.ui.form.on("Employee", {
	refresh: function (frm) {
		fetch_compliance_settings(frm);
	},
	validate: function (frm) {
		validate_expatriate_documents(frm);
	},

	before_save: function (frm) {
		validate_under_study(frm);
	},
});

function fetch_compliance_settings(frm) {
	frappe.db
		.get_single_value("Nigeria Compliance Settings", "max_number_of_national_allowed")
		.then((max_rows) => {
			frm.max_under_study_rows = parseInt(max_rows, 10) || 0;
		});
}

function validate_under_study(frm) {
	if (frm.max_under_study_rows === undefined) {
		frappe.throw("Could not load Compliance Settings. Please refresh and try again.");
		return;
	}

	const max_rows = frm.max_under_study_rows;
	const current_rows = (frm.doc.custom_under_study || []).length;

	if (frm.confirmed_under_study) {
		return;
	}

	if (current_rows > max_rows) {
		frappe.validated = false;

		frappe.confirm(
			`As per compliance policy, only ${max_rows} 'Under Study' record(s) are permitted.
            You are currently proceeding with ${current_rows}.<br><br>
            <b>Do you want to continue saving?</b>`,

			() => {
				frm.confirmed_under_study = true;
				frappe.validated = true;
				frm.save();
			},

			() => {
				frappe.show_alert({ message: __("Save cancelled."), indicator: "orange" });
			}
		);
	}
}

function validate_expatriate_documents(frm) {
	if (!frm.doc.custom_expatriate_documents || !frm.doc.custom_expatriate_documents.length) {
		return;
	}

	const all_errors = [];

	frm.doc.custom_expatriate_documents.forEach(function (row) {
		const missing_fields_for_row = [];

		if (row.is_reg_mandatory && !row.reg) {
			missing_fields_for_row.push("<b>Reg</b>");
		}

		if (row.is_valid_date_mandatory && !row.valid_upto) {
			missing_fields_for_row.push("<b>Valid Upto</b>");
		}

		if (row.is_attachment_mandatory && !row.upload) {
			missing_fields_for_row.push("<b>Upload</b>");
		}

		if (missing_fields_for_row.length > 0) {
			const row_identifier = row.document || row.name || `Row #${row.idx}`;
			const fields_string = missing_fields_for_row.join(", ");
			const error_message = `In Document <b>${row_identifier}</b>: Please fill required fields: ${fields_string}`;

			all_errors.push(error_message);
		}
	});

	if (all_errors.length > 0) {
		const final_error_message = all_errors.join("<br>");
		frappe.throw({
			title: __("Missing Mandatory Fields"),
			message: __(final_error_message),
		});
	}
}
