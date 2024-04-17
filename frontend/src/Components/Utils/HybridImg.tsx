
type HybridImgProps = {
    src?: string,
    alt?: string,
    className?: string
}
export default function HybridImg(props: HybridImgProps) {
    return <>
        <img 
            src={props.src} 
            alt={props.alt} 
            className={"hybrid-img " + (props.className ?? "")} 
        />
    </>
}