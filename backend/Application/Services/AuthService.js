const SecurityService = require('../../Infrastructure/Security/SecurityService');
const JwtService = require('../../Infrastructure/Security/JwtService');

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register({ tc, ad_soyad, email, sifre, kan_grubu, kronik_hastaliklar, dogum_tarihi, telefon }) {
        // TCKN hashleme (Deterministic)
        const tcHash = SecurityService.hashDeterministic(tc);
        
        // E-posta veya TC kontrolü
        const existingEmail = await this.userRepository.getByEmail(email);
        if (existingEmail) throw new Error('Bu e-posta adresi zaten kullanımda.');
        
        const existingTC = await this.userRepository.getByTC(tcHash);
        if (existingTC) throw new Error('Bu T.C. Kimlik numarası zaten kayıtlı.');

        // Şifre hashleme
        const passwordHash = await SecurityService.hashPassword(sifre);

        const newUser = await this.userRepository.create({
            tc: tcHash,
            ad_soyad,
            email,
            sifre: passwordHash,
            kan_grubu,
            kronik_hastaliklar,
            dogum_tarihi,
            telefon,
            aktiflik: 1
        });

        return {
            id: newUser.id,
            ad_soyad: newUser.ad_soyad,
            email: newUser.email
        };
    }

    async login(email, password) {
        const user = await this.userRepository.getByEmail(email);
        if (!user) throw new Error('Geçersiz e-posta veya şifre.');

        const isMatch = await SecurityService.comparePassword(password, user.sifre);
        if (!isMatch) throw new Error('Geçersiz e-posta veya şifre.');

        const token = JwtService.generateToken(user);
        
        return {
            token,
            user: {
                id: user.id,
                ad_soyad: user.ad_soyad,
                email: user.email
            }
        };
    }

    async getProfile(userId) {
        const user = await this.userRepository.getById(userId);
        if (!user) throw new Error('Kullanıcı bulunamadı.');

        // Şifre ve TC hash'ini gönderme
        const { sifre, tc, ...profile } = user;
        return profile;
    }

    async updateProfile(userId, updateData) {
        // Şifre güncelleniyorsa hashle
        if (updateData.sifre) {
            updateData.sifre = await SecurityService.hashPassword(updateData.sifre);
        }
        
        // TC değiştirilemez kuralı (isteğe bağlı)
        delete updateData.tc;

        const updatedUser = await this.userRepository.update(userId, updateData);
        const { sifre, tc, ...profile } = updatedUser;
        return profile;
    }
}

module.exports = AuthService;
