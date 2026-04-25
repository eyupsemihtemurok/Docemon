const db = require('../../Infrastructure/Persistence/KnexContext');

class GeographyController {
    /**
     * @route GET /api/geography/provinces
     */
    static async getProvinces(req, res) {
        try {
            const provinces = await db('province').select('*').orderBy('name', 'asc');
            res.json(provinces);
        } catch (err) {
            res.status(500).json({ error: 'İl listesi alınamadı.' });
        }
    }

    /**
     * @route GET /api/geography/provinces/:id/districts
     */
    static async getDistricts(req, res) {
        try {
            const { id } = req.params;
            const districts = await db('district')
                .where({ province_id: id })
                .select('*')
                .orderBy('name', 'asc');
            res.json(districts);
        } catch (err) {
            res.status(500).json({ error: 'İlçe listesi alınamadı.' });
        }
    }
}

module.exports = GeographyController;
