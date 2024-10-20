
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RouteToArtist } from "../services/RoutingUtils";
import Artist from "../models/Artist";


export default function ArtistComponent(props: {
    artist: Artist,
}) {
    const { artist } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <div>
            <img src={artist.coverArt} alt={artist.name} className="mb-2 hover:scale-105 duration-300 cursor-pointer" onClick={() => RouteToArtist(artist, navigate, dispatch)} />
            <h2 className="m-0 text-lg">{artist.name}</h2>
        </div>
    )
}