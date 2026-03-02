'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import { ptBR } from 'react-day-picker/locale'
import { Calendar } from 'lucide-react'

interface DatePickerProps {
    value: string
    onChange: (date: string) => void
    label?: string
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
    const [open, setOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
    const selected = value ? new Date(value + 'T00:00:00') : undefined

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPos({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
            })
        }
    }, [open])

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            const yyyy = date.getFullYear()
            const mm = String(date.getMonth() + 1).padStart(2, '0')
            const dd = String(date.getDate()).padStart(2, '0')
            onChange(`${yyyy}-${mm}-${dd}`)
            setOpen(false)
        }
    }

    const formattedDisplay = selected
        ? selected.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : 'Selecione uma data'

    return (
        <div className="relative">
            {label && (
                <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
                    <Calendar size={16} className="text-green-500" />
                    {label}
                </label>
            )}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white/50 text-stone-700 hover:border-green-400 transition-colors text-left"
            >
                <Calendar size={16} className="text-stone-400" />
                <span>{formattedDisplay}</span>
            </button>

            {open && typeof document !== 'undefined' && createPortal(
                <>
                    <div className="fixed inset-0 z-[999]" onClick={() => setOpen(false)} />
                    <div
                        className="absolute z-[1000] animate-slideUp"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    >
                        <div className="date-picker-card">
                            <DayPicker
                                mode="single"
                                selected={selected}
                                onSelect={handleSelect}
                                locale={ptBR}
                                showOutsideDays
                                classNames={{
                                    root: 'rdp-root',
                                    months: 'rdp-months',
                                    month: 'rdp-month',
                                    month_caption: 'rdp-caption',
                                    nav: 'rdp-nav',
                                    button_previous: 'rdp-nav-btn',
                                    button_next: 'rdp-nav-btn',
                                    month_grid: 'rdp-table',
                                    weekdays: 'rdp-head',
                                    weekday: 'rdp-weekday',
                                    weeks: 'rdp-body',
                                    week: 'rdp-row',
                                    day: 'rdp-day',
                                    day_button: 'rdp-day-btn',
                                    selected: 'rdp-selected',
                                    today: 'rdp-today',
                                    outside: 'rdp-outside',
                                }}
                            />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </div>
    )
}
