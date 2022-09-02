import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import { useLocalState } from "src/utils/useLocalState";
// import { HousesQuery_houses } from "src/generated/HousesQuery";
// import { SearchBox } from "./searchBox";

interface IProps {}

export default function Map({}: IProps) {
    //reference to the map
    const mapRef = useRef<ReactMapGL | null>(null);
    //initial states for MapBox updates
    const [viewport, setViewport] = useState<ViewState>({
        latitude: 1.3,
        longitude: 103.8,
        zoom: 12,
    });

    return (
        <div className="text-black relative">
            <ReactMapGL 
                {...viewport} 
                width= "100%" 
                height="100vh" 
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                onViewportChange={nextViewport => setViewport(nextViewport)}
                ref={(instance) => (mapRef.current = instance)}
                minZoom={12}
                maxZoom={17}
                mapStyle="mapbox://styles/sanjayk98/cl7kgsq4i004x14p4h2yowhmc"
            ></ReactMapGL>
        </div>
    );
}
