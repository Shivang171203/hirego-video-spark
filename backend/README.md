# HireGo Video Spark - Backend API

A Node.js/Express backend API for managing candidates in the HireGo Video Spark recruitment platform.

## Features

- **Candidate Management**: Full CRUD operations for candidates
- **Advanced Filtering**: Filter candidates by status, position, location, experience, AI match score, and skills
- **Search Functionality**: Search candidates by name, position, email, or skills
- **Pagination**: Built-in pagination for large datasets
- **Statistics**: Get overview statistics of candidates
- **Bulk Operations**: Bulk update candidate statuses
- **Data Validation**: Comprehensive input validation using Joi
- **Error Handling**: Consistent error responses across the API
- **Security**: CORS, Helmet, Rate limiting, and Row Level Security (RLS)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Supabase account and project

## Installation

1. **Clone the repository and navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:

   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   SUPABASE_URL=https://pjskxvmvnfycfqtjoupe.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-jwt-secret
   ```

4. **Set up the database:**
   Run the SQL commands in `database/candidates.sql` in your Supabase SQL editor to create the candidates table and sample data.

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your environment variables).

## API Endpoints

### Candidates

#### Get All Candidates

```
GET /api/candidates
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `position` (optional): Filter by position
- `location` (optional): Filter by location
- `minExperience` (optional): Minimum experience years
- `maxExperience` (optional): Maximum experience years
- `minAiMatch` (optional): Minimum AI match score
- `hasVideoResume` (optional): Filter by video resume availability
- `skills` (optional): Comma-separated skills to filter by

**Example:**

```bash
GET /api/candidates?page=1&limit=20&status=Active&minAiMatch=80
```

#### Get Candidate by ID

```
GET /api/candidates/:id
```

#### Create New Candidate

```
POST /api/candidates
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "position": "Software Engineer",
  "experience_years": 5,
  "location": "San Francisco, CA",
  "ai_match_score": 85,
  "status": "Active",
  "has_video_resume": false,
  "rating": 4.5,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### Update Candidate

```
PUT /api/candidates/:id
```

#### Delete Candidate

```
DELETE /api/candidates/:id
```

#### Get Candidate Statistics

```
GET /api/candidates/stats/overview
```

#### Search Candidates

```
GET /api/candidates/search/query?q=search_term&limit=20
```

#### Bulk Update Status

```
PATCH /api/candidates/bulk/status
```

**Request Body:**

```json
{
  "candidateIds": [1, 2, 3],
  "status": "Shortlisted"
}
```

### Health Check

```
GET /health
```

## Database Schema

The `candidates` table includes the following fields:

- `id`: Unique identifier (BIGSERIAL)
- `name`: Candidate's full name (VARCHAR)
- `email`: Email address (VARCHAR, UNIQUE)
- `position`: Job position (VARCHAR)
- `experience_years`: Years of experience (INTEGER)
- `location`: Geographic location (VARCHAR)
- `ai_match_score`: AI-generated match score (INTEGER, 0-100)
- `status`: Current status (VARCHAR: Active, Interviewing, Shortlisted, Rejected, Hired)
- `has_video_resume`: Whether candidate has video resume (BOOLEAN)
- `rating`: Candidate rating (DECIMAL, 0.0-5.0)
- `skills`: Array of skills (TEXT[])
- `phone`: Phone number (VARCHAR, optional)
- `linkedin_url`: LinkedIn profile URL (TEXT, optional)
- `github_url`: GitHub profile URL (TEXT, optional)
- `portfolio_url`: Portfolio URL (TEXT, optional)
- `notes`: Additional notes (TEXT, optional)
- `created_at`: Creation timestamp (TIMESTAMP)
- `updated_at`: Last update timestamp (TIMESTAMP)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (in development mode)"
}
```

## Validation

All input data is validated using Joi schemas:

- **Required fields**: name, email, position, experience_years, location
- **Field constraints**: Email format, experience range (0-50), AI match score (0-100), rating (0.0-5.0)
- **Status values**: Active, Interviewing, Shortlisted, Rejected, Hired
- **Skills**: Array of 1-20 skills, each 1-50 characters

## Security Features

- **CORS**: Configured for frontend origin
- **Helmet**: Security headers
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive validation of all inputs
- **Row Level Security**: Database-level access control (configurable)

## Development

### Project Structure

```
backend/
├── config/
│   ├── supabase.js          # Supabase client configuration
│   └── environment.js       # Environment configuration
├── database/
│   └── candidates.sql       # Database schema and sample data
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Global error handling
│   └── validation.js       # Input validation
├── routes/
│   └── candidates.js       # Candidate API routes
├── index.js                # Main server file
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

### Adding New Features

1. **New Routes**: Add to `routes/candidates.js` or create new route files
2. **New Middleware**: Add to `middleware/` directory
3. **Database Changes**: Update `database/candidates.sql`
4. **Validation**: Add schemas to `middleware/validation.js`

## Testing

To test the API endpoints, you can use tools like:

- **Postman**: Import the collection
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension
- **Insomnia**: API testing tool

## Deployment

1. **Environment Variables**: Set production environment variables
2. **Database**: Ensure Supabase is properly configured
3. **CORS**: Update FRONTEND_URL for production
4. **Security**: Change JWT_SECRET and enable authentication
5. **Monitoring**: Add logging and monitoring tools

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Update documentation
5. Test thoroughly

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please contact the development team or create an issue in the repository.
