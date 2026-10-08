import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Input from '../components/Input';
import Button from '../components/Button';
import { registerUser } from '../services/firebase';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { UserRole } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const COUNTRIES = ['Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'Other'];

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const [role, setRole] = useState<UserRole>('client');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    nationalId: '',
    phone: '',
    location: '',
    country: 'Uganda',
    utbLicenseNumber: '',
    utbLicenseExpiry: '',
    companyName: '',
    companyAddress: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.username.trim()) e.username = 'Required';
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.nationalId.trim()) e.nationalId = 'National ID is required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.location.trim()) e.location = 'Required';
    if (!form.country.trim()) e.country = 'Required';

    if (role === 'operator') {
      if (!form.utbLicenseNumber.trim()) e.utbLicenseNumber = 'UTB License Number required';
      if (!form.utbLicenseExpiry.trim()) e.utbLicenseExpiry = 'License expiry required';
      if (!form.companyName.trim()) e.companyName = 'Company name required';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(form.email.trim(), form.password, {
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        nationalId: form.nationalId.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        country: form.country.trim(),
        role,
        utbLicenseNumber: role === 'operator' ? form.utbLicenseNumber.trim() : undefined,
        utbLicenseExpiry: role === 'operator' ? form.utbLicenseExpiry.trim() : undefined,
        companyName: role === 'operator' ? form.companyName.trim() : undefined,
        companyAddress: role === 'operator' ? form.companyAddress.trim() : undefined,
      });
      Alert.alert(
        'Account Created',
        role === 'operator'
          ? 'Your operator account has been created. An admin may need to verify your UTB license before you can publish itineraries.'
          : 'Welcome to Brendava Tours! You can now browse and book itineraries.'
      );
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Please try again.');
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Brendava Tours & Travel</Text>

        {/* Role selector */}
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'client' && styles.roleActive]}
            onPress={() => setRole('client')}
          >
            <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>
              Client / Traveller
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === 'operator' && styles.roleActive]}
            onPress={() => setRole('operator')}
          >
            <Text style={[styles.roleText, role === 'operator' && styles.roleTextActive]}>
              Tour Operator
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Input label="Full Name" value={form.fullName} onChangeText={(v) => update('fullName', v)} placeholder="Brenda N" error={errors.fullName} />
          <Input label="Username" value={form.username} onChangeText={(v) => update('username', v)} autoCapitalize="none" placeholder="brenda_tours" error={errors.username} />
          <Input label="Email Address" value={form.email} onChangeText={(v) => update('email', v)} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={errors.email} />
          <Input label="National ID / Passport No." value={form.nationalId} onChangeText={(v) => update('nationalId', v)} placeholder="CMXXXXXXXXXX" error={errors.nationalId} />
          <Input label="Phone Number" value={form.phone} onChangeText={(v) => update('phone', v)} keyboardType="phone-pad" placeholder="+256 7XX XXX XXX" error={errors.phone} />
          <Input label="Location / City" value={form.location} onChangeText={(v) => update('location', v)} placeholder="Kampala" error={errors.location} />
          <Input label="Country" value={form.country} onChangeText={(v) => update('country', v)} placeholder="Uganda" error={errors.country} />

          {role === 'operator' && (
            <>
              <Text style={styles.sectionTitle}>Operator / UTB Details</Text>
              <Input label="Company Name" value={form.companyName} onChangeText={(v) => update('companyName', v)} placeholder="Brendava Tours & Travel" error={errors.companyName} />
              <Input label="Company Address" value={form.companyAddress} onChangeText={(v) => update('companyAddress', v)} placeholder="Kampala, Uganda" />
              <Input label="UTB License Number" value={form.utbLicenseNumber} onChangeText={(v) => update('utbLicenseNumber', v)} placeholder="UTB/RTT/TO/202X/XXXXXX" error={errors.utbLicenseNumber} />
              <Input label="UTB License Expiry (YYYY-MM-DD)" value={form.utbLicenseExpiry} onChangeText={(v) => update('utbLicenseExpiry', v)} placeholder="2026-12-31" error={errors.utbLicenseExpiry} />
            </>
          )}

          <Input label="Password" value={form.password} onChangeText={(v) => update('password', v)} secureTextEntry placeholder="••••••••" error={errors.password} />
          <Input label="Confirm Password" value={form.confirmPassword} onChangeText={(v) => update('confirmPassword', v)} secureTextEntry placeholder="••••••••" error={errors.confirmPassword} />

          <Button title="Create Account" onPress={handleRegister} loading={loading} style={{ marginTop: Spacing.md }} />

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkRow}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Text style={styles.linkBold}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.lg, paddingBottom: 60 },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.primary, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  roleActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  roleText: { fontWeight: '600', color: Colors.textSecondary, fontSize: FontSizes.sm },
  roleTextActive: { color: Colors.textLight },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  linkText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  linkBold: { color: Colors.primary, fontWeight: '700', fontSize: FontSizes.sm },
});
