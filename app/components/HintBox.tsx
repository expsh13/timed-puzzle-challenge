"use client";

import { useState } from "react";
import type { Hint } from "../lib/types";
import Button from "./ui/Button";

type HintBoxProps = {
  hints: Hint[];
  onUseHint: (hintId: string) => void;
  usedHintIds: string[];
  className?: string;
};

/**
 * ヒント表示コンポーネント
 *
 * 謎解き問題のヒントを表示するためのコンポーネント
 */
export default function HintBox({
  hints,
  onUseHint,
  usedHintIds,
  className = "",
}: HintBoxProps) {
  const [expandedHintId, setExpandedHintId] = useState<string | null>(null);

  // ヒントを表示する
  const handleShowHint = (hint: Hint) => {
    // 既に使用済みのヒントの場合は、表示/非表示を切り替える
    if (usedHintIds.includes(hint.id)) {
      setExpandedHintId(expandedHintId === hint.id ? null : hint.id);
      return;
    }

    // 確認ダイアログを表示
    const confirmed = window.confirm(
      `このヒントを使用すると、${hint.penaltyTime}秒のペナルティが追加されます。よろしいですか？`
    );

    if (confirmed) {
      onUseHint(hint.id);
      setExpandedHintId(hint.id);
    }
  };

  // ヒントが存在しない場合
  if (hints.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <p className="text-gray-500 text-center">ヒントはありません</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold">ヒント</h3>

      <div className="space-y-2">
        {hints.map((hint, index) => {
          const isUsed = usedHintIds.includes(hint.id);
          const isExpanded = expandedHintId === hint.id;

          return (
            <div
              key={hint.id}
              className="border rounded-lg overflow-hidden transition-all duration-200"
            >
              <div
                className={`p-3 flex justify-between items-center ${
                  isUsed ? "bg-blue-50" : "bg-gray-50"
                }`}
              >
                <span className="font-medium">
                  ヒント {index + 1}
                  {isUsed && (
                    <span className="ml-2 text-xs text-blue-600">
                      (使用済み)
                    </span>
                  )}
                </span>

                <Button
                  variant={isUsed ? "ghost" : "primary"}
                  size="sm"
                  onClick={() => handleShowHint(hint)}
                >
                  {isUsed
                    ? isExpanded
                      ? "隠す"
                      : "表示"
                    : `使用する (+${hint.penaltyTime}秒)`}
                </Button>
              </div>

              {isUsed && isExpanded && (
                <div className="p-3 bg-white border-t">
                  <p>{hint.text}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 mt-2">
        ヒントを使用すると、解答時間にペナルティが追加されます。
      </div>
    </div>
  );
}
