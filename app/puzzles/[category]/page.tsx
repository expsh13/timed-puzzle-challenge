"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPuzzlesByCategory } from "../../lib/puzzles";
import { Category, Difficulty } from "../../lib/types";
import PuzzleCard from "../../components/PuzzleCard";
import Button from "../../components/ui/Button";

/**
 * カテゴリ別の謎解き問題一覧ページ
 */
export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryParam = params.category as string;

  // カテゴリが有効かチェック
  const isValidCategory = Object.values(Category).includes(
    categoryParam as Category
  );

  // 選択された難易度
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "all"
  >("all");

  // 表示する謎解き問題
  const [filteredPuzzles, setFilteredPuzzles] = useState(
    isValidCategory ? getPuzzlesByCategory(categoryParam as Category) : []
  );

  // 無効なカテゴリの場合はリダイレクト
  useEffect(() => {
    if (!isValidCategory) {
      router.push("/puzzles");
    }
  }, [isValidCategory, router]);

  // 難易度が変更されたときに問題をフィルタリング
  useEffect(() => {
    if (!isValidCategory) return;

    const puzzles = getPuzzlesByCategory(categoryParam as Category);

    if (selectedDifficulty === "all") {
      setFilteredPuzzles(puzzles);
    } else {
      setFilteredPuzzles(
        puzzles.filter((puzzle) => puzzle.difficulty === selectedDifficulty)
      );
    }
  }, [categoryParam, selectedDifficulty, isValidCategory]);

  // 難易度選択ハンドラー
  const handleDifficultyChange = (difficulty: Difficulty | "all") => {
    setSelectedDifficulty(difficulty);
  };

  // カテゴリ名を取得
  const getCategoryName = (category: Category): string => {
    switch (category) {
      case Category.LOGIC:
        return "論理パズル";
      case Category.CIPHER:
        return "暗号解読";
      case Category.VISUAL:
        return "絵柄謎";
      case Category.WORDPLAY:
        return "言葉遊び";
      default:
        return "その他";
    }
  };

  // 難易度名を取得
  const getDifficultyName = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "初級";
      case Difficulty.MEDIUM:
        return "中級";
      case Difficulty.HARD:
        return "上級";
      default:
        return "不明";
    }
  };

  // 無効なカテゴリの場合は何も表示しない（リダイレクト中）
  if (!isValidCategory) {
    return null;
  }

  const categoryName = getCategoryName(categoryParam as Category);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
            <p className="text-gray-600 mt-2">{categoryName}の謎解き問題一覧</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link href="/puzzles">
              <Button variant="outline">すべての問題</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
          </div>
        </div>

        {/* フィルターセクション */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">難易度</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDifficulty === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleDifficultyChange("all")}
                >
                  すべて
                </Button>
                {Object.values(Difficulty).map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleDifficultyChange(difficulty)}
                  >
                    {getDifficultyName(difficulty)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 問題一覧 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPuzzles.length > 0 ? (
            filteredPuzzles.map((puzzle) => (
              <PuzzleCard key={puzzle.id} puzzle={puzzle} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                条件に一致する問題が見つかりませんでした。
              </p>
              <p className="text-gray-500">別の難易度を選択してください。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
