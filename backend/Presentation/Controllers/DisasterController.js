const DisasterService = require('../../Application/Services/DisasterService');
const DisasterRepository = require('../../Infrastructure/Persistence/Repositories/DisasterRepository');
const UserRepository = require('../../Infrastructure/Persistence/Repositories/UserRepository');

const disasterRepository = new DisasterRepository();
const userRepository = new UserRepository();
const disasterService = new DisasterService(disasterRepository, userRepository);

class DisasterController {
    /**
     * @route POST /api/disaster
     * @body { type, severity, location_name, description, province_id, districtIds: [] }
     */
    static async create(req, res) {
        try {
            const creatorId = req.user.id;
            const disaster = await disasterService.createDisaster(req.body, creatorId);
            res.status(201).json({
                message: 'Afet başarıyla oluşturuldu ve bölgedeki kullanıcılara bildirim gönderildi.',
                disaster,
            });
        } catch (err) {
            console.error('[DisasterController.create]', err);
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * @route GET /api/disaster/active
     * Returns active disasters with province name, plate_code, and districts list
     */
    static async getActive(req, res) {
        try {
            const disasters = await disasterService.getActiveDisasters();
            res.json(disasters);
        } catch (err) {
            console.error('[DisasterController.getActive]', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = DisasterController;
