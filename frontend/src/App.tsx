import Layout from './components/Layout';
import AgentSwarmMonitor from './components/AgentSwarmMonitor';
import DisasterMap from './components/DisasterMap';
import AutoReportPanel from './components/AutoReportPanel';
import './index.css';

function App() {
    return (
        <Layout>
            <AgentSwarmMonitor />
            <div className="center-panel">
                <DisasterMap />
            </div>
            <div className="right-panel">
                <AutoReportPanel />
            </div>
        </Layout>
    );
}

export default App;
