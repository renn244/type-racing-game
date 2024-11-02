import { Card, CardContent } from "@/components/ui/card"
import useChallenge from "@/hooks/Challenge.hook"
import { useChallengeResult } from "@/zustand/ChallengeResult.zustand"
import { Clock, Target, Trophy } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

type ShowStatsProps = {
    typed: string
    time: number
    challenge: string | undefined
    setFinished: Dispatch<SetStateAction<boolean>>
}

const ShowStats = ({
    typed,
    time,
    challenge,
    setFinished
}: ShowStatsProps) => {
    const [searchParams] = useSearchParams()
    
    const accuracy = useChallengeResult(state => state.accuracy)
    const setAccuracy = useChallengeResult(state => state.setAccuracy)

    const wpm = useChallengeResult(state => state.wpm)
    const setWpm = useChallengeResult(state => state.setWpm)
    
    const { calculateAccuracy, calculateWPM, SendChallengeResult } = useChallenge()

    useEffect(() => {
        // set the finish here animation here
        if (typed.length === challenge?.length) {
            if (typed === challenge) {
                console.log("Challenge completed" + " in " + time + " seconds")
            } else {
                console.log("Challenge failed" + " in " + time + " seconds")
            }

            const accuracy = calculateAccuracy(typed, challenge)
            setAccuracy(accuracy);
            
            const WPM = calculateWPM(challenge, time)
            setWpm(WPM)

            setFinished(true)

            SendChallengeResult({
                wpm: WPM,
                time,
                typed,
                accuracy,
                challengeId: searchParams.get('challengeId') || ''
            })
        }
    }, [typed])

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            {/* diplay just like a card later? map it? */}
            <Card>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-primary" />
                        <span className="font-medium">WPM</span>
                    </div>
                    {/* this is the wpm of the user in the current challenge */}
                    <span className="text-2xl font-bold">
                        {wpm}
                    </span>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="font-medium">Accuracy</span>
                        </div>
                        {/* this is the percentage of correctness of the input of the user */}
                        <span className="text-2xl font-bold">
                            {accuracy}%
                        </span>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Time</span>
                    </div>
                    {/* this is the that it takes to finish the challenge */}
                    <span className="text-2xl font-bold">
                        {time}s
                    </span>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowStats