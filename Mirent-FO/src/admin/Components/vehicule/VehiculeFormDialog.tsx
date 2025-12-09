import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    Avatar,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    Box,
    Typography,
    FormHelperText,
    SelectChangeEvent
} from '@mui/material';
import { Close, CloudUpload, Delete as DeleteIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../hooks';
import { RootState } from '../../../redux/store';
import { createVehicle, fetchVehicleStatuses, fetchVehicleTypes, updateVehicle, Vehicle } from '../../../redux/features/vehicle/vehiclesSlice';

interface VehicleFormDialogProps {
    open: boolean;
    onClose: () => void;
    vehicle: Vehicle | null;
}

const VehicleFormDialog: React.FC<VehicleFormDialogProps> = ({ open, onClose, vehicle }) => {
    const dispatch = useAppDispatch();
    const {
        vehiclesType,
        vehiclesStatus,
        vehiclesTypeLoading,
        vehiclesStatusLoading,
        vehiclesTypeError,
        vehiclesStatusError
    } = useSelector((state: RootState) => state.vehicles);

    const [formData, setFormData] = useState({
        nom: '',
        marque: '',
        modele: '',
        immatriculation: '',
        nombrePlace: 0,
        distance_moyenne: 0,
        derniere_visite: '',
        typeId: 0,
        statusId: 0
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (vehiclesType.length === 0) dispatch(fetchVehicleTypes());
            if (vehiclesStatus.length === 0) dispatch(fetchVehicleStatuses());

            if (vehicle) {
                setFormData({
                    nom: vehicle.nom,
                    marque: vehicle.marque,
                    modele: vehicle.modele,
                    immatriculation: vehicle.immatriculation,
                    nombrePlace: vehicle.nombrePlace,
                    distance_moyenne: vehicle.distance_moyenne || 0,
                    derniere_visite: vehicle.derniere_visite
                        ? new Date(vehicle.derniere_visite).toISOString().split('T')[0]
                        : '',
                    typeId: vehicle.type.id,
                    statusId: vehicle.status.id
                });
                setImagePreview(vehicle.imageUrl || null);
            } else {
                setFormData({
                    nom: '',
                    marque: '',
                    modele: '',
                    immatriculation: '',
                    nombrePlace: 0,
                    distance_moyenne: 0,
                    derniere_visite: '',
                    typeId: 0,
                    statusId: 0
                });
                setImagePreview(null);
                setFile(null);
            }
        }
    }, [open, vehicle, dispatch, vehiclesType.length, vehiclesStatus.length]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Convertir les champs numériques en nombres
        const processedValue = ['nombrePlace', 'distance_moyenne'].includes(name)
            ? parseInt(value, 10) || 0
            : value;

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            derniere_visite: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent<number>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value as string, 10)
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setFile(null);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.marque.trim()) newErrors.marque = 'La marque est requise';
        if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis';
        if (!formData.immatriculation.trim()) newErrors.immatriculation = "L'immatriculation est requise";
        if (formData.nombrePlace <= 0) newErrors.nombrePlace = 'Nombre de places invalide';
        if (formData.typeId <= 0) newErrors.typeId = 'Veuillez sélectionner un type';
        if (formData.statusId <= 0) newErrors.statusId = 'Veuillez sélectionner un statut';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            if (vehicle) {
                // Mise à jour - correspond à UpdateVehiculeDto
                const updateData: any = {
                    nom: formData.nom,
                    marque: formData.marque,
                    modele: formData.modele,
                    immatriculation: formData.immatriculation,
                    nombrePlace: formData.nombrePlace,
                    distance_moyenne: formData.distance_moyenne,
                    derniere_visite: formData.derniere_visite || undefined,
                    typeId: formData.typeId,
                    statusId: formData.statusId
                };

                // N'inclure que les champs qui ont changé
                const finalUpdateData: any = {};
                Object.keys(updateData).forEach(key => {
                    if (updateData[key] !== vehicle[key as keyof Vehicle]) {
                        finalUpdateData[key] = updateData[key];
                    }
                });

                await dispatch(updateVehicle({
                    id: vehicle.id,
                    data: finalUpdateData,
                    image: file || undefined
                }) as any);
            } else {
                // Création - correspond à CreateVehiculeDto
                const createData = {
                    nom: formData.nom,
                    marque: formData.marque,
                    modele: formData.modele,
                    immatriculation: formData.immatriculation,
                    nombrePlace: formData.nombrePlace,
                    distance_moyenne: formData.distance_moyenne,
                    derniere_visite: formData.derniere_visite || undefined,
                    typeId: formData.typeId,
                    statusId: formData.statusId,
                    image: file || undefined
                };

                await dispatch(createVehicle(createData) as any);
            }

            onClose();
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'disponible': return 'success.main';
            case 'en maintenance': return 'warning.main';
            case 'en cours d\'utilisation': return 'info.main';
            case 'hors service': return 'error.main';
            default: return 'text.secondary';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)' } }}
        >
            <DialogTitle sx={{
                bgcolor: 'primary.main',
                color: 'common.white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: 3
            }}>
                <Typography component="div" variant="h6" fontWeight="bold">
                    {vehicle ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    sx={{ color: 'common.white' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <DialogContent dividers sx={{ py: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <input
                                    accept="image/*"
                                    id="vehicle-image-upload"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />

                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={imagePreview || undefined}
                                        sx={{
                                            width: 200,
                                            height: 140,
                                            bgcolor: 'grey.100',
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            mb: 2
                                        }}
                                        variant="rounded"
                                    >
                                        {!imagePreview && <CloudUpload sx={{ fontSize: 40, color: 'text.secondary' }} />}
                                    </Avatar>

                                    {imagePreview && (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: -8,
                                                right: -8,
                                                bgcolor: 'error.main',
                                                color: 'common.white',
                                                '&:hover': { bgcolor: 'error.dark' }
                                            }}
                                            onClick={handleRemoveImage}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>

                                <label htmlFor="vehicle-image-upload">
                                    <Button
                                        component="span"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<CloudUpload />}
                                        size="small"
                                    >
                                        {imagePreview ? 'Changer l\'image' : 'Ajouter une image'}
                                    </Button>
                                </label>

                                <Typography variant="caption" color="text.secondary" mt={1} textAlign="center">
                                    Formats supportés: JPG, PNG<br />
                                    Taille max: 5MB
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nom du véhicule"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        error={!!errors.nom}
                                        helperText={errors.nom}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Marque"
                                        name="marque"
                                        value={formData.marque}
                                        onChange={handleChange}
                                        error={!!errors.marque}
                                        helperText={errors.marque}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Modèle"
                                        name="modele"
                                        value={formData.modele}
                                        onChange={handleChange}
                                        error={!!errors.modele}
                                        helperText={errors.modele}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Immatriculation"
                                        name="immatriculation"
                                        value={formData.immatriculation}
                                        onChange={handleChange}
                                        error={!!errors.immatriculation}
                                        helperText={errors.immatriculation}
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Nombre de places"
                                        name="nombrePlace"
                                        type="number"
                                        value={formData.nombrePlace}
                                        onChange={handleChange}
                                        error={!!errors.nombrePlace}
                                        helperText={errors.nombrePlace}
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ min: 1, max: 50 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Distance moyenne (km)"
                                        name="distance_moyenne"
                                        type="number"
                                        value={formData.distance_moyenne}
                                        onChange={handleChange}
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ min: 0 }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.typeId} size="small">
                                        <InputLabel id="type-label">Type de véhicule</InputLabel>
                                        <Select
                                            labelId="type-label"
                                            name="typeId"
                                            value={formData.typeId}
                                            onChange={handleSelectChange}
                                            label="Type de véhicule"
                                        >
                                            <MenuItem value={0} disabled>Sélectionnez un type</MenuItem>
                                            {vehiclesType.map(type => (
                                                <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.typeId && <FormHelperText>{errors.typeId}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Dernière visite"
                                        type="date"
                                        name="derniere_visite"
                                        value={formData.derniere_visite}
                                        onChange={handleDateChange}
                                        variant="outlined"
                                        size="small"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControl fullWidth error={!!errors.statusId} size="small">
                                        <InputLabel id="status-label">Statut</InputLabel>
                                        <Select
                                            labelId="status-label"
                                            name="statusId"
                                            value={formData.statusId}
                                            onChange={handleSelectChange}
                                            label="Statut"
                                        >
                                            <MenuItem value={0} disabled>Sélectionnez un statut</MenuItem>
                                            {vehiclesStatus.map(status => (
                                                <MenuItem
                                                    key={status.id}
                                                    value={status.id}
                                                    sx={{ color: getStatusColor(status.status) }}
                                                >
                                                    {status.status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.statusId && <FormHelperText>{errors.statusId}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {vehiclesTypeError && (
                                <Typography color="error" variant="body2" mt={2}>
                                    Erreur lors du chargement des types: {vehiclesTypeError}
                                </Typography>
                            )}

                            {vehiclesStatusError && (
                                <Typography color="error" variant="body2" mt={1}>
                                    Erreur lors du chargement des statuts: {vehiclesStatusError}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ py: 2, px: 3, bgcolor: 'grey.50' }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={onClose}
                        sx={{ borderRadius: 1 }}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting || vehiclesTypeLoading || vehiclesStatusLoading}
                        sx={{ borderRadius: 1, minWidth: 120 }}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : vehicle ? (
                            'Mettre à jour'
                        ) : (
                            'Ajouter'
                        )}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default VehicleFormDialog;