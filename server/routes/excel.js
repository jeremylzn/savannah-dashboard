const express = require('express');
const router = new express.Router();
const etherscan = require('../middleware/etherscan');
const JSZip = require('jszip');
const fs = require('fs');


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
            const stream = await etherscan.createDividedExcel(etherscan.getColumnList(req.body.report), result)
            for (var i = 0; i < stream.length; i++) {
                zip.file('data_' + i + '.xlsx', stream[i]);
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
                var stream = await etherscan.createExistingExcel(result, req.body.sheet, req.body.cell, req.files['files'].data);
            
            // If it need create a new file
            } else {
                // Excel files creation
                var stream = await etherscan.createExcel(etherscan.getColumnList(req.body.report), result, req.body.report, req.body.address);
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
