# Shareholder Registration Form - AA Ltd

Purpose: Collect legal shareholder information to populate AA Ltd’s company register.

### Section 1: Shareholder Information

1. Full legal name (required)


2. Address (required)


3. Email (required for communications)


4. Pseudonym / Chosen number (for artwork / COA display)



### Section 2: Share Details

1. Edition type (select one):

A4 — Active original edition

C4 — Renewal edition

R4 — Residual edition (archival, no voting rights)



2. Number of shares (pre-filled or selected)


3. NFC tag ID (optional, pre-assigned if using physical COA)



### Section 3: Consent & Declaration

Checkbox: “I confirm the information provided is true and correct. I consent to it being used to populate the company register of AA Ltd.”

Checkbox: “I understand that by submitting this form, I am formally becoming a shareholder of AA Ltd and am legally bound by the Companies Act 2006.”


### Section 4: Digital Signature

Field: Type full name

Field: Date

Optional: Draw signature (tablet/screen)

Hidden field: Lightning payment transaction ID (pre-filled via webhook)


### Section 5: Submission

Submit button → generates PDF record with e-signature, timestamp, and encrypted storage

Confirmation page: “Thank you. Your shareholder registration is complete. Your COA will be issued shortly.”



---

## NOTES

Foxit e-sign can handle the signature + PDF generation + timestamp.

Include Lightning payment verification in the workflow before form access.

PDF output can be archived in your internal register and optionally linked to NFC / COA for provenance.
