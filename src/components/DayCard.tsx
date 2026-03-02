'use client'

import { DayStatus } from '@/lib/types'

interface DayCardProps {
    day: number
    date: string
    status: DayStatus
    isClickable: boolean
    isFuture: boolean
    onClick?: () => void
}

export default function DayCard({ day, date, status, isClickable, isFuture, onClick }: DayCardProps) {
    const handleClick = () => {
        if (isClickable && !isFuture && onClick) {
            onClick()
        }
    }

    // Format date as "DD/MM"
    const formattedDate = (() => {
        const d = new Date(date + 'T00:00:00')
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        return `${dd}/${mm}`
    })()

    return (
        <div className="flex flex-col items-center gap-0.5">
            {/* Date label on top */}
            <span className="text-[9px] md:text-[10px] text-stone-400 font-medium leading-none select-none">
                {formattedDate}
            </span>
            {/* Day square — hand-drawn pen style */}
            <button
                onClick={handleClick}
                disabled={!isClickable || isFuture}
                className={`
          day-cell relative
          w-10 h-10 md:w-12 md:h-12
          flex items-center justify-center
          font-handwritten text-base md:text-lg
          rounded-[14px]
          transition-all duration-300
          select-none
          ${isFuture
                        ? 'day-cell-future cursor-default'
                        : status === 'pending'
                            ? 'day-cell-pending cursor-pointer'
                            : status === 'success'
                                ? 'day-cell-success'
                                : 'day-cell-fail'
                    }
        `}
                title={
                    isFuture
                        ? 'Dia futuro'
                        : status === 'pending'
                            ? `${formattedDate} — Clique para registrar`
                            : status === 'success'
                                ? `${formattedDate} — Sucesso! ✓`
                                : `${formattedDate} — Falha ✗`
                }
            >
                {/* Highlighter/crayon splash behind for success */}
                {status === 'success' && (
                    <span className="highlighter-splash highlighter-pink" />
                )}
                {/* Highlighter splash for fail */}
                {status === 'fail' && (
                    <span className="highlighter-splash highlighter-gray" />
                )}
                <span className="relative z-10">{day}</span>
            </button>
        </div>
    )
}
