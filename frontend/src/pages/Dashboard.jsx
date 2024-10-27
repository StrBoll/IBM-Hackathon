import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CircularProgress, Grid } from "@mui/joy"
import { LineChart } from "@mui/x-charts";


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [realChartData, setRealChartData] = useState([]);
  const [chartDataset, setChartDataset] = useState([]);
  const [countyList, setCountyList] = useState([]);

  const [generatedText, setGeneratedText] = useState({});
  const [processedItems, setProcessedItems] = useState([]);

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
        console.log(error)
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

  useEffect(() => {
    const getText = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/generate');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setGeneratedText(data)
        setIsLoading(false);
      } catch (error) {
        console.log(error)
      }
    }
    getText();
  }, []);

  useEffect(() => {
    if (generatedText.info) {
      const processText = (text) => {
        // Split the text into introduction and numbered items
        const regex = /(\d+\.\s)/;
        const index = text.search(regex);

        const intro = index !== -1 ? text.slice(0, index).trim() : '';
        const itemsText = index !== -1 ? text.slice(index) : text;

        // Split the itemsText into numbered items
        const itemRegex = /(\d+\.\s[\s\S]*?)(?=(\d+\.\s)|$)/g;
        const items = [];
        let match;
        while ((match = itemRegex.exec(itemsText)) !== null) {
          items.push(match[1].trim());
        }

        // Combine intro and items
        return intro ? [intro, ...items] : items;
      };

      const parseBoldText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
          } else {
            return <React.Fragment key={index}>{part}</React.Fragment>;
          }
        });
      };

      const items = processText(generatedText.info);
      const processed = items.map(item => parseBoldText(item));
      setProcessedItems(processed);
    }
  }, [generatedText.info]);


  return (
    <Box sx={{ p: 4 }}>
      <Typography level="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Predicted Hospital Encounters
      </Typography>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container direction={"column"} spacing={2}>
          <Grid item>
            <Card elevation={3} variant="outlined" sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
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
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <Typography level="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
              Insight From WatsonAIx
            </Typography>
            {processedItems.map((item, index) => (
              <Typography key={index} component="p" sx={{ textAlign: 'left', mt: index !== 0 ? 2 : 0 }}>
                {item}
              </Typography>
            ))}
          </Grid>
        </Grid>
      )}

    </Box>
  );
}

export default Dashboard;
