# stp-check-app

## Contributing

### Adding a New Test Tab

This guide explains how to add a new cognitive test to the app with its own tab.

#### 1. Create a New Test Screen

Create a new file in the `app/(tabs)/` directory with a descriptive name for your test. For example: `your-test-name.tsx`.

```tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function YourTestScreen() {
  // Set up your state variables
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // Implement your test logic here
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Your Test Name</Text>
        <Text style={styles.instructions}>
          Instructions for your test.
        </Text>
      </View>
      
      {/* Your test UI components */}
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
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

Once you're satisfied with your implementation, create a pull request with a clear description of your test and how it benefits users.