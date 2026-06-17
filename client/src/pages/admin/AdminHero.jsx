// src/pages/admin/AdminHero.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, Plus, Image as ImageIcon } from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://peptideweightloss.vercel.app/api'
  : 'http://localhost:5000/api';

const AdminHero = ({ token }) => {
  // ... (tout le code du composant AdminHero)
};

export default AdminHero;