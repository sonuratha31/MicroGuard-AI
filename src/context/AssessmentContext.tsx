/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ExposureQuestion = {
  id: string;
  category: string;
  question: string;
  description: string;
  options: {
    label: string;
    value: number;
  }[];
};

export type RankedSource = {
  name: string;
  score: number;
};

export const exposureQuestions: ExposureQuestion[] = [
  {
    id: "bottled_water",
    category: "Drinking water",
    question: "How often do you drink water from single-use plastic bottles?",
    description:
      "Bottled water is one of the commonly studied ingestion pathways.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "A few times per week", value: 1 },
      { label: "Once per day", value: 2 },
      { label: "Several times per day", value: 3 },
    ],
  },
  {
    id: "heated_plastic",
    category: "Food storage",
    question: "How often do you heat food in plastic containers?",
    description:
      "Heat and repeated use may increase the release of particles from some plastics.",
    options: [
      { label: "Never", value: 0 },
      { label: "Less than once per week", value: 1 },
      { label: "Several times per week", value: 2 },
      { label: "Almost every day", value: 3 },
    ],
  },
  {
    id: "takeaway_food",
    category: "Takeaway packaging",
    question: "How often do you eat food served in plastic takeaway packaging?",
    description:
      "Food contact materials can contribute particles during storage and handling.",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Once per week", value: 1 },
      { label: "Two to four times per week", value: 2 },
      { label: "Almost every day", value: 3 },
    ],
  },
  {
    id: "synthetic_clothes",
    category: "Synthetic textiles",
    question: "How much of your frequently worn clothing is synthetic?",
    description:
      "Polyester, nylon, and acrylic textiles can release microfibres.",
    options: [
      { label: "Very little", value: 0 },
      { label: "About one-quarter", value: 1 },
      { label: "About half", value: 2 },
      { label: "Most of it", value: 3 },
    ],
  },
  {
    id: "indoor_dust",
    category: "Indoor dust",
    question: "How often is your room cleaned and ventilated?",
    description:
      "Indoor dust can contain fibres from textiles, furnishings, and household materials.",
    options: [
      { label: "Daily", value: 0 },
      { label: "Several times per week", value: 1 },
      { label: "About once per week", value: 2 },
      { label: "Less than once per week", value: 3 },
    ],
  },
  {
    id: "plastic_teabags",
    category: "Hot beverages",
    question: "How often do you use plastic-based tea bags or disposable cups?",
    description:
      "Some tea bags and disposable drink containers contain polymer materials.",
    options: [
      { label: "Never", value: 0 },
      { label: "Occasionally", value: 1 },
      { label: "Once per day", value: 2 },
      { label: "Several times per day", value: 3 },
    ],
  },
  {
    id: "personal_care",
    category: "Personal care",
    question: "How often do you use glitter or products containing plastic particles?",
    description:
      "Some cosmetic and personal-care products may contain synthetic polymers.",
    options: [
      { label: "Never", value: 0 },
      { label: "Rarely", value: 1 },
      { label: "Several times per week", value: 2 },
      { label: "Daily", value: 3 },
    ],
  },
  {
    id: "food_wrapping",
    category: "Food packaging",
    question: "How often do you store food in disposable plastic wrapping?",
    description:
      "Repeated contact with plastic packaging is a potential ingestion pathway.",
    options: [
      { label: "Never or rarely", value: 0 },
      { label: "Sometimes", value: 1 },
      { label: "Frequently", value: 2 },
      { label: "For most meals", value: 3 },
    ],
  },
];

type AssessmentContextValue = {
  answers: Record<string, number>;
  score: number;
  completedQuestions: number;
  isComplete: boolean;
  rankedSources: RankedSource[];
  updateAnswer: (questionId: string, value: number) => void;
  resetAssessment: () => void;
};

const AssessmentContext = createContext<AssessmentContextValue | undefined>(
  undefined,
);

function readSavedAnswers(): Record<string, number> {
  try {
    const savedAnswers = localStorage.getItem("microguard-assessment");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  } catch {
    return {};
  }
}

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] =
    useState<Record<string, number>>(readSavedAnswers);

  useEffect(() => {
    localStorage.setItem("microguard-assessment", JSON.stringify(answers));
  }, [answers]);

  const completedQuestions = Object.keys(answers).length;
  const maximumScore = exposureQuestions.length * 3;

  const score = Math.round(
    (Object.values(answers).reduce((total, value) => total + value, 0) /
      maximumScore) *
      100,
  );

  const rankedSources = useMemo(
    () =>
      exposureQuestions
        .map((question) => ({
          name: question.category,
          score: Math.round(((answers[question.id] ?? 0) / 3) * 100),
        }))
        .sort((first, second) => second.score - first.score),
    [answers],
  );

  function updateAnswer(questionId: string, value: number) {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: value,
    }));
  }

  function resetAssessment() {
    setAnswers({});
    localStorage.removeItem("microguard-assessment");
  }

  const value = {
    answers,
    score,
    completedQuestions,
    isComplete: completedQuestions === exposureQuestions.length,
    rankedSources,
    updateAnswer,
    resetAssessment,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);

  if (!context) {
    throw new Error(
      "useAssessment must be used inside the AssessmentProvider",
    );
  }

  return context;
}