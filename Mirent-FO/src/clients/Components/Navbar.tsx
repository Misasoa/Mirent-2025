import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/horizontal.png";
import illustration from "../../assets/horizontal.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const popoverVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const navItems = [
  { label: "Accueil", path: "/acceuil" },
  { label: "Nos voitures", path: "/list-vehicule" },
  { label: "Mes réservations", path: "/reservations-list" },
  { label: "Contact", path: "/contact" },
];

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleNavigation = (path: string) => {
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }
    setOpenDrawer(false);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    handleClosePopover();
    navigate("/acceuil");
  };

  const open = Boolean(anchorEl);

  // Animation variants
  const appBarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  };

  const popoverVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <motion.div variants={appBarVariants} initial="hidden" animate="visible">
        <AppBar
          position="fixed"
          sx={{
            background: "#0f172a",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1100,
          }}
        >
          <Toolbar
            sx={{
              height: "56px",
              p: 1,
              pl: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                component="img"
                src={logo}
                alt="Mirent Logo"
                sx={{ maxWidth: "150px", display: "block", cursor: "pointer" }}
                onClick={() => navigate("/acceuil")}
              />
            </motion.div>

            {!isMobile ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    custom={index}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography
                      sx={{
                        cursor: "pointer",
                        color: "white",
                        fontWeight: 500,
                        "&:hover": { color: "GrayText" },
                      }}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.label}
                    </Typography>
                  </motion.div>
                ))}
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isLoggedIn ? (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleOpenPopover}
                      sx={{ ml: 2, color: "white", borderColor: "white" }}
                      startIcon={<AccountCircleIcon />}
                    >
                      Mon compte
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleOpenPopover}
                      sx={{ ml: 2, color: "white", borderColor: "white" }}
                    >
                      Me connecter
                    </Button>
                  )}
                </motion.div>
              </Box>
            ) : (
              <>
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <IconButton
                    edge="start"
                    sx={{ color: "white" }}
                    aria-label="menu"
                    onClick={() => setOpenDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </motion.div>
                <Drawer
                  anchor="right"
                  open={openDrawer}
                  onClose={() => setOpenDrawer(false)}
                >
                  <motion.div
                    variants={drawerVariants}
                    initial="hidden"
                    animate={openDrawer ? "visible" : "hidden"}
                    style={{ width: 250, marginTop: 16 }}
                  >
                    <List>
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          custom={index}
                          variants={navItemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => handleNavigation(item.path)}
                            >
                              <ListItemText primary={item.label} />
                            </ListItemButton>
                          </ListItem>
                        </motion.div>
                      ))}
                      <motion.div
                        custom={navItems.length}
                        variants={navItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <ListItem disablePadding>
                          <ListItemButton onClick={handleOpenPopover}>
                            <ListItemText
                              primary={
                                isLoggedIn ? "Mon compte" : "Me connecter"
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      </motion.div>
                    </List>
                  </motion.div>
                </Drawer>
              </>
            )}
          </Toolbar>
        </AppBar>
      </motion.div>

      {!isLoggedIn && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
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
              p: 2,
              borderRadius: 3,
              width: 300,
              boxShadow: 5,
              mt: 1,
            },
          }}
        >
          <motion.div
            variants={popoverVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "background.paper",
                position: "absolute",
                top: -10,
                right: 20,
                transform: "rotate(45deg)",
                boxShadow: 1,
              }}
            />
            <Stack justifyContent="center" alignItems="center" spacing={1}>
              <Typography variant="h6" textAlign="center">
                Bienvenue sur
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Box
                  component="img"
                  src={illustration}
                  alt="Mirent Illustration"
                  sx={{
                    height: 50,
                    width: "auto",
                  }}
                />
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    navigate("/login");
                    handleClosePopover();
                  }}
                >
                  Se connecter
                </Button>
              </motion.div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    navigate("/register");
                    handleClosePopover();
                  }}
                >
                  S’inscrire gratuitement
                </Button>
              </motion.div>
              <Divider />
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Avantages gratuits avec Mirent+
                </Typography>
                {[
                  "Des offres et réductions exclusives",
                  "Toujours informé des promos",
                  "Toutes vos réservations en vue",
                ].map((text, index) => (
                  <motion.div
                    key={text}
                    custom={index}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography fontSize="small">{text}</Typography>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </motion.div>
        </Popover>
      )}

      {isLoggedIn && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClosePopover}
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
              p: 2,
              borderRadius: 3,
              width: 200,
              boxShadow: 5,
              mt: 1,
            },
          }}
        >
          <motion.div
            variants={popoverVariants}
            initial="hidden"
            animate={open ? "visible" : "hidden"}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "background.paper",
                position: "absolute",
                top: -10,
                right: 20,
                transform: "rotate(45deg)",
                boxShadow: 1,
              }}
            />
            <Stack spacing={1}>
              {[
                { label: "Mes réservations", path: "/reservations-list" },
                { label: "Mon profil", path: "/profile" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    variant="text"
                    fullWidth
                    onClick={() => {
                      navigate(item.path);
                      handleClosePopover();
                    }}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              <Divider />

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="text"
                  fullWidth
                  onClick={handleLogout}
                  sx={{ justifyContent: "flex-start", color: "error.main" }}
                >
                  Me déconnecter
                </Button>
              </motion.div>
            </Stack>
          </motion.div>
        </Popover>
      )}
    </>
  );
};

export default Navbar;
