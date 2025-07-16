import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { API_BASE_URL } from '../../constants/env';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      if (res.status === 200) {
        router.replace('/tabs/home');
      } else {
        Alert.alert('Error', 'Registration failed. Try again.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={60} tint="dark" style={styles.card}>
        <Text style={styles.heading}>Create your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#bbb"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry={false} // You can toggle this with a visibility icon
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    fontFamily: 'Pixel',
    color: '#fff',
    marginBottom: 24,
    lineHeight: 40,
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
    fontFamily: 'Pixel',
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: 8,
    color: '#aaa',
    marginTop: 18,
    textAlign: 'center',
    fontFamily: 'Pixel',
  },
});