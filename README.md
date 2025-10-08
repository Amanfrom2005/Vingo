# Vingo — Full-Stack Food Delivery Web App

Vingo is a full‑stack food delivery application that connects customers with local restaurants, owners, and delivery partners. It includes role‑based dashboards, real‑time order tracking, secure payments (Razorpay), OTP flows, image uploads (Cloudinary), maps/geocoding, and email notifications.

Monorepo layout:
- frontend: Vite + React + Redux Toolkit + Tailwind CSS + Socket.IO client + Leaflet + Firebase Auth
- backend: Node.js (Express 5) + MongoDB (Mongoose) + Socket.IO + JWT (cookies) + Razorpay + Cloudinary + Nodemailer

---

## Table of Contents
- Overview
- Features by Role
- Architecture
- Tech Stack
- Project Structure
- Prerequisites
- Configuration (Environment Variables)
- Running Locally
- API Overview
- Real‑Time Events
- Payments
- Emails & Media
- Scripts
- Deployment Notes
- Troubleshooting
- Contributing
- License

---

## Overview
Vingo provides a seamless ordering experience with real‑time delivery tracking and role‑specific interfaces:
- Customers browse shops and items, manage carts, place orders (COD or online), and track deliveries.
- Owners manage shop details and menus, and process shop‑specific orders.
- Delivery partners receive assignment updates and share live location.
- Admins manage users, shops, items, and orders via the admin dashboard.

## Features by Role
- Customer
  - Auth (email/password + Google)
  - City autodetect and reverse geocoding
  - Browse shops/items by city
  - Cart and checkout with COD or Razorpay
  - Live order status and delivery location
- Owner
  - Create/Edit shop (with image upload)
  - Manage items and incoming orders
- Delivery Partner
  - Accept assignments, share live location
  - Confirm delivery via OTP
- Admin
  - Admin dashboard for users/shops/items/orders

## Architecture
- Frontend (Vite/React)
  - State: Redux Toolkit (user, owner, map slices)
  - Maps: Leaflet via react‑leaflet, geocoding via Geoapify
  - Realtime: socket.io‑client with a custom Redux middleware
  - Payments: Razorpay Web SDK
- Backend (Express 5)
  - API: REST endpoints under /api/* (auth, user, shop, item, order, admin)
  - DB: MongoDB via Mongoose (User, Shop, Item, Order, DeliveryAssignment)
  - Auth: JWT stored in httpOnly cookies
  - Realtime: Socket.IO (delivery live location, identity handshake)
  - Media: Multer + Cloudinary uploads
  - Email: Nodemailer (Gmail)

## Tech Stack
- Frontend: React 19, Redux Toolkit, React Router, Tailwind CSS, Leaflet, Framer Motion, Swiper, Ionic React
- Backend: Node.js, Express 5, Mongoose 8, Socket.IO 4, Multer, Cloudinary, Nodemailer
- Payments: Razorpay
- Auth: JWT + cookies; Google sign‑in via Firebase

## Project Structure
```
.
├─ frontend/
│  ├─ src/
│  │  ├─ admin/                     # Admin layout/pages
│  │  ├─ components/                # Shared UI components
│  │  ├─ context/                   # Toast context
│  │  ├─ hooks/                     # Data + geolocation hooks
│  │  ├─ pages/                     # Customer/Owner pages
│  │  └─ redux/                     # store, slices, socket middleware
│  ├─ firebase.js                   # Firebase Auth init
│  └─ vite.config.js                # Vite + Tailwind plugin
└─ backend/
   ├─ config/db.js                  # Mongo connection (MONGODB_URL)
   ├─ controllers/                  # auth, user, shop, item, order, admin
   ├─ middlewares/                  # isAuth, isAdmin, multer
   ├─ models/                       # user, shop, item, order, deliveryAssignment
   ├─ routes/                       # /api/auth, /api/user, /api/shop, /api/item, /api/order, /api/admin
   ├─ utils/                        # cloudinary, mail, token
   ├─ socket.js                     # Socket.IO events
   └─ index.js                      # Express + CORS + routes + Socket.IO
```

## Prerequisites
- Node.js 18+
- npm (or yarn/pnpm)
- MongoDB (local or Atlas)
- Razorpay account (test keys are fine for development)
- Cloudinary account (for image uploads)
- Gmail account with App Password (for Nodemailer)
- Geoapify API key (reverse geocoding)

## Configuration (Environment Variables)
Create .env files in both frontend and backend folders.

frontend/.env
```
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_GEOAPIKEY=your_geoapify_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

backend/.env
```
# Important: the frontend points to http://localhost:8000 by default (see src/App.jsx)
# so set PORT=8000 here unless you change frontend/src/App.jsx
PORT=8000

# MongoDB connection
MONGODB_URL=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Nodemailer (Gmail)
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Ports & URLs
- Frontend dev server: http://localhost:5173
- Backend server: PORT from backend/.env (default recommended 8000)
- Frontend API base URL is defined in code at frontend/src/App.jsx:
  export const serverUrl = "http://localhost:8000";
  If you run the backend on a different port or host, update this constant.

CORS
- Backend (index.js) allows origin http://localhost:5173. Update this origin for production builds if your frontend is hosted elsewhere.

## Running Locally
In two terminals:
1) Backend
```
cd backend
npm install
npm run dev
```
2) Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

Notes
- Cookies are used for auth. Ensure you send credentials on API calls from the frontend (already handled with axios where needed via withCredentials: true).
- If you change backend port, update serverUrl in frontend/src/App.jsx and also the CORS origin in backend/index.js as needed.

## API Overview (selected routes)
Auth (/api/auth)
- POST /signup
- POST /signin
- GET  /signout
- POST /send-otp
- POST /verify-otp
- POST /reset-password
- POST /google-auth

User (/api/user)
- GET  /current
- POST /update-location
- GET  /stats
- GET  /cart
- POST /cart
- PUT  /cart
- DELETE /cart/:id
- DELETE /cart-clear

Shop (/api/shop)
- POST /create-edit          (multer single image upload)
- GET  /get-my
- GET  /get-by-city/:city

Item (/api/item)
- Standard CRUD endpoints (see backend/routes/item.routes.js and controllers)

Order (/api/order)
- POST /place-order
- POST /verify-payment
- GET  /my-orders
- GET  /get-assignments
- GET  /get-current-order
- POST /send-delivery-otp
- POST /verify-delivery-otp
- POST /update-status/:orderId/:shopId
- GET  /accept-order/:assignmentId
- GET  /get-order-by-id/:orderId
- GET  /get-today-deliveries

Admin (/api/admin)
- Admin management endpoints (see backend/routes/admin.routes.js)

## Real‑Time Events (Socket.IO)
Server (backend/socket.js)
- On connection: logs socket.id
- Client emits 'identity' with { userId } → server stores socketId + isOnline=true
- Client emits 'updateLocation' with { latitude, longitude, userId } → server broadcasts 'updateDeliveryLocation' with deliveryBoyId + coords
- On disconnect: server marks user isOnline=false and clears socketId

Client (frontend/src/redux/socketMiddleware.js)
- Dispatch 'socket/connect' to open a single socket connection
- Emits 'identity' after connect if user is logged in
- Listens to 'updateDeliveryLocation' and can dispatch updates to the store

## Payments
- Frontend uses Razorpay Web SDK with VITE_RAZORPAY_KEY_ID
- Backend verifies payment (order.controllers.js) using RAZORPAY_KEY_SECRET
- For development, use Razorpay test keys and test cards

## Emails & Media
- Emails: Nodemailer via Gmail (EMAIL_USER + EMAIL_PASS). Use a Gmail App Password (recommended) and avoid plain account passwords.
- OTP flows: password reset OTP, delivery confirmation OTP, welcome emails for users/owners/delivery partners (see backend/utils/mail.js)
- Media: Images uploaded to Cloudinary (backend/utils/cloudinary.js) via Multer middleware

## Scripts
Frontend (frontend/package.json)
- dev: vite --host
- build: vite build
- preview: vite preview
- lint: eslint .

Backend (backend/package.json)
- dev: nodemon index.js
- production start (manual): node index.js

## Deployment Notes
- Frontend: build with npm run build and deploy the dist folder to a static host (Netlify, Vercel, etc.). Ensure serverUrl points to your deployed backend URL.
- Backend: deploy Node + MongoDB (Render, Railway, VPS, etc.). Set environment variables. Update CORS origin(s) to your frontend domain. Expose HTTPS if possible.

## Troubleshooting
- CORS errors: ensure backend CORS origin matches your frontend origin (index.js) and that requests include withCredentials when needed
- Token not found: login sets httpOnly cookie; ensure the browser accepts cookies and axios calls include withCredentials: true
- Socket not connecting: make sure backend PORT matches serverUrl in frontend; confirm Socket.IO CORS origin is correct
- Map/geocoding not working: verify VITE_GEOAPIKEY and browser geolocation permissions
- Payments failing: confirm VITE_RAZORPAY_KEY_ID (frontend) and RAZORPAY_KEY_SECRET (backend); use Razorpay test mode
- Image upload failures: verify Cloudinary credentials and that multer is attached on upload routes

## Contributing
Contributions are welcome. Please fork, create a feature branch, and submit a PR with a clear description.

## License
MIT

---

Thank you for exploring Vingo!
