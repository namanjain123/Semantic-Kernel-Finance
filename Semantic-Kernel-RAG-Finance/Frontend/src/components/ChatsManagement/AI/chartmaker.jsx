import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "./chartMaker.css";
export default function ChartMaker({ data_chart,id_chart,config}) {
    const data=JSON.parse(data_chart);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }

        chartInstanceRef.current = new Chart(ctx, config);
      }, [config]);
      

    return (
        <>
            <canvas className="chartmain" id={id_chart} ref={chartRef}></canvas>
        </>
    );
}
