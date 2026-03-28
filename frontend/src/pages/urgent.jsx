import { Link } from "react-router-dom";
import FoodList from "../components /FoodList";

function UrgentPage() {
  return (
    <section className="show-page">
      <div className="show-page__header">
        <div>
          <p className="eyebrow">Urgent Action</p>
          <h1>High-priority food listings</h1>
          <p className="panel-card__copy">
            These items are the most time-sensitive and should be reviewed first.
          </p>
        </div>
        <Link className="secondary-button auth-link" to="/foods">
          Back to Browse
        </Link>
      </div>

      <FoodList urgentOnly />
    </section>
  );
}

export default UrgentPage;
