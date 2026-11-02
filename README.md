# WorkFlowHub

Minimal full-stack app (Django REST Framework + React) built to support Docker builds and CI pipelines for SOFT806 Assignment 1, Task 2.

**Features:** register, log in, log out, and create / edit / update status / delete workflow items (Pending, In Progress, Completed). Each user only sees their own items.

## Structure

```
backend/    Django REST Framework API (pip + requirements.txt, Dockerfile, tests)
frontend/   React app built with Vite (npm + package.json, Dockerfile)
.github/workflows/ci.yml   GitHub Actions pipeline
.circleci/config.yml       CircleCI pipeline
docker-compose.yml         Run the full stack locally
.env.example               Environment variables (copy to .env)
```

## Run with Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000/api/

## Run without Docker

Backend:

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
python manage.py test        # run the unit tests
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                  # http://localhost:5173
```

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | /api/auth/register/ | Create account, returns token |
| POST | /api/auth/login/ | Log in, returns token |
| POST | /api/auth/logout/ | Invalidate token |
| GET/POST | /api/items/ | List / create items |
| GET/PUT/PATCH/DELETE | /api/items/{id}/ | Retrieve / edit / update status / delete |

Send `Authorization: Token <token>` on all `/api/items/` requests.

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| DJANGO_SECRET_KEY | backend | Django secret key |
| DJANGO_DEBUG | backend | True/False |
| DJANGO_ALLOWED_HOSTS | backend | Comma-separated hosts |
| CORS_ALLOWED_ORIGINS | backend | Origins allowed to call the API |
| VITE_API_URL | frontend (build time) | API base URL |

For real deployments store secrets in GitHub Actions secrets / CircleCI environment variables, not in the repo.
## CI/CD Workflow

WorkflowHub uses automated CI/CD pipelines to improve
software development and deployment.

- GitHub Actions for automated workflows.
- CircleCI for continuous integration.
- Docker for containerisation.
- Docker Compose for local application testing.
