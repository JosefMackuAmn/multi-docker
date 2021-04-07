const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const intSchema = new mongoose.Schema({
    int: Number
});

const Int = mongoose.model('Int', intSchema);

const keys = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send('Hi!');
});
app.get('/values/all', async (req, res) => {
    /* const client = await pgClient.connect()
    const values = await client.query('SELECT * FROM values');
    client.release() */
    const ints = await Int.find();
    const allInts = ints.map(intObj => intObj.int);
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    console.log(allInts)
    res.send(JSON.stringify(allInts));
});

app.get('/values/current', (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});
 
app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    await redisClient.hset('values', index, 'Nothing yet!');
    await redisPublisher.publish('insert', index);

    /* const client = await pgClient.connect()
    client.query('INSERT INTO values(number) VALUES($1::int)');
    client.release() */

    const int = new Int({ int: index });
    await int.save();

    res.send({ working: true });
});

mongoose.connect('mongodb://db/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) throw err;

    app.listen(5000, err => {
        console.log('Listening');
    })
});