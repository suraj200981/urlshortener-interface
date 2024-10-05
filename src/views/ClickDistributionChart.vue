<template>
  <v-card class="chart-card transparent-card" elevation="4">
    <v-card-title>Top 5 URLs by Clicks</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div class="chart-container">
        <canvas id="clicksChart"></canvas>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "ClickDistributionChart",
  props: ["urlData"], // Receive URL data from parent component
  watch: {
    // Watch for changes in urlData and render the chart when data is updated
    urlData: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.length) {
          console.log("URL Data received for chart:", newValue);
          this.renderChart();
        }
      },
    },
  },
  methods: {
    renderChart() {
      // Clear any existing chart instance before rendering a new one
      const chartElement = document.getElementById("clicksChart");
      if (chartElement) {
        chartElement.remove(); // Remove existing canvas element
        const newCanvas = document.createElement("canvas");
        newCanvas.id = "clicksChart";
        document.querySelector(".chart-container").appendChild(newCanvas);
      }

      // Extract top 5 URLs based on click count
      const sortedData = [...this.urlData].sort(
        (a, b) => b.clickCount - a.clickCount
      );
      const topUrls = sortedData.slice(0, 5);

      // Prepare data for Chart.js
      const labels = topUrls.map((url) => url.originalUrl);
      const clickCounts = topUrls.map((url) => url.clickCount);

      // Create a pie chart
      new Chart(document.getElementById("clicksChart"), {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Top 5 URLs by Clicks",
              data: clickCounts,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#8E24AA",
              ], // Colors for each slice
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4CAF50",
                "#8E24AA",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Maintain the chart's aspect ratio
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw} clicks`;
                },
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-card {
  padding: 20px;
  margin-top: 20px;
  max-width: 100%; /* Ensure it takes the full width of the container */
  max-height: 600px; /* Limit height for better visualization */
  backdrop-filter: blur(10px); /* Add blur effect */
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.chart-container {
  width: 100%; /* Take full width of the column */
  height: 300px; /* Set a fixed height for the chart */
  position: relative; /* Ensure it's positioned correctly */
}
</style>
