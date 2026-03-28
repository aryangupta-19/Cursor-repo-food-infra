import { useState } from "react";
import FoodList from "./FoodList";

function SearchFood(props) {
  const [internalSearchText, setInternalSearchText] = useState("");
  const [internalLocationText, setInternalLocationText] = useState("");

  const searchText = props.searchText ?? internalSearchText;
  const setSearchText = props.setSearchText ?? setInternalSearchText;
  const locationText = props.locationText ?? internalLocationText;
  const setLocationText = props.setLocationText ?? setInternalLocationText;
  const isStandalonePage =
    props.searchText === undefined || props.setSearchText === undefined;

  return (
    <>
      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #e3e6ef",
          borderRadius: "16px",
          padding: "20px",
          background: "#ffffff",
          textAlign: "left",
        }}
      >
        <h2>Smart Search</h2>
        <p style={{ marginBottom: "16px", color: "#6b7280" }}>
          Filter by food name, city, or type "urgent" to find fast-moving items.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <input
            placeholder="Search by food or keyword"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db" }}
          />
          <input
            placeholder="Your location"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d1d5db" }}
          />
        </div>

        <div style={{ marginTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => {
              setSearchText("urgent");
            }}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "999px",
              padding: "8px 12px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Show urgent
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setLocationText("");
            }}
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "999px",
              padding: "8px 12px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Clear filters
          </button>
        </div>
      </div>

      {isStandalonePage ? (
        <FoodList searchText={searchText} locationText={locationText} />
      ) : null}
    </>
  );
}

export default SearchFood;
