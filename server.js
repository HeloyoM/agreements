const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
const multer = require("multer");
const fs = require('fs');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const agreementPath = path.join(__dirname, './db.json');

const agreements = [];

const init = () => {
    const file = fs.readFileSync(agreementPath, 'utf-8')
    const agreementsList = JSON.parse(file)

    for (const a of agreementsList) {
        agreements.push(a)
    }
}

app.use(express.json());
app.use(cors('*'))

// Serve the static files from the Webpack output
app.use(express.static(path.join(__dirname, '../static', 'public')));

// Fallback to index.html for React Router (SPA behavior)
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'Connection successful from backend 🎉' });
});

app.post("/api/submit-form", upload.single("signature"), async (req, res) => {
    try {

        const { clientName, clientEmail, projectPrice, projectStart, projectEnd } = req.body;
        const signatureBuffer = req.file.buffer; // buffer of the PNG image

        const agreement = {
            clientName,
            clientEmail,
            projectPrice,
            projectStart,
            projectEnd,
            signatureBuffer,
            createdAt: new Date().toISOString(),
        };

        agreements.push(agreement)

        fs.writeFile(agreementPath, JSON.stringify(agreements), 'utf-8', (err) => {
            if (err) {
                console.error(
                    `Something went wrong whild inserting new article: ${err}`,
                )
            }

            else console.log('article inserted successfully')
        })

        res.status(200).json({ message: "Agreement received" });
    } catch (error) {
        console.error("Error saving agreement:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


init();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
