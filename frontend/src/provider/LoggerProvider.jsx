import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";

const LoggerContext = createContext();

export function LoggerProvider({ children }) {

    useEffect(() => {
        console.log(
            "%c======================================================\n" +
            "  ____                  _         _____      ____\n" +
            " / ___|  ___ _ ____   _(_) ___ __|_   _|__  / ___| ___\n" +
            " \\___ \\ / _ \\ '__\\ \\ / / |/ __/ _ \\| |/ _ \\| |  _ / _ \\\n" + 
            "  ___) |  __/ |   \\ V /| | (_|  __/| | (_) | |_| | (_) |\n" +
            " |____/ \\___|_|    \\_/ |_|\\___\\___||_|\\___/ \\____|\\___/\n" +
            "======================================================\n\n" +
            "%c[WARNING]: %cThis feature is intended for developers.\nIf someone told you to copy-paste something here,\nit is a scam.\n",
            "color: magenta; font-weight:bold;", "color: red; font-weight:bold;", "color: yellow; font-weight:bold;"
        );
    }, [])

    const info = (msg) => console.log("%c[INFO]: %c" + msg, "color: blue; font-weight:bold;", "color: inherit;");
    const warn = (msg) => console.warn("%c[WARN]: %c" + msg, "color: orange; font-weight:bold;", "color: inherit;");
    const error = (msg) => console.error("%c[ERROR]: %c" + msg, "color: red; font-weight:bold;", "color: inherit;");
    const debug = (msg) => {
        if (import.meta.env.VITE_DEBUG === "true")
            console.log("%c[DEBUG]: %c" + msg, "color: magenta; font-weight:bold;", "color: inherit;");
    };

    return (
        <LoggerContext.Provider value={{info, warn, error, debug}}>
            { children }
        </LoggerContext.Provider>
    )
} 

export function useLogger() {
    return useContext(LoggerContext);
}