export default function AllLogsPlaceholder() {
    return (
        <div className="phlogs">
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
            <LogPlaceholder />
        </div>
    )
}

export function LogPlaceholder() {
    return <div className="phlog">
        <div className="phlogs__dp">
            <div className="ph-dp"></div>
        </div>
        <div className="phlog__content">
            <div className="ph-text-sm"></div>
            <div className="ph-text-lg"></div>
            <div className="ph-text-md"></div>
        </div>
    </div>
    
}
