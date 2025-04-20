# Hono Email Service

A backend service built with Hono and TypeScript for sending emails using Nodemailer. This service is configured for deployment on Vercel.

## Features

- RESTful API for sending emails
- TypeScript support
- Email validation using Zod
- Nodemailer integration for email delivery
- Environment-based configuration
- Vercel deployment ready

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd hono-email-service

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## Development

```bash
# Start development server with hot-reload
npm run dev
```

The server will be available at http://localhost:3000

## API Endpoints

### GET /

Health check endpoint that returns a status message.

### POST /api/email

Sends an email.

**Request Body:**

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "text": "Plain text content",
  "html": "<p>HTML content (optional)</p>"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

## Building for Production

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Deployment to Vercel

This project is configured for deployment on Vercel using the included `vercel.json` file.

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel`

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| EMAIL_FROM | Sender email address | noreply@example.com |
| SMTP_HOST | SMTP server host | - |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_SECURE | Use secure connection | false |
| SMTP_USER | SMTP username | - |
| SMTP_PASSWORD | SMTP password | - |
| ETHEREAL_USER | Ethereal email username (for testing) | - |
| ETHEREAL_PASSWORD | Ethereal email password (for testing) | - |

## License

MIT