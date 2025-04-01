<template>
  <a-row :gutter="16" style="margin-bottom: 16px">
    <a-col :span="6">
      <a-statistic title="本月健身次数" :value="monthlyWorkoutCount" />
    </a-col>
    <a-col :span="6">
      <a-statistic title="本月健身总时长" :value="monthlyTotalDuration" suffix="分钟" />
    </a-col>
    <a-col :span="6">
      <a-statistic title="最常进行的健身" :value="mostFrequentType" />
    </a-col>
    <a-col :span="6">
      <a-statistic title="本周健身天数" :value="weeklyWorkoutDays" suffix="/7" />
    </a-col>
  </a-row>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  listData: {
    type: Object,
    required: true
  },
  currentDate: {
    type: Object, // moment日期对象
    required: true
  }
});

// 获取本月健身次数
const monthlyWorkoutCount = computed(() => {
  if (!props.currentDate) return 0;
  
  const currentMonth = props.currentDate.month();
  const currentYear = props.currentDate.year();
  
  let count = 0;
  Object.keys(props.listData).forEach(dateStr => {
    const date = new Date(dateStr);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      count += props.listData[dateStr].length;
    }
  });
  
  return count;
});

// 获取本月健身总时长
const monthlyTotalDuration = computed(() => {
  if (!props.currentDate) return 0;
  
  const currentMonth = props.currentDate.month();
  const currentYear = props.currentDate.year();
  
  let totalDuration = 0;
  Object.keys(props.listData).forEach(dateStr => {
    const date = new Date(dateStr);
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
      props.listData[dateStr].forEach(item => {
        totalDuration += (item.duration || 0);
      });
    }
  });
  
  return totalDuration;
});

// 获取最常进行的健身类型
const mostFrequentType = computed(() => {
  const typeCounts = {};
  
  Object.values(props.listData).forEach(dayRecords => {
    dayRecords.forEach(record => {
      if (record.type && record.type.value) {
        const typeName = record.type.value;
        typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
      }
    });
  });
  
  let maxCount = 0;
  let mostFrequentType = '无数据';
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentType = type;
    }
  });
  
  return mostFrequentType;
});

// 获取本周健身天数
const weeklyWorkoutDays = computed(() => {
  if (!props.currentDate) return 0;
  
  const today = props.currentDate.clone();
  const startOfWeek = today.startOf('week');
  
  let workoutDays = 0;
  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.clone().add(i, 'days');
    const dateStr = currentDate.format('YYYY-MM-DD');
    
    if (props.listData[dateStr] && props.listData[dateStr].length > 0) {
      workoutDays++;
    }
  }
  
  return workoutDays;
});
</script> 