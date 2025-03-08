/**
 * タイマー機能の実装
 *
 * 謎解きタイムアタックアプリのタイマー機能を提供します。
 * - 精密なタイマー計測（誤差0.1秒以内）
 * - ページ離脱時にもタイマーを継続するためのローカルストレージ活用
 * - ヒント使用時のペナルティ時間加算ロジック
 */

import { GameState } from "./types";

// タイマーの状態を表す型
export type TimerState = {
  startTime: number; // タイマー開始時刻（ミリ秒）
  currentTime: number; // 現在の経過時間（ミリ秒）
  pausedAt: number | null; // 一時停止した時刻（ミリ秒）
  penalties: number; // ペナルティ時間の合計（ミリ秒）
  gameState: GameState; // ゲームの状態
};

// ローカルストレージのキー
const TIMER_STORAGE_KEY = "puzzle_timer_state";

/**
 * 新しいタイマー状態を作成する
 */
export function createNewTimerState(): TimerState {
  const now = Date.now();
  return {
    startTime: now,
    currentTime: 0,
    pausedAt: null,
    penalties: 0,
    gameState: GameState.NOT_STARTED,
  };
}

/**
 * タイマーを開始する
 */
export function startTimer(state: TimerState): TimerState {
  const now = Date.now();

  // すでに開始している場合は現在の状態を返す
  if (state.gameState === GameState.PLAYING) {
    return state;
  }

  // 一時停止から再開する場合
  if (state.gameState === GameState.PAUSED && state.pausedAt !== null) {
    const pauseDuration = now - state.pausedAt;
    return {
      ...state,
      startTime: state.startTime + pauseDuration,
      pausedAt: null,
      gameState: GameState.PLAYING,
    };
  }

  // 新規開始の場合
  return {
    ...state,
    startTime: now,
    currentTime: 0,
    pausedAt: null,
    gameState: GameState.PLAYING,
  };
}

/**
 * タイマーを一時停止する
 */
export function pauseTimer(state: TimerState): TimerState {
  // すでに一時停止している場合は現在の状態を返す
  if (state.gameState === GameState.PAUSED) {
    return state;
  }

  // プレイ中でない場合は現在の状態を返す
  if (state.gameState !== GameState.PLAYING) {
    return state;
  }

  return {
    ...state,
    pausedAt: Date.now(),
    gameState: GameState.PAUSED,
  };
}

/**
 * タイマーをリセットする
 */
export function resetTimer(): TimerState {
  return createNewTimerState();
}

/**
 * タイマーを完了状態にする
 */
export function completeTimer(state: TimerState): TimerState {
  // すでに完了している場合は現在の状態を返す
  if (state.gameState === GameState.COMPLETED) {
    return state;
  }

  // 現在の経過時間を計算
  const currentTime = calculateCurrentTime(state);

  return {
    ...state,
    currentTime,
    gameState: GameState.COMPLETED,
  };
}

/**
 * ペナルティ時間を追加する
 */
export function addPenalty(
  state: TimerState,
  penaltySeconds: number
): TimerState {
  const penaltyMilliseconds = penaltySeconds * 1000;

  return {
    ...state,
    penalties: state.penalties + penaltyMilliseconds,
  };
}

/**
 * 現在の経過時間を計算する（ペナルティ時間を含む）
 */
export function calculateCurrentTime(state: TimerState): number {
  // 一時停止中の場合は、一時停止した時点の経過時間を返す
  if (state.gameState === GameState.PAUSED && state.pausedAt !== null) {
    return state.pausedAt - state.startTime + state.penalties;
  }

  // 完了または失敗の場合は、保存されている経過時間を返す
  if (
    state.gameState === GameState.COMPLETED ||
    state.gameState === GameState.FAILED
  ) {
    return state.currentTime;
  }

  // プレイ中の場合は、現在時刻から開始時刻を引いた値にペナルティ時間を加える
  return Date.now() - state.startTime + state.penalties;
}

/**
 * 経過時間を「分:秒.ミリ秒」形式の文字列に変換する
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10); // 2桁のミリ秒

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}

/**
 * タイマー状態をローカルストレージに保存する
 */
export function saveTimerState(puzzleId: string, state: TimerState): void {
  try {
    const storageData = JSON.parse(
      localStorage.getItem(TIMER_STORAGE_KEY) || "{}"
    );
    storageData[puzzleId] = state;
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error("タイマー状態の保存に失敗しました:", error);
  }
}

/**
 * タイマー状態をローカルストレージから読み込む
 */
export function loadTimerState(puzzleId: string): TimerState | null {
  try {
    const storageData = JSON.parse(
      localStorage.getItem(TIMER_STORAGE_KEY) || "{}"
    );
    return storageData[puzzleId] || null;
  } catch (error) {
    console.error("タイマー状態の読み込みに失敗しました:", error);
    return null;
  }
}

/**
 * タイマーのReact Hookを使用するためのカスタムフック
 * （このファイルはクライアントサイドでのみ使用されるため、
 * 実際のReact Hooksの実装はコンポーネント内で行います）
 */
