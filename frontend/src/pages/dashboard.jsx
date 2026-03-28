import { useState } from "react";
import AddFood from "../components /AddFood";
import FoodList from "../components /FoodList";
import SearchFood from "../components /SearchFood";

function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Food Redistribution</h1>
      <p style={{ color: "#6b7280", marginBottom: "24px" }}>
        Add surplus food, see nearby listings update live, and claim items before
        they go to waste.
      </p>

      <AddFood />
      <SearchFood
        searchText={searchText}
        setSearchText={setSearchText}
        locationText={locationText}
        setLocationText={setLocationText}
      />
      <FoodList searchText={searchText} locationText={locationText} />
    </div>
  );
}

export default Dashboard;
