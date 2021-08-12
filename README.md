# Screenshots
## Desktop
![screenshot1](screenshots/screenshot1.png)
![screenshot2](screenshots/screenshot2.png)
## Mobile (for song-adding only)
![mobile_screenshot](screenshots/mobile_screenshot.jpg)

# Build & Run
* Build: `yarn install && npx webpack build`
* Launch the server: `cd dist && node server.js`
  * The video folder `videos` needs to be present under `dist`
* Connect to the server
  * PC: `http://localhost`
  * Mobile devices: `http://${IP_OF_YOUR_PC}`

# File name format of the media files
The server requires the names of the media files in a certain format (see `src/server.ts`). For example if you have a `{stem}.mpg`, you can generate the tracks with

```
ffmpeg -extra_hw_frames 32 -hwaccel cuda -hwaccel_output_format cuda -c:v mpeg2_cuvid -i '{stem}.mpg' -map 0:v -c:v h264_nvenc -profile:v high -preset p7 -tune:v hq -level 5 '{stem}.video.mp4' -map 0:a:0 -c:a aac -b:a 192k '{stem}.vocal.mp4' -map 0:a:1  -c:a aac -b:a 192k '{stem}.instrumental.mp4'
```