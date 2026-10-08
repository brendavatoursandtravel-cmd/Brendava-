import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getClientBookings, getOperatorBookings } from '../services/firebase';
import { Booking } from '../types';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';

export default function MyBookingsScreen() {
  const { user, isOperator } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const data = isOperator
        ? await getOperatorBookings(user.uid)
        : await getClientBookings(user.uid);
      setBookings(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, isOperator]);

  useEffect(() => {
    load();
  }, [load]);

  const statusColor = (s: Booking['status']) => {
    switch (s) {
      case 'confirmed': return Colors.success;
      case 'cancelled': return Colors.error;
      case 'completed': return Colors.primaryLight;
      default: return Colors.warning;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: Spacing.md, paddingBottom: 40 }}
      data={bookings}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={Colors.primary} />
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            {isOperator
              ? 'When clients book your itineraries they will appear here.'
              : 'Browse itineraries and request a booking to get started.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.title} numberOfLines={2}>{item.itineraryTitle}</Text>
            <View style={[styles.badge, { backgroundColor: statusColor(item.status) }]}>
              <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.meta}>Travel date: {item.travelDate}</Text>
          <Text style={styles.meta}>Guests: {item.numberOfGuests}</Text>
          <Text style={styles.price}>${item.totalPriceUSD}</Text>
          {isOperator && (
            <>
              <Text style={styles.meta}>Client: {item.clientName}</Text>
              <Text style={styles.meta}>{item.clientEmail} • {item.clientPhone}</Text>
            </>
          )}
          {item.specialRequests ? (
            <Text style={styles.requests}>Note: {item.specialRequests}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { flex: 1, fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary, marginRight: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm },
  badgeText: { color: Colors.textLight, fontSize: 10, fontWeight: '800' },
  meta: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  price: { fontSize: FontSizes.lg, fontWeight: '800', color: Colors.primary, marginTop: 8 },
  requests: { fontSize: FontSizes.sm, color: Colors.text, marginTop: 8, fontStyle: 'italic' },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
});
