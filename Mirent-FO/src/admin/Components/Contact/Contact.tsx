import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mirent.mdg@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMap = () => {
    window.open(
      "https://www.google.com/maps?q=LOT+II+P+136+Ter+Avaradoha+Antananarivo+101",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        minHeight: "100vh",
        py: 8,
        px: isMobile ? 2 : 4
      }}
    >
      <Box textAlign="center" maxWidth="800px" mx="auto">
        <Typography
          variant="h4"
          fontWeight="600"
          gutterBottom
          color="primary"
          sx={{
            mb: 2,
            fontSize: isMobile ? "1.75rem" : "2.125rem"
          }}
        >
          Contactez-nous
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Notre équipe est à votre disposition pour répondre à toutes vos questions
        </Typography>

        <Grid container spacing={3} mt={2}>
          {/* Adresse */}
          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mx: "auto",
                    mb: 2
                  }}
                >
                  <HomeIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Notre Adresse
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: "40px" }}
                >
                  LOT II P 136 Ter Avaradoha Antananarivo 101
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LocationOnIcon />}
                  onClick={openMap}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Voir sur la carte
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Téléphone */}
          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mx: "auto",
                    mb: 2
                  }}
                >
                  <PhoneIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Téléphone
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: "40px" }}
                >
                  +261 38 13 690 04
                </Typography>
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<CallIcon />}
                  href="tel:+261 38 13 690 04"
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  Appeler maintenant
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.shadows[4],
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    mx: "auto",
                    mb: 2
                  }}
                >
                  <EmailIcon fontSize="medium" />
                </Box>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Email
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2, minHeight: "40px" }}
                >
                  mirent.mdg@gmail.com
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyEmail}
                  fullWidth
                  sx={{ borderRadius: 2 }}
                >
                  {copied ? "Copié !" : "Copier l'email"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box mt={8}>
          <Typography variant="h6" fontWeight="700" color="primary">
            CHEZ MIRENT
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            ©{new Date().getFullYear()} Tous droits réservés
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;