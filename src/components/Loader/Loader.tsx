import { Box, useTheme } from "@mui/material";

export function Loader() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1.5,
        maxWidth: "60%",
        borderRadius: 3,
        bgcolor: isDark ? "#1f1f1f" : "#f3f4f6",
        mb: 1.5,
        animation: "pulse 1.5s infinite",
      }}
    >
      <Box sx={{ display: "flex", gap: 0.75 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              bgcolor: isDark ? "#fbbf24" : "#f59e0b",
              borderRadius: "50%",
              animation: `bounce 1.4s infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </Box>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}
