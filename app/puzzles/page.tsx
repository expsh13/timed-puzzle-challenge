"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { puzzles } from "../lib/puzzles";
import { Category, Difficulty } from "../lib/types";
import PuzzleCard from "../components/PuzzleCard";
import Button from "../components/ui/Button";

/**
 * 謎解き問題一覧ページ
 */
export default function PuzzlesPage() {
  // 選択されたカテゴリ
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(
    "all"
  );

  // 選択された難易度
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    Difficulty | "all"
  >("all");

  // 表示する謎解き問題
  const [filteredPuzzles, setFilteredPuzzles] = useState(puzzles);

  // フィルターが変更されたときに問題をフィルタリング
  useEffect(() => {
    let result = [...puzzles];

    // カテゴリでフィルタリング
    if (selectedCategory !== "all") {
      result = result.filter((puzzle) => puzzle.category === selectedCategory);
    }

    // 難易度でフィルタリング
    if (selectedDifficulty !== "all") {
      result = result.filter(
        (puzzle) => puzzle.difficulty === selectedDifficulty
      );
    }

    setFilteredPuzzles(result);
  }, [selectedCategory, selectedDifficulty]);

  // カテゴリ選択ハンドラー
  const handleCategoryChange = (category: Category | "all") => {
    setSelectedCategory(category);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">謎解き問題一覧</h1>
            <p className="text-gray-600 mt-2">
              様々なジャンルの謎解き問題に挑戦しましょう
            </p>
          </div>
          <Link href="/" className="mt-4 md:mt-0">
            <Button variant="outline">ホームに戻る</Button>
          </Link>
        </div>

        {/* フィルターセクション */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange("all")}
                >
                  すべて
                </Button>
                {Object.values(Category).map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                  >
                    {getCategoryName(category)}
                  </Button>
                ))}
              </div>
            </div>
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
              <p className="text-gray-500">
                別のカテゴリや難易度を選択してください。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
