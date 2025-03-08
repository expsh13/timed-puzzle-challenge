"use client";

type ProgressBarProps = {
  current: number;
  total: number;
  className?: string;
  showPercentage?: boolean;
  color?: "blue" | "green" | "red" | "yellow" | "purple";
};

/**
 * 進捗表示コンポーネント
 *
 * 謎解き問題の進捗状況を表示するためのコンポーネント
 */
export default function ProgressBar({
  current,
  total,
  className = "",
  showPercentage = true,
  color = "blue",
}: ProgressBarProps) {
  // 進捗率を計算（0〜100の範囲に制限）
  const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

  // 色に応じたスタイル
  const colorStyles = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
  };

  // 進捗に応じた色の変更（オプション）
  const dynamicColor =
    percentage < 30
      ? colorStyles.red
      : percentage < 70
      ? colorStyles.yellow
      : colorStyles.green;

  // 選択された色または動的な色
  const barColor = colorStyles[color] || dynamicColor;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">進捗状況</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>
          {current} / {total}
        </span>
        <span>残り: {total - current}</span>
      </div>
    </div>
  );
}
