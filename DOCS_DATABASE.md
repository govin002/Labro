# Hospital Management System - Database Documentation

This document describes the data structures used in the Hospital Management System Frontend. Although the current implementation uses mock data, these structures represent the underlying database schema.

## 1. Patients Table
Stores the master record of all registered patients.

| Field | Type | Description |
| :--- | :--- | :--- |
| `patientId` | `String (PK)` | Unique 8-digit identifier for the patient. |
| `registeredDate` | `Date` | The date the patient was first registered. |
| `title` | `Enum` | MR., MRS., MS., etc. |
| `firstName` | `String` | Patient's first name. |
| `middleName` | `String` | Patient's middle name (optional). |
| `lastName` | `String` | Patient's last name. |
| `gender` | `Enum` | Male, Female, Other. |
| `ageValue` | `Number` | Age value at time of registration. |
| `ageUnit` | `Enum` | Yrs., Mon., Days. |
| `mobile` | `String` | Contact number. |
| `email` | `String` | Email address. |
| `address` | `String` | Residential address. |
| `refByDr` | `String` | Referring doctor or "SELF". |
| `patientType` | `String` | Category of patient (e.g., Staff, General). |
| `sampleSource` | `Enum` | Internal (In-house), External. |
| `photo` | `String` | Base64 string or URI for patient photo. |

---

## 2. Bills Table
Stores financial transactions associated with a patient visit.

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique UUID or timestamp-based identifier. |
| `billNo` | `String` | Human-readable bill number (e.g., 202602141). |
| `patientId` | `String (FK)` | Reference to the `patientId` in Patients table. |
| `date` | `Date` | Billing date and time. |
| `totalAmount` | `Number` | Gross amount (Sum of all item fees). |
| `discountAmount` | `Number` | Global discount applied to the entire bill. |
| `netPayable` | `Number` | `totalAmount - discountAmount`. |
| `paymentReceived`| `Number` | Total amount paid across all payment methods. |
| `dueAmount` | `Number` | `netPayable - paymentReceived`. |
| `status` | `Enum` | Paid, Partially Paid, Unpaid. |
| `paymentType` | `Enum` | Cash, Online, Mixed. |

### BillItems (Relationship: 1 Bill to Many Items)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique identifier. |
| `billId` | `String (FK)` | Reference to the parent Bill. |
| `testName` | `String` | Name of the service or lab test. |
| `fees` | `Number` | Standard fee for the test. |
| `itemDiscount` | `Number` | Discount applied to this specific item. |

---

## 3. Reports & Results
Stores clinical data, test statuses, and parameter results.

### Reports Table (Master Session)
| Field | Type | Description |
| :--- | :--- | :--- |
| `labNo` | `String (PK)` | Unique Laboratory tracking number. |
| `patientId` | `String (FK)` | Reference to the Patient. |
| `visitDate` | `Date` | Date of sample collection/visit. |
| `overallStatus` | `Enum` | Pending, Partially Verified, Authorized. |

### ReportDetails (Specific Panels)
| Field | Type | Description |
| :--- | :--- | :--- |
| `labNo` | `String (FK)` | Reference to the Report session. |
| `testName` | `String` | Name of the test panel (e.g., Hematology, CBC). |
| `status` | `Enum` | Pending, Completed, Verified, Authorized. |
| `method` | `String` | Analytical method used (e.g., Fully Automated). |
| `remarks` | `String` | Clinical interpretation or panel-level remarks. |
| `printed` | `Boolean` | Flag to track if the report has been printed. |

### ResultValues (Parameter Level)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (PK)` | Unique identifier for the result value. |
| `labNo` | `String (FK)` | Reference to the Report session. |
| `testName` | `String (FK)` | Reference to the parent test panel. |
| `parameter` | `String` | Parameter name (e.g., Hemoglobin). |
| `value` | `String` | The actual result value (String to support non-numeric). |
| `unit` | `String` | Measurement unit (e.g., g/dL, mg/dL). |
| `normalRange` | `String` | Reference range provided by the lab. |
| `flag` | `Enum` | `HIGH`, `LOW`, or `NORMAL`. |
| `comment` | `String` | Per-parameter specific comment. |
| `parameterRemark`| `Enum` | Repeat Test, Hemolyzed, Confirmed, etc. |

---

## 4. Settings & Catalog
Master data for system configuration.

### Services Master
- `name`: Name of the test.
- `fees`: Default charge.
- `category`: Department (Hematology, Biochemistry, etc).

### Doctor Master
- `id`: Unique ID.
- `name`: Doctor's name.
- `specialization`: Specialization area.

### Agent Master
- `id`: Unique ID.
- `name`: Agent/Collection Center name.
- `share`: Default commission/fraction.
