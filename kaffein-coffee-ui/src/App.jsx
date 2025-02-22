import { useState } from "react";
import AppRouter from "./routes/AppRouter";
import { LanguageProvider } from "./Context/LanguageContext"; // Context faylının yolunu öz layihənə uyğun dəyiş

function App() {
    return (
        <LanguageProvider>
            <div className="App">
                <AppRouter />
            </div>
        </LanguageProvider>
    );
}

export default App;