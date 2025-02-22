import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [languageId, setLanguageId] = useState(() => {
        const savedLanguage = localStorage.getItem('languageId');
        return savedLanguage ? Number(savedLanguage) : 2; // Default: Azərbaycan
    });

    useEffect(() => {
        localStorage.setItem('languageId', languageId);
    }, [languageId]);

    return (
        <LanguageContext.Provider value={{ languageId, setLanguageId }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};