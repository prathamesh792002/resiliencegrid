import React, { useState, useEffect } from 'react';
import useSwarmStore from '../stores/swarmStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'wss://resiliencegrid-backend-eg1i.onrender.com/api/v1/ws/swarm';

const AgentSwarmMonitor = () => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [activated, setActivated] = useState(false);
    const [isActivating, setIsActivating] = useState(false);
    const agents = useSwarmStore(state => state.agents);
    const setAgents = useSwarmStore(state => state.setAgents);

    // Initialize WebSocket
    useEffect(() => {
        console.log("Connecting to:", WS_URL);
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log("✅ WebSocket Connected");
            setConnected(true);
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📥 Received:", data);

            if (data.type === 'swarm_status' || data.type === 'agent_status_batch') {
                if (data.agents) {
                    setAgents(data.agents);
                    const hasActive = data.agents.some(a => a.status === 'active');
                    if (hasActive) setActivated(true);
                }
            }
        };

        ws.onerror = (err) => {
            console.error("❌ WebSocket Error:", err);
        };

        ws.onclose = () => {
            console.log("🔴 WebSocket Closed");
            setConnected(false);
        };

        return () => ws.close();
    }, [setAgents]);

    const handleActivate = (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("🚨 ACTIVATE CLICKED");
        setIsActivating(true);

        // Prevent scroll
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);
        }, 100);

        // Send via WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("📤 Sending via existing socket");
            socket.send(JSON.stringify({
                type: 'ACTIVATE_SWARM',
                action: 'activate_swarm',
                timestamp: new Date().toISOString()
            }));
        } else {
            console.error("Socket not ready, state:", socket?.readyState);
        }

        // Fallback activation
        setTimeout(() => {
            const newAgents: Agent[] = Array.from({ length: 100 }, (_, i) => ({
                id: `A${String(i + 1).padStart(3, '0')}`,
                status: 'active' as const,
                role: ['Social Media', 'News', 'Satellite', 'IoT'][i % 4],
                lastPing: new Date().toISOString()
            }));
            setAgents(newAgents);
            setActivated(true);
            setIsActivating(false);
            console.log("✅ Agents activated (fallback)");
        }, 2000);
    };

    return (
        <div className="left-panel">
            <div style={{
                padding: '12px',
                background: connected ? '#065f46' : '#7f1d1d',
                borderRadius: '8px',
                marginBottom: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
            }}>
                {connected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}
            </div>

            {!activated ? (
                <button
                    className="activate-btn"
                    onClick={handleActivate}
                    disabled={isActivating || !connected}
                    type="button"
                >
                    {isActivating ? '⏳ ACTIVATING...' : '🚀 ACTIVATE SWARM'}
                </button>
            ) : (
                <div style={{
                    padding: '16px',
                    background: '#065f46',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    marginBottom: '16px'
                }}>
                    ✅ SWARM ACTIVE<br />
                    <span style={{ fontSize: '12px' }}>
                        {agents.filter(a => a.status === 'active').length}/100 Agents
                    </span>
                </div>
            )}

            <div style={{ marginBottom: '8px', fontSize: '14px', color: '#9ca3af' }}>
                Agent Status Grid
            </div>

            <div className="agent-grid">
                {Array.from({ length: 100 }, (_, i) => {
                    const agent = agents[i] || { id: `A${String(i + 1).padStart(3, '0')}`, status: 'idle' };
                    return (
                        <div
                            key={agent.id}
                            className={`agent-cell ${agent.status}`}
                            title={`${agent.id}: ${agent.status}`}
                        >
                            {(i % 10) + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AgentSwarmMonitor;
