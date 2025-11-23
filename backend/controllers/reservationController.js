const { Sequelize, Model, DataTypes } = require('../config/db');

const Reservation = require('../models/reservation');
const Stall = require('../models/stall');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.status(200).json({success: true, message: 'Resevation fetched successfully', data: reservations});
  } catch (error) {
    console.error(error);
    res.status(500).json ({success: false, message: 'Internal Server Error', error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const id = req.params.id;
    const reservation = await Reservation.findOne({ where: { id } });
    if (!reservation) {
      res.status(404).json({ success: false, message: 'Reservation not found' , data: null });
    } else {
      res.status(200).json({success: true, message: 'Reservation fetched successfully', data: reservation});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error', error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    const { id } = req.user
    const newReservation = await Reservation.create({...req.body, userId: id});
    res.status(201).json({success: true, message: 'Reservation created successfully', data: newReservation},);
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error', error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const id = req.params.id;
    
    const resevation = await Reservation.findOne({ where: { id } });
    if (!resevation) {
      res.status(404).json({success: false, message: 'Reservation not found', data: null });
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
    res.status(200).json({success: true, message: 'Reservation updated successfully', data: updatedReservation});
  }} catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error' , error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const id = req.params.id;
    await Reservation.destroy({ where: { id } });
    res.status(204).json({success: true, message: 'Reservation deleted successfully', data: null});
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Internal Server Error', error: error.message });
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
