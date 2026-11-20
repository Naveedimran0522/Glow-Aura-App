
/* Bismillah ❤️ */
/* GLOWAURA — HINDI / URDU / ENGLISH AI VOICE */

import * as Speech from "expo-speech";

// Detect language from text
export const getVoiceLanguage = (text: string): string => {
  if (/[\u0900-\u097F]/.test(text)) {
    return "hi-IN";
  }

  if (/[\u0600-\u06FF]/.test(text)) {
    return "ur-PK";
  }

  return "en-IN";
};

// Speak AI response
export const speakMessage = async (
  text: string
): Promise<void> => {
  if (!text || !text.trim()) {
    return;
  }

  try {
    // Stop previous speech
    await Speech.stop();

    const language = getVoiceLanguage(text);

    let selectedVoice: string | undefined;

    try {
      const voices = await Speech.getAvailableVoicesAsync();

      const languageCode = language
        .split("-")[0]
        .toLowerCase();

      const matchingVoice = voices.find((voice) => {
        return voice.language
          ?.toLowerCase()
          .startsWith(languageCode);
      });

      selectedVoice = matchingVoice?.identifier;

      if (!matchingVoice) {
        console.warn(
          `GlowAura: No installed voice found for ${language}. Trying system TTS.`
        );
      }
    } catch (voiceError) {
      console.warn(
        "GlowAura: Could not load available voices:",
        voiceError
      );
    }

    Speech.speak(text, {
      language,
      voice: selectedVoice,
      rate: 0.88,
      pitch: 1.0,

      onStart: () => {
        console.log("GlowAura voice started ❤️");
      },

      onDone: () => {
        console.log("GlowAura voice completed");
      },

      onStopped: () => {
        console.log("GlowAura voice stopped");
      },

      onError: (error) => {
        console.error("GlowAura speech error:", error);
      },
    });
  } catch (error) {
    console.error("GlowAura speech failed:", error);
  }
};

// Stop voice
export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error("GlowAura stop speech error:", error);
  }
};

// Check whether speech is currently playing
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error("GlowAura speech status error:", error);
    return false;
  }
};
