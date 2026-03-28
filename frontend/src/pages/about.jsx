function AboutPage() {
  return (
    <div className="dashboard-page">
      <section className="hero-card">
        <div>
          <p className="eyebrow">AI-Powered Food Rescue</p>
          <h1>Match urgent surplus food before it expires.</h1>
          <p className="hero-copy">
            FoodConnect combines live Convex updates, location intelligence, and
            backend AI scoring to highlight the most useful listings first.
          </p>
        </div>

        <div className="hero-metrics">
          <article className="metric-tile">
            <span className="metric-tile__value">Live</span>
            <span className="metric-tile__label">Realtime Convex sync</span>
          </article>
          <article className="metric-tile">
            <span className="metric-tile__value">AI</span>
            <span className="metric-tile__label">Priority and NGO routing</span>
          </article>
          <article className="metric-tile">
            <span className="metric-tile__value">Fast</span>
            <span className="metric-tile__label">Claim and rescue workflow</span>
          </article>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel-card">
          <p className="eyebrow">Platform Flow</p>
          <h2>One platform, four fast actions</h2>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Add Food</h3>
              <p>Publish surplus listings with expiry hours, quantity in kilograms, and location.</p>
            </article>
            <article className="feature-card">
              <h3>Search Smart</h3>
              <p>Find location-aware, AI-prioritized food opportunities fast.</p>
            </article>
            <article className="feature-card">
              <h3>Browse Ranked</h3>
              <p>See the highest-priority and most deliverable items first.</p>
            </article>
            <article className="feature-card">
              <h3>Claim Quickly</h3>
              <p>Prevent duplication and close the supply-to-demand loop live.</p>
            </article>
          </div>
        </section>

        <aside className="insight-panel">
          <p className="eyebrow">Demo Story</p>
          <h4>Application Overview</h4>
          <ul className="insight-list">
            <li>Food gets added live and geocoded automatically.</li>
            <li>OpenAI enriches urgency, deliverability, and NGO fit.</li>
            <li>High-priority listings appear first for faster action.</li>
          </ul>
        </aside>
      </div>

      <section className="panel-card">
        <p className="eyebrow">What The App Does</p>
        <h2>A backend-first redistribution workflow</h2>
        <div className="about-grid">
          <article className="feature-card">
            <h3>Live food publishing</h3>
            <p>Donors add surplus food with quantity in kilograms, expiry hours, and location in real time.</p>
          </article>
          <article className="feature-card">
            <h3>Location intelligence</h3>
            <p>The backend converts typed locations into coordinates for smarter routing and mapping.</p>
          </article>
          <article className="feature-card">
            <h3>AI enrichment</h3>
            <p>Each listing gets urgency, deliverability, NGO suggestions, and priority score before it is shown.</p>
          </article>
          <article className="feature-card">
            <h3>Actionable feed</h3>
            <p>NGOs see ranked opportunities instead of raw listings, which helps them act faster.</p>
          </article>
        </div>
      </section>

      <section className="panel-card">
        <h2>Not just a listing board, but a decision engine</h2>
        <ul className="insight-list">
          <li>Convex powers live sync, backend queries, alerts, and structured state.</li>
          <li>OpenAI is used in backend business logic, not just for cosmetic text.</li>
          <li>The platform only prioritizes food that is realistically useful and time-sensitive.</li>
          <li>The UX is designed so judges can understand the full story in one quick demo.</li>
        </ul>
      </section>
    </div>
  );
}

export default AboutPage;
