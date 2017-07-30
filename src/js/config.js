import conf from 'nconf';

conf.argv()
    .env()
    .file({ file: 'config.json' })
    .file('package', { file: 'package.json' })
    .defaults({
        app: {
            http: 3000
        }
    });

export default conf;
