# 謎解きタイムアタックアプリ 設計書

## 1. 要件定義

### 1.1 目的

時間制限のある謎解きゲームを提供し、ユーザーが様々な謎に挑戦しながら解答時間を競うモバイルアプリケーションを開発する。

### 1.2 ターゲットユーザー

- 謎解きが好きな 10 代〜40 代の男女
- 脱出ゲームファン
- 論理的思考力を鍛えたい人々
- 友人や他のプレイヤーと競争を楽しみたい人々

### 1.3 プラットフォーム

- Web ブラウザ（PC、スマホの Chrome）

## 2. 機能要件

### 2.1 ゲームプレイ機能

- 謎解きステージ選択
- タイマー計測機能
- ヒント表示機能（使用するとペナルティ時間が加算）
- 解答入力・判定機能
- リアルタイムの進捗表示

### 2.2 謎解きコンテンツ

- 複数ジャンルの謎解き（論理パズル、暗号解読、絵柄謎、言葉遊び等）
- 難易度別ステージ構成（初級、中級、上級）
- 定期的な新規コンテンツ追加

### 2.3 報酬・実績システム

- 謎解き達成バッジ
- 特別称号の獲得

## 3. 非機能要件

### 3.1 パフォーマンス

- アプリ起動時間：3 秒以内
- 画面遷移：1 秒以内
- タイマー計測の正確性：誤差 0.1 秒以内

### 3.2 拡張性

- 新規謎解きコンテンツの追加が容易な設計
- 将来的な機能拡張に対応できる柔軟なアーキテクチャ

### 3.3 可用性

- 24 時間 365 日の安定稼働
- メンテナンス時間の最小化

## 4. 前提条件・仮定

- ユーザーは基本的なアプリの操作に習熟している
- 謎解きコンテンツは定期的に追加される

## 5. アプリケーション設計

### 5.1 アーキテクチャ

- Next.js App Router を使用したフロントエンド
- ローカルストレージを使用したデータ永続化
- 型安全性を確保するための TypeScript
- TailwindCSS によるレスポンシブデザイン

### 5.2 データモデル

```typescript
// 難易度
enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

// カテゴリ
enum Category {
  LOGIC = "logic",
  CIPHER = "cipher",
  VISUAL = "visual",
  WORDPLAY = "wordplay",
}

// 謎解きコンテンツの種類
enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  MIXED = "mixed",
}

// ヒント
type Hint = {
  id: string;
  text: string;
  penaltyTime: number; // 秒単位
};

// 謎解き問題
type Puzzle = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: Category;
  content: {
    type: ContentType;
    data: any; // テキスト、画像URL、または複合データ
  };
  hints: Hint[];
  answer: string;
  timeLimit: number; // 秒単位
};

// ユーザー進捗
type UserProgress = {
  puzzleId: string;
  bestTime: number | null; // 秒単位、nullは未クリア
  hintsUsed: string[]; // 使用したヒントのID
  completed: boolean;
  completedAt: Date | null;
};

// 実績
type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt: Date | null;
};

// ユーザープロフィール
type UserProfile = {
  displayName: string;
  progress: UserProgress[];
  achievements: Achievement[];
};
```

### 5.3 ディレクトリ構造

```
app/
├── lib/ (ユーティリティ関数)
    ├── types.ts (型定義)
    ├── puzzles.ts (謎解きデータ)
    ├── timer.ts (タイマー機能)
    └── storage.ts (ローカルストレージ)
├──components/ (再利用可能なコンポーネント)
    ├── ui/ (UIコンポーネント)
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   └── ...
    ├── Timer.tsx (タイマーコンポーネント)
    ├── PuzzleCard.tsx (謎解きカード)
    ├── HintBox.tsx (ヒント表示)
    ├── AnswerInput.tsx (解答入力)
    └── ProgressBar.tsx (進捗表示)
├── page.tsx (ホームページ)
├── layout.tsx (共通レイアウト)
├── globals.css (グローバルスタイル)
├── puzzles/ (謎解き選択ページ)
│   ├── page.tsx
│   └── [category]/ (カテゴリ別表示)
│       └── page.tsx
├── play/ (謎解きプレイページ)
│   ├── [id]/ (個別の謎解き)
│   │   └── page.tsx
│   └── result/ (結果ページ)
│       └── page.tsx
├── profile/ (ユーザープロフィール)
│   └── page.tsx
├── achievements/ (実績ページ)
│   └── page.tsx
└── api/ (APIルート)
    └── ...

public/ (静的ファイル)
├── images/
│   └── puzzles/ (謎解き画像)
└── ...
```

### 5.4 主要機能の実装方針

#### 5.4.1 タイマー機能

- React Hooks を使用した精密なタイマー実装
- `useEffect`と`useState`を組み合わせたタイマー管理
- ページ離脱時にもタイマーを継続するためのローカルストレージ活用
- ヒント使用時のペナルティ時間加算ロジック

#### 5.4.2 謎解きコンテンツ管理

- JSON データとして謎解きを管理
- 画像、テキスト、複合型など様々な形式に対応
- 難易度別、カテゴリ別に整理されたデータ構造

#### 5.4.3 ヒントシステム

- 段階的なヒント表示機能
- ヒント使用時のペナルティ計算ロジック
- ユーザーの進行状況に応じたヒント提供

#### 5.4.4 解答判定

- 大文字小文字、空白を無視した文字列比較
- 部分正解のフィードバック機能
- 複数の正解パターンに対応する柔軟な判定ロジック

#### 5.4.5 実績システム

- 達成条件の自動判定ロジック
- バッジやトロフィーの表示コンポーネント
- ユーザーモチベーション向上のための視覚的フィードバック

#### 5.4.6 データ永続化

- ローカルストレージを使用したユーザーデータ保存
- ユーザー進捗の永続化ロジック
- 将来的なサーバー同期に対応可能な設計

### 5.5 テスト戦略

- コンポーネント単位のテスト
- タイマー精度のテスト
- 解答判定ロジックのテスト
- ユーザー体験の検証

## 6. 実装計画

### フェーズ 1: 基本構造の構築

- プロジェクト設定
- ディレクトリ構造の作成
- 型定義の実装
- サンプルデータの作成

### フェーズ 2: コア機能の実装

- タイマー機能
- 謎解き表示
- 解答入力・判定
- ヒントシステム

### フェーズ 3: UI/UX の実装

- ホームページ
- 謎解き選択ページ
- プレイページ
- 結果ページ

### フェーズ 4: データ永続化と実績システム

- ローカルストレージ連携
- 実績システム
- ユーザープロフィール

### フェーズ 5: テストと最適化

- 機能テスト
- パフォーマンス最適化
- レスポンシブデザインの調整
