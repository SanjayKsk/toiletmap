import { useRef, useState } from "react";
import Link from "next/link";
import { Image } from "cloudinary-react";
import ReactMapGL, { Marker, Popup, ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useLocalState } from "src/utils/useLocalState";
import { ToiletsQuery_toilets } from "src/generated/ToiletsQuery";
import { SearchBox } from "./searchBox";

interface IProps {
    setDataBounds: (bounds: string) => void;
    toilets: ToiletsQuery_toilets[];
    highlightedId: string | null;
}

export default function Map({setDataBounds, toilets, highlightedId}: IProps) {
    const [selected, setSelected] = useState<ToiletsQuery_toilets | null>(null);
    //reference to the map
    const mapRef = useRef<ReactMapGL | null>(null);
    //initial states for MapBox updates
    const [viewport, setViewport] = useLocalState<ViewState>("viewport",{
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
                minZoom={11}
                maxZoom={17}
                mapStyle="mapbox://styles/sanjayk98/cl7kgsq4i004x14p4h2yowhmc"
                onLoad={() => {
                    if(mapRef.current){
                        const bounds = mapRef.current?.getMap().getBounds();
                        setDataBounds(JSON.stringify(bounds.toArray()));
                    }
                }}
                onInteractionStateChange={(extra) => {
                    if(!extra.isDragging && mapRef.current){
                        const bounds = mapRef.current.getMap().getBounds();
                        setDataBounds(JSON.stringify(bounds.toArray()));
                    }
                }}    
            >
                <div className="absolute top-0 w-full z-10 p-4">
                    <SearchBox 
                        defaultValue=""
                        onSelectAddress={(_address, latitude, longitude) => {
                            if(latitude && longitude){
                                setViewport(old => ({
                                    ...old,
                                    latitude,
                                    longitude,
                                    zoom: 13,
                                }));
                            }
                            if(mapRef.current){
                                const bounds = mapRef.current.getMap.getBounds();
                                setDataBounds(JSON.stringify(bounds.toArray()));
                            }
                        }
                    }
                    />
                </div>

                {toilets.map(toilet => (
                    <Marker 
                        key = {toilet.id} 
                        latitude={toilet.latitude} 
                        longitude={toilet.longitude}
                        offsetLeft={-20}
                        offsetTop={-20}
                        className={highlightedId === toilet.id ? "marker-active" : ""}
                    > 
                        <button style = {{width: "30px", height:"30px", fontSize: "30px"}}
                        type="button" onClick={() => setSelected(toilet)}>
                            <img src={highlightedId === toilet.id ? "/toilet-color.svg" : "toilet-solid.svg.svg"} alt="toilet" className="w-6"/>
                        </button>
                    </Marker>
                ))}

                {selected && (
                    <Popup latitude={selected.latitude} longitude={selected.longitude} onClose={() => setSelected(null)} closeOnClick={false}>
                        <div className="text-center">
                            <h3 className="px-4">{selected.address.substr(0.30)}</h3>
                            <Image 
                                className="mx-auto my-4"
                                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                                publicId={selected.publicId}
                                secure
                                dpr="auto"
                                quality="auto"
                                width={200}
                                height={Math.floor((9/16)*200)}
                                crop="fill"
                                gravity="auto"
                            />
                            <Link href={`/toilets/${selected.id}`}>
                                <a className="text-blue-500">View Details</a>
                            </Link>
                        </div>
                    </Popup>
                )}
            </ReactMapGL>
        </div>
    );
}
