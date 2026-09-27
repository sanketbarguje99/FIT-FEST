# Clinic Appointment, Patient & Emergency Management System (MERN)

A MERN stack app for the hackathon problem statement: patient & appointment
management plus basic emergency coordination (ambulance requests, blood bank
search/report, nearby hospital/clinic directory). No medical diagnosis or
treatment features are included, per the challenge scope.

## Stack
- **MongoDB** (Atlas or local) via Mongoose
- **Express** REST API
- **React** (Create React App) with React Router
- **Node.js**

## Project structure
```
clinic-mern/
  server/     Express API + Mongoose models
  client/     React frontend
```

## 1. Backend setup
```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI (Atlas connection string or local MongoDB)
npm run dev      # requires nodemon (npm install -D nodemon), or:
npm start
```
API runs at `http://localhost:5000`.

If you don't have MongoDB Atlas yet: create a free cluster at
https://www.mongodb.com/cloud/atlas, add a database user, allow network
access from anywhere (0.0.0.0/0) for the hackathon, and copy the connection
string into `MONGO_URI` in `.env`.

## 2. Frontend setup
Open a second terminal:
```bash
cd client
npm install
npm start
```
Runs at `http://localhost:3000` and talks to the API at `http://localhost:5000/api`
(configurable via `REACT_APP_API_URL` in a `client/.env` file if needed).

## Features implemented
- **Patients**: add / edit / delete / list basic patient info (name, age, gender, phone, blood group, address)
- **Appointments**: book, list, filter upcoming, update status (Scheduled/Completed/Cancelled/No-show), delete
- **Ambulance requests**: submit request with pickup/drop location, track & update status (Pending/Dispatched/Completed/Cancelled)
- **Blood bank**: report a need or donation availability, search by blood group and location
- **Hospitals/Clinics directory**: add and search facilities by location, flag ambulance availability
- **Dashboard**: quick stats (total patients, upcoming appointments, pending ambulance requests, open blood requests)

## API endpoints (base `/api`)
| Resource | Endpoints |
|---|---|
| Patients | `GET /patients`, `GET /patients/:id`, `POST /patients`, `PUT /patients/:id`, `DELETE /patients/:id` |
| Appointments | `GET /appointments`, `GET /appointments?upcoming=true`, `POST /appointments`, `PUT /appointments/:id`, `DELETE /appointments/:id` |
| Ambulance | `GET /ambulance`, `POST /ambulance`, `PUT /ambulance/:id` |
| Blood | `GET /blood?bloodGroup=&location=&type=`, `POST /blood`, `PUT /blood/:id` |
| Hospitals | `GET /hospitals?location=&type=`, `POST /hospitals` |

## Deploying for the hackathon (Google Cloud Run)
The challenge requires a Google Cloud Run deployment link + public GitHub repo.
1. Push this project to a public GitHub repo.
2. Deploy the backend and frontend as two Cloud Run services (or build the
   React app and serve it as static files from Express in a single service —
   simplest for a hackathon deadline). For a single-service deploy:
   - `cd client && npm run build`
   - Copy `client/build` into the server project (e.g. `server/public`)
   - In `server.js`, add:
     ```js
     app.use(express.static("public"));
     app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
     ```
   - Add a `Dockerfile` in `server/` and deploy that single service to Cloud Run.
3. Set `MONGO_URI` as an environment variable in the Cloud Run service config
   (use MongoDB Atlas, not a local DB, since Cloud Run has no persistent disk).

## Ideas to extend if you have time left
- Auth (clinic staff login) with JWT
- Pagination/search on the patients list
- Charts on the dashboard (appointments per day, blood requests by group)
- SMS/WhatsApp notification hook for ambulance dispatch
