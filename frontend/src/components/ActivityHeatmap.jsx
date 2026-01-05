import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

export function ActivityHeatmap() {
    // Generate last 365 days
    const days = 365;
    const today = new Date();
    const data = Array.from({ length: days }).map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (days - 1 - i));

        // Mock activity intensity (0-4)
        // More activity towards the end (generating a "learning curve" visual)
        const randomFactor = Math.random();
        let intensity = 0;

        if (i > days - 30) { // Last 30 days more active
            intensity = randomFactor > 0.3 ? Math.floor(randomFactor * 5) : 0;
        } else if (i > days - 90) {
            intensity = randomFactor > 0.6 ? Math.floor(randomFactor * 4) : 0;
        } else {
            intensity = randomFactor > 0.85 ? Math.floor(randomFactor * 3) : 0;
        }

        return {
            date: date.toISOString().split('T')[0],
            intensity,
            dayOfWeek: date.getDay()
        };
    });

    const getIntensityColor = (intensity) => {
        switch (intensity) {
            case 0: return 'bg-white/5';
            case 1: return 'bg-primary/20';
            case 2: return 'bg-primary/40';
            case 3: return 'bg-primary/60';
            case 4: return 'bg-primary/90';
            default: return 'bg-white/5';
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="flex gap-1">
                    {/* Weeks as columns */}
                    {Array.from({ length: 53 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {Array.from({ length: 7 }).map((_, dayIndex) => {
                                const dataIndex = weekIndex * 7 + dayIndex;
                                const dayData = data[dataIndex] || { intensity: 0, date: '' };

                                if (dataIndex >= data.length) return null;

                                return (
                                    <motion.div
                                        key={dataIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: dataIndex * 0.001 }}
                                        className={`w-3 h-3 rounded-sm ${getIntensityColor(dayData.intensity)}`}
                                        data-tooltip-id="heatmap-tooltip"
                                        data-tooltip-content={`${dayData.date}: ${dayData.intensity} contributions`}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <Tooltip id="heatmap-tooltip" className="z-50 !bg-zinc-800 !opacity-100 !rounded-md !px-2 !py-1 !text-xs" />
        </div>
    );
}
