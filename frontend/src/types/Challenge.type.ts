
const difficulty = {
    EASY: 'EASY',
    MEDIUM: 'MEDIUM',
    HARD: 'HARD'
} as const;

type difficultyKeys = keyof typeof difficulty

export type difficulty = typeof difficulty[difficultyKeys]

export type Challenge = {
    id: string,
    title: string,
    description: string,
    challenge: string,
    difficulty: difficulty,
    userCompleted: any[],

    createdAt: string,
    updatedAt: string
}

export type CreateChallengeForm = {
    title: string,
    description: string,
    challenge: string,
    difficulty: difficulty
}

export type updateChallengeForm = {} & Partial<CreateChallengeForm> // not sure if im gonna use this

export type ChallengeResultData = {
    challengeId: Challenge['id']
    typed: string,
    accuracy: number, 
    wpm: number, // words per minute
    time: number, // time that it takes him to finish (seconds)
}
