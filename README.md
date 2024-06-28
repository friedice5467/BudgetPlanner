# Budget Planner Application

## Overview
The Budget Planner application is a tool designed to help individuals manage their finances efficiently. Built with React Native and integrated with Firebase for backend operations, this application allows users to set monthly budgets and track their spending against categorized allocations.

## Features

- **User Authentication**: Secure login and registration functionality using Firebase Authentication.
- **Budget Setup**: Users can create a base budget that outlines their expected monthly spending across three categories: Needs, Wants, and Savings.
- **Monthly Budget Tracking**: Automatic rollover of base allocations into specific monthly budgets, with the ability to adjust and add one-time expenses or savings.
- **Analytics**: Visual representation of spending habits over time with an integrated line chart, providing insights into financial trends and helping users adjust their budgets accordingly.
- **Responsive UI**: Clean and modern interface that provides an intuitive user experience across various devices and screen sizes.

## Technologies Used

- **Frontend**: React Native, React Native Paper (for UI components)
- **Backend**: Firebase (Authentication, Firestore for database management)
- **Data Visualization**: React Native Gifted Charts for rendering line charts

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What you need to install the software:

- Node.js
- npm or Yarn
- React Native CLI
- Android Studio or Xcode (for iOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/friedice5467/BudgetPlanner.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd budgetplanner
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the application**

   For Android:
   ```bash
   npx react-native run-android
   ```

   For iOS:
   ```bash
   npx react-native run-ios
   ```

## Usage

After launching the application, create an account to start setting up your monthly budget. Follow the on-screen instructions to allocate funds to Needs, Wants, and Savings. Use the analytics page to view your spending trends over time and adjust your budget accordingly.

## Images
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/f62f8848-03c7-41ec-a36b-bc2153e5b404)
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/0718c71b-530c-42c2-9897-cdbdc21db100)
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/128fc74e-ff37-4942-a4cd-506305e7b20f)
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/92b2478e-9467-4211-a4b5-bb7a7c79572e)
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/53befea9-bcc1-4fcb-9676-cdc0203ae374)
![image](https://github.com/friedice5467/BudgetPlanner/assets/58054670/7ee0ef9d-2377-4cb5-bb47-ed311809408f)

## License

Distributed under the MIT License. See `LICENSE` for more information.
