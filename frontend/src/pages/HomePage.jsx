import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button, Card, CardContent, Grid, Sheet, Divider } from "@mui/joy";
import { Storm as StormIcon } from '@mui/icons-material';

const HomePage = () => {
  const navigate = useNavigate();

  const [hurricaneSelected, setHurricaneSelected] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState(null);

  const features = [
    {
      icon: <StormIcon sx={{ fontSize: 40 }} />,
      title: 'Real-Time Hurricane Tracking',
      description:
        'Monitor current hurricanes with live updates on their paths and intensities.',
    },
    {
      title: 'Hospital Load Predictions',
      description:
        'Forecast hospital utilization to assist in resource planning and allocation.',
    },
    {
      title: 'Interactive Map Visualization',
      description:
        'Explore affected areas with detailed maps and interactive data overlays.',
    },
  ]

  return (
    <Box>
      <Sheet
        variant="solid"
        color="primary"
        invertedColors
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '70vh',
          backgroundImage: 'linear-gradient(rgba(0, 30, 60, 0.8), rgba(0, 30, 60, 0.8)), url("/api/placeholder/1200/800")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography
          level="h1"
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
            fontWeight: 'bold',
          }}
        >
          Disaster Resource Allocation
        </Typography>
        <Typography
          level="body1"
          sx={{
            mb: 4,
            fontSize: { xs: '1rem', md: '1.8rem' },
            maxWidth: '800px',
          }}
        >
          Predicting hospital utilization during hurricanes to improve government resource distribution in the most impacted regions.
        </Typography>
        <Button
          size="lg"
          color="success"
          variant="solid"
          onClick={() => navigate('/map')}
          sx={{ mt: 2 }}
        >
          Explore the Map
        </Button>
      </Sheet>

      <Box
        sx={{
          py: 8,
          px: 4,
          backgroundColor: 'background.body',
        }}
      >
        <Typography
          level="h3"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Key Features
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '100%', md: '30%' },
                textAlign: 'center',
                px: 2,
              }}
            >
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography level="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {feature.title}
              </Typography>
              <Typography level="body1">{feature.description}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: 'neutral.100',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          py: 6,
          px: 4,
          gap: { xs: 4, md: 8 },
        }}
      >
        {[
          { number: "XX+", label: "People Impacted" },
          { number: "X,XXX+", label: "Hospitals Helped" },
          { number: "XX%", label: "Hospital Load" },
        ].map((stat, index) => (
          <Box
            key={index}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography level="h1" color="primary">
              {stat.number}
            </Typography>
            <Typography level="body-lg">
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default HomePage;
