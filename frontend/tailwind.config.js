/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // EOC (Emergency Operations Center) Color Palette
                'eoc-bg': '#0a0e17',
                'eoc-surface': '#111827',
                'eoc-elevated': '#1f2937',

                // Agent Status Colors
                'agent-idle': '#6b7280',
                'agent-active': '#10b981',
                'agent-alert': '#ef4444',
                'agent-processing': '#3b82f6',

                // Disaster Type Colors
                'disaster-fire': '#dc2626',
                'disaster-flood': '#2563eb',
                'disaster-quake': '#f97316',

                // Text Colors
                'text-primary': '#f9fafb',
                'text-secondary': '#9ca3af',
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'Courier New', 'monospace'],
            },
        },
    },
    plugins: [],
}
