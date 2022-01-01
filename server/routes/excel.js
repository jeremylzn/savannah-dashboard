const express = require('express');
const router = new express.Router();
const etherscan = require('../middleware/etherscan');
const excel = require("exceljs");

router.post('/excel', async(req, res) => {
    try {
        console.log(req.body)
        response = await etherscan.getData(req.body.report, req.body.address);
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Tutorials");
        const column = etherscan.getColumnList(req.body.report)
        worksheet.columns = column
        worksheet.addRows(response.result);
        // res is a Stream object
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "tutorials.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });

        // res.send({ message: "Post req succesfully" })
    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 1, message: err.message })
    }
})



module.exports = router
