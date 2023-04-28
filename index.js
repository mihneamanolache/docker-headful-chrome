import express from 'express';
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import Xvfb from "xvfb";
import { isValidUrl } from './helpers.js';

dotenv.config()

const getWs = async () => {
    try {
        const xvfb = new Xvfb({
            silent: true,
            xvfb_args: ["-screen", "0", '1280x720x24', "-ac"],
        })
        xvfb.start((err)=>{if (err) console.error(err)})
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: process.env.CHROME_PATH,
            defaultViewport: null,
            args: [
                `--display=${xvfb._display}`,
                "--ignore-certificate-errors",
                "--start-maximized",
                "--no-sandbox"
            ]
        })
        const browserWSEndpoint = browser.wsEndpoint();
        return browserWSEndpoint
    } catch (err) {
        console.error(err);
    }
}

const app = express()

app.get('/chrome', async (req, res) => {
    res.set('Content-Type', 'application/json');
    try {
        const socket = await getWs()
        res.send({socket: socket})
    } catch (e) {
        res.send({error: e.message})
    }
})

app.get('/screenshot', async (req, res) => {
    if (req.query.url && isValidUrl(req.query.url)) {
        try {
            const browser = await puppeteer.connect({
                browserWSEndpoint: await getWs()
            })
            const page = await browser.newPage();
            await page.goto("https://www.netflix.com/ca/Login", {'waitUntil' : 'networkidle0'});
            const img = await page.screenshot({
                fullPage: true,
            });
            await page.close();
            res.set('Content-Type', 'image/png');
            res.send(img);
        } catch (err) {
            console.error(err);
            res.set('Content-Type', 'application/json');
            res.send(err)
        }
    }
    res.set('Content-Type', 'application/json');
    res.send({error: "Please use `url` query param to specify a URL."})
});

app.listen(3000, () => {
    console.log(`Serve at http://localhost:${3000}`);
});

