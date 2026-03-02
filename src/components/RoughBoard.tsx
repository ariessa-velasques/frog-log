'use client'

import { useEffect, useRef, useState } from 'react'
import { DailyLog, DayStatus } from '@/lib/types'
import rough from 'roughjs'

interface RoughBoardProps {
    dailyLogs: DailyLog[]
    onDayClick: (log: DailyLog) => void
    columns?: number
}

const CELL_SIZE = 48
const CELL_GAP = 16
const DATE_HEIGHT = 16
const PADDING = 12

export default function RoughBoard({ dailyLogs, onDayClick, columns = 8 }: RoughBoardProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Build snake-pattern rows
    const rows: DailyLog[][] = []
    for (let i = 0; i < dailyLogs.length; i += columns) {
        const row = dailyLogs.slice(i, i + columns)
        const rowIndex = Math.floor(i / columns)
        rows.push(rowIndex % 2 === 1 ? [...row].reverse() : row)
    }

    const totalRows = rows.length
    const maxCols = columns
    const rowHeight = DATE_HEIGHT + CELL_SIZE + CELL_GAP
    const svgWidth = PADDING * 2 + maxCols * CELL_SIZE + (maxCols - 1) * CELL_GAP
    const svgHeight = PADDING * 2 + totalRows * rowHeight

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return

        // Clear previous drawings
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild)
        }

        const rc = rough.svg(svg)

        rows.forEach((row, rowIndex) => {
            row.forEach((log, colIndex) => {
                const x = PADDING + colIndex * (CELL_SIZE + CELL_GAP)
                const y = PADDING + rowIndex * rowHeight + DATE_HEIGHT

                // Draw connector to next cell in row
                if (colIndex < row.length - 1) {
                    const lineNode = rc.line(
                        x + CELL_SIZE + 2,
                        y + CELL_SIZE / 2,
                        x + CELL_SIZE + CELL_GAP - 2,
                        y + CELL_SIZE / 2,
                        { stroke: '#2a2520', strokeWidth: 2, roughness: 1.2 }
                    )
                    svg.appendChild(lineNode)
                }
            })

            // Draw vertical connector between rows
            if (rowIndex < rows.length - 1) {
                const isEvenRow = rowIndex % 2 === 0
                const connX = isEvenRow
                    ? PADDING + (row.length - 1) * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2
                    : PADDING + CELL_SIZE / 2
                const connY1 = PADDING + rowIndex * rowHeight + DATE_HEIGHT + CELL_SIZE + 2
                const connY2 = PADDING + (rowIndex + 1) * rowHeight + DATE_HEIGHT - 2

                const vLine = rc.line(connX, connY1, connX, connY2, {
                    stroke: '#2a2520',
                    strokeWidth: 2,
                    roughness: 1.2,
                })
                svg.appendChild(vLine)
            }
        })

        // Draw cells (on top of connectors)
        rows.forEach((row, rowIndex) => {
            row.forEach((log, colIndex) => {
                const x = PADDING + colIndex * (CELL_SIZE + CELL_GAP)
                const y = PADDING + rowIndex * rowHeight + DATE_HEIGHT
                const logDate = new Date(log.log_date + 'T00:00:00')
                const isFuture = logDate > today

                // Highlighter splash for success/fail
                if (log.status === 'success') {
                    const splash = rc.ellipse(
                        x + CELL_SIZE / 2,
                        y + CELL_SIZE / 2,
                        CELL_SIZE + 16,
                        CELL_SIZE + 12,
                        {
                            fill: 'rgba(244, 143, 177, 0.45)',
                            fillStyle: 'solid',
                            stroke: 'none',
                            roughness: 2.5,
                        }
                    )
                    svg.appendChild(splash)
                } else if (log.status === 'fail') {
                    const splash = rc.ellipse(
                        x + CELL_SIZE / 2,
                        y + CELL_SIZE / 2,
                        CELL_SIZE + 14,
                        CELL_SIZE + 10,
                        {
                            fill: 'rgba(168, 162, 158, 0.35)',
                            fillStyle: 'solid',
                            stroke: 'none',
                            roughness: 2.5,
                        }
                    )
                    svg.appendChild(splash)
                }

                // Draw the rounded rectangle
                const rect = rc.rectangle(x, y, CELL_SIZE, CELL_SIZE, {
                    stroke: isFuture ? '#b8b3ab' : '#2a2520',
                    strokeWidth: isFuture ? 1.5 : 2.5,
                    roughness: 1.2,
                    fill: 'rgba(255, 255, 255, 0.6)',
                    fillStyle: 'solid',
                    bowing: 1,
                })
                svg.appendChild(rect)
            })
        })
    }, [dailyLogs, rows, totalRows])

    // Format date as DD/MM
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr + 'T00:00:00')
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    return (
        <div className="relative overflow-x-auto">
            <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
                {/* Rough.js SVG layer */}
                <svg
                    ref={svgRef}
                    width={svgWidth}
                    height={svgHeight}
                    className="absolute inset-0"
                />

                {/* Interactive overlay layer (dates + clickable numbers) */}
                {rows.map((row, rowIndex) =>
                    row.map((log, colIndex) => {
                        const x = PADDING + colIndex * (CELL_SIZE + CELL_GAP)
                        const y = PADDING + rowIndex * rowHeight
                        const logDate = new Date(log.log_date + 'T00:00:00')
                        const isFuture = logDate > today
                        const flatIndex = rowIndex * columns + colIndex
                        const isHovered = hoveredIndex === flatIndex

                        return (
                            <div
                                key={log.id}
                                className="absolute flex flex-col items-center"
                                style={{ left: x, top: y, width: CELL_SIZE }}
                            >
                                {/* Date label */}
                                <span
                                    className="text-[9px] text-stone-400 font-medium leading-none select-none"
                                    style={{ height: DATE_HEIGHT, display: 'flex', alignItems: 'center' }}
                                >
                                    {formatDate(log.log_date)}
                                </span>

                                {/* Clickable area over the rough rectangle */}
                                <button
                                    onClick={() => {
                                        if (!isFuture) onDayClick(log)
                                    }}
                                    onMouseEnter={() => setHoveredIndex(flatIndex)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    disabled={isFuture}
                                    className={`
                    flex items-center justify-center
                    font-handwritten text-base
                    select-none transition-transform duration-150
                    ${isFuture ? 'cursor-default text-stone-300' : 'cursor-pointer text-stone-800'}
                    ${!isFuture && isHovered ? 'scale-110' : ''}
                    ${log.status === 'success' ? 'text-pink-700 font-bold' : ''}
                    ${log.status === 'fail' ? 'text-stone-400' : ''}
                  `}
                                    style={{ width: CELL_SIZE, height: CELL_SIZE }}
                                    title={
                                        isFuture
                                            ? 'Dia futuro'
                                            : log.status === 'pending'
                                                ? `${formatDate(log.log_date)} — Clique para registrar`
                                                : log.status === 'success'
                                                    ? `${formatDate(log.log_date)} — Sucesso! ✓`
                                                    : `${formatDate(log.log_date)} — Falha ✗`
                                    }
                                >
                                    {log.day_number}
                                </button>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
