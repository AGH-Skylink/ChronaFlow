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

   ```sh
   git clone https://github.com/AGH-Skylink/chronaflow.git
   cd chronaflow
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

3. Start the application:

   ```sh
   npx expo start
   ```

4. Open on your device:
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Alternatively, you can access it on your local network at the port `:8081`

## Project Structure

```tree
AATC_APP/
├── app/                   # Main application screens
│   ├── (tabs)/            # Tab screens (tests and home)
│   └── pages/             # Result pages
├── assets/                # Images and fonts
├── components/            # Reusable UI components
├── constants/             # Styles, colors, and other constants
└── utils/                 # Helper functions for tests and storage
```

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

© 2025 AGH Skylink. All rights reserved.
