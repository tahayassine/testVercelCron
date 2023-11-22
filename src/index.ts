import express, { Request, Response } from 'express';
import getPresta from './scraping/getPresta';

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (_req: Request, res: Response) => {
  return res.send('Express Typescript on Vercel');
});

app.get('/ping', (_req: Request, res: Response) => {
  return res.send('pong 🏓');
});

app.get('/start', async (_req: Request, res: Response) => {
  await getPresta();
  return res.send('Done !');
});

app.get('/hello', (_req: Request, res: Response) => {
  return res.send('Hello 👋');
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
