import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { profile, logout, isOperator } = useAuth();
  const navigation = useNavigation<Nav>();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!profile) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.lg }}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{profile.fullName}</Text>
        <Text style={styles.role}>{profile.role === 'operator' ? 'Tour Operator' : 'Client'}</Text>
        {profile.companyName ? <Text style={styles.company}>{profile.companyName}</Text> : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        <Row label="Username" value={profile.username} />
        <Row label="Email" value={profile.email} />
        <Row label="National ID" value={profile.nationalId} />
        <Row label="Phone" value={profile.phone} />
        <Row label="Location" value={`${profile.location}, ${profile.country}`} />
        {isOperator && (
          <>
            <Row label="UTB License" value={profile.utbLicenseNumber || '—'} />
            <Row label="License Expiry" value={profile.utbLicenseExpiry || '—'} />
          </>
        )}
      </View>

      <Button
        title="My Bookings"
        onPress={() => navigation.navigate('MyBookings')}
        variant="outline"
        style={{ marginBottom: Spacing.sm }}
      />
      <Button
        title="Terms & Conditions"
        onPress={() => navigation.navigate('Terms')}
        variant="outline"
        style={{ marginBottom: Spacing.sm }}
      />
      <Button
        title="Visit Website"
        onPress={() => Linking.openURL('https://www.brendavatoursandtravel.com')}
        variant="outline"
        style={{ marginBottom: Spacing.sm }}
      />
      <Button title="Sign Out" onPress={handleLogout} variant="danger" />
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: Colors.textLight, fontSize: 28, fontWeight: '800' },
  name: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.primary },
  role: { fontSize: FontSizes.sm, color: Colors.secondary, fontWeight: '600', marginTop: 2 },
  company: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  rowValue: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text, maxWidth: '60%', textAlign: 'right' },
});
