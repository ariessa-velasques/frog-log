interface HandwrittenTitleProps {
    text: string
    as?: 'h1' | 'h2' | 'h3'
    className?: string
    theme?: 'green' | 'blue'
}

export default function HandwrittenTitle({
    text,
    as: Tag = 'h1',
    className = '',
    theme = 'green',
}: HandwrittenTitleProps) {
    const themeColor = theme === 'green' ? 'text-green-700' : 'text-blue-600'
    const sizeClass = Tag === 'h1' ? 'text-4xl md:text-5xl' : Tag === 'h2' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'

    return (
        <Tag className={`font-handwritten ${sizeClass} ${themeColor} ${className}`}>
            {text}
        </Tag>
    )
}
