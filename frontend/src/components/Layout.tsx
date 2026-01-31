import React, { ReactNode } from 'react';
import { useSwarmStore } from '../stores/swarmStore';

interface LayoutProps {
    children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isConnected } = useSwarmStore();

    return (
        <div className="h-screen w-screen bg-eoc-bg overflow-hidden flex flex-col">
            {/* Header */}
            <header className="bg-eoc-surface border-b border-gray-800 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl">🛡️</div>
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary font-mono">
                                RESILIENCE<span className="text-cyan-400">GRID</span>
                            </h1>
                            <p className="text-xs text-text-secondary font-mono tracking-wider">
                                AI AGENT SWARM • DISASTER RESPONSE COORDINATION
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                    }`}
                            ></div>
                            <span className="text-xs font-mono text-text-secondary uppercase">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        {/* System Status */}
                        <div className="text-sm font-mono">
                            <span className="text-text-secondary">SYSTEM:</span>
                            <span className="ml-2 text-green-400 font-semibold">OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - 3 Panel Layout */}
            <main className="flex-1 overflow-hidden p-6">
                <div className="h-full grid grid-cols-[320px_1fr_380px] gap-4">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-eoc-surface border-t border-gray-800 px-6 py-2">
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
                    <div className="flex items-center gap-6">
                        <span>ResilienceGrid v0.1.0</span>
                        <span>100 AI Agents Deployed</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span>Last Update: {new Date().toLocaleTimeString()}</span>
                        <span className="text-cyan-400">SPACE: Pause | R: Refresh | CTRL+K: Commands</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
