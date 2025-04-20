// Remove the swagger-ui-express import
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import emailRouter from './routes/email';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Swagger UI setup
const openApiSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../openapi.json'), 'utf-8')
);

// Serve OpenAPI spec
app.get('/api-docs/swagger.json', (c) => c.json(openApiSpec));

// Serve Swagger UI
app.get('/api-docs', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>API Documentation</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@latest/swagger-ui.css" />
    </head>
    <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@latest/swagger-ui-bundle.js" crossorigin></script>
        <script>
            window.onload = () => {
                window.ui = SwaggerUIBundle({
                    url: '/api-docs/swagger.json',
                    dom_id: '#swagger-ui',
                });
            };
        </script>
    </body>
    </html>
  `);
});

// Routes
app.get('/', (c) => c.json({ message: 'Email Service API is running' }));
app.route('/api/email', emailRouter);

// Error handling
app.notFound((c) => c.json({ message: 'Not Found' }, 404));
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ message: 'Internal Server Error' }, 500);
});

// Start server
const port = process.env.PORT || 3000;
serve({
  fetch: app.fetch,
  port: Number(port),
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app

