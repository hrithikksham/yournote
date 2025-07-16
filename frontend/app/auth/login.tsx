import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/env';
import * as SecureStore from 'expo-secure-store';


const { width } = Dimensions.get('window');

async function saveToken(token: string) {
  await SecureStore.setItemAsync('user_token', token);
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      if (response.status === 200) {
        await saveToken(response.data.access_token);
        router.replace('/tabs/home');
      } else {
        Alert.alert('❌ Login Failed', 'Please check your credentials.');
      }
    } catch (err: any) {
      console.log(err?.response?.data || err.message);
      Alert.alert('⚠️ Error', err?.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.card}>
        <Text style={styles.heading}>Login your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heading: {
    fontSize: 28,
    lineHeight: 40,
    fontFamily: 'Pixel',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    color: '#fff',
    fontFamily: 'PoppinsRegular',
  },
  button: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#1D1D1D',
    fontWeight: 'bold',
    fontFamily: 'Pixel',
  },
  linkText: {
    color: '#aaa',
    marginTop: 18,
    textAlign: 'center',
    fontFamily: 'Pixel',
    fontSize: 8,
  },
});