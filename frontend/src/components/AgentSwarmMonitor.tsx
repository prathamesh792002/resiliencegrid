import React, { useEffect, useState, memo } from 'react';
import { useSwarmStore, Agent } from '../stores/swarmStore';
import { useSwarmSocket } from '../hooks/useSwarmSocket';

// Memoized agent cell component to prevent unnecessary re-renders
const AgentCell = memo(({ agent, onClick }: { agent: Agent; onClick: (agent: Agent) => void }) => {
    const getStatusColor = (status: Agent['status']) => {
        switch (status) {
            case 'active':
                return 'bg-agent-active';
            case 'alert':
                return 'bg-agent-alert';
            case 'processing':
                return 'bg-agent-processing';
            case 'error':
                return 'bg-red-600';
            case 'idle':
            default:
                return 'bg-agent-idle';
        }
    };

    return (
        <div
            className={`w-6 h-6 rounded-sm ${getStatusColor(agent.status)} cursor-pointer 
        transition-all duration-200 hover:scale-110 hover:shadow-lg 
        flex items-center justify-center text-[8px] font-mono text-white font-semibold`}
            onClick={() => onClick(agent)}
            title={`${agent.id} - ${agent.role} - ${agent.status}`}
        >
            {agent.id.replace('A', '')}
        </div>
    );
});

AgentCell.displayName = 'AgentCell';

type FilterType = 'all' | 'active' | 'alert' | 'processing';

export const AgentSwarmMonitor: React.FC = () => {
    const { agents, stats, setSelectedAgent, updateStats } = useSwarmStore();
    const { send, socket } = useSwarmSocket();
    const [filter, setFilter] = useState<FilterType>('all');
    const [isSwarmActivated, setIsSwarmActivated] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    useEffect(() => {
        // Update stats every 2 seconds
        const interval = setInterval(() => {
            updateStats();
        }, 2000);

        return () => clearInterval(interval);
    }, [updateStats]);

    const filteredAgents = agents.filter((agent) => {
        if (filter === 'all') return true;
        return agent.status === filter;
    });

    // Organize agents into 10x10 grid
    const gridAgents = Array.from({ length: 100 }, (_, i) => {
        const agent = agents.find((a) => a.id === `A${String(i + 1).padStart(3, '0')}`);
        return agent || {
            id: `A${String(i + 1).padStart(3, '0')}`,
            role: 'Offline',
            status: 'idle' as const,
            lastPing: 0,
        };
    });

    const handleAgentClick = (agent: Agent) => {
        setSelectedAgent(agent);
        // TODO: Open AgentDetailModal
        console.log('Agent clicked:', agent);
    };

    const handleActivateSwarm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        console.log('🚀 Sending activation command...');
        setIsActivating(true);

        // Send activation command with correct format
        send({
            action: 'activate_swarm',
            timestamp: new Date().toISOString()
        });

        // Update UI state
        setTimeout(() => {
            setIsSwarmActivated(true);
            setIsActivating(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    };

    return (
        <div className="h-full flex flex-col bg-eoc-surface rounded-lg border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="p-3 border-b border-gray-800">
                <h2 className="text-cyan-400 font-mono text-sm font-semibold uppercase tracking-wider">
                    Agent Swarm Monitor
                </h2>
            </div>

            {/* Activate Swarm Button */}
            {!isSwarmActivated && (
                <div className="p-3 border-b border-gray-800">
                    <button
                        type="button"
                        onClick={handleActivateSwarm}
                        disabled={isActivating}
                        className={`w-full font-mono font-bold py-3 px-4 rounded-lg transition-all text-sm uppercase tracking-wider shadow-lg ${isActivating
                            ? 'bg-yellow-600 cursor-wait'
                            : 'bg-green-600 hover:bg-green-700 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                            } text-white disabled:opacity-75`}
                    >
                        {isActivating ? '⏳ ACTIVATING...' : '🚀 ACTIVATE SWARM'}
                    </button>
                </div>
            )}

            {/* Stats & Filters */}
            <div className="p-3 border-b border-gray-800">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-eoc-elevated rounded p-2">
                        <div className="text-text-secondary text-xs font-mono">Active</div>
                        <div className="text-agent-active text-lg font-mono font-bold">
                            {stats.active}/100
                        </div>
                    </div>
                    <div className="bg-eoc-elevated rounded p-2">
                        <div className="text-text-secondary text-xs font-mono">Alerts</div>
                        <div className="text-agent-alert text-lg font-mono font-bold">{stats.alerts}</div>
                    </div>
                    <div className="bg-eoc-elevated rounded p-2">
                        <div className="text-text-secondary text-xs font-mono">Throughput</div>
                        <div className="text-text-primary text-lg font-mono font-bold">
                            {stats.throughput.toFixed(0)}
                            <span className="text-xs text-text-secondary ml-1">ops/m</span>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    {(['all', 'active', 'alert', 'processing'] as FilterType[]).map((filterType) => (
                        <button
                            key={filterType}
                            onClick={() => setFilter(filterType)}
                            className={`px-3 py-1 rounded text-xs font-mono uppercase transition-colors ${filter === filterType
                                ? 'bg-cyan-600 text-white'
                                : 'bg-eoc-elevated text-text-secondary hover:bg-gray-700'
                                }`}
                        >
                            {filterType}
                        </button>
                    ))}
                </div>
            </div>

            {/* Agent Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-10 gap-1.5">
                    {gridAgents.map((agent) => (
                        <AgentCell key={agent.id} agent={agent} onClick={handleAgentClick} />
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-text-secondary text-xs font-mono mb-2">Status Legend</div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-agent-idle rounded-sm"></div>
                        <span className="text-text-secondary">Idle</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-agent-active rounded-sm"></div>
                        <span className="text-text-secondary">Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-agent-processing rounded-sm"></div>
                        <span className="text-text-secondary">Processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-agent-alert rounded-sm"></div>
                        <span className="text-text-secondary">Alert</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
