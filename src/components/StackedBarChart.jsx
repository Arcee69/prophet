import React from "react";
import Chart from "react-apexcharts";

const StackedBarChart = ({ title, series, colors, labels, max }) => {
    const options = {
      chart: {
        type: "bar",
        stacked: true,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "200%",
        },
      },
      xaxis: {
        categories: labels,
        max: max, // Dynamic max based on data
        labels: {
          formatter: (val) => (val >= 1000 ? val / 1000 + "k" : val),
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}k`, // Format for percentage
        style: {
          colors: ["#000"],
          fontSize: "12px",
          fontWeight: "bold",
    
        },
      },
      colors: colors, // Dynamic colors
      grid: {
        borderColor: "#e7e7e7",
      },
      tooltip: {
        enabled: true,
      },
      legend: {
        position: "bottom",
      },
    };
  
    return (
      <div className="bg-white drop-shadow rounded-[13px] flex flex-col w-6/12">
        <div className="p-3">
          <h2 className="text-[20px] font-lato text-[#667185] mb-2">{title}</h2>
        </div>
        <div className="bg-[#ccc] w-full h-[1px]"></div>
        <div className="p-2">
          <Chart options={options} series={series} type="bar" height={80} />
        </div>
      </div>
    );
  };
  

export default StackedBarChart