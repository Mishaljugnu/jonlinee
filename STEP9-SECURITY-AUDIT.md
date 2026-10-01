# Jonline Step 9 — Database / RLS / API Security Audit

Completed against the live Supabase project.

## Verified
- All 9 public application tables have Row Level Security enabled.
- Supabase security advisor: 0 security lints.
- Public-facing tables retain SELECT access only for anon/authenticated roles.
- Mutation privileges were revoked from anon/authenticated roles; admin mutations continue through the server using the server-only Supabase secret key.
- Admin tables remain protected by RLS policies requiring an authenticated profile with role `admin`.
- The `uploads` bucket remains public for existing storefront images, with a storage-level 5 MB limit and JPG/PNG/WebP MIME allowlist.
- Customer sourcing-request creation and image-upload routes remain public because they are part of the existing no-login customer flow; the server validates the request/image size and type before using the server-only storage credential.
- No customer authentication requirement or storefront/database model was introduced.

## Core behavior preserved
No product, category, cart, checkout, quotation, customer-login, or admin workflow was redesigned in this step.
