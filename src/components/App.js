import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import QuestionNavigator from "./QuestionNavigator";

const SECS_PER_QUESTION = 30;

const initialState = {
  allQuestions: [],
  questions: [],
  category: "react",
  difficulty: "easy",
  status: "loading",
  index: 0,
  answers: [],
  review: [],
  points: 0,
  highscore: 0,
  secondsRemaining: 0,
};

function reducer(state, action) {
  switch (action.type) {
    // =========================
    // Fetch questions
    // =========================
    case "dataReceived":
      return {
        ...state,
        allQuestions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    // =========================
    // Select category / difficulty
    // =========================
    case "setCategory":
      return {
        ...state,
        category: action.payload,
      };

    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
      };

    // =========================
    // Start quiz
    // =========================
    case "start":
      return {
        ...state,
        questions: action.payload,
        status: "active",
        index: 0,
        answers: Array(action.payload.length).fill(null),
        review: Array(action.payload.length).fill(false),
        points: 0,
        secondsRemaining: action.payload.length * SECS_PER_QUESTION,
      };

    // =========================
    // Answer question
    // =========================
    case "newAnswer": {
      const currentQuestion = state.questions[state.index];
      const newAnswers = [...state.answers];
      newAnswers[state.index] = action.payload;

      const isCorrect = action.payload === currentQuestion.correctOption;

      return {
        ...state,
        answers: newAnswers,
        points: isCorrect
          ? state.points + currentQuestion.points
          : state.points,
      };
    }

    // =========================
    // Navigate questions
    // =========================
    case "nextQuestion":
      return {
        ...state,
        index: Math.min(state.index + 1, state.questions.length - 1),
      };

    case "prevQuestion":
      return {
        ...state,
        index: Math.max(state.index - 1, 0),
      };

    case "goToQuestion":
      return {
        ...state,
        index: action.payload,
      };

    // =========================
    // Toggle review flag
    // =========================
    case "toggleReview": {
      const newReview = [...state.review];
      newReview[state.index] = !newReview[state.index];

      return {
        ...state,
        review: newReview,
      };
    }

    // =========================
    // Timer tick
    // =========================
    case "tick":
      return {
        ...state,
        secondsRemaining: Math.max(state.secondsRemaining - 1, 0),
        status: state.secondsRemaining <= 1 ? "finished" : state.status,
      };

    // =========================
    // Finish quiz
    // =========================
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore: Math.max(state.highscore, state.points),
      };

    // =========================
    // Restart quiz
    // =========================
    case "restart":
      return {
        ...state,
        status: "ready",
        questions: [],
        index: 0,
        answers: [],
        review: [],
        points: 0,
        secondsRemaining: 0,
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export default function App() {
  const [
    {
      allQuestions,
      questions,
      status,
      index,
      answers,
      review,
      points,
      highscore,
      secondsRemaining,
      category,
      difficulty,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );
  const answer = answers[index];

  // =========================
  // Fetch questions from API
  // =========================
  useEffect(function () {
    fetch(`${process.env.PUBLIC_URL}/questions.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
        return res.json();
      })
      .then((data) => {
        dispatch({
          type: "dataReceived",
          payload: data.questions,
        });
      })
      .catch(() => {
        dispatch({
          type: "dataFailed",
        });
      });
  }, []);

  // =========================
  // Filter wrong answers for review
  // =========================
  const wrongAnswers = questions
    .map((question, index) => ({
      question,
      index,
      userAnswer: answers[index],
    }))
    .filter(
      ({ question, userAnswer }) =>
        userAnswer === null || userAnswer !== question.correctOption,
    );

  // =========================
  // Start quiz with selected filters
  // =========================
  function handleStart() {
    const filteredQuestions = allQuestions.filter(
      (question) =>
        question.category === category && question.difficulty === difficulty,
    );

    if (filteredQuestions.length === 0) {
      return;
    }

    dispatch({
      type: "start",
      payload: filteredQuestions,
    });
  }
  useEffect(
    function () {
      window.scrollTo(0, 0);
    },
    [status],
  );

  return (
    <div className="app">
      <Header />

      <Main className="main">
        {/* Loading */}
        {status === "loading" && <Loader />}

        {/* Error */}
        {status === "error" && <Error />}

        {/* Start Screen */}
        {status === "ready" && (
          <StartScreen
            category={category}
            difficulty={difficulty}
            numQuestions={allQuestions.length}
            onCategoryChange={(value) =>
              dispatch({
                type: "setCategory",
                payload: value,
              })
            }
            onDifficultyChange={(value) =>
              dispatch({
                type: "setDifficulty",
                payload: value,
              })
            }
            onStart={handleStart}
          />
        )}

        {/* Quiz */}
        {status === "active" && (
          <div className="quiz-layout">
            <div className="quiz-content">
              <Progress
                index={index}
                numQuestions={numQuestions}
                points={points}
                maxPossiblePoints={maxPossiblePoints}
                answer={answer}
              />

              <Question
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />

              <div className="review-button-container">
                <button
                  className={`review-btn ${review[index] ? "is-review" : ""}`}
                  onClick={() =>
                    dispatch({
                      type: "toggleReview",
                    })
                  }
                >
                  {review[index]
                    ? "⭐ Remove from review"
                    : "☆ Mark for review"}
                </button>
              </div>

              <footer className="quiz-footer">
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />

                <div className="navigation">
                  <button
                    className="btn btn-prev"
                    onClick={() =>
                      dispatch({
                        type: "prevQuestion",
                      })
                    }
                    disabled={index === 0}
                  >
                    ← Previous
                  </button>

                  <button
                    className="btn btn-finish"
                    onClick={() =>
                      dispatch({
                        type: "finish",
                      })
                    }
                  >
                    🏁 Finish Quiz
                  </button>

                  <button
                    className="btn btn-next"
                    onClick={() =>
                      dispatch({
                        type: "nextQuestion",
                      })
                    }
                    disabled={index === numQuestions - 1}
                  >
                    Next →
                  </button>
                </div>
              </footer>
            </div>

            <QuestionNavigator
              numQuestions={numQuestions}
              index={index}
              answers={answers}
              review={review}
              dispatch={dispatch}
            />
          </div>
        )}

        {/* Finished */}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            wrongAnswers={wrongAnswers}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
