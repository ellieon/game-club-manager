import express from 'express';
import { JwtHelper } from './util/jwtHelper';
import cookieParser from 'cookie-parser'; 
import { requireCookie } from './middleware/requireCookie';
import { DatabaseService } from './services/databaseService';
import { UserService } from './services/userService';
import { CreateSubmissionController } from './controllers/createSubmissionController';
import path from 'path';

const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/auth/discord', async (req:any, res: any) => {
  const userService = new UserService();
  const discordAuthUrl = userService.generateAuthURL(`${req.query.callback}`)
  res.redirect(`${discordAuthUrl}`)
});

app.get('/auth/discord/callback', async (req:any, res:any) => {
try {
  const userService = new UserService();
  const token = await userService.requestAccessToken(req.query.code);
  const bearerToken: any = JwtHelper.createBearerToken(token.access_token)
  console.log('Saving bearer token');
  JwtHelper.saveBearerTokenToCookie(res, bearerToken)
  res.redirect('/');
} catch (err) {
  res.send(err)
}
});

app.get('/', requireCookie,  async( req: any, res: any) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/', requireCookie, async (req: any, res: any) => {
  try {
    const createSubmissionController = new CreateSubmissionController();
    createSubmissionController.createNewSubmission(req);
    res.redirect('/success');
  } catch (err) {
    console.error(err);
    res.send('Error inserting data');
  }
});

app.get('/success', async(req: any, res: any) =>  {
  res.sendFile(path.join(__dirname, 'public', 'thank-you.html'));
});

app.get('/ping', (req: any, res: any) => {
  res.send('pong');
})
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});