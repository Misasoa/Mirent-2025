import { Box, Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BuildIcon from "@mui/icons-material/Build";
import { motion } from "framer-motion";

const VehicleDetails: React.FC<{ vehicle: any; onClose: () => void }> = ({ vehicle, onClose }) => {
  const navigate = useNavigate();
  if (!vehicle) {
    return (
      <Box sx={{ p: 4, bgcolor: "#fff", borderRadius: 2, textAlign: "center" }}>
        <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: "#9ca3af", mb: 2 }} />
        <Typography variant="h6" sx={{ color: "#4b5563", mb: 2 }}>
          Véhicule non trouvé
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: "#f97316",
            color: "#fff",
            borderRadius: 2,
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": { bgcolor: "#ea580c" },
          }}
        >
          Fermer
        </Button>
      </Box>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <Card
        sx={{
          maxWidth: 500,
          borderRadius: 2,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <CloseIcon sx={{ color: "#0f172a" }} />
          </IconButton>
          <CardMedia
            component="img"
            height="200"
            image={vehicle.imageUrl || "https://via.placeholder.com/500x200 "}
            alt={`${vehicle.marque} ${vehicle.modele}`}
            sx={{ objectFit: "cover" }}
          />
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {vehicle.marque} {vehicle.modele}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip icon={<DirectionsCarIcon />} label={vehicle.type.type} color="info" variant="outlined" />
            <Chip
              icon={
                vehicle.status.status === "Disponible" ? (
                  <CheckCircleIcon />
                ) : vehicle.status.status === "Réservé" ? (
                  <CancelIcon />
                ) : (
                  <BuildIcon />
                )
              }
              label={vehicle.status.status}
              color={
                vehicle.status.status === "Disponible"
                  ? "success"
                  : vehicle.status.status === "Réservé"
                  ? "warning"
                  : "error"
              }
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Immatriculation: {vehicle.immatriculation}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Places: {vehicle.nombrePlace}
          </Typography>
        </CardContent>
        <CardActions sx={{ p: 3, pt: 0, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/voitures/${vehicle.id}/reserver`)}
            disabled={vehicle.status.status !== "Disponible"}
            sx={{
              bgcolor: "#f97316",
              color: "#fff",
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { bgcolor: "#ea580c" },
              "&:disabled": { bgcolor: "#ccc" },
            }}
          >
            Réserver Maintenant
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: "#d1d5db",
              color: "#4b5563",
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            Fermer
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};
export default VehicleDetails;