import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getActiveItineraries } from '../services/firebase';
import { Itinerary } from '../types';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../hooks/useAuth';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, isOperator } = useAuth();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getActiveItineraries();
      setItineraries(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const renderItem = ({ item }: { item: Itinerary }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItineraryDetail', { id: item.id })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.coverImageUrl || 'https://via.placeholder.com/400x240?text=Safari' }}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>
          {item.durationDays} days • {item.destinations?.slice(0, 2).join(', ')}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.priceUSD}</Text>
          <Text style={styles.perPerson}> / person</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {profile?.fullName?.split(' ')[0] || 'Traveller'}</Text>
          <Text style={styles.headerSub}>Discover East Africa</Text>
        </View>
        {isOperator && (
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('UploadItinerary')}
          >
            <Text style={styles.uploadBtnText}>+ Upload</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={itineraries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No itineraries yet</Text>
              <Text style={styles.emptyText}>
                {isOperator
                  ? 'Be the first to upload a safari itinerary!'
                  : 'Check back soon for exciting East Africa adventures.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.primary },
  headerSub: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  uploadBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  uploadBtnText: { color: Colors.textLight, fontWeight: '700', fontSize: FontSizes.sm },
  list: { padding: Spacing.md, paddingBottom: 100 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  cover: { width: '100%', height: 180 },
  cardBody: { padding: Spacing.md },
  category: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text, marginTop: 4 },
  meta: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  price: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.primary },
  perPerson: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text },
  emptyText: { fontSize: FontSizes.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
});
