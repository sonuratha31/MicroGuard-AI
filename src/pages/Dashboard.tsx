import {
  ArrowRight,
  CheckCircle2,
  Download,
  RefreshCw,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAssessment } from "../context/AssessmentContext";

type HistoryEntry = {
  id: string;
  score: number;
  category: string;
  createdAt: string;
};

const alternatives = [
  {
    category: "Water storage",
    replace: "Single-use plastic bottle",
    with: "Steel or glass water bottle",
    advantages: "Reusable, easy to carry, and avoids single-use packaging.",
    limitations: "Check for quality seals and avoid overfilling hot drinks in glass containers.",
  },
  {
    category: "Food storage",
    replace: "Plastic food container",
    with: "Glass or stainless-steel container",
    advantages: "Helps reduce repeated plastic contact and is often easier to clean thoroughly.",
    limitations: "Choose appropriate lids and avoid thermal shock with very hot contents in glass.",
  },
  {
    category: "Drinks",
    replace: "Disposable takeaway cup",
    with: "Reusable ceramic or steel cup",
    advantages: "Lower reliance on disposable items and often more durable over time.",
    limitations: "Clean regularly and check material suitability for hot drinks.",
  },
  {
    category: "Beverage prep",
    replace: "Plastic tea bag",
    with: "Loose-leaf tea with a metal strainer",
    advantages: "Reduces single-use packaging and offers a more controlled brewing routine.",
    limitations: "Choose a strainer that is easy to clean and maintain.",
  },
  {
    category: "Household cleaning",
    replace: "Synthetic cleaning cloth",
    with: "Cotton or natural-fibre cloth",
    advantages: "Can reduce reliance on synthetic fibres and is often simpler to launder.",
    limitations: "Wash and dry fully to avoid moisture retention and odor.",
  },
];

const sourceSuggestions: Record<string, string> = {
  "Drinking water":
    "Carry filtered water in a reusable steel or glass bottle.",
  "Food storage":
    "Move food into glass or ceramic containers before heating it.",
  "Takeaway packaging":
    "Request reusable or non-plastic containers when practical.",
  "Synthetic textiles":
    "Choose natural fibres more often and wash synthetic clothes less aggressively.",
  "Indoor dust":
    "Ventilate rooms and use damp cleaning methods to reduce airborne dust.",
  "Hot beverages":
    "Use loose-leaf tea, a metal strainer, and a reusable cup.",
  "Personal care":
    "Check ingredient lists and avoid unnecessary glitter or plastic particles.",
  "Food packaging":
    "Store unpackaged food in reusable glass or steel containers.",
};

function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("microguard-history");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readChecklist(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem("microguard-checklist");
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function Dashboard() {
  const {
    score,
    rankedSources,
    completedQuestions,
    isComplete,
    resetAssessment,
  } = useAssessment();

  const [history, setHistory] = useState<HistoryEntry[]>(readHistory);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(readChecklist);

  const topSources = rankedSources.slice(0, 5);
  const riskLevel =
    score <= 33 ? "Lower" : score <= 66 ? "Moderate" : "Higher";
  const riskClass =
    score <= 33 ? "risk-low" : score <= 66 ? "risk-medium" : "risk-high";

  useEffect(() => {
    if (!isComplete) {
      return;
    }

    const nextEntry: HistoryEntry = {
      id: `assessment-${Date.now()}`,
      score,
      category: riskLevel,
      createdAt: new Date().toISOString(),
    };

    setHistory((currentHistory) => [nextEntry, ...currentHistory].slice(0, 5));
  }, [isComplete, riskLevel, score]);

  useEffect(() => {
    window.localStorage.setItem("microguard-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.localStorage.setItem("microguard-checklist", JSON.stringify(checklist));
  }, [checklist]);

  const safetyPlan = topSources
    .filter((source) => source.score > 0)
    .slice(0, 4)
    .map((source) => ({
      source: source.name,
      recommendation:
        sourceSuggestions[source.name] ??
        "Reduce unnecessary contact with disposable plastic products.",
    }));

  const completedActions = Object.values(checklist).filter(Boolean).length;
  const actionProgress = safetyPlan.length
    ? (completedActions / safetyPlan.length) * 100
    : 0;

  function toggleChecklist(source: string) {
    setChecklist((current) => ({
      ...current,
      [source]: !current[source],
    }));
  }

  function downloadReport() {
    const report = new jsPDF();
    const date = new Date().toLocaleDateString();

    report.setFillColor(7, 59, 58);
    report.rect(0, 0, 210, 42, "F");

    report.setTextColor(255, 255, 255);
    report.setFontSize(22);
    report.text("MicroGuard AI", 18, 20);

    report.setFontSize(11);
    report.text("Personal Exposure Summary", 18, 29);

    report.setTextColor(24, 55, 52);
    report.setFontSize(11);
    report.text(`Generated: ${date}`, 18, 55);

    report.setFontSize(18);
    report.text(`Habit-based exposure score: ${score}/100`, 18, 70);

    report.setFontSize(12);
    report.text(`Interpretation: ${riskLevel} relative exposure pattern`, 18, 80);

    report.setFontSize(15);
    report.text("Top reported exposure sources", 18, 98);

    report.setFontSize(11);
    topSources.forEach((source, index) => {
      report.text(
        `${index + 1}. ${source.name}: ${source.score}%`,
        22,
        110 + index * 9,
      );
    });

    report.setFontSize(15);
    report.text("Personal safety plan", 18, 162);

    report.setFontSize(10);
    let verticalPosition = 174;

    safetyPlan.forEach((item, index) => {
      const lines = report.splitTextToSize(
        `${index + 1}. ${item.recommendation}`,
        165,
      );

      report.text(lines, 22, verticalPosition);
      verticalPosition += lines.length * 6 + 3;
    });

    report.setFontSize(8);
    report.setTextColor(100, 110, 108);
    report.text(
      "Educational estimate based on self-reported habits. This report does not measure",
      18,
      276,
    );
    report.text(
      "microplastics inside the body and is not medical advice or a diagnosis.",
      18,
      282,
    );

    report.save("MicroGuard-AI-Exposure-Report.pdf");
  }

  if (completedQuestions === 0) {
    return (
      <div className="empty-dashboard">
        <span className="empty-dashboard-icon">
          <ShieldCheck size={34} />
        </span>

        <span className="eyebrow">Your dashboard</span>
        <h1>Complete the assessment to unlock your results.</h1>

        <p>
          Your score, source ranking, safety plan, and plastic alternatives
          will appear here after you answer the daily-habit questions.
        </p>

        <Link to="/assessment" className="primary-button">
          Start Assessment
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div>
          <span className="eyebrow">Personal exposure dashboard</span>
          <h1>Your daily habit insights</h1>
          <p>
            Review your exposure score, highest-ranked sources, and practical
            changes based on your assessment responses.
          </p>
        </div>

        <div className="dashboard-actions">
          <button type="button" onClick={resetAssessment}>
            <RefreshCw size={17} />
            Reset
          </button>

          <button
            type="button"
            className="download-report-button"
            onClick={downloadReport}
          >
            <Download size={17} />
            Download Report
          </button>
        </div>
      </section>

      {!isComplete && (
        <section className="incomplete-notice">
          <TriangleAlert size={20} />

          <div>
            <strong>Your assessment is incomplete.</strong>
            <span>
              Answer all questions for a complete ranking and safety plan.
            </span>
          </div>

          <Link to="/assessment">Continue assessment</Link>
        </section>
      )}

      <section className="dashboard-overview">
        <article className="score-card">
          <div
            className={`score-ring ${riskClass}`}
            style={{
              "--score": `${score * 3.6}deg`,
            } as React.CSSProperties}
          >
            <div>
              <strong>{score}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="score-explanation">
            <span className={`risk-badge ${riskClass}`}>
              {riskLevel} pattern
            </span>

            <h2>Your exposure habit score</h2>

            <p>
              This educational score compares your reported habits with the
              options in this assessment. It is not a medical risk score.
            </p>
          </div>
        </article>

        <article className="quick-action-card">
          <ShieldCheck size={27} />

          <span>Best first action</span>

          <h2>
            {safetyPlan[0]?.recommendation ??
              "Complete more questions to receive a recommendation."}
          </h2>

          <Link to="/assessment">
            Review my answers
            <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel ranking-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Source ranking</span>
              <h2>Top exposure habits</h2>
            </div>

            <span>Relative score</span>
          </div>

          <div className="ranking-chart">
            <ResponsiveContainer width="100%" height={330}>
              <BarChart
                data={topSources}
                layout="vertical"
                margin={{ top: 8, right: 20, bottom: 8, left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="rgba(13, 87, 78, 0.1)"
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#6b817e", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={115}
                  tick={{ fill: "#294a47", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "rgba(28, 155, 131, 0.06)" }}
                  formatter={(value) => [`${value}%`, "Relative score"]}
                />

                <Bar
                  dataKey="score"
                  fill="#188978"
                  radius={[0, 8, 8, 0]}
                  barSize={23}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="dashboard-panel safety-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Personal safety plan</span>
              <h2>Your recommended actions</h2>
            </div>
          </div>

          <div className="safety-progress">
            <span>{Math.round(actionProgress)}%</span>
            <div className="safety-progress-bar">
              <span style={{ width: `${actionProgress}%` }} />
            </div>
          </div>

          <div className="safety-list">
            {safetyPlan.length > 0 ? (
              safetyPlan.map((item, index) => (
                <div className="safety-item" key={item.source}>
                  <span>{index + 1}</span>

                  <div>
                    <strong>{item.source}</strong>
                    <p>{item.recommendation}</p>
                  </div>

                  <label className="plan-check">
                    <input
                      type="checkbox"
                      checked={Boolean(checklist[item.source])}
                      onChange={() => toggleChecklist(item.source)}
                    />
                    <span>{checklist[item.source] ? "Done" : "Mark done"}</span>
                  </label>
                </div>
              ))
            ) : (
              <p className="no-risk-message">
                Your selected answers currently show few exposure-related
                habits. Continue using reusable alternatives where practical.
              </p>
            )}
          </div>
        </article>
      </section>

      <section className="dashboard-history">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Assessment history</span>
            <h2>Previous results</h2>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="history-list">
            {history.map((entry) => (
              <div key={entry.id} className="history-item">
                <div>
                  <strong>{entry.score}/100</strong>
                  <span>{entry.category} exposure pattern</span>
                </div>

                <small>
                  {new Date(entry.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-risk-message">
            No previous assessments saved in this browser yet.
          </p>
        )}
      </section>

      <section className="alternatives-section">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Plastic alternative guide</span>
            <h2>Simple swaps for everyday products</h2>
          </div>
        </div>

        <div className="alternatives-grid">
          {alternatives.map((alternative) => (
            <article key={alternative.replace}>
              <div className="alternative-badge">{alternative.category}</div>
              <CheckCircle2 size={20} />

              <div>
                <span>Instead of</span>
                <strong>{alternative.replace}</strong>
              </div>

              <ArrowRight size={18} />

              <div>
                <span>Try</span>
                <strong>{alternative.with}</strong>
              </div>

              <p>{alternative.advantages}</p>
              <small>{alternative.limitations}</small>
            </article>
          ))}
        </div>
      </section>

      <p className="dashboard-disclaimer">
        The dashboard provides educational guidance based on self-reported
        habits. It cannot measure internal microplastic exposure or diagnose,
        prevent, or treat a medical condition.
      </p>
    </div>
  );
}

export default Dashboard;