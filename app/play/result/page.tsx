"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getPuzzleById } from "../../lib/puzzles";
import { getProgressByPuzzleId } from "../../lib/storage";
import { formatTime } from "../../lib/timer";
import Card, { CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

/**
 * 謎解き結果ページ
 */
export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const puzzleId = searchParams.get("id");

  // 謎解き問題と進捗情報
  const [puzzle] = useState(puzzleId ? getPuzzleById(puzzleId) : null);
  const [progress, setProgress] = useState(
    puzzleId ? getProgressByPuzzleId(puzzleId) : null
  );

  // 初期化
  useEffect(() => {
    if (!puzzleId || !puzzle) {
      // 問題IDがない、または問題が見つからない場合は問題一覧ページにリダイレクト
      router.push("/puzzles");
      return;
    }

    // 進捗情報を取得
    const progressData = getProgressByPuzzleId(puzzleId);

    // 進捗情報がない、または未クリアの場合は問題ページにリダイレクト
    if (!progressData || !progressData.completed) {
      router.push(`/play/${puzzleId}`);
      return;
    }

    setProgress(progressData);
  }, [puzzleId, puzzle, router]);

  // 問題が見つからない、または進捗情報がない場合
  if (!puzzle || !progress) {
    return null;
  }

  // 使用したヒントの数
  const hintsUsed = progress.hintsUsed.length;

  // ヒントを使用したかどうか
  const usedHints = hintsUsed > 0;

  // 達成度に応じたメッセージとスタイル
  const getAchievementInfo = () => {
    if (
      !usedHints &&
      progress.bestTime !== null &&
      progress.bestTime < puzzle.timeLimit / 2
    ) {
      // ヒントなしで制限時間の半分以下でクリア
      return {
        message: "完璧な解答！",
        description: "ヒントなしで素早く解けました。素晴らしい！",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    }
    // ヒントなしでクリア
    if (!usedHints) {
      return {
        message: "見事な解答！",
        description: "ヒントなしでクリアしました。素晴らしい！",
        className: "bg-green-100 text-green-800 border-green-300",
      };
    }
    // ヒント1つ以下でクリア
    if (hintsUsed <= 1) {
      return {
        message: "優れた解答！",
        description: "少ないヒントでクリアしました。よく頑張りました！",
        className: "bg-blue-100 text-blue-800 border-blue-300",
      };
    }
    // ヒント複数使用でクリア
    return {
      message: "クリア！",
      description:
        "問題を解くことができました。次はヒントを減らしてみましょう！",
      className: "bg-purple-100 text-purple-800 border-purple-300",
    };
  };

  const achievementInfo = getAchievementInfo();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">結果</h1>
          <p className="text-gray-600 mt-2">「{puzzle.title}」の解答結果</p>
        </div>

        {/* 結果カード */}
        <Card className="mb-8">
          <CardTitle className="text-center">
            {achievementInfo.message}
          </CardTitle>
          <CardContent>
            <div
              className={`p-4 rounded-lg border ${achievementInfo.className} mb-6`}
            >
              <p className="text-center">{achievementInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  解答時間
                </h3>
                <p className="text-2xl font-bold">
                  {progress.bestTime !== null
                    ? formatTime(progress.bestTime)
                    : "N/A"}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  使用したヒント
                </h3>
                <p className="text-2xl font-bold">
                  {hintsUsed} / {puzzle.hints.length}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  難易度
                </h3>
                <p className="text-lg font-medium">
                  {puzzle.difficulty === "easy"
                    ? "初級"
                    : puzzle.difficulty === "medium"
                    ? "中級"
                    : "上級"}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  カテゴリ
                </h3>
                <p className="text-lg font-medium">
                  {puzzle.category === "logic"
                    ? "論理パズル"
                    : puzzle.category === "cipher"
                    ? "暗号解読"
                    : puzzle.category === "visual"
                    ? "絵柄謎"
                    : "言葉遊び"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/play/${puzzle.id}`}>
            <Button variant="outline">もう一度挑戦する</Button>
          </Link>

          <Link href={`/puzzles/${puzzle.category}`}>
            <Button variant="outline">同じカテゴリの問題</Button>
          </Link>

          <Link href="/puzzles">
            <Button variant="primary">問題一覧に戻る</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
