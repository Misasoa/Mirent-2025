import React, { useState, useEffect, useRef, forwardRef, use } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip,
  Collapse,
  styled,
  IconButton,
  useMediaQuery,
  useTheme,
  Typography,
  Avatar,
  Badge,
  Popover,
  ListSubheader,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Home,
  ShoppingCart,
  ReceiptLong,
  DirectionsCar,
  People,
  ContactMail,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Add as AddIcon,
  List as ListIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  HighlightOff as HighlightOffIcon,
  RequestQuote as RequestQuoteIcon,
  LocalShipping,
  Storefront,
  Payment,
  Logout,
} from "@mui/icons-material";

import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/horizontal.png";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import { useAppDispatch } from "../../../hooks";

interface SidebarProps {
  onCollapseChange: (collapsed: boolean) => void;
}

// Couleurs personnalisées
const primaryColor = "#1565c0";
const secondaryColor = "e8f3ff";
const textColor = "#444";
const iconColor = "#777";
const activeIconColor = "#1565c0";

interface NavLinkWithRefProps extends LinkProps {
  selected?: boolean;
}

// Composant NavLinkButton corrigé avec forwardRef
const NavLinkWithRef = React.forwardRef<HTMLAnchorElement, NavLinkWithRefProps>(
  ({ to, selected, ...rest }, ref) => (
    <ListItemButton
      component={RouterLink}
      to={to}
      ref={ref}
      selected={selected}
      {...rest}
    />
  )
);

const NavLinkButton = styled(NavLinkWithRef)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    margin: theme.spacing(0.5, 1),
    padding: theme.spacing(1, 2),
    borderRadius: "8px",
    transition: "all 0.2s ease-in-out",
    color: textColor,
    "& .MuiListItemIcon-root": {
      color: selected ? activeIconColor : iconColor,
      minWidth: "40px",
      transition: "color 0.2s ease-in-out",
    },
    "& .MuiListItemText-primary": {
      fontWeight: "500",
      fontSize: "14px",
      color: selected ? activeIconColor : textColor,
    },
    "&:hover": {
      backgroundColor: secondaryColor,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: primaryColor,
      },
    },
    ...(selected && {
      backgroundColor: "#f0f7ff",
      "& .MuiListItemText-primary": {
        fontWeight: "600",
      },
    }),
  })
);

NavLinkButton.displayName = "NavLinkButton";

interface Notification {
  id: number;
  type: string;
  message: string;
  payload: any;
  createdAt: string;
  isRead: boolean;
}

// URL de base de votre API NestJS
const API_BASE_URL = "http://localhost:3000";
const Sidebar: React.FC<SidebarProps> = ({ onCollapseChange }) => {
  const [openClients, setOpenClients] = useState(false);
  const [openVehicules, setOpenVehicules] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // État pour la boîte de dialogue de confirmation

  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const unreadNotificationsCount = notifications.filter(
    (notif) => !notif.isRead
  ).length;

  /**
   * Récupère les notifications depuis le backend.
   */
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      const data: Notification[] = await response.json();
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    }
  };

  /**
   * Marque une notification spécifique comme lue sur le backend.
   * Met à jour l'état local après succès.
   * @param id L'ID de la notification à marquer comme lue.
   */
  const markNotificationAsRead = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error(
        `Erreur lors du marquage de la notification ${id} comme lue:`,
        error
      );
    }
  };

  /**
   * Marque toutes les notifications non lues comme lues sur le backend.
   * Met à jour l'état local après succès.
   */
  const markAllNotificationsAsRead = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        error
      );
    }
  };

  //supprimer l'Id d'une notification spécifique
  const deleteNotification = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la notification ${id}:`,
        error
      );
    }
  };

  // Effet pour gérer l'effondrement de la barre latérale sur les petits écrans
  useEffect(() => {
    setIsCollapsed(isSmallScreen);
    onCollapseChange(isSmallScreen);
  }, [isSmallScreen, onCollapseChange]);

  // Effet pour mettre à jour l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effet pour récupérer les notifications au chargement et les rafraîchir périodiquement
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleCollapse = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };
  // --- Gestionnaires d'événements UI ---

  const handleCommandeClick = () => {
    handleToggleCollapse(setOpenCommande);
  };

  const handleVehiculesClick = () => {
    handleToggleCollapse(setOpenVehicules);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapseChange(!isCollapsed);
  };

  const [openProformatSubmenu, setOpenProformatSubmenu] = useState(false);
  const handleProformatClick = () => {
    setOpenProformatSubmenu(!openProformatSubmenu);
  };

  const handleNotificationsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  // Les fonctions de gestion des actions sur les notifications sont maintenant des wrappers
  // autour des fonctions asynchrones d'appel API.
  const handleMarkAllAsReadClick = () => {
    markAllNotificationsAsRead();
  };

  const handleMarkAsReadClick = (id: number) => {
    markNotificationAsRead(id);
  };
  // Handler for deleting a single notification
  const handleDeleteNotificationClick = (
    event: React.MouseEvent,
    id: number
  ) => {
    event.stopPropagation();
    deleteNotification(id);
  };

  const openNotificationsPopover = Boolean(anchorEl);
  const id = openNotificationsPopover ? "notifications-popover" : undefined;

  //appel des API pour la deconnexion
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/utilisateurs/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      navigate("/admin/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      alert("Échec de la déconnexion. Veuillez réessayer.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_info");
      navigate("/admin/login");
    }
  };

  const renderSubheader = (text: string) => (
    <ListSubheader
      component="div"
      sx={{
        bgcolor: "transparent",
        color: "text.secondary",
        fontWeight: "bold",
        fontSize: "12px",
        lineHeight: "2.5",
        textTransform: "uppercase",
        display: isCollapsed ? "none" : "block",
        pl: 3,
      }}
    >
      {text}
    </ListSubheader>
  );

  const isSelected = (path: string) =>
    pathname === path || (path !== "/admin/home" && pathname.startsWith(path));

  return (
    <React.Fragment>
      {/* En-tête sticky avec le logo */}
      <Box
        bgcolor="white"
        p={1}
        pl={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1100}
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
        sx={{ height: "56px" }}
      >
        {/* Logo + Recherche */}
        <Box display="flex" alignItems="center" gap={20} width="100%">
          {isSmallScreen && (
            <IconButton
              onClick={toggleCollapse}
              sx={{ display: { xs: "flex", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {/* Logo */}
          <RouterLink to="/acceuil" style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                maxWidth: { xs: "100px", sm: "150px" },
                display: "block",
              }}
            />
          </RouterLink>

          {/* Barre de recherche */}
          <Box position="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              style={{
                padding: "6px 10px",
                paddingLeft: "35px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "180px",
                fontSize: "14px",
              }}
            />
            <SearchIcon
              sx={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "20px",
              }}
            />
          </Box>
        </Box>

        {/* Date, Notification, Avatar */}
        <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 3 }} pr={2}>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography variant="body2" color="text.secondary">
              {currentTime.toLocaleString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                ...(window.innerWidth > 600 && {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              })}
            </Typography>
          </Box>
          {/* Bouton de notification */}
          <IconButton
            aria-describedby={id}
            onClick={handleNotificationsClick}
            ref={notificationButtonRef}
            size="small"
          >
            <Badge badgeContent={unreadNotificationsCount} color="error">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
          {/* Popover pour afficher les notifications */}
          <Popover
            id={id}
            open={openNotificationsPopover}
            anchorEl={anchorEl}
            onClose={handleCloseNotifications}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                width: { xs: "90vw", sm: "400px" },
                maxWidth: "400px",
                maxHeight: "60vh",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <Box p={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Notifications
                </Typography>
                <IconButton
                  onClick={handleMarkAllAsReadClick}
                  disabled={unreadNotificationsCount === 0}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography variant="caption" ml={0.5}>
                    Tout lire
                  </Typography>
                </IconButton>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucune nouvelle notification.
                </Typography>
              ) : (
                <List dense sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {notifications.map((notif) => (
                    <ListItemButton
                      key={notif.id}
                      onClick={() => handleMarkAsReadClick(notif.id)}
                      sx={{
                        backgroundColor: notif.isRead ? "#fff" : "#e3f2fd",
                        borderRadius: "4px",
                        mb: 1,
                        "&:hover": {
                          backgroundColor: notif.isRead ? "#f5f5f5" : "#d0e7fc",
                        },
                        display: "flex", // Ensure flex display for aligning items
                        alignItems: "center", // Center items vertically
                        justifyContent: "space-between", // Space out content and delete button
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <ListItemIcon sx={{ minWidth: "30px" }}>
                          {notif.isRead ? (
                            <CheckCircleOutlineIcon
                              fontSize="small"
                              color="success"
                            />
                          ) : (
                            <HighlightOffIcon
                              fontSize="small"
                              color="warning"
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={notif.message}
                          secondary={new Date(notif.createdAt).toLocaleString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                          primaryTypographyProps={{
                            fontWeight: notif.isRead ? "normal" : "bold",
                          }}
                          sx={{ wordBreak: "break-word" }}
                        />
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          handleDeleteNotificationClick(event, notif.id)
                        }
                        aria-label={`Supprimer la notification ${notif.id}`}
                        sx={{ ml: 1 }}
                      >
                        <HighlightOffIcon fontSize="small" color="action" />
                      </IconButton>
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          </Popover>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              src="https://public.readdy.ai/ai/img_res/4e32fe8260bae0a4f879d9618e1c1763.jpg"
              sx={{ width: 32, height: 32 }}
            />
          </IconButton>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: "200px",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem
              component={RouterLink}
              to="/admin/profile"
              onClick={handleCloseUserMenu}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mon Profil</ListItemText>
            </MenuItem>
            <Divider />
            {/* Le onClick appelle la fonction handleLogout pour ouvrir le dialogue de confirmation */}
            <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
              <ListItemIcon sx={{ color: "#d32f2f" }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Déconnexion</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? 70 : 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isCollapsed ? 70 : 240,
            boxSizing: "border-box",
            top: "68px",
            height: "calc(100% - 56px)",
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            boxShadow: "2px 0px 8px rgba(0, 0, 0, 0.05)",
            borderRight: "1px solid #eee",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            p: 0.1,
            display: "flex",
            justifyContent: isCollapsed ? "center" : "flex-end",
          }}
        >
          <IconButton
            onClick={toggleCollapse}
            sx={{ "&:hover": { backgroundColor: "#eef1f5" } }}
          >
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        </Box>
        <Divider />

        <Divider />
        <Box sx={{ flex: 1, overflowY: "auto", pb: 0.5 }}>
          <List component="nav" sx={{ px: isCollapsed ? 0 : 1, py: 2 }}>
            {renderSubheader("Général")}
            <Tooltip
              title="Tableau de bord"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/home"
                selected={isSelected("/admin/home")}
              >
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary="Tableau de bord"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Opérations")}
            <Tooltip
              title="Réservations"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/reservations"
                selected={isSelected("/admin/reservations")}
              >
                <ListItemIcon>
                  <ReceiptLong />
                </ListItemIcon>
                <ListItemText
                  primary="Réservations"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>
            <Tooltip
              title="Contrats & Commandes"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/commandes"
                selected={isSelected("/admin/commandes")}
              >
                <ListItemIcon>
                  <LocalShipping />
                </ListItemIcon>
                <ListItemText
                  primary="Contrats & Commandes"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>
            <Tooltip
              title="Paiements"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/paiements"
                selected={isSelected("/admin/paiements")}
              >
                <ListItemIcon>
                  <Payment />
                </ListItemIcon>
                <ListItemText
                  primary="Paiements"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>
            <Tooltip
              title="Factures"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/factures"
                selected={isSelected("/admin/factures")}
              >
                <ListItemIcon>
                  <ReceiptLong />
                </ListItemIcon>
                <ListItemText
                  primary="Factures"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Inventaire & Utilisateurs")}
            <Tooltip
              title="Véhicules"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <ListItemButton
                onClick={() => handleToggleCollapse(setOpenVehicules)}
                sx={{ margin: theme.spacing(0.5, 1), borderRadius: "8px" }}
              >
                <ListItemIcon>
                  <DirectionsCar
                    sx={{
                      color:
                        openVehicules ||
                          pathname.startsWith("/admin/vehicules") ||
                          pathname.startsWith("/admin/types")
                          ? activeIconColor
                          : iconColor,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Véhicules"
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    color:
                      openVehicules ||
                        pathname.startsWith("/admin/vehicules") ||
                        pathname.startsWith("/admin/types")
                        ? activeIconColor
                        : textColor,
                  }}
                />
                {!isCollapsed &&
                  (openVehicules ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openVehicules} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{ pl: isCollapsed ? 0 : 2 }}
              >
                <Tooltip
                  title="Liste des Véhicules"
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  <NavLinkButton
                    to="/admin/vehicules"
                    selected={isSelected("/admin/vehicules")}
                  >
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Liste"
                      sx={{ opacity: isCollapsed ? 0 : 1 }}
                    />
                  </NavLinkButton>
                </Tooltip>
                <Tooltip
                  title="Types de Véhicules"
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  <NavLinkButton
                    to="/admin/types"
                    selected={isSelected("/admin/types")}
                  >
                    <ListItemIcon>
                      <CategoryIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Types"
                      sx={{ opacity: isCollapsed ? 0 : 1 }}
                    />
                  </NavLinkButton>
                </Tooltip>
              </List>
            </Collapse>

            <Tooltip
              title="Clients"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <ListItemButton
                onClick={() => handleToggleCollapse(setOpenClients)}
                sx={{ margin: theme.spacing(0.5, 1), borderRadius: "8px" }}
              >
                <ListItemIcon>
                  <People
                    sx={{
                      color:
                        openClients ||
                          pathname.startsWith("/admin/clients") ||
                          pathname.startsWith("/admin/client_detail")
                          ? activeIconColor
                          : iconColor,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Clients"
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    color:
                      openClients ||
                        pathname.startsWith("/admin/clients") ||
                        pathname.startsWith("/admin/client_detail")
                        ? activeIconColor
                        : textColor,
                  }}
                />
                {!isCollapsed &&
                  (openClients ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </Tooltip>
            <Collapse in={openClients} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{ pl: isCollapsed ? 0 : 2 }}
              >
                <Tooltip
                  title="Liste des Clients"
                  placement="right"
                  disableHoverListener={!isCollapsed}
                >
                  <NavLinkButton
                    to="/admin/clients"
                    selected={isSelected("/admin/clients")}
                  >
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Liste"
                      sx={{ opacity: isCollapsed ? 0 : 1 }}
                    />
                  </NavLinkButton>
                </Tooltip>
              </List>
            </Collapse>

            <Tooltip
              title="Lieux de Location"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/lieux"
                selected={isSelected("/admin/lieux")}
              >
                <ListItemIcon>
                  <Storefront />
                </ListItemIcon>
                <ListItemText
                  primary="Lieux"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>

            {renderSubheader("Aide")}
            <Tooltip
              title="Contact & Support"
              placement="right"
              disableHoverListener={!isCollapsed}
            >
              <NavLinkButton
                to="/admin/contact"
                selected={isSelected("/admin/contact")}
              >
                <ListItemIcon>
                  <ContactMail />
                </ListItemIcon>
                <ListItemText
                  primary="Contact"
                  sx={{ opacity: isCollapsed ? 0 : 1 }}
                />
              </NavLinkButton>
            </Tooltip>
          </List>

          <List>
            <Divider sx={{ my: 8, borderColor: "#e0e0e0" }} />

            {/* Se Déconnecter */}
            <Box sx={{ mt: "auto", pb: 2 }}>
              <Tooltip title="Se Déconnecter" placement="right">
                {/* Utilisation de ListItemButton pour la sémantique Material-UI */}
                <NavLinkButton
                  to="/login" // Redirige vers la page de connexion
                  sx={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ListItemButton
                    onClick={handleLogout} // Appelle notre fonction handleLogout
                    sx={{
                      mx: 1,
                      padding: "10px 16px",
                      backgroundColor: "#ffebee",
                      color: "#d32f2f",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "#ef9a9a",
                        color: "#b71c1c",
                        transform: "translateX(4px)",
                        transition: "all 0.2s ease",
                      },
                      "& .MuiListItemIcon-root": {
                        minWidth: "40px",
                        color: "#d32f2f",
                        fontSize: "1.4rem",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <AccountCircle />
                    </ListItemIcon>
                    <ListItemText
                      primary="Se Déconnecter"
                      primaryTypographyProps={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#d32f2f",
                      }}
                      sx={{
                        opacity: isCollapsed ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                  </ListItemButton>
                </NavLinkButton>
              </Tooltip>
            </Box>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
};

export default Sidebar;
