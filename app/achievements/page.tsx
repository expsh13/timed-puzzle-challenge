"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { loadUserProfile } from "../lib/storage";
import { puzzles } from "../lib/puzzles";
import { Category, Difficulty } from "../lib/types";
import Card, { CardTitle, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ProgressBar";

// 実績の定義
type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  condition: (profile: ReturnType<typeof loadUserProfile>) => boolean;
  icon: string;
  category: "general" | "category" | "difficulty" | "special";
};

// 実績の定義リスト
const achievementDefinitions: AchievementDefinition[] = [
  // 一般的な実績
  {
    id: "first_puzzle",
    title: "最初の一歩",
    description: "最初の謎解きを完了する",
    condition: (profile) => profile.progress.some((p) => p.completed),
    icon: "🏁",
    category: "general",
  },
  {
    id: "five_puzzles",
    title: "謎解き初心者",
    description: "5つの謎解きを完了する",
    condition: (profile) =>
      profile.progress.filter((p) => p.completed).length >= 5,
    icon: "🔍",
    category: "general",
  },
  {
    id: "all_puzzles",
    title: "謎解きマスター",
    description: "すべての謎解きを完了する",
    condition: (profile) =>
      profile.progress.filter((p) => p.completed).length === puzzles.length,
    icon: "🏆",
    category: "general",
  },
  {
    id: "no_hints",
    title: "独力で解決",
    description: "ヒントなしで謎解きを完了する",
    condition: (profile) =>
      profile.progress.some((p) => p.completed && p.hintsUsed.length === 0),
    icon: "💡",
    category: "general",
  },

  // カテゴリ別実績
  {
    id: "logic_master",
    title: "論理の達人",
    description: "すべての論理パズルを完了する",
    condition: (profile) => {
      const logicPuzzles = puzzles.filter((p) => p.category === Category.LOGIC);
      const completedLogicPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.category === Category.LOGIC && p.completed;
      });
      return (
        completedLogicPuzzles.length === logicPuzzles.length &&
        logicPuzzles.length > 0
      );
    },
    icon: "🧩",
    category: "category",
  },
  {
    id: "cipher_master",
    title: "暗号解読者",
    description: "すべての暗号解読問題を完了する",
    condition: (profile) => {
      const cipherPuzzles = puzzles.filter(
        (p) => p.category === Category.CIPHER
      );
      const completedCipherPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.category === Category.CIPHER && p.completed;
      });
      return (
        completedCipherPuzzles.length === cipherPuzzles.length &&
        cipherPuzzles.length > 0
      );
    },
    icon: "🔐",
    category: "category",
  },
  {
    id: "visual_master",
    title: "視覚の達人",
    description: "すべての絵柄謎を完了する",
    condition: (profile) => {
      const visualPuzzles = puzzles.filter(
        (p) => p.category === Category.VISUAL
      );
      const completedVisualPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.category === Category.VISUAL && p.completed;
      });
      return (
        completedVisualPuzzles.length === visualPuzzles.length &&
        visualPuzzles.length > 0
      );
    },
    icon: "👁️",
    category: "category",
  },
  {
    id: "wordplay_master",
    title: "言葉遊びの達人",
    description: "すべての言葉遊び問題を完了する",
    condition: (profile) => {
      const wordplayPuzzles = puzzles.filter(
        (p) => p.category === Category.WORDPLAY
      );
      const completedWordplayPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.category === Category.WORDPLAY && p.completed;
      });
      return (
        completedWordplayPuzzles.length === wordplayPuzzles.length &&
        wordplayPuzzles.length > 0
      );
    },
    icon: "📝",
    category: "category",
  },

  // 難易度別実績
  {
    id: "easy_master",
    title: "初級マスター",
    description: "すべての初級問題を完了する",
    condition: (profile) => {
      const easyPuzzles = puzzles.filter(
        (p) => p.difficulty === Difficulty.EASY
      );
      const completedEasyPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.difficulty === Difficulty.EASY && p.completed;
      });
      return (
        completedEasyPuzzles.length === easyPuzzles.length &&
        easyPuzzles.length > 0
      );
    },
    icon: "🌱",
    category: "difficulty",
  },
  {
    id: "medium_master",
    title: "中級マスター",
    description: "すべての中級問題を完了する",
    condition: (profile) => {
      const mediumPuzzles = puzzles.filter(
        (p) => p.difficulty === Difficulty.MEDIUM
      );
      const completedMediumPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.difficulty === Difficulty.MEDIUM && p.completed;
      });
      return (
        completedMediumPuzzles.length === mediumPuzzles.length &&
        mediumPuzzles.length > 0
      );
    },
    icon: "🌿",
    category: "difficulty",
  },
  {
    id: "hard_master",
    title: "上級マスター",
    description: "すべての上級問題を完了する",
    condition: (profile) => {
      const hardPuzzles = puzzles.filter(
        (p) => p.difficulty === Difficulty.HARD
      );
      const completedHardPuzzles = profile.progress.filter((p) => {
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && puzzle.difficulty === Difficulty.HARD && p.completed;
      });
      return (
        completedHardPuzzles.length === hardPuzzles.length &&
        hardPuzzles.length > 0
      );
    },
    icon: "🌳",
    category: "difficulty",
  },

  // 特別な実績
  {
    id: "speed_demon",
    title: "スピードデーモン",
    description: "制限時間の半分以内に問題を解く",
    condition: (profile) => {
      return profile.progress.some((p) => {
        if (!p.completed || p.bestTime === null) return false;
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return puzzle && p.bestTime < puzzle.timeLimit / 2;
      });
    },
    icon: "⚡",
    category: "special",
  },
  {
    id: "hint_lover",
    title: "ヒント愛好家",
    description: "すべてのヒントを使用して問題を解く",
    condition: (profile) => {
      return profile.progress.some((p) => {
        if (!p.completed) return false;
        const puzzle = puzzles.find((pz) => pz.id === p.puzzleId);
        return (
          puzzle &&
          p.hintsUsed.length === puzzle.hints.length &&
          puzzle.hints.length > 0
        );
      });
    },
    icon: "💭",
    category: "special",
  },
  {
    id: "perfectionist",
    title: "完璧主義者",
    description: "ヒントなしですべての問題を解く",
    condition: (profile) => {
      const completedPuzzles = profile.progress.filter((p) => p.completed);
      return (
        completedPuzzles.length === puzzles.length &&
        completedPuzzles.every((p) => p.hintsUsed.length === 0)
      );
    },
    icon: "✨",
    category: "special",
  },
];

/**
 * 実績ページ
 */
export default function AchievementsPage() {
  // ユーザープロフィール
  const [profile] = useState(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== "undefined") {
      return loadUserProfile();
    }
    return null;
  });

  // 実績の達成状況を計算
  const [achievements, setAchievements] = useState<
    {
      definition: AchievementDefinition;
      unlocked: boolean;
    }[]
  >([]);

  // 初期化
  useEffect(() => {
    if (typeof window !== "undefined" && profile) {
      const achievementsStatus = achievementDefinitions.map((definition) => ({
        definition,
        unlocked: definition.condition(profile),
      }));
      setAchievements(achievementsStatus);
    }
  }, [profile]);

  // プロフィールがない場合
  if (!profile) {
    return null;
  }

  // 達成した実績の数
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // 実績の総数
  const totalCount = achievements.length;

  // 達成率
  const achievementRate = Math.round((unlockedCount / totalCount) * 100);

  // カテゴリ別の実績
  const getAchievementsByCategory = (category: string) => {
    return achievements.filter((a) => a.definition.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">実績</h1>
            <p className="text-gray-600 mt-2">
              謎解きを進めて実績を獲得しましょう
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Link href="/profile">
              <Button variant="outline">プロフィールに戻る</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
          </div>
        </div>

        {/* 実績の進捗 */}
        <Card className="mb-8">
          <CardTitle>実績の進捗</CardTitle>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  達成状況
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {unlockedCount} / {totalCount} 実績 ({achievementRate}%)
                </span>
              </div>
              <ProgressBar
                current={unlockedCount}
                total={totalCount}
                color="purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* 一般的な実績 */}
        <Card className="mb-8">
          <CardTitle>一般的な実績</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAchievementsByCategory("general").map((achievement) => (
                <div
                  key={achievement.definition.id}
                  className={`border rounded-lg p-4 ${
                    achievement.unlocked
                      ? "bg-purple-50 border-purple-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">
                      {achievement.definition.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {achievement.definition.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.definition.description}
                      </p>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          achievement.unlocked
                            ? "text-purple-600"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.unlocked ? "達成済み" : "未達成"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* カテゴリ別実績 */}
        <Card className="mb-8">
          <CardTitle>カテゴリ別実績</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {getAchievementsByCategory("category").map((achievement) => (
                <div
                  key={achievement.definition.id}
                  className={`border rounded-lg p-4 ${
                    achievement.unlocked
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">
                      {achievement.definition.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {achievement.definition.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.definition.description}
                      </p>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          achievement.unlocked
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.unlocked ? "達成済み" : "未達成"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 難易度別実績 */}
        <Card className="mb-8">
          <CardTitle>難易度別実績</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {getAchievementsByCategory("difficulty").map((achievement) => (
                <div
                  key={achievement.definition.id}
                  className={`border rounded-lg p-4 ${
                    achievement.unlocked
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">
                      {achievement.definition.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {achievement.definition.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.definition.description}
                      </p>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          achievement.unlocked
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.unlocked ? "達成済み" : "未達成"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 特別な実績 */}
        <Card className="mb-8">
          <CardTitle>特別な実績</CardTitle>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {getAchievementsByCategory("special").map((achievement) => (
                <div
                  key={achievement.definition.id}
                  className={`border rounded-lg p-4 ${
                    achievement.unlocked
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-3">
                      {achievement.definition.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {achievement.definition.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {achievement.definition.description}
                      </p>
                      <div
                        className={`mt-2 text-xs font-medium ${
                          achievement.unlocked
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.unlocked ? "達成済み" : "未達成"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex justify-center">
          <Link href="/puzzles">
            <Button variant="primary" size="lg">
              問題に挑戦する
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
