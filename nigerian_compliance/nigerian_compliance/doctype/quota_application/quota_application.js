// Copyright (c) 2025, Abdul Mannan Shaikh	 and contributors
// For license information, please see license.txt

frappe.ui.form.on("Quota Application", {
	refresh: function (frm) {
		set_query_filters(frm);
		disable_fields(frm);
		update_assignment_message(frm);
	},
	after_workflow_action(frm) {
		populate_approved_positions(frm);
	},
});

function disable_fields(frm) {
	frm.get_field("approved_positions").grid.cannot_add_rows = true;
	frm.get_field("approved_positions").grid.cannot_delete_rows = true;
	frm.get_field("approved_positions").grid.refresh();
	const state = frm.doc.workflow_state;

	const is_gov_qty_editable = state === "Pending for Government Approval";

	frm.get_field("quota_applications").grid.update_docfield_property(
		"gov_approved_qty",
		"read_only",
		!is_gov_qty_editable
	);

	const approval_fields = [
		"quota_issue_date",
		"quota_expiry_date",
		"letter",
		"gov_quota_approved",
	];

	const hidden_in_states = ["Pending for Government Approval", "Quota Approved"];
	const should_show_fields = hidden_in_states.includes(state);

	approval_fields.forEach((field) => {
		frm.toggle_display(field, should_show_fields);
	});
}

function set_query_filters(frm) {
	frm.set_query("agency", function () {
		return {
			filters: {
				supplier_group: "Visa Agency",
			},
		};
	});
	frm.set_query("document", "submit_documents", function (doc, cdt, cdn) {
		return {
			filters: {
				for_doctype: frm.doctype,
			},
		};
	});
	frm.set_query("document", "receive_documents", function (doc, cdt, cdn) {
		return {
			filters: {
				for_doctype: frm.doctype,
			},
		};
	});
	frm.set_query("designation", "quota_applications", function (doc, cdt, cdn) {
		return {
			filters: {
				custom_is_quota_position: 1,
			},
		};
	});
	frm.set_query("designation", "approved_positions", function (doc, cdt, cdn) {
		return {
			filters: {
				custom_is_quota_position: 1,
			},
		};
	});
	frm.set_query("employee", "approved_positions", function (doc, cdt, cdn) {
		return {
			filters: {
				custom_employment_classification: "Expatriate",
			},
		};
	});
}

function populate_approved_positions(frm) {
	if (frm.doc.workflow_state !== "Quota Approved") {
		return;
	}

	frm.clear_table("approved_positions");

	(frm.doc.quota_applications || []).forEach(function (row) {
		if (row.gov_approved_qty && row.gov_approved_qty > 0) {
			for (let i = 0; i < row.gov_approved_qty; i++) {
				frm.add_child("approved_positions", {
					designation: row.designation,
					zone: row.zone,
					branch: row.branch,
				});
			}
		}
	});

	frm.refresh_field("approved_positions");
	frm.save();
}

function update_assignment_message(frm) {
	if (!frm.doc.approved_positions || frm.doc.approved_positions.length === 0) {
		frm.layout.hide_message();
		return;
	}

	const unassigned_count = frm.doc.approved_positions.filter((row) => !row.employee).length;

	if (unassigned_count > 0) {
		frm.layout.show_message(
			`You have <strong>${unassigned_count}</strong> approved position(s) that are not yet assigned to an employee.`,
			"orange",
			true
		);
	} else {
		frm.layout.show_message(`All approved positions have been assigned.`, "green");
	}
}
