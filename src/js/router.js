import { createReadStream, existsSync } from 'fs';
import path from 'path';
import mime from 'mime';
import util from 'util';
import Logger from './logger';
import { http } from 'director';
import master from '../html/index.html';
import robots from '../txt/robots.txt';
import humans from '../txt/humans.txt';

export default class Router {
    constructor() {
        http.Router.call(this);
        this.get(/\/(index.html)?$/, this.root);
        this.get(/\/(robots|humans).txt$/, this.txt);
        this.get(/\/(.*)\.(js|css)(\.map)?$/, this.dist);
        this.get(/\/(img\/.*)\.(png|jpg|svg)$/, this.dist);
    }

    dist(reqpath, reqext, mapext) {
        try {
            let filepath = path.join(__dirname, path.normalize(`${reqpath}.${reqext}${mapext || ''}`));
            Logger.debug(`Searching for ${filepath}`);
            if (existsSync(filepath)) {
                this.res.writeHead(200, { 'Content-Type': mime.lookup(filepath) });
                createReadStream(filepath)
                    .pipe(this.res);
            } else {
                this.res.writeHead(404, { 'Content-Type': 'text/plain' });
                this.res.end("Not found");
            }
        } catch (e) {
            Logger.warn(e);
            this.res.writeHead(500, { 'Content-Type': 'text/plain' });
            this.res.end(e.message);
        }
    }

    txt(name) {
        this.res.writeHead(200, { 'Content-Type': 'text/plain' });
        this.res.end((name == "humans" ? humans : robots) || '');
    }

    root() {
        this.res.writeHead(200, { 'Content-Type': 'text/html' });
        this.res.end(master);
    }
}

util.inherits(Router, http.Router);
