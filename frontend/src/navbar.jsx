import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{ padding: "10px", background: "#222", color: "white" }}>
      <h2>FoodConnect</h2>

      <Link to="/" style={{ marginRight: "10px", color: "white" }}>Home</Link>
      <Link to="/add" style={{ marginRight: "10px", color: "white" }}>Add Food</Link>
      <Link to="/foods" style={{ marginRight: "10px", color: "white" }}>Browse</Link>
      <Link to="/search" style={{ color: "white" }}>Search</Link>
    </div>
  );
}

export default Navbar;
