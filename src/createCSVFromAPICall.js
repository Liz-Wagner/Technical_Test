const axios = require("axios")
const fs = require("fs").promises;
require('dotenv').config();


const githubUrl = process.env.Bootstrap_GitHub_API_URL

//call github api and return release info
async function fetchBootstapReleaseInfo() {
    try {
        const response = await axios.get(githubUrl);
        //map over returned json data and retrieve requested data
        return response.data.map(info => ({
            created_at: info.created_at,
            tag_name: info.tag_name,
            zipball_url: info.zipball_url
        }));
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`)
        return null;
    }
}

//transform json data to csv
async function convertJSONBootstrapDataToCSV() {
    const releaseInfo = await fetchBootstapReleaseInfo();
    const dataCsv = releaseInfo.reduce((acc, info) => {
        acc += `${info.created_at}, ${info.tag_name}, ${info.zipball_url}\n`;
        return acc;
    },
    `Created Date, Tag Name, Zip URL\n` //CSV column names
    );
    console.log("csv", dataCsv)

    await fs.writeFile("bootstrap_release_info.csv", dataCsv, "utf8")
        .then(() =>console.log('Data written to bootstrap_release_info.csv'))    
        .catch((error) => console.error('Error writing to file:', err))
    }

convertJSONBootstrapDataToCSV();

module.exports = {
    fetchBootstapReleaseInfo, 
    convertJSONBootstrapDataToCSV
} 