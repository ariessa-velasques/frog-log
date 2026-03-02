import { Rule } from '@/lib/types'
import { CheckCircle2, XCircle } from 'lucide-react'

interface RuleCardProps {
    title: string
    rules: Rule[]
    type: 'do' | 'dont'
}

export default function RuleCard({ title, rules, type }: RuleCardProps) {
    const borderColor = type === 'do' ? 'border-green-300' : 'border-red-300'
    const titleColor = type === 'do' ? 'text-green-700' : 'text-red-500'
    const bgColor = type === 'do' ? 'bg-green-50/60' : 'bg-red-50/60'
    const Icon = type === 'do' ? CheckCircle2 : XCircle
    const iconColor = type === 'do' ? 'text-green-500' : 'text-red-400'

    return (
        <div className={`${bgColor} border-2 border-dashed ${borderColor} rounded-lg p-4 transition-all duration-200 hover:shadow-sm`}>
            <h3 className={`font-handwritten text-xl ${titleColor} mb-3 flex items-center gap-2`}>
                <Icon size={20} className={iconColor} />
                {title}
            </h3>
            {rules.length === 0 ? (
                <p className="text-stone-400 text-sm italic">Nenhuma regra adicionada</p>
            ) : (
                <ul className="space-y-2">
                    {rules.map((rule) => (
                        <li key={rule.id} className="flex items-start gap-2 text-stone-600 text-sm">
                            <span className={`mt-1 ${type === 'do' ? 'text-green-500' : 'text-red-400'}`}>•</span>
                            <span>{rule.description}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
