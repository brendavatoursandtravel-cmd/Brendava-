import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../components/Input';
import Button from '../components/Button';
import { loginUser } from '../services/firebase';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      // Navigation is handled by auth state listener
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>BT</Text>
          </View>
          <Text style={styles.title}>Brendava Tours</Text>
          <Text style={styles.subtitle}>& Travel</Text>
          <Text style={styles.tagline}>Licensed Ugandan Operator • East Africa Safaris</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            error={errors.email}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            error={errors.password}
          />

          <Button title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.md }} />

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>Don't have an account? </Text>
            <Text style={styles.linkBold}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Terms')} style={styles.termsLink}>
            <Text style={styles.termsText}>Terms • Privacy • License</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.website}>www.brendavatoursandtravel.com</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  logoText: {
    color: Colors.textLight,
    fontSize: 28,
    fontWeight: '800',
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.secondary,
    marginTop: -4,
  },
  tagline: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  linkText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  linkBold: { color: Colors.primary, fontWeight: '700', fontSize: FontSizes.sm },
  termsLink: { alignItems: 'center', marginTop: Spacing.md },
  termsText: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  website: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xl,
  },
});
