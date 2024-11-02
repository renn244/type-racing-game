import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users } from "lucide-react"
import { useEffect, useState } from "react"
import useChallenge from "@/hooks/Challenge.hook"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import VirtualKeyboard from "@/components/pageComponents/Challenge/VirtualKeyboard"
import InputArea from "@/components/pageComponents/Challenge/InputArea"
import { useChallengeResult } from "@/zustand/ChallengeResult.zustand"
import ShowStats from "@/components/pageComponents/Challenge/ShowStats"


const Challenge = () => {
    const [mode, setMode] = useState<"single" | "multiplayer">("single")
    const [finished, setFinished] = useState<boolean>(false)
    const [keyUp, setKeyUp] = useState('')

    const setWpm = useChallengeResult(state => state.setWpm)
    const setAccuracy = useChallengeResult(state => state.setAccuracy)

    // Challenge Result Data
    const [time, setTime] = useState(0);
    const [typed, setTyped] = useState<string>("")

    const {handleKeyDown, timetoStart, setTimetoStart, isLoading, challengeData } = useChallenge()

    useEffect(() => {
        // the time and for listening to the keyboard 
        if (!challengeData?.challenge || finished || timetoStart !== 0) return;
        const timer = setInterval(() => { 
            setTime((prev) => prev + 1);
        }, 1000);

        const keyListener = (e: KeyboardEvent) => handleKeyDown(setTyped, setKeyUp, e)
        window.document.addEventListener("keydown", keyListener);   
        
        return () => { 
            clearInterval(timer); 
            window.document.removeEventListener("keydown", keyListener)
        };

    }, [challengeData?.challenge, finished, timetoStart])
    

    return (
        <div>
            <div className="min-h-[750px] bg-background p-6">
                <div className="container mx-auto max--w-5xl">
                    {/* Tab for multiplayer and single player */}
                    <Tabs defaultValue={mode} onValueChange={(value) => setMode(value as "single" | "multiplayer")} className="mb-6">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                            <TabsTrigger value="single">Single Player</TabsTrigger>
                            <TabsTrigger value="multiplayer">MultiPlayer</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
                   <ShowStats typed={typed} time={time} challenge={challengeData?.challenge} setFinished={setFinished} />

                    {/* Multiplayer Progress */}
                    {mode === "multiplayer" && (
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    {/* {[1,2,3,4].map(competitor => (
                                        <div key={competitor.id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                    <AvatarImage src={competitor.avatar} />
                                                    <AvatarFallback>{competitor.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{competitor.name}</span>
                                                </div>
                                                <Badge variant="secondary">{competitor.wpm} WPM</Badge>
                                            </div>
                                            <Progress value={competitor.progress} className="h-2" />
                                        </div>
                                    ))} */}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Challenge */}
                    <Card className="mb-6">
                        <CardContent className="p-4" >
                            {isLoading ? <LoadingSpinner /> : 
                                <p className="text-lg leading-relaxed font-medium ">
                                    {challengeData?.challenge.split("").map((char, index) => {
                                        const isType = index < typed.length;
                                        const isCorrect = isType &&  typed[index] === char;
                                    
                                        return (
                                            <span
                                            key={index}
                                            className={`${
                                                isType 
                                                ? isCorrect 
                                                    ? "text-primary" 
                                                    : "text-red-600" 
                                                : "text-muted-foreground"
                                            }`}
                                            >
                                                {char}
                                            </span>
                                        )
                                    })}
                                </p>
                            }
                        </CardContent>
                    </Card>

                    <InputArea typed={typed} />

                    <VirtualKeyboard   keyUp={keyUp} timetoStart={timetoStart} />

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <Button 
                        onFocus={(e) => e.target.blur()} // so that after being click will not be reclick when space are push
                        onClick={() => {
                            setTime(0)
                            setAccuracy(0)
                            setWpm(0)
                            setTyped('')
                            setFinished(false)
                            setTimetoStart(3)
                        }}
                        variant="outline" className="w-32">
                            Restart
                        </Button>
                        <Button variant="outline" className="w-32">
                            Give Up
                        </Button>
                        {mode === 'multiplayer' && (
                            <Button className="w-32">
                                <Users className="mr-2 h-4 w-4" />
                                    Invite
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Challenge
