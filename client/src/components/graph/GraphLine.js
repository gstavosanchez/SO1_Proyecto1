import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  scales: {
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'probability',
        },
      },
    ],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: 'hola',
        },
      },
    ],
  },
};

export const GraphLine = ({ title, value, labels }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: value,
        fill: false,
        backgroundColor: '#363636',
        borderColor: '#363636',
      },
    ],
  };

  return (
    <>
      <Line data={data} options={options} />
    </>
  );
};

GraphLine.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  labels: PropTypes.array.isRequired,
};
