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
      <section className="panel-card">
        <h2>Smart Search</h2>
        <p className="panel-card__copy">
          Filter by food name, city, or type "urgent" to find fast-moving items.
        </p>

        <div className="field-grid">
          <input
            className="field-input"
            placeholder="Search by food or keyword"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <input
            className="field-input"
            placeholder="Your location"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
          />
        </div>

        <div className="chip-row">
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setSearchText("urgent");
            }}
          >
            Show urgent
          </button>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setSearchText("");
              setLocationText("");
            }}
          >
            Clear filters
          </button>
        </div>
      </section>

      {isStandalonePage ? (
        <FoodList searchText={searchText} locationText={locationText} />
      ) : null}
    </>
  );
}

export default SearchFood;
