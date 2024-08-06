const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = 'mongodb+srv://twitter_user:Twitter@cluster0.bdqzinw.mongodb.net/?appName=Cluster0';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } });

async function run() {
    try {
        await client.connect();
        const postCollection = client.db('database').collection('posts'); // this is post collection
        const userCollection = client.db('database').collection('users'); // this is user collection

        // Get endpoints
        app.get('/post', async (req, res) => {
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        });

        app.get('/user', async (req, res) => {
            const user = await userCollection.find().toArray();
            res.send(user);
        });

        app.get('/loggedInUser', async (req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({ email: email }).toArray();
            res.send(user);
        });

        // Post endpoints
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        });

        app.post('/register', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        app.post('/updateLanguage', async (req, res) => {
            const { email, language } = req.body;
            const result = await userCollection.updateOne(
                { email },
                { $set: { language } }
            );
            res.send(result);
        });

        // Endpoint to send OTP
        app.post('/sendOtp', async (req, res) => {
            const { email } = req.body;
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

            // Save OTP to the user's record in the database
            await userCollection.updateOne(
                { email },
                { $set: { otp } }
            );

            // Send OTP via email using nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'palthyaswaroopa2020@gmail.com',
                    pass: 'Swaroopa@1316'
                }
            });

            const mailOptions = {
                from: 'palthyaswaroopa2020@gmail.com',
                to: email,
                subject: 'Your OTP for Changing Language Preference',
                text: `Your OTP is: ${otp}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(500).send({ message: 'Error sending OTP', error });
                } else {
                    res.send({ message: 'OTP sent successfully' });
                }
            });
        });

        // Endpoint to verify OTP
        app.post('/verifyOtp', async (req, res) => {
            const { email, otp } = req.body;
            const user = await userCollection.findOne({ email });

            if (user && user.otp === otp) {
                res.send({ message: 'OTP verified successfully' });
            } else {
                res.status(400).send({ message: 'Invalid OTP' });
            }
        });

    } catch (error) {
        console.log(error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World from Twitter!')
});

app.listen(port, () => {
    console.log(`Twitter listening on port ${port}`);
});
