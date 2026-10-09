import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  exposureQuestions,
  useAssessment,
} from "../context/AssessmentContext";

function Assessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    answers,
    score,
    completedQuestions,
    updateAnswer,
    resetAssessment,
  } = useAssessment();

  const question = exposureQuestions[currentQuestion];
  const selectedAnswer = answers[question.id];
  const progress = Math.round(
    (completedQuestions / exposureQuestions.length) * 100,
  );

  function goForward() {
    if (selectedAnswer === undefined) {
      return;
    }

    if (currentQuestion === exposureQuestions.length - 1) {
      navigate("/dashboard");
      return;
    }

    setCurrentQuestion((current) => current + 1);
  }

  function goBack() {
    setCurrentQuestion((current) => Math.max(0, current - 1));
  }

  function restartAssessment() {
    resetAssessment();
    setCurrentQuestion(0);
  }

  return (
    <div className="assessment-page">
      <section className="assessment-heading">
        <div>
          <span className="eyebrow">Personal exposure assessment</span>
          <h1>Understand the habits shaping your exposure.</h1>
          <p>
            Select the answer that most closely reflects your routine. Your
            responses remain stored only inside this browser.
          </p>
        </div>

        <button
          type="button"
          className="reset-button"
          onClick={restartAssessment}
        >
          <RotateCcw size={17} />
          Start again
        </button>
      </section>

      <section className="assessment-progress-card">
        <div className="progress-details">
          <span>
            Question {currentQuestion + 1} of {exposureQuestions.length}
          </span>

          <strong>{progress}% completed</strong>
        </div>

        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="assessment-layout">
        <article className="question-card">
          <div className="question-category">{question.category}</div>

          <h2>{question.question}</h2>
          <p className="question-description">{question.description}</p>

          <div className="answer-options">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option.value;

              return (
                <button
                  type="button"
                  key={option.label}
                  className={
                    isSelected
                      ? "answer-option answer-option-selected"
                      : "answer-option"
                  }
                  onClick={() => updateAnswer(question.id, option.value)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span>{option.label}</span>

                  {isSelected && <CheckCircle2 size={20} />}
                </button>
              );
            })}
          </div>

          <div className="assessment-navigation">
            <button
              type="button"
              className="assessment-back-button"
              onClick={goBack}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft size={18} />
              Previous
            </button>

            <button
              type="button"
              className="assessment-next-button"
              onClick={goForward}
              disabled={selectedAnswer === undefined}
            >
              {currentQuestion === exposureQuestions.length - 1
                ? "View My Results"
                : "Next Question"}

              <ArrowRight size={18} />
            </button>
          </div>
        </article>

        <aside className="assessment-sidebar">
          <div className="live-score-card">
            <span className="sidebar-label">Current habit score</span>

            <div className="score-preview">
              <strong>{score}</strong>
              <span>/100</span>
            </div>

            <p>
              This score changes as you answer questions. Your complete
              interpretation appears on the dashboard.
            </p>
          </div>

          <div className="privacy-card">
            <ShieldCheck size={23} />

            <div>
              <strong>Private by design</strong>
              <p>
                Your answers stay in your browser and are not sent to a server.
              </p>
            </div>
          </div>

          <div className="assessment-note">
            <strong>What this score means</strong>
            <p>
              It compares reported habits within this educational assessment.
              It does not measure particles inside your body or diagnose health
              risk.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Assessment;