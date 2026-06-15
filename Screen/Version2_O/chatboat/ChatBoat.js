import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../../redux/reducer/homeReducer';

export default function AIChatScreen() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const properties = useSelector((state) => state.home.Properties || []);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { role: 'user', content: prompt };
    setHistory((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      // Option 1: Direct Ollama (only for development on Simulator)
      // Better Option: Call your own FastAPI backend (recommended)

    const response = await fetch('http://192.168.1.105:11434/api/generate', {   // ← Change to your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: prompt,
          // You can also send property context if needed
         // properties: properties.slice(0, 5),
        }),
      });
console.log(response,"=====res000-----")
      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.answer };

      setHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setHistory((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I couldn't connect. Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.history} contentContainerStyle={{ padding: 16 }}>
          {history.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={msg.role === 'user' ? styles.userText : styles.aiText}>
                {msg.content}
              </Text>
            </View>
          ))}
          {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Ask anything about FracSpace, properties, investments..."
            placeholderTextColor="#888"
            multiline
          />
          <Button title={loading ? '...' : 'Send'} onPress={handleSend} disabled={loading || !prompt.trim()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  history: { flex: 1 },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    maxWidth: '85%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  userText: { color: '#000' },
  aiText: { color: '#000' },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    maxHeight: 120,
    backgroundColor: '#fff',
  },
});