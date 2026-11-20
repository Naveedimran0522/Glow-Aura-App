/* Bismillah-ir-Rahman-ir-Raheem ❤️ */
/* GLOWAURA — AI BEAUTY CHAT + AUTOMATIC VOICE */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
  ArrowLeft,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react-native";

import * as Speech from "expo-speech";

import {
  sendBeautyMessage,
  type ChatMessage,
} from "../services/chat";

// ==========================================
// COLORS
// ==========================================

const COLORS = {
  background: "#FBF8F1",
  green: "#344A3D",
  gold: "#B79A68",
  text: "#292D28",
  muted: "#827D70",
  white: "#FFFFFF",
  border: "#E9E2D6",
};

// ==========================================
// QUICK PROMPTS
// ==========================================

const QUICK_PROMPTS = [
  "Create a skincare routine",
  "How can I improve my skin glow?",
  "Suggest a haircare routine",
  "Give me bridal beauty tips",
];

// ==========================================
// LANGUAGE DETECTION
// ==========================================

const getSpeechLanguage = (text: string): string => {
  // Hindi - Devanagari script
  if (/[\u0900-\u097F]/.test(text)) {
    return "hi-IN";
  }

  // Urdu - Arabic script
  if (/[\u0600-\u06FF]/.test(text)) {
    return "ur-PK";
  }

  // English and Roman Hinglish
  return "en-IN";
};

// ==========================================
// CHAT SCREEN
// ==========================================

export default function ChatScreen() {
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);
  const mountedRef = useRef(true);
  const speechRequestRef = useRef(0);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text:
        "Assalamu Alaikum! ✨ I'm GlowAura AI, your personal beauty assistant. Ask me anything about skincare, haircare, makeup or self-care. How can I help you today?",
      createdAt: new Date(),
    },
  ]);

  const [speakingMessageId, setSpeakingMessageId] =
    useState<string | null>(null);

  // ==========================================
  // STOP VOICE
  // ==========================================

  const stopSpeaking = useCallback(async () => {
    // Invalidate any older speech request
    speechRequestRef.current += 1;

    try {
      await Speech.stop();
    } catch (error) {
      console.error("GlowAura stop speech error:", error);
    } finally {
      if (mountedRef.current) {
        setSpeakingMessageId(null);
      }
    }
  }, []);

  // ==========================================
  // SPEAK AI RESPONSE
  // ==========================================

  const speakMessage = useCallback(
    async (text: string, messageId: string) => {
      const cleanText = text?.trim();

      if (!cleanText) {
        return;
      }

      const currentRequest = ++speechRequestRef.current;

      try {
        await Speech.stop();

        // Another request may have started while stopping
        if (
          !mountedRef.current ||
          currentRequest !== speechRequestRef.current
        ) {
          return;
        }

        setSpeakingMessageId(messageId);

        const language = getSpeechLanguage(cleanText);

        // Use the Android/iOS system TTS engine.
        Speech.speak(cleanText, {
          language,
          rate: 0.88,
          pitch: 1.0,

          onStart: () => {
            if (
              mountedRef.current &&
              currentRequest === speechRequestRef.current
            ) {
              setSpeakingMessageId(messageId);
            }
          },

          onDone: () => {
            if (
              mountedRef.current &&
              currentRequest === speechRequestRef.current
            ) {
              setSpeakingMessageId(null);
            }
          },

          onStopped: () => {
            if (
              mountedRef.current &&
              currentRequest === speechRequestRef.current
            ) {
              setSpeakingMessageId(null);
            }
          },

          onError: (error) => {
            console.error("GlowAura speech error:", error);

            if (
              mountedRef.current &&
              currentRequest === speechRequestRef.current
            ) {
              setSpeakingMessageId(null);
            }
          },
        });
      } catch (error) {
        console.error("GlowAura voice playback error:", error);

        if (
          mountedRef.current &&
          currentRequest === speechRequestRef.current
        ) {
          setSpeakingMessageId(null);

          Alert.alert(
            "GlowAura Voice",
            "Voice playback could not start. Please check your phone's Text-to-Speech settings."
          );
        }
      }
    },
    []
  );

  // ==========================================
  // SCREEN CLEANUP
  // ==========================================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      speechRequestRef.current += 1;

      void Speech.stop();
    };
  }, []);

  // ==========================================
  // SEND MESSAGE TO AI
  // ==========================================

  const sendMessage = async (customMessage?: string) => {
    const text = (customMessage ?? input).trim();

    if (!text || loading) {
      return;
    }

    // Stop previous voice before sending another message
    await stopSpeaking();

    if (!mountedRef.current) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text,
      createdAt: new Date(),
    };

    // Exclude welcome message from conversation history
    const previousMessages = messages.filter(
      (item) => item.id !== "welcome"
    );

    setMessages((current) => [...current, userMessage]);

    setInput("");
    setLoading(true);

    setTimeout(() => {
      if (mountedRef.current) {
        scrollRef.current?.scrollToEnd({
          animated: true,
        });
      }
    }, 100);

    try {
      // Call existing backend service
      const reply = await sendBeautyMessage(
        text,
        previousMessages
      );

      if (!mountedRef.current) {
        return;
      }

      const aiMessage: ChatMessage = {
        id: `${Date.now()}-ai`,
        role: "model",
        text: reply,
        createdAt: new Date(),
      };

      // Display AI response
      setMessages((current) => [...current, aiMessage]);

      // Automatically speak AI response
      void speakMessage(reply, aiMessage.id);
    } catch (error: unknown) {
      if (!mountedRef.current) {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      Alert.alert("GlowAura AI", errorMessage);
    } finally {
      if (mountedRef.current) {
        setLoading(false);

        setTimeout(() => {
          if (mountedRef.current) {
            scrollRef.current?.scrollToEnd({
              animated: true,
            });
          }
        }, 200);
      }
    }
  };

  // ==========================================
  // RENDER SCREEN
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={10}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              void stopSpeaking();
              router.back();
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft
              size={22}
              color={COLORS.green}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.aiIcon}>
              <Sparkles
                size={21}
                color={COLORS.gold}
              />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                GlowAura AI
              </Text>

              <Text style={styles.onlineText}>
                Your personal beauty assistant
              </Text>
            </View>
          </View>

          <View style={styles.headerRight} />
        </View>

        {/* CHAT MESSAGES */}

        <ScrollView
          ref={scrollRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            scrollRef.current?.scrollToEnd({
              animated: true,
            });
          }}
        >
          {/* WELCOME CARD */}

          <View style={styles.welcomeCard}>
            <Sparkles
              size={24}
              color={COLORS.gold}
            />

            <Text style={styles.welcomeTitle}>
              Let's bring out your natural glow
            </Text>

            <Text style={styles.welcomeSubtitle}>
              Your beauty journey starts with a conversation.
            </Text>
          </View>

          {/* MESSAGE LIST */}

          {messages.map((item) => {
            const isUser = item.role === "user";

            const isSpeaking =
              speakingMessageId === item.id;

            return (
              <View
                key={item.id}
                style={[
                  styles.messageRow,
                  isUser
                    ? styles.userMessageRow
                    : styles.aiMessageRow,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser
                      ? styles.userBubble
                      : styles.aiBubble,
                  ]}
                >
                  {!isUser && (
                    <Text style={styles.aiLabel}>
                      GLOWAURA AI
                    </Text>
                  )}

                  <Text
                    style={[
                      styles.messageText,
                      isUser && styles.userMessageText,
                    ]}
                  >
                    {item.text}
                  </Text>

                  {/* VOICE CONTROLS */}

                  {!isUser && (
                    <View style={styles.voiceControls}>
                      <TouchableOpacity
                        style={styles.voiceButton}
                        onPress={() => {
                          if (isSpeaking) {
                            void stopSpeaking();
                          } else {
                            void speakMessage(
                              item.text,
                              item.id
                            );
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        {isSpeaking ? (
                          <VolumeX
                            size={17}
                            color="#B65B5B"
                          />
                        ) : (
                          <Volume2
                            size={17}
                            color={COLORS.green}
                          />
                        )}

                        <Text
                          style={[
                            styles.voiceButtonText,
                            isSpeaking && styles.stopButtonText,
                          ]}
                        >
                          {isSpeaking ? "Stop" : "Listen"}
                        </Text>
                      </TouchableOpacity>

                      {isSpeaking && (
                        <Text style={styles.speakingText}>
                          Playing voice...
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {/* AI TYPING INDICATOR */}

          {loading && (
            <View style={styles.typingContainer}>
              <ActivityIndicator
                size="small"
                color={COLORS.green}
              />

              <Text style={styles.typingText}>
                GlowAura AI is thinking...
              </Text>
            </View>
          )}

          {/* QUICK PROMPTS */}

          {messages.length === 1 && (
            <View style={styles.promptsContainer}>
              <Text style={styles.promptHeading}>
                TRY ASKING
              </Text>

              {QUICK_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.promptButton}
                  onPress={() => {
                    void sendMessage(prompt);
                  }}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.promptText}>
                    {prompt}
                  </Text>

                  <Text style={styles.promptArrow}>
                    ↗
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* MESSAGE INPUT */}

        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask your beauty question..."
              placeholderTextColor={COLORS.muted}
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={3000}
              editable={!loading}
              textAlignVertical="center"
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || loading) &&
                  styles.sendButtonDisabled,
              ]}
              onPress={() => {
                void sendMessage();
              }}
              disabled={!input.trim() || loading}
              activeOpacity={0.8}
            >
              <Send
                size={19}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            GlowAura AI • Your beauty, your confidence ✨
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    gap: 10,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#F0E8D9",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.green,
  },

  onlineText: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 3,
  },

  headerRight: {
    width: 42,
  },

  chatArea: {
    flex: 1,
  },

  chatContent: {
    padding: 18,
    paddingBottom: 25,
  },

  welcomeCard: {
    backgroundColor: "#F1EBDD",
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },

  welcomeTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.green,
    textAlign: "center",
    marginTop: 12,
  },

  welcomeSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 19,
  },

  messageRow: {
    width: "100%",
    marginBottom: 15,
  },

  userMessageRow: {
    alignItems: "flex-end",
  },

  aiMessageRow: {
    alignItems: "flex-start",
  },

  messageBubble: {
    maxWidth: "88%",
    padding: 15,
    borderRadius: 19,
  },

  userBubble: {
    backgroundColor: COLORS.green,
    borderBottomRightRadius: 5,
  },

  aiBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 5,
  },

  aiLabel: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
  },

  messageText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },

  userMessageText: {
    color: COLORS.white,
  },

  voiceControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 12,
  },

  voiceButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },

  voiceButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },

  stopButtonText: {
    color: "#B65B5B",
  },

  speakingText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 12,
  },

  typingText: {
    fontSize: 12,
    color: COLORS.muted,
  },

  promptsContainer: {
    marginTop: 12,
  },

  promptHeading: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: COLORS.muted,
    marginBottom: 12,
  },

  promptButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  promptText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.green,
  },

  promptArrow: {
    fontSize: 18,
    color: COLORS.gold,
  },

  inputContainer: {
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  inputBox: {
    minHeight: 54,
    maxHeight: 120,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    paddingLeft: 15,
    paddingRight: 7,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    maxHeight: 95,
    paddingTop: 12,
    paddingBottom: 12,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.4,
  },

  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 9,
  },
});