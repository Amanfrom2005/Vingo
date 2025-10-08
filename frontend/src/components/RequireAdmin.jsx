import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// A simple loading component, you can style it as you like
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <div className="text-lg font-semibold">Loading...</div>
  </div>
);

const RequireAdmin = ({ children }) => {
  const { userData, loading } = useSelector((state) => state.user);
  const location = useLocation();

  // While checking user auth, show a loading screen
  if (loading) {
    return <LoadingScreen />;
  }

  // If not logged in, redirect to signin
  if (!userData) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in but NOT an admin, redirect to home
  if (userData.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the admin content
  return children;
};

export default RequireAdmin;
