"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  loadUserProfile,
  updateDisplayName,
  clearStorage,
} from "../lib/storage";
import { getPuzzleById, puzzles } from "../lib/puzzles";
import { formatTime } from "../lib/timer";
import { Category, Difficulty } from "../lib/types";
import Card, { CardTitle, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import ProgressBar from "../components/ProgressBar";

/**
 * ユーザープロフィールページ
 */
export default function ProfilePage() {
  // ユーザープロフィール
  const [profile, setProfile] = useState(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== "undefined") {
      return loadUserProfile();
    }
    return null;
  });

  // 表示名の編集モード
  const [isEditingName, setIsEditingName] = useState(false);

  // 新しい表示名
  const [newDisplayName, setNewDisplayName] = useState("");

  // 確認モーダルの表示
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 初期化
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadedProfile = loadUserProfile();
      setProfile(loadedProfile);
      setNewDisplayName(loadedProfile.displayName);
    }
  }, []);

  // プロフィールがない場合
  if (!profile) {
    return null;
  }

  // 完了した問題数
  const completedPuzzles = profile.progress.filter((p) => p.completed).length;

  // 総問題数
  const totalPuzzles = puzzles.length;

  // 完了率
  const completionRate = Math.round((completedPuzzles / totalPuzzles) * 100);

  // カテゴリ別の完了数
  const getCategoryCompletionCount = (category: Category) => {
    const categoryPuzzles = puzzles.filter((p) => p.category === category);
    const completedCategoryPuzzles = profile.progress.filter((p) => {
      const puzzle = getPuzzleById(p.puzzleId);
      return puzzle && puzzle.category === category && p.completed;
    });
    return {
      completed: completedCategoryPuzzles.length,
      total: categoryPuzzles.length,
    };
  };

  // 難易度別の完了数
  const getDifficultyCompletionCount = (difficulty: Difficulty) => {
    const difficultyPuzzles = puzzles.filter(
      (p) => p.difficulty === difficulty
    );
    const completedDifficultyPuzzles = profile.progress.filter((p) => {
      const puzzle = getPuzzleById(p.puzzleId);
      return puzzle && puzzle.difficulty === difficulty && p.completed;
    });
    return {
      completed: completedDifficultyPuzzles.length,
      total: difficultyPuzzles.length,
    };
  };

  // 表示名の変更を保存
  const handleSaveDisplayName = () => {
    if (newDisplayName.trim()) {
      updateDisplayName(newDisplayName.trim());
      setProfile(loadUserProfile());
      setIsEditingName(false);
    }
  };

  // ストレージをクリア
  const handleClearStorage = () => {
    clearStorage();
    setProfile(loadUserProfile());
    setShowConfirmModal(false);
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

  // 最近解いた問題
  const recentlyCompletedPuzzles = [...profile.progress]
    .filter((p) => p.completed && p.completedAt)
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              マイプロフィール
            </h1>
            <p className="text-gray-600 mt-2">
              あなたの進捗状況と実績を確認できます
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/">
              <Button variant="outline">ホームに戻る</Button>
            </Link>
          </div>
        </div>

        {/* プロフィール情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardTitle>ユーザー情報</CardTitle>
            <CardContent>
              <div className="mb-4">
                {isEditingName ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="display-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      表示名
                    </label>
                    <input
                      type="text"
                      id="display-name"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSaveDisplayName}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingName(false);
                          setNewDisplayName(profile.displayName);
                        }}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">表示名</div>
                      <div className="text-lg font-medium">
                        {profile.displayName}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                    >
                      編集
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-500 mb-2">データ管理</div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  データをリセット
                </Button>

                {showConfirmModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-lg font-bold mb-4">確認</h3>
                      <p className="mb-6">
                        すべての進捗データがリセットされます。この操作は元に戻せません。
                        続行しますか？
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowConfirmModal(false)}
                        >
                          キャンセル
                        </Button>
                        <Button variant="danger" onClick={handleClearStorage}>
                          リセット
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardTitle>進捗状況</CardTitle>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    全体の進捗
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {completedPuzzles} / {totalPuzzles} 問題 ({completionRate}%)
                  </span>
                </div>
                <ProgressBar
                  current={completedPuzzles}
                  total={totalPuzzles}
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    カテゴリ別進捗
                  </h3>
                  {Object.values(Category).map((category) => {
                    const { completed, total } =
                      getCategoryCompletionCount(category);
                    return (
                      <div key={category} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            {getCategoryName(category)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {completed} / {total}
                          </span>
                        </div>
                        <ProgressBar
                          current={completed}
                          total={total}
                          showPercentage={false}
                          color={
                            category === Category.LOGIC
                              ? "blue"
                              : category === Category.CIPHER
                              ? "purple"
                              : category === Category.VISUAL
                              ? "red"
                              : "green"
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    難易度別進捗
                  </h3>
                  {Object.values(Difficulty).map((difficulty) => {
                    const { completed, total } =
                      getDifficultyCompletionCount(difficulty);
                    return (
                      <div key={difficulty} className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">
                            {getDifficultyName(difficulty)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {completed} / {total}
                          </span>
                        </div>
                        <ProgressBar
                          current={completed}
                          total={total}
                          showPercentage={false}
                          color={
                            difficulty === Difficulty.EASY
                              ? "green"
                              : difficulty === Difficulty.MEDIUM
                              ? "yellow"
                              : "red"
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最近解いた問題 */}
        <Card className="mb-8">
          <CardTitle>最近解いた問題</CardTitle>
          <CardContent>
            {recentlyCompletedPuzzles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        問題名
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        カテゴリ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        難易度
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        解答時間
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        解答日時
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentlyCompletedPuzzles.map((progress) => {
                      const puzzle = getPuzzleById(progress.puzzleId);
                      if (!puzzle) return null;

                      return (
                        <tr key={progress.puzzleId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/play/${puzzle.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {puzzle.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getCategoryName(puzzle.category)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getDifficultyName(puzzle.difficulty)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {progress.bestTime !== null
                              ? formatTime(progress.bestTime)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {progress.completedAt
                              ? new Date(progress.completedAt).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                まだ問題を解いていません。
                <Link href="/puzzles" className="text-blue-600 ml-1">
                  問題に挑戦する
                </Link>
              </div>
            )}
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
