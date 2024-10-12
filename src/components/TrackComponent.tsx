import { useState } from "react"
import Track from "../models/Track"
import { BsPlayFill } from "react-icons/bs"

type TrackProps = {
    track: Track,
    order: number,
    onClick: () => void,
    isPlaying: boolean
}


export default (props: TrackProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const minute = Math.floor(props.track.duration / 60)
    const second = props.track.duration % 60
    const duration = `${minute}:${second}`

    const track = props.track

    return <div className="flex bg-black/40 hover:bg-white/10 p-3 items-center gap-x-5 cursor-pointer duration-100" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={props.onClick}>
        <span className="w-2">{isHovered ? <BsPlayFill className="text-primary" /> : props.order + 1}</span>
        <div className="flex flex-col flex-1">
            <span className={props.isPlaying ? "text-primary" : "text-white"}>{track.title}</span>
            <span className="text-xs">{track.artist}</span>
        </div>
        <span>{duration}</span>
    </div>
}