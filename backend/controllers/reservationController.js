const { Sequelize, Model, DataTypes } = require('../config/db');

const Reservation = require('../models/reservation');
const Stall = require('../models/stall');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).send(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findOne({ where: { id } });
    if (!reservation) {
      res.status(404).send({ message: 'Reservation not found' });
    } else {
      res.status(200).send(reservation);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const newReservation = await Reservation.create(req.body);
    res.status(201).send(newReservation);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const id = req.params.id;
    
    const resevation = await Reservation.findOne({ where: { id } });
    if (!resevation) {
      res.status(404).send({ message: 'Reservation not found' });
    }

    let price = 0;
    if(req.body?.stallIds.length > 0){ {
      price = await calculatePrice(req.body?.stallIds);
    }
    
    const updatedReservation = await resevation.update({
      userId : req.body?.userId ?? resevation.userId,
      hallId: req.body?.hallId ?? resevation.hallId,
      stallIds: req.body?.stallIds ?? resevation.stallIds,
      fullName: req.body?.fullName ?? resevation.fullName,
      contactNumber: req.body?.contactNumber ?? resevation.contactNumber,
      email: req.body?.email ?? resevation.email,
      businessName: req.body?.businessName ?? resevation.businessName,
      businessAddress: req.body?.businessAddress ?? resevation.businessAddress,
      note: req.body?.note ?? resevation.note,
      price: price,
    });
    res.status(200).send(updatedReservation);
  }} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const id = req.params.id;
    await Reservation.destroy({ where: { id } });
    res.status(204).send({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


const calculatePrice = async (stallIds) => {
  try {
    const stalls = await Stall.findAll({
      where: { id: stallIds },
      attributes: ['price'] // optional optimization
    });

    const total = stalls.reduce((sum, stall) => {
      return sum + Number(stall.price || 0);
    }, 0);

    return total;
  } catch (error) {
    console.error('Error calculating total price:', error);
    throw error;
  }
};
