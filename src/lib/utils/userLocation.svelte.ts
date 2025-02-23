async function getUserLocation() {
    if (navigator && navigator.geolocation) {
        return new Promise<GeolocationPosition | null>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    maximumAge: 0,
                    enableHighAccuracy: true,
                }
            )  
        })
    }

    return Promise.resolve(null);
}


export default getUserLocation;