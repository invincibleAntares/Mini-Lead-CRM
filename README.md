# Mini Lead CRM API

A RESTful backend API for managing sales leads through a structured CRM pipeline.

This project was built for the **Superleap Backend Engineering Intern Assessment**. It supports lead creation, listing, updating, deletion, filtering, status transitions, and bulk lead operations.

The API is designed with clean route/controller/model separation, proper validation, centralized error handling, and a simple state machine to prevent invalid lead status changes.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack & Why](#tech-stack--why)
- [Features Implemented](#features-implemented)
- [Lead Data Model](#lead-data-model)
- [Lead Status Flow](#lead-status-flow)
- [API Routes](#api-routes)
- [Postman Collection](#postman-collection)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [Design Decisions](#design-decisions)
- [What I Would Improve at Scale](#what-i-would-improve-at-scale)
- [Testing Flow](#testing-flow)

---

## Project Overview

Mini Lead CRM is a backend API for managing potential customers as they move through a sales pipeline.

A lead starts as `NEW` and can move through valid stages such as `CONTACTED`, `QUALIFIED`, and `CONVERTED`. A lead can also be marked as `LOST` based on defined business rules.

The goal of this project is to demonstrate:
- RESTful API design
- CRUD operations
- Input validation
- Status transition rules
- Proper HTTP status codes
- Centralized error handling
- Clean project structure
- Bulk operation handling
- Practical backend design decisions

---

## Tech Stack & Why

### Node.js
Node.js was chosen because it is fast, lightweight, and well-suited for building REST APIs. Its non-blocking I/O model works well for applications that frequently interact with a database.

It also has a strong ecosystem and allows quick development using JavaScript on the backend.

### Express.js
Express.js was used because it is simple, flexible, and reliable for building APIs.

It provides clean routing, middleware support, and easy request/response handling without adding unnecessary complexity. For this assignment, Express is a good choice because the requirement is to build a clean and functional API rather than an over-engineered backend.

### MongoDB
MongoDB was chosen because lead data fits naturally into a document structure.

A lead can have basic fields like name, email, phone, status, and source. In the future, CRM data may expand with custom fields, tags, notes, assigned users, or campaign metadata. MongoDB provides flexibility for these future additions.

### Mongoose
Mongoose was used as the ODM layer for MongoDB.

It helps define schemas, validate data, manage timestamps, and interact with MongoDB in a structured way. This keeps the database layer cleaner and reduces the chances of saving invalid lead data.

### dotenv
dotenv was used to manage environment variables such as the MongoDB URI and server port.

This keeps configuration separate from source code and avoids hardcoding environment-specific values.

---

## Features Implemented

### Level 1 — Core CRUD + State Machine
Implemented:
- Create a new lead
- Get all leads
- Filter leads by status
- Get a single lead by ID
- Update lead fields
- Delete a lead
- Transition lead status
- Enforce valid status transitions
- Validate required fields
- Validate email format
- Return proper HTTP status codes
- Handle errors gracefully

### Level 2 — Bulk Operations
Implemented:
- Create multiple leads in one request
- Update multiple leads in one request
- Return per-record success and failure results
- Allow partial success
- Prevent one invalid record from failing the entire batch



---

## Lead Data Model

Each lead contains the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | ObjectId | Yes | Auto-generated unique lead ID |
| `name` | String | Yes | Full name of the lead |
| `email` | String | Yes | Valid email address |
| `phone` | String | No | Contact number |
| `status` | Enum | Yes | Current status of the lead |
| `source` | String | No | Source of the lead, such as website, referral, or campaign |
| `created_at` | Date | Auto | Timestamp when the lead is created |
| `updated_at` | Date | Auto | Timestamp when the lead is updated |

Allowed lead statuses:
```txt
NEW
CONTACTED
QUALIFIED
CONVERTED
LOST
```

---

## Lead Status Flow

Leads follow a controlled CRM pipeline.

```
NEW → CONTACTED → QUALIFIED → CONVERTED
 ↘       ↘           ↘
   LOST    LOST        LOST
```

### Status Transition Rules

- Every lead starts with `NEW`.
- A lead can move forward only one step at a time.
- A lead can move from `NEW` to `CONTACTED`.
- A lead can move from `CONTACTED` to `QUALIFIED`.
- A lead can move from `QUALIFIED` to `CONVERTED`.
- A lead can move to `LOST` from `NEW`, `CONTACTED`, or `QUALIFIED`.
- A lead cannot move to `LOST` after it is `CONVERTED`.
- `CONVERTED` and `LOST` are terminal states.
- No status change is allowed after a lead becomes `CONVERTED` or `LOST`.

### Valid Transitions
- `NEW → CONTACTED`
- `NEW → LOST`
- `CONTACTED → QUALIFIED`
- `CONTACTED → LOST`
- `QUALIFIED → CONVERTED`
- `QUALIFIED → LOST`

### Invalid Transitions
- `NEW → QUALIFIED`
- `NEW → CONVERTED`
- `CONTACTED → CONVERTED`
- `CONVERTED → LOST`
- `LOST → CONTACTED`
- `LOST → QUALIFIED`

Invalid transitions return a `400 Bad Request` response with a clear error message.

---

## API Routes

The complete request and response examples are available in the attached Postman collection.

### Health Check

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Checks if the server is running |

### Lead Routes

| Method | Route | Description |
|---|---|---|
| POST | `/leads` | Create a new lead |
| GET | `/leads` | Get all leads |
| GET | `/leads?status=NEW` | Get leads filtered by status |
| GET | `/leads/:id` | Get a single lead by ID |
| PUT | `/leads/:id` | Update lead details |
| DELETE | `/leads/:id` | Delete a lead |
| PATCH | `/leads/:id/status` | Update lead status using transition rules |

### Bulk Routes

| Method | Route | Description |
|---|---|---|
| POST | `/leads/bulk` | Create multiple leads |
| PUT | `/leads/bulk` | Update multiple leads |

### API Route Details

#### 1. Create Lead
```
POST /leads
```
Creates a new lead.

Required fields:
```json
{
  "name": "Abhishek Kumar",
  "email": "kumarabhishek2928@gmail.com"
}
```

Optional fields:
```json
{
  "phone": "+91 7991100164",
  "source": "website"
}
```

Default status: `NEW`

#### 2. Get All Leads
```
GET /leads
```
Returns all leads stored in the database.

#### 3. Filter Leads by Status
```
GET /leads?status=NEW
```
Returns leads matching the provided status.

Supported status filters:
- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `CONVERTED`
- `LOST`

#### 4. Get Lead by ID
```
GET /leads/:id
```
Returns a single lead using its unique ID.

Example:
```
GET /leads/662f1c2a8e4b7d001234abcd
```

#### 5. Update Lead
```
PUT /leads/:id
```
Updates lead details such as:
```json
{
  "name": "Abhishek K.",
  "phone": "+91 9999999999",
  "source": "referral"
}
```

Status should not be updated from this route.

Status updates are handled separately through:
```
PATCH /leads/:id/status
```

This keeps normal lead updates separate from business state transitions.

#### 6. Delete Lead
```
DELETE /leads/:id
```
Deletes a lead from the database.

#### 7. Update Lead Status
```
PATCH /leads/:id/status
```
Updates the lead status only if the transition is valid.

Request body:
```json
{
  "status": "CONTACTED"
}
```

Example valid transition:
`NEW → CONTACTED`

Example invalid transition:
`NEW → CONVERTED`

Invalid transition response:
```json
{
  "error": "Invalid status transition from NEW to CONVERTED"
}
```

#### 8. Bulk Create Leads
```
POST /leads/bulk
```
Creates multiple leads in one request.

Request body format:
```json
[
  {
    "name": "Lead A",
    "email": "leada@example.com",
    "phone": "+91-9000000001",
    "source": "website"
  },
  {
    "name": "Lead B",
    "email": "leadb@example.com",
    "source": "referral"
  }
]
```

Each lead is validated independently.

A failed record does not stop the remaining records from being created.

#### 9. Bulk Update Leads
```
PUT /leads/bulk
```
Updates multiple leads in one request.

Request body format:
```json
[
  {
    "id": "662f1c2a8e4b7d001234ab01",
    "name": "Updated Lead A"
  },
  {
    "id": "662f1c2a8e4b7d001234ab02",
    "phone": "+91-9111111111"
  }
]
```

Each update is processed independently.

The response contains:
- total records processed
- successful records
- failed records
- result for each record
- error message for failed records

---

## Postman Collection

A Postman collection is included with this repository for complete API testing.

The collection contains:
- Create lead request
- Get all leads request
- Filter leads by status request
- Get lead by ID request
- Update lead request
- Delete lead request
- Valid status transition request
- Invalid status transition request
- Bulk create request
- Bulk update request
- Example request bodies
- Example API responses

### How to Use the Postman Collection

1. Open Postman.
2. Click **Import**.
3. Select the provided Postman collection JSON file.
4. Set the base URL: `http://localhost:3000`
5. Run the requests in the suggested testing order.

---

## Local Setup

### Prerequisites
Make sure you have the following installed:
- Node.js v16 or higher
- npm
- MongoDB

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd minileadcrm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root directory.
```bash
cp .env.example .env
```

### 4. Configure Environment Variables
Update `.env` with your MongoDB URI and port.
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/minileadcrm
```

### 5. Start MongoDB
If using local MongoDB, make sure the MongoDB service is running.

Default local connection:
```
mongodb://localhost:27017/minileadcrm
```

### 6. Run the Server
Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### 7. Verify the Server
Open this route in browser or Postman:
```
GET http://localhost:3000/health
```

Expected response:
```json
{
  "message": "Server is online"
}
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| PORT | Port on which the server runs | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/minileadcrm |

Example `.env` file:
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/minileadcrm
```

---

## Project Structure

```
src/
├── config/
│   └── db.js
├── controllers/
│   └── leadController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── leadModel.js
├── routes/
│   └── leadRoutes.js
├── utils/
│   └── statusTransitions.js
├── app.js
└── server.js
```

### Folder Responsibilities

| Folder/File | Purpose |
|---|---|
| config/ | Database connection setup |
| controllers/ | Request handlers and business logic |
| middleware/ | Error handling and custom middleware |
| models/ | Mongoose schemas and models |
| routes/ | API route definitions |
| utils/ | Reusable helper functions |
| app.js | Express app configuration |
| server.js | Server entry point |

---

## Error Handling

The API returns consistent JSON error responses.

### Validation Error
```json
{
  "error": "Validation Error",
  "details": [
    "Name is required",
    "Email must be valid"
  ]
}
```

### Not Found Error
```json
{
  "error": "Lead not found"
}
```

### Invalid Status Transition
```json
{
  "error": "Invalid status transition from NEW to CONVERTED"
}
```

### Common HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 207 | Partial success in bulk operation |
| 400 | Bad request or invalid status transition |
| 404 | Resource not found |
| 422 | Validation error |
| 500 | Internal server error |

---

## Design Decisions

### 1. Separate Status Transition Route
Status updates are handled through:
```
PATCH /leads/:id/status
```
instead of normal lead update route:
```
PUT /leads/:id
```

This keeps regular field updates separate from business state changes.

Status transitions have specific rules, so keeping them in a separate endpoint makes the API cleaner and safer.

### 2. State Machine for Lead Status
The lead status flow is implemented like a simple state machine.

Each current status has a list of allowed next statuses.

This prevents invalid transitions such as:
- `NEW → CONVERTED`
- `CONTACTED → CONVERTED`
- `LOST → QUALIFIED`

This ensures the sales pipeline remains consistent.

### 3. Mongoose Schema Validation
Mongoose schema validation is used to enforce required fields and allowed values.

This ensures invalid data does not get saved into the database.

Validated fields include:
- `name`
- `email`
- `status`
- `email` format
- allowed status values

### 4. Centralized Error Handling
A centralized error middleware is used to keep error responses consistent across the API.

This avoids repeating error response logic in every controller and makes the code easier to maintain.

### 5. Partial Success in Bulk Operations
Bulk operations are designed to handle partial success.

For example, if 10 leads are submitted and 2 are invalid, the remaining 8 valid leads should still be processed.

This is useful in real CRM systems where lead data may come from spreadsheets, imports, or third-party tools.

The response clearly tells which records succeeded and which failed.

### 6. MongoDB for Flexible CRM Data
MongoDB was selected because CRM lead data may evolve over time.

A future version may need fields like:
- `company`
- `tags`
- `notes`
- `assigned_salesperson`
- `campaign_id`
- `follow_up_date`
- `lead_score`

MongoDB allows this flexibility without complex schema migrations.

---

## What I Would Improve at Scale

### 1. Concurrent Status Updates
In a real CRM, two users may try to update the same lead at the same time.

To handle this, I would use optimistic locking with a `version` field.

Example:
```json
{
  "version": 1
}
```

Before updating the status, the API would check whether the lead version is still current. If another request already updated the lead, the second request would fail safely.

This prevents race conditions.

### 2. Status History
Currently, only the current status is stored.

At scale, I would create a status history collection.

Example fields:
- `lead_id`
- `from_status`
- `to_status`
- `changed_at`
- `changed_by`
- `reason`

This would help with auditing, debugging, and CRM analytics.

### 3. Pagination
For large lead lists, `GET /leads` should not return every record at once.

I would add pagination:
```
GET /leads?page=1&limit=20
```

This improves performance and keeps API responses lightweight.

### 4. Indexing
I would add indexes on frequently queried fields:
- `email`
- `status`
- `created_at`

This would make filtering and searching faster as the database grows.

### 5. Email Uniqueness
In a production CRM, duplicate leads can create confusion.

I would add a unique index on `email`:
```json
{
  "email": { "unique": true }
}
```

Depending on business needs, duplicate handling could also be based on email plus source or campaign.

### 6. Soft Deletes
Instead of permanently deleting leads, I would use soft deletes.

Example fields:
- `is_deleted`
- `deleted_at`

This would allow recovery of accidentally deleted leads and maintain an audit trail.

### 7. Caching
For read-heavy endpoints like:
```
GET /leads/:id
```

I would add optional Redis caching.

Caching strategy:
- Cache individual lead details by ID.
- Invalidate the cache when the lead is updated.
- Invalidate the cache when the lead is deleted.
- Keep Redis optional so the app still works without it.

Example cache key:
```
lead:<lead_id>
```

This would reduce database reads for frequently accessed leads.

### 8. Search and Sorting
Future improvements could include:
```
GET /leads?search=abhishek
GET /leads?source=website
GET /leads?sort=created_at&order=desc
```

This would make the API more useful for real CRM dashboards.

---

## Testing Flow

The recommended testing order is:

1. Check server health
2. Create a lead
3. Get all leads
4. Filter leads by status
5. Get a lead by ID
6. Update lead details
7. Move status from NEW to CONTACTED
8. Try an invalid transition from CONTACTED to CONVERTED
9. Move status from CONTACTED to QUALIFIED
10. Move status from QUALIFIED to CONVERTED
11. Try changing status after CONVERTED
12. Test bulk create with valid and invalid records
13. Test bulk update with valid and invalid records
14. Delete a lead
15. Try fetching the deleted lead

All of these cases are covered in the attached Postman collection.

---

## .gitignore

Recommended `.gitignore`:
```
node_modules/
.env
dist/
build/
.DS_Store
npm-debug.log
```

---

## Final Note

This project keeps the backend simple, clean, and focused on the assignment requirements.

The main goal was to build a working REST API with:
- clear API routes
- correct lead status transition rules
- proper validation
- readable code organization
- graceful error handling
- bulk operations with partial success
- practical design decisions

The project can be cloned, configured, and tested locally using the provided setup steps and Postman collection.