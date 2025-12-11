import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import loginImage from "../../../assets/2.jpg";
import logo from "../../../assets/horizontal.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { API_BASE_URL } from "../../../config";

const RegisterAdmin: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/utilisateur/register/admin`,
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // 🔥 nécessaire pour corriger CORS
        }
      );

      setSuccess(response.data.message || "Compte administrateur créé avec succès !");
      console.log("Inscription admin réussie :", response.data);

      setTimeout(() => {
        navigate("/admin");
      }, 2000);

    } catch (err: any) {
      console.error("Erreur d'inscription admin:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Erreur réseau ou CORS bloqué. Vérifiez le backend.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      }}
    >
      {/* Header */}
      <Box
        bgcolor="rgba(255, 255, 255, 0.9)"
        p={1}
        pl={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1100}
        sx={{
          height: "64px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box display="flex" alignItems="center">
          <RouterLink to="/admin" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                maxWidth: "140px",
                display: "block",
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(1.05)" }
              }}
            />
          </RouterLink>
        </Box>
      </Box>

      {/* Main content */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "64px",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Paper
            elevation={24}
            sx={{
              borderRadius: 5,
              overflow: "hidden",
              width: "100%",
              maxWidth: 950,
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              bgcolor: "rgba(255, 255, 255, 0.98)",
            }}
          >
            {/* Left side image */}
            {!isMobile && (
              <Box
                sx={{
                  flex: 1.1,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${loginImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(20%) contrast(1.1)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 40,
                    left: 40,
                    color: "white",
                    zIndex: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight="800" sx={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
                    Nouvel Admin
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textShadow: "0 1px 5px rgba(0,0,0,0.5)", opacity: 0.9 }}>
                    Rejoignez l'équipe d'administration.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Right side form */}
            <Box sx={{ flex: 1, p: isMobile ? 4 : 5 }}>
              <Stack spacing={3}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="800" gutterBottom sx={{ color: "#1e293b" }}>
                    Inscription Admin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Créez un nouveau compte administrateur
                  </Typography>
                </Box>

                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                        {success}
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Stack spacing={2}>
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Prénom"
                      type="text"
                      fullWidth
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Nom"
                      type="text"
                      fullWidth
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      size="small"
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: 2 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <TextField
                    label="Adresse Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirmer le mot de passe"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    size="small"
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleRegister}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} color="inherit" /> : <HowToRegIcon />
                  }
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    bgcolor: "#1e293b",
                    fontWeight: "bold",
                    "&:hover": {
                      bgcolor: "#334155",
                    }
                  }}
                >
                  {loading ? "Création..." : "Créer le compte"}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    <Button
                      component={RouterLink}
                      to="/admin"
                      variant="text"
                      size="small"
                      sx={{ textTransform: "none" }}
                    >
                      Retour à la connexion
                    </Button>
                  </Typography>
                </Box>

              </Stack>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default RegisterAdmin;
