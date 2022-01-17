const express = require('express');
const router = new express.Router();
const etherscan = require('../middleware/etherscan');
const JSZip = require('jszip');
const fs = require('fs');
const utils = require('../middleware/utils')


// Excel creation
router.post('/excel', async(req, res) => {
    try {
        console.log(req.body)
        console.log(req.files)

        // Getting result from etherscan API (with or witout range)
        result = await etherscan.IterateOnAllBlockNo(req.body.report, req.body.address, (req.body.start) ? req.body.start : false, (req.body.end) ? req.body.end : false);

        // If need to create divided excel
        if (parseInt(req.body.divided)){
            var zip = new JSZip();
            // Excel files creation
            const stream = await etherscan.createDividedExcel(utils.getHeaders(req.body.report), result, req.body.report)
            for (var i = 0; i < stream.length; i++) {
                zip.file(utils.getNameFile(req.body.report, req.body.address, req.body.divided, (i + 1).toString(), (req.body.end) ? req.body.end : false), stream[i]);
            }
            const streamFile = await zip.generateAsync({type:"nodebuffer"})
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
            console.log("Finish")
            res.send(streamFile);
        // If need to create 1 full excel
        } else {
            // If it need complete existing file
            if (req.files){
                // Excel files creation
                var stream = await etherscan.createExistingExcel(result, req.body.sheet, req.body.cell, req.files['files'].data, req.body.report);
            
            // If it need create a new file
            } else {
                // Excel files creation
                var stream = await etherscan.createExcel(utils.getHeaders(req.body.report), result, req.body.report, req.body.address, req.body.report);
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
            res.setHeader('Content-Length', stream.length);
            console.log("Finish")
            res.send(stream);
        }
    } catch (err) {
        console.log(err)
        res.send({ error: 1, message: err.message })
    }
})



module.exports = router
