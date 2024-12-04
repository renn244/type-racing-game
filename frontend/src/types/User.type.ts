import { UserAchievent } from "./Achievement.type";
import { ChallengeCompleted } from "./Challenge.type";

const Role = {
    ADMIN: 'admin',
    USER: 'user',
} as const;

type RoleKeys = keyof typeof Role;
export type role = typeof Role[RoleKeys];

const KeyboardLoyout = {
    QWERTY: 'qwerty',
    DVORAK: 'dvorak',
    AZERTY: 'azerty',
} as const;

type KeyboardLayoutKeys = keyof typeof KeyboardLoyout;
export type KeyboardLayout = typeof KeyboardLoyout[KeyboardLayoutKeys];

export type User = {
    id: string,
    username: string,
    profile?: string,
    email: string,
    role: role,

    preferences: UserPreference,
    Biometrics: UserBiometric
    userinfo: Userinfo,
    Player: Player,

    createdAt: string,
    updatedAt: string
}

export type Player = {
    id: string,
    username: string,
    Ready?: boolean,

    room: {
        id: string,
        name: string,
        challengeId: string,
        roomStatus: "waiting" | "started" | "finished",
        createdAt: string,
    }
    userId: string,
    roomId: string,
}

export type UserProfile = {
    id: string,
    username: string,
    profile?: string,
    email: string,
    role: role,

    Biometrics?: UserBiometric
    userinfo?: Userinfo,
    completedChallenges:  ChallengeCompleted[]
    Achievements: UserAchievent[]

    createdAt: string,
}

export type Userinfo = {
    id: string,
    userId: string,
    
    bio?: string,
    location?: string,
    socialMedias: string[]
}

export type UserBiometric = {
    id: string,
    userId: string,

    AverageWpm: number,
    AverageAccuracy: number,
    
    TimePracticed: string,
}

export type UserPreference = {
    id: string,
    privateProfile: boolean,
    showStats: true,
    fontSize: 16,
    theme: "light" | "dark",
    soundEffects: true,
    keyboardLayout: "qwerty" | "dvorak" | "dvorak",
    emailNotifications: boolean,
    challengeReminders: boolean,
}

export type UserSettings = {
    id: string,
    profile?: string,
    username: string,
    multiFA: boolean,
    email: string,
    preferences: UserPreference,
    userinfo: Userinfo,
}
    