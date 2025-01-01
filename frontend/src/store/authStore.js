import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    user: null,
    loading: true, // New loading state
    login: (user) => set({ isAuthenticated: true, user, loading: false }),
    logout: () => set({ isAuthenticated: false, user: null, loading: false }),
    setLoading: (isLoading) => set({ loading: isLoading }),
}));

export default useAuthStore;
