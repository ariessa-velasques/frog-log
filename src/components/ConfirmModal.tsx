'use client'

import { Trash2, X } from 'lucide-react'

interface ConfirmModalProps {
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    title,
    message,
    confirmLabel = 'Excluir',
    cancelLabel = 'Cancelar',
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onCancel} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slideUp">
                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <Trash2 size={24} className="text-red-400" />
                    </div>
                </div>

                {/* Content */}
                <h3 className="font-handwritten text-2xl text-stone-700 text-center mb-2">
                    {title}
                </h3>
                <p className="text-sm text-stone-500 text-center mb-6">
                    {message}
                </p>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="py-3 px-4 bg-stone-100 text-stone-600 rounded-xl font-medium text-sm border border-stone-200 hover:bg-stone-200 transition-all duration-200"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:from-red-500 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Trash2 size={16} />
                                {confirmLabel}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
