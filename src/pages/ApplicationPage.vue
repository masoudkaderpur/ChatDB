<template>
  <q-page class="row bg-light">
    <!-- Main Content Section -->
    <div :class="{ 'col-12': !chatvisibility, 'col-8': chatvisibility }" class="q-pa-lg">
      <!-- Toggle Chat Visibility Button -->
      <q-btn
        @click="chatvisibility = !chatvisibility"
        text-color="black"
        color="black"
        :label="chatvisibility ? '→' : '←'"
        class="float-right"
        dense
        flat
      />

      <!-- Tab Toggle -->
      <div class="row justify-center q-mb-md">
        <q-btn-toggle
          v-model="activeTab"
          toggle-color="blue-8"
          color="white"
          text-color="black"
          :options="[
            { label: 'Diagram', value: 'diagram' },
            { label: 'Data', value: 'data' }
          ]"
        />
      </div>

      <!-- Dynamic Component (Diagram or Data View) -->
      <component :is="activeTab === 'diagram' ? DiagramComponent : DatabaseView" />
    </div>

    <!-- Chat Section -->
    <div
      v-if="chatvisibility"
      class="col-4 relative-position"
      style="background-color: rgba(240, 240, 240, 0.85)"
    >
      <!-- Chat Container and Chat Box -->
      <div class="full-height" style="background-color: #f0f0f0">
        <ChatsContainer />
        <ChatBox style="position: absolute; bottom: 0; width: 100%" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import DiagramComponent from '../components/DiagramComponent.vue'
import DatabaseView from '../components/DatabaseView.vue'
import ChatsContainer from '../components/ChatsContainer.vue'
import ChatBox from '../components/ChatBox.vue'

const chatvisibility = ref(true)
const activeTab = ref('data')
</script>

<style scoped>
.overflow-auto {
  overflow-y: auto;
}
.bg-light {
  background-color: #f0f0f0;
}
</style>
