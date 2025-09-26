import frappe


def on_update_or_create(doc, method):
	doc_before_save = doc.get_doc_before_save()
	if doc_before_save and doc_before_save.party_type == "Employee" and doc_before_save.party:
		if doc.party != doc_before_save.party:
			try:
				old_employee = frappe.get_doc("Employee", doc_before_save.party)

				updated_accounts = [
					d for d in old_employee.get("custom_bank_accounts") if d.account != doc.name
				]
				old_employee.set("custom_bank_accounts", updated_accounts)
				old_employee.save(ignore_permissions=True)

			except frappe.DoesNotExistError:
				pass

	if doc.party_type == "Employee" and doc.party:
		try:
			employee = frappe.get_doc("Employee", doc.party)
			bank_accounts_table = employee.get("custom_bank_accounts")

			is_already_linked = any(d.account == doc.name for d in bank_accounts_table)

			if not is_already_linked:
				employee.append(
					"custom_bank_accounts",
					{"account": doc.name, "bank_jurisdiction": doc.custom_bank_jurisdiction},
				)
				employee.save(ignore_permissions=True)

		except frappe.DoesNotExistError:
			frappe.log_error(f"Employee {doc.party} not found", "Bank Account Sync")
		except Exception:
			frappe.log_error(frappe.get_traceback(), "Bank Account Sync Error")


def on_delete(doc, method):
	if doc.party_type == "Employee" and doc.party:
		try:
			employee = frappe.get_doc("Employee", doc.party)

			updated_accounts = [d for d in employee.get("custom_bank_accounts") if d.account != doc.name]

			employee.set("custom_bank_accounts", updated_accounts)

			employee.save(ignore_permissions=True)

		except frappe.DoesNotExistError:
			pass
		except Exception:
			frappe.log_error(frappe.get_traceback(), "Bank Account Deletion Sync Error")
