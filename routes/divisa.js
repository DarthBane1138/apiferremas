// routes/currency.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BCENTRAL_USER, BCENTRAL_PASS } = require('../config.js');

/**
 * @route GET /apiferremas/currency/exchange-rate
 * @description Obtiene el tipo de cambio actual (USD a CLP) desde el Banco Central de Chile.
 * @returns {Object} { rate: number, currency: "USD", date: string }
 */
router.get('/exchange-rate', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${BCENTRAL_USER}&pass=${BCENTRAL_PASS}&timeseries=F073.TCO.PRE.Z.D&firstdate=${today}&lastdate=${today}`;

    const response = await axios.get(url);
    const observations = response.data.Series.Obs;

    if (!observations || observations.length === 0) {
      return res.status(404).json({ error: "No se encontraron datos de cambio" });
    }

    const latestRate = parseFloat(observations[0].value);
    res.json({ 
      rate: latestRate,
      currency: "USD",
      date: observations[0].indexDateString
    });

  } catch (error) {
    console.error("Error en Banco Central:", error.message);
    res.status(500).json({ 
      error: "Error al obtener el tipo de cambio",
      details: error.response?.data || error.message 
    });
  }
});

module.exports = router;