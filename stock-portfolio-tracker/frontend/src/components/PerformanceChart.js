import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box, Typography } from "@mui/material";
import { useTheme } from "../contexts/ThemeContext"; // Import useTheme

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PerformanceChart() {
  const { theme } = useTheme(); // Use the theme context

  // Dummy data for demonstration - in a real app, this would come from your backend
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Portfolio Value",
        data: [
          10000, 10500, 9800, 11000, 11200, 10800, 11500, 11800, 12500, 12200,
          13000, 13500,
        ],
        fill: false,
        borderColor: theme.palette.success.main, // Use success color for the line (green)
        tension: 0.1, // Smoothness of the line
        pointBackgroundColor: theme.palette.success.main,
        pointBorderColor: theme.palette.success.main,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its parent container's height
    plugins: {
      legend: {
        display: false, // Set to false to hide legend for minimalistic design
      },
      title: {
        display: false, // Set to false to hide title
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.8)"
            : "rgba(255,255,255,0.8)",
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.mode === "dark" ? "#333333" : "#cccccc",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary, // X-axis label color
          font: {
            size: 10,
            weight: 300,
          },
        },
        grid: {
          color: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0", // X-axis grid color (subtle)
          borderColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary, // Y-axis label color
          font: {
            size: 10,
            weight: 300,
          },
          callback: function (value) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
              compactDisplay: "short",
            }).format(value);
          },
        },
        grid: {
          color: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0", // Y-axis grid color (subtle)
          borderColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0",
        },
        position: "right", // Align Y-axis to the right for a more financial look
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper, // Use paper background color
        border: "1px solid",
        borderColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0", // Dynamic border color
        borderRadius: 0,
        p: 3,
        height: 400, // Fixed height for the chart container for consistent layout
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 300,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          mb: 3,
          color: theme.palette.text.primary, // Dynamic text color
        }}
      >
        Performance Over Time
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        {" "}
        {/* Makes the chart fill available space */}
        <Line data={data} options={options} />
      </Box>
    </Box>
  );
}

export default PerformanceChart;
