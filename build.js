const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeApp(app) {
    try {
        const { data } = await axios.get(app.url);
        const $ = cheerio.load(data);
        
        // استخراج البيانات من صفحة جوجل بلاي
        const icon = $('img[alt="Icon image"]').attr('src');
        const description = $('div[data-g-id="description"]').text() || "لا يوجد وصف متاح حالياً.";
        const rating = $('div.TT9eCd').first().text() || "4.5";

        return `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${app.name} - CompLegacy</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <div class="container">
                <header><h1>CompLegacy</h1></header>
                <div class="app-card">
                    <img src="${icon}" alt="${app.name}" class="icon">
                    <h2>${app.name}</h2>
                    <p class="rating">التقييم: ${rating}</p>
                    <div class="ad-space">/* كود إعلان Adsterra هنا */</div>
                    <div class="desc">${description.substring(0, 500)}...</div>
                    <a href="${app.url}" class="download-btn">تحميل من المتجر الرسمي</a>
                    <div class="ad-space">/* كود إعلان Adsterra هنا */</div>
                    <hr>
                    <div id="disqus_thread"></div>
                </div>
                <footer><a href="privacy.html">الخصوصية</a></footer>
            </div>
            <script src="https://YOUR_DISQUS_URL.disqus.com/embed.js" async></script>
        </body>
        </html>`;
    } catch (e) {
        console.log(`خطأ في جلب بيانات ${app.name}`);
        return null;
    }
}

async function main() {
    const apps = JSON.parse(fs.readFileSync('apps.json'));
    if (!fs.existsSync('dist')) fs.mkdirSync('dist');

    for (const app of apps) {
        const html = await scrapeApp(app);
        if (html) fs.writeFileSync(`dist/${app.id}.html`, html);
    }
    console.log("تم بناء الصفحات بنجاح!");
}

main();
          
