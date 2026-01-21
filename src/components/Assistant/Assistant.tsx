import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";

// Assistants APIs
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai";
import { Assistant as OpenAIAssistant } from "../../assistants/openai";
import { Assistant as DeepSeekAIAssistant } from "../../assistants/deepseekai";

const optionMap = {
  googleai: GoogleAIAssistant,
  openai: OpenAIAssistant,
  deepseekai: DeepSeekAIAssistant,
};

type OptionKey = keyof typeof optionMap;

type Props = {
  onAssistantChange: (assistant: any) => void;
};

export function Assistant({ onAssistantChange }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [selectedApi, setSelectedApi] = useState<OptionKey>("googleai");

  useEffect(() => {
    const AssistantClass = optionMap[selectedApi];

    if (!AssistantClass) {
      throw new Error(`Unknown api: ${selectedApi}`);
    }

    onAssistantChange(new AssistantClass());
  }, [selectedApi, onAssistantChange]);

  return (
    <Box
      sx={{
        bottom: 16,
        right: 16,
        bgcolor: "transparent",
        p: 2,
        borderRadius: 2,
        minWidth: 200,
      }}
    >
      <FormControl fullWidth size="small">
        <InputLabel
          sx={{
            color: isDark ? "#fff" : "#555",
            "&.Mui-focused": {
              color: isDark ? "#fff" : "#555",
            },
          }}
        >
          API
        </InputLabel>

        <Select
          value={selectedApi}
          label="API"
          onChange={(e) =>
            setSelectedApi(e.target.value as OptionKey)
          }
          sx={{
            color: isDark ? "#fff" : "#000",

            "& .MuiSelect-icon": {
              color: isDark ? "#fff" : "#000",
            },

            "& fieldset": {
              borderColor: isDark ? "#555" : "#4d4d4f",
            },

            "&:hover fieldset": {
              borderColor: isDark ? "#888" : "#000",
            },

            "&.Mui-focused fieldset": {
              borderColor: isDark ? "#fff" : "#000",
            },
          }}
        >
          <MenuItem value="googleai">Google AI</MenuItem>
          <MenuItem value="openai">OpenAI</MenuItem>
          <MenuItem value="deepseekai">DeepSeek AI</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
