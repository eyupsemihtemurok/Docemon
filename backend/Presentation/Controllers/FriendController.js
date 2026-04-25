const NetworkService = require('../../Application/Services/NetworkService');
const FriendRepository = require('../../Infrastructure/Persistence/Repositories/FriendRepository');

const friendRepository = new FriendRepository();
const networkService = new NetworkService(friendRepository);

class FriendController {
    /**
     * @swagger
     * /api/friends:
     *   get:
     *     summary: Get friend list with safety status
     *     tags: [Network]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of friends
     */
    static async getFriends(req, res) {
        try {
            const friends = await networkService.getFriends(req.user.id);
            res.json(friends);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/friends/request:
     *   post:
     *     summary: Send a friend request
     *     tags: [Network]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               receiverId:
     *                 type: string
     *     responses:
     *       201:
     *         description: Request sent
     */
    static async sendRequest(req, res) {
        try {
            const { receiverId } = req.body;
            const requestId = await networkService.createRequest(req.user.id, receiverId);
            res.status(201).json({ message: 'Friend request sent.', requestId });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/friends/respond:
     *   post:
     *     summary: Respond to a friend request (ACCEPT/REJECT)
     *     tags: [Network]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               requestId:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [ACCEPTED, REJECTED]
     *     responses:
     *       200:
     *         description: Success
     */
    static async respondRequest(req, res) {
        try {
            const { requestId, status } = req.body;
            const result = await networkService.respondToRequest(req.user.id, requestId, status);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/friends/emergency-contacts:
     *   get:
     *     summary: Get emergency contacts
     *     tags: [Network]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of emergency contacts
     */
    static async getEmergencyContacts(req, res) {
        try {
            const contacts = await networkService.getEmergencyContacts(req.user.id);
            res.json(contacts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    /**
     * @swagger
     * /api/friends/emergency-contacts:
     *   put:
     *     summary: Toggle emergency contact status
     *     tags: [Network]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               friendshipId:
     *                 type: string
     *               isEmergency:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Success
     */
    static async toggleEmergency(req, res) {
        try {
            const { friendshipId, isEmergency } = req.body;
            const result = await networkService.toggleEmergencyContact(req.user.id, friendshipId, isEmergency);
            res.json(result);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}

module.exports = FriendController;
