const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 7200;
app.use(express.json());
app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await Promise.all(
      cities.map(async (city) => {
        const apiKey = '52d47055ad12ada38c3d017d9b4ad7d2'; 
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        return { [city]: response.data.main.temp + '°C' };
      })
    );
    const weatherObject = weatherData.reduce((acc, data) => {
      const city = Object.keys(data)[0];
      const temp = data[city];
      acc[city] = temp;
      return acc;
    }, {});
    res.json({ weather: weatherObject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading HTML file');
    } else {
      res.send(data);
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
