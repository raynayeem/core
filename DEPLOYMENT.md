# CORE CMS EC2 Deployment Guide (Docker + Env Files)

This guide explains how to deploy CORE CMS on an AWS EC2 Ubuntu server using Docker Compose, MongoDB Atlas, and the included deployment script.

## 1. Architecture

- Frontend: React app served by Nginx in a container.
- Backend: Node.js API in a container.
- Database: MongoDB Atlas (external, managed).
- Optional host Nginx: reverse proxy from public port 80/443 to app upstream port on localhost.

## 2. Prerequisites

- AWS EC2 Ubuntu instance (Ubuntu 22.04+ recommended).
- Security Group rules:
  - Port 22 (SSH) from your IP.
  - Port 80 (HTTP) from public internet.
  - Port 443 (HTTPS) from public internet (if SSL will be enabled).
- MongoDB Atlas cluster and connection string.
- A domain name (only if you want SSL with Let's Encrypt).

## 3. Clone Project on EC2

```bash
git clone <your-repo-url>
cd CORE-CMS
```

## 4. Create Environment Files

Two env files are expected by the deployment workflow:

- Root env file for Docker Compose and deployment settings.
- Backend env file for backend-level configuration compatibility.

Create both:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 4.1 Required values in .env

Edit `.env` and set at least:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
APP_UPSTREAM_PORT=8080
```

Recommended deployment values in `.env`:

```env
VITE_API_URL=/api
VITE_UPLOAD_URL=
APP_SERVER_NAME=_
APP_DOMAIN=
APP_DOMAIN_ALIASES=
LETSENCRYPT_EMAIL=
APP_GIT_REMOTE=origin
APP_GIT_BRANCH=main
APP_SEED_ENDPOINT=/api/seed
```

### 4.2 backend/.env

Set matching backend values in `backend/.env` (same `MONGODB_URI` and `JWT_SECRET`), for consistency with script validation.

## 5. Install Docker, Nginx, and Certbot on EC2

Run:

```bash
chmod +x deploy.sh
./deploy.sh setup
```

If Docker was newly installed, reconnect your SSH session once.

## 6. Build and Start the Application

```bash
./deploy.sh start
```

This will:

- Build images.
- Start containers with Docker Compose.
- Bind app upstream to `APP_UPSTREAM_PORT` (default 8080).

Check status:

```bash
./deploy.sh status
```

View logs:

```bash
./deploy.sh logs
```

## 7. Expose Public HTTP via Host Nginx

Configure host Nginx as reverse proxy to `127.0.0.1:APP_UPSTREAM_PORT`:

```bash
./deploy.sh setup-nginx
```

After this step, your app should be reachable at your EC2 public IP on port 80.

## 8. Enable HTTPS (Optional)

Set these in `.env` first:

- `APP_DOMAIN=yourdomain.com`
- `APP_DOMAIN_ALIASES=www.yourdomain.com` (optional)
- `LETSENCRYPT_EMAIL=you@yourdomain.com`

Then run:

```bash
./deploy.sh ssl
```

This configures certificates using Certbot + Nginx.

## 9. Update, Restart, Stop

```bash
./deploy.sh update
./deploy.sh restart
./deploy.sh stop
```

## 10. Database Backup (MongoDB Atlas)

Create backup archive:

```bash
./deploy.sh backup
```

Backups are stored in `./backups` and only the latest 7 archives are retained.

## 11. Troubleshooting

Run diagnostics:

```bash
./deploy.sh diagnose
```

Common checks:

- Verify `MONGODB_URI` and `JWT_SECRET` are present.
- Ensure Atlas network access allows EC2 public IP.
- Ensure Security Group allows 80/443.
- Confirm DNS points to EC2 public IP before running SSL.

## 12. Useful Script Commands

```bash
./deploy.sh help
./deploy.sh build
./deploy.sh start
./deploy.sh stop
./deploy.sh restart
./deploy.sh logs
./deploy.sh backup
./deploy.sh setup-nginx
./deploy.sh ssl
./deploy.sh update
./deploy.sh status
./deploy.sh diagnose
```
