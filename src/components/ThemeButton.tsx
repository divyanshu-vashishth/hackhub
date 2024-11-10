'use client'
import React, { FC, useState } from 'react'
import { useContext } from "react";
import { ThemeContext } from "~/context/ThemeContext";
import { Github, Moon, Sun } from "lucide-react";
import { signIn, signOut  } from 'next-auth/react';
import { useRouter } from 'next/navigation';
interface ThemeButtonProps {
  
}

export const ThemeButton: FC<ThemeButtonProps> = ({  }) => {
    const { theme, setTheme } = useContext(ThemeContext);
    const toggleTheme = () => {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      window.localStorage.setItem("theme", newTheme);
    };
  
  return (
    <button onClick={toggleTheme} className="btn btn-ghost">
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>
  )
}

export const SignInButton: FC<ThemeButtonProps> = ({}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            await signIn("github", { callbackUrl: "/" });
        } catch (error) {
            console.error("Sign in error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 btn btn-primary"
        >
            {isLoading ? (
                <div className="loading loading-spinner loading-md"></div>
            ) : (
                <Github className="h-5 w-5" />
            )}
            {isLoading ? "Signing in..." : "Sign in with GitHub"}
        </button>
    );
}

export const SignOutButton: FC<ThemeButtonProps> = ({  }) => {
    return (
    <button
    onClick={() => signOut()}
    className="w-full flex items-center justify-center gap-3 btn btn-primary"
  >
    <Github className="h-5 w-5" />
    Sign out
  </button>
    )
}
