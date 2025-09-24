
import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Box, Button, Typography } from '@mui/material';

const VoiceToText = ({ onResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <Typography color="error">Browser does not support speech recognition.</Typography>;
  }

  const handleStop = () => {
    SpeechRecognition.stopListening();
    if (transcript && onResult) {
      onResult(transcript);
    }
    resetTranscript();
  };

  return (
    <Box p={2} borderRadius={2} boxShadow={2} bgcolor="#fff" display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography color="text.secondary">
        🎤 {listening ? "Listening..." : "Click 'Add Voice Note' to start"}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => SpeechRecognition.startListening({ continuous: true, language: "en-IN" })}
        disabled={listening}
        sx={{ borderRadius: 2, fontWeight: 500, fontSize: 15, px: 3, py: 1 }}
      >
        Add Voice Note
      </Button>
      {listening && (
        <Button
          variant="contained"
          color="error"
          onClick={handleStop}
          sx={{ borderRadius: 2, fontWeight: 500, fontSize: 15, px: 3, py: 1 }}
        >
          Stop & Add
        </Button>
      )}
      {transcript && (
        <Typography color="text.secondary" fontSize={13} fontStyle="italic">
          Current voice note: {transcript}
        </Typography>
      )}
    </Box>
  );
};

export default VoiceToText;