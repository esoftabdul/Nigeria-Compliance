# Nigerian Compliance Management for Frappe & ERPNext

This app enhances Frappe and ERPNext with features tailored for managing employee compliance specific to Nigerian labor and immigration laws.

It introduces critical customizations to the Employee doctype and adds new doctypes to handle expatriate quotas, visa tracking, and other regional requirements.

---

## ✨ Key Features

### 👤 Employee Compliance & Onboarding

* **Employee Classification**: Clearly distinguish between **National** and **Expatriate** employees to apply the correct compliance rules.
* **Detailed Information**: Capture comprehensive employee data through dedicated child tables for:
    * Kin Details
    * Nominee Details
    * Guarantor Details
    * Family Details (spouse, children, parents)
    * Reference Details
* **Bank Account Management**: Differentiate between **Local** and **Overseas** bank accounts, ensuring proper payroll processing. All linked accounts are conveniently displayed in the employee's Salary section.

### 🛂 Expatriate Management

* **Dedicated Expatriate Tab**: A central location on the Employee form to manage all compliance data for foreign nationals.
* **Document Management**: Upload and track mandatory expatriate documents, with validations for required fields.
* **Visa Tracking**: Log visa details, including type and expiry dates, in the Visa Details table. This uses a standardized **Visa Type Master** for consistency.
* **Understudy Program Management**: Assign national employees as understudies to expatriates. The system includes a configurable limit in **Nigerian Compliance Settings** and will show a warning if the number of understudies exceeds the defined limit.

### 📝 Quota Application Management

* **Quota Application Doctype**: A dedicated doctype to manage the application process for expatriate quotas.
* **Direct Employee Linking**: Link expatriate employees directly to quota applications to ensure compliance and accurate tracking. The system filters to ensure only **Expatriate** employees can be selected.
* **Automated Workflow**: A built-in, multi-stage workflow for managing quota requests from draft to final government approval.

### ⚙️ Configurable Masters

The app includes several masters to ensure data is standardized and easy to manage:
* **Document Master**: Define which documents are mandatory for upload.
* **Relation Master**: Standardize kinship details (e.g., Father, Spouse).
* **Visa Type Master**: Define all available visa categories.
* **Quota Zone Master**: Classify quota applications by geographical zone.

---

## 🚀 Installation

1.  Go to your bench directory:
    ```sh
    cd ~/frappe-bench
    ```
2.  Download the app from GitHub:
    ```sh
    bench get-app [your-github-repo-url]
    ```
3.  Install the app on your site:
    ```sh
    bench --site [your-site-name] install-app nigerian_compliance
    ```

---

## Workflow & Roles

The Quota Application process is managed through a clear workflow with defined user roles:

* **Roles**:
    * **Quota User**
    * **Quota Approver**

* **Workflow States**:
    1.  **Draft**: The Quota User creates the application request.
    2.  **Applied for Approval**: The Quota Approver reviews the request and sets the approved quantity.
    3.  **Pending Government Approval**: The Quota User updates the application with the official quota quantity and related details provided by the government.
    4.  **Approved**: The system automatically populates the government-approved data into the "Approved Applications" table for record-keeping.
