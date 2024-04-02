const fs = require("fs");
const axios = require("axios").default;
const csv = require("csv-parser");

async function downloadImage(url, filePath) {
    try {
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "arraybuffer"
        });

        fs.writeFileSync(filePath, response.data, { encoding: 'binary' });
        console.log('Heruntergeladen:', filePath);
    } catch (error) {
        console.error('Fehler beim Herunterladen:', url, error);
    }
}

function downloadImagesFromCsv(csvFilePath, outputFolder) {
    fs.createReadStream(csvFilePath)
        .pipe(csv({
            headers: false,
            skipLines: 1 // überspringt die erste Zeile falls eine Header vorhanden ist.
        }))
        .on('data', (row) => {
            const url = row[0]; // Da es keinen Header gibt, greifen wir auf das erste Element der Zeile zu.
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const filePath = `${outputFolder}/${filename}`;
            downloadImage(url, filePath);
        })
        .on('end', () => {
            console.log('Alle Bilder wurden verarbeitet.');
        });
}

const outputFolder = "./Bilder"; 


downloadImagesFromCsv("Bilder.csv", outputFolder);
