import fs from 'fs';
import https from 'https';
import path from 'path';

const dir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const file = fs.createWriteStream(path.join(dir, "PlayfairDisplay-Regular.ttf"));
https.get("https://github.com/google/fonts/raw/main/ofl/playfairdisplay/static/PlayfairDisplay-Regular.ttf", (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log("Download Completed");
  });
}).on('error', (err) => {
  fs.unlink(path.join(dir, "PlayfairDisplay-Regular.ttf"), () => {});
  console.error("Error downloading font:", err.message);
});
