import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { createItinerary } from '../services/firebase';
import { uploadMultipleImages } from '../services/cloudinary';
import Button from '../components/Button';
import Input from '../components/Input';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';

const CATEGORIES = ['Gorilla Trekking', 'Wildlife Safari', 'Cultural', 'Birding', 'Multi-Country', 'Custom'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging'] as const;

export default function UploadItineraryScreen() {
  const navigation = useNavigation();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationDays: '3',
    priceUSD: '',
    destinations: '',
    highlights: '',
    includes: '',
    excludes: '',
    maxGroupSize: '6',
    difficulty: 'Moderate' as typeof DIFFICULTIES[number],
    category: 'Gorilla Trekking',
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 6,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 6));
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;
    if (!form.title.trim() || !form.description.trim() || !form.priceUSD) {
      Alert.alert('Missing fields', 'Title, description and price are required.');
      return;
    }
    if (images.length === 0) {
      Alert.alert('Images required', 'Please add at least one cover image.');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload images to Cloudinary
      const imageUrls = await uploadMultipleImages(images, `itineraries/${user.uid}`);

      // 2. Save description & metadata to Firestore
      await createItinerary({
        operatorId: user.uid,
        operatorName: profile.companyName || profile.fullName,
        title: form.title.trim(),
        description: form.description.trim(),
        durationDays: parseInt(form.durationDays, 10) || 1,
        priceUSD: parseFloat(form.priceUSD) || 0,
        currency: 'USD',
        destinations: form.destinations.split(',').map((s) => s.trim()).filter(Boolean),
        highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
        includes: form.includes.split('\n').map((s) => s.trim()).filter(Boolean),
        excludes: form.excludes.split('\n').map((s) => s.trim()).filter(Boolean),
        imageUrls,
        coverImageUrl: imageUrls[0],
        maxGroupSize: parseInt(form.maxGroupSize, 10) || 6,
        difficulty: form.difficulty,
        category: form.category as any,
        isActive: true,
      });

      Alert.alert('Success', 'Itinerary uploaded and is now visible to clients.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Upload failed', err.message || 'Please check your Cloudinary & Firebase config.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 60 }}>
      <Text style={styles.title}>Upload New Itinerary</Text>
      <Text style={styles.hint}>Images → Cloudinary • Details → Firebase</Text>

      <Input label="Title *" value={form.title} onChangeText={(v) => update('title', v)} placeholder="3-Day Bwindi Gorilla Trek" />
      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.textArea]}
        value={form.description}
        onChangeText={(v) => update('description', v)}
        multiline
        placeholder="Full itinerary description..."
        placeholderTextColor={Colors.textSecondary}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input label="Duration (days)" value={form.durationDays} onChangeText={(v) => update('durationDays', v)} keyboardType="number-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Price USD *" value={form.priceUSD} onChangeText={(v) => update('priceUSD', v)} keyboardType="decimal-pad" placeholder="850" />
        </View>
      </View>

      <Input label="Destinations (comma separated)" value={form.destinations} onChangeText={(v) => update('destinations', v)} placeholder="Bwindi, Queen Elizabeth NP" />
      <Input label="Max Group Size" value={form.maxGroupSize} onChangeText={(v) => update('maxGroupSize', v)} keyboardType="number-pad" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, form.category === c && styles.chipActive]}
            onPress={() => update('category', c)}
          >
            <Text style={[styles.chipText, form.category === c && styles.chipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.chipRow}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, form.difficulty === d && styles.chipActive]}
            onPress={() => update('difficulty', d)}
          >
            <Text style={[styles.chipText, form.difficulty === d && styles.chipTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Highlights (one per line)</Text>
      <TextInput style={styles.textArea} value={form.highlights} onChangeText={(v) => update('highlights', v)} multiline placeholder="Gorilla tracking&#10;Community visit" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Includes (one per line)</Text>
      <TextInput style={styles.textArea} value={form.includes} onChangeText={(v) => update('includes', v)} multiline placeholder="Park fees&#10;Guide&#10;Meals" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Excludes (one per line)</Text>
      <TextInput style={styles.textArea} value={form.excludes} onChangeText={(v) => update('excludes', v)} multiline placeholder="International flights&#10;Visa" placeholderTextColor={Colors.textSecondary} />

      <Text style={styles.label}>Images (max 6) *</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImages}>
        <Text style={styles.imagePickerText}>+ Add Photos</Text>
      </TouchableOpacity>
      <View style={styles.imagePreviewRow}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.thumb} />
        ))}
      </View>

      <Button title="Publish Itinerary" onPress={handleSubmit} loading={loading} style={{ marginTop: Spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.primary },
  hint: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginBottom: Spacing.lg },
  label: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 8 },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: FontSizes.md,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: Spacing.md,
  },
  row: { flexDirection: 'row' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: FontSizes.xs, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.textLight },
  imagePicker: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: { color: Colors.primary, fontWeight: '700' },
  imagePreviewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: 72, height: 72, borderRadius: 8 },
});
