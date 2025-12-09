import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    Alert,
    useTheme,
    useMediaQuery,
    alpha,
    CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Components/Navbar";
import contactImage from "../../assets/contact.png";
import axios from "axios";

const Contact = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Le nom est requis";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Le sujet est requis";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Le message est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSuccess(false);
        setApiError(null);

        try {
            await axios.post("http://localhost:3000/contact", formData);
            setSuccess(true);
            setFormData({ name: "", email: "", subject: "", message: "" });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        } catch (err) {
            console.error("Erreur lors de l'envoi du message:", err);
            setApiError("Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.");
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
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
        >
            <Navbar />

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    py: { xs: 4, md: 8 },
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 6,
                                overflow: "hidden",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                                bgcolor: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(20px)",
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                            }}
                        >
                            {/* Left Side - Image & Info */}
                            <Box
                                sx={{
                                    flex: 1,
                                    position: "relative",
                                    minHeight: { xs: "300px", md: "auto" },
                                    overflow: "hidden",
                                    bgcolor: theme.palette.primary.main,
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
                                        background: `url(${contactImage}) center/cover no-repeat`,
                                        opacity: 0.6,
                                        mixBlendMode: 'overlay',
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
                                        background: `linear-gradient(135deg, ${alpha(
                                            theme.palette.primary.main,
                                            0.9
                                        )} 0%, ${alpha(theme.palette.primary.dark, 0.95)} 100%)`,
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: "relative",
                                        zIndex: 1,
                                        p: { xs: 4, md: 6 },
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        color: "white",
                                    }}
                                >
                                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                                        Contactez-nous
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 6, opacity: 0.9, fontWeight: 300 }}>
                                        Notre équipe est à votre écoute pour toute question ou demande d'information.
                                    </Typography>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                                            Email
                                        </Typography>
                                        <Typography variant="h6" fontWeight="500">
                                            contact@mirent.mg
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 4 }}>
                                        <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                                            Téléphone
                                        </Typography>
                                        <Typography variant="h6" fontWeight="500">
                                            +261 34 00 000 00
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: 1 }}>
                                            Horaires
                                        </Typography>
                                        <Typography variant="h6" fontWeight="500">
                                            Lun - Sam: 8h00 - 18h00
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Right Side - Form */}
                            <Box
                                sx={{
                                    flex: 1.2,
                                    p: { xs: 4, md: 6 },
                                }}
                            >
                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    noValidate
                                >
                                    <Typography variant="h4" fontWeight="800" gutterBottom sx={{
                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        mb: 1
                                    }}>
                                        Envoyez un message
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mb: 4 }}
                                    >
                                        Remplissez le formulaire ci-dessous, nous vous répondrons rapidement.
                                    </Typography>

                                    <AnimatePresence>
                                        {success && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                style={{ marginBottom: 24 }}
                                            >
                                                <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>
                                                    Votre message a été envoyé avec succès !
                                                </Alert>
                                            </motion.div>
                                        )}
                                        {apiError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                style={{ marginBottom: 24 }}
                                            >
                                                <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                                                    {apiError}
                                                </Alert>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Nom complet"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                error={!!errors.name}
                                                helperText={errors.name}
                                                variant="outlined"
                                                disabled={loading}
                                                InputProps={{ sx: { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Adresse email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                variant="outlined"
                                                disabled={loading}
                                                InputProps={{ sx: { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Sujet"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                error={!!errors.subject}
                                                helperText={errors.subject}
                                                variant="outlined"
                                                disabled={loading}
                                                InputProps={{ sx: { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                error={!!errors.message}
                                                helperText={errors.message}
                                                variant="outlined"
                                                multiline
                                                rows={4}
                                                disabled={loading}
                                                InputProps={{ sx: { borderRadius: 3 } }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                component={motion.button}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                disabled={loading}
                                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                                sx={{
                                                    py: 1.5,
                                                    fontSize: "1.1rem",
                                                    fontWeight: "bold",
                                                    textTransform: "none",
                                                    borderRadius: 3,
                                                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                                                }}
                                            >
                                                {loading ? "Envoi en cours..." : "Envoyer le message"}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Container>
            </Box>
        </Box>
    );
};

export default Contact;
