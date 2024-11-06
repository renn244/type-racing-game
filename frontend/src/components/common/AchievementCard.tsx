import { Check, TrendingUp } from "lucide-react"
import { Progress } from "../ui/progress"
import { UserAchievent } from "@/types/Achievement.type"
import { ComponentProps } from "react"

type AchievementCardProps = {
    achievement: UserAchievent
} & ComponentProps<'div'>

const AchievementCard = ({
    achievement,
    ...props
}: AchievementCardProps) => {

    return (
        <div {...props} className="space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold semibold">{achievement.achievement.name}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.achievement.description}</p>
                </div>
                {
                    achievement.isFinished ?
                      <div className="flex gap-2 items-center">
                        <p className="text-green-700 font-bold">Compelted</p>
                        <Check className="h-5 w-5 text-green-700" />
                      </div>
                    : <TrendingUp className="h-4 w-4 text-muted-foreground" />
                }
            </div>
            <Progress value={achievement.progress} max={
                achievement.achievement.taskType === "Process" ? achievement.achievement.occurrence : achievement.achievement.goal
            } className="h-2" />
            <p className="text-sm text-right text-muted-foreground">{achievement.progress}/{achievement.achievement.goal}</p>
        </div>      
    )
}

export default AchievementCard