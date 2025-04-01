<template>
  <a-list
    size="small"
    bordered
    :data-source="records"
    class="record-list"
  >
    <template #renderItem="{ item, index }">
      <a-list-item style="justify-content: space-between">
        <div class="fitness-item">
          <CloseCircleOutlined
            style="color: red; margin-right: 10px"
            @click="$emit('delete', index)"
          />
          <a-tag :color="item.type?.color || '#cccccc'" class="list-tag">
            {{ item.type?.value || '未知类型' }}
          </a-tag>
          <span class="fitness-duration">{{ item.duration || 0 }}分钟</span>
          <a-tag :color="item.intensity?.color || '#cccccc'">
            {{ item.intensity?.value || '中' }}强度
          </a-tag>
          <a-tooltip v-if="item.note" :title="item.note">
            <InfoCircleOutlined style="margin-left: 8px" />
          </a-tooltip>
        </div>
      </a-list-item>
    </template>
    <template #header>
      <div style="text-align: center">今日健身记录</div>
    </template>
    <template #empty>
      <div style="text-align: center; padding: 20px;">
        今天还没有健身记录，开始添加吧！
      </div>
    </template>
  </a-list>
</template>

<script setup>
import { CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

defineProps({
  records: {
    type: Array,
    default: () => []
  }
});

defineEmits(['delete']);
</script>

<style scoped>
.record-list {
  max-height: 200px;
  overflow-y: auto;
}

.fitness-item {
  display: flex;
  align-items: center;
  width: 100%;
}

.fitness-duration {
  margin: 0 10px;
  font-weight: bold;
}

.list-tag {
  margin-right: 5px;
}
</style> 