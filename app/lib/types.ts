/**
 * 謎解きタイムアタックアプリの型定義
 */

// 難易度
export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// カテゴリ
export enum Category {
  LOGIC = "logic",
  CIPHER = "cipher",
  VISUAL = "visual",
  WORDPLAY = "wordplay",
}

// 謎解きコンテンツの種類
export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  MIXED = "mixed",
}

// テキスト形式のコンテンツ
export type TextContent = {
  type: ContentType.TEXT;
  data: string;
};

// 画像形式のコンテンツ
export type ImageContent = {
  type: ContentType.IMAGE;
  data: string; // 画像のURL
};

// 複合形式のコンテンツ
export type MixedContent = {
  type: ContentType.MIXED;
  data: {
    text: string;
    imageUrl?: string;
  };
};

// コンテンツ型（ユニオン型）
export type PuzzleContent = TextContent | ImageContent | MixedContent;

// ヒント
export type Hint = {
  id: string;
  text: string;
  penaltyTime: number; // 秒単位
};

// 謎解き問題
export type Puzzle = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  content: PuzzleContent;
  hints: Hint[];
  answer: string;
  timeLimit: number; // 秒単位
};

// ユーザー進捗
export type UserProgress = {
  puzzleId: string;
  bestTime: number | null; // 秒単位、nullは未クリア
  hintsUsed: string[]; // 使用したヒントのID
  completed: boolean;
  completedAt: Date | null;
};

// 実績
export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: Date | null;
};

// ユーザープロフィール
export type UserProfile = {
  displayName: string;
  progress: UserProgress[];
  achievements: Achievement[];
};

// 謎解き結果
export type PuzzleResult = {
  puzzleId: string;
  startTime: Date;
  endTime: Date;
  totalTime: number; // 秒単位
  hintsUsed: string[];
  success: boolean;
};

// ゲーム状態
export enum GameState {
  NOT_STARTED = "not_started",
  PLAYING = "playing",
  PAUSED = "paused",
  COMPLETED = "completed",
  FAILED = "failed",
}
