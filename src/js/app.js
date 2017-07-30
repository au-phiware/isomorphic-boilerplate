import Broadway from 'broadway';
import Router from './router';
import Logger from './logger';
import config from 'nconf';
import notfound from '../html/404.html';

export default class App extends Broadway {
    constructor(options) {
        super(options);
        this.router = new Router();
    }

    handle(req, res) {
        this.router.dispatch(req, res, function (err) {
            if (err) {
                Logger.error(err);
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(notfound);
            }
        });
    }
}
