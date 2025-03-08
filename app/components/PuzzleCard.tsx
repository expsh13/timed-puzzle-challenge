"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Card, {
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/Card";
import type { Puzzle, Difficulty, Category } from "../lib/types";
import { ContentType } from "../lib/types";
import { getProgressByPuzzleId } from "../lib/storage";
import { formatTime } from "../lib/timer";

type PuzzleCardProps = {
  puzzle: Puzzle;
  className?: string;
};

/**
 * 難易度に応じたラベルとスタイルを取得する
 */
function getDifficultyLabel(difficulty: Difficulty): {
  label: string;
  className: string;
} {
  switch (difficulty) {
    case "easy":
      return { label: "初級", className: "bg-green-100 text-green-800" };
    case "medium":
      return { label: "中級", className: "bg-yellow-100 text-yellow-800" };
    case "hard":
      return { label: "上級", className: "bg-red-100 text-red-800" };
    default:
      return { label: "不明", className: "bg-gray-100 text-gray-800" };
  }
}

/**
 * カテゴリに応じたラベルとスタイルを取得する
 */
function getCategoryLabel(category: Category): {
  label: string;
  className: string;
} {
  switch (category) {
    case "logic":
      return { label: "論理パズル", className: "bg-blue-100 text-blue-800" };
    case "cipher":
      return { label: "暗号解読", className: "bg-purple-100 text-purple-800" };
    case "visual":
      return { label: "絵柄謎", className: "bg-pink-100 text-pink-800" };
    case "wordplay":
      return { label: "言葉遊び", className: "bg-indigo-100 text-indigo-800" };
    default:
      return { label: "その他", className: "bg-gray-100 text-gray-800" };
  }
}

/**
 * 謎解きカードコンポーネント
 */
export default function PuzzleCard({
  puzzle,
  className = "",
}: PuzzleCardProps) {
  const router = useRouter();
  const difficulty = getDifficultyLabel(puzzle.difficulty);
  const category = getCategoryLabel(puzzle.category);

  // ユーザーの進捗情報を取得
  const progress =
    typeof window !== "undefined" ? getProgressByPuzzleId(puzzle.id) : null;

  // クリア済みかどうか
  const isCompleted = progress?.completed || false;

  // ベストタイム
  const bestTime = progress?.bestTime ? formatTime(progress.bestTime) : null;

  // カードがクリックされたときの処理
  const handleClick = () => {
    router.push(`/play/${puzzle.id}`);
  };

  return (
    <Card
      variant="elevated"
      hoverable
      onClick={handleClick}
      className={`w-full max-w-sm transition-all duration-200 ${className}`}
    >
      <div className="flex justify-between items-start mb-2">
        <CardTitle>{puzzle.title}</CardTitle>
        <div className="flex space-x-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${difficulty.className}`}
          >
            {difficulty.label}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${category.className}`}
          >
            {category.label}
          </span>
        </div>
      </div>

      <CardDescription>{puzzle.description}</CardDescription>

      <CardContent className="mt-4">
        {puzzle.content.type === ContentType.IMAGE && (
          <div className="relative w-full h-40 rounded-md overflow-hidden">
            <Image
              src={puzzle.content.data}
              alt={puzzle.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {puzzle.content.type === ContentType.MIXED && (
          <div className="space-y-2">
            <p>{puzzle.content.data.text}</p>
            {puzzle.content.data.imageUrl && (
              <div className="relative w-full h-40 rounded-md overflow-hidden">
                <Image
                  src={puzzle.content.data.imageUrl}
                  alt={puzzle.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        )}

        {puzzle.content.type === ContentType.TEXT && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-700">{puzzle.content.data}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="text-gray-500">制限時間: </span>
            <span className="font-medium">
              {Math.floor(puzzle.timeLimit / 60)}分
              {puzzle.timeLimit % 60 > 0 ? `${puzzle.timeLimit % 60}秒` : ""}
            </span>
          </div>

          <div className="text-sm">
            <span className="text-gray-500">ヒント: </span>
            <span className="font-medium">{puzzle.hints.length}個</span>
          </div>
        </div>

        <div>
          {isCompleted ? (
            <div className="flex items-center">
              <span className="text-green-600 text-sm font-medium mr-2">
                クリア済み
              </span>
              {bestTime && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  ベストタイム: {bestTime}
                </span>
              )}
            </div>
          ) : (
            <span className="text-blue-600 text-sm font-medium">未クリア</span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
