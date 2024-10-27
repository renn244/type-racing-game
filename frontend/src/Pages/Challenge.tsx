import { useEffect, useState } from "react"

const Challenge = () => {
    const [finished, setFinished] = useState<boolean>(false)
    const [challenge, setChallenge] = useState<string>("This is a challenge that you need to type in order for you to complete this challenge")
    const [typed, setTyped] = useState<string>("")
    const [time, setTime] = useState(0);

    useEffect(() => {
        // fetch the challenge in the backend here

        if (!challenge || finished) return;

        const timer = setInterval(() => { // this is the timer
            setTime((prev) => prev + 1);
        }, 1000);

        const handleKeydown = (e: KeyboardEvent) => {
            if (/^[a-zA-Z0-9]$/.test(e.key) && !e.repeat) { // check if it's a letter and not a repeat
                setTyped(prev => prev + e.key);
            } else if (e.key === "Backspace") {
                setTyped(prev => prev.slice(0, -1))
            } else if (e.key === " ") {
                setTyped(prev => prev + " ")
            }
        }; 
        window.document.addEventListener("keydown", handleKeydown);
        
        return () => { // clean up for duplicates
            clearInterval(timer); 
            window.document.removeEventListener("keydown", handleKeydown); // cleanup listener
        };
    }, [challenge, finished])

    useEffect(() => {
        // set the finish here animation here
        if (typed.length === challenge.length) {
            if (typed === challenge) {
                console.log("Challenge completed" + " in " + time + " seconds")
            } else {
                console.log("Challenge failed" + " in " + time + " seconds")
            }
            setFinished(true);
        }
    }, [typed])

    return (
        <div className="h-screen w-full">
            <div className="max-w-[1000px] mx-auto p-10">
                <div className="p-3 border-2 rounded-lg">
                    <div className="flex justify-between">
                        <h2 className="font-bold text-3xl">
                            Type the following text:
                        </h2>
                        <h2 className="font-bold text-3xl">
                            {time} seconds
                        </h2>
                    </div>
                    <p className="max-w-[900px] w-full mx-auto text-2xl font-medium p-3 mt-2 text-center">
                        {challenge.split("").map((char, i) => {
                            if (typed.length <= i) {

                                if (i === typed.length) {
                                    return <span key={i} className="underline  mx-[1px] text-slate-600">{char}</span>
                                }

                                return <span key={i} className="text-slate-600">{char}</span>

                            }
                            else if (typed[i] === char) {

                                return <span key={i} className="text-black">{char}</span>

                            } else {

                                if (char === " ") {
                                    return <span key={i} className="text-red-600">_</span>
                                }
                                return <span key={i} className="text-red-600">{char}</span>
                            }
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Challenge