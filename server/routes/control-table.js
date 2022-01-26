const express = require('express');
const router = new express.Router();
const database = require('../config/firebase');

// Add new address
router.post('/address', async(req, res) => {
    try {
        const address_collection = database.collection('control_table'); 
        const address = address_collection.doc(req.body.address); 
        await address.set(req.body);
        res.send({ error: 0, message: `Address successfully added : ${req.body.address}` });
    } catch (err) {
        console.log(err);
        res.send({ error: 1, message: err.message });
    }
})

// Get addresses from control-table
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

module.exports = router
