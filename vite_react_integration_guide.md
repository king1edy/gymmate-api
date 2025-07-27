# Vite React Frontend Integration Guide with Central State Management

This guide provides instructions to integrate a Vite React frontend with the GymMate NestJS backend, including authentication and central state management.

## 1. Create Vite React Project

```bash
npm create vite@latest gymmate-frontend -- --template react
cd gymmate-frontend
npm install
```

## 2. Install Dependencies

For state management and API calls:

```bash
npm install axios react-router-dom
npm install zustand
```

*(Alternatively, you can use Redux Toolkit instead of Zustand.)*

## 3. Setup Central State Management (Zustand example)

Create a store (e.g., `src/store/authStore.js`):

```javascript
import create from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore;
```

## 4. Authentication Integration

- Use Axios to call NestJS backend `/auth/login` and `/auth/register` endpoints.
- Store JWT token and user info in the central store.
- Attach JWT token in Axios headers for authenticated requests.

Example Axios setup:

```javascript
import axios from 'axios';
import useAuthStore from './store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Adjust as needed
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## 5. Routing and Protected Routes

- Use `react-router-dom` for routing.
- Create protected route components that check auth state from the store.

## 6. Connect to Backend API

- Use the `api` Axios instance to call backend endpoints.
- Handle token expiration and refresh if implemented.

## 7. Running the Frontend

```bash
npm run dev
```

---

This guide provides a basic setup. You can extend it with features like token refresh, error handling, and UI components.
