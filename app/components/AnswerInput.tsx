"use client";

import { useState, useRef, useEffect } from "react";
import Button from "./ui/Button";

type AnswerInputProps = {
  answer: string;
  onSubmit: (isCorrect: boolean) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * 解答入力コンポーネント
 *
 * 謎解き問題の解答を入力するためのコンポーネント
 */
export default function AnswerInput({
  answer,
  onSubmit,
  disabled = false,
  className = "",
}: AnswerInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "info" | null;
  }>({ message: "", type: null });
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 入力値が変更されたときの処理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // フィードバックをクリア
    if (feedback.type) {
      setFeedback({ message: "", type: null });
    }
  };

  // 解答を提出する
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (disabled || !inputValue.trim()) {
      return;
    }

    // 解答を正規化して比較（大文字小文字、空白を無視）
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    const isCorrect = normalizedInput === normalizedAnswer;

    if (isCorrect) {
      setFeedback({
        message: "正解です！",
        type: "success",
      });
      onSubmit(true);
    } else {
      setFeedback({
        message: "不正解です。もう一度考えてみましょう。",
        type: "error",
      });
      onSubmit(false);

      // 3回以上間違えた場合はヒントを表示
      setShowHint(true);
    }
  };

  // コンポーネントがマウントされたときに入力フィールドにフォーカスする
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="answer-input"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            解答を入力してください
          </label>
          <input
            ref={inputRef}
            id="answer-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
            className={`
              w-full px-4 py-2 border rounded-md shadow-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
            placeholder="ここに解答を入力..."
          />
        </div>

        {feedback.type && (
          <div
            className={`p-3 rounded-md ${
              feedback.type === "success"
                ? "bg-green-100 text-green-800"
                : feedback.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {showHint && feedback.type === "error" && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="font-medium mb-1">ヒント:</p>
            <p>
              解答は大文字小文字を区別せず、空白も無視されます。
              {answer.length > 0 && (
                <>
                  <br />
                  最初の文字は「{answer[0].toUpperCase()}」です。
                </>
              )}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={disabled || !inputValue.trim()}
            variant="primary"
          >
            解答する
          </Button>
        </div>
      </form>
    </div>
  );
}
