# Development Guide - MyHealth Tracker

This guide will help you set up and develop the MyHealth Tracker app in VS Code.

## 🔧 VS Code Setup

### Required Extensions

The project includes extension recommendations in `.vscode/extensions.json`. Install these for the best development experience:

1. **React Native Tools** - Debugging and IntelliSense for React Native
2. **ES7+ React/Redux/React-Native snippets** - Code snippets for faster development
3. **Prettier** - Code formatting
4. **Auto Rename Tag** - Automatically rename paired HTML/JSX tags
5. **Path Intellisense** - Autocomplete for file paths

### VS Code Settings

The project includes optimized settings in `.vscode/settings.json`:
- Auto-formatting on save
- ESLint integration
- Proper file associations for JSX
- Excluded folders for better performance

## 🚀 Quick Start in VS Code

1. **Open Project**: `File > Open Folder` and select the MyHealthTracker directory
2. **Install Extensions**: VS Code will prompt to install recommended extensions
3. **Open Terminal**: `Terminal > New Terminal` or `Ctrl+`` (backtick)
4. **Install Dependencies**: Run `npm install`
5. **Start Development**: Run `npm start`

## 🛠️ Development Workflow

### 1. Project Structure Overview

```
src/
├── contexts/           # Global state management
│   └── HealthContext.js
├── screens/           # Main app screens
│   ├── DashboardScreen.js
│   ├── WaterTrackerScreen.js
│   ├── StepTrackerScreen.js
│   ├── SleepTrackerScreen.js
│   ├── MedicationScreen.js
│   ├── AnalyticsScreen.js
│   └── SettingsScreen.js
├── components/        # Reusable UI components
└── utils/            # Helper functions
```

### 2. Code Snippets

Use these VS Code snippets for faster development:

- `rnfe` - React Native Functional Export Component
- `rnfs` - React Native Functional Component with Styles
- `imr` - Import React
- `imrn` - Import React Native components
- `ust` - useState hook
- `uef` - useEffect hook

### 3. Debugging

#### React Native Debugger
1. Press `Ctrl+Shift+P` and type "React Native: Start Packager"
2. Use the debug configurations in `.vscode/launch.json`
3. Set breakpoints by clicking in the gutter next to line numbers

#### Console Logging
```javascript
console.log('Debug message:', variable);
console.warn('Warning message');
console.error('Error message');
```

#### React DevTools
- Install React DevTools browser extension
- Access via Expo DevTools in browser

### 4. Hot Reloading

The app supports hot reloading:
- Save any file to see changes instantly
- Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS) for dev menu
- Press `R` twice to reload manually

## 📱 Testing

### 1. Running on Different Platforms

```bash
# Web (for quick testing)
npm run web

# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Physical Device (via Expo Go)
npm start
# Then scan QR code with device
```

### 2. Testing Features

#### Water Tracker
- Test quick-add buttons (250ml, 500ml, etc.)
- Test custom amount input
- Verify progress bar updates
- Check daily history display

#### Step Tracker
- Test step input validation
- Verify weekly chart display
- Check goal progress calculation

#### Sleep Tracker
- Test time picker functionality
- Verify duration calculation
- Test quality rating selection

#### Medications
- Test adding new medications
- Verify reminder functionality
- Test medication logging

### 3. Data Persistence Testing

- Add data and close/reopen app
- Verify data persists between sessions
- Test with different data types

## 🎨 UI/UX Development

### 1. Styling Guidelines

- Use consistent color scheme:
  - Primary: `#4A90E2` (blue)
  - Success: `#50C878` (green)
  - Warning: `#f39c12` (orange)
  - Danger: `#e74c3c` (red)
  - Purple: `#9B59B6`

- Follow spacing conventions:
  - Padding: 16px for containers, 12px for cards
  - Margins: 8px, 16px, 24px for different spacing needs
  - Border radius: 8px for buttons, 12px for cards

### 2. Component Development

Create reusable components:

```javascript
// Example: Custom Button Component
const CustomButton = ({ title, onPress, color = '#4A90E2' }) => (
  <TouchableOpacity 
    style={[styles.button, { backgroundColor: color }]} 
    onPress={onPress}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
```

### 3. Responsive Design

- Use Dimensions API for screen-aware layouts
- Test on different screen sizes
- Consider tablet layouts for larger screens

## 🔄 State Management

### Context API Usage

The app uses React Context for state management:

```javascript
// Using the health context
const { state, actions, computed } = useHealth();

// Adding data
actions.addWaterEntry(250);
actions.addStepEntry(5000);

// Getting computed values
const todayWater = computed.getTodayWater();
const weeklyData = computed.getWeeklyData('water');
```

### Adding New Data Types

1. Update `HealthContext.js`:
   - Add to initial state
   - Create action types
   - Add reducer cases
   - Create action creators
   - Add computed functions

2. Create UI components for the new data type
3. Update navigation if needed

## 📊 Analytics Development

### Chart Implementation

The app uses simple custom charts. To add new chart types:

1. Create chart component in `src/components/`
2. Use computed data from HealthContext
3. Implement responsive design
4. Add to Analytics screen

### Data Visualization Best Practices

- Use consistent colors for metrics
- Provide clear labels and legends
- Make charts touch-friendly
- Show loading states for data processing

## 🔧 Performance Optimization

### 1. React Native Performance

- Use `React.memo()` for expensive components
- Implement `useMemo()` and `useCallback()` for heavy computations
- Avoid inline functions in render methods
- Use FlatList for large data sets

### 2. Bundle Size Optimization

- Import only needed components from libraries
- Use tree shaking where possible
- Analyze bundle with `npx expo bundle-analyzer`

### 3. Memory Management

- Clean up timers and subscriptions in useEffect cleanup
- Avoid memory leaks with proper component unmounting
- Use lazy loading for heavy components

## 🐛 Common Issues & Solutions

### 1. Metro Bundler Issues

```bash
# Clear cache
npx expo start --clear

# Reset Metro cache
npx react-native start --reset-cache
```

### 2. Package Version Conflicts

```bash
# Fix Expo package versions
npx expo install --fix

# Check for outdated packages
npm outdated
```

### 3. iOS Simulator Issues

- Ensure Xcode is updated
- Reset simulator: Device > Erase All Content and Settings
- Check iOS version compatibility

### 4. Android Emulator Issues

- Verify Android Studio setup
- Check emulator configuration
- Ensure hardware acceleration is enabled

## 📚 Learning Resources

### React Native
- [Official Documentation](https://reactnative.dev/)
- [React Native Express](http://www.reactnativeexpress.com/)

### Expo
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Snack](https://snack.expo.dev/) - Online playground

### VS Code
- [VS Code React Native Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-react-native)
- [Debugging Guide](https://code.visualstudio.com/docs/nodejs/reactjs-tutorial)

## 🚀 Deployment

### Development Build

```bash
# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build

```bash
# Configure EAS
eas build:configure

# Build for stores
eas build --platform all
```

### Testing Builds

- Use TestFlight for iOS testing
- Use Google Play Console for Android testing
- Share builds with team members via EAS

## 📝 Code Style Guidelines

### 1. File Naming
- Components: PascalCase (e.g., `WaterTrackerScreen.js`)
- Utilities: camelCase (e.g., `dateHelpers.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### 2. Component Structure
```javascript
// Imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Component
export default function ComponentName() {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Event handlers
  const handlePress = () => {
    // Handler logic
  };
  
  // Render
  return (
    <View style={styles.container}>
      <Text>Content</Text>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### 3. Best Practices
- Use meaningful variable names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Add comments for complex logic
- Use TypeScript for larger projects

---

Happy coding! 🚀

