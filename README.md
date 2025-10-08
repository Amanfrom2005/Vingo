# Vingo - Food Delivery Web Application

Vingo is a full-stack food delivery web application designed to connect users with nearby restaurants and provide a seamless ordering, tracking, and delivery experience. It supports multiple user roles including customers, restaurant owners, and delivery personnel, each with customized dashboards and features.

## Features

- **User Roles**
  - Customer: Browse shops and menu, place orders, track delivery status, and rate food items.
  - Owner: Manage restaurant details, add/edit menu items, view and manage orders.
  - DeliveryBoy: Receive assignments, track delivery locations in real time, and update order statuses.

- **User Interface**
  - Responsive and modern UI built with React and Tailwind CSS.
  - Smooth horizontal scroll carousels for categories and shops.
  - Interactive maps using Leaflet to track delivery progress.
  - Accessible design with ARIA attributes and keyboard navigation support.

- **Order Management**
  - Real-time order status updates via WebSocket.
  - Secure payment integration supporting cash on delivery and Razorpay.
  - OTP verification for order deliveries.

- **Location Features**
  - Geolocation-based city detection and reverse geocoding.
  - Location updating for delivery personnel.
  - Address search with map support for checkout.

## Tech Stack

- **Frontend**
  - React with hooks and context
  - Redux Toolkit for state management
  - React Router for routing
  - Tailwind CSS for styling
  - React Leaflet for maps and location tracking

- **Backend**
  - Node.js with Express
  - MongoDB for database
  - Socket.IO for real-time communication
  - Razorpay for online payments

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB instance (local or cloud)
- Razorpay account for payment integration

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/vingo.git
   cd vingo
   ```

2. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

4. Setup environment variables:

   Create `.env` files in both `frontend` and `backend` directories with the following keys:

   - `frontend/.env`

     ```
     VITE_FIREBASE_APIKEY=your_key
     VITE_GEOAPIKEY=your_geoapify_api_key
     VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
     ```

   - `backend/.env`

     ```
     PORT=your_backend_port
     MONGO_URI=your_mongodb_connection_string
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     JWT_SECRET=your_jwt_secret
     EMAIL_USER = your_key
     EMAIL_PASS = your_key
     CLOUDINARY_CLOUD_NAME = your_key
     CLOUDINARY_API_KEY = your_key
     CLOUDINARY_API_SECRET = your_key
     ```

### Running the App

- Start the backend server:

  ```bash
  cd backend
  npm run dev
  ```

- Start the frontend client:

  ```bash
  cd frontend
  npm run dev
  ```

Open your browser and visit `http://localhost:5173` or the configured frontend port.


## Important Components and Hooks

- `UserDashboard`, `OwnerDashboard`, `DeliveryBoy`: Role-based dashboards.
- `useGetCity`, `useGetCurrentUser`, `useGetItemsByCity`, `useGetShopByCity`: Custom hooks for fetching data and geolocation.
- `FoodCard`, `CategoryCard`, `CartItemCard`, `OwnerItemCard`, etc.: Reusable UI components.
- `DeliveryBoyTracking`: Live map tracking of delivery locations.
- Authentication, OTP verification, payment integration handled in backend and frontend controllers.

## Accessibility

- Semantic HTML5 elements used throughout the UI.
- ARIA attributes and roles implemented for assistive technologies.
- Keyboard navigable components and focus management.
- Live regions to announce dynamic updates.

## Contributing

Contributions are welcome! Please fork the repo, create a new branch, and submit a pull request with clear descriptions of changes.

## License

This project is licensed under the MIT License.

***

For detailed API documentation, development guides, and further information, please refer to the `/docs` folder or contact the maintainer.

***

**Thank you for exploring Vingo!**