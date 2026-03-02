'use client'

import { DailyLog } from '@/lib/types'
import DayCard from './DayCard'

interface BoardGridProps {
    dailyLogs: DailyLog[]
    onDayClick: (log: DailyLog) => void
    columns?: number
}

export default function BoardGrid({ dailyLogs, onDayClick, columns = 8 }: BoardGridProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Split logs into rows and apply snake (boustrophedon) pattern
    const rows: DailyLog[][] = []
    for (let i = 0; i < dailyLogs.length; i += columns) {
        const row = dailyLogs.slice(i, i + columns)
        const rowIndex = Math.floor(i / columns)
        rows.push(rowIndex % 2 === 1 ? [...row].reverse() : row)
    }

    return (
        <div className="flex flex-col items-center gap-0">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {/* Vertical pen-stroke connector from previous row */}
                    {rowIndex > 0 && (
                        <div className="flex py-0">
                            <div
                                className={`pen-connector-v ${rowIndex % 2 === 1
                                        ? 'ml-auto mr-[18px] md:mr-[22px]'
                                        : 'mr-auto ml-[18px] md:ml-[22px]'
                                    }`}
                            />
                        </div>
                    )}

                    {/* Row of days with horizontal pen-stroke connectors */}
                    <div className="flex items-end gap-0">
                        {row.map((log, colIndex) => {
                            const logDate = new Date(log.log_date + 'T00:00:00')
                            const isFuture = logDate > today

                            return (
                                <div key={log.id} className="flex items-end">
                                    <DayCard
                                        day={log.day_number}
                                        date={log.log_date}
                                        status={log.status}
                                        isClickable={!isFuture}
                                        isFuture={isFuture}
                                        onClick={() => onDayClick(log)}
                                    />
                                    {/* Horizontal pen-stroke connector */}
                                    {colIndex < row.length - 1 && (
                                        <div className="pen-connector-h mb-[18px] md:mb-[22px]" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
