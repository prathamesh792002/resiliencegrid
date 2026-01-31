import { useEffect } from 'react';
import { Layout } from './components/Layout';
import { AgentSwarmMonitor } from './components/AgentSwarmMonitor';
import { DisasterMap } from './components/DisasterMap';
import { AutoReportPanel } from './components/AutoReportPanel';
import { useSwarmStore } from './stores/swarmStore';
import { useSwarmSocket } from './hooks/useSwarmSocket';
import './styles/design-system.css';

function App() {
    const { updateStats } = useSwarmStore();

    // Initialize WebSocket connection
    const { send } = useSwarmSocket();

    useEffect(() => {
        // Send activate command via WebSocket after connection
        const timer = setTimeout(() => {
            console.log('🚀 Sending activate_swarm command');
            send({ action: 'activate_swarm' });
        }, 1000); // Wait 1 second for connection to establish

        // Update stats periodically
        const interval = setInterval(() => {
            updateStats();
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [updateStats, send]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Space: Pause/Resume swarm
            if (e.code === 'Space' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                console.log('⏸️ Toggle swarm pause (TODO: implement)');
            }

            // R: Force refresh all agents
            if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                console.log('🔄 Force refresh agents');
                send({ action: 'activate_swarm' });
            }

            // Ctrl+K: Command palette
            if (e.code === 'KeyK' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                console.log('⌘ Open command palette (TODO: implement)');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [send]);

    return (
        <Layout>
            {/* Left Panel - Agent Swarm Monitor (320px fixed) */}
            <AgentSwarmMonitor />

            {/* Center Panel - Disaster Map (fluid) */}
            <DisasterMap />

            {/* Right Panel - Auto Report Panel (380px fixed) */}
            <AutoReportPanel />
        </Layout>
    );
}

export default App;
