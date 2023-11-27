import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "./Map.css";
import {GOOGLE_MAPS_API_KEY} from "../../utils/Consts";

const Map = () => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });
    const center = useMemo(() =>
        ({ lat: 46.7513727200961, lng: 23.575738152828453 }), []);

    return (
        <div className="map">
            {!isLoaded ? (
                <h1>Loading...</h1>
            ) : (
                <GoogleMap
                    mapContainerClassName="map-container"
                    center={center}
                    zoom={18}
                >
                    <Marker
                        position={{ lat: 46.7513727200961, lng: 23.575738152828453 }}
                    />
                </GoogleMap>
            )}
        </div>
    );
};

export default Map;
//Change spaces into 2, not 4.