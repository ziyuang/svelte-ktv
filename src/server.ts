import express from "express";
import * as fs from "fs";
import * as ip from "ip";
import { strict as assert } from 'assert';

import { Singer, SongEntry, Track } from "./common";

interface SongRepo {
    [song: string]: Track;
}

interface Repo {
    [singer: string]: SongRepo;
}

function createRepo(root: string): Singer[] {
    const regex = /^(.+?)-(.+?)(?:\[|\()/;
    let repo: Repo = {};
    for (const file of fs.readdirSync(root, { withFileTypes: true })) {
        if (file.isFile() && file.name.endsWith(".mp4")) {
            const m = regex.exec(file.name);
            if (m) {
                let singer = m[1];
                let song = m[2];
                if (!(singer in repo)) {
                    repo[singer] = {};
                }
                if (!(song in repo[singer])) {
                    repo[singer][song] = { video: "", audio: ["", ""] };
                }
                const filePath = `${root}/${file.name}`;
                if (/video/.exec(file.name)) {
                    repo[singer][song].video = filePath;
                } else if (/vocal/.exec(file.name)) {
                    repo[singer][song].audio[0] = filePath;
                } else if (/instrumental/.exec(file.name)) {
                    repo[singer][song].audio[1] = filePath;
                } else {
                    assert(false, `Unknown track: ${filePath}`);
                }
            }
        }
    }
    let singers: Singer[] = [];
    for (let [singer, songRepo] of Object.entries(repo)) {
        const songNames = [...Object.keys(songRepo)].sort((song1, song2) =>
            song1[0].localeCompare(song2[0], "zh")
        );
        const songs: SongEntry[] = songNames.map((name) => [
            name,
            {
                video: songRepo[name].video,
                audio: songRepo[name].audio,
            },
        ]);
        singers.push({ name: singer, songs: songs });
    }
    singers.sort((singer1, singer2) =>
        singer1.name.localeCompare(singer2.name, "zh")
    );
    return singers;
}

const app = express();
app.get("/", function (req: express.Request, res: express.Response) {
    res.sendFile("index.html", { root: "." });
});
app.get("/videos", (req: express.Request, res: express.Response) =>
    res.send(createRepo("videos"))
);
app.use(express.static("."));

const PORT = 3000;
const ADDR = ip.address();
app.listen(PORT, () =>
    console.log(`Server listening at http://${ADDR}:${PORT}`)
);
