import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Grid, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Prix, Region } from "../../../types/region";
import { useNavigate } from "react-router-dom";

type Client = { id: number; [key: string]: any };
type Vehicle = { id: number; [key: string]: any };

interface DevisForm {
  clientName: string;
  dateCreation: Date;
  numeroDevis: string;
  prixCarburant: number;
  prixTotal: number;
  remarque: string;
  items: DevisItem[];
}

interface DevisItem {
  devisId: number;
  vehiculeId: number;
  regionId: number;
  prixId: number;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  prixUnitaire: number;
  sousTotal: number;
}

const CreateDevis = () => {
  const [form, setForm] = useState<DevisForm>({
    clientName: "",
    dateCreation: new Date(),
    numeroDevis: "",
    prixTotal: 0,
    prixCarburant: 0,
    remarque: "",
    items: [
      {
        devisId: 0,
        vehiculeId: 0,
        regionId: 0,
        prixId: 0,
        dateDebut: "",
        dateFin: "",
        nombreJours: 0,
        prixUnitaire: 0,
        sousTotal: 0,
      },
    ],
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [prixs, setPrix] = useState<Prix[]>([]); // Assuming

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("http://localhost:3000/clients");
      const data = await response.json();
      setClients(data);
    };

    const fetchVehicles = async () => {
      const response = await fetch("http://localhost:3000/vehicles");
      const data = await response.json();
      setVehicles(data);
    };
    const fetchRegions = async () => {
      const response = await fetch("http://localhost:3000/regions");
      const data = await response.json();
      setRegions(data);
    };

    const fetchPrix = async () => {
      const response = await fetch("http://localhost:3000/prixs");
      const data = await response.json();
      console.log("Data prixs :", data);
      setPrix(data);
    };

    fetchClients();
    fetchVehicles();
    fetchRegions();
    fetchPrix();
  }, []);

  const calculateDays = () => {
    const d1 = dayjs(form.items[0].dateDebut);
    const d2 = dayjs(form.items[0].dateFin);
    const diff = d2.diff(d1, "day");
    return diff > 0 ? diff : 1;
  };

  // Handles top-level form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "clientId" || name === "client") {
      setForm((prev) => ({
        ...prev,
        clientId: Number(value),
      }));
    } else if (name === "referenceContrat" || name === "ref") {
      setForm((prev) => ({
        ...prev,
        referenceContrat: value,
      }));
    } else if (name === "numeroDevis") {
      setForm((prev) => ({
        ...prev,
        numeroDevis: value,
      }));
    } else if (name === "statut" || name === "Statut") {
      setForm((prev) => ({
        ...prev,
        statut: value,
      }));
    } else if (
      name === "vehiculeId" ||
      name === "vehicle" ||
      name === "dateDebut" ||
      name === "dateFin" ||
      name === "prixUnitaire"
    ) {
      setForm((prev) => ({
        ...prev,
        items: [
          {
            ...prev.items[0],
            vehiculeId:
              name === "vehiculeId" || name === "vehicle"
                ? Number(value)
                : prev.items[0].vehiculeId,
            dateDebut: name === "dateDebut" ? value : prev.items[0].dateDebut,
            dateFin: name === "dateFin" ? value : prev.items[0].dateFin,
            prixUnitaire:
              name === "prixUnitaire"
                ? Number(value)
                : prev.items[0].prixUnitaire,
          },
        ],
      }));
    }
  };

  // Envoi du devis à l'
  const handleSubmit = async () => {
    const days = calculateDays();
    const payload = {
      dateCreation: new Date(),
      numeroDevis: form.numeroDevis,
      prixCarburant: 0,
      prixTotal: days * Number(form.items[0].prixUnitaire),
      remarque: "",
      items: [
        {
          vehiculeId: Number(form.items[0].vehiculeId),
          regionId: 0,
          prixId: 0,
          devisId: 0,
          dateDebut: form.items[0].dateDebut,
          dateFin: form.items[0].dateFin,
          nombreJours: days,
          prixUnitaire: Number(form.items[0].prixUnitaire),
          sousTotal: days * Number(form.items[0].prixUnitaire),
        },
      ],
    };

    console.log("Payload envoyé :", payload);

    try {
      const response = await fetch("http://localhost:3000/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur backend :", data);
        alert("Erreur lors de l’enregistrement.");
      } else {
        alert("✅ Devis enregistré !");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Erreur réseau !");
    }
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      <Grid item xs={12}>
        <Typography> Ici vous créer un devis de votre location</Typography>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Date de création"
          type="date"
          name="dateCreation"
          InputLabelProps={{ shrink: true }}
          value={form.dateCreation.toISOString().split("T")[0]}
          onChange={handleChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          select
          label="Client"
          name="client"
          value={form.clientName}
          onChange={handleChange}
          fullWidth
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.lastName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          select
          label="Véhicule"
          name="vehicle"
          value={form.items[0].vehiculeId}
          onChange={handleChange}
          fullWidth
        >
          {vehicles.map((vehicle) => (
            <MenuItem key={vehicle.id} value={vehicle.id}>
              {vehicle.nom}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          select
          label="Région"
          name="regionId"
          value={form.items[0].regionId}
          onChange={(e) => {
            const regionId = Number(e.target.value);
            setForm((prev) => ({
              ...prev,
              items: [
                {
                  ...prev.items[0],
                  regionId,
                },
              ],
            }));
          }}
          fullWidth
        >
          {regions.map((region) => (
            <MenuItem key={region.id} value={region.id}>
              {region.nom_region}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={6}>
        <TextField
          type="date"
          label="Date de début"
          name="dateDebut"
          InputLabelProps={{ shrink: true }}
          value={form.items[0].dateDebut}
          onChange={handleChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          type="date"
          label="Date de fin"
          name="dateFin"
          InputLabelProps={{ shrink: true }}
          value={form.items[0].dateFin}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Nombre de jours"
          value={
            form.items[0].dateDebut && form.items[0].dateFin
              ? calculateDays()
              : 0
          }
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          type="number"
          label="Prix unitaire"
          name="prixUnitaire"
          value={form.items[0].prixUnitaire}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Prix carburant"
          name="prixCarburant"
          value={form.prixCarburant}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          type="number"
          label="Prix total"
          value={
            form.items[0].prixUnitaire &&
            form.items[0].dateDebut &&
            form.items[0].dateFin
              ? calculateDays() * Number(form.items[0].prixUnitaire)
              : 0
          }
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>

      <Grid item xs={6}>
        <TextField
          label="Remarque"
          name="remarque"
          value={form.remarque}
          onChange={handleChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <Button onClick={handleSubmit} variant="contained" fullWidth>
          Enregistrer le devis
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateDevis;
