import LoadingSpinner from "@/components/common/LoadingSpinner"
import LoginForm from "@/components/common/LoginForm"
import InputArea from "@/components/pageComponents/Challenge/InputArea"
import MultiPlayerButton from "@/components/pageComponents/Challenge/MultiPlayerButton"
import MultiPlayerProgress from "@/components/pageComponents/Challenge/MultiPlayerProgress"
import ShowStats from "@/components/pageComponents/Challenge/ShowStats"
import VirtualKeyboard from "@/components/pageComponents/Challenge/VirtualKeyboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/Context/AuthContext"
import { useSocketContext } from "@/Context/SocketContext"
import useChallenge from "@/hooks/Challenge.hook"
import { useChallengeResult } from "@/zustand/ChallengeResult.zustand"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
 
type mode = "single" | "multiplayer"

const Challenge = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mode, setMode] = useState<mode>(searchParams.get('mode') as mode || "single") 
    const [finished, setFinished] = useState<boolean>(false)
    const [keyUp, setKeyUp] = useState('')

    // Challenge Result Data
    const setWpm = useChallengeResult(state => state.setWpm)
    const setAccuracy = useChallengeResult(state => state.setAccuracy)
    const [time, setTime] = useState(0);
    const [typed, setTyped] = useState<string>("")

    const { socket } = useSocketContext();
    const { user } = useAuthContext()
    const { handleKeyDown, timetoStart, setTimetoStart, isLoading, challengeData } = useChallenge()

    useEffect(() => {
        if(finished && mode === "multiplayer") {
            // update Progress to successful
            if(!socket) return;
            socket.emit('player-is-finished', {
                roomId: searchParams.get('roomId'),
                playerId: user?.Player?.id,
                stats: {
                    wpm: useChallengeResult.getState().wpm,
                    accuracy: useChallengeResult.getState().accuracy,
                    time: time
                }
            })
        }

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

    const setmode = (mode: mode) => {
        setMode(mode);
        const prevParams = Object.fromEntries(searchParams.entries());
        setSearchParams({...prevParams, mode: mode })
        
        // reset the challenge
        setWpm(0)
        setAccuracy(0)
        setTyped('')
        setTime(0)

        setTimetoStart(3);
    }
    
    if (!user && mode === "multiplayer") return (
        <div>
            <div className="min-h-[750px] bg-background p-6">
                <div className="container mx-auto max--w-5xl">
                    <div className="z-50 fixed h-screen flex justify-center items-center w-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <div onClick={() => setmode('single')}
                        className="bg-muted-foreground h-screen w-full absolute z-40 opacity-45"></div>
                        <LoginForm redirectTo={window.location.href} description="You need to Login in order to play in our multiplayer game!" className={'z-50'} />
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <div className="min-h-[750px] bg-background p-6">
                <div className="container mx-auto max--w-5xl">
                    
                    
                    {/* Tab for multiplayer and single player */}
                    <Tabs value={mode} onValueChange={(value) => setmode(value as mode)} className="mb-6">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                            <TabsTrigger value="single">Single Player</TabsTrigger>
                            <TabsTrigger value="multiplayer">MultiPlayer</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
                   <ShowStats typed={typed} time={time} challenge={challengeData?.challenge} setFinished={setFinished} />

                    {/* Multiplayer Progress */}
                    {mode === "multiplayer" && (
                        <MultiPlayerProgress />
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

                    {/* fix: fix the type undefined and strign not assignableto string  */}
                    <InputArea challenge={challengeData?.challenge || ''} typed={typed} />

                    <VirtualKeyboard keyUp={keyUp} timetoStart={timetoStart} />

                    {/* Action Buttons */}
                        {mode === "single" && (
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
                        </div>
                        )}
                        {mode === 'multiplayer' && (
                            <MultiPlayerButton />
                        )}
                </div>
            </div>
        </div>
    )
}

export default Challenge
