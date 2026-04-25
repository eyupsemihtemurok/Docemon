const DisasterService = require('../../Application/Services/DisasterService');
const DisasterRepository = require('../../Infrastructure/Persistence/Repositories/DisasterRepository');

const disasterRepository = new DisasterRepository();
const disasterService = new DisasterService(disasterRepository);

class DisasterController {
    /**
     * @route POST /api/disaster
     * @desc Create a new disaster and alert users in area
     */
    static async create(req, res) {
        try {
            const creatorId = req.user.id; // From auth middleware
            const disaster = await disasterService.createDisaster(req.body, creatorId);
            
            res.status(201).json({
                message: 'Afet başarıyla oluşturuldu ve bölgedeki kullanıcılara bildirim gönderildi.',
                disaster
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * @route GET /api/disaster/active
     */
    static async getActive(req, res) {
        try {
            const disasters = await disasterService.getActiveDisasters();
            res.json(disasters);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = DisasterController;
