const NEWS_API_KEY = process.env.NEWS_API_KEY;
const AIR_QUALITY_API_KEY = process.env.AIR_QUALITY_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/weather', async (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: 'City is required' });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        const data = response.data;

        res.json({
            temperature: data.main.temp,
            description: data.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            coordinates: data.coord,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            wind_speed: data.wind.speed,
            country: data.sys.country,
            rain: data.rain ? data.rain['3h'] : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data.' });
    }
});

router.get('/news', async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: city,
                apiKey: NEWS_API_KEY,
                pageSize: 5,
                sortBy: 'publishedAt',
                language: 'en'
            }
        });

        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news data.' });
    }
});

router.get('/air-quality', async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(`https://api.api-ninjas.com/v1/airquality`, {
            params: { city },
            headers: { 'X-Api-Key': AIR_QUALITY_API_KEY }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching air quality data.' });
    }
});

module.exports = router;
