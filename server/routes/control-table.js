const express = require('express');
const router = new express.Router();
const database = require('../config/firebase');

// Add new address
router.post('/address', async(req, res) => {
    try {
        console.log('/address')

        // const usersDb = database.collection('tests'); 
        // const liam = usersDb.doc('lragozzine'); 
        // await liam.set({
        //     first: 'Liam',
        //     last: 'Ragozzine',
        //     address: '133 5th St., San Francisco, CA',
        //     birthday: '05/13/1990',
        //     age: '30'
        //    });
        res.send({ error: 0, message: '/address' })
    } catch (err) {
        console.log(err)
        res.send({ error: 1, message: err.message })
    }
})

module.exports = router
