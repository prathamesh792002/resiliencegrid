import React, { useState } from 'react';

interface Report {
    id: string;
    title: string;
    content: string;
    timestamp: string;
}

export const AutoReportGenerator: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([
        {
            id: '1',
            title: 'Initial Swarm Status Report',
            content: `# Swarm Status Report

## Summary
ResilienceGrid Agent Swarm successfully initialized with 100 AI agents across 11 specialized categories.

## Agent Distribution
- **Social Media Agents (1-10)**: Monitoring Twitter, Facebook, Instagram
- **News Agents (11-20)**: Scanning Reuters, AP, BBC, local sources
- **Satellite Agents (21-30)**: Analyzing Sentinel, Landsat imagery
- **IoT Agents (31-40)**: Monitoring seismic, weather, water sensors
- **Classifier Agents (41-50)**: Triaging disaster reports
- **Resource Agents (51-60)**: Tracking supplies and personnel
- **Logistics Agents (61-70)**: Optimizing response routes
- **Predictor Agents (71-75)**: Modeling disaster spread
- **Dashboard Agents (76-85)**: Real-time UI updates
- **Reporter Agents (86-95)**: Generating situation reports
- **Alert Agents (96-100)**: Dispatching emergency notifications

## Current Status
- Total Agents: 100
- Active: 0
- Standby: 100
- System Mode: Ready for deployment

## Next Steps
1. Monitor for disaster signals
2. Deploy agents upon detection
3. Coordinate multi-agent response
`,
            timestamp: new Date().toISOString(),
        }
    ]);

    const [selectedReport, setSelectedReport] = useState<Report>(reports[0]);

    const generateReport = () => {
        const newReport: Report = {
            id: Date.now().toString(),
            title: `Auto Report - ${new Date().toLocaleString()}`,
            content: `# Automated Situation Report

Generated: ${new Date().toLocaleString()}

## Agent Activity
- Active Agents: Monitoring in progress
- Tasks Completed: Analysis ongoing
- Alerts Generated: 0

## Disaster Assessment
No active disasters detected.

## Resource Status
All resources on standby.
`,
            timestamp: new Date().toISOString(),
        };

        setReports([newReport, ...reports]);
        setSelectedReport(newReport);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Reports</h2>
                <button
                    onClick={generateReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
            text-sm font-semibold transition-colors"
                >
                    Generate Report
                </button>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Report List */}
                <div className="w-64 bg-gray-800 rounded-lg p-3 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Report History</h3>
                    <div className="space-y-2">
                        {reports.map((report) => (
                            <div
                                key={report.id}
                                className={`p-2 rounded cursor-pointer transition-colors ${selectedReport.id === report.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="text-xs font-semibold truncate">{report.title}</div>
                                <div className="text-xs opacity-75">
                                    {new Date(report.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Report Content */}
                <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                    <h3 className="text-xl font-bold text-white mb-1">{selectedReport.title}</h3>
                    <div className="text-xs text-gray-400 mb-4">
                        Generated: {new Date(selectedReport.timestamp).toLocaleString()}
                    </div>

                    <div className="markdown-report prose prose-invert max-w-none">
                        {selectedReport.content.split('\n').map((line, index) => {
                            if (line.startsWith('# ')) {
                                return <h1 key={index}>{line.substring(2)}</h1>;
                            } else if (line.startsWith('## ')) {
                                return <h2 key={index}>{line.substring(3)}</h2>;
                            } else if (line.startsWith('- ')) {
                                return <li key={index}>{line.substring(2)}</li>;
                            } else if (line.trim() === '') {
                                return <br key={index} />;
                            } else {
                                return <p key={index}>{line}</p>;
                            }
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
