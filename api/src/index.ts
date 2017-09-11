import * as restify from 'restify';
const packageJson = require('../package.json');
import Application from './applications/Application';
import { Accept, NewFigures } from './commons/domains/apis';

let app: Application;

const server = restify.createServer({
  name: packageJson.name,
  version: packageJson.version,
});
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.post('/name', async (req, res, _) => {
  try {
    const body = JSON.parse(req.body);
    await app.setName(body.userToken, body.name);
    res.send({});
  } catch (e) {
    console.error(e.stack || e);
  }
});

server.get('/initialState/:userToken', async (req, res, __) => {
  try {
    res.send(await app.initialState(req.params.userToken));
  } catch (e) {
    console.error(e.stack || e);
  }
});

server.get('/requestNewFigures/:userToken', async (req, res, __) => {
  try {
    const data: NewFigures = {
      figures: await app.requestNewFigures(req.params.userToken),
    };
    res.send(data);
  } catch (e) {
    console.error(e.stack || e);
  }
});

server.post('/accept', async (req, res, _) => {
  try {
    const body = <Accept>JSON.parse(req.body);
    await app.accept(body.userToken, body.operations);
    res.send({});
  } catch (e) {
    console.error(e.stack || e);
  }
});

server.get('/globalStatus', async (_, res, __) => {
  try {
    res.send(await app.globalStatus());
  } catch (e) {
    console.error(e.stack || e);
  }
});

Application.create().then((x) => {
  app = x;
  server.listen(3000, () => {
    // tslint:disable-next-line:no-console
    console.log('%s listening at %s', server.name, server.url);
  });
})
  .catch((e) => { console.error(e.stack || e); });
