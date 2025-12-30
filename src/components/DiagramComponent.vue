<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import dagre from 'dagre'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import CustomNode from './CustomNode.vue'
import CustomEdge from './CustomEdge.vue'
import axios from 'axios'
import '@vue-flow/core/dist/style.css'

const database = ref([])

// Fetch database schema from backend
const getDatabase = async () => {
  try {
    const { data } = await axios.get('http://localhost:3000/database')
    database.value = data
    console.log('Fetched database:', database.value)
  } catch (error) {
    console.error('Error fetching database:', error)
  }
}

// Generate Node Label
const generateNodeLabel = (table) =>
  `${table.table_name}\n` +
  Object.entries(table.table_details.columns)
    .map(([colName, colType]) => `- ${colName} (${colType})`)
    .join('\n')

const { onConnect, addEdges } = useVueFlow()

// Dagre Layout
const createDagreLayout = (nodes, edges) => {
  const g = new dagre.graphlib.Graph()

  const nodeCount = nodes.length
  const edgeCount = edges.length

  const nodesep = Math.max(nodeCount * 8)
  const ranksep = Math.max(nodeCount * 30)
  const edgesep = Math.min(150, Math.max(100, edgeCount * 5))

  g.setGraph({ rankdir: 'TB', nodesep, ranksep, edgesep, marginx: 30, marginy: 30 })
  g.setDefaultEdgeLabel(() => ({}))

  nodes.forEach((node) => {
    g.setNode(node.id, { width: 15 * nodeCount, height: 7.5 * nodeCount }) // Set width and height for each node
  })

  edges.forEach((edge) => g.setEdge(edge.source, edge.target))

  dagre.layout(g)

  nodes.forEach((node) => {
    const nodeWithPosition = g.node(node.id)
    node.position = { x: nodeWithPosition.x, y: nodeWithPosition.y }
  })
}

// Reactive state
const nodes = ref([])
const edges = ref([])

// Watch database changes
watchEffect(() => {
  if (database.value.length) {
    nodes.value = database.value.map((table) => ({
      id: table.table_name,
      type: 'custom',
      label: generateNodeLabel(table),
      position: { x: 0, y: 0 }
    }))

    edges.value = database.value.flatMap((table, index) =>
      table.table_details.foreign_keys.map((fk, fkIndex) => ({
        id: `e${index}-${fkIndex}`,
        source: fk.foreign_table,
        target: table.table_name,
        type: 'custom',
        label: `${fk.foreign_column} → ${fk.column}`
      }))
    )

    createDagreLayout(nodes.value, edges.value)
  }
})

// Handle connection of nodes
onConnect((params) => addEdges([params]))

// Theme toggle logic
const isDark = ref(localStorage.getItem('theme') !== 'light')

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// Fetch data on component mount
onMounted(getDatabase)
</script>

<template>
  <div :class="isDark ? 'dark' : 'light'" style="height: 95%">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      class="vue-flow-container"
      :default-zoom="1.5"
      :min-zoom="0.5"
      :max-zoom="2"
      :style="{ backgroundColor: isDark ? '#f0f0f0' : '#1c1c1e' }"
    >
      <Background :bg-color="isDark ? '#ccc' : '#1c1c1e'" />
      <!-- <Controls /> -->
      <MiniMap
        position="bottom-left"
        :style="{
          bottom: '80px',
          backgroundColor: isDark ? '#f0f0f0' : '#1c1c1e',
          border: isDark ? '1px solid #ddd' : '1px solid #2c3e50'
        }"
      />

      <!-- Custom Node and Edge -->
      <template #node-custom="nodeProps">
        <CustomNode v-bind="nodeProps" />
      </template>

      <template #edge-custom="edgeProps">
        <CustomEdge v-bind="edgeProps" />
      </template>
    </VueFlow>
  </div>
</template>

<style scoped>
/* Dark Mode */
.light {
  --background-color: #1c1c1e; /* Apple Dark Mode Gray */
  --text-color: white;
  --button-bg: #0a84ff; /* Apple Blue */
  --button-text: white;
  --node-bg: #2a2e38;
  --node-border: #2c3e50;
  --edge-bg: #2a2e38;
  --edge-text-color: white;
  --node-text-color: white;
}

/* Light Mode */
.dark {
  --background-color: #999;
  --text-color: black;
  --button-bg: #ddd;
  --button-text: black;
  --node-bg: #ffffff;
  --node-border: #ccc;
  --edge-bg: #999;
  --edge-text-color: black;
  --node-text-color: black;
}

.vue-flow-container {
  font-family: 'Inter', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  backdrop-filter: blur(20px); /* Frosted glass effect */
  padding: 12px; /* Consistent padding */
}

/* Node Styling */
.custom-node {
  min-width: 200px;
  padding: 15px;
  background: var(--node-bg);
  border: 1px solid var(--node-border);
  border-radius: 8px;
  color: var(--node-text-color);
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Edge Labels */
.edge-label {
  background-color: var(--edge-bg);
  color: var(--edge-text-color);
  font-size: 12px;
  padding: 5px;
  border-radius: 3px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* MiniMap */
.vue-flow-minimap {
  background-color: var(--background-color) !important;
  border: 1px solid #1f2937 !important;
}

/* Theme Toggle Button */
.theme-toggle-btn {
  background-color: var(--button-bg);
  color: var(--button-text);
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 20px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  transition: background 0.3s; /* Smooth transition */
}

.theme-toggle-btn:hover {
  background: #0071e3; /* Apple Blue hover */
}
</style>
