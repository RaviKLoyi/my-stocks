import { MotionConfig } from "motion/react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { MarketPage } from "./pages/MarketPage";
import { NewsPage } from "./pages/NewsPage";

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main" className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<Navigate to="/market" replace />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="*" element={<Navigate to="/market" replace />} />
          </Routes>
        </main>
      </div>
    </MotionConfig>
  );
}
