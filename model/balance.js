//updating the balance 

const mongoose = require('mongoose');

const balanceDataSchema = new mongoose.Schema({
    amount: {
        required: true,
        type: String,
        default: "0"
    },

}, { timestamps: true, collection: 'Balance' })

module.exports = mongoose.model('Balance', balanceDataSchema)