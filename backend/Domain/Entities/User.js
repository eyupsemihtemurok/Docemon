class User {
    constructor({
        id,
        nationalId,
        fullName,
        email,
        password,
        bloodType,
        chronicDiseases,
        birthDate,
        phone,
        faceData,
        isActive = true,
        status = 'SAFE', // Default status from UserStatus enum
        createdAt = new Date(),
        updatedAt = new Date()
    } = {}) {
        this.id = id;
        this.nationalId = nationalId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.bloodType = bloodType;
        this.chronicDiseases = chronicDiseases;
        this.birthDate = birthDate;
        this.phone = phone;
        this.faceData = faceData;
        this.isActive = isActive;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = User;
