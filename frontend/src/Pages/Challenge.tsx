import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Target, Trophy, Users } from "lucide-react"
import { useEffect, useState } from "react"
import useChallenge from "@/hooks/Challenge.hook"
import { useSearchParams } from "react-router-dom"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import VirtualKeyboard from "@/components/pageComponents/Challenge/VirtualKeyboard"


const Challenge = () => {
    const [searchParams] = useSearchParams()

    const [mode, setMode] = useState<"single" | "multiplayer">("single")
    const [finished, setFinished] = useState<boolean>(false)
    const [keyUp, setKeyUp] = useState('')

    // Challenge Result Data
    const [typed, setTyped] = useState<string>("")
    const [accuracy, setAccuracy] = useState<number>(0)
    const [wpm, setWpm] = useState<number>(0)
    const [time, setTime] = useState(0);

    const { calculateAccuracy, calculateWPM, handleKeyDown, 
        SendChallengeResult, timetoStart, setTimetoStart, 
        isLoading, challengeData } = useChallenge()

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

    useEffect(() => {
        // set the finish here animation here
        if (typed.length === challengeData?.challenge.length) {
            if (typed === challengeData?.challenge) {
                console.log("Challenge completed" + " in " + time + " seconds")
            } else {
                console.log("Challenge failed" + " in " + time + " seconds")
            }

            const accuracy = calculateAccuracy(typed, challengeData?.challenge)
            setAccuracy(accuracy);
            
            const WPM = calculateWPM(challengeData?.challenge, time)
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
                    
                    {/* Stats Bar */}
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
                                <p className="text-lg leading-relaxed font-mono font-medium ">
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

                    {/* Input Area */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                        <input
                            disabled
                            type="text"
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            className="w-full p-2 text-lg bg-background border-none focus:outline-none focus:ring-0"
                            placeholder="Start typing..."
                            aria-label="Typing input"
                        />
                        </CardContent>
                    </Card>

                    <VirtualKeyboard   keyUp={keyUp} timetoStart={timetoStart} />

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-6">
                        <Button 
                        onFocus={(e) => e.target.blur()} // so that after being click will not be reclick when space are push
                        onClick={(e) => {
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
