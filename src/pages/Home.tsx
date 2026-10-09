import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

const features = [
  {
    icon: <Activity size={25} />,
    title: "Exposure Assessment",
    description:
      "Answer simple questions about your daily habits and receive a personalized exposure score.",
    path: "/assessment",
    action: "Start assessment",
  },
  {
    icon: <ShieldCheck size={25} />,
    title: "Interactive Body Explorer",
    description:
      "Explore how microplastics may enter the body and which organs researchers are studying.",
    path: "/explorer",
    action: "Open 3D explorer",
  },
  {
    icon: <Globe2 size={25} />,
    title: "Global Research Map",
    description:
      "Discover microplastic studies, sampling locations, and findings from around the world.",
    path: "/map",
    action: "Explore the map",
  },
  {
    icon: <BookOpen size={25} />,
    title: "Research Library",
    description:
      "Read clear summaries of scientific studies covering food, water, air, and human health.",
    path: "/research",
    action: "View research",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell us about your habits",
    text: "Answer questions about drinking water, food storage, clothing, and household products.",
  },
  {
    number: "02",
    title: "Understand your exposure",
    text: "MicroGuard AI ranks the daily activities that may contribute most to your exposure.",
  },
  {
    number: "03",
    title: "Build a safer routine",
    text: "Receive practical suggestions and plastic alternatives based on your answers.",
  },
];

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Human Microplastic Exposure Intelligence
          </div>

          <h1>
            See the plastic exposure
            <span> hidden in everyday life.</span>
          </h1>

          <p className="hero-description">
            MicroGuard AI transforms daily habits and scientific research into
            clear, personalized insights that help you make informed choices.
          </p>

          <div className="hero-actions">
            <Link to="/assessment" className="primary-button">
              Check My Exposure
              <ArrowRight size={18} />
            </Link>

            <Link to="/explorer" className="secondary-button">
              Explore the Human Body
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={17} />
              Free to use
            </span>

            <span>
              <CheckCircle2 size={17} />
              Research informed
            </span>

            <span>
              <CheckCircle2 size={17} />
              No sign-up required
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src={heroImage}
              alt="Microplastic particles visualized in water"
            />

            <div className="floating-card floating-card-top">
              <span className="floating-icon">
                <Activity size={18} />
              </span>
              <div>
                <small>Daily exposure</small>
                <strong>Made visible</strong>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="floating-score">6</span>
              <div>
                <small>Major pathways</small>
                <strong>Tracked together</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <article>
          <strong>6</strong>
          <span>Exposure pathways analyzed</span>
        </article>

        <article>
          <strong>10+</strong>
          <span>Daily habits assessed</span>
        </article>

        <article>
          <strong>20+</strong>
          <span>Research findings summarized</span>
        </article>

        <article>
          <strong>100%</strong>
          <span>Educational and private</span>
        </article>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <span className="eyebrow">Explore the platform</span>
          <h2>Understand exposure from every angle</h2>
          <p>
            Move from scientific evidence to practical action with connected
            tools built around your everyday life.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Link to={feature.path}>
                {feature.action}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Three steps toward a lower-plastic routine</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div>
          <span className="eyebrow">Your personal starting point</span>
          <h2>Find the habits that influence your exposure.</h2>
          <p>
            Complete the assessment and receive your source ranking, safety
            plan, and recommended plastic alternatives.
          </p>
        </div>

        <Link to="/assessment" className="primary-button">
          Begin Assessment
          <ArrowRight size={18} />
        </Link>
      </section>

      <p className="education-note">
        MicroGuard AI provides educational estimates based on reported habits.
        It does not diagnose medical conditions or measure microplastics inside
        the body.
      </p>
    </div>
  );
}

export default Home;