import { Box, Button, Grid, TextField, CircularProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

type ReservationFormProps = {
  onClose: () => void;
};

const ReservationForm = ({ onClose }: ReservationFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      startCity: "",
      returnCity: "",
      startDate: "",
      returnDate: "",
      pickupTime: "",
      returnTime: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface FormData {
    startCity: string;
    returnCity: string;
    startDate: string;
    returnDate: string;
    pickupTime: string;
    returnTime: string;
  }

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form Data:", data);
      setIsSubmitting(false);
      reset();
      onClose(); // Close the form after submission
    }, 1000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ color: "#0f172a" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="startCity"
            control={control}
            rules={{ required: "Ville de départ est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Ville de départ"
                variant="outlined"
                error={!!errors.startCity}
                helperText={errors.startCity?.message}
                InputLabelProps={{ style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="returnCity"
            control={control}
            rules={{ required: "Ville de retour est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Ville de retour"
                variant="outlined"
                error={!!errors.returnCity}
                helperText={errors.returnCity?.message}
                InputLabelProps={{ style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: "Date de départ est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Date de départ"
                type="date"
                InputLabelProps={{ shrink: true, style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="returnDate"
            control={control}
            rules={{ required: "Date de retour est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Date de retour"
                type="date"
                InputLabelProps={{ shrink: true, style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                error={!!errors.returnDate}
                helperText={errors.returnDate?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="pickupTime"
            control={control}
            rules={{ required: "Heure de prise en charge est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Heure de prise en charge"
                type="time"
                InputLabelProps={{ shrink: true, style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                error={!!errors.pickupTime}
                helperText={errors.pickupTime?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="returnTime"
            control={control}
            rules={{ required: "Heure de restitution est requise" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Heure de restitution"
                type="time"
                InputLabelProps={{ shrink: true, style: { color: "#0f172a" } }}
                InputProps={{ style: { color: "#0f172a" } }}
                error={!!errors.returnTime}
                helperText={errors.returnTime?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#3b82f6" },
                    "&:hover fieldset": { borderColor: "#2563eb" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                  "& .MuiFormHelperText-root": { color: "#d32f2f" },
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
            sx={{
              mt: 2,
              bgcolor: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              py: 1.5,
              "&:hover": { bgcolor: "#2563eb" },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Rechercher"
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReservationForm;
