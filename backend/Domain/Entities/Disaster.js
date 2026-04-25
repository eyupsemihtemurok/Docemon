class Disaster {
    constructor({
        id,
        type,            // Earthquake, Flood, etc.
        severity,        // Magnitude or Scale
        locationName,    // City/District
        latitude,
        longitude,
        description,
        startTime = new Date(),
        endTime = null,
        isActive = true
    } = {}) {
        this.id = id;
        this.type = type;
        this.severity = severity;
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isActive = isActive;
    }
}

module.exports = Disaster;
