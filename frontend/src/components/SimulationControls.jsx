import React, { useState } from 'react';
import { Slider, Button, Typography } from '@mui/joy';

const SimulationControls = ({ onSimulate }) => {
  const [category, setCategory] = useState(3);
  const [speed, setSpeed] = useState(15);

  const handleSimulate = () => {
    onSimulate({ category, speed });
  };

  return (
    <div>
      <Typography level="h6">Hurricane Category</Typography>
      <Slider
        value={category}
        onChange={(e, newValue) => setCategory(newValue)}
        min={1}
        max={5}
        step={1}
      />
      <Typography level="h6">Hurricane Speed (mph)</Typography>
      <Slider
        value={speed}
        onChange={(e, newValue) => setSpeed(newValue)}
        min={5}
        max={25}
        step={1}
      />
      <Button onClick={handleSimulate}>Simulate</Button>
    </div>
  );
};

export default SimulationControls;

