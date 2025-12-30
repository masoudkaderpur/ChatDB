<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { EdgeProps } from '@vue-flow/core'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'

const props = defineProps<EdgeProps>()
const labelPositions = ref<{ [key: string]: { x: number; y: number } }>({}) // Store label positions
const path = computed(() => getBezierPath(props))

const getAdjustedLabelPosition = (id: string, x: number, y: number) => {
  let adjustedX = x
  let adjustedY = y
  // Apply an offset for labels if they overlap
  const MIN_DISTANCE = 50
  Object.values(labelPositions.value).forEach((pos) => {
    const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2))
    if (distance < MIN_DISTANCE) {
      adjustedY += MIN_DISTANCE // Move label by the minimum distance
    }
  })
  labelPositions.value[id] = { x: adjustedX, y: adjustedY }
  return { x: adjustedX, y: adjustedY }
}
</script>

<template>
  <BaseEdge :path="path[0]" />

  <EdgeLabelRenderer>
    <div
      :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${path[1]}px,${path[2]}px)`,
        backgroundColor: 'var(--edge-label-bg)' /* Use theme variable */,
        color: 'var(--edge-label-color)' /* Use theme variable */,
        border: '1px solid var(--edge-label-border)' /* Use theme variable */
      }"
      class="nodrag nopan edge-label"
    >
      <span>{{ props.label }}</span>
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.edge-path {
  stroke: var(--edge-color); /* Default edge color controlled by the theme */
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.edge-label {
  padding: 6px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s; /* Smooth transition */
}
</style>
