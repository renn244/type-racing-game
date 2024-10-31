import axiosFetch from "@/lib/axiosFetch"
import { Challenge, ChallengeResultData } from "@/types/Challenge.type"
import { useQuery } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

type Setter<T = any> = Dispatch<SetStateAction<T>>

const useChallenge = () => {
    const [timetoStart, setTimetoStart] = useState<number>(3)
    const [searchParams] = useSearchParams()

    const calculateWPM = (challenge: string, time: number) => {
        return Math.round((challenge.length / 5) / (time / 60))
    }

    const calculateAccuracy = (typed: string, challenge: string) => {
        let correctCount = 0;
        typed.split("").forEach((value, idx) => {
            if (value === challenge[idx]) {
                correctCount++;
            }
        });

        const percentage = (correctCount / challenge.length) * 100;
        return Math.round(percentage)
    } 

    const handleKeyDown = async (setTyped: Setter<string>, setKeyUp: Setter<string>, e: KeyboardEvent) => {
        if (/^[a-zA-Z0-9'.-:?,]$/.test(e.key) && !e.repeat) { // check if it's a letter and not a repeat
            setTyped(prev => prev + e.key);
            setKeyUp(e.key)
        } else if (e.key === "Backspace") {
            setTyped(prev => prev.slice(0, -1))
            setKeyUp(e.key)
        } else if (e.key === " ") {
            setTyped(prev => prev + " ")
            setKeyUp(e.key)
        } 
        await new Promise(resolve => setTimeout(resolve, 130))
        setKeyUp('')
    }

    const getChallenge = async (challengeId: string) => {

        const response = await axiosFetch.get(`/challenge/getChallenge?challengeId=${challengeId}`)
        
        if (response.status === 404) {
            // handle erorr
            return window.location.assign('/error?message=cannot+find+page')
        }

        if (response.data === undefined) {
            return window.location.assign('/error?message=cannot+find+page')
        }

        return response.data as Challenge
    }

    const SendChallengeResult = async (challengeResult: ChallengeResultData) => {

        const response = await axiosFetch.post("/challenge/challengeResult", challengeResult) 
    
        if (response.status >= 400) {
            throw new Error(response.data.message)
        }
        
        return response.data
    }

    const { data: challengeData, isLoading } = useQuery({
        queryKey: ['challenge'],
        queryFn: async () => getChallenge(searchParams.get('challengeId') || ''),
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if(timetoStart === 0 || isLoading) {
            return
        }        
        const timetoStartTimer = setTimeout(() => {
            setTimetoStart(prev => {
                if (prev === 0) {
                    return 0
                }    
                
                return prev - 1
            })
        }, 1000)

        return () => {
            clearTimeout(timetoStartTimer)
        }
    }, [timetoStart, isLoading])    

    return {
        calculateAccuracy, calculateWPM, handleKeyDown, SendChallengeResult, timetoStart, setTimetoStart,
        isLoading, challengeData
    }
}

export default useChallenge