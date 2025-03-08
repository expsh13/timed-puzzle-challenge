"use client";

import type React from "react";

type CardVariant = "default" | "outlined" | "elevated";

type CardProps = {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
};

/**
 * 汎用カードコンポーネント
 */
export default function Card({
  children,
  variant = "default",
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  // バリアントに基づくスタイル
  const variantStyles: Record<CardVariant, string> = {
    default: "bg-white border border-gray-200",
    outlined: "bg-transparent border border-gray-300",
    elevated: "bg-white border border-gray-200 shadow-md",
  };

  // ホバー効果
  const hoverStyle = hoverable
    ? "transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
    : "";

  // クリック可能な場合のスタイル
  const clickableStyle = onClick ? "cursor-pointer" : "";

  return (
    <div
      className={`
        ${variantStyles[variant]}
        ${hoverStyle}
        ${clickableStyle}
        rounded-lg p-4
        ${className}
      `}
      onClick={onClick}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/**
 * カードのヘッダーコンポーネント
 */
export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 pb-2 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * カードのタイトルコンポーネント
 */
export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * カードの説明コンポーネント
 */
export function CardDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
  );
}

/**
 * カードの本文コンポーネント
 */
export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${className}`}>{children}</div>;
}

/**
 * カードのフッターコンポーネント
 */
export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-4 pt-2 border-t border-gray-200 flex justify-between items-center ${className}`}
    >
      {children}
    </div>
  );
}
