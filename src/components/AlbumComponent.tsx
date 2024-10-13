
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Album from "../models/Album";
import { RouteToAlbum } from "../utils/RoutingUtils";


export default function AlbumComponent(props: {
    album: Album,
}) {
    const { album } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <div>
            <img src={album.coverArt} alt={album.album} className="mb-2 hover:scale-105 duration-300 cursor-pointer" onClick={() => RouteToAlbum(album, navigate, dispatch)} />
            <h2 className="m-0 text-lg">{album.album}</h2>
            <span>{album.artist}</span>
        </div>
    )
}