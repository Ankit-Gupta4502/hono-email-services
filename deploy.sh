docker build -t hono-email-service .
docker run --env-file .env -p 3000:3000 hono-email-service