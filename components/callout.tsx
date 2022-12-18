
type Props = {
    children: React.ReactNode
}

const Callout = ({ children }: Props) => {
    return (
        <div className="not-prose rounded-md px-8 py-4 bg-amber-100 shadow-sm">
            <p className="leading-relaxed font-serif italic tracking-tight">
                { children }
            </p>
        </div>
    )
}

export default Callout;