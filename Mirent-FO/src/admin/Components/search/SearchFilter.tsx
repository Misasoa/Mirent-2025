import React from "react";
import { Box, TextField, Button, InputAdornment, Tooltip } from "@mui/material";
import { LocationOn, CalendarToday, Search } from "@mui/icons-material";

const SearchFilters: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 2,
        backgroundColor: "#ffffff",
        borderRadius: 2,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        flexWrap: "wrap",
      }}
    >
      {/* Champ Ville */}
      <Tooltip title="Entrez une ville" placement="top">
        <TextField
          label="Ville"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
            },
          }}
        />
      </Tooltip>

      {/* Champ Date de départ */}
      <Tooltip title="Sélectionnez une date de départ" placement="top">
        <TextField
          label="Date de départ"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday color="secondary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover fieldset": {
                borderColor: "#ff4081",
              },
            },
          }}
        />
      </Tooltip>

      {/* Champ Date de retour */}
      <Tooltip title="Sélectionnez une date de retour" placement="top">
        <TextField
          label="Date de retour"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CalendarToday color="secondary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              transition: "all 0.3s ease-in-out",
              "&:hover fieldset": {
                borderColor: "#ff4081",
              },
            },
          }}
        />
      </Tooltip>

      {/* Bouton Rechercher */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<Search />}
        sx={{
          height: "100%",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "#1565c0",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        Rechercher
      </Button>
    </Box>
  );
};

export default SearchFilters;
