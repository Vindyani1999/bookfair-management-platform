const Hall = require("../models/hall");
const Resevation = require("../models/reservation");
const Stall = require("../models/stall");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const { sendResevationEmail } = require("../utils/emailService");
const {
  createStripeSession,
  getSessionById,
} = require("../utils/paymentService");
const QRCode = require('qrcode');

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json({success: true, message: "Transactions fetched successfully", data: transactions});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error fetching transactions', error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({success: false, message: "Transaction not found", data: null });
    }
    res.status(200).json({success: true, message: "Transaction fetched successfully", data: transaction});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error fetching transaction', error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { reservationId, amount } = req.body;
    const session = await createStripeSession(amount, "USD");
    if (!session) {
      return res.status(404).json({ success: false, message: "Transaction not submitted",   data: null });
    }

    const transaction = await Transaction.create({
      userId: id,
      reservationId,
      amount,
      sessionId: session.id,
      sessionUrl: session.url,
    });

    if (!transaction) {
      return res.status(404).json({success: false, message: "Transaction not submitted", data: null });
    }
    res.status(201).json({ success: true, message: "Transaction submitted successfully", data:{ transaction, session} });
  } catch (error) {
    res.status(500).json({success: false, message: error.message, data: null });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({success: false, message: "Session ID is required", data: null });
    }
    const transaction = await Transaction.findOne({
      where: { sessionId: sessionId },
    });
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found", data: null });
    }

    //fetch the resevaton
    const reservation = await Resevation.findByPk(transaction.reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found", data: null });
    }

    // fetch the stripe session
    const session = await getSessionById(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(200).json({ success: false, message: "Payment not completed", data: null });
    }

    //update transaction
    (transaction.isPaid = true), transaction.save();

    // update the resevation
    (reservation.isPaid = true), reservation.save();

    // get stall details
    const stallIds = Array.isArray(reservation.stallIds)
      ? reservation.stallIds
      : JSON.parse(reservation.stallIds || "[]");

    const stalls = await Stall.findAll({
      where: { id: stallIds },
    });
    reservation.stallIds = stalls;

    // get data for QR
    const hall = await Hall.findByPk(reservation.hallId);

     const qrData = {
      userId: reservation.userId,
      userName: reservation.fullName,
      hallName: hall.name,
      stallNames: stalls.map(s => s.name),
      bookingDate: reservation.createdAt,
      paymentStatus: 'Paid',
    };

    // Generate QR Code (as a Data URL)
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));

    const emailData = {
      qrCodeDataURL,
      userId: reservation.userId,
      userName: reservation.fullName,
      hallName: hall.name,
      stallNames: stalls.map(s => s.name).join(", "),
      bookingDate: reservation.createdAt,
    };
    
    await sendResevationEmail(reservation.email, emailData);


    res.status(200).json({success: true, message: "Transaction updated successfully", data:{...reservation, qrCodeDataURL}});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error updating transaction', error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({success: false, message: "Transaction not found", data: null });
    }
    res.status(200).json({ success: true, message: "Transaction deleted successfully", data: transaction });
  } catch (error) {
    res.status(500).json({success: false, message: error.message, data: null });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
