# ChronaFlow

## Cognitive Assessment for Subjective Time Perception

ChronaFlow is a mobile application that provides a suite of cognitive assessment tools designed to measure Subjective Time Perception (STP). The app enables users to perform simple tests that measure different aspects of time perception and provides immediate feedback on performance.

## Features

- **Multiple Test Types**: Three different cognitive tests to assess various aspects of time perception
- **Results History**: View and analyze your performance history for each test
- **Data Export**: Export your test results as CSV files for further analysis
- **Note Taking**: Add notes to test results for tracking contextual information

## Available Tests

### Regularity Test
Test your ability to maintain a regular rhythm by tapping at consistent 1-second intervals. This measures your internal clock's stability.

### Passive Test
A visual exposure test where you observe an object for a random duration, then estimate how long it was displayed using a slider.

### Active Test
View an object for a random duration, then actively reproduce that same duration by holding down a button, testing your time perception accuracy.

## Installation

### Prerequisites
- Node.js (18.0 or later)
- Yarn or npm package manager

### Setup Instructions
1. Clone the repository:
   ```
   git clone https://github.com/AGH-Skylink/chronaflow.git
   cd chronaflow
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Start the application:
   ```
   npx expo start
   ```

4. Open on your device:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Alternatively, you can access it on your local network at the port `:8081`

## Project Structure

```
AATC_APP/
├── app/                   # Main application screens
│   ├── (tabs)/            # Tab screens (tests and home)
│   └── pages/             # Result pages
├── assets/                # Images and fonts
├── components/            # Reusable UI components
├── constants/             # Styles, colors, and other constants
└── utils/                 # Helper functions for tests and storage
```

## Contributing

### Adding a New Test Tab

This guide explains how to add a new cognitive test to the app with its own tab.

#### 1. Create a New Test Screen

Create a new file in the `app/(tabs)/` directory with a descriptive name for your test. For example: `your-test-name.tsx`.

```tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TestStyles } from "@/constants/TestStyles";

export default function YourTestScreen() {
  // Set up your state variables
  const [testStarted, setTestStarted] = useState(false);
  
  // Implement your test logic here
  
  return (
    <View style={testStyles.container}>
      <View style={testStyles.headerContainer}>
        <Text style={testStyles.header}>Your Test Name</Text>
        <Text style={testStyles.instructions}>
          Instructions for your test.
        </Text>
      </View>
      
      {/* Your test UI components */}
      <View styles={extraStyles.container}>
        {/*...*/}
      <View/>
      
      <StatusBar style="light" />
    </View>
  );
}

const extraStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 30,
    paddingTop: 50,
  },
  // Add your styles here
});
```

#### 2. Add the Tab to Navigation

Update the `app/(tabs)/_layout.tsx` file to include your new test screen:

```tsx
// In app/(tabs)/_layout.tsx
<Tabs.Screen
  name="your-test-name"
  options={{
    title: "Your Test",
    tabBarIcon: ({ color }) => (
      <TabBarIcon name="icon-name" color={color} />
    ),
  }}
/>
```

Choose an appropriate icon name from FontAwesome. Browse available icons at [icons.expo.fyi](https://icons.expo.fyi/).

#### 3. Add to Home Screen (Optional)

To add your test to the list on the home screen, update `app/(tabs)/index.tsx`:

```tsx
// In the TestCard section of the HomeScreen component
<TestCard
  title="Your Test Name"
  description="Description of what your test measures."
  icon="icon-name"
  onPress={() => router.push("/your-test-name")}
/>
```

#### 4. Create a Results Page

Create a new file in the `app/pages/` directory to display test results:

```tsx
// In app/pages/your-test-results.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function YourTestResultsScreen() {
  return (
    <View>
      <Text>Your Test Results</Text>
    </View>
  );
}
```

5. Register it in `app/_layout.tsx`:

```tsx
<Stack.Screen
  name="pages/your-test-results"
  options={{
    headerTitle: "Your Test Results",
    headerRight: () => <ExtraOptionsMenu />,
  }}
/>
```

6. Update `components/ExtraOptionMenu.tsx` to include your test in `getExportFunction()` and `getClearFunction()`.

Once you're satisfied with your implementation, create a pull request with a clear description of your test and how it benefits users.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

© 2025 AGH Skylink. All rights reserved.