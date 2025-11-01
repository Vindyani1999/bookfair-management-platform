const Hall = require('../models/hall');

/**
 * Get all halls
 * GET /api/v1/halls
 */
exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.findAll();
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching halls', error: error.message });
  }
};

/**
 * Update a hall
 * PUT /api/v1/halls/:id
 */
exports.updateHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    const { name, location, capacity, description } = req.body;

    const updated = await hall.update({
      name: name ?? hall.name,
      location: location ?? hall.location,
      capacity: capacity ?? hall.capacity,
      description: description ?? hall.description,
    });

    res.json({ message: 'Hall updated successfully', hall: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating hall', error: error.message });
  }
};
