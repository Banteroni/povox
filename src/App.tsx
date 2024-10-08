// USE THIS AS A REFERENCE IN ORDER TO MAKE THE MPEG PLAYER WORK

/* import { useEffect, useRef, useState } from "react";
import Fetcher from "./utils/Fetcher";
import Album from "./models/Album";
import Track from "./models/Track";

function App() {
  const [albums, SetAlbums] = useState<Album[]>([]);
  const [tracks, SetTracks] = useState<Track[]>([]);
  const [fetcher, SetFetcher] = useState<null | Fetcher>(null);
  const [currentTrack, SetCurrentTrack] = useState<null | Track>(null);
  const [audioSrc, SetAudioSrc] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);



  useEffect(() => {
    async function fetchData() {
      if (!fetcher) {
        return;
      }
      const albums = await fetcher.getAlbums();
      const tempTracks: Track[] = [];
      for (const album of albums) {
        const coverArt = await fetcher.GetCoverArt(album.id);
        const url = URL.createObjectURL(new Blob([coverArt]));
        const albumTracks = await album.GetTracks(fetcher);
        tempTracks.push(...albumTracks);
        album.coverArt = url;
      }
      SetAlbums(albums);
      SetTracks(tempTracks);
    }
    if (fetcher) {
      fetchData();
    }
  }, [fetcher]);

  const play = async (track: Track) => {
    if (!fetcher) {
      return;
    }
    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }
    audioElement.pause(); // Stop the audio
    audioElement.src = ""; // Clear the source

    const reader = await fetcher.GetStream(track.id);
    const mediaSource = new MediaSource();

    audioElement.src = URL.createObjectURL(mediaSource);
    audioElement.controls = true;
    audioElement.autoplay = true;


    mediaSource.addEventListener('sourceopen', async () => {
      const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');

      const readNextChunk = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // Signal that we're done appending
          mediaSource.endOfStream();
          return;
        }

        // Wait until the buffer is ready to accept more data
        sourceBuffer.addEventListener('updateend', () => {
          readNextChunk(); // Read the next chunk
        }, { once: true });

        // Append the chunk to the source buffer
        sourceBuffer.appendBuffer(value);
      };

      readNextChunk(); // Start reading the first chunk
    });
  };


  return (
    <div className="container">

      <audio ref={audioRef} controls autoPlay>
      </audio>

      {albums.map((album) => (
        <div key={album.id} style={{ display: "flex" }}>
          <div>
            <h2>{album.album}</h2>
            <h3>{album.artist}</h3>
            <img src={album.coverArt} style={{ width: "120px", height: "120px" }} alt={album.title} />
          </div>
          <div>
            {tracks.filter((track) => track.albumId === album.id).map((track) => (
              <div key={track.id}>
                <h4>{track.title}</h4>
                <button onClick={() => play(track)}>play</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: "flex", position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "red", padding: "20px" }}>
        Ciao
      </div>
    </div>
  );
}

export default App;
 */