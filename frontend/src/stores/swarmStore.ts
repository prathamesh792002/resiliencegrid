import { create } from 'zustand';

export interface Agent {
    id: string;
    status: 'idle' | 'active' | 'alert' | 'processing';
    role?: string;
    lastPing?: string;
}

export interface SwarmState {
    agents: Agent[];
    isConnected: boolean;
    setAgents: (agents: Agent[]) => void;
    setConnected: (isConnected: boolean) => void;
}

const useSwarmStore = create<SwarmState>((set) => ({
    agents: [],
    isConnected: false,
    setAgents: (agents) => set({ agents }),
    setConnected: (isConnected) => set({ isConnected }),
}));

export default useSwarmStore;
