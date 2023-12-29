checkifModuleExists('axios');
checkifModuleExists('fs');
checkifModuleExists('wd');
checkifModuleExists('path');
checkifModuleExists('image-data-uri');

//need to install the following node modules
const axios = require('axios');
const fs = require('fs');
const wd = require('wd');
const path = require('path');
const imageDataURI = require('image-data-uri');


//date parameter in this format : YYYY-MM-DDTHH-MM
var myDate = new Date(Date.now());
dateMonth = (myDate.getMonth() + 1 < 10 ? '0' : '') + (myDate.getMonth() +1);
dateDay = (myDate.getDate() < 10 ? '0' : '') + myDate.getDate();
dateHour = (myDate.getHours() < 10 ? '0' : '') + myDate.getHours();
dateMin = (myDate.getMinutes() < 10 ? '0' : '') + myDate.getMinutes();
dateSec = (myDate.getSeconds() < 10 ? '0' : '') + myDate.getSeconds();
const dateFormatted = myDate.getFullYear() + '-' + dateMonth + '-' + dateDay + 'T' + dateHour + '-' + dateMin;

const fileDir = "C:\\Temp\\TestimReports\\"; // or "C:\\Temp\\TestimReports\\" for Win users

// Hash table with entries of type: <testId>: <resultId>
const _TESTS = new Map();

exports.config = {
    grid:       "Virtual Mobile Grid",
    project:    "RiuO9ZV8b7ZhHsXRPouY",
    token:      "4bXNL1am4jLDGLXjsp1bBnJtCByOTfFcPdADgopyzMBR8pXix8",
    branch:     "master",
    
    afterTest (test) {
        _TESTS.set(test.testId, test.resultId);
    },

    async afterSuite () {
        const results = [];
 
        for (const result_id of _TESTS.values()) {
            results.push(testim_fetch_result(result_id));
        }

        // build HTML and write into a file
        for (let result of await Promise.all(results)) {

            //console.log(result.testResult.link + " | " + result.testResult.testName + " | " + result.testResult.executionDate + " | " + result.testResult.executionTime + " | " + result.testResult.baseURL + " | " + result.testResult.testResult + " | " + result.testResult.errorMessage);

            let html = "<html><head><style>@import url(https://fonts.googleapis.com/css?family=Roboto);</style></head><body style='font-family: Roboto; text-align: center; padding-left: 30px; padding-right: 30px; padding-top: 10px;'><center><b>Test Results</b></center><br>";
            html += "<div style='margin: 5px 30px 30px; box-shadow: 0px 15px 15px rgba( 0, 0, 0, 0.2 );'>"
            html += "<table style='border-collapse: collapse; width: 100%; margin-bottom: 5rem; border: none; align: center; padding: .35em; table-layout: fixed; border-radius: 5px;'>\n";
            html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
            html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Test Name</b></td><td style='text-align: left; padding: 8px; padding-left: 20px;'><a href='" + result.testResult.link + "'>" + result.testResult.testName + "</a></td>\n";
            html += "</tr>\n";
            html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
            html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Run Date</b></td><td style='text-align: left; padding: 8px; padding-left: 20px;'>" + result.testResult.executionDate + " " + result.testResult.executionTime + "</td>\n";
            html += "</tr>\n";
            html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
            html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Base URL</b></td><td style='text-align: left; padding: 8px; padding-left: 20px;'><a href='" + result.testResult.baseURL + "'>" + result.testResult.baseURL + "</a></td>\n";
            html += "</tr>\n";
            html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
            if (result.testResult.testResult.toLowerCase() === 'passed') {
                html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Test Status</b></td><td style='text-align: left; padding: 8px; padding-left: 20px; color: green;'>" + result.testResult.testResult + "</td>\n";
            }
            else {
                html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Test Status</b></td><td style='text-align: left; padding: 8px; padding-left: 20px; color: red;'>" + result.testResult.testResult + "</td>\n";
            }
            html += "</tr>\n";
            if (result.testResult.errorMessage != null) {
                html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
                html += "<td style='text-align: left; font-weight: bold; padding-left: 20px; width: 30%; border-right: 1px solid #dedede;'><b>Error Message</b></td><td style='text-align: left; padding: 8px; padding-left: 20px;'>" + result.testResult.errorMessage + "</td>\n";
                html += "</tr>\n";
            }
            html += "</table>\n";
            html += "</div>\n";


            if(result.testResult.stepsResults.length > 0 && result.testResult.stepsResults != 'undefined') {
                html += "<div style='margin: 5px 30px 30px; box-shadow: 0px 15px 15px rgba( 0, 0, 0, 0.2 );'>"
                html += "<table style='border-collapse: collapse; width: 100%; margin-bottom: 5rem; border: none; align: center; padding: .35em; table-layout: fixed; border-radius: 5px;'>\n";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step #</b></th>";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step Name</b></th>";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step Type</b></th>";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step Duration</b></th>";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step Status</b></th>";
                html += "<th style='text-align: center; padding: 8px; color: #ffffff; background: #324960;'><b>Step Screenshot</b></th>";
                
                var i = 0;

                for (let step_result of result.testResult.stepsResults) {

                    i++;
                    //console.log( i + " | " + step_result.description + " | " + step_result.type + " | " + step_result.duration + " | " + step_result.status + " | " + step_result.screenshot);

                    html += "<tr style='border: 1px solid #dedede; text-align: center; align: center; padding: 10px;'>\n";
                    html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px;'>" + i + "</td>";
                    html += "<td style='text-align: left; font-weight: bold; padding-top: 10px; padding-bottom: 10px;'>" + step_result.description + "</td>";
                    html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px;'>" + step_result.type + "</td>";
                    html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px;'>" + step_result.duration + "</td>";
                    if (step_result.status.toLowerCase() == 'passed') {
                        html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px; color: green;'>" + step_result.status + "</td>";
                    }
                    else {
                        html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px; color: red;'>" + step_result.status + "</td>";
                    }

                    //turn an image into a data URI string
                    let dataURI = await imageDataURI.encodeFromURL(step_result.screenshot);

                    html += "<td style='text-align: center; font-weight: bold; padding-top: 10px; padding-bottom: 10px;'><a href='" + step_result.screenshot + "'><img style='width:150px;' src='" + dataURI + "'></a></td>\n";
                    html += "</tr>\n";

                }

                html += "</table>\n";
                html += "</div>\n";
            }

            html += "</body></html>";

            await createHTMLReport(html, result.testResult.testId, result.testResult.testResult);
            await createPDFReport(result.testResult.testId, result.testResult.testResult);
            
        }
    }
}


// fetch test result from Testim
async function testim_fetch_result (resultId) {

    console.log("resultId: " + resultId);
    const api_key = "PAK-3+bh85bqN7LPJH-KSO7fGUkTubTPmrp8jG3fuKNCPl4a6sKGNAk9fFd+4S/xQwVNw4sq2PqYH3/TvXNZ3";
    const url     = "https://api.testim.io/runs/tests/" + resultId + "?stepsResults=true";
    
    return axios(url, {
        headers: {
            "Authorization": "Bearer " + api_key,
        }
    })
        .then(res => {
            const json = res.data;

            if (json.error) {
                throw new Error(json.error.message);
            }

            return json;
        });
}

// create HTML report
async function createHTMLReport (html, testId, testResult) {

    const HTMLFileName = "Test-Results-Report__" + testId + "__" + dateFormatted + "__" + testResult + ".html";

    fs.writeFile(fileDir + HTMLFileName, html, (err) => { 
        if (err) 
          console.log("Error: " + err); 
        else { 
          console.log("HTML File written successfully\n"); 
          //console.log("The written has the following contents:"); 
          //console.log(fs.readFileSync(fileDir + HTMLFileName, "utf8")); 
        } 
      }); 
    
}

// create PDF report
async function createPDFReport (testId, testResult) {

    const HTMLFileName = "Test-Results-Report__" + testId + "__" + dateFormatted + "__" + testResult + ".html";
    const PDFFileName = "Test-Results-Report__" + testId + "__" + dateFormatted + "__" + testResult + ".pdf";

    (async () => {
        try{
            // Create browser instance
            const browser = await wd.launch({headless: 'new'});
        
            // Create a new page
            const page = await browser.newPage();

            // Get HTML content
            const html = fs.readFileSync(path.resolve(fileDir, HTMLFileName), 'utf-8');

            // Set HTML as page content
            await page.setContent(html, { waitUntil: 'domcontentloaded' });

            // Custom web font
            //await page.addStyleTag({ path: fileDir + 'roboto.css' });

            // To reflect CSS used for screens instead of print
            await page.emulateMediaType('screen');

            // Save PDF File
            await page.pdf({ path: path.resolve(fileDir, PDFFileName), format: 'A3', margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }, printBackground: true});
        
            // Close browser instance
            await browser.close();

            console.log('PDF file has been generated successfully.');
        } catch (error) {
            console.log("Error: " + error);
        }
    })();

    
}

function checkifModuleExists(module) {
    const { exec } = require('child_process');
    // define the module name to check and install
    const moduleName = module;
    // check if the module is installed
    exec(`npm list ${moduleName}`, (err, stdout, stderr) => {
        if (err) {
            // the module is not installed, so install it
            console.log(`Installing ${moduleName}...`);
            exec(`npm install ${moduleName}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error installing ${moduleName}: ${err}`);
            } else {
                console.log(`${moduleName} installed successfully`);
            }
            });
        } else {
            // the module is already installed
            console.log(`${moduleName} is already installed`);
        }
    });
}



