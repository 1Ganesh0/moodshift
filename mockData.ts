
import { Game, Mood, SessionLength, GameType, Platform } from './types';

export const INITIAL_GAMES: Game[] = [
  // --- MOBILE (Decade Icons & Global Hits) ---
  {
    id: 'm-f1',
    name: 'Minecraft',
    type: GameType.Owned,
    moodTag: Mood.Relaxed,
    sessionLength: SessionLength.Long,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe',
    appStoreUrl: 'https://apps.apple.com/us/app/minecraft/id479516143',
    active: true,
    description: 'The best-selling game of all time. Build, explore, and relax in a blocky infinite world.'
  },
  {
    id: 'm-f2',
    name: 'Stardew Valley',
    type: GameType.Owned,
    moodTag: Mood.Relaxed,
    sessionLength: SessionLength.Long,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.chucklefish.stardewvalley',
    appStoreUrl: 'https://apps.apple.com/us/app/stardew-valley/id1406710800',
    active: true,
    description: 'The gold standard of farming sims. Escape to the country for a truly peaceful break.'
  },
  {
    id: 'm-f3',
    name: 'Candy Crush Saga',
    type: GameType.Suggested,
    moodTag: Mood.Tired,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.king.candycrushsaga',
    appStoreUrl: 'https://apps.apple.com/us/app/candy-crush-saga/id553834731',
    active: true,
    description: 'A global phenomenon. Perfect for a low-energy, colorful "brain-off" moment.'
  },
  {
    id: 'm-f4',
    name: '8 Ball Pool',
    type: GameType.Suggested,
    moodTag: Mood.Bored,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.miniclip.eightballpool',
    appStoreUrl: 'https://apps.apple.com/us/app/8-ball-pool/id543186831',
    active: true,
    description: 'The world\'s #1 pool game. Quick, satisfying, and played by millions.'
  },
  {
    id: 'm-f5',
    name: 'Clash Royale',
    type: GameType.Owned,
    moodTag: Mood.Competitive,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.supercell.clashroyale',
    appStoreUrl: 'https://apps.apple.com/us/app/clash-royale/id1053012308',
    active: true,
    description: 'Fast-paced real-time strategy. 3 minutes of pure competitive focus.'
  },
  {
    id: 'm-f6',
    name: 'Subway Surfers',
    type: GameType.Suggested,
    moodTag: Mood.Tired,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf',
    appStoreUrl: 'https://apps.apple.com/us/app/subway-surfers/id512939461',
    active: true,
    description: 'The most downloaded game of the decade. Simple, endless, and iconic.'
  },
  {
    id: 'm-f7',
    name: 'Genshin Impact',
    type: GameType.Suggested,
    moodTag: Mood.Relaxed,
    sessionLength: SessionLength.Long,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.miHoYo.GenshinImpact',
    appStoreUrl: 'https://apps.apple.com/us/app/genshin-impact/id1517783697',
    active: true,
    description: 'A massive, beautiful open world that redefined what mobile games can be.'
  },
  {
    id: 'm-f8',
    name: 'Among Us',
    type: GameType.Owned,
    moodTag: Mood.Bored,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.innersloth.spacemafia',
    appStoreUrl: 'https://apps.apple.com/us/app/among-us/id1351168404',
    active: true,
    description: 'The ultimate social deduction game. Find the imposter during your lunch break.'
  },
  {
    id: 'm-f9',
    name: 'PUBG Mobile',
    type: GameType.Owned,
    moodTag: Mood.Competitive,
    sessionLength: SessionLength.Long,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.tencent.ig',
    appStoreUrl: 'https://apps.apple.com/us/app/pubg-mobile/id1330123889',
    active: true,
    description: 'The battle royale pioneer. Intense, tactical, and globally massive.'
  },
  {
    id: 'm-f10',
    name: 'Call of Duty: Mobile',
    type: GameType.Owned,
    moodTag: Mood.Competitive,
    sessionLength: SessionLength.Medium,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.activision.callofduty.shooter',
    appStoreUrl: 'https://apps.apple.com/us/app/call-of-duty-mobile/id1452737512',
    active: true,
    description: 'Console-quality FPS action on the go. High-octane and high-skill.'
  },
  {
    id: 'm-f11',
    name: 'Vampire Survivors',
    type: GameType.Owned,
    moodTag: Mood.Stressed,
    sessionLength: SessionLength.Medium,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.poncle.vampiresurvivors',
    appStoreUrl: 'https://apps.apple.com/us/app/vampire-survivors/id6443378516',
    active: true,
    description: 'A frantic "bullet heaven" hit. Hypnotic gameplay to vent your stress.'
  },
  {
    id: 'm-f12',
    name: 'Monument Valley',
    type: GameType.Suggested,
    moodTag: Mood.Relaxed,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.ustwo.monumentvalley',
    appStoreUrl: 'https://apps.apple.com/us/app/monument-valley/id728293409',
    active: true,
    description: 'A mind-bending architectural puzzle. Short, poetic, and stunningly beautiful.'
  },
  {
    id: 'm-f13',
    name: 'Jetpack Joyride',
    type: GameType.Suggested,
    moodTag: Mood.Tired,
    sessionLength: SessionLength.Short,
    platform: Platform.Mobile,
    url: 'https://play.google.com/store/apps/details?id=com.halfbrick.jetpackjoyride',
    appStoreUrl: 'https://apps.apple.com/us/app/jetpack-joyride/id457446971',
    active: true,
    description: 'An old-school mobile classic. Fast, funny, and perfect for tired minds.'
  },

  // --- WEB / LAPTOP (Decade Icons & Global Hits) ---
  {
    id: 'w-f1',
    name: 'Hades',
    type: GameType.Owned,
    moodTag: Mood.Competitive,
    sessionLength: SessionLength.Medium,
    platform: Platform.Web,
    url: 'https://www.supergiantgames.com/games/hades/',
    active: true,
    description: 'A masterpiece of the decade. Escape the underworld in this god-like rogue-like.'
  },
  {
    id: 'w-f2',
    name: 'Elden Ring',
    type: GameType.Owned,
    moodTag: Mood.Stressed,
    sessionLength: SessionLength.Long,
    platform: Platform.Web,
    url: 'https://www.bandainamcoent.com/games/elden-ring',
    active: true,
    description: 'Game of the Year 2022. Challenging, rewarding, and incredibly vast.'
  },
  {
    id: 'w-f3',
    name: 'Wordle',
    type: GameType.Suggested,
    moodTag: Mood.Tired,
    sessionLength: SessionLength.Short,
    platform: Platform.Web,
    url: 'https://www.nytimes.com/games/wordle/index.html',
    active: true,
    description: 'The simple word game that took over the internet. A perfect 5-minute break.'
  },
  {
    id: 'w-f4',
    name: 'Slay the Spire',
    type: GameType.Owned,
    moodTag: Mood.Anxious,
    sessionLength: SessionLength.Medium,
    platform: Platform.Web,
    url: 'https://www.megacrit.com/',
    active: true,
    description: 'The definitive deck-builder. Strategic, calm, but deeply engaging.'
  },
  {
    id: 'w-f5',
    name: 'Balatro',
    type: GameType.Owned,
    moodTag: Mood.Bored,
    sessionLength: SessionLength.Medium,
    platform: Platform.Web,
    url: 'https://www.playbalatro.com/',
    active: true,
    description: 'The poker-themed sensation. Addictive logic puzzles for a focused break.'
  },
  {
    id: 'w-f6',
    name: 'Disco Elysium',
    type: GameType.Suggested,
    moodTag: Mood.Bored,
    sessionLength: SessionLength.Long,
    platform: Platform.Web,
    url: 'https://discoelysium.com/',
    active: true,
    description: 'A groundbreaking RPG. Deeply philosophical and unlike anything else.'
  },
  {
    id: 'w-f7',
    name: 'Tetr.io',
    type: GameType.Owned,
    moodTag: Mood.Competitive,
    sessionLength: SessionLength.Short,
    platform: Platform.Web,
    url: 'https://tetr.io/',
    active: true,
    description: 'Modern, high-speed competitive Tetris. The ultimate focus test.'
  },
  {
    id: 'w-f8',
    name: 'GeoGuessr',
    type: GameType.Suggested,
    moodTag: Mood.Bored,
    // Fix: Removed extra colon in the property assignment for sessionLength
    sessionLength: SessionLength.Medium,
    platform: Platform.Web,
    url: 'https://www.geoguessr.com/',
    active: true,
    description: 'Explore the world from your chair. A global favorite for curious minds.'
  },
  {
    id: 'w-f9',
    name: 'Celeste',
    type: GameType.Owned,
    moodTag: Mood.Stressed,
    sessionLength: SessionLength.Medium,
    platform: Platform.Web,
    url: 'https://www.celestegame.com/',
    active: true,
    description: 'A legendary platformer about overcoming challenges and mental health.'
  },
  {
    id: 'w-f10',
    name: 'Townscaper',
    type: GameType.Suggested,
    moodTag: Mood.Relaxed,
    sessionLength: SessionLength.Short,
    platform: Platform.Web,
    url: 'https://oskarstalberg.com/Townscaper/',
    active: true,
    description: 'Pure relaxation. Click to build colorful little towns in the sea.'
  }
];
