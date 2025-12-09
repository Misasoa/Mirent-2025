import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import logo from "../../assets/horizontal.png";
import { useState } from "react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      if (res.ok) {
        alert("Message envoyé avec succès !");
        setEmail("");
        setMessage("");
      } else {
        alert("Erreur lors de l’envoi");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#0f172a",
        py: 6,
        borderTop: "1px solid #1e293b",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Infos contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              <img src={logo} alt="Mirent Location" style={{ height: "2em" }} />
            </Typography>
            <Typography color="gray">Email : mirent.mdg@gmail.com</Typography>
            <Typography color="gray">Tél : +261 38 13 690 04</Typography>
            <Typography color="gray"> LOT II P Ter Avaradoha</Typography>
            <Typography color="gray">Antananarivo, Madagascar</Typography>
          </Grid>

          {/* Formulaire de contact */}
          <Grid item xs={12} md={5} id="contact">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contactez-nous
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                label="Votre Email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Votre message"
                multiline
                rows={4}
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{ mb: 2, bgcolor: "white", borderRadius: 1 }}
              />
              <Button type="submit" variant="contained" color="primary">
                Envoyer
              </Button>
            </form>
          </Grid>

          {/* Google Map */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Notre position
            </Typography>
            <Box
              component="iframe"
              sx={{ border: 0, width: "100%", height: 200, borderRadius: 2 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31316.88226020886!2d47.5121196!3d-18.8791902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f08f3a0f15b6cf%3A0x83de4998c9244b9!2sAntananarivo!5e0!3m2!1sfr!2smg!4v1684367399624!5m2!1sfr!2smg"
              allowFullScreen
              loading="lazy"
            />
          </Grid>
        </Grid>

        {/* Footer bottom */}
        <Typography variant="body2" color="gray" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} MirentLocation. Tous droits réservés.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
