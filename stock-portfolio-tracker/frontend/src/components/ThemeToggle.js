import React from "react";
import { IconButton } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext";

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <IconButton
      onClick={toggleTheme}
      sx={{
        width: 32,
        height: 32,
        border: "1px solid",
        borderColor: isDarkMode ? "#333333" : "#cccccc",
        borderRadius: 0,
        p: 0,
        mr: 2,
        "&:hover": {
          borderColor: isDarkMode ? "#ffffff" : "#000000",
          backgroundColor: "transparent",
        },
      }}
    >
      {isDarkMode ? (
        // Sun icon for light mode
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon icon for dark mode
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </IconButton>
  );
}

export default ThemeToggle;
