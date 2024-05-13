// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

const PORT = process.env.PORT || 3032;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(bodyParser.json());



app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Optionally, you can handle sending verification email here

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ user, session });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/logout', async (req, res) => {
    try {
      const { error } = await supabase.auth.signOut();
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/reset-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/refresh-token', async (req, res) => {
    const { refresh_token } = req.body;
  
    try {
      const { access_token, error } = await supabase.auth.api.refreshAccessToken(refresh_token);
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ access_token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
