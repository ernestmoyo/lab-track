# LabTrack API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All endpoints (except login and health) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Health Check
```
GET /health
```
Returns `{ "status": "ok", "timestamp": "..." }`

---

### Auth

#### Login
```
POST /auth/login
Body: { "email": "string", "password": "string" }
Response: { "token": "string", "user": { "id", "email", "fullName", "role" } }
```

#### Register User (Admin only)
```
POST /auth/register
Body: { "email": "string", "password": "string", "fullName": "string", "role": "string" }
Response: { "id", "email", "full_name", "role", "created_at" }
```

#### Get Profile
```
GET /auth/profile
Response: { "id", "email", "full_name", "role", "is_active", "created_at" }
```

---

### Samples

#### List Samples
```
GET /samples?status=registered&priority=high&search=blood&limit=50&offset=0
Response: [{ sample object }, ...]
```

#### Get Sample
```
GET /samples/:id
Response: { sample object }
```

#### Create Sample
```
POST /samples
Body: { "sampleId": "string", "type": "string", "source": "string", "description": "string", "priority": "string", "metadata": {} }
Response: { sample object }
```

#### Update Sample
```
PATCH /samples/:id
Body: { fields to update }
Response: { sample object }
```

#### Delete Sample (Admin/Lab Manager only)
```
DELETE /samples/:id
Response: 204 No Content
```

---

### Tests

#### List Tests
```
GET /tests?sampleId=uuid&status=pending&assignedTo=uuid&limit=50&offset=0
Response: [{ test object with sample_code and sample_type }, ...]
```

#### Get Test
```
GET /tests/:id
Response: { test object }
```

#### Create Test
```
POST /tests
Body: { "sampleId": "uuid", "testType": "string", "assignedTo": "uuid", "notes": "string" }
Response: { test object }
```

#### Update Test
```
PATCH /tests/:id
Body: { fields to update }
Response: { test object }
```

---

### Dashboard

#### Get Stats
```
GET /dashboard/stats
Response: { "samples": {}, "tests": {}, "totalSamples": number, "totalTests": number, "recentSamples": [] }
```

## Roles

| Role | Permissions |
|------|------------|
| admin | Full access, user management |
| lab_manager | Sample/test CRUD, delete samples |
| technician | Sample/test create and update |
| viewer | Read-only access |

## Error Responses

All errors follow the format:
```json
{ "error": "Error message here" }
```

Common status codes:
- 400: Bad request / validation error
- 401: Authentication required or invalid token
- 403: Insufficient permissions
- 404: Resource not found
- 409: Conflict (duplicate)
- 500: Internal server error
