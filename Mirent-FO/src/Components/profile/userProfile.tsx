import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
// import loginImage from "../../assets/2.jpg";
import logo from "../../assets/horizontal.png";


import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const UserProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const navigate = useNavigate();

  // Récupérer les informations de l'utilisateur depuis Redux
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  // Utiliser les données de Redux s'ils existent, sinon des valeurs par défaut
  const user = {
    firstName: authUser?.firstName || "Admin",
    lastName: authUser?.lastName || "Utilisateur",
    email: authUser?.email || "admin@example.com",
    // Ces champs ne sont pas encore dans le User de Redux, on garde des placeholders ou on gère l'absence
    phoneNumber: "", // Pas de téléphone dans le User auth pour le moment
    address: "",     // Pas d'adresse dans le User auth pour le moment
    profilePicture: "https://via.placeholder.com/150",
  };

  const handleEditProfile = () => {
    console.log("Modifier le profil");
    // navigate("/edit-profile");
  };

  const handleChangePassword = () => {
    console.log("Changer le mot de passe");
    // navigate("/change-password");
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        bgcolor="white"
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
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
        sx={{ height: "56px" }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <RouterLink to="/acceuil" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                maxWidth: "150px",
                display: "block",
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
          mt: "56px",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            width: "100%",
            maxWidth: 900,
            maxHeight: "calc(100vh - 56px)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            overflowY: "auto",
          }}
        >
          {/*Photo de profil*/}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: isMobile ? 3 : 4,
              bgcolor: theme.palette.grey[50],
              borderRight: isMobile ? "none" : `1px solid ${theme.palette.divider}`,
              borderBottom: !isMobile ? "none" : `1px solid ${theme.palette.divider}`,
            }}
          >
            <Avatar
              alt={`${user.firstName} ${user.lastName}`}
              src={user.profilePicture}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
            {user.phoneNumber && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                Téléphone: {user.phoneNumber}
              </Typography>
            )}
          </Box>

          {/* Détails du profil et actions */}
          <Box sx={{ flex: 2, p: isMobile ? 3 : 4 }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Votre Profil
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Informations détaillées de votre compte
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Prénom:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.firstName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nom:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.lastName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Adresse Email:
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {user.email}
                  </Typography>
                </Box>
                {user.address && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Adresse:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {user.address}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditProfile}
                  sx={{ borderRadius: 3 }}
                >
                  Modifier le profil
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleChangePassword}
                  sx={{ borderRadius: 3 }}
                >
                  Changer le mot de passe
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserProfile;