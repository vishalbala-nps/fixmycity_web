
import React from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const VoiceToText = ({ onResult }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleStop = () => {
    SpeechRecognition.stopListening();
    if (transcript && onResult) {
      onResult(transcript);
    }
    resetTranscript();
  };

  return (
    <>
      {listening ? (
        <Tooltip title="Stop & Add Voice Note">
          <IconButton color="error" size="small" onClick={handleStop} sx={{ ml: 1 }}>
            <StopCircleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add Voice Note">
          <IconButton color="primary" size="small" onClick={() => SpeechRecognition.startListening({ continuous: true, language: "en-IN" })} sx={{ ml: 1 }}>
            <KeyboardVoiceIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default VoiceToText;