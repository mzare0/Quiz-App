function StartScreen({
  category,
  difficulty,
  onCategoryChange,
  onDifficultyChange,
  onStart,
}) {
  return (
    <div className="start-screen">
      <h1>Dev Quiz</h1>

      <p>Choose your category and difficulty</p>

      <div className="selection-group">
        <h3>Category</h3>

        <div className="selection-buttons">
          <button
            className={category === "react" ? "selected" : ""}
            onClick={() => onCategoryChange("react")}
          >
            ⚛️ React
          </button>

          <button
            className={category === "javascript" ? "selected" : ""}
            onClick={() => onCategoryChange("javascript")}
          >
            🟨 JavaScript
          </button>

          <button
            className={category === "nextjs" ? "selected" : ""}
            onClick={() => onCategoryChange("nextjs")}
          >
            ▲ Next.js
          </button>
        </div>
      </div>

      <div className="selection-group">
        <h3>Difficulty</h3>

        <div className="selection-buttons">
          <button
            className={difficulty === "easy" ? "selected" : ""}
            onClick={() => onDifficultyChange("easy")}
          >
            🟢 Easy
          </button>

          <button
            className={difficulty === "medium" ? "selected" : ""}
            onClick={() => onDifficultyChange("medium")}
          >
            🟡 Medium
          </button>

          <button
            className={difficulty === "hard" ? "selected" : ""}
            onClick={() => onDifficultyChange("hard")}
          >
            🔴 Hard
          </button>
        </div>
      </div>

      <button className="btn btn-start" onClick={onStart}>
        Start Quiz 🚀
      </button>
    </div>
  );
}

export default StartScreen;
