# FreshSaver

FreshSaver is a modern web-based application designed to help users manage their food inventory efficiently by leveraging barcode scanning technology. Built with **React** for the frontend, **Firebase** for the backend, and styled using **Tailwind CSS**, FreshSaver aims to reduce food wastage and promote sustainable consumption through timely expiration date tracking and recipe suggestions.

## Features

- **Barcode Scanning:** Easily add food items to your inventory by scanning barcodes, making the process quick and hassle-free.
- **Expiration Date Tracking:** Automatically track the expiration dates of stored products, ensuring users are notified before their food goes bad.
- **Timely Alerts:** Receive timely alerts to remind you of products nearing their expiration date, helping to minimize waste.
- **Recipe Suggestions:** Discover recipes using ingredients that are close to expiring, encouraging sustainable consumption practices.
- **API Integration:** Utilizes the Open Food Facts API for product details and the Edamam API for providing relevant recipe suggestions.

## Tech Stack

### Frontend
- **React:** A popular JavaScript library for building dynamic and interactive user interfaces.
- **Tailwind CSS:** A utility-first CSS framework that enables quick and responsive UI design.

### Backend
- **Firebase:** A platform by Google that provides cloud-based services including authentication, real-time databases, and more.

## Installation

To run FreshSaver locally, follow the steps below:

### Prerequisites

- **Node.js**: Required for running the React frontend.
- **Firebase Account:** Set up a Firebase project for your application.

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YourUsername/FreshSaver.git

2. Navigate to the backend directory:
   ```bash
   
   cd FreshSaver

3. Create a .env file in the root directory of the project to store your Firebase credentials:
   ```bash
   
   touch .env
   
4. Add your Firebase configuration to the .env file:
   ```bash
   
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   
5. Install the required dependencies:
   ```bash
   
   npm install

6. Start the React development server:
   ```bash
   
   npm start

The application should now be running locally at [http://localhost:3000](http://localhost:3000)

## Usage

- **Add Products**: Scan barcodes or manually add products to keep track of your food inventory.
- **Track Expiration Dates**: Monitor your products and receive alerts before they expire.
- **Explore Recipes**: Use the recipe suggestion feature to find meals that utilize ingredients nearing expiration.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
