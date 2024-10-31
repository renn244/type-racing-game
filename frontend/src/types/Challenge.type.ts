
const difficulty = {
    Easy: 'Easy',
    Medium: 'Medium',
    Hard: 'Hard'
} as const;

type difficultyKeys = keyof typeof difficulty
export type difficulty = typeof difficulty[difficultyKeys]


const category = {
    FEATURED: 'Featured',
    DAILY: 'Daily',
    PRACTICE: 'Practice' 
} as const
type categoryKeys = keyof typeof category
export type category = typeof category[categoryKeys]

export type Challenge = {
    id: string,
    title: string,
    description: string,
    challenge: string,
    difficulty: difficulty,
    userCompleted: any[],
    category: category
    
    createdAt: string,
    updatedAt: string
}

export type CreateChallengeForm = {
    title: string,
    description: string,
    challenge: string,
    difficulty: difficulty,
    category: category
}

export type updateChallengeForm = {} & Partial<CreateChallengeForm> // not sure if im gonna use this

export type ChallengeResultData = {
    challengeId: Challenge['id']
    typed: string,
    accuracy: number, 
    wpm: number, // words per minute
    time: number, // time that it takes him to finish (seconds)
}

export type ChallengesForUser = {
    featured: Challenge[],
    daily: Challenge[],
    practice: Challenge[]
}