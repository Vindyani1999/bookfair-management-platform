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
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { id } = req.user;
    const { reservationId, amount } = req.body;
    const session = await createStripeSession(amount, "USD");
    if (!session) {
      return res.status(404).json({ message: "Transaction not submitted" });
    }

    const transaction = await Transaction.create({
      userId: id,
      reservationId,
      amount,
      sessionId: session.id,
      sessionUrl: session.url,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not submitted" });
    }
    res.status(201).json({ transaction, session });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }
    const transaction = await Transaction.findOne({
      where: { sessionId: sessionId },
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    //fetch the resevaton
    const reservation = await Resevation.findByPk(transaction.reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // fetch the stripe session
    const session = await getSessionById(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(200).json({ message: "Payment not completed" });
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


    res.status(200).json({...reservation, qrCodeDataURL});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;
    const transaction = await Transaction.findByIdAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
