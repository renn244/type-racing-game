import { create } from "zustand";


type State = {
    typed: string,
    accuracy: number,
    wpm: number,
    time: number,
}

type Actions = {
    setTyped: (typed: string) => void
    setAccuracy: (accuracy: number) => void
    setWpm: (wpm: number) => void
    setTime: (time: number) => void
}

export const useChallengeResult = create<State & Actions>(set => ({
    typed: '',
    accuracy: 0,
    wpm: 0,
    time: 0,
    setTyped: (typed: string) => set({ typed }),
    setAccuracy: (accuracy: number) => set({ accuracy }),
    setWpm: (wpm: number) => set({ wpm }),
    setTime: (time: number) => set({ time }),
}))

