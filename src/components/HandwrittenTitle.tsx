interface HandwrittenTitleProps {
    text: string
    as?: 'h1' | 'h2' | 'h3'
    className?: string
    theme?: 'pink' | 'blue'
}

export default function HandwrittenTitle({
    text,
    as: Tag = 'h1',
    className = '',
    theme = 'pink',
}: HandwrittenTitleProps) {
    const themeColor = theme === 'pink' ? 'text-pink-600' : 'text-blue-600'
    const sizeClass = Tag === 'h1' ? 'text-4xl md:text-5xl' : Tag === 'h2' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'

    return (
        <Tag className={`font-handwritten ${sizeClass} ${themeColor} ${className}`}>
            {text}
        </Tag>
    )
}
