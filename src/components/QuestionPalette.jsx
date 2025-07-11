function QuestionPalette({ currentIndex, answers, total, onJump }) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mt-6 p-4 border-t">
      {Array.from({ length: total }, (_, index) => {
        const isCurrent = index === currentIndex;
        const isAnswered = answers[index + 1] !== undefined;

        let bgColor = "bg-gray-200 text-gray-800";
        if (isAnswered) bgColor = "bg-green-500 text-white";
        if (isCurrent) bgColor = "bg-yellow-400 text-black";

        return (
          <button
            key={index}
            onClick={() => onJump(index)}
            className={`w-8 h-8 rounded-full font-semibold ${bgColor}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}

export default QuestionPalette;
