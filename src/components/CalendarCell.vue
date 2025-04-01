<template>
  <ul class="events">
    <li v-for="item in records" :key="item.timestamp || Date.now()">
      <div class="tag" :style="{ background: item.type?.color || '#cccccc' }">
        {{ item.type?.value || '未知类型' }}
         <!-- {{ item.duration || 0 }}分钟 -->
      </div>
    </li>
    <!-- <li v-if="records.length > 0" class="fitness-summary">
      总计: {{ totalDuration }}分钟
    </li> -->
  </ul>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
});

// 计算总时长
const totalDuration = computed(() => {
  return props.records.reduce((total, item) => {
    return total + (item.duration || 0);
  }, 0);
});
</script>

<style scoped>
.events {
  list-style: none;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.tag {
  font-size: 10px;
  border-radius: 3px;
  padding: 2px;
  width: 100%;
  text-align: center;
  overflow-x: hidden;
  white-space: nowrap;
  margin-bottom: 2px;
  color: white;
}

.fitness-summary {
  margin-top: 5px;
  font-size: 10px;
  font-weight: bold;
  text-align: center;
}
</style> 