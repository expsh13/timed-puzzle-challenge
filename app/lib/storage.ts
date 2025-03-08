/**
 * ローカルストレージ管理機能
 *
 * ユーザーの進捗や実績などのデータをローカルストレージに保存・読み込みする機能を提供します。
 */

import type { UserProfile, UserProgress, Achievement } from "./types";

// ローカルストレージのキー
const USER_PROFILE_KEY = "puzzle_user_profile";

/**
 * デフォルトのユーザープロフィールを作成する
 */
export function createDefaultUserProfile(): UserProfile {
  return {
    displayName: "ゲスト",
    progress: [],
    achievements: [],
  };
}

/**
 * ユーザープロフィールをローカルストレージに保存する
 */
export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error("ユーザープロフィールの保存に失敗しました:", error);
  }
}

/**
 * ユーザープロフィールをローカルストレージから読み込む
 */
export function loadUserProfile(): UserProfile {
  try {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    if (!profileData) {
      const defaultProfile = createDefaultUserProfile();
      saveUserProfile(defaultProfile);
      return defaultProfile;
    }
    return JSON.parse(profileData);
  } catch (error) {
    console.error("ユーザープロフィールの読み込みに失敗しました:", error);
    const defaultProfile = createDefaultUserProfile();
    saveUserProfile(defaultProfile);
    return defaultProfile;
  }
}

/**
 * ユーザー名を更新する
 */
export function updateDisplayName(displayName: string): UserProfile {
  const profile = loadUserProfile();
  profile.displayName = displayName;
  saveUserProfile(profile);
  return profile;
}

/**
 * 進捗情報を更新する
 */
export function updateProgress(progress: UserProgress): UserProfile {
  const profile = loadUserProfile();

  // 既存の進捗情報を検索
  const existingIndex = profile.progress.findIndex(
    (p) => p.puzzleId === progress.puzzleId
  );

  if (existingIndex >= 0) {
    // 既存の進捗情報がある場合は更新
    // ベストタイムは更新する場合のみ（より良いスコアの場合）
    if (
      progress.bestTime !== null &&
      (profile.progress[existingIndex].bestTime === null ||
        progress.bestTime <
          (profile.progress[existingIndex].bestTime ??
            Number.POSITIVE_INFINITY))
    ) {
      profile.progress[existingIndex].bestTime = progress.bestTime;
    }

    // その他の情報を更新
    profile.progress[existingIndex].hintsUsed = progress.hintsUsed;
    profile.progress[existingIndex].completed = progress.completed;
    profile.progress[existingIndex].completedAt = progress.completedAt;
  } else {
    // 新しい進捗情報を追加
    profile.progress.push(progress);
  }

  saveUserProfile(profile);
  return profile;
}

/**
 * 実績を解除する
 */
export function unlockAchievement(achievementId: string): UserProfile {
  const profile = loadUserProfile();

  // 既存の実績を検索
  const existingIndex = profile.achievements.findIndex(
    (a) => a.id === achievementId
  );

  if (existingIndex >= 0) {
    // 既に解除済みの場合は何もしない
    if (profile.achievements[existingIndex].unlocked) {
      return profile;
    }

    // 実績を解除
    profile.achievements[existingIndex].unlocked = true;
    profile.achievements[existingIndex].unlockedAt = new Date();
  }

  saveUserProfile(profile);
  return profile;
}

/**
 * 特定のパズルの進捗情報を取得する
 */
export function getProgressByPuzzleId(puzzleId: string): UserProgress | null {
  const profile = loadUserProfile();
  const progress = profile.progress.find((p) => p.puzzleId === puzzleId);
  return progress || null;
}

/**
 * 全ての進捗情報を取得する
 */
export function getAllProgress(): UserProgress[] {
  const profile = loadUserProfile();
  return profile.progress;
}

/**
 * 解除済みの実績を取得する
 */
export function getUnlockedAchievements(): Achievement[] {
  const profile = loadUserProfile();
  return profile.achievements.filter((a) => a.unlocked);
}

/**
 * ローカルストレージをクリアする（デバッグ用）
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(USER_PROFILE_KEY);
    console.log("ストレージをクリアしました");
  } catch (error) {
    console.error("ストレージのクリアに失敗しました:", error);
  }
}

/**
 * ユーザーデータをエクスポートする
 */
export function exportUserData(): string {
  const profile = loadUserProfile();
  return JSON.stringify(profile);
}

/**
 * ユーザーデータをインポートする
 */
export function importUserData(jsonData: string): boolean {
  try {
    const profile = JSON.parse(jsonData) as UserProfile;
    saveUserProfile(profile);
    return true;
  } catch (error) {
    console.error("ユーザーデータのインポートに失敗しました:", error);
    return false;
  }
}
