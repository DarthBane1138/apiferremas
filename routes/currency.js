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
    // Configuración de fechas
    const getFormattedDate = (date) => {
      const offset = date.getTimezoneOffset();
      date = new Date(date.getTime() - (offset * 60 * 1000));
      return date.toISOString().split('T')[0];
    };

    // Intentar con 3 días de retroceso como máximo
    let attempts = 0;
    let latestRate = null;
    let dateUsed = null;

    while (attempts < 3 && !latestRate) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - attempts);
      dateUsed = getFormattedDate(currentDate);

      const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=${process.env.BCENTRAL_USER}&pass=${process.env.BCENTRAL_PASS}&timeseries=F073.TCO.PRE.Z.D&firstdate=${dateUsed}&lastdate=${dateUsed}`;

      const response = await axios.get(url);
      
      if (response.data.Series?.Obs?.length > 0) {
        latestRate = parseFloat(response.data.Series.Obs[0].value);
      }

      attempts++;
    }

    if (!latestRate) {
      return res.status(404).json({
        error: "No se encontraron datos recientes",
        suggestion: "Intentar con un rango de fechas más amplio"
      });
    }

    res.json({
      rate: latestRate,
      currency: "USD",
      date: dateUsed,
      source: "Banco Central de Chile"
    });

  } catch (error) {
    console.error("Error completo:", {
      message: error.message,
      url: error.config?.url,
      response: error.response?.data
    });
    
    res.status(500).json({
      error: "Error al obtener tipo de cambio",
      detail: error.response?.data || error.message
    });
  }
});


// routes/currency.js (o cualquier otro archivo de rutas)
router.get('/debug-env', (req, res) => {
  res.json({
    user: process.env.BCENTRAL_USER || "Variable no definida",
    pass: process.env.BCENTRAL_PASS ? "****** (existe)" : "Variable no definida"
  });
});

module.exports = router;