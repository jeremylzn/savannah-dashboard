const express = require('express');
const router = new express.Router();
const etherscan = require('../middleware/etherscan');
const JSZip = require('jszip');
const buffer = require("buffer");


router.post('/excel', async(req, res) => {
    try {
        console.log(req.body)
        result = await etherscan.IterateOnAllBlockNo(req.body.report, req.body.address);

        if (parseInt(req.body.divided)){
            var zip = new JSZip();
            const stream = await etherscan.createDividedExcel(etherscan.getColumnList(req.body.report), result)

            for (var i = 0; i < stream.length; i++) {
                zip.file('data_' + i + '.xlsx', stream[i]);
            }
            final = await zip.generateAsync({type:"nodebuffer"})
            console.log(final)
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
            console.log("Finish")
            res.send(final);
        } else {
            const stream = await etherscan.createExcel(etherscan.getColumnList(req.body.report), result, req.body.report, req.body.address);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
            res.setHeader('Content-Length', stream.length);
            console.log("Finish")
            res.send(stream);
        }


    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 1, message: err.message })
    }
})



module.exports = router
