// server.js - minimal Express server with file-based persistence
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'counter.json');
// Initialize store
function readCount() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const obj = JSON.parse(raw);
        return Number(obj.count) || 0;
    } catch (err) {
        return 0;
    }
}
function writeCount(c) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ count: c }, null, 2), 'utf8');
}

// ensure file exists
if (!fs.existsSync(DATA_FILE)) writeCount(0);

// endpoints
app.get('/count', (req, res) => {
        const cnt = readCount();
        res.json({ count: cnt });
        });

app.post('/increment', (req, res) => {
         // Optional: support increment amount via body { amount: 1 }
         const inc = Number(req.body.amount) || 1;
         let cnt = readCount();
         cnt += inc;
         writeCount(cnt);
         res.json({ count: cnt });
         });

app.post('/reset', (req, res) => {
         writeCount(0);
         res.json({ count: 0 });
         });

// serve static frontend (optional)
app.use('/', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
           console.log(`Counter server listening on port ${PORT}`);
           });
