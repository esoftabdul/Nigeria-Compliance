import frappe
from frappe.model.document import Document


class QuotaApplication(Document):
	def on_update(self):
		doc_before_save = self.get_doc_before_save()

		old_assignments = {}
		if doc_before_save and doc_before_save.get("approved_positions"):
			old_assignments = {
				row.name: row.employee for row in doc_before_save.approved_positions if row.employee
			}

		for current_row in self.get("approved_positions"):
			old_employee = old_assignments.get(current_row.name)
			new_employee = current_row.employee

			if old_employee == new_employee:
				continue

			if old_employee:
				self._update_employee_quota(old_employee, None)

			if new_employee:
				self._update_employee_quota(new_employee, self.name)

	def _update_employee_quota(self, employee_id, quota_application_name):
		if frappe.db.exists("Employee", employee_id):
			frappe.db.set_value("Employee", employee_id, "custom_quota_reference", quota_application_name)
		else:
			frappe.throw(
				f"Employee: {employee_id} Does not exist. Cannot update quota reference.",
				"Quota Application Update",
			)
