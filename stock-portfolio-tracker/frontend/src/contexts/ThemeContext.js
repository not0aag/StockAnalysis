// src/contexts/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from "react";
import { createTheme } from "@mui/material/styles";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#cccccc",
    },
    secondary: {
      main: "#00ff00",
    },
    background: {
      default: "#000000",
      paper: "#0a0a0a",
    },
    text: {
      primary: "#ffffff",
      secondary: "#999999",
    },
    success: {
      main: "#00ff00",
    },
    error: {
      main: "#ff0000",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 300,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 300,
          letterSpacing: "0.05em",
          padding: "12px 32px",
          border: "1px solid transparent",
          transition: "all 0.3s ease",
        },
        contained: {
          backgroundColor: "#ffffff",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#000000",
            color: "#ffffff",
            border: "1px solid #ffffff",
          },
        },
        outlined: {
          borderColor: "#333333",
          color: "#ffffff",
          "&:hover": {
            borderColor: "#ffffff",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#333333",
            },
            "&:hover fieldset": {
              borderColor: "#666666",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiTab: {
      // <--- ADD/UPDATE THIS SECTION IN BOTH THEMES
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 300,
          fontSize: "1rem",
          letterSpacing: "0.02em",
          minHeight: "auto", // Ensure min-height is reasonable
          padding: "12px 24px", // Adjust padding
          color: "#999999", // Default text color for tabs in dark mode
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.05)", // Subtle hover
            color: "#ffffff",
          },
          "&.Mui-selected": {
            color: "#ffffff", // Selected text color
            backgroundColor: "transparent !important", // *** FORCE TRANSPARENT ***
            fontWeight: 400, // Slightly bolder for selected
          },
        },
      },
    },
    MuiTabs: {
      // <--- ADD THIS FOR THE INDICATOR AS WELL
      styleOverrides: {
        indicator: {
          backgroundColor: "#ffffff", // Indicator color
          height: 1, // Thin indicator
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      light: "#333333",
      dark: "#000000",
    },
    secondary: {
      main: "#00cc00",
    },
    background: {
      default: "#ffffff",
      paper: "#fafafa",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
    success: {
      main: "#00cc00",
    },
    error: {
      main: "#cc0000",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 100,
      letterSpacing: "-0.02em",
    },
    h6: {
      fontWeight: 300,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          fontWeight: 300,
          letterSpacing: "0.05em",
          padding: "12px 32px",
          border: "1px solid transparent",
          transition: "all 0.3s ease",
        },
        contained: {
          backgroundColor: "#000000",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid #000000",
          },
        },
        outlined: {
          borderColor: "#cccccc",
          color: "#000000",
          "&:hover": {
            borderColor: "#000000",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#fafafa",
          border: "1px solid #e0e0e0",
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            "& fieldset": {
              borderColor: "#cccccc",
            },
            "&:hover fieldset": {
              borderColor: "#999999",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#000000",
              borderWidth: 1,
            },
          },
        },
      },
    },
    MuiTab: {
      // <--- ADD/UPDATE THIS SECTION IN BOTH THEMES
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 300,
          fontSize: "1rem",
          letterSpacing: "0.02em",
          minHeight: "auto",
          padding: "12px 24px",
          color: "#666666", // Default text color for tabs in light mode
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)", // Subtle hover
            color: "#000000",
          },
          "&.Mui-selected": {
            color: "#000000", // Selected text color
            backgroundColor: "transparent !important", // *** FORCE TRANSPARENT ***
            fontWeight: 400, // Slightly bolder for selected
          },
        },
      },
    },
    MuiTabs: {
      // <--- ADD THIS FOR THE INDICATOR AS WELL
      styleOverrides: {
        indicator: {
          backgroundColor: "#000000", // Indicator color
          height: 1, // Thin indicator
        },
      },
    },
  },
});

export const ThemeContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
