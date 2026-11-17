import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/market", label: "Market" },
  { to: "/news", label: "News" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10, 10, 15, 0.92)" : "rgba(10, 10, 15, 0.6)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(0, 245, 255, 0.1)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-primary/50 bg-card text-lg font-bold text-primary"
            style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.25)" }}
            aria-hidden="true"
          >
            ₹
          </span>
          <span
            className="font-heading text-lg font-semibold tracking-tight text-primary"
            style={{ textShadow: "0 0 12px hsl(var(--primary) / 0.5)" }}
          >
            Stocks
          </span>
        </motion.div>

        <motion.nav
          aria-label="Main navigation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-6 md:gap-8"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative text-sm font-medium transition-all duration-200 hover:text-primary hover:[text-shadow:0_0_8px_hsl(var(--primary)/0.6)] ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </motion.nav>
      </div>
    </header>
  );
}
