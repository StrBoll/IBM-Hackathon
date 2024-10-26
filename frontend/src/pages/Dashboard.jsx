import { useState, useEffect } from "react";
import { Box, Typography, Card, Grid, FormControl, FormLabel, Select, Option } from "@mui/joy"
import { LineChart } from "@mui/x-charts";

/*
 * x-axis: time, week 0 => hurricane lands, 1-7 => after hurricane
 * y-axis: hospital encounters
 * 
 * using treat-and-release ed visits
 * all conditions, all ages, all proximities
 *
 * need pre-hurricane 4-week avg number of encounters
 */
const customize = {
  height: 300,
  width: 650,
  legend: { hidden: true },
  margin: { top: 5 },
}

const Dashboard = () => {
  const [ageGroup, setAgeGroup] = useState('all ages')
  const [condition, setCondition] = useState('all conditions')
  const [proximity, setProximity] = useState('direct path')

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [
          {
            week: -1,
            encounters: 40,
          },
          {
            week: 0,
            encounters: 50,
          },
          {
            week: 1,
            encounters: 70,
          },
          {
            week: 2,
            encounters: 95,
          },
          {
            week: 3,
            encounters: 80,
          },
          {
            week: 4,
            encounters: 35,
          },
          {
            week: 5,
            encounters: 50,
          },
          {
            week: 6,
            encounters: 45,
          },
          {
            week: 7,
            encounters: 40,
          },
        ]
        setChartData(data);
      } catch (error) {
        console.err(error)
      }
    }

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Hospital Encounters Dashboard
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Age Filter */}
        <Grid xs={12} md={4}>
          <FormControl>
            <FormLabel>Age Group</FormLabel>
            <Select
              value={ageGroup}
              onChange={(e, value) => setAgeGroup(value)}
            >
              {['all ages', '0-17', '18-64', '65 and older'].map((age) => (
                <Option key={age} value={age}>
                  {age}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Condition Filter */}
        <Grid xs={12} md={4}>
          <FormControl>
            <FormLabel>Condition</FormLabel>
            <Select
              value={condition}
              onChange={(e, value) => setCondition(value)}
            >
              {['all conditions', 'injuries', 'circulatory', 'respiratory', 'infectious'].map((cond) => (
                <Option key={cond} value={cond}>
                  {cond}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Proximity Filter */}
        <Grid xs={12} md={4}>
          <FormControl>
            <FormLabel>Proximity</FormLabel>
            <Select
              value={proximity}
              onChange={(e, value) => setProximity(value)}
            >
              {['direct path', 'near path', 'remote'].map((prox) => (
                <Option key={prox} value={prox}>
                  {prox}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Chart */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <LineChart
          dataset={chartData}
          xAxis={[
            {
              id: 'Weeks',
              dataKey: 'week',
              valueFormatter: (value) => 'Week ' + value.toString(),
              min: -1,
              max: 7,
            },
          ]}
          series={[
            {
              label: 'Encounters per week',
              dataKey: 'encounters',
              showMark: false,
            }
          ]}
          {...customize}
        />
      </Card>
    </Box>
  );
}

export default Dashboard;
