const mongoose = require('mongoose');

const transactionDataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    spentAmount: {
        required: true,
        type: String
    },
    receivedAmount: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    
}, { timestamps: true, collection: 'Transaction' })

module.exports = mongoose.model('Transaction', transactionDataSchema)