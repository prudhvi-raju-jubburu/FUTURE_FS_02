# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints (except login) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Token is valid for 24 hours and can be obtained by logging in.

---

## Authentication Endpoints

### Login
Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@crm.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@crm.com"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid email or password"
}
```

**Validation Errors (400):**
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required",
    "password": "Password is required and must be at least 6 characters"
  }
}
```

---

### Get Profile
Retrieve authenticated user's profile information.

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@crm.com",
  "created_at": "2026-05-24T10:00:00Z"
}
```

**Error Response (401):**
```json
{
  "message": "Access token required"
}
```

---

### Logout
Logout the current user (client-side token removal).

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Lead Endpoints

### Get All Leads
Retrieve all leads with optional filtering and search.

**Endpoint:** `GET /leads`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (New, Contacted, Converted, Rejected)
- `search` (optional): Search by name, email, or phone

**Examples:**
```
GET /leads
GET /leads?status=New
GET /leads?search=john
GET /leads?status=Converted&search=acme
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "company": "Acme Corporation",
    "source": "Website",
    "status": "New",
    "notes": "Interested in website development",
    "created_at": "2026-05-24T10:30:00Z",
    "updated_at": "2026-05-24T10:30:00Z"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1 (555) 987-6543",
    "company": "Tech Innovations",
    "source": "LinkedIn",
    "status": "Contacted",
    "notes": "Follow up next week",
    "created_at": "2026-05-23T14:15:00Z",
    "updated_at": "2026-05-24T09:00:00Z"
  }
]
```

---

### Get Lead by ID
Retrieve a specific lead by ID.

**Endpoint:** `GET /leads/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters:**
- `id` (required): The lead ID

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company": "Acme Corporation",
  "source": "Website",
  "status": "New",
  "notes": "Interested in website development",
  "created_at": "2026-05-24T10:30:00Z",
  "updated_at": "2026-05-24T10:30:00Z"
}
```

**Error Response (404):**
```json
{
  "message": "Lead not found"
}
```

---

### Create Lead
Create a new lead.

**Endpoint:** `POST /leads`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company": "Acme Corporation",
  "source": "Website",
  "status": "New",
  "notes": "Interested in website development"
}
```

**Field Requirements:**
- `name` (required): String, non-empty
- `email` (required): Valid email format
- `phone` (optional): String
- `company` (optional): String
- `source` (optional): String
- `status` (optional): One of [New, Contacted, Converted, Rejected]. Default: New
- `notes` (optional): String

**Success Response (201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "lead": {
    "id": 3,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "company": "Acme Corporation",
    "source": "Website",
    "status": "New",
    "notes": "Interested in website development",
    "created_at": "2026-05-24T15:45:00Z"
  }
}
```

**Validation Error (400):**
```json
{
  "message": "Validation failed",
  "errors": {
    "name": "Name is required and must be a string",
    "email": "Valid email is required"
  }
}
```

---

### Update Lead
Update an existing lead's information.

**Endpoint:** `PUT /leads/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): The lead ID

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "company": "Acme Corporation",
  "source": "Website",
  "status": "Contacted",
  "notes": "Updated notes"
}
```

**Note:** You only need to include the fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "lead": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "company": "Acme Corporation",
    "source": "Website",
    "status": "Contacted",
    "notes": "Updated notes",
    "created_at": "2026-05-24T10:30:00Z",
    "updated_at": "2026-05-24T16:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Lead not found"
}
```

---

### Update Lead Status
Update only the status of a lead.

**Endpoint:** `PATCH /leads/:id/status`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (required): The lead ID

**Request Body:**
```json
{
  "status": "Converted"
}
```

**Valid Status Values:**
- New
- Contacted
- Converted
- Rejected

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead status updated successfully",
  "lead": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "company": "Acme Corporation",
    "source": "Website",
    "status": "Converted",
    "notes": "Interested in website development",
    "created_at": "2026-05-24T10:30:00Z",
    "updated_at": "2026-05-24T16:15:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid status",
  "validStatuses": ["New", "Contacted", "Converted", "Rejected"]
}
```

---

### Delete Lead
Delete a lead permanently.

**Endpoint:** `DELETE /leads/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**URL Parameters:**
- `id` (required): The lead ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Lead not found"
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
Retrieve aggregated statistics for the dashboard.

**Endpoint:** `GET /dashboard/stats`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "total": 15,
  "new": 3,
  "contacted": 5,
  "converted": 4,
  "rejected": 3
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```
or
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Lead not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": {}
}
```

---

## Rate Limiting

Currently not implemented. Recommended for production.

---

## CORS Configuration

Allowed Origins:
- http://localhost:5173
- http://localhost:3000

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'
```

### Get All Leads
```bash
curl -X GET http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"+1 555-1234",
    "company":"Company",
    "source":"Website",
    "status":"New"
  }'
```

### Update Lead Status
```bash
curl -X PATCH http://localhost:3000/api/leads/1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Converted"}'
```

### Delete Lead
```bash
curl -X DELETE http://localhost:3000/api/leads/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Response Format

All responses follow this general structure:

### Success (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error (4xx, 5xx)
```json
{
  "message": "Error description",
  "errors": {}
}
```

---

## Versioning

Current API Version: v1 (implicit)

Future versions may be supported with `/api/v2/` prefix.

---

## Last Updated
May 2026
