const sql = require('mssql');
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, pool, poolConnect } = require('./db');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 8081;

app.use(bodyParser.json());

connectDB();

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});

app.get('/miageconnect/api', (req, res) => {
  res.send('API en ligne');
});

app.get('/miageconnect/api/utilisateurs', async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .query('SELECT * FROM Utilisateur');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erreur lors de la requête SQL :', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

app.post('/miageconnect/api/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    await poolConnect;

    const result = await pool.request()
      .input('email', email)
      .query('SELECT * FROM Utilisateur WHERE email = @email');

    if (result.recordset.length === 0) {
      return res.status(400).json({ message: 'Email introuvable' });
    }

    const utilisateur = result.recordset[0];
    const mot_de_passe_bdd = utilisateur.mot_de_passe;

    if (mot_de_passe !== mot_de_passe_bdd) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    res.status(200).json({
      message: 'Connexion réussie !',
      utilisateur: {
        id: utilisateur.id_utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        type: utilisateur.type
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/miageconnect/api/sign-up', async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role, type, captchaToken } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe || !role || !type || !captchaToken) {
    return res.status(400).json({ message: 'Champs manquants ou CAPTCHA manquant' });
  }

  // Verify reCAPTCHA
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ message: 'Clé secrète reCAPTCHA manquante côté serveur' });
    }
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const response = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken
      }
    });
    if (!response.data.success) {
      return res.status(400).json({ message: 'Échec de la vérification reCAPTCHA' });
    }
  } catch (err) {
    console.error('Erreur lors de la vérification reCAPTCHA:', err);
    return res.status(500).json({ message: 'Erreur lors de la vérification reCAPTCHA' });
  }

  try {
    await poolConnect;

    // Vérifier si l'email existe déjà
    const checkResult = await pool.request()
      .input('email', email)
      .query('SELECT id_utilisateur FROM Utilisateur WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    // Insérer le nouvel utilisateur avec role et type
    await pool.request()
      .input('nom', nom)
      .input('prenom', prenom)
      .input('email', email)
      .input('mot_de_passe', mot_de_passe)
      .input('role', role)
      .input('type', type)
      .query(
        `INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, role, type)
         VALUES (@nom, @prenom, @email, @mot_de_passe, @role, @type)`
      );

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});