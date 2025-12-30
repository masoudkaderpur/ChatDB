<template>
  <div class="q-pa-md">
    <div class="q-mb-md flex justify-between items-center">
      <q-toggle v-model="toggleView" label="Toggle View" color="black" class="text-black" />
    </div>

    <!-- Table View -->
    <q-table
      v-if="!toggleView"
      flat
      bordered
      :rows="rawTable"
      :columns="columns"
      row-key="id"
      class="bg-light text-dark"
      no-data-label="No data available"
    >
      <template v-slot:header="props">
        <q-tr>
          <q-th v-for="col in props.cols" :key="col.name" @click="changeData(col.field)">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell="props">
        <q-td :props="props">
          {{ props.row[props.col.field] || '-' }}
        </q-td>
      </template>
    </q-table>

    <!-- Card View -->
    <div v-if="toggleView" class="q-mt-md">
      <q-card v-for="(row, index) in rawTable" :key="index" class="q-mb-md bg-light text-black">
        <q-card-section>
          <div class="text-h6">Datensatz {{ index + 1 }}</div>
          <q-separator />
          <div v-for="(value, key) in row" :key="key" class="q-mt-sm">
            <strong class="text-blue-3">{{ key }}:</strong> {{ value }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <BarChart :chart-data="chartData" aria-label="HUre" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'
import { CHATS } from './store/chat.ts'
import { useQuasar } from 'quasar'
import { selectedQuery } from './store/state.ts'
import BarChart from './BarChart.vue'

const $q = useQuasar() // Get access to Quasar utilities

const rawTable = ref([])
const columns = ref([])
const toggleView = ref(false)
const userTable = ref('')

const getTable = async () => {
  const statement = computed(() => CHATS.value[CHATS.value.length - 1]?.content)
  if (!statement.value) return

  try {
    const { data } = await axios.get(`http://localhost:3000/table/`, {
      params: { statement: selectedQuery.value }
    })
    rawTable.value = data
  } catch (error) {
    console.error('Error fetching table:', error)
    $q.notify({ type: 'negative', message: 'Error fetching table data.' })
  }
}

const chartData = ref({ labels: [], datasets: [{}] })

const chartCounter = ref(false)

const changeData = (columnName) => {
  chartCounter.value = !chartCounter.value
  const columnData = rawTable.value.slice(0, 50).map((row) => row[columnName] || '-')
  if (chartCounter.value) {
    chartData.value = {
      labels: columnData,
      datasets: [{}] // Nur Labels setzen, ohne Daten
    }
  } else {
    chartData.value = {
      labels: chartData.value.labels, // Labels beibehalten
      datasets: [{ data: columnData }]
    }
  }
  // chartData.value = {
  //   labels: columnData,
  //   datasets: [{ data: Array(columnData.length).fill(1) }]
  // }
}

watch(rawTable, (newValue) => {
  if (newValue.length > 0) {
    columns.value = Object.keys(newValue[0]).map((key) => ({
      name: key,
      label: key.toUpperCase(),
      align: 'left',
      field: key
    }))
  }
})

watch(selectedQuery, (newValue) => {
  if (newValue) {
    getTable(userTable) // Aufruf der Funktion getTable, wenn selectedQuery einen Wert hat
  }
})
</script>

<style scoped>
.bg-light {
  background-color: #f0f0f0;
}

.q-table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
