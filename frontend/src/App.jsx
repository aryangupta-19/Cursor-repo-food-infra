import './App.css'
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import AboutPage from "./pages/about";
import Dashboard from "./pages/dashboard";
import LoginPage from "./pages/login";
import LogoutPage from "./pages/logout";
import ShowPage from "./pages/show";
import SignupPage from "./pages/signup";
import UrgentPage from "./pages/urgent";
import AddFood from "./components /AddFood";
import FoodList from "./components /FoodList";
import SearchFood from "./components /SearchFood";
import Navbar from "./navbar";
import Footer from "./footer";
import { getSessionToken, getStoredUser } from "./services/auth";

function ProtectedRoute({ children }) {
  const user = getStoredUser();
  const sessionToken = getSessionToken();

  if (!user || !sessionToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestOnlyRoute({ children }) {
  const user = getStoredUser();
  const sessionToken = getSessionToken();

  if (user && sessionToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/signup"
              element={
                <GuestOnlyRoute>
                  <SignupPage />
                </GuestOnlyRoute>
              }
            />
            <Route
              path="/login"
              element={
                <GuestOnlyRoute>
                  <LoginPage />
                </GuestOnlyRoute>
              }
            />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="/foods"
              element={
                <ProtectedRoute>
                  <FoodList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchFood />
                </ProtectedRoute>
              }
            />
            <Route
              path="/show/:foodId"
              element={
                <ProtectedRoute>
                  <ShowPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/urgent"
              element={
                <ProtectedRoute>
                  <UrgentPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
