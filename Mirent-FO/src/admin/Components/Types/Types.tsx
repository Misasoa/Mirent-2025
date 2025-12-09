import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  styled,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GetAppIcon from "@mui/icons-material/GetApp";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { RootState, AppDispatch } from "../../../redux/store";
import {
  fetchVehicleTypes,
  addVehicleType,
  updateVehicleType,
  deleteVehicleType,
  VehicleType as VehicleTypeState,
} from "../../../redux/features/vehicle/vehiclesSlice";

// Couleurs personnalisées
const primaryColor = "#1976d2";
const secondaryColor = "#f5f7fa";
const textColor = "#333";
const errorColor = "#d32f2f";

// Styles
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: secondaryColor,
  minHeight: "100vh",
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));

const SearchField = styled(TextField)(({}) => ({
  width: "300px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#e0e0e0" },
    "&:hover fieldset": { borderColor: primaryColor },
    "&.Mui-focused fieldset": { borderColor: primaryColor },
  },
  "& .MuiInputBase-input": { padding: "10px 14px", fontSize: "14px" },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  borderRadius: "4px",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

interface VehicleType {
  id: number;
  type: string;
}

const VehicleTypes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { vehiclesType, vehiclesTypeLoading, vehiclesTypeError } = useSelector(
    (state: RootState) => state.vehicles
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState("");
  const [editingVehicleType, setEditingVehicleType] =
    useState<VehicleType | null>(null);
  const [deletingVehicleTypeId, setDeletingVehicleTypeId] = useState<
    number | null
  >(null);

  // Fetch types au montage
  useEffect(() => {
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  // Filtrage avec useMemo
  const filteredTypes = useMemo(() => {
    return vehiclesType.filter((t) =>
      t.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, vehiclesType]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleOpenAddDialog = () => {
    setNewVehicleType("");
    setOpenAddDialog(true);
  };
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleAddVehicleType = () => {
    if (newVehicleType.trim()) {
      dispatch(addVehicleType({ type: newVehicleType } as VehicleTypeState));
      handleCloseAddDialog();
    }
  };

  const handleOpenEditDialog = (type: VehicleType) => {
    setEditingVehicleType(type);
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setEditingVehicleType(null);
    setOpenEditDialog(false);
  };
  const handleEditVehicleType = () => {
    if (editingVehicleType && editingVehicleType.type.trim()) {
      dispatch(updateVehicleType({ type: editingVehicleType } as any));
      handleCloseEditDialog();
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeletingVehicleTypeId(id);
    setOpenDeleteDialog(true);
  };
  const handleCloseDeleteDialog = () => {
    setDeletingVehicleTypeId(null);
    setOpenDeleteDialog(false);
  };
  const handleDeleteVehicleType = () => {
    if (deletingVehicleTypeId !== null) {
      dispatch(deleteVehicleType(deletingVehicleTypeId));
      handleCloseDeleteDialog();
    }
  };

  const handleExportCSV = () => {
    const csvData = filteredTypes.map((t) => `${t.id},${t.type}`).join("\n");
    const blob = new Blob(["ID,Type\n" + csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vehicle_types.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: textColor, fontWeight: 600, mb: 1 }}
      >
        Gestion des Types de Véhicules
      </Typography>
      <Typography variant="body2" sx={{ color: textColor, mb: 3 }}>
        Gérez les types de véhicules : ajouter, modifier ou supprimer des types.
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box display="flex" gap={2}>
          <SearchField
            variant="outlined"
            placeholder="Rechercher un type..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#888" }} />
                </InputAdornment>
              ),
            }}
          />
          <ActionButton
            variant="outlined"
            startIcon={<GetAppIcon />}
            onClick={handleExportCSV}
            sx={{
              borderColor: "#e0e0e0",
              color: textColor,
              "&:hover": { borderColor: primaryColor, color: primaryColor },
            }}
          >
            Exporter CSV
          </ActionButton>
        </Box>
        <ActionButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: primaryColor,
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Ajouter un type
        </ActionButton>
      </Box>

      {vehiclesTypeLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress sx={{ color: primaryColor }} />
        </Box>
      ) : vehiclesTypeError ? (
        <Typography color="error" align="center" sx={{ mt: 4 }}>
          {vehiclesTypeError}
        </Typography>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 600, color: textColor }}>
                    Type
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: textColor }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography color={textColor}>
                        Aucun type de véhicule trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTypes
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((type) => (
                      <TableRow
                        key={type.id}
                        sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                      >
                        <TableCell sx={{ color: textColor }}>
                          {type.type}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleOpenEditDialog(type)}
                            sx={{ color: primaryColor }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleOpenDeleteDialog(type.id)}
                            sx={{ color: errorColor }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTypes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page :"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            sx={{
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                { color: textColor },
            }}
          />
        </>
      )}

      {/* Dialogs */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ajouter un type de véhicule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type de véhicule"
            fullWidth
            variant="outlined"
            value={newVehicleType}
            onChange={(e) => setNewVehicleType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleAddVehicleType}
            sx={{ backgroundColor: primaryColor }}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Modifier le type de véhicule</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Type de véhicule"
            fullWidth
            variant="outlined"
            value={editingVehicleType?.type || ""}
            onChange={(e) =>
              setEditingVehicleType((prev) =>
                prev ? { ...prev, type: e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleEditVehicleType}
            sx={{ backgroundColor: primaryColor }}
            disabled={!editingVehicleType?.type.trim()}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce type de véhicule ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button
            onClick={handleDeleteVehicleType}
            autoFocus
            sx={{ color: errorColor }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VehicleTypes;
