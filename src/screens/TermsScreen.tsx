import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/theme';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 60 }}>
      <Text style={styles.mainTitle}>Terms, Policies & License</Text>
      <Text style={styles.updated}>Last updated: October 2026</Text>

      {/* ─── TERMS ─── */}
      <Section title="1. Terms & Conditions">
        <P>
          Welcome to the Brendava Tours & Travel mobile application (“App”), operated by Brendava Tours & Travel,
          a licensed tour operator registered in Uganda and regulated by the Uganda Tourism Board (UTB).
        </P>
        <P>
          By creating an account or using this App you agree to these Terms & Conditions. If you do not agree,
          please do not use the App.
        </P>
        <H>1.1 Accounts</H>
        <P>
          You must provide accurate information when registering, including full name, national ID or passport number,
          valid email, phone number, location and country. Operators must also supply a valid UTB license number and
          company details. You are responsible for safeguarding your login credentials.
        </P>
        <H>1.2 Roles</H>
        <P>
          • Clients may browse published itineraries and submit booking requests.{'\n'}
          • Operators may upload, edit and manage itineraries and receive booking requests.{'\n'}
          • Brendava Tours & Travel reserves the right to verify operator licenses and suspend accounts that
          misrepresent licensing status.
        </P>
        <H>1.3 Bookings</H>
        <P>
          A booking request is not a confirmed reservation until the operator accepts it and payment arrangements
          are completed outside or inside the App according to the operator’s instructions. Prices shown are indicative
          and may change. Park fees, gorilla permits and government taxes are subject to official rates.
        </P>
        <H>1.4 Cancellations & Refunds</H>
        <P>
          Cancellation and refund policies are determined by the individual operator and the relevant park authorities.
          Gorilla permits are generally non-refundable once issued. Contact the operator directly for specific terms.
        </P>
        <H>1.5 Acceptable Use</H>
        <P>
          You may not upload false, misleading or illegal content, harass other users, attempt to circumvent security,
          or use the App for any purpose other than legitimate travel planning and booking.
        </P>
      </Section>

      {/* ─── PRIVACY ─── */}
      <Section title="2. Privacy Policy">
        <P>
          We collect personal data necessary to provide our services: name, email, phone, national ID, location,
          country, UTB license details (for operators), and booking information.
        </P>
        <H>2.1 How we use data</H>
        <P>
          • Authenticate users and manage accounts (Firebase Authentication).{'\n'}
          • Store itinerary descriptions and bookings (Cloud Firestore).{'\n'}
          • Store itinerary images (Cloudinary).{'\n'}
          • Communicate booking status and service updates.{'\n'}
          • Comply with Ugandan law and UTB licensing requirements.
        </P>
        <H>2.2 Sharing</H>
        <P>
          Booking details are shared with the relevant operator so they can fulfil the request.
          We do not sell personal data to third parties. Service providers (Firebase, Cloudinary) process data
          under their respective privacy policies and data-processing agreements.
        </P>
        <H>2.3 Security & Retention</H>
        <P>
          Data is stored on secure cloud infrastructure. You may request access, correction or deletion of your
          personal data by contacting us at info@brendavatoursandtravel.com. We retain data as long as your account
          is active or as required by law.
        </P>
      </Section>

      {/* ─── LICENSE ─── */}
      <Section title="3. Operator License & Compliance">
        <P>
          Brendava Tours & Travel is a licensed Ugandan tour operator under the Uganda Tourism Board (UTB).
          All operators who publish itineraries on this App must hold a valid UTB Tour Operator or Travel Agency
          license and keep it current.
        </P>
        <P>
          Operating without a valid UTB license is illegal under Ugandan tourism regulations.
          Brendava Tours & Travel and the App administrators reserve the right to remove itineraries and suspend
          accounts of unlicensed or suspended operators.
        </P>
        <P>
          For the official list of licensed companies visit:{'\n'}
          https://utb.go.ug/licensed-tour-companies/
        </P>
        <P>
          Company website: https://www.brendavatoursandtravel.com{'\n'}
          Email: info@brendavatoursandtravel.com / brendavatoursandtravel@gmail.com{'\n'}
          Phone / WhatsApp: +256 762 584 996
        </P>
      </Section>

      {/* ─── DISCLAIMER ─── */}
      <Section title="4. Disclaimer">
        <P>
          Travel involves inherent risks. Brendava Tours & Travel and the App act as a platform connecting clients
          and licensed operators. We are not liable for acts or omissions of third-party operators, park authorities,
          transport providers or force-majeure events. Always follow the advice of your operator and local guides.
        </P>
      </Section>

      <Text style={styles.footer}>
        © 2026 Brendava Tours & Travel. All rights reserved.{'\n'}
        Licensed Ugandan Operator • Uganda • Rwanda • Kenya • Tanzania
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <Text style={styles.h}>{children}</Text>;
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={styles.p}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  mainTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.primary },
  updated: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginBottom: Spacing.lg },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary, marginBottom: Spacing.sm },
  h: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.text, marginTop: Spacing.md, marginBottom: 4 },
  p: { fontSize: FontSizes.sm, color: Colors.text, lineHeight: 22, marginBottom: 8 },
  footer: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
});
