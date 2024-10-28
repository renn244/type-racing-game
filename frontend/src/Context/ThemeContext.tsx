import { createContext, useContext, useEffect, useState } from "react";



type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    defaultTheme?: Theme;
    storageKey?: string;
} & React.PropsWithChildren;

type ThemeProviderState  = {
    theme: Theme;
    setTheme: (theme: Theme) => void
};

const initialState: ThemeProviderState  = {
    theme: 'system',
    setTheme: () => null
}

const ThemeContext = createContext<ThemeProviderState>(initialState);


export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider")
    }

    return context
}

export const ThemeProvider = ({
    children,
    defaultTheme = "system",
    storageKey="vite-ui-theme",
    ...props
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(
        () => window.localStorage.getItem(storageKey) as Theme || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("dark", "light") // reset classes

        if (theme === 'system') {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

            root.classList.add(systemTheme)
            return 
        }

        root.classList.add(theme)
    }, [theme])

    const value = {
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme);
            setTheme(theme);
        } 
    }

    return (
        <ThemeContext.Provider {...props} value={value}>
            {children}
        </ThemeContext.Provider>
    )
}