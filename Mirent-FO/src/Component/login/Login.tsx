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
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import loginImage from "../../assets/2.jpg";
import logo from "../../assets/horizontal.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/utilisateur/login`,
        {
          email,
          password,
        }
      );

      console.log("Connexion réussie :", response.data);

      // Vérifier le rôle de l'utilisateur
      if (response.data.user.role === "admin") {
        setError(
          "Vous êtes un administrateur. Veuillez utiliser la page de connexion administrateur."
        );
        // Rediriger vers la page de connexion admin après un délai
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
        return;
      }

      // Si c'est un client, stocker les informations et rediriger
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true"); // Pour que le Navbar détecte la connexion
      navigate("/acceuil");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la connexion. Veuillez réessayer.");
      }
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* En-tête */}
      <Box
        component={motion.div}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
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
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.05)"
        sx={{
          height: "70px",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <RouterLink to="/acceuil" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                maxWidth: "160px",
                display: "block",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </RouterLink>
        </Box>
      </Box>

      {/* Contenu principal */}
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "70px",
          py: 4,
        }}
      >
        <Paper
          component={motion.div}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          elevation={0}
          sx={{
            borderRadius: 6,
            overflow: "hidden",
            width: "100%",
            maxWidth: 1000,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            boxShadow: "0px 20px 60px rgba(0, 0, 0, 0.1)",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Partie gauche - Illustration */}
          {!isMobile && (
            <Box
              sx={{
                flex: 1.2,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component="div"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `url(${loginImage}) center/cover no-repeat`,
                  transition: "transform 10s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />

            </Box>
          )}

          {/* Partie droite - Formulaire */}
          <Box sx={{ flex: 1, p: isMobile ? 4 : 6, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Stack spacing={4}>
              <Box textAlign={isMobile ? "center" : "left"}>
                <Typography variant="h4" fontWeight="800" gutterBottom sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  Connexion
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Accédez à votre espace sécurisé
                </Typography>
              </Box>

              <Stack spacing={3}>
                <TextField
                  label="Adresse Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  error={!!error}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }}
                />
                <TextField
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  error={!!error}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }}
                />

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: "error.light",
                          color: "error.contrastText",
                          borderRadius: 2,
                          textAlign: "center"
                        }}
                      >
                        <Typography variant="body2" color="error.dark" fontWeight="medium">
                          {error}
                        </Typography>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Stack>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Vous n'avez pas encore de compte ?
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate("/register")}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    mt: 1,
                    fontSize: "0.95rem"
                  }}
                >
                  Créez-en un gratuitement
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
