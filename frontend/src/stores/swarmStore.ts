import { create } from 'zustand';

export interface Agent {
    id: string;
    role: string;
    status: 'idle' | 'active' | 'alert' | 'processing' | 'error';
    lastPing: number;
    task?: string;
}

export interface Disaster {
    id: string;
    type: 'fire' | 'flood' | 'earthquake' | 'other';
    location: { lat: number; lng: number };
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    affectedArea?: number;
}

export interface Report {
    id: string;
    title: string;
    content: string;
    timestamp: string;
    confidence: number;
    affectedArea?: string;
    critical?: boolean;
}

export interface SwarmState {
    agents: Agent[];
    isConnected: boolean;
    activeDisasters: Disaster[];
    reports: Report[];
    selectedAgent: Agent | null;

    // Statistics
    stats: {
        active: number;
        alerts: number;
        throughput: number;
    };

    // Actions
    updateAgentStatus: (id: string, status: Agent['status']) => void;
    setAgents: (agents: Agent[]) => void;
    activateSwarm: () => Promise<void>;
    addDisaster: (disaster: Disaster) => void;
    addReport: (report: Report) => void;
    setConnectionStatus: (connected: boolean) => void;
    setSelectedAgent: (agent: Agent | null) => void;
    updateStats: () => void;
}

export const useSwarmStore = create<SwarmState>((set, get) => ({
    agents: [],
    isConnected: false,
    activeDisasters: [],
    reports: [],
    selectedAgent: null,
    stats: {
        active: 0,
        alerts: 0,
        throughput: 0,
    },

    updateAgentStatus: (id: string, status: Agent['status']) => {
        set((state) => ({
            agents: state.agents.map((agent) =>
                agent.id === id ? { ...agent, status, lastPing: Date.now() } : agent
            ),
        }));
        get().updateStats();
    },

    setAgents: (agents: Agent[]) => {
        set({ agents });
        get().updateStats();
    },

    activateSwarm: async () => {
        try {
            const response = await fetch('/api/swarm/initialize', {
                method: 'POST',
            });
            const data = await response.json();
            console.log('Swarm activated:', data);

            // Generate initial 100 agents
            const initialAgents: Agent[] = Array.from({ length: 100 }, (_, i) => ({
                id: `A${String(i + 1).padStart(3, '0')}`,
                role: getAgentRole(i + 1),
                status: 'idle' as const,
                lastPing: Date.now(),
            }));

            get().setAgents(initialAgents);
        } catch (error) {
            console.error('Failed to activate swarm:', error);
        }
    },

    addDisaster: (disaster: Disaster) => {
        set((state) => ({
            activeDisasters: [...state.activeDisasters, disaster],
        }));
    },

    addReport: (report: Report) => {
        set((state) => ({
            reports: [report, ...state.reports],
        }));
    },

    setConnectionStatus: (connected: boolean) => {
        set({ isConnected: connected });
    },

    setSelectedAgent: (agent: Agent | null) => {
        set({ selectedAgent: agent });
    },

    updateStats: () => {
        const agents = get().agents;
        const active = agents.filter((a) => a.status === 'active').length;
        const alerts = agents.filter((a) => a.status === 'alert').length;
        const throughput = Math.random() * 2000 + 500; // Mock throughput

        set({ stats: { active, alerts, throughput } });
    },
}));

// Helper function to determine agent role
function getAgentRole(id: number): string {
    if (id <= 10) return 'Social Monitor';
    if (id <= 20) return 'News Scraper';
    if (id <= 30) return 'Satellite Analyzer';
    if (id <= 40) return 'IoT Sensor';
    if (id <= 50) return 'Classifier';
    if (id <= 60) return 'Resource Manager';
    if (id <= 70) return 'Logistics';
    if (id <= 75) return 'Predictor';
    if (id <= 85) return 'Dashboard';
    if (id <= 95) return 'Reporter';
    return 'Alert Dispatcher';
}
