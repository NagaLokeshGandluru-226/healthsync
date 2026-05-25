import {createContext, useEffect, useState} from "react"

export const ThemeContext = createContext()

const ThemeProvider = ({children}) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("healthsync_theme") === "dark"
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("healthsync_theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("healthsync_theme", "light")
    }
  }, [darkMode])

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider