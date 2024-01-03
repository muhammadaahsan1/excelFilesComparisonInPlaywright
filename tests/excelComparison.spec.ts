//importing fixtures from playwright/test

import { test, expect } from "@playwright/test";
//Import XLSX after installing npm install xlsx library
import XLSX from "xlsx";



test("Download & Compare excel file data", async ({ page }, testInfo) => {

    // read the original data and store in a json format (Excel table data can be represented as an array of objects in the form of JSON. Each object represents a row in the table.)
    const org_path = "original.xlsx";
    const orginalExcelData = readExcel(org_path);

    // test goto app and download the excel file
    await page.goto("https://letcode.in/file");
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        await page.locator("//a[contains(text(),'Download Excel')]").click()
    ]);
    // get the excel file name
      

    const path = download.suggestedFilename();    // Returns suggested filename for this download. It is typically computed by the browser.
    await download.saveAs(path);
    // attach the downloaded file to the report
    await testInfo.attach('downloaded', { path: path });

    // read the data and convert to json format
    const fromDownloadedFile = readExcel(path);
    expect(orginalExcelData).toStrictEqual(fromDownloadedFile)


})

function readExcel(path: string) {
    const workbook = XLSX.readFile(path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonSheet = XLSX.utils.sheet_to_json(sheet);
    console.log(jsonSheet);
    return jsonSheet;
}