"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [executing, setExecuting] = useState(false);
    const [currentPage, setCurrentPage] = useState("");

    return (
        <AppContext.Provider value={{ executing, setExecuting,currentPage, setCurrentPage }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext);
