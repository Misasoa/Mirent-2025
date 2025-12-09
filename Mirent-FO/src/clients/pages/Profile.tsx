import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
    Avatar,
    Divider,
    useTheme,
    IconButton,
    Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";

interface UserInfo {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    role: string;
}

const Profile = () => {
    const theme = useTheme();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
        // Récupérer les informations utilisateur depuis localStorage
        const storedUserInfo = localStorage.getItem("user_info");
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedUserInfo);
            setEditedInfo(parsedUserInfo);
        }
    }, []);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedInfo(userInfo);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (editedInfo) {
            // Sauvegarder dans localStorage
            localStorage.setItem("user_info", JSON.stringify(editedInfo));
            setUserInfo(editedInfo);
            setIsEditing(false);
            setSuccessMessage(true);

            // Masquer le message après 3 secondes
            setTimeout(() => {
                setSuccessMessage(false);
            }, 3000);
        }
    };

    const handleChange = (field: keyof UserInfo, value: string) => {
        if (editedInfo) {
            setEditedInfo({ ...editedInfo, [field]: value });
        }
    };

    const getInitials = () => {
        if (userInfo) {
            const prenomInitial = userInfo.prenom?.charAt(0) || "";
            const nomInitial = userInfo.nom?.charAt(0) || "";
            const initials = `${prenomInitial}${nomInitial}`.toUpperCase();
            return initials || "U";
        }
        return "U";
    };

    if (!userInfo) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <Container sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography>Chargement...</Typography>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f8fafc" }}>
            <Navbar />

            <Container sx={{ flexGrow: 1, py: { xs: 4, md: 8 }, mt: 8 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header avec Avatar */}
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            mb: 3,
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            color: "white",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <Avatar
                                sx={{
                                    width: { xs: 80, md: 100 },
                                    height: { xs: 80, md: 100 },
                                    fontSize: { xs: "2rem", md: "2.5rem" },
                                    bgcolor: "white",
                                    color: theme.palette.primary.main,
                                    fontWeight: "bold",
                                }}
                            >
                                {getInitials()}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" gutterBottom>
                                    {userInfo.prenom || "Prénom"} {userInfo.nom || "Nom"}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    {userInfo.email}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                                    Membre depuis {new Date().getFullYear()}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Success Message */}
                    {successMessage && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Vos informations ont été mises à jour avec succès !
                        </Alert>
                    )}

                    {/* Informations personnelles */}
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                            <Typography variant="h5" fontWeight="bold">
                                Informations personnelles
                            </Typography>
                            {!isEditing ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={handleEdit}
                                    sx={{ textTransform: "none" }}
                                >
                                    Modifier
                                </Button>
                            ) : (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton color="error" onClick={handleCancel} size="small">
                                        <CancelIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={handleSave} size="small">
                                        <SaveIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={3}>
                            {/* Prénom */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <PersonIcon color="action" />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Prénom"
                                            value={editedInfo?.prenom || ""}
                                            onChange={(e) => handleChange("prenom", e.target.value)}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Prénom
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {userInfo.prenom || "Non renseigné"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            {/* Nom */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <PersonIcon color="action" />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Nom"
                                            value={editedInfo?.nom || ""}
                                            onChange={(e) => handleChange("nom", e.target.value)}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Nom
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {userInfo.nom || "Non renseigné"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            {/* Email */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <EmailIcon color="action" />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            type="email"
                                            value={editedInfo?.email || ""}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {userInfo.email}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            {/* Téléphone */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <PhoneIcon color="action" />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Téléphone"
                                            value={editedInfo?.telephone || ""}
                                            onChange={(e) => handleChange("telephone", e.target.value)}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Téléphone
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {userInfo.telephone || "Non renseigné"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>

                            {/* Adresse */}
                            <Grid item xs={12}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <HomeIcon color="action" />
                                    {isEditing ? (
                                        <TextField
                                            fullWidth
                                            label="Adresse"
                                            multiline
                                            rows={2}
                                            value={editedInfo?.adresse || ""}
                                            onChange={(e) => handleChange("adresse", e.target.value)}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Adresse
                                            </Typography>
                                            <Typography variant="body1" fontWeight="500">
                                                {userInfo.adresse || "Non renseignée"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {isEditing && (
                            <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleCancel}
                                    sx={{ textTransform: "none" }}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    sx={{ textTransform: "none" }}
                                >
                                    Enregistrer les modifications
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Profile;
