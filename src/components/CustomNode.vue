<script lang="ts" setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  label: String
})
</script>

<template>
  <div class="custom-node">
    <Handle type="target" :position="Position.Top" :style="{ visibility: 'hidden' }" />
    <div class="node-label">
      <pre>{{ props.label }}</pre>
    </div>
    <Handle type="source" :position="Position.Bottom" :style="{ visibility: 'hidden' }" />
  </div>
</template>

<style scoped>
.custom-node {
  min-width: 160px;
  padding: 12px;
  background: var(--node-bg);
  border: 1px solid var(--node-border);
  border-radius: 6px;
  text-align: left;
  font-family: 'Inter', sans-serif;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.node-label {
  white-space: pre-wrap;
  font-size: 14px; /* Increased size */
  font-weight: 500; /* Slightly bolder */
  color: var(--node-text-color);
  line-height: 1.4; /* Better spacing */
}
</style>
