import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3001", timeout: 5000 });

const MESSAGES = {
  400: "Requête invalide",
  404: "Ressource introuvable",
  500: "Erreur serveur",
};

// Requête : headers communs + JWT si présent
api.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Réponse : erreurs centralisées -> Error avec message lisible + status HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = status
      ? MESSAGES[status] || `Erreur HTTP ${status}`
      : error.code === "ECONNABORTED"
      ? "Délai dépassé : le serveur ne répond pas"
      : "Réseau indisponible : l'API est-elle démarrée ?";
    // Point d'extension : sur 401, tenter un refresh token puis rejouer la requête.
    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

export default api;
