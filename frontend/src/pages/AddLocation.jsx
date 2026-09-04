import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FiArrowLeft,
    FiSearch,
    FiMapPin,
    FiX
} from "react-icons/fi";

const LOCATION_DRAFT_KEY =
    "instagram_createpost_selected_location";

function AddLocation() {

    const navigate = useNavigate();

    const routeLocation = useLocation();

    const returnTo =
        routeLocation.state &&
        routeLocation.state.returnTo
            ? routeLocation.state.returnTo
            : "/createpost";

    const apiKey =
        import.meta.env.VITE_GEOAPIFY_API_KEY;

    const [search, setSearch] =
        useState("");

    const [locations, setLocations] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(function () {
        if (!search.trim()) {
            setLocations([]);
            setError("");
            setLoading(false);
            return;
        }

        if (!apiKey) {
            setError(
                "Geoapify API key not found"
            );
            setLocations([]);
            setLoading(false);
            return;
        }

        const controller =
            new AbortController();

        const timer =
            setTimeout(function () {

                setLoading(true);
                setError("");

                const searchUrl =
                    "https://api.geoapify.com/v1/geocode/autocomplete"
                    + "?text="
                    + encodeURIComponent(
                        search.trim()
                    )
                    + "&format=json"
                    + "&limit=8"
                    + "&lang=en"
                    + "&filter=countrycode:in"
                    + "&apiKey="
                    + apiKey;

                fetch(
                    searchUrl,
                    {
                        signal:
                            controller.signal
                    }
                )
                    .then(function (response) {
                        if (!response.ok) {
                            throw new Error(
                                "Location search failed"
                            );
                        }

                        return response.json();
                    })
                    .then(function (data) {

                        console.log(
                            "REAL GEOAPIFY RESULTS:",
                            data
                        );

                        const results =
                            data.results || [];

                        const formattedResults =
                            results.map(
                                function (place) {
                                    return {
                                        id:
                                            place.place_id,

                                        name:
                                            place.name ||
                                            place.city ||
                                            place.suburb ||
                                            place.district ||
                                            "Unknown location",

                                        subtitle:
                                            place.formatted ||
                                            "",

                                        lat:
                                            place.lat,

                                        lon:
                                            place.lon
                                    };
                                }
                            );

                        setLocations(
                            formattedResults
                        );

                        setLoading(false);
                    })
                    .catch(function (error) {

                        if (
                            error.name ===
                            "AbortError"
                        ) {
                            return;
                        }

                        console.error(
                            "GEOAPIFY LOCATION API ERROR:",
                            error
                        );

                        setError(
                            error.message ||
                            "Location search failed"
                        );

                        setLocations([]);
                        setLoading(false);
                    });

            }, 500);

        return function () {
            clearTimeout(timer);
            controller.abort();
        };

    }, [search, apiKey]);

    function handleSelectLocation(location) {

        const previousState =
            routeLocation.state || {};

        console.log(
            "SELECTED LOCATION:",
            location
        );

        console.log(
            "PREVIOUS EDIT STATE:",
            previousState
        );

        // Save the selected location immediately.
        // This survives a browser refresh.
        try {
            localStorage.setItem(
                LOCATION_DRAFT_KEY,
                JSON.stringify(location)
            );
        }
        catch (error) {
            console.warn(
                "LOCATION SAVE ERROR:",
                error
            );
        }

        navigate(
            returnTo,
            {
                state: {
                    ...previousState,

                    returnTo:
                        returnTo,

                    selectedLocation:
                        location
                }
            }
        );
    }

    function handleBack() {
        navigate(-1);
    }

    return (
        <div className="location-page">

            <div className="location-nav">

                <button
                    className="icon-btn"
                    onClick={handleBack}
                >
                    <FiArrowLeft />
                </button>

                <h1>
                    Add location
                </h1>

                <div className="location-nav-space">
                </div>

            </div>

            <div className="location-search">

                <FiSearch />

                <input
                    type="text"
                    placeholder="Search location"
                    value={search}
                    onChange={function (event) {
                        setSearch(
                            event.target.value
                        );
                    }}
                />

                {search && (
                    <button
                        className="icon-btn"
                        onClick={function () {
                            setSearch("");
                        }}
                    >
                        <FiX />
                    </button>
                )}

            </div>

            {search && (
                <div className="google-location-attribution">
                    Powered by Geoapify
                </div>
            )}

            {loading && (
                <p className="no-location">
                    Searching locations...
                </p>
            )}

            {error && (
                <p className="no-location">
                    {error}
                </p>
            )}

            <div className="location-list">

                {locations.map(
                    function (location) {

                        return (
                            <div
                                className="location-item"
                                key={location.id}
                                onClick={function () {
                                    handleSelectLocation(
                                        location
                                    );
                                }}
                            >

                                <div className="location-icon">
                                    <FiMapPin />
                                </div>

                                <div className="location-info">

                                    <h3>
                                        {location.name}
                                    </h3>

                                    <p>
                                        {location.subtitle}
                                    </p>

                                </div>

                            </div>
                        );
                    }
                )}

                {!loading &&
                    !error &&
                    search &&
                    locations.length === 0 && (
                        <p className="no-location">
                            No locations found
                        </p>
                    )}

            </div>

        </div>
    );
}

export default AddLocation;
