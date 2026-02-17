
export enum Mood {
  Relaxed = 'Relaxed',
  Stressed = 'Stressed',
  Tired = 'Tired',
  Competitive = 'Competitive',
  Bored = 'Bored',
  Anxious = 'Anxious'
}

export enum SessionLength {
  Short = 'Short', // 15 mins
  Medium = 'Medium', // 30 mins
  Long = 'Long' // 60+ mins
}

export enum Platform {
  Mobile = 'Mobile',
  Web = 'Laptop/Web'
}

export enum GameType {
  Owned = 'Owned',
  Suggested = 'Suggested'
}

export interface Game {
  id: string;
  name: string;
  type: GameType;
  moodTag: Mood;
  sessionLength: SessionLength;
  platform: Platform;
  url: string; // Default URL or Play Store link
  appStoreUrl?: string; // Specific link for iOS users
  active: boolean;
  description: string;
}

export interface MoodHistory {
  id: string;
  userId: string;
  mood: Mood;
  timeSelected: SessionLength;
  recommendedGameId: string;
  recommendedGameName: string;
  timestamp: number;
}

export interface UserState {
  selectedMood: Mood | null;
  selectedTime: SessionLength | null;
  selectedPlatform: Platform | null;
}
