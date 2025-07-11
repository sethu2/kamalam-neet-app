function TopPanel({ answers, totalQuestions, remainingTime }) {
  const correctCount = Object.values(answers).filter(Boolean).length;
  const score = correctCount * 4; // Optional: add -1 for wrong answers

  return (
    <div className="bg-white shadow sticky top-0 z-50 flex justify-between items-center px-4 py-2 border-b">
      <div>
        <h2 className="text-lg font-bold text-blue-600">Marks: {score}</h2>
      </div>
      <div className="text-red-600 font-semibold">⏳ {remainingTime}s</div>
    </div>
  );
}

export default TopPanel;
