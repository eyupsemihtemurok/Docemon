class Location {
    constructor({
        id,
        userId,
        latitude,
        longitude,
        city,
        createdAt = new Date()
    } = {}) {
        this.id = id;
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.createdAt = createdAt;
    }
}

module.exports = Location;
