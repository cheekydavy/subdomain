// server.js
const express = require('express');
const dns = require('dns');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const findSubdomains = (domain) => {
    return new Promise((resolve) => {
        const subdomains = [];
        const commonSubdomains = [
            'www', 'mail', 'ftp', 'blog', 'test', 'dev',
            'api', 'internal', 'webmail', 'm', 'secure',
            'portal', 'account'
        ];

        let promises = commonSubdomains.map((sub) => {
            return new Promise((subResolve) => {
                const fullDomain = `${sub}.${domain}`;
                dns.resolve(fullDomain, 'A', (err) => {
                    if (!err) {
                        subdomains.push(fullDomain);
                    }
                    subResolve();
                });
            });
        });

        Promise.all(promises).then(() => {
            resolve(subdomains);
        });
    });
};

app.post('/find_subdomains', async (req, res) => {
    const { domain } = req.body;
    const subdomains = await findSubdomains(domain);
    res.json({ subdomains });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
