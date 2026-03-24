# Font License Checker
## Structured Engineering PRD

## 1. Document Control

**Product:** Font License Checker  
**Document Type:** Engineering PRD  
**Version:** v1.0  
**Status:** Draft  
**Target Release:** MVP  
**Prepared For:** Product, Design, and Engineering  

---

## 2. Product Summary

Font License Checker is a search-first web application that helps users understand whether a font is free for personal use, free for commercial use, or requires additional licensing.

The product is built for clarity, speed, and trust. A user types the name of a font, and the system returns a simple answer in non-technical language, along with official license references and purchase links where relevant.

This product does not replace legal review. It simplifies license interpretation for everyday decision-making and directs users to the official source when deeper review is needed.

---

## 3. Problem Statement

Font licensing is difficult for most users to understand. Designers, developers, founders, and marketers often need to know whether they can use a font in personal work, client work, websites, apps, branding, or commercial materials. The current process usually involves searching multiple websites, reading inconsistent legal text, and making risky assumptions.

The result is confusion, wasted time, and possible misuse of licensed fonts.

---

## 4. Product Goal

Build a fast and trustworthy website that lets users search for a font and instantly understand, in plain language:

- whether it is safe for personal use
- whether it is safe for commercial use
- whether payment or special permission is required
- where to verify the official licensing information
- where to purchase a license if needed

---

## 5. Product Objectives

### Primary Objectives

- Reduce confusion around font licensing
- Translate licensing information into simple language
- Help users make faster decisions before using a font
- Provide trusted official source links for verification
- Support clear fallback states when information is incomplete

### Secondary Objectives

- Build a curated internal database of font licensing records
- Support admin review and update workflows
- Create a foundation for future font detail pages, SEO, and integrations

---

## 6. Users

### Primary Users

- Product designers
- UI designers
- UX designers
- Graphic designers
- Web developers
- Brand designers
- Freelancers
- Agencies

### Secondary Users

- Startup founders
- Social media managers
- Content creators
- Students
- Marketing teams
- Small business owners

---

## 7. Core Use Cases

### Use Case 1: Quick Search
A user types a font name and gets a simple result that says whether the font is free for personal use, free for commercial use, or requires a paid license.

### Use Case 2: Verification
A user wants to confirm the result by visiting the official source or license page.

### Use Case 3: Purchase
A user learns that the font requires payment and clicks a purchase link to buy the correct license.

### Use Case 4: Error Reporting
A user notices outdated or incorrect information and reports the issue.

### Use Case 5: Admin Review
An admin updates records, links, summaries, aliases, and review metadata as licensing information changes.

---

## 8. Scope

## 8.1 MVP Scope

The MVP includes:

- public homepage with search input
- search suggestions / autocomplete
- font search result card
- plain-language license summary
- personal use status
- commercial use status
- official source link
- license reference link when available
- purchase link when applicable
- unknown / verify manually state
- report issue form
- admin management interface
- structured backend API
- analytics instrumentation

## 8.2 Out of Scope for MVP

- browser extension
- Figma plugin
- public API for third parties
- user accounts and saved history
- automated crawling of all font sources
- logo-specific legal analysis
- deep per-medium licensing for every source
- payment processing
- localization

---

## 9. Functional Requirements

## 9.1 Search Experience

The system must allow a user to search by font name from the homepage.

### Requirements

- Search must support exact and partial matches
- Search must ignore capitalization
- Search must support aliases and alternate names
- Search must support common family-level queries
- Search suggestions should appear as the user types
- Search results should prioritize exact matches first
- Search must return clear no-result and unknown states

### Example Queries

- Inter
- Helvetica
- Gotham
- SF Pro
- Avenir Next

## 9.2 Result Card

Each result card must include:

- font name
- family name if applicable
- foundry / vendor / source name
- status badge
- personal use summary
- commercial use summary
- plain-language explanation
- official source link
- official license link when available
- purchase link when relevant
- confidence level
- last reviewed date

## 9.3 License Interpretation

The system must map structured license statuses to simple human-readable summaries.

### Example Outputs

- "You can use this font for personal projects, but you likely need to buy a license for client work or business use."
- "This font is generally free for both personal and commercial use based on the source we reviewed."
- "This font may require different licenses for websites, apps, or products. Check the official license page before using it commercially."
- "We could not confirm the licensing clearly enough to give a reliable answer. Please verify with the official source."

## 9.4 Report Issue

The system must allow a user to submit a report when a result appears incorrect or outdated.

### Required Fields

- issue type
- optional message
- optional email
- search term
- associated font if available

## 9.5 Admin Management

The admin interface must support:

- create font record
- edit font record
- archive font record
- manage aliases
- update status fields
- update links
- update explanation copy
- set confidence level
- set last reviewed date
- review issue reports

---

## 10. Non-Functional Requirements

## 10.1 Performance

- Search suggestions should return quickly and feel instant
- Primary search result should render with minimal delay
- Homepage should load fast on mobile and desktop
- API p95 latency target for search endpoint should remain low under normal load

## 10.2 Reliability

- Public search should be available with high uptime
- Broken source links should be detectable through periodic validation
- Unknown data should fail safely instead of producing misleading results

## 10.3 Accessibility

- Keyboard navigation must be supported for search and suggestions
- Status indicators must not rely on color alone
- Text contrast must meet accessible contrast standards
- Semantic markup must be used across public and admin interfaces

## 10.4 Security

- Admin routes must require authentication and authorization
- Issue reports must be rate limited
- User inputs must be sanitized and validated
- APIs must reject malformed payloads cleanly
- Sensitive admin actions must be logged

## 10.5 Maintainability

- License interpretation rules must be centralized
- Search logic should be modular and testable
- Frontend and backend should support clear separation of concerns
- Data schema must support future extension for web/app/logo usage

---

## 11. Design Direction

## 11.1 Visual Style

The design direction should be:

- clean
- minimal
- modern
- calm
- trustworthy
- search-first

The product should not feel legal, dense, or technical. It should feel clear and immediate.

## 11.2 Typography Direction

Typography should feel precise and refined.

### Typography Principles

- tighter kerning for headings
- strong typographic hierarchy
- restrained use of font weights
- generous line height for body text
- neutral, modern sans-serif system

### Preferred Font Stack

Primary recommendation:

- `Inter`
- fallback to `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Alternate recommendation:

- `Helvetica Neue`
- fallback to `Arial, system-ui, sans-serif`

### Type Usage Guidance

- Headings: compact, slightly tighter tracking, medium to semibold
- Body: regular weight, high readability
- Labels and metadata: smaller, restrained, neutral tone
- Status badges: legible and concise

## 11.3 Layout Direction

- centered search-first homepage
- strong use of whitespace
- restrained card surfaces
- subtle border system
- low visual noise
- minimal icon usage
- no decorative clutter

## 11.4 UI Styling Notes

- rounded corners, but not overly soft
- light neutral backgrounds
- crisp borders
- subtle shadows only where necessary
- emphasis through typography and spacing more than color

## 11.5 Suggested Design Tokens

### Colors

- Background: neutral off-white or soft gray
- Surface: white
- Primary text: near-black
- Secondary text: muted gray
- Border: light neutral gray
- Success state: muted green
- Warning / limited state: muted amber
- Error / restricted state: muted red
- Unknown state: neutral slate

### Spacing

- 4px base grid or 8px system
- compact vertical rhythm around search and result cards
- wider breathing room around page sections

### Radius

- inputs: 10px to 12px
- cards: 14px to 18px
- badges: pill or 999px radius

---

## 12. Information Architecture

## 12.1 Public Pages

### Homepage
Contains:

- hero heading
- subtext
- search input
- search suggestions
- result preview area or route to results page
- short explanation of how it works
- disclaimer summary
- footer

### Search Results View
Contains:

- search term
- matched fonts
- result cards
- no result state
- unknown result state
- actions to view source or purchase

### Font Detail Page (recommended)
Contains:

- font title
- summary card
- personal use status
- commercial use status
- explanation
- official links
- review metadata
- report issue action

### Report Issue Form
Contains:

- issue type
- optional note
- optional email
- confirmation state

### About / Disclaimer Page
Contains:

- how data is curated
- trust approach
- limitations
- legal disclaimer

## 12.2 Admin Pages

- login
- dashboard
- font records list
- create/edit font record
- issue report queue
- link validation summary
- audit log view

---

## 13. User Flows

## 13.1 Public Search Flow

1. User lands on homepage
2. User enters font name
3. System shows suggestions
4. User selects a suggestion or submits search
5. Frontend requests search result
6. Backend returns structured result
7. Frontend renders result card
8. User optionally clicks source or purchase link

## 13.2 No Result Flow

1. User searches for a font not in the system
2. Backend returns no match
3. Frontend shows no-result state
4. Frontend may suggest similar names if available
5. User may report a missing font

## 13.3 Unknown Result Flow

1. User searches a font with incomplete licensing data
2. Backend returns status `unknown`
3. Frontend shows a cautious summary
4. User is directed to the official source

## 13.4 Admin Update Flow

1. Admin opens font record
2. Admin updates statuses, explanation, and links
3. System validates required fields
4. Record is saved
5. Search index is refreshed or updated
6. Audit log is written

---

## 14. System Architecture

## 14.1 High-Level Architecture

The system should use a simple service-oriented web architecture.

### Core Components

- Web frontend
- API server
- Relational database
- Search/index layer
- Admin interface
- Background jobs for maintenance
- Analytics/event collection

### Recommended Logical Architecture

**Client Layer**
- public website
- admin dashboard

**Application Layer**
- search service
- font record service
- license interpretation service
- issue reporting service
- admin management service
- analytics event service

**Data Layer**
- font records table
- alias table
- issue reports table
- admin users table
- audit logs table
- optional search index

**Background Layer**
- stale record checker
- broken link checker
- search index sync worker

---

## 15. Technical Stack Recommendation

## 15.1 Frontend

Recommended:

- Next.js
- TypeScript
- React
- Tailwind CSS
- optional component primitives like shadcn/ui

### Reasoning

- fast SSR/SSG support
- good SEO support if font detail pages are added
- clean routing and API integration
- strong TypeScript support
- efficient for a search-first web application

## 15.2 Backend

Recommended:

- Next.js route handlers for MVP or standalone Node.js service with NestJS / Express
- TypeScript

### Recommended Choice for MVP

- Use Next.js full-stack if team size is small and scope is controlled
- Move to dedicated API service later if traffic or complexity grows

## 15.3 Database

Recommended:

- PostgreSQL

### Reasoning

- strong relational schema support
- good indexing and text search options
- reliable for structured admin-managed data

## 15.4 Search Strategy

MVP options:

### Option A: PostgreSQL trigram / full-text search
Good for MVP and curated dataset.

### Option B: Meilisearch / Typesense
Better for stronger autocomplete and fuzzy matching if search quality needs to be richer early.

### Recommended MVP

- Start with PostgreSQL + trigram search
- Add dedicated search service only if search quality requires it

## 15.5 Authentication

Recommended:

- admin-only auth using secure email/password or SSO
- session-based auth or signed JWT with HTTP-only cookies

## 15.6 Analytics

Recommended:

- product analytics such as PostHog or Plausible
- server-side event logging for critical actions

## 15.7 Hosting

Recommended:

- Vercel for frontend/full-stack Next.js
- managed PostgreSQL such as Neon, Supabase Postgres, RDS, or Railway
- object storage only if future uploads are introduced

---

## 16. Backend Domain Model

The backend domain should be centered on curated font records and related metadata.

### Core Entities

- Font
- FontAlias
- IssueReport
- AdminUser
- AuditLog
- LinkCheckResult

---

## 17. Data Model

## 17.1 Font Table

### Table: `fonts`

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| slug | varchar | Yes | URL-safe unique identifier |
| font_name | varchar | Yes | Canonical font name |
| normalized_name | varchar | Yes | Lowercased normalized search key |
| family_name | varchar | No | Optional family grouping |
| vendor_name | varchar | No | Foundry or provider |
| source_type | varchar | No | e.g. foundry, marketplace, open-source |
| official_source_url | text | No | Primary official source |
| official_license_url | text | No | Official license reference |
| purchase_url | text | No | Official purchase page |
| personal_use_status | varchar | Yes | Enum |
| commercial_use_status | varchar | Yes | Enum |
| web_use_status | varchar | No | Optional future field |
| app_use_status | varchar | No | Optional future field |
| logo_use_status | varchar | No | Optional future field |
| simplified_summary | text | Yes | Main user-facing explanation |
| internal_notes | text | No | Admin-only notes |
| confidence_level | varchar | Yes | Enum |
| last_verified_at | timestamp | No | Last human review time |
| is_active | boolean | Yes | Soft publish/archive |
| created_at | timestamp | Yes | Created time |
| updated_at | timestamp | Yes | Updated time |

## 17.2 Font Alias Table

### Table: `font_aliases`

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| font_id | UUID | Yes | FK to fonts |
| alias_name | varchar | Yes | Alternate font spelling or family query |
| normalized_alias_name | varchar | Yes | Lowercased normalized alias |
| created_at | timestamp | Yes | Created time |

## 17.3 Issue Reports Table

### Table: `issue_reports`

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| font_id | UUID | No | Optional if matched |
| search_query | varchar | Yes | User-entered query |
| issue_type | varchar | Yes | Enum |
| message | text | No | User note |
| user_email | varchar | No | Optional |
| status | varchar | Yes | Enum: open, reviewed, resolved |
| created_at | timestamp | Yes | Created time |
| updated_at | timestamp | Yes | Updated time |

## 17.4 Admin Users Table

### Table: `admin_users`

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| email | varchar | Yes | Unique |
| password_hash | text | Yes | If password auth is used |
| role | varchar | Yes | admin, editor |
| created_at | timestamp | Yes | Created time |
| updated_at | timestamp | Yes | Updated time |

## 17.5 Audit Logs Table

### Table: `audit_logs`

| Field | Type | Required | Notes |
|---|---|---:|---|
| id | UUID | Yes | Primary key |
| actor_id | UUID | Yes | Admin user |
| entity_type | varchar | Yes | font, issue_report |
| entity_id | UUID | Yes | Target record |
| action | varchar | Yes | create, update, archive |
| before_snapshot | jsonb | No | Previous data |
| after_snapshot | jsonb | No | New data |
| created_at | timestamp | Yes | Log time |

---

## 18. Enums

## 18.1 License Status Enum

Recommended values:

- `allowed`
- `paid_license_required`
- `not_allowed`
- `limited`
- `unknown`

## 18.2 Confidence Enum

- `high`
- `medium`
- `low`

## 18.3 Issue Type Enum

- `incorrect_license_status`
- `broken_source_link`
- `broken_purchase_link`
- `wrong_font_match`
- `outdated_information`
- `missing_font`
- `other`

## 18.4 Issue Status Enum

- `open`
- `reviewed`
- `resolved`
- `dismissed`

---

## 19. Search Architecture

## 19.1 Search Goals

The search layer must:

- support exact font name search
- support partial search
- support aliases
- support typo tolerance to a reasonable extent
- rank exact matches first
- remain fast for a curated but growing dataset

## 19.2 Search Normalization Rules

When indexing and querying:

- lowercase input
- trim whitespace
- collapse repeated spaces
- optionally remove punctuation variants where safe
- normalize family suffixes only where necessary

## 19.3 Matching Strategy

### Priority Order

1. exact match on canonical font name
2. exact match on alias
3. prefix match on canonical font name
4. prefix match on alias
5. trigram / fuzzy similarity match
6. family-level fallback suggestions

## 19.4 Search Response Behavior

- Search endpoint should return a small list of suggestions for autocomplete
- Detail endpoint should return a resolved record for selected font
- If multiple likely matches exist, return them in rank order

---

## 20. License Interpretation System

The system should separate raw data from user-facing explanation.

## 20.1 Principle

Engineers and admins store structured status values. The application maps those statuses into clear copy.

## 20.2 Rules

- Never generate certainty when confidence is low
- Unknown state should remain explicit
- Paid-license-required state should clearly explain commercial limitation
- Limited state should explain that usage may depend on medium or context

## 20.3 Example Mapping Logic

### Case A
Input:
- personal_use_status = allowed
- commercial_use_status = paid_license_required
- confidence = high

Output:
- "You can use this font for personal projects. For business or client work, you likely need to buy a license."

### Case B
Input:
- personal_use_status = allowed
- commercial_use_status = allowed
- confidence = medium

Output:
- "This font appears to be free for personal and commercial use based on the source we reviewed."

### Case C
Input:
- commercial_use_status = limited

Output:
- "This font may have different rules depending on how you want to use it, such as in websites, apps, or branded materials. Check the official license page before use."

### Case D
Input:
- confidence = low or status = unknown

Output:
- "We could not confirm the licensing clearly enough to give a reliable answer. Please check the official source before using this font commercially."

---

## 21. API Design Principles

The API should be:

- RESTful for MVP simplicity
- strongly typed in implementation
- versioned from the start
- explicit about uncertainty
- stable enough for future internal or public extension

Base path recommendation:

`/api/v1`

---

## 22. Public API Schema

## 22.1 Search Fonts

### Endpoint
`GET /api/v1/fonts/search`

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| q | string | Yes | Search query |
| limit | number | No | Max results for suggestions, default 5 |

### Example Request
`GET /api/v1/fonts/search?q=helvetica&limit=5`

### Success Response
```json
{
  "query": "helvetica",
  "results": [
    {
      "id": "uuid",
      "slug": "helvetica",
      "fontName": "Helvetica",
      "familyName": "Helvetica",
      "vendorName": "Linotype",
      "matchType": "exact",
      "confidenceLevel": "high"
    },
    {
      "id": "uuid-2",
      "slug": "helvetica-neue",
      "fontName": "Helvetica Neue",
      "familyName": "Helvetica",
      "vendorName": "Linotype",
      "matchType": "prefix",
      "confidenceLevel": "high"
    }
  ]
}
```

### Empty Response
```json
{
  "query": "unknownfont",
  "results": []
}
```

## 22.2 Get Font Detail

### Endpoint
`GET /api/v1/fonts/{slug}`

### Example Request
`GET /api/v1/fonts/inter`

### Success Response
```json
{
  "id": "uuid",
  "slug": "inter",
  "fontName": "Inter",
  "familyName": "Inter",
  "vendorName": "The Inter Project",
  "sourceType": "open-source",
  "statusBadge": "Free for commercial use",
  "personalUse": {
    "status": "allowed",
    "label": "Free for personal use"
  },
  "commercialUse": {
    "status": "allowed",
    "label": "Free for commercial use"
  },
  "summary": "This font appears to be free for both personal and commercial use based on the source we reviewed.",
  "officialSourceUrl": "https://...",
  "officialLicenseUrl": "https://...",
  "purchaseUrl": null,
  "confidenceLevel": "high",
  "lastReviewedAt": "2026-03-23T10:00:00Z"
}
```

### Not Found Response
```json
{
  "error": {
    "code": "FONT_NOT_FOUND",
    "message": "We could not find a font record for that name."
  }
}
```

## 22.3 Submit Issue Report

### Endpoint
`POST /api/v1/issues`

### Request Body
```json
{
  "fontId": "uuid",
  "searchQuery": "Helvetica",
  "issueType": "outdated_information",
  "message": "The purchase link appears broken.",
  "userEmail": "user@example.com"
}
```

### Success Response
```json
{
  "success": true,
  "issueId": "uuid",
  "message": "Thanks. Your report has been submitted."
}
```

### Validation Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "issueType is required"
  }
}
```

## 22.4 Track Analytics Event (optional first-party endpoint)

### Endpoint
`POST /api/v1/events`

### Request Body
```json
{
  "eventName": "result_viewed",
  "metadata": {
    "fontSlug": "inter"
  }
}
```

---

## 23. Admin API Schema

All admin routes must require authenticated access.

## 23.1 Create Font Record

### Endpoint
`POST /api/v1/admin/fonts`

### Request Body
```json
{
  "fontName": "Avenir Next",
  "familyName": "Avenir",
  "vendorName": "Monotype",
  "sourceType": "foundry",
  "officialSourceUrl": "https://...",
  "officialLicenseUrl": "https://...",
  "purchaseUrl": "https://...",
  "personalUseStatus": "allowed",
  "commercialUseStatus": "paid_license_required",
  "simplifiedSummary": "You can use this font for personal projects, but commercial use usually requires a paid license.",
  "confidenceLevel": "high",
  "aliases": ["AvenirNext", "Avenir Next Regular"]
}
```

### Success Response
```json
{
  "success": true,
  "font": {
    "id": "uuid",
    "slug": "avenir-next"
  }
}
```

## 23.2 Update Font Record

### Endpoint
`PATCH /api/v1/admin/fonts/{id}`

### Request Body
```json
{
  "purchaseUrl": "https://updated-link.example.com",
  "commercialUseStatus": "paid_license_required",
  "simplifiedSummary": "Commercial use usually requires a paid license."
}
```

## 23.3 List Font Records

### Endpoint
`GET /api/v1/admin/fonts?query=avenir&page=1&pageSize=20`

## 23.4 Get Single Font Record

### Endpoint
`GET /api/v1/admin/fonts/{id}`

## 23.5 Archive Font Record

### Endpoint
`POST /api/v1/admin/fonts/{id}/archive`

## 23.6 List Issue Reports

### Endpoint
`GET /api/v1/admin/issues?status=open&page=1&pageSize=20`

## 23.7 Resolve Issue Report

### Endpoint
`POST /api/v1/admin/issues/{id}/resolve`

### Request Body
```json
{
  "resolutionNote": "Updated purchase link and verified source."
}
```

---

## 24. Error Handling

## 24.1 Error Response Shape

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "Human-readable message",
    "details": null
  }
}
```

## 24.2 Standard Error Codes

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `FONT_NOT_FOUND`
- `ISSUE_NOT_FOUND`
- `RATE_LIMITED`
- `INTERNAL_SERVER_ERROR`

---

## 25. Validation Rules

## Public Search

- `q` must not be empty
- max query length should be limited
- trim whitespace before processing

## Issue Report

- `issueType` required
- `searchQuery` required
- `message` length limited
- `userEmail` optional but validated if provided

## Admin Font Record

- `fontName` required
- at least one status field required for MVP: personal and commercial
- `simplifiedSummary` required
- URLs must be valid if provided
- aliases must be unique per font

---

## 26. Background Jobs

## 26.1 Link Checker

Runs periodically to:

- verify `official_source_url`
- verify `official_license_url`
- verify `purchase_url`
- flag broken or redirected links for admin review

## 26.2 Stale Record Checker

Runs periodically to:

- identify records not reviewed within threshold
- flag them for admin review
- optionally lower public confidence if very stale

## 26.3 Search Index Sync

If a separate search service is used, sync changes when records or aliases are updated.

---

## 27. Caching Strategy

## Public Endpoints

- cache search suggestions briefly if traffic grows
- cache detail responses for public records with short TTL
- invalidate cache on admin updates

## Recommended MVP Approach

- lightweight server-side caching or edge caching for public GET routes
- no heavy cache complexity unless scale demands it

---

## 28. Observability

## Logging

Log:

- API errors
- admin record changes
- failed link checks
- failed auth attempts
- rate limit events

## Monitoring

Track:

- API latency
- API error rate
- search no-result rate
- unknown result rate
- issue submission volume
- broken link counts

## Alerting

Create alerts for:

- spike in 5xx errors
- major drop in search success
- link checker failures above threshold

---

## 29. Security Requirements

- Admin routes protected by auth middleware
- CSRF protection where relevant
- HTTP-only secure cookies for sessions
- input sanitization for all text fields
- server-side validation for all mutating endpoints
- rate limiting for search abuse and issue submission abuse
- audit logs for admin mutations
- environment secret management

---

## 30. SEO Considerations

If font detail pages are included:

- statically generate high-traffic font pages where possible
- each page should expose clear title and meta description
- schema markup optional later
- canonical URL should use font slug

### Example Page Intent

- is helvetica free for commercial use
- avenir license
- can I use inter commercially

---

## 31. Analytics Events

Track at minimum:

- `search_submitted`
- `autocomplete_selected`
- `result_viewed`
- `official_source_clicked`
- `official_license_clicked`
- `purchase_link_clicked`
- `no_result_viewed`
- `unknown_result_viewed`
- `issue_report_submitted`

Recommended event metadata:

- query
- fontSlug
- resultCount
- confidenceLevel
- sourceType

---

## 32. Testing Strategy

## 32.1 Unit Tests

Test:

- search normalization
- match ranking
- license summary mapping
- validation logic
- enum handling

## 32.2 Integration Tests

Test:

- public search endpoint
- font detail endpoint
- issue submission endpoint
- admin create/update flows
- auth protection

## 32.3 End-to-End Tests

Test:

- homepage search flow
- no-result flow
- unknown-result flow
- report issue flow
- admin edit flow

## 32.4 Content QA

Manual review should validate:

- clarity of summaries
- correctness of links
- wording consistency
- proper handling of uncertain cases

---

## 33. Acceptance Criteria

### Public Search

- user can type a font name and receive relevant suggestions
- user can view a result card with personal and commercial statuses
- result card displays official source and purchase link where available
- no-result and unknown states are clearly handled

### Admin

- admin can create and edit records
- admin can manage aliases
- admin can resolve issue reports
- admin changes are reflected in public search results

### Design

- interface is clean, minimal, modern, and easy to scan
- typography follows the specified refined direction
- headings use tighter kerning and clear hierarchy
- font stack uses Inter or Helvetica-style system

### Engineering

- API responses follow the documented schema
- system validates invalid payloads correctly
- audit logs exist for admin changes

---

## 34. Risks and Mitigations

## Risk 1: License ambiguity
Mitigation:
- keep structured confidence levels
- prefer unknown over forced certainty
- always surface official source

## Risk 2: Outdated records
Mitigation:
- last reviewed metadata
- stale record jobs
- admin review workflow

## Risk 3: Search mismatch
Mitigation:
- aliases
- ranked matching
- careful normalization
- user issue reporting

## Risk 4: Overly legal or technical UI
Mitigation:
- plain-language summaries
- restrained interface
- design review for readability and clarity

---

## 35. Recommended Build Phases

## Phase 1: MVP Foundation

- schema design
- admin auth
- font record CRUD
- alias support
- public search endpoint
- font detail endpoint
- homepage search UI
- result card UI
- issue report submission

## Phase 2: Trust and Operations

- audit logs
- link checker
- stale record review workflow
- analytics integration
- better autocomplete ranking

## Phase 3: Growth Layer

- font detail SEO pages
- dedicated search service if needed
- richer per-medium licensing fields
- public-facing changelog or trust layer

---

## 36. Final Engineering Definition

Font License Checker should be built as a curated, search-first licensing reference system with a clean public interface and a controlled admin workflow. The system must prioritize clarity, trust, and maintainability over complexity.

The public experience should feel immediate and simple. The internal system should be structured, auditable, and easy to extend.

The product succeeds when a non-technical user can search a font and understand the answer in seconds, while the engineering system remains robust enough to support accurate data over time.

