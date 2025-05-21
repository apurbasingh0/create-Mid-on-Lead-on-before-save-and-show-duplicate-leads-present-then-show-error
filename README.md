"# create-Mid-on-Lead-on-before-save-and-show-duplicate-leads-present-then-show-error" 
# Lead MID Checker

This Salesforce project automatically generates a **MID** (Merchant ID) when a Lead is created and prevents creation if the MID or Email already exists in either the Lead or Account object.

## 🚀 Features
- MID auto-generation using Apex callout.
- Duplicate MID detection across Lead and Account.
- Prevents Lead creation if a duplicate MID is detected.
- Lightning Web Component for seamless UI.
- Toast messages for feedback and validation errors.

## 🛠️ Components

### Apex Class
- **leadRecordListCreation.cls**  
  - `creationMid`: Calls external API to generate MID and checks for duplication.
  - `getDuplicateRecordsLead`: Returns Lead records matching the provided email.
  - `getDuplicateRecordsAccount`: Returns Account records matching the provided email.

### Lightning Web Component
- **newLeadRecordListViewButton**
  - Submits Lead form data and injects MID before save.
  - Displays duplicate Lead and Account records.
  - Navigation to record detail pages from duplicate list.
  - Displays success, error, and warning toast messages.

## 📋 Requirements
- Salesforce Org (API-enabled).
- External API integration for MID generation.
- Lead object must contain the following fields:
  - `MID__c`
  - `Email`
  - `MobilePhone`
  - `Lead_Type__c`
  - `LeadSource`


```

📌 Notes
Duplicate check is done using Email and MID__c.

The external MID API must be available and responsive.
This button call on this view button and to call the LWC need to create aura for list view button.

