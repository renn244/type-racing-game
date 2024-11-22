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

// this is the multiplayer zustand
type StateMultiplayer = {
    Ready: boolean,
    GameStarted: boolean
}

type ActionMultiplayer = {
    setReady: (ready: boolean) => void
    setGameStarted: (started: boolean) => void
}

export const useMultiplayer = create<StateMultiplayer & ActionMultiplayer>(set => ({
    Ready: false,
    GameStarted: false,
    setReady: (ready: boolean) => set({ Ready: ready }),
    setGameStarted: (started: boolean) => set({ GameStarted: started })
}))

