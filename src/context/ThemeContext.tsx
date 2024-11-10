"use client"

import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext({
  theme: 'light',
  setTheme: (theme: string) => {},
})


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme')
    if (localTheme) {
      setTheme(localTheme)
    } else {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(dark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])


    if (!mounted) return <div />


  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
        <div data-theme={theme}>
      {children}
        </div>
    </ThemeContext.Provider>
  )
}