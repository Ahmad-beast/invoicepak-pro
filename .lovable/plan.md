

## Plan: Fix PDF Currency Display + Implement Edit Invoice

### Bug 1: PDF showing wrong currency totals for PKR invoices

**Problem**: In `generateInvoicePDF.ts` (lines 280-283), the totals section always assumes a USD↔PKR conversion. When currency is PKR, it shows "Total (USD)" which is incorrect. For non-USD/non-PKR currencies (GBP, EUR, etc.), it also incorrectly converts.

**Fix**: Make the totals section smarter:
- Show **Subtotal** in the invoice's own currency (already correct)
- Only show **exchange rate + converted total** when a meaningful conversion exists (i.e., currency ≠ PKR, show PKR equivalent; if currency = PKR, show USD equivalent)
- For currencies like GBP/EUR/AED, the conversion rate stored is "rate to PKR", so converted amount should be in PKR, not USD
- Fix the exchange rate label to reflect the actual currency pair (e.g., "1 GBP = X PKR" instead of hardcoded "1 USD = X PKR")

**File**: `src/utils/generateInvoicePDF.ts` — lines 279-318

---

### Bug 2: Edit Invoice not loading existing data

**Problem**: `InvoiceList` links to `/dashboard/create?edit={id}` but `CreateInvoiceForm` never reads the `edit` query parameter or pre-fills form fields.

**Fix** — Changes to `src/components/dashboard/CreateInvoiceForm.tsx`:
1. Import `useSearchParams` from `react-router-dom`
2. Read `edit` param from URL on mount
3. Find the matching invoice from `useInvoices()` hook (add `invoices` to destructuring)
4. Add a `useEffect` that pre-fills all form state when an edit invoice is found: `clientName`, `serviceDescription`, `currency`, `status`, `invoiceDate`, `dueDate`, `notes`, `items`, `invoicePrefix`, `companyName`, `companyLogo`, `customRate`
5. Update the header to show "Edit Invoice" vs "Create New Invoice"
6. On submit: if editing, call an `updateInvoice` function instead of `createInvoice`

**Additional change** — `src/hooks/useInvoices.ts`:
- Add an `updateInvoice` function that updates all editable fields on an existing Firestore document (using `updateDoc`)
- Return it from the hook

---

### Summary of files to edit:
1. **`src/utils/generateInvoicePDF.ts`** — Fix currency conversion logic in totals section
2. **`src/components/dashboard/CreateInvoiceForm.tsx`** — Read `?edit=` param, pre-fill form, support update flow
3. **`src/hooks/useInvoices.ts`** — Add `updateInvoice` method

