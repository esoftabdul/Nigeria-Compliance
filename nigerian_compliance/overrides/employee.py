# import frappe
# from frappe.exceptions import ValidationError

# def validate(self,method=None):
#     validate_under_study(self)

# def validate_under_study(self):
#     max_rows = frappe.get_single_value("Nigeria Compliance Settings", "max_number_of_national_allowed")
#     if len(self.custom_under_study) > max_rows:
#         frappe.msgprint(f"You can only add up to {max_rows} National Employee(s) as configured in Compliance Settings.")
