import { useEffect, useRef } from 'react';
import { useSwarmStore, Agent } from '../stores/swarmStore';

// Get WebSocket URL from environment or default to localhost
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/v1/ws/swarm';

export const useSwarmSocket = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const {
        updateAgentStatus,
        setAgents,
        addDisaster,
        addReport,
        setConnectionStatus,
    } = useSwarmStore();

    const connect = () => {
        try {
            console.log(`🔌 Connecting to WebSocket: ${WS_URL}`);
            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            // Connection events
            ws.onopen = () => {
                console.log('✅ WebSocket connected');
                setConnectionStatus(true);
            };

            ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                setConnectionStatus(false);

                // Attempt reconnection after 3 seconds
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log('🔄 Attempting to reconnect...');
                    connect();
                }, 3000);
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setConnectionStatus(false);
            };

            // Message handling
            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    switch (message.type) {
                        case 'swarm_status':
                            // Initial full state
                            console.log('📥 Received initial swarm status');
                            if (message.data?.agent_grid) {
                                // Flatten grid to agent array
                                const agents = message.data.agent_grid.flat();
                                setAgents(agents);
                            }
                            break;

                        case 'agent_status_batch':
                            // Batched updates every 2 seconds
                            if (message.data?.agents) {
                                const agents = Array.isArray(message.data.agents[0])
                                    ? message.data.agents.flat()
                                    : message.data.agents;
                                setAgents(agents);
                            }
                            break;

                        case 'agent_status':
                            // Single agent update
                            if (message.data?.id && message.data?.status) {
                                updateAgentStatus(message.data.id, message.data.status);
                            }
                            break;

                        case 'disaster_detected':
                            // New disaster event
                            console.log('🚨 Disaster detected:', message.data);
                            if (message.data) {
                                addDisaster(message.data);
                            }
                            break;

                        case 'new_report':
                            // New situation report
                            console.log('📝 New report generated');
                            if (message.data) {
                                addReport(message.data);
                            }
                            break;

                        case 'system':
                            // System notifications
                            console.log('💬 System:', message.message);
                            break;

                        default:
                            console.log('Unknown message type:', message.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
        } catch (error) {
            console.error('Error creating WebSocket:', error);
            setConnectionStatus(false);
        }
    };

    useEffect(() => {
        connect();

        // Cleanup
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return {
        socket: wsRef.current,
        send: (data: any) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify(data));
            } else {
                console.error('WebSocket is not connected');
            }
        },
    };
};
