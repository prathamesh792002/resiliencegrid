import AgentSwarmMonitor from './components/AgentSwarmMonitor';
import './index.css';

function App() {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr 380px',
            height: '100vh',
            gap: '16px',
            padding: '16px',
            background: '#0a0e17'
        }}>
            <AgentSwarmMonitor />
            <div style={{
                background: '#111827',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '24px',
                fontWeight: 'bold'
            }}>
                📍 Map Placeholder
            </div>
            <div style={{
                background: '#111827',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '24px',
                fontWeight: 'bold'
            }}>
                📊 Reports Placeholder
            </div>
        </div>
    );
}

export default App;
