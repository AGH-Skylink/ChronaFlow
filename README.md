# ChronaFlow

## App for measuring Subjective Time Perception

ChronaFlow is a simple web/mobile app for running short tests that measure how people feel and estimate time. You take quick tasks, get immediate feedback, and can track how your perception changes over time.

## Features

* Three test types targeting different aspects of subjective time perception
* History view for checking past scores
* CSV export for digging into your data
* Optional notes for adding context to specific test runs

## Available Tests

### Regularity Test

You tap every second, trying to stay as close as possible to a stable rhythm. Good for checking the consistency of your internal clock.

### Passive Test

You watch an object for a random amount of time, then guess how long it was shown using a slider.

### Active Test

You see an object for a random duration, then try to recreate that duration by holding a button.

## Installation

### Prerequisites

* Node.js 18+
* Yarn or npm

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/AGH-Skylink/chronaflow.git
   cd chronaflow
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

3. Start the app:

   ```sh
   npx expo start
   ```

4. Open it on your device:

   * Scan the QR code via Expo Go (Android) or Camera (iOS)
   * Or open it on your local network at port `8081`

## License

Licensed under MIT — see the LICENSE file.

© 2025 AGH Skylink. All rights reserved.
