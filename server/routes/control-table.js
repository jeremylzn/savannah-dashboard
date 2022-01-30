const express = require('express');
const router = new express.Router();
const database = require('../config/firebase');
const utils = require('../middleware/utils')

// Add new address
router.post('/address', async(req, res) => {
    try {
        let data = req.body
        const web3 = utils.getWeb3Instance()
        data.type = await utils.checkTypeAddress(web3, data.address)
        data.first_date = await utils.getFirstDate(data.address)
        await utils.getFirstandLastDateByAddress(data.address)
        // const data = await web3.eth.getTransaction(req.body.address)
        const address_collection = database.collection('control_table'); 
        const address = address_collection.doc(data.address); 
        await address.set(req.body, {merge: true});
        res.send({ error: 0, message: `Address successfully added : ${data.address}` });
        // console.log(data)
        // res.send({});
    } catch (err) {
        console.log(err);
        res.send({ error: 1, message: err.message });
    }
})

// Get all  addresses
router.get('/address', async(req, res) => {
    try {
        const snapshot = await database.collection('control_table').get()
        const rows = snapshot.docs.map(doc => doc.data());
        res.send(rows);
    } catch (err) {
        console.log(err);
        res.send({ error: 1, message: err.message });
    }
})

// Update address
router.put('/address', async(req, res) => {
    try {
        console.log(req.body)
        const result = await database.collection("control_table").doc(req.body.address).update(req.body);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ error: 1, message: err.message });
    }
})

module.exports = router
