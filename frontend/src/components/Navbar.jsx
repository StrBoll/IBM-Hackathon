import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Box, Sheet, IconButton, Typography, Dropdown, Menu, MenuButton, MenuItem, Button, Stack } from "@mui/joy";
import { Menu as MenuIcon } from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Map', path: '/map' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <Sheet
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2,
        px: { xs: 2, md: 4 },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography level="h4" component="h1">
          ATLAS
        </Typography>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: { xs: 'none', md: 'flex' },
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="plain"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      {menuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.body',
            zIndex: 1000,
            p: 2,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{ position: 'absolute', right: 2, top: 2 }}
          >
            Close
          </IconButton>
          <Stack spacing={2} sx={{ mt: 6 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                fullWidth
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Sheet>
  )
}

export default Navbar;
