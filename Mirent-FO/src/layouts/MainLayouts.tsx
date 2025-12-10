import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import Sidebar from "../admin/Components/Sidebar/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box display="flex" flexGrow={1} pt={7}>
        <Box sx={{ width: isCollapsed ? "60px" : "250px", flexShrink: 0 }}>
          <Sidebar onCollapseChange={setIsCollapsed} />
        </Box>
        <Box flexGrow={1} p={3}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
