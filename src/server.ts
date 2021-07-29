import express from "express";
import * as fs from "fs";
import * as path from "path";
import * as ip from "ip";

import { Singer } from "./common";

interface Repo {
    [singer: string]: [string, string][];
}

function createRepo(root: string): Singer[] {
    const regex = /^(.+?)-(.+?)(?:\[|\()/;
    let repo: Repo = {};
    for (const file of fs.readdirSync(root, { withFileTypes: true })) {
        if (file.isFile() && file.name.endsWith(".mpg")) {
            const m = regex.exec(file.name);
            if (m) {
                let singer = m[1];
                let songName = m[2];
                if (!(singer in repo)) {
                    repo[singer] = [];
                }
                repo[singer].push([songName, path.join(root, file.name)]);
            }
        }
    }
    let singers: Singer[] = [];
    for (let [singer, songs] of Object.entries(repo)) {
        songs.sort((song1, song2) => song1[0].localeCompare(song2[0], "zh"));
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
