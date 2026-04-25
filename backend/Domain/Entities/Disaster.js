class Disaster {
    constructor({
        id,
        type,            // Earthquake, Flood, etc.
        severity,        // Magnitude or Scale
        locationName,    // General name
        provinceId,      // City ID (İl ID)
        districtId,      // District ID (İlçe ID)
        latitude,
        longitude,
        description,
        createdBy,       // User ID who created this disaster
        startTime = new Date(),
        endTime = null,
        isActive = true
    } = {}) {
        this.id = id;
        this.type = type;
        this.severity = severity;
        this.locationName = locationName;
        this.provinceId = provinceId;
        this.districtId = districtId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.createdBy = createdBy;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isActive = isActive;
    }
}

module.exports = Disaster;
