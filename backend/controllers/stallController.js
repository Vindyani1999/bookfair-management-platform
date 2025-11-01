const Stall = require('../models/stall');
const Hall = require('../models/hall');

/**
 * Get all stalls
 * GET /api/v1/stalls
 */
exports.getAllStalls = async (req, res) => {
  try {
    const stalls = await Stall.findAll();
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stalls', error: error.message });
  }
};

/**
 * Get single stall
 * GET /api/v1/stalls/:id
 */
exports.getStallById = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found' });
    res.json(stall);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall', error: error.message });
  }
};

/**
 * Create a stall
 * POST /api/v1/stalls
 */
exports.createStall = async (req, res) => {
  try {
    const { number, name, hallId, ownerId, size, price, status, description } = req.body;

    if (!number || !hallId) {
      return res.status(400).json({ message: 'Stall number and hallId are required' });
    }

    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    const stall = await Stall.create({ number, name, hallId, ownerId, size, price, status, description });
    res.status(201).json({ message: 'Stall created', stall });
  } catch (error) {
    res.status(500).json({ message: 'Error creating stall', error: error.message });
  }
};

/**
 * Update a stall
 * PUT /api/v1/stalls/:id
 */
exports.updateStall = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found' });

    const { number, name, hallId, ownerId, size, price, status, description } = req.body;

    if (hallId) {
      const hall = await Hall.findByPk(hallId);
      if (!hall) return res.status(404).json({ message: 'Hall not found' });
    }

    const updated = await stall.update({
      number: number ?? stall.number,
      name: name ?? stall.name,
      hallId: hallId ?? stall.hallId,
      ownerId: ownerId ?? stall.ownerId,
      size: size ?? stall.size,
      price: price ?? stall.price,
      status: status ?? stall.status,
      description: description ?? stall.description,
    });

    res.json({ message: 'Stall updated successfully', stall: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stall', error: error.message });
  }
};

/**
 * Delete a stall
 * DELETE /api/v1/stalls/:id
 */
exports.deleteStall = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) return res.status(404).json({ message: 'Stall not found' });

    await stall.destroy();
    res.json({ message: 'Stall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stall', error: error.message });
  }
};
