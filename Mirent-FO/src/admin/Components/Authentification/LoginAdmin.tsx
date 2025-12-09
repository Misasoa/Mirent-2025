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
    Alert,
    InputAdornment,
    CircularProgress,
    alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import loginImage from "../../../assets/2.jpg";
import logo from "../../../assets/horizontal.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../redux/features/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";

const LoginAdmin: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        if (!email || !password) {
            setError("Veuillez remplir tous les champs.");
            setLoading(false);
            return;
        }

        try {
            console.log("🔵 Tentative de connexion admin avec email:", email);

            const response = await axios.post(
                "http://localhost:3000/utilisateur/login",
                {
                    email,
                    password,
                }
            );

            console.log("✅ Réponse serveur complète:", response.data);
            console.log("👤 Utilisateur:", response.data.user);
            console.log("🔑 Rôle reçu:", response.data.user?.role, "(type:", typeof response.data.user?.role, ")");

            // Vérifier que l'utilisateur est bien un admin
            if (response.data.user.role !== "admin") {
                console.error("❌ Accès refusé - Rôle actuel:", response.data.user.role);
                setError(
                    `Accès refusé. Votre rôle est "${response.data.user.role}". Seuls les administrateurs (rôle: "admin") peuvent se connecter ici.`
                );
                setLoading(false);
                return;
            }

            console.log("✅ Vérification rôle admin OK - Connexion autorisée");

            // Dispatcher l'action Redux pour mettre à jour le state global
            dispatch(
                loginSuccess({
                    user: response.data.user,
                    token: response.data.access_token,
                })
            );

            // Redirection vers le dashboard admin
            navigate("/admin/home");
        } catch (err: any) {
            console.error("❌ ERREUR COMPLÈTE:", err);
            console.error("❌ Réponse erreur:", err.response?.data);
            console.error("❌ Status HTTP:", err.response?.status);

            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (err.message) {
                setError(`Erreur réseau: ${err.message}`);
            } else {
                setError("Erreur lors de la connexion. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Gérer la touche Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // Darker theme for Admin
            }}
        >
            {/* En-tête */}
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
                {/* Logo */}
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

            {/* Contenu principal */}
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
                        {/* Partie gauche - Illustration */}
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
                                        Administration
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ textShadow: "0 1px 5px rgba(0,0,0,0.5)", opacity: 0.9 }}>
                                        Gérez votre plateforme en toute sécurité.
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Partie droite - Formulaire */}
                        <Box sx={{ flex: 1, p: isMobile ? 4 : 6, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <Stack spacing={4}>
                                <Box textAlign="center">
                                    <Typography variant="h4" fontWeight="800" gutterBottom sx={{ color: "#1e293b" }}>
                                        Bienvenue
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        Connectez-vous à l'espace administrateur
                                    </Typography>
                                </Box>

                                {/* Affichage des erreurs */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                                                {error}
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Stack spacing={3}>
                                    <TextField
                                        label="Adresse Email"
                                        type="email"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        autoComplete="email"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 3 }
                                        }}
                                    />
                                    <TextField
                                        label="Mot de passe"
                                        type="password"
                                        fullWidth
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        autoComplete="current-password"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            sx: { borderRadius: 3 }
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
                                    onClick={handleLogin}
                                    disabled={loading}
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        py: 1.5,
                                        fontSize: "1rem",
                                        fontWeight: "bold",
                                        bgcolor: "#1e293b",
                                        "&:hover": {
                                            bgcolor: "#334155",
                                        }
                                    }}
                                >
                                    {loading ? "Connexion..." : "Se connecter"}
                                </Button>

                                <Box textAlign="center" pt={2}>
                                    <Typography variant="body2" color="text.secondary">
                                        Vous êtes un client ?{" "}
                                        <Button
                                            component={RouterLink}
                                            to="/login"
                                            variant="text"
                                            size="small"
                                            sx={{ textTransform: "none", fontWeight: "bold" }}
                                        >
                                            Espace Client
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

export default LoginAdmin;
