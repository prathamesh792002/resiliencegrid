import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { useSwarmStore, Disaster } from '../stores/swarmStore';

export const DisasterMap: React.FC = () => {
    const { activeDisasters, addDisaster } = useSwarmStore();
    const [searchLocation, setSearchLocation] = useState('');
    const [disasterFilter, setDisasterFilter] = useState<'all' | 'fire' | 'flood' | 'earthquake'>('all');
    const [severityFilter, setSeverityFilter] = useState<number>(100);

    const defaultCenter: LatLngExpression = [37.0902, -95.7129]; // USA center

    const getSeverityColor = (severity: string): string => {
        const colors: Record<string, string> = {
            low: '#06b6d4',
            medium: '#f59e0b',
            high: '#f97316',
            critical: '#dc2626',
        };
        return colors[severity] || '#64748b';
    };

    const getDisasterColor = (type: string): string => {
        const colors: Record<string, string> = {
            fire: '#dc2626',
            flood: '#2563eb',
            earthquake: '#f97316',
        };
        return colors[type] || '#6b7280';
    };

    const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng;

        const newDisaster: Disaster = {
            id: `D${Date.now()}`,
            type: 'earthquake',
            location: { lat, lng },
            severity: 'high',
            timestamp: new Date().toISOString(),
            affectedArea: Math.random() * 100 + 20,
        };

        addDisaster(newDisaster);
    };

    const filteredDisasters = activeDisasters.filter((disaster) => {
        if (disasterFilter !== 'all' && disaster.type !== disasterFilter) return false;
        return true;
    });

    return (
        <div className="h-full flex flex-col bg-eoc-surface rounded-lg border border-gray-800">
            {/* Top Bar - Controls */}
            <div className="p-3 border-b border-gray-800 flex items-center gap-3">
                <h2 className="text-cyan-400 font-mono text-sm font-semibold uppercase tracking-wider">
                    Disaster Map
                </h2>

                <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Search location..."
                    className="flex-1 bg-eoc-elevated text-text-primary text-sm px-3 py-1.5 rounded 
            border border-gray-700 focus:outline-none focus:border-cyan-600 font-mono"
                />

                <select
                    value={disasterFilter}
                    onChange={(e) => setDisasterFilter(e.target.value as any)}
                    className="bg-eoc-elevated text-text-primary text-sm px-3 py-1.5 rounded 
            border border-gray-700 focus:outline-none focus:border-cyan-600 font-mono"
                >
                    <option value="all">All Types</option>
                    <option value="fire">🔥 Fire</option>
                    <option value="flood">🌊 Flood</option>
                    <option value="earthquake">🌍 Earthquake</option>
                </select>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
                <MapContainer
                    center={defaultCenter}
                    zoom={4}
                    className="h-full w-full"
                    style={{ background: '#0a0e17' }}
                    // @ts-ignore
                    onClick={handleMapClick}
                >
                    {/* Dark tile layer */}
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* Disaster markers */}
                    {filteredDisasters.map((disaster) => (
                        <React.Fragment key={disaster.id}>
                            <Circle
                                center={[disaster.location.lat, disaster.location.lng]}
                                radius={disaster.affectedArea ? disaster.affectedArea * 1000 : 50000}
                                pathOptions={{
                                    color: getDisasterColor(disaster.type),
                                    fillColor: getDisasterColor(disaster.type),
                                    fillOpacity: 0.2,
                                    weight: 2,
                                }}
                            />
                            <Marker position={[disaster.location.lat, disaster.location.lng]}>
                                <Popup>
                                    <div className="text-sm font-mono">
                                        <div className="font-bold text-base mb-1">
                                            {disaster.type.toUpperCase()}
                                        </div>
                                        <div>Severity: <span className="font-semibold" style={{ color: getSeverityColor(disaster.severity) }}>{disaster.severity}</span></div>
                                        <div>Area: {disaster.affectedArea?.toFixed(1)} km²</div>
                                        <div>Time: {new Date(disaster.timestamp).toLocaleTimeString()}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>

                {/* Mini Legend - Floating */}
                <div className="absolute top-4 right-4 bg-eoc-surface/95 rounded-lg border border-gray-800 p-3 backdrop-blur">
                    <div className="text-text-secondary text-xs font-mono font-semibold mb-2">Legend</div>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-disaster-fire rounded"></div>
                            <span className="text-text-secondary text-xs font-mono">Fire</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-disaster-flood rounded"></div>
                            <span className="text-text-secondary text-xs font-mono">Flood</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-disaster-quake rounded"></div>
                            <span className="text-text-secondary text-xs font-mono">Earthquake</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Info */}
            <div className="p-2 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
                <div className="text-text-secondary">
                    Click map to add disaster marker
                </div>
                <div className="text-text-secondary">
                    {filteredDisasters.length} active disaster{filteredDisasters.length !== 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};
