import { User } from "./User.type";

const Category = {
    WPM:"WPM",
    Accuracy:"Accuracy",
    Challenges: "Challenges"
} as const;
type CategoryKey = keyof typeof Category;
export type Category = typeof Category[CategoryKey];

const TaskType = {
    Milstone: "Milestone",
    Process: "Process"
} as const;
type TaskTypeKey = keyof typeof TaskType;
export type TaskType = typeof TaskType[TaskTypeKey];

// Global Achievement
export type GlobalAchievement = {
    id: string;
    name: string;
    description: string;
    goal: number;
    occurrence?: number;
    category: Category;
    taskType: TaskType;
}

export type GlobalAchievementForm = {
    name: string;
    description: string;
    goal: number;
    occurrence?: number;
    category: Category;
    taskType: TaskType;
}

export type UserAchievent = {
    id: string;
    userId: string;
    achievementId: string;

    progress: number;

    achievement: GlobalAchievement;
    user: User;
    dateFinished: Date;
}