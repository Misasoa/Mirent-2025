import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  addPaiement,
  PaymentMethod,
  resetPaiementState,
} from "../../../redux/features/paiement/paiementSlice";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

const AddPaiementForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, message } = useAppSelector(
    (state) => state.paiements
  );
  const [formData, setFormData] = useState({
    bdcReference: "",
    montant: "",
    methode: PaymentMethod.ESPECES,
    referenceTransaction: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addPaiement({
        bdcReference: formData.bdcReference,
        montant: parseFloat(formData.montant),
        methode: formData.methode,
        reference: formData.referenceTransaction || undefined,
      })
    );
  };

  const handleReset = () => {
    setFormData({
      bdcReference: "",
      montant: "",
      methode: PaymentMethod.ESPECES,
      referenceTransaction: "",
    });
    dispatch(resetPaiementState());
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <PaymentIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={600}>
          Ajouter un Paiement
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Référence Bon de Commande"
                value={formData.bdcReference}
                onChange={(e) =>
                  setFormData({ ...formData, bdcReference: e.target.value })
                }
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Montant"
                type="number"
                inputProps={{ step: "0.01" }}
                value={formData.montant}
                onChange={(e) =>
                  setFormData({ ...formData, montant: e.target.value })
                }
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Méthode de Paiement"
                value={formData.methode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    methode: e.target.value as PaymentMethod,
                  })
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value={PaymentMethod.ESPECES}>Espèces</MenuItem>
                <MenuItem value={PaymentMethod.MOBILE_MONEY}>
                  Mobile Money
                </MenuItem>
                <MenuItem value={PaymentMethod.CARTE_BANCAIRE}>
                  Carte Bancaire
                </MenuItem>
              </TextField>
            </Grid>

            {(formData.methode === PaymentMethod.MOBILE_MONEY ||
              formData.methode === PaymentMethod.CARTE_BANCAIRE) && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Référence Transaction"
                  value={formData.referenceTransaction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referenceTransaction: e.target.value,
                    })
                  }
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Ajouter Paiement"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>

        {isSuccess && (
          <Box sx={{ mt: 3 }}>
            <Alert
              severity="success"
              icon={<CheckCircleIcon />}
              action={
                <Button color="inherit" size="small" onClick={handleReset}>
                  Nouveau
                </Button>
              }
            >
              Paiement ajouté avec succès!
            </Alert>
          </Box>
        )}

        {isError && (
          <Box sx={{ mt: 3 }}>
            <Alert severity="error">Erreur: {message}</Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AddPaiementForm;
