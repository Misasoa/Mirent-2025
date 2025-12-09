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
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import loginImage from "../../assets/2.jpg";
import logo from "../../assets/horizontal.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Register: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // Vérification côté client : champs requis
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      setIsLoading(false);
      return;
    }
    // Vérification côté client : mots de passe correspondants
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/utilisateur/register/client",
        {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        }
      );
      setSuccess(response.data.message || "Inscription réussie !");
      console.log("Inscription réussie :", response.data);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      // Gestion des erreurs de la requête API
      if (err.response && err.response.data && err.response.data.message) {
        // Erreur renvoyée par le backend (ex: email déjà utilisé, validation)
        setError(err.response.data.message);
      } else {
        // Autres erreurs (problème réseau, serveur injoignable, etc.)
        setError(
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
        );
      }
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
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
          backdropFilter: "blur(10px)",
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
            maxHeight: "calc(100vh - 100px)",
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
                flex: 1,
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
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))",
                }}
              />
            </Box>
          )}

          {/* Partie droite - Formulaire */}
          <Box
            sx={{
              flex: 1.2,
              p: isMobile ? 3 : 5,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#888",
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#555",
              },
            }}
          >
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight="800"
                  gutterBottom
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Créer un compte
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rejoignez-nous en quelques clics
                </Typography>
              </Box>

              {/* Affichage des messages d'erreur et de succès */}
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
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2">{error}</Typography>
                    </Paper>
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "success.light",
                        color: "success.contrastText",
                        borderRadius: 2,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2">{success}</Typography>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>

              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Prénom"
                    type="text"
                    fullWidth
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    variant="outlined"
                    error={!!error && error.includes("prénom")}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" fontSize="small" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 },
                    }}
                  />
                  <TextField
                    label="Nom"
                    type="text"
                    fullWidth
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    variant="outlined"
                    error={!!error && error.includes("nom")}
                    disabled={isLoading}
                    InputProps={{
                      sx: { borderRadius: 3 },
                    }}
                  />
                </Stack>

                <TextField
                  label="Adresse Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  error={
                    !!error &&
                    (error.includes("email") || error.includes("existe déjà"))
                  }
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 },
                  }}
                />

                <TextField
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  error={
                    !!error &&
                    (error.includes("mot de passe") ||
                      error.includes("correspondent pas"))
                  }
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
                    sx: { borderRadius: 3 },
                  }}
                />

                <TextField
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  error={!!error && error.includes("correspondent pas")}
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
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 },
                  }}
                />
              </Stack>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleRegister}
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
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "S'inscrire"
                )}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Vous avez déjà un compte ?
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    mt: 1,
                    fontSize: "0.95rem",
                  }}
                >
                  Connectez-vous ici
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
