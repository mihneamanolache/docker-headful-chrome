import express from 'express';
import puppeteer from "puppeteer";
import dotenv from "dotenv";
// import Xvfb from "xvfb";

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

app.get('/screenshot', async (req, res) => {
    const sites = [
        'https://www.amazon.com/b?node=16225007011&pf_rd_r=MMQ1EYDVEFYY2JDK5S83&pf_rd_p=e5b0c85f-569c-4c90-a58f-0c0a260e45a0&pd_rd_r=22b31825-edc9-4dad-a471-1bb25c8b4503&pd_rd_w=8wYnT&pd_rd_wg=7alz5&ref_=pd_gw_unk',
        'https://www.amazon.com/Apple-MU8F2AM-A-Pencil-Generation/dp/B07K1WWBJK/ref=lp_16225007011_1_2?sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D',
        'https://www.amazon.com/dp/B09V3JJT5D',
        'https://www.amazon.com/gp/goldbox?ref_=nav_cs_gb',
        'https://www.amazon.com/deal/9cf4faac?showVariations=true&pf_rd_r=201CESXKHX6XFMHYXDBV&pf_rd_t=Events&pf_rd_i=deals&pf_rd_p=fce7b2cd-2f52-4ddf-80f5-3b9666e3f116&pf_rd_s=slot-15&ref=dlx_deals_gd_dcl_img_10_9cf4faac_dt_sl15_16',
        'https://www.amazon.com/Blink-Floodlight-Wireless-security-detection/dp/B0B1NR38BW?ref_=Oct_DLandingS_D_9cf4faac_12'
    ]
    
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
});

app.listen(3000, () => {
    console.log(`Serve at http://localhost:${3000}`);
});

