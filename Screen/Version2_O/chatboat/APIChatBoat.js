import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../redux/reducer/homeReducer";

const API_KEY = "AIzaSyBhN5Lko8Pbqfa7bed9upiHDv1kDmXS6VU";

const AISearchScreen = () => {
  const dispatch = useDispatch();
  const PropertyDetails = useSelector((state) => state.home.Properties || []);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Improved auto-scroll
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 150);
    }
  }, [messages, loading]);

  const sendToGemini = async (userInput, properties) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `
User query: ${userInput}
Properties:
${JSON.stringify(properties)}
Suggest best 2 properties in short.
                    `,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.log("Gemini HTTP error:", response.status, errText);
        return "Sorry, error connecting to AI service.";
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestion available.";
    } catch (err) {
      console.log("Gemini fetch error:", err);
      return "Error";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      type: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const formattedProps = PropertyDetails.slice(0, 8).map((p) => ({
        id: `${p._id}-${Math.random().toString(36).slice(2)}`, // better unique key
        name: p.name || "Property",
        location: p.Location || "N/A",
        price: p.FC_Price || "N/A",
        image: p.image?.Image1,
        type: p.Type || "N/A",
      }));

      const aiText = await sendToGemini(input, formattedProps);

      const aiMsg = {
        id: Date.now().toString() + "_ai",
        text: aiText,
        type: "ai",
        properties: formattedProps, // reference is fine here
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.type === "user" ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          item.type === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>

      {item.properties && (
        <FlatList
          data={item.properties}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(prop) => prop.id}
          contentContainerStyle={styles.cardsContainer}
          renderItem={({ item: prop }) => (
            <View style={styles.propertyCard}>
              <Image
                source={{
                  uri: prop.image || "https://via.placeholder.com/160x100?text=No+Image",
                }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {prop.name}
                </Text>
                <Text style={styles.cardLocation}>{prop.location}</Text>
                <Text style={styles.cardPrice}>₹ {prop.price}</Text>
                <Text style={styles.cardType}>{prop.type}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />

        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about properties... (e.g. 2BHK in Hyderabad under 50L)"
            placeholderTextColor="#999"
            multiline
            maxLength={250}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.disabled]}
            onPress={handleSend}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100, // space for input
  },
  messageContainer: {
    marginVertical: 8,
    alignItems: "flex-start",
  },
  userContainer: {
    alignItems: "flex-end",
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: "78%",
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#e9ecef",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: "#111",
    fontSize: 16,
    lineHeight: 22,
  },
  cardsContainer: {
    marginTop: 12,
    paddingLeft: 4,
  },
  propertyCard: {
    width: 168,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardInfo: {
    padding: 10,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  cardType: {
    fontSize: 12,
    color: "#777",
  },
  loadingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 120,
    backgroundColor: "#f1f3f5",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  disabled: {
    backgroundColor: "#a0c4ff",
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AISearchScreen;