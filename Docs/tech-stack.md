# Mobile-First Tech Stack

This document defines the **mobile-first application stack** to be used for building native mobile apps. It includes frontend, backend, and supporting technologies.

---

## 1. Frontend Framework

* **React Native + Expo** (Managed Workflow)
* Supports both iOS and Android
* True native performance
* Access to device APIs

## 2. Styling

* **NativeWind** (utility-first styling for React Native)
* Class-like utilities for layout, spacing, colors, and typography
* No CSS or PostCSS required

## 3. UI Components

* `react-native-paper` for accessible and modular components
* `expo/vector-icons` for icons

## 4. Navigation

* **React Navigation**
* Stack, tab, and drawer navigation
* Deep linking support

## 5. State Management

* **Zustand** for global state
* AsyncStorage or SecureStore for persistence of critical data

## 6. Backend & Database

* **Node.js** (Express or Fastify) for backend services
* **MongoDB** as primary database
* REST or GraphQL APIs for mobile consumption
* Token-based authentication (JWT / refresh tokens)

## 7. Shared Logic

* API clients
* DTOs / schemas (Zod)
* Business rules
* Permissions and validation logic

## 8. Device Capabilities

* Camera, file system, sensors, and secure storage via **Expo APIs**

## 9. Builds & Deployment

* **Expo EAS** for cloud builds and OTA updates
* Environment separation: dev / staging / prod

## 10. Testing

* Jest for unit tests
* React Native Testing Library for component tests
* Manual device testing for native UX verification

---

> Use this stack as the standard for all mobile-first applications.
