import "./App.css";

import { Chart, ChartData, ChartOptions, ScaleType } from "chart.js";
import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";
import streamingPlugin from "chartjs-plugin-streaming";

Chart.register([zoomPlugin, streamingPlugin]);

const data: ChartData = {
  datasets: [
    {
      label: "Random Dataset",
      borderColor: "rgb(54, 162, 235)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      cubicInterpolationMode: "monotone",
      data: [],
    },
  ],
};

const options: ChartOptions = {
  scales: {
    x: {
      type: "realtime" as ScaleType,
    },
    y: {
      type: "linear",
      grace: "10%",
      beginAtZero: true,
      suggestedMax: 1,
      suggestedMin: -0.1,
    },
  },
  plugins: {
    zoom: {
      pan: {
        enabled: true,
        mode: "x",
      },
      zoom: {
        enabled: true,
        mode: "x",
      },
    },
  },
};

interface Event {
  timestamp: number;
  value: number;
}

function useSubscribeRealtimeData(
  intervalMs: number,
  onReceive: (event: Event) => void
) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      onReceive({
        value: Math.random(),
        timestamp: Date.now().valueOf(),
      });
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMs, onReceive]);
}

function App() {
  const ref = useRef<Chart>();

  useSubscribeRealtimeData(500, (event) => {
    const chart = ref.current;
    chart?.data.datasets[0].data.push({
      x: event.timestamp,
      y: event.value,
    });

    chart?.update("none");
  });

  return (
    <div className="App">
      <div className="chart">
        <button
          onClick={() => {
            const chart = ref.current;
            chart?.resetZoom();
          }}
        >
          Reset Zoom
        </button>
        <Line
          className="chart"
          ref={ref}
          type={"line"}
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default App;
