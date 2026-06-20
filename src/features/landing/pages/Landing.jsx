import { Link } from 'react-router-dom';
import '../../../styles/Landing.css';

const FEATURES = [
  { icon: '🏋️', title: 'Structured Plans',    desc: 'Programs built for real results — gym or home.' },
  { icon: '🎥', title: 'Exercise Tutorials',  desc: '100+ video demos to perfect your form.' },
  { icon: '🥗', title: 'Nutrition Guidance',  desc: 'Personalized calorie and protein targets.' },
  { icon: '📈', title: 'Progress Tracking',   desc: 'Weight, measurements, PRs, and photos.' },
];

const PLANS = [
  { label: '1 Month',  price: '$29.99', per: '/mo',   highlight: false },
  { label: '3 Months', price: '$22.66', per: '/mo',   highlight: true,  note: 'Save 24%' },
  { label: '12 Months',price: '$14.99', per: '/mo',   highlight: false, note: 'Save 50%' },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* Nav */}
      <nav className="nav">
        <span className="nav-logo">Habit<span>Tracker</span></span>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <Link to="/login" className="nav-btn-ghost">Log in</Link>
          <Link to="/register" className="nav-btn-solid">Start free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">No Hype. Just Results.</div>
        <h1>
          Build the body<br />
          <span>you actually want.</span>
        </h1>
        <p>
          A complete step-by-step system for building muscle and losing fat —
          no fluff, no guesswork, just a proven method that works.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Sign up</Link>
          <Link to="/login" className="btn-ghost">Already a member →</Link>
        </div>
        <div className="hero-stats">
          <div><strong>10K+</strong><span>Members</span></div>
          <div><strong>100+</strong><span>Exercises</span></div>
          <div><strong>150+</strong><span>Recipes</span></div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-label">// what's inside</div>
        <h2>Everything you need. Nothing you don't.</h2>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="section-label">// pricing</div>
        <h2>Simple, transparent pricing.</h2>
        <div className="plans-grid">
          {PLANS.map(p => (
            <div className={`plan-card ${p.highlight ? 'plan-highlight' : ''}`} key={p.label}>
              {p.note && <div className="plan-badge">{p.note}</div>}
              <div className="plan-label">{p.label}</div>
              <div className="plan-price">{p.price}<span>{p.per}</span></div>
              <Link to="/src/features/auth/pages/Register" className={p.highlight ? 'btn-primary' : 'btn-outline'}>
                Get started
              </Link>
            </div>
          ))}
        </div>
        <p className="pricing-note">7-day free trial · Cancel anytime</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span>© 2026 Habit Tracker</span>
        <div>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
