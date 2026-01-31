import { create } from 'zustand';

export interface Agent {
    id: string;
    status: 'idle' | 'active' | 'alert' | 'processing';
    role?: string;
    lastPing?: string;
}

export interface Disaster {
    id: string;
    type: string;
    location: number[];
    severity: number;
    timestamp: string;
}

export interface Report {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    confidence: number;
}

interface SwarmState {
    agents: Agent[];
    disasters: Disaster[];
    reports: Report[];
    isConnected: boolean;
    setAgents: (agents: Agent[]) => void;
    setDisasters: (disasters: Disaster[]) => void;
    setReports: (reports: Report[]) => void;
    setConnected: (isConnected: boolean) => void;
}

const useSwarmStore = create<SwarmState>((set) => ({
    agents: [],
    disasters: [],
    reports: [],
    isConnected: false,
    setAgents: (agents) => set({ agents }),
    setDisasters: (disasters) => set({ disasters }),
    setReports: (reports) => set({ reports }),
    setConnected: (isConnected) => set({ isConnected }),
}));

export default useSwarmStore;
