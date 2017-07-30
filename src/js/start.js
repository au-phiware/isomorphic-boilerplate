import { createServer } from 'union';
import App from './app';
import Logger from './logger';
import conf from './config';

var app = new App(conf.get('app'));

app.mixin(createServer(conf.get('http') || {}));

app.preboot(function (app, opts, next) {
    Logger.info("Booting with:", opts);
    next();
});

app.start(function (err) {
    if (err) {
        Logger.error("Error:", err);
        return process.exit(1);
    }

    Logger.info("'%s' v%s listening over HTTP on port %s", conf.get('name'), conf.get('version'), this.given.http);
});
