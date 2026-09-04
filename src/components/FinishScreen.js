function FinishScreen({
  points,
  maxPossiblePoints,
  highscore,
  wrongAnswers,
  dispatch,
}) {
  const percentage =
    maxPossiblePoints > 0 ? (points / maxPossiblePoints) * 100 : 0;

  let emoji;

  if (percentage === 100) emoji = "🏅";
  else if (percentage >= 80) emoji = "🎉";
  else if (percentage >= 50) emoji = "😀";
  else if (percentage > 0) emoji = "😐";
  else emoji = "🤦‍♀️";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored <strong>{points}</strong> out of {maxPossiblePoints} (
        {Math.ceil(percentage)}%)
      </p>

      <p className="highscore">Highscore: {highscore} points</p>

      {wrongAnswers.length > 0 && (
        <div className="wrong-answers">
          <h2>📚 Questions to Review</h2>

          {wrongAnswers.map(({ question, index, userAnswer }) => (
            <div className="review-question" key={index}>
              <h3>
                {index + 1}. {question.question}
              </h3>

              <p>
                <strong>Your answer:</strong>{" "}
                {userAnswer === null
                  ? "❌ Not answered"
                  : question.options[userAnswer]}
              </p>

              <p>
                <strong>Correct answer:</strong> ✅{" "}
                {question.options[question.correctOption]}
              </p>
            </div>
          ))}
        </div>
      )}

      {wrongAnswers.length === 0 && (
        <h2>🎯 Perfect! You answered all questions correctly!</h2>
      )}

      <button
        className="btn btn-ui"
        onClick={() =>
          dispatch({
            type: "restart",
          })
        }
      >
        🔄 Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
