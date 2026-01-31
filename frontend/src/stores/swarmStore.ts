import { create } from 'zustand';

const useSwarmStore = create((set) => ({
    agents: [],
    isConnected: false,
    setAgents: (agents) => set({ agents }),
    setConnected: (isConnected) => set({ isConnected }),
}));

export default useSwarmStore;
