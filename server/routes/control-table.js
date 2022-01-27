const express = require('express');
const router = new express.Router();
const database = require('../config/firebase');

// Add new address
router.post('/address', async(req, res) => {
    try {
        const address_collection = database.collection('control_table'); 
        const address = address_collection.doc(req.body.address); 
        await address.set(req.body, {merge: true});
        res.send({ error: 0, message: `Address successfully added : ${req.body.address}` });
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
