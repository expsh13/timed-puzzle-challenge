"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPuzzleById } from "../../lib/puzzles";
import { ContentType, GameState } from "../../lib/types";
import { updateProgress, getProgressByPuzzleId } from "../../lib/storage";
import Card, { CardTitle, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Timer from "../../components/Timer";
import HintBox from "../../components/HintBox";
import AnswerInput from "../../components/AnswerInput";

/**
 * 謎解きプレイページ
 */
export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const puzzleId = params.id as string;

  // 謎解き問題を取得
  const puzzle = getPuzzleById(puzzleId);

  // ゲームの状態
  const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);

  // 経過時間
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // 使用したヒントのID
  const [usedHintIds, setUsedHintIds] = useState<string[]>([]);

  // 結果メッセージ
  const [resultMessage, setResultMessage] = useState<string>("");

  // 初期化
  useEffect(() => {
    if (!puzzle) {
      // 問題が見つからない場合は問題一覧ページにリダイレクト
      router.push("/puzzles");
      return;
    }

    // 進捗情報を取得
    const progress = getProgressByPuzzleId(puzzleId);

    // 使用済みヒントを設定
    if (progress && progress.hintsUsed.length > 0) {
      setUsedHintIds(progress.hintsUsed);
    }
  }, [puzzle, puzzleId, router]);

  // 問題が見つからない場合
  if (!puzzle) {
    return null;
  }

  // ヒントを使用したときの処理
  const handleUseHint = (hintId: string) => {
    // 既に使用済みのヒントの場合は何もしない
    if (usedHintIds.includes(hintId)) {
      return;
    }

    // 使用済みヒントに追加
    setUsedHintIds((prev) => [...prev, hintId]);

    // ペナルティ時間の追加はTimerコンポーネント内で行われるため、
    // ここでは使用済みヒントの管理のみを行う
  };

  // 解答を提出したときの処理
  const handleSubmitAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      // 正解の場合
      setGameState(GameState.COMPLETED);
      setResultMessage("正解です！おめでとうございます！");

      // 進捗情報を更新
      updateProgress({
        puzzleId: puzzle.id,
        bestTime: elapsedTime,
        hintsUsed: usedHintIds,
        completed: true,
        completedAt: new Date(),
      });
    } else {
      // 不正解の場合
      setResultMessage("不正解です。もう一度考えてみましょう。");
    }
  };

  // 時間が更新されたときの処理
  const handleTimeUpdate = (time: number) => {
    setElapsedTime(time);
  };

  // 問題の内容を表示
  const renderPuzzleContent = () => {
    switch (puzzle.content.type) {
      case ContentType.TEXT:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-800 whitespace-pre-wrap">
              {puzzle.content.data}
            </p>
          </div>
        );

      case ContentType.IMAGE:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="relative w-full h-64 sm:h-96 mb-4">
              <Image
                src={puzzle.content.data}
                alt={puzzle.title}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        );

      case ContentType.MIXED:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-800 mb-4 whitespace-pre-wrap">
              {puzzle.content.data.text}
            </p>
            {puzzle.content.data.imageUrl && (
              <div className="relative w-full h-64 sm:h-96">
                <Image
                  src={puzzle.content.data.imageUrl}
                  alt={puzzle.title}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        );

      default:
        return <p>問題の内容を表示できません。</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{puzzle.title}</h1>
            <p className="text-gray-600 mt-2">{puzzle.description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/puzzles">
              <Button variant="outline">問題一覧に戻る</Button>
            </Link>
          </div>
        </div>

        {/* タイマーと情報 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-500">
                  難易度:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {puzzle.difficulty === "easy"
                    ? "初級"
                    : puzzle.difficulty === "medium"
                    ? "中級"
                    : "上級"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">
                  カテゴリ:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {puzzle.category === "logic"
                    ? "論理パズル"
                    : puzzle.category === "cipher"
                    ? "暗号解読"
                    : puzzle.category === "visual"
                    ? "絵柄謎"
                    : "言葉遊び"}
                </span>
              </div>
            </div>
            <Timer
              puzzleId={puzzle.id}
              initialGameState={gameState}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        </div>

        {/* 問題内容 */}
        <div className="mb-8">{renderPuzzleContent()}</div>

        {/* 解答入力 */}
        <div className="mb-8">
          <Card>
            <CardTitle>解答</CardTitle>
            <CardContent>
              <AnswerInput
                answer={puzzle.answer}
                onSubmit={handleSubmitAnswer}
                disabled={gameState === GameState.COMPLETED}
              />
              {resultMessage && (
                <div
                  className={`mt-4 p-3 rounded-md ${
                    gameState === GameState.COMPLETED
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {resultMessage}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ヒント */}
        <div className="mb-8">
          <Card>
            <CardTitle>ヒント</CardTitle>
            <CardContent>
              <HintBox
                hints={puzzle.hints}
                onUseHint={handleUseHint}
                usedHintIds={usedHintIds}
              />
            </CardContent>
          </Card>
        </div>

        {/* 制限時間 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">制限時間:</span>
            <span className="text-sm font-medium text-gray-900">
              {Math.floor(puzzle.timeLimit / 60)}分
              {puzzle.timeLimit % 60 > 0 ? `${puzzle.timeLimit % 60}秒` : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
