import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import AddFood from "./components /AddFood";
import FoodList from "./components /FoodList";
import SearchFood from "./components /SearchFood";
import Navbar from "./navbar";
import Footer from "./footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddFood />} />
        <Route path="/foods" element={<FoodList />} />
        <Route path="/search" element={<SearchFood />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App
