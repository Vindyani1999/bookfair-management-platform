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

    if (size) where.size = size;
    if (hallId) where.hallId = hallId;

    const stalls = await Stall.findAll({
      where,
      include: [
        {
          model: Hall,
          attributes: ['name']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stalls', error: error.message });
  }
};

/**
 * @desc    Get single stall by ID
 * @route   GET /api/v1/stalls/:id
 * @access  Private
 */
exports.getStallById = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id, {
      include: [
        {
          model: Hall,
          attributes: ['name']
        }
      ]
    });

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    res.json(stall);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stall', error: error.message });
  }
};

/**
 * @desc    Create a new stall
 * @route   POST /api/v1/stalls
 * @access  Private
 */
exports.createStall = async (req, res) => {
  try {
    const { name, hallId, size, price, description } = req.body;

    // Validation: hallId is required
    if (!hallId) {
      return res.status(400).json({ message: 'Hall ID is required' });
    }

    // Check if hall exists
    const hall = await Hall.findByPk(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Create new stall
    const stall = await Stall.create({
      name,
      hallId,
      size: size || 'small',
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
        error: error.errors.map((e) => e.message)
      });
    }
    res.status(500).json({ message: 'Error creating stall', error: error.message });
  }
};

/**
 * @desc    Update a stall
 * @route   PUT /api/v1/stalls/:id
 * @access  Private
 */
exports.updateStall = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    const { name, size, price, description, hallId } = req.body;

    if (hallId) {
      const hall = await Hall.findByPk(hallId);
      if (!hall) {
        return res.status(404).json({ message: 'Hall not found' });
      }
    }

    const updatedStall = await stall.update({
      name: name ?? stall.name,
      size: size ?? stall.size,
      price: price ?? stall.price,
      description: description ?? stall.description,
      hallId: hallId ?? stall.hallId
    });

    res.json({
      message: 'Stall updated successfully',
      stall: updatedStall
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Invalid stall data',
        error: error.errors.map((e) => e.message)
      });
    }
    res.status(500).json({ message: 'Error updating stall', error: error.message });
  }
};

/**
 * @desc    Delete a stall
 * @route   DELETE /api/v1/stalls/:id
 * @access  Private
 */
exports.deleteStall = async (req, res) => {
  try {
    const stall = await Stall.findByPk(req.params.id);
    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    await stall.destroy();
    res.json({ message: 'Stall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting stall', error: error.message });
  }
};
