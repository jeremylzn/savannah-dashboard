const express = require('express');
const router = new express.Router();
const etherscan = require('../middleware/etherscan');
const JSZip = require('jszip');
const buffer = require("buffer");
const fs = require('fs');


router.post('/excel', async(req, res) => {
    try {
        console.log(req.body)
        console.log(req.files)

        result = await etherscan.IterateOnAllBlockNo(req.body.report, req.body.address, (req.body.start) ? req.body.start : false, (req.body.end) ? req.body.end : false);


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
            if (req.files){
                fs.writeFileSync('tmp.xlsx', req.files['files'].data);
                var stream = await etherscan.createExistingExcel(etherscan.getColumnList(req.body.report), result, 'tmp.xlsx', req.body.sheet, req.body.cell);
            } else {
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
        res.status(400).send({ error: 1, message: err.message })
    }
})



module.exports = router
