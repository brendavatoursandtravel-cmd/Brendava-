# Brendava Tours & Travel — Mobile App

Professional cross-platform mobile application for **Brendava Tours & Travel**  
Licensed Ugandan tour operator specialising in gorilla trekking and East Africa safaris.

**Website:** [www.brendavatoursandtravel.com](https://www.brendavatoursandtravel.com)

---

## Features

| Feature | Description |
|---------|-------------|
| **Account creation & login** | Firebase Authentication |
| **Role-based access** | Clients book • Operators upload itineraries |
| **Registration fields** | National ID, username, email, phone, location, country + UTB license (operators) |
| **Itinerary images** | Stored on **Cloudinary** |
| **Itinerary descriptions & bookings** | Stored on **Firebase Firestore** |
| **Bookings** | Clients request • Operators receive |
| **Terms, Privacy Policy & License** | Built-in legal pages |
| **Platforms** | Android, iOS, Web (PWA-ready) |

---

## Tech Stack

- **Expo SDK 51** + React Native + TypeScript
- **Firebase** (Auth + Firestore)
- **Cloudinary** (image uploads)
- **React Navigation** (native stack + bottom tabs)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/brendava-tours-app.git
cd brendava-tours-app
npm install
```

### 2. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password** authentication
3. Create a **Cloud Firestore** database
4. Copy your config into `src/services/firebase.ts`
5. Deploy the security rules in `firestore.rules`

### 3. Cloudinary setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Settings → Upload → create an **unsigned** upload preset named `brendava_itineraries`
3. Put your Cloud Name and preset into `src/services/cloudinary.ts`

### 4. Run

```bash
npx expo start
```

- Press `a` for Android emulator / device  
- Press `i` for iOS simulator  
- Press `w` for web browser  

### 5. Build production binaries

```bash
# Install EAS CLI
npm install -g eas-cli
eas login
eas build:configure

# Android APK / AAB
eas build --platform android

# iOS (requires Apple Developer account)
eas build --platform ios
```

---

## Project Structure

```
brendava-tours-app/
├── App.tsx
├── app.json
├── package.json
├── src/
│   ├── components/       # Button, Input
│   ├── constants/        # Theme colours & spacing
│   ├── hooks/            # useAuth
│   ├── navigation/       # Stack + Tabs
│   ├── screens/          # Login, Register, Home, Detail, Upload, Profile, Bookings, Terms
│   ├── services/         # firebase.ts, cloudinary.ts
│   └── types/            # TypeScript interfaces
├── firestore.rules
└── docs/
```

---

## Registration Requirements

### Clients
- Full name, username, email, password  
- National ID / Passport number  
- Phone, location, country  

### Operators (Tour Operators)
- All client fields  
- Company name & address  
- **UTB License Number** (e.g. `UTB/RTT/TO/2026/XXXXXX`)  
- License expiry date  

Operators who publish itineraries must hold a valid Uganda Tourism Board license.

---

## Legal

- **Terms & Conditions**, **Privacy Policy** and **Operator License** statements are included in the app (`TermsScreen`).
- Official licensed companies list: https://utb.go.ug/licensed-tour-companies/

---

## Contact

- Website: https://www.brendavatoursandtravel.com  
- Email: info@brendavatoursandtravel.com  
- WhatsApp: +256 762 584 996  

© 2026 Brendava Tours & Travel. All rights reserved.
