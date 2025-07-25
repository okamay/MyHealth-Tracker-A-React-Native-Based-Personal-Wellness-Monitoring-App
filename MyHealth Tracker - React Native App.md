# MyHealth Tracker - React Native App

A personal wellness monitoring mobile application built with React Native and Expo for tracking water intake, steps, sleep, and medications.

## 📱 Features

- **Water Tracking**: Log daily water intake with visual progress indicators and quick-add buttons
- **Step Counter**: Track daily steps with goal monitoring and weekly progress charts
- **Sleep Tracker**: Record sleep duration and quality ratings with sleep pattern analysis
- **Medication Manager**: Set up medication reminders and track adherence
- **Analytics Dashboard**: View weekly progress with interactive charts and goal completion tracking
- **Data Persistence**: All data stored locally using AsyncStorage for privacy
- **Responsive Design**: Optimized for mobile devices with intuitive navigation

## 🛠️ Technologies Used

- **React Native** - Cross-platform mobile development framework
- **Expo** - Development platform for React Native
- **React Navigation** - Navigation library for screen transitions
- **AsyncStorage** - Local data storage solution
- **Expo Vector Icons** - Icon library for UI elements
- **Context API** - State management solution

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **VS Code** (recommended IDE)

### Recommended VS Code Extensions

- React Native Tools
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

## 🚀 Getting Started

### 1. Clone or Extract the Project

If you received this as a zip file, extract it to your desired location.

### 2. Install Dependencies

Open terminal in VS Code and run:

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### 4. Run the App

You have several options to run the app:

#### Option A: Expo Go App (Recommended for testing)
1. Install Expo Go on your mobile device from App Store/Google Play
2. Scan the QR code with your device camera (iOS) or Expo Go app (Android)

#### Option B: Web Browser
1. Press `w` in the terminal to open in web browser
2. Note: Some mobile-specific features may not work perfectly in web

#### Option C: iOS Simulator (macOS only)
1. Press `i` in the terminal to open iOS simulator
2. Requires Xcode to be installed

#### Option D: Android Emulator
1. Press `a` in the terminal to open Android emulator
2. Requires Android Studio and emulator setup

## 📁 Project Structure

```
MyHealthTracker/
├── App.js                 # Main app component with navigation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── src/
│   ├── contexts/
│   │   └── HealthContext.js    # Global state management
│   ├── screens/
│   │   ├── DashboardScreen.js  # Main dashboard
│   │   ├── WaterTrackerScreen.js
│   │   ├── StepTrackerScreen.js
│   │   ├── SleepTrackerScreen.js
│   │   ├── MedicationScreen.js
│   │   ├── AnalyticsScreen.js
│   │   └── SettingsScreen.js
│   ├── components/        # Reusable UI components
│   └── utils/            # Helper functions
├── assets/               # Images and icons
└── README.md            # This file
```

## 🎯 How to Use the App

### Dashboard
- View daily progress for all health metrics
- Quick action buttons for logging activities
- Upcoming reminders display

### Water Tracker
- Use quick-add buttons (250ml, 500ml, 750ml, 1000ml)
- Enter custom amounts
- View daily progress and intake history

### Step Tracker
- Log daily steps manually
- View weekly progress charts
- Track estimated distance and calories

### Sleep Tracker
- Set bedtime and wake time
- Rate sleep quality (1-5 stars)
- View sleep patterns over time

### Medications
- Add medications with dosage and frequency
- Set reminder times
- Track medication adherence

### Analytics
- View weekly summaries for all metrics
- Interactive charts showing progress
- Goal completion tracking

### Settings
- Adjust daily goals for water, steps, and sleep
- Toggle notifications
- Export/import data (placeholder functionality)

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

### Making Changes

1. Open the project in VS Code
2. Edit files in the `src/` directory
3. The app will automatically reload when you save changes
4. Use the Expo development tools for debugging

### Adding New Features

1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update navigation in `App.js`
4. Modify state management in `src/contexts/HealthContext.js`

## 📊 Data Storage

The app uses AsyncStorage to store all data locally on the device:

- User preferences and goals
- Water intake entries
- Step count entries
- Sleep records
- Medication information and logs

Data persists between app sessions and is automatically saved when changes are made.

## 🎨 Customization

### Changing Colors
Edit the color values in the StyleSheet objects within each screen component.

### Modifying Goals
Default goals can be changed in the HealthContext.js file or through the Settings screen.

### Adding New Metrics
1. Update the HealthContext to include new data types
2. Create new screen components
3. Add navigation routes
4. Update the dashboard to display new metrics

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**: Clear cache with `npx expo start --clear`
2. **Package version conflicts**: Run `npx expo install --fix`
3. **iOS simulator not opening**: Ensure Xcode is installed and updated
4. **Android emulator issues**: Check Android Studio setup and emulator configuration

### Getting Help

- Check Expo documentation: https://docs.expo.dev/
- React Native documentation: https://reactnative.dev/docs/getting-started
- Stack Overflow for specific issues

## 📱 Testing on Physical Devices

### iOS
1. Install Expo Go from App Store
2. Ensure device and computer are on same WiFi network
3. Scan QR code with camera app

### Android
1. Install Expo Go from Google Play Store
2. Ensure device and computer are on same WiFi network
3. Scan QR code with Expo Go app

## 🚀 Building for Production

To build standalone apps:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 📄 License

This project is for educational and personal use. Feel free to modify and extend it for your needs.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## 📞 Support

For questions about this project, please refer to the documentation or create an issue in the project repository.

---

**Happy Health Tracking! 🏃‍♂️💧😴💊**

