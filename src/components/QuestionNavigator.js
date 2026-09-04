export default function QuestionNavigator({
  numQuestions,
  index,
  answers,
  review,
  dispatch,
}) {
  return (
    <aside className="question-navigator">
      <h4>Questions</h4>

      <div className="question-grid">
        {Array.from({ length: numQuestions }, (_, i) => {
          const isAnswered = answers[i] !== null;
          const isReview = review[i];
          const isCurrent = index === i;

          return (
            <button
              key={i}
              className={`
                question-number
                ${isCurrent ? "current" : ""}
                ${isAnswered ? "answered" : ""}
                ${isReview ? "review" : ""}
              `}
              onClick={() =>
                dispatch({
                  type: "goToQuestion",
                  payload: i,
                })
              }
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="question-legend">
        <div>
          <span className="legend-dot unanswered"></span>
          Unanswered
        </div>

        <div>
          <span className="legend-dot answered"></span>
          Answered
        </div>

        <div>
          <span className="legend-dot review"></span>
          Marked for Review
        </div>
      </div>
    </aside>
  );
}
