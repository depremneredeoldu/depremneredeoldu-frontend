export default class Earthquake {
    constructor(earthquake_id, date, time, latitude, longitude, depth, magnitude, location) {
        this.earthquake_id = earthquake_id
        this.date = date
        this.time = time
        this.latitude = latitude
        this.longitude = longitude
        this.depth = depth
        this.magnitude = magnitude
        this.location = location
    }

    getID() {
        return this.earthquake_id
    }

    getMapFeature() {
        return {
            type: "Feature",
            properties: {
                description: `<strong>Lokasyon : ${this.location}</strong><br>
                    Büyüklük : ${this.magnitude}<br>
                    Derinlik : ${this.depth}<br>
                    Tarih : ${this.time} - ${this.date}`,
                infoAboutMagnitude: parseFloat(
                    `${this.magnitude}`
                ),
            },
            geometry: {
                type: "Point",
                coordinates: [
                    this.longitude,
                    this.latitude,
                ],
            },
        };
    }
}

