<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({ chartData: { type: Object, required: true } })

const chartOptions = {
  responsive: true,
  backgroundColor: '#00b9fb',
  plugins: {
    legend: {
      display: false // Versteckt die Legende, wodurch "undefined" nicht mehr erscheint
    }
  },
  scales: {
    x: {
      ticks: {
        color: 'black' // X-Achse Beschriftung schwarz
      }
    },
    y: {
      ticks: {
        color: 'black' // Y-Achse Beschriftung schwarz
      }
    }
  }
}
</script>
