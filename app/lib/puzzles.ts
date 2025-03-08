import { v4 as uuidv4 } from "uuid";
import { type Puzzle, Difficulty, Category, ContentType } from "./types";

/**
 * サンプル謎解き問題データ
 */
export const puzzles: Puzzle[] = [
  // 論理パズル - 初級
  {
    id: uuidv4(),
    title: "数字の並び",
    description: "次の数列の法則性を見つけて、次の数字を答えてください。",
    difficulty: Difficulty.EASY,
    category: Category.LOGIC,
    content: {
      type: ContentType.TEXT,
      data: "2, 4, 8, 16, 32, ?",
    },
    hints: [
      {
        id: uuidv4(),
        text: "前の数から次の数への変化に注目してみましょう。",
        penaltyTime: 30,
      },
      {
        id: uuidv4(),
        text: "各数字は前の数字の2倍になっています。",
        penaltyTime: 60,
      },
    ],
    answer: "64",
    timeLimit: 180, // 3分
  },

  // 論理パズル - 中級
  {
    id: uuidv4(),
    title: "色の組み合わせ",
    description:
      "3つの色（赤、青、緑）を使って4つのボールを塗ります。同じ色が隣り合わないように塗る方法は何通りありますか？",
    difficulty: Difficulty.MEDIUM,
    category: Category.LOGIC,
    content: {
      type: ContentType.TEXT,
      data: "赤、青、緑の3色を使って4つのボールを塗ります。隣り合うボールは異なる色にする必要があります。可能な組み合わせの数を答えてください。",
    },
    hints: [
      {
        id: uuidv4(),
        text: "最初のボールは3色のどれかで塗れます。",
        penaltyTime: 30,
      },
      {
        id: uuidv4(),
        text: "2番目のボールは、1番目と異なる2色から選べます。",
        penaltyTime: 60,
      },
      {
        id: uuidv4(),
        text: "4つのボールは円状に配置されていると考えてください。最初と最後も隣り合っています。",
        penaltyTime: 90,
      },
    ],
    answer: "6",
    timeLimit: 300, // 5分
  },

  // 論理パズル - 上級
  {
    id: uuidv4(),
    title: "嘘つきと正直者",
    description:
      "3人の人物A、B、Cがいます。1人だけが正直者で、残りは嘘つきです。A「Bは正直者だ」、B「Cは嘘つきだ」、C「Aは嘘つきだ」。誰が正直者ですか？",
    difficulty: Difficulty.HARD,
    category: Category.LOGIC,
    content: {
      type: ContentType.TEXT,
      data: "3人の人物A、B、Cがいます。1人だけが正直者で、残りは嘘つきです。\n\nA「Bは正直者だ」\nB「Cは嘘つきだ」\nC「Aは嘘つきだ」\n\n誰が正直者ですか？",
    },
    hints: [
      {
        id: uuidv4(),
        text: "各人の発言が真実か嘘かを仮定して、矛盾が生じないかを確認してみましょう。",
        penaltyTime: 60,
      },
      {
        id: uuidv4(),
        text: "Aが正直者だと仮定すると、Bも正直者になりますが、これは条件（1人だけが正直者）に反します。",
        penaltyTime: 120,
      },
      {
        id: uuidv4(),
        text: "Bが正直者だと仮定すると、Cは嘘つきになります。Cが嘘つきならCの発言「Aは嘘つきだ」は嘘なので、Aは正直者になりますが、これは条件に反します。",
        penaltyTime: 180,
      },
    ],
    answer: "C",
    timeLimit: 480, // 8分
  },

  // 暗号解読 - 初級
  {
    id: uuidv4(),
    title: "シーザー暗号",
    description:
      "以下の暗号文を解読してください。各文字はアルファベットで3文字ずらしてあります。",
    difficulty: Difficulty.EASY,
    category: Category.CIPHER,
    content: {
      type: ContentType.TEXT,
      data: "KHOOR ZRUOG",
    },
    hints: [
      {
        id: uuidv4(),
        text: "シーザー暗号は各文字を一定数だけずらす暗号です。",
        penaltyTime: 30,
      },
      {
        id: uuidv4(),
        text: "この問題では、各文字を3つ前にずらしてみましょう。例：D→A",
        penaltyTime: 60,
      },
    ],
    answer: "HELLO WORLD",
    timeLimit: 240, // 4分
  },

  // 暗号解読 - 中級
  {
    id: uuidv4(),
    title: "数字置換暗号",
    description:
      "以下の暗号文は、各アルファベットを数字に置き換えたものです。解読してください。",
    difficulty: Difficulty.MEDIUM,
    category: Category.CIPHER,
    content: {
      type: ContentType.TEXT,
      data: "16 21 26 26 12 5",
    },
    hints: [
      {
        id: uuidv4(),
        text: "各数字はアルファベットの位置を表しています。A=1, B=2, ...",
        penaltyTime: 45,
      },
      {
        id: uuidv4(),
        text: "最初の文字は16なので、アルファベットの16番目の文字です。",
        penaltyTime: 90,
      },
    ],
    answer: "PUZZLE",
    timeLimit: 300, // 5分
  },

  // 暗号解読 - 上級
  {
    id: uuidv4(),
    title: "ヴィジュネル暗号",
    description:
      "以下の暗号文はヴィジュネル暗号で暗号化されています。キーワードは「KEY」です。解読してください。",
    difficulty: Difficulty.HARD,
    category: Category.CIPHER,
    content: {
      type: ContentType.TEXT,
      data: "TPGCVO",
    },
    hints: [
      {
        id: uuidv4(),
        text: "ヴィジュネル暗号はキーワードを繰り返し使用して、各文字をずらす暗号です。",
        penaltyTime: 60,
      },
      {
        id: uuidv4(),
        text: "キーワード「KEY」の各文字をアルファベット順で数値に変換すると、K=11, E=5, Y=25となります。",
        penaltyTime: 120,
      },
      {
        id: uuidv4(),
        text: "最初の文字Tは、平文の最初の文字をK(11)文字分ずらしたものです。",
        penaltyTime: 180,
      },
    ],
    answer: "CIPHER",
    timeLimit: 600, // 10分
  },

  // 絵柄謎 - 初級
  {
    id: uuidv4(),
    title: "隠れた形",
    description: "この画像の中に隠れている形を見つけてください。",
    difficulty: Difficulty.EASY,
    category: Category.VISUAL,
    content: {
      type: ContentType.IMAGE,
      data: "/images/puzzles/hidden_shape.jpg",
    },
    hints: [
      {
        id: uuidv4(),
        text: "画像の中央付近に注目してみましょう。",
        penaltyTime: 30,
      },
      {
        id: uuidv4(),
        text: "幾何学的な形を探してみてください。",
        penaltyTime: 60,
      },
    ],
    answer: "星",
    timeLimit: 180, // 3分
  },

  // 絵柄謎 - 中級
  {
    id: uuidv4(),
    title: "パターン認識",
    description: "以下のパターンの次に来るべき図形はどれですか？",
    difficulty: Difficulty.MEDIUM,
    category: Category.VISUAL,
    content: {
      type: ContentType.MIXED,
      data: {
        text: "パターンの法則性を見つけて、次に来る図形を選んでください。",
        imageUrl: "/images/puzzles/pattern_sequence.jpg",
      },
    },
    hints: [
      {
        id: uuidv4(),
        text: "各図形の角の数に注目してみましょう。",
        penaltyTime: 45,
      },
      {
        id: uuidv4(),
        text: "図形の角の数は一定のパターンで増減しています。",
        penaltyTime: 90,
      },
    ],
    answer: "C",
    timeLimit: 300, // 5分
  },

  // 絵柄謎 - 上級
  {
    id: uuidv4(),
    title: "複雑な迷路",
    description:
      "この複雑な迷路の正しい出口を見つけてください。出口には記号が書かれています。",
    difficulty: Difficulty.HARD,
    category: Category.VISUAL,
    content: {
      type: ContentType.IMAGE,
      data: "/images/puzzles/complex_maze.jpg",
    },
    hints: [
      {
        id: uuidv4(),
        text: "迷路の左上から始めてください。",
        penaltyTime: 60,
      },
      {
        id: uuidv4(),
        text: "途中で分岐する道がありますが、一つだけが正しい出口に続いています。",
        penaltyTime: 120,
      },
      {
        id: uuidv4(),
        text: "迷路の右下に注目してみてください。",
        penaltyTime: 180,
      },
    ],
    answer: "Ω",
    timeLimit: 600, // 10分
  },

  // 言葉遊び - 初級
  {
    id: uuidv4(),
    title: "アナグラム",
    description: "以下の文字を並べ替えて、意味のある単語を作ってください。",
    difficulty: Difficulty.EASY,
    category: Category.WORDPLAY,
    content: {
      type: ContentType.TEXT,
      data: "ELPPA",
    },
    hints: [
      {
        id: uuidv4(),
        text: "果物の名前です。",
        penaltyTime: 30,
      },
      {
        id: uuidv4(),
        text: "赤いか緑色の、よく知られている果物です。",
        penaltyTime: 60,
      },
    ],
    answer: "APPLE",
    timeLimit: 120, // 2分
  },

  // 言葉遊び - 中級
  {
    id: uuidv4(),
    title: "言葉のなぞなぞ",
    description: "以下のなぞなぞの答えを一語で答えてください。",
    difficulty: Difficulty.MEDIUM,
    category: Category.WORDPLAY,
    content: {
      type: ContentType.TEXT,
      data: "私は上に行けば行くほど下がります。私は何でしょう？",
    },
    hints: [
      {
        id: uuidv4(),
        text: "日常生活でよく使うものです。",
        penaltyTime: 45,
      },
      {
        id: uuidv4(),
        text: "温度に関係するものです。",
        penaltyTime: 90,
      },
    ],
    answer: "温度計",
    timeLimit: 240, // 4分
  },

  // 言葉遊び - 上級
  {
    id: uuidv4(),
    title: "複雑な言葉のパズル",
    description: "以下の文章から隠されたメッセージを見つけてください。",
    difficulty: Difficulty.HARD,
    category: Category.WORDPLAY,
    content: {
      type: ContentType.TEXT,
      data: "太陽が昇る朝は素晴らしい。\n空気が澄んでいて、鳥のさえずりが聞こえる。\n川の流れる音も心地よい。\n雲一つない青空が広がっている。\nレモネードを飲みながらのんびり過ごす。\nトマトの赤さが目に鮮やかだ。",
    },
    hints: [
      {
        id: uuidv4(),
        text: "各行の特定の位置に注目してみましょう。",
        penaltyTime: 60,
      },
      {
        id: uuidv4(),
        text: "各行の最初の文字を順番に読んでみてください。",
        penaltyTime: 120,
      },
      {
        id: uuidv4(),
        text: "日本語で意味のある言葉になります。",
        penaltyTime: 180,
      },
    ],
    answer: "たからもの",
    timeLimit: 480, // 8分
  },
];

/**
 * 指定されたカテゴリの謎解き問題を取得する
 */
export function getPuzzlesByCategory(category: Category): Puzzle[] {
  return puzzles.filter((puzzle) => puzzle.category === category);
}

/**
 * 指定された難易度の謎解き問題を取得する
 */
export function getPuzzlesByDifficulty(difficulty: Difficulty): Puzzle[] {
  return puzzles.filter((puzzle) => puzzle.difficulty === difficulty);
}

/**
 * 指定されたIDの謎解き問題を取得する
 */
export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((puzzle) => puzzle.id === id);
}

/**
 * カテゴリ別の謎解き問題数を取得する
 */
export function getPuzzleCountByCategory(): Record<Category, number> {
  const counts: Record<Category, number> = {
    [Category.LOGIC]: 0,
    [Category.CIPHER]: 0,
    [Category.VISUAL]: 0,
    [Category.WORDPLAY]: 0,
  };

  for (const puzzle of puzzles) {
    counts[puzzle.category]++;
  }

  return counts;
}

/**
 * 難易度別の謎解き問題数を取得する
 */
export function getPuzzleCountByDifficulty(): Record<Difficulty, number> {
  const counts: Record<Difficulty, number> = {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 0,
    [Difficulty.HARD]: 0,
  };

  for (const puzzle of puzzles) {
    counts[puzzle.difficulty]++;
  }

  return counts;
}
