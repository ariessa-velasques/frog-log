'use client'

import { DailyLog } from '@/lib/types'
import DayCard from './DayCard'
import { useEffect, useState } from 'react'

interface BoardGridProps {
    dailyLogs: DailyLog[]
    onDayClick: (log: DailyLog) => void
    columns?: number
}

function useWindowWidth() {
    const [width, setWidth] = useState(768)

    useEffect(() => {
        setWidth(window.innerWidth)
        const handleResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return width
}

export default function BoardGrid({ dailyLogs, onDayClick, columns = 8 }: BoardGridProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const windowWidth = useWindowWidth()
    const effectiveColumns = windowWidth < 640 ? 5 : columns

    // Split logs into rows and apply snake (boustrophedon) pattern
    const rows: DailyLog[][] = []
    for (let i = 0; i < dailyLogs.length; i += effectiveColumns) {
        const row = dailyLogs.slice(i, i + effectiveColumns)
        const rowIndex = Math.floor(i / effectiveColumns)
        rows.push(rowIndex % 2 === 1 ? [...row].reverse() : row)
    }

    return (
        // inline-flex makes the container width = widest child (first full row)
        // default items-stretch makes ALL children same width as container
        <div className="inline-flex flex-col gap-0">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex}>
                    {/* Vertical pen-stroke connector from previous row */}
                    {rowIndex > 0 && (
                        <div className="flex py-0">
                            <div
                                className={`pen-connector-v ${rowIndex % 2 === 1
                                    ? 'ml-auto mr-[16px] sm:mr-[18px] md:mr-[22px]'
                                    : 'mr-auto ml-[16px] sm:ml-[18px] md:ml-[22px]'
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
                                        <div className="pen-connector-h mb-[14px] sm:mb-[18px] md:mb-[22px]" />
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
