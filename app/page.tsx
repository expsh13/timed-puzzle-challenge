import Link from "next/link";
import {
  getPuzzleCountByCategory,
  getPuzzleCountByDifficulty,
} from "./lib/puzzles";
import { Category, Difficulty } from "./lib/types";
import Card, {
  CardContent,
  CardTitle,
  CardDescription,
} from "./components/ui/Card";
import Button from "./components/ui/Button";

/**
 * ホームページ
 *
 * 謎解きタイムアタックアプリのランディングページ
 */
export default function Home() {
  // カテゴリ別の謎解き問題数
  const categoryCounts = getPuzzleCountByCategory();

  // 難易度別の謎解き問題数
  const difficultyCounts = getPuzzleCountByDifficulty();

  // 総問題数
  const totalPuzzles = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヒーローセクション */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          謎解きタイムアタック
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          様々な謎解き問題に挑戦して、解答時間を競おう！
          論理パズル、暗号解読、絵柄謎、言葉遊びなど、多彩なジャンルの問題が揃っています。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/puzzles">
            <Button size="lg" variant="primary">
              問題に挑戦する
            </Button>
          </Link>
          <Link href="/profile">
            <Button size="lg" variant="outline">
              マイプロフィール
            </Button>
          </Link>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            アプリの特徴
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-blue-500">
              <CardTitle>多彩な謎解き問題</CardTitle>
              <CardContent>
                <p className="text-gray-600">
                  論理パズル、暗号解読、絵柄謎、言葉遊びなど、様々なジャンルの問題が用意されています。
                  全部で{totalPuzzles}問の謎解きに挑戦できます。
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-green-500">
              <CardTitle>タイムアタック形式</CardTitle>
              <CardContent>
                <p className="text-gray-600">
                  各問題には制限時間が設定されています。
                  どれだけ早く正解できるかを競いましょう。
                  ヒントを使うとペナルティ時間が追加されます。
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-purple-500">
              <CardTitle>実績システム</CardTitle>
              <CardContent>
                <p className="text-gray-600">
                  問題を解くことで実績を獲得できます。
                  全ての問題をクリアして、特別な称号を手に入れましょう。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* カテゴリセクション */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            問題カテゴリ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href={`/puzzles/${Category.LOGIC}`} className="block">
              <Card hoverable className="h-full">
                <CardTitle>論理パズル</CardTitle>
                <CardDescription>論理的思考力を試す問題</CardDescription>
                <CardContent>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      問題数: {categoryCounts[Category.LOGIC]}
                    </span>
                    <span className="text-blue-600 text-sm">挑戦する →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href={`/puzzles/${Category.CIPHER}`} className="block">
              <Card hoverable className="h-full">
                <CardTitle>暗号解読</CardTitle>
                <CardDescription>暗号を解読する問題</CardDescription>
                <CardContent>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      問題数: {categoryCounts[Category.CIPHER]}
                    </span>
                    <span className="text-blue-600 text-sm">挑戦する →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href={`/puzzles/${Category.VISUAL}`} className="block">
              <Card hoverable className="h-full">
                <CardTitle>絵柄謎</CardTitle>
                <CardDescription>視覚的な謎解き問題</CardDescription>
                <CardContent>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      問題数: {categoryCounts[Category.VISUAL]}
                    </span>
                    <span className="text-blue-600 text-sm">挑戦する →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href={`/puzzles/${Category.WORDPLAY}`} className="block">
              <Card hoverable className="h-full">
                <CardTitle>言葉遊び</CardTitle>
                <CardDescription>言葉のトリックを使った問題</CardDescription>
                <CardContent>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      問題数: {categoryCounts[Category.WORDPLAY]}
                    </span>
                    <span className="text-blue-600 text-sm">挑戦する →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* 難易度セクション */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            難易度別問題数
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardTitle className="text-green-600">初級</CardTitle>
              <CardContent>
                <div className="text-4xl font-bold my-4">
                  {difficultyCounts[Difficulty.EASY]}
                </div>
                <p className="text-gray-600">
                  初心者向けの問題です。謎解きの基本を学びましょう。
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardTitle className="text-yellow-600">中級</CardTitle>
              <CardContent>
                <div className="text-4xl font-bold my-4">
                  {difficultyCounts[Difficulty.MEDIUM]}
                </div>
                <p className="text-gray-600">
                  少し難しい問題です。じっくり考える必要があります。
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardTitle className="text-red-600">上級</CardTitle>
              <CardContent>
                <div className="text-4xl font-bold my-4">
                  {difficultyCounts[Difficulty.HARD]}
                </div>
                <p className="text-gray-600">
                  上級者向けの問題です。高度な思考力が求められます。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">謎解きタイムアタック</h3>
            <p className="text-gray-400">© 2025 All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/puzzles" className="hover:text-blue-300">
              問題一覧
            </Link>
            <Link href="/profile" className="hover:text-blue-300">
              プロフィール
            </Link>
            <Link href="/achievements" className="hover:text-blue-300">
              実績
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
