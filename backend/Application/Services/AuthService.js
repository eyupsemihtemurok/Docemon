const SecurityService = require('../../Infrastructure/Security/SecurityService');
const JwtService = require('../../Infrastructure/Security/JwtService');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register({ nationalId, fullName, email, password, bloodType, chronicDiseases, birthDate, phone }) {
        const nationalIdHash = SecurityService.hashDeterministic(nationalId);
        
        const existingEmail = await this.userRepository.getByEmail(email);
        if (existingEmail) throw new Error('Email already in use.');
        
        const existingTC = await this.userRepository.getByNationalId(nationalIdHash);
        if (existingTC) throw new Error('National ID already registered.');

        const passwordHash = await SecurityService.hashPassword(password);

        const newUser = await this.userRepository.create({
            national_id: nationalIdHash,
            full_name: fullName,
            email,
            password: passwordHash,
            blood_type: bloodType,
            chronic_diseases: chronicDiseases,
            birth_date: birthDate,
            phone,
            is_active: true
        });

        const token = JwtService.generateToken(newUser);

        return {
            token,
            user: {
                id: newUser.id,
                fullName: newUser.full_name,
                email: newUser.email
            }
        };
    }

    async login(email, password) {
        const user = await this.userRepository.getByEmail(email);
        if (!user) throw new Error('Invalid email or password.');

        const isMatch = await SecurityService.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Invalid email or password.');

        const token = JwtService.generateToken(user);
        
        return {
            token,
            user: {
                id: user.id,
                fullName: user.full_name,
                email: user.email
            }
        };
    }

    async getProfile(userId) {
        const user = await this.userRepository.getById(userId);
        if (!user) throw new Error('User not found.');

        const { password, national_id, ...profile } = user;
        return profile;
    }

    async updateProfile(userId, updateData) {
        if (updateData.password) {
            updateData.password = await SecurityService.hashPassword(updateData.password);
        }
        
        // Remove DB internal names if present in updateData or map them
        const mappedData = {};
        if (updateData.fullName) mappedData.full_name = updateData.fullName;
        if (updateData.bloodType) mappedData.blood_type = updateData.bloodType;
        if (updateData.chronicDiseases) mappedData.chronic_diseases = updateData.chronicDiseases;
        if (updateData.birthDate) mappedData.birth_date = updateData.birthDate;
        if (updateData.phone) mappedData.phone = updateData.phone;
        if (updateData.password) mappedData.password = updateData.password;

        const updatedUser = await this.userRepository.update(userId, mappedData);
        const { password, national_id, ...profile } = updatedUser;
        return profile;
    }
}

module.exports = AuthService;
