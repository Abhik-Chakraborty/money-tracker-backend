var express = require('express');
var router = express.Router();
const TransactionModel = require('../model/transaction');
const BalanceModel = require('../model/balance');
const transaction = require('../model/transaction');

/* GET users listing. */
router.get('/all', async function (req, res, next) {
    try {
        const data = await TransactionModel.find();

        const sortedDataByDate = data.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))

        res.json(sortedDataByDate)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/', async (req, res) => {

    const currentBalance = await BalanceModel.findOne();

    if(!currentBalance) {
        const balance = new BalanceModel({
            amount: parseInt(req.body.spentAmount) > 0 ?
                        (-parseInt(req.body.spentAmount, 10)).toString() :
                        (parseInt(req.body.receivedAmount, 10)).toString()
        });

        balance.save();
    } else {
        await BalanceModel.findOneAndUpdate(
            {
                $set: {
                    amount: parseInt(req.body.spentAmount) > 0 ?
                        (parseInt(currentBalance.amount, 10) - parseInt(req.body.spentAmount, 10)).toString() :
                        (parseInt(currentBalance.amount, 10) + parseInt(req.body.receivedAmount, 10)).toString()
                }
            }
        )
    }

    const data = new TransactionModel({
        name: req.body.name,
        spentAmount: req.body.spentAmount,
        receivedAmount: req.body.receivedAmount,
        description: req.body.description
    })
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//my work
router.get('/balance', async function (req,  res,  next){
    try{
        const balance = await BalanceModel.findOne();
        res.json(balance.amount);
    } catch (error){
        next(error);
    }

});

//for delete /:id

router.delete('/:id', async function (req,  res,  next){
    try{
        const { id } = req.params;

        const transaction = await TransactionModel.findById(id);

        const { spentAmount, receivedAmount } = transaction;

        await TransactionModel.findByIdAndDelete(id)

        // adjust the balance 
        const currentBalance = await BalanceModel.findOne();
        console.log(currentBalance, spentAmount, receivedAmount)
        if(spentAmount > 0) {
            currentBalance.amount = (parseInt(currentBalance.amount, 10) + parseInt(spentAmount, 10)).toString();
        } else if (receivedAmount > 0){
            currentBalance.amount = (parseInt(currentBalance.amount, 10) - parseInt(receivedAmount, 10)).toString();
        }
        await currentBalance.save();

        res.json(id);

    } catch (error){
        next(error);
    }

});

module.exports = router;