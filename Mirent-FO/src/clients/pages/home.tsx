import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  useTheme,
  alpha,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import image from "../../assets/bg.jpeg";
import citadineImg from "../../assets/citadine.png";
import luxuryImg from "../../assets/luxury.png";
import offroad4x4Img from "../../assets/4x4.png";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import ReservationForm from "../Components/ReservationForm";
import Footer from "../Components/Footer";

const ClientHome = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [showForm, setShowForm] = useState(false);

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const vehicles = [
    {
      id: 1,
      name: "Citadines",
      desc: "Parfaites pour la ville, économiques et faciles à conduire.",
      image: citadineImg,
    },
    {
      id: 2,
      name: "4x4",
      desc: "Puissance et robustesse pour toutes vos aventures tout-terrain.",
      image: offroad4x4Img,
    },
    {
      id: 3,
      name: "Véhicules de Luxe",
      desc: "Élégance et confort premium pour vos déplacements d'exception.",
      image: luxuryImg,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      {/* HERO SECTION */}
      <Box
        id="hero"
        sx={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mt: { xs: 8, md: 8 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: alpha("#000", 0.5), // Dark overlay for text readability
            zIndex: 1,
          },
        }}
      >
        <Container sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {!showForm ? (
              <Grid item xs={12} md={10} lg={8} textAlign="center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    fontWeight="800"
                    sx={{
                      color: "white",
                      mb: 2,
                      fontSize: { xs: "2.5rem", md: "4rem" },
                      textShadow: "0px 4px 20px rgba(0,0,0,0.5)",
                    }}
                  >
                    Explorez Madagascar en toute liberté
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255,255,255,0.9)",
                      mb: 5,
                      fontWeight: 500,
                      maxWidth: "800px",
                      mx: "auto",
                      textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
                    }}
                  >
                    Une large gamme de véhicules fiables et confortables pour tous vos trajets.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowForm(true)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "white",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      px: 6,
                      py: 2,
                      borderRadius: "50px",
                      textTransform: "none",
                      boxShadow: "0 8px 20px rgba(59, 130, 246, 0.5)",
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 25px rgba(59, 130, 246, 0.6)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Réserver Maintenant
                  </Button>
                </motion.div>
              </Grid>
            ) : (
              <Grid item xs={12} md={8} lg={6}>
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Paper
                    elevation={24}
                    sx={{
                      p: { xs: 3, sm: 4 },
                      borderRadius: 4,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      position: "relative",
                      maxHeight: "85vh",
                      overflowY: "auto",
                    }}
                  >
                    <IconButton
                      onClick={() => setShowForm(false)}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "text.secondary",
                        "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.1), color: theme.palette.error.main },
                      }}
                    >
                      <CloseIcon />
                    </IconButton>

                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      align="center"
                      sx={{ mb: 3, color: "text.primary" }}
                    >
                      Votre Réservation
                    </Typography>

                    <ReservationForm onClose={() => setShowForm(false)} />
                  </Paper>
                </motion.div>
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>

      {/* AVANTAGES SECTION */}
      <Box sx={{ py: 10, bgcolor: "#f8fafc" }}>
        <Container>
          <Typography
            variant="h3"
            fontWeight="bold"
            align="center"
            sx={{ mb: 2, color: "#1e293b" }}
          >
            Pourquoi nous choisir ?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 8, maxWidth: "700px", mx: "auto" }}
          >
            Nous nous engageons à vous offrir la meilleure expérience de location.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                icon: <DirectionsCarIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
                title: "Véhicules Récents",
                desc: "Une flotte moderne et régulièrement entretenue pour votre sécurité.",
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
                title: "Sécurité Garantie",
                desc: "Assurance tous risques incluse pour rouler l'esprit tranquille.",
              },
              {
                icon: <SupportAgentIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
                title: "Support 24/7",
                desc: "Une équipe dédiée disponible à tout moment pour vous assister.",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "white",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                      borderColor: "transparent",
                    },
                  }}
                >
                  <Box sx={{ mb: 3 }}>{item.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" lineHeight={1.7}>
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* VÉHICULES SHOWCASE (3 IMAGES) */}
      <Box sx={{ py: 10, bgcolor: "#0f172a", color: "white" }}>
        <Container>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Nos Véhicules en Vedette
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
              Découvrez notre sélection de véhicules prêts à partir.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "#1e293b", // Dark card background
                    color: "white",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={vehicle.image}
                    alt={vehicle.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {vehicle.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", mb: 2 }}>
                      {vehicle.desc}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/list-vehicule")}
                      sx={{
                        color: "#3b82f6",
                        borderColor: "#3b82f6",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: alpha("#3b82f6", 0.1),
                          borderColor: "#60a5fa",
                        },
                      }}
                    >
                      Voir Détails
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="text"
              onClick={() => navigate("/list-vehicule")}
              sx={{
                color: "white",
                fontSize: "1.1rem",
                textTransform: "none",
                "&:hover": { color: "#60a5fa", bgcolor: "transparent" },
              }}
            >
              Voir tout le catalogue &rarr;
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA SECTION */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Prêt à prendre la route ?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.9 }}>
            Réservez votre véhicule dès aujourd'hui et profitez de nos meilleurs tarifs.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/list-vehicule")}
            sx={{
              bgcolor: "white",
              color: theme.palette.primary.main,
              px: 5,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderRadius: "50px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#f8fafc",
              },
            }}
          >
            Commencer la réservation
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default ClientHome;
