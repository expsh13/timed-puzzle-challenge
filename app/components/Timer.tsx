"use client";

import { useEffect, useState } from "react";
import { GameState } from "../lib/types";
import {
  type TimerState,
  createNewTimerState,
  startTimer,
  pauseTimer,
  resetTimer,
  completeTimer,
  addPenalty,
  calculateCurrentTime,
  formatTime,
  saveTimerState,
  loadTimerState,
} from "../lib/timer";

type TimerProps = {
  puzzleId: string;
  initialGameState?: GameState;
  onTimeUpdate?: (time: number) => void;
  className?: string;
};

/**
 * タイマーコンポーネント
 *
 * 謎解き問題の解答時間を計測するためのコンポーネント
 */
export default function Timer({
  puzzleId,
  initialGameState = GameState.NOT_STARTED,
  onTimeUpdate,
  className = "",
}: TimerProps) {
  // タイマーの状態
  const [timerState, setTimerState] = useState<TimerState>(() => {
    // ローカルストレージから状態を読み込む
    const savedState =
      typeof window !== "undefined" ? loadTimerState(puzzleId) : null;

    // 保存された状態がある場合はそれを使用、なければ新しい状態を作成
    return (
      savedState || {
        ...createNewTimerState(),
        gameState: initialGameState,
      }
    );
  });

  // 表示用の時間
  const [displayTime, setDisplayTime] = useState("00:00.00");

  // タイマーの更新処理
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    // プレイ中の場合のみタイマーを更新
    if (timerState.gameState === GameState.PLAYING) {
      intervalId = setInterval(() => {
        const currentTime = calculateCurrentTime(timerState);
        setDisplayTime(formatTime(currentTime));
        onTimeUpdate?.(currentTime);
      }, 10); // 10ミリ秒ごとに更新（0.01秒単位）
    }

    // コンポーネントのクリーンアップ時にタイマーを停止
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState, onTimeUpdate]);

  // タイマー状態の変更時にローカルストレージに保存
  useEffect(() => {
    if (typeof window !== "undefined") {
      saveTimerState(puzzleId, timerState);
    }
  }, [puzzleId, timerState]);

  // タイマーを開始する
  const handleStart = () => {
    setTimerState((prevState) => startTimer(prevState));
  };

  // タイマーを一時停止する
  const handlePause = () => {
    setTimerState((prevState) => pauseTimer(prevState));
  };

  // タイマーをリセットする
  const handleReset = () => {
    setTimerState(resetTimer());
    setDisplayTime("00:00.00");
  };

  // タイマーを完了状態にする
  // const handleComplete = () => {
  //   setTimerState((prevState) => completeTimer(prevState));
  // };

  // // ペナルティ時間を追加する
  // const handleAddPenalty = (seconds: number) => {
  //   setTimerState((prevState) => addPenalty(prevState, seconds));
  // };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-3xl font-mono font-bold mb-2">{displayTime}</div>
      <div className="flex space-x-2">
        {timerState.gameState === GameState.NOT_STARTED && (
          <button
            type="button"
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            開始
          </button>
        )}
        <button
          type="button"
          onClick={handlePause}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          一時停止
        </button>
        {timerState.gameState === GameState.PAUSED && (
          <button
            type="button"
            onClick={handleStart}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            再開
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          リセット
        </button>
      </div>
    </div>
  );
}

// 外部からアクセスできるようにメソッドをエクスポート
export {
  startTimer,
  pauseTimer,
  resetTimer,
  completeTimer,
  addPenalty,
  calculateCurrentTime,
  formatTime,
};
