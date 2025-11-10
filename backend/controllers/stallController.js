const Stall = require('../models/stall');
const Hall = require('../models/hall');

/**
 * @desc    Get all stalls
 * @route   GET /api/v1/stalls
 * @access  Private
 */
exports.getAllStalls = async (req, res) => {
  try {
    const { size, hallId } = req.query;
    const where = {};
    
    if (size) {
      where.size = size;
    }
    if (hallId) {
      where.hallId = hallId;
    }

    const stalls = await Stall.findAll({
      where,
      include: [{
        model: Hall,
        attributes: ['name']
      }],
      order: [['name', 'ASC']]
    });

    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stalls', error: error.message });
  }
};

/**
 * @desc    Get single stall
 * @route   GET /api/v1/stalls/:id
 * @access  Private
 */
exports.getStallById = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id, {
      include: [{
        model: Hall,
        attributes: ['name']
      }]
    });
    
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json({
      ...stall.toJSON(),
      dimensions: stall.dimensions,
      area: stall.area
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall', error: error.message });
  }
};

/**
 * @desc    Create a stall
 * @route   POST /api/v1/stalls
 * @access  Private
 */
exports.createStall = async (req, res) => {
  try {
    const { name, hallId, width, length, price, description } = req.body;

    if (!hallId) {
      return res.status(400).json({ message: 'Hall ID is required' });
    }

    const hall = await Hall.findByPk(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    const stall = await Stall.create({
      name,
      hallId,
      width,
      length,
      price: price || 0,
      description
    });

    res.status(201).json({
      message: 'Stall created successfully',
      stall
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Invalid stall data',
        error: error.message
      });
    }
    res.status(500).json({ message: 'Error creating stall', error: error.message });
  }
};

/**
 * @desc    Update stall
 * @route   PUT /api/v1/stalls/:id
 * @access  Private
 */
exports.updateStall = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    const { name, width, length, price, description, ownerId } = req.body;

    const updated = await stall.update({
      name: name ?? stall.name,
      width: width ?? stall.width,
      length: length ?? stall.length,
      price: price ?? stall.price,
      description: description ?? stall.description,
      ownerId: ownerId ?? stall.ownerId
    });

    res.json({
      message: 'Stall updated successfully',
      stall: updated
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Invalid stall data',
        error: error.message
      });
    }
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
