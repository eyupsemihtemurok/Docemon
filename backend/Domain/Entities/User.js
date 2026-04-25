class User {
    constructor({
        id,
        fullName,
        email,
        password,
        bloodType,
        chronicDiseases,
        birthDate,
        phone,
        faceData,
        isActive = true,
        createdAt = new Date(),
        updatedAt = new Date()
    } = {}) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.bloodType = bloodType;
        this.chronicDiseases = chronicDiseases;
        this.birthDate = birthDate;
        this.phone = phone;
        this.faceData = faceData;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = User;
