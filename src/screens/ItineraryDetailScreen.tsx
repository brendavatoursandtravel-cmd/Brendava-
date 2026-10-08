import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { getItineraryById, createBooking } from '../services/firebase';
import { Itinerary } from '../types';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList } from '../navigation/types';

type Route = RouteProp<RootStackParamList, 'ItineraryDetail'>;

export default function ItineraryDetailScreen() {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const { user, profile, isClient } = useAuth();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [guests, setGuests] = useState('2');
  const [travelDate, setTravelDate] = useState('');
  const [requests, setRequests] = useState('');

  useEffect(() => {
    (async () => {
      const data = await getItineraryById(params.id);
      setItinerary(data);
      setLoading(false);
    })();
  }, [params.id]);

  const handleBook = async () => {
    if (!user || !profile || !itinerary) return;
    if (!travelDate.trim()) {
      Alert.alert('Required', 'Please enter your preferred travel date (YYYY-MM-DD).');
      return;
    }
    const numGuests = parseInt(guests, 10) || 1;
    if (numGuests < 1) {
      Alert.alert('Invalid', 'Number of guests must be at least 1.');
      return;
    }

    setBooking(true);
    try {
      await createBooking({
        itineraryId: itinerary.id,
        itineraryTitle: itinerary.title,
        clientId: user.uid,
        clientName: profile.fullName,
        clientEmail: profile.email,
        clientPhone: profile.phone,
        operatorId: itinerary.operatorId,
        travelDate: travelDate.trim(),
        numberOfGuests: numGuests,
        totalPriceUSD: itinerary.priceUSD * numGuests,
        specialRequests: requests.trim() || undefined,
      });
      Alert.alert(
        'Booking Submitted',
        'Your booking request has been sent to the operator. You will be contacted shortly to confirm.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not submit booking.');
    } finally {
      setBooking(false);
    }
  };

  if (loading || !itinerary) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Image
        source={{ uri: itinerary.coverImageUrl || 'https://via.placeholder.com/600x320' }}
        style={styles.hero}
      />
      <View style={styles.body}>
        <Text style={styles.category}>{itinerary.category}</Text>
        <Text style={styles.title}>{itinerary.title}</Text>
        <Text style={styles.meta}>
          {itinerary.durationDays} days • Max {itinerary.maxGroupSize} guests • {itinerary.difficulty}
        </Text>
        <Text style={styles.price}>${itinerary.priceUSD} <Text style={styles.per}>/ person</Text></Text>

        <Text style={styles.section}>Description</Text>
        <Text style={styles.text}>{itinerary.description}</Text>

        {itinerary.destinations?.length > 0 && (
          <>
            <Text style={styles.section}>Destinations</Text>
            <Text style={styles.text}>{itinerary.destinations.join(' • ')}</Text>
          </>
        )}

        {itinerary.highlights?.length > 0 && (
          <>
            <Text style={styles.section}>Highlights</Text>
            {itinerary.highlights.map((h, i) => (
              <Text key={i} style={styles.bullet}>• {h}</Text>
            ))}
          </>
        )}

        {itinerary.includes?.length > 0 && (
          <>
            <Text style={styles.section}>Includes</Text>
            {itinerary.includes.map((h, i) => (
              <Text key={i} style={styles.bullet}>✓ {h}</Text>
            ))}
          </>
        )}

        {itinerary.excludes?.length > 0 && (
          <>
            <Text style={styles.section}>Excludes</Text>
            {itinerary.excludes.map((h, i) => (
              <Text key={i} style={styles.bullet}>✗ {h}</Text>
            ))}
          </>
        )}

        {isClient && (
          <View style={styles.bookingBox}>
            <Text style={styles.section}>Book this itinerary</Text>
            <Text style={styles.label}>Preferred travel date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={travelDate}
              onChangeText={setTravelDate}
              placeholder="2026-07-15"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.label}>Number of guests</Text>
            <TextInput
              style={styles.input}
              value={guests}
              onChangeText={setGuests}
              keyboardType="number-pad"
              placeholder="2"
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.label}>Special requests (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              value={requests}
              onChangeText={setRequests}
              multiline
              placeholder="Dietary needs, accessibility, etc."
              placeholderTextColor={Colors.textSecondary}
            />
            <Text style={styles.total}>
              Estimated total: ${itinerary.priceUSD * (parseInt(guests, 10) || 1)}
            </Text>
            <Button title="Request Booking" onPress={handleBook} loading={booking} />
          </View>
        )}

        <Text style={styles.operator}>Operated by {itinerary.operatorName}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hero: { width: '100%', height: 260 },
  body: { padding: Spacing.lg },
  category: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.primary, marginTop: 4 },
  meta: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 6 },
  price: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.primary, marginTop: 10 },
  per: { fontSize: FontSizes.sm, fontWeight: '400', color: Colors.textSecondary },
  section: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: Spacing.lg,
    marginBottom: 6,
  },
  text: { fontSize: FontSizes.md, color: Colors.text, lineHeight: 22 },
  bullet: { fontSize: FontSizes.sm, color: Colors.text, marginBottom: 4, lineHeight: 20 },
  bookingBox: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text, marginBottom: 4, marginTop: 10 },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  total: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary, marginVertical: 12 },
  operator: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: Spacing.xl,
  },
});
