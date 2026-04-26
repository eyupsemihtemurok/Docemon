const AuthService = require('../../Application/Services/AuthService');
const UserRepository = require('../../Infrastructure/Persistence/Repositories/UserRepository');

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

class AuthController {
    static async register(req, res) {
        try {
            const result = await authService.register({
                ...req.body,
                faceDataBuffer: req.file?.buffer,
                faceDataMimeType: req.file?.mimetype,
            });
            res.status(201).json({
                message: 'User registered successfully.',
                ...result
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }

    static async getMe(req, res) {
        try {
            const profile = await authService.getProfile(req.user.id);
            res.json(profile);
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const updatedProfile = await authService.updateProfile(req.user.id, req.body);
            res.json({ message: 'Profile updated successfully.', profile: updatedProfile });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = AuthController;
