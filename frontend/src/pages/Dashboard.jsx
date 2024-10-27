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
  const [isLoading, setIsLoading] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [realChartData, setRealChartData] = useState([]);
  const [chartDataset, setChartDataset] = useState([]);
  const [countyList, setCountyList] = useState([]);

  const population = 500000;
  const hurricane = 'Milton'
  const counties = ['Alachua', 'Duval', 'Fake1', 'Fake2', 'Pinellas'];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/encounters');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setChartData(data)
        setIsLoading(false);
      } catch (error) {
        console.err(error)
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && chartData && chartData.predictions) {
      const encountersArray = chartData.predictions.flatMap((weekData, weekIndex) =>
        weekData.map((prediction, dayIndex) => ({
          name: hurricane,
          county: counties[weekIndex],
          week: dayIndex % 8,
          encounters: Math.ceil((prediction / 10000) * population),
        }))
      );

      setRealChartData(encountersArray);
    }
  }, [isLoading, chartData]);

  useEffect(() => {
    if (realChartData.length > 0) {
      // Get unique weeks and counties
      const weeks = [...new Set(realChartData.map(item => item.week))];
      const counties = [...new Set(realChartData.map(item => item.county))];

      // Reshape data
      const reshapedData = weeks.map(week => {
        const weekData = realChartData.filter(item => item.week === week);
        const weekObj = { week };
        weekData.forEach(item => {
          weekObj[item.county] = item.encounters;
        });
        return weekObj;
      });

      setChartDataset(reshapedData);
      setCountyList(counties);
    }
  }, [realChartData]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Predicted Hospital Encounters
      </Typography>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Typography level="h4">Loading data...</Typography>
        </div>
      ) : (
        <>
          <Card variant="outlined" sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <LineChart
              dataset={chartDataset}
              xAxis={[
                {
                  id: 'Weeks',
                  dataKey: 'week',
                  valueFormatter: (value) => 'Week ' + value.toString(),
                  min: 0,
                  max: 7,
                },
              ]}
              series={
                countyList.map(county => ({
                  id: county,
                  label: county,
                  dataKey: county,
                  showMark: false,
                }))}
              width={800}
              height={400}
              margin={{ left: 70 }}
            />
          </Card>
        </>
      )}
    </Box>
  );
}

export default Dashboard;
