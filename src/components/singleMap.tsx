import { useState } from "react";
import Link from "next/link";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { StringFilter } from "@prisma/client";

interface IToilet {
    id: string;
    latitude: number;
    longitude: number;
}

interface IProps {
    toilet: IToilet
    nearby: IToilet[];
}

export default function SingleMap({toilet, nearby}: IProps) {
    const [viewport, setViewport] = useState({
        latitude: toilet.latitude,
        longitude: toilet.longitude,
        zoom: 13,
    });

    return (
        <div className="text-black">
            <ReactMapGL
                {...viewport}
                width="100%"
                height="calc(100vh - 64px)"
                onViewportChange={(nextViewport) => setViewport(nextViewport)}
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
                mapStyle="mapbox://styles/sanjayk98/cl7kgsq4i004x14p4h2yowhmc"
                scrollZoom={false}
                minZoom={8}
            >
                <div className="absolute top-0 left-0 p-4">
                    <NavigationControl showCompass={false}/>
                </div>

                <Marker 
                    latitude={toilet.latitude}
                    longitude={toilet.longitude}
                    offsetLeft={-20}
                    offsetTop= {-20}
                >
                    <button type="button">
                        <img src="/toilet-color.svg" className="w-6" alt="selected toilet" />
                    </button>
                </Marker>

                {nearby.map(nearHouse => (
                <Marker 
                    key={nearHouse.id}
                    latitude={nearHouse.latitude}
                    longitude={nearHouse.longitude}
                    offsetLeft={-20}
                    offsetTop= {-20}  
                >
                    <Link href={`/toilets/${nearHouse.id}`}>
                        <a style={{width: "30px", height: "30px", fontSize: "30px"}}>
                            <img src="/toilet-solid.svg.svg" className="w-6" alt="nearby toilet" />
                        </a>
                    </Link>
                </Marker>
                ))}
            </ReactMapGL>
        </div>
    )
}