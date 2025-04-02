<template>
  <a-config-provider :locale="zhCN">
    <div class="fitness-app">
      <!-- 头部工具栏 -->
      <div class="app-header">
        <h2 class="app-title">健身记录日历</h2>
        <a-button type="primary" @click="showDrawer">
          <SettingOutlined /> 设置
        </a-button>
      </div>
      
      <!-- 健身统计组件 -->
      <FitnessStats
        :listData="listData"
        :currentDate="value"
      />
      
      <!-- 日历组件 -->
      <a-calendar v-model:value="value" @select="select">
        <!-- 日历头部 -->
        <template #headerRender="{ value: current, onChange }">
          <CalendarHeader 
            :current="current"
            :onChange="onChange"
          />
        </template>
        
        <!-- 日期单元格 -->
        <template #dateCellRender="{ current }">
          <CalendarCell :records="getListData(current)" />
        </template>
      </a-calendar>
    </div>
  </a-config-provider>
  
  <!-- 健身记录详情模态框 -->
  <a-modal
    v-model:open="open"
    :title="selectDate + ' 健身记录'"
    @ok="handleOk"
    okText="保存"
    cancelText="取消"
    width="500px"
  >
    <!-- 记录列表 -->
    <RecordList 
      :records="listData[selectDate] || []"
      @delete="deletetag"
    />
    
    <!-- 健身表单 -->
    <FitnessForm
      ref="fitnessFormRef"
      :fitnessTypes="fitnessTypesRef"
      :intensityOptions="intensityOptions"
      :initialValues="newRecord"
      @update:formState="updateFormState"
    />
  </a-modal>
  
  <!-- 设置抽屉 -->
  <a-drawer
    title="健身类型管理"
    width="100%"
    :visible="drawerVisible"
    @close="closeDrawer"
    :body-style="{ paddingBottom: '80px' }"
  >
    <TypeManager 
      :fitnessTypes="fitnessTypesRef" 
      :listData="listData"
      @update:fitnessTypes="updateFitnessTypes"
    />
    
    <template #footer>
      <div style="text-align: right">
        <a-button type="primary" @click="clearData">
          <template #icon>
            <DeleteOutlined />
          </template>
          清空本地日历数据
        </a-button>
      </div>
      <!-- <div style="text-align: right">
        <a-button style="margin-right: 8px" @click="closeDrawer">
          关闭
        </a-button>
      </div> -->
    </template>
  </a-drawer>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN.js";
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { SettingOutlined, DeleteOutlined } from '@ant-design/icons-vue';

// 导入组件
import FitnessStats from './components/FitnessStats.vue';
import CalendarHeader from './components/CalendarHeader.vue';
import CalendarCell from './components/CalendarCell.vue';
import RecordList from './components/RecordList.vue';
import FitnessForm from './components/FitnessForm.vue';
import TypeManager from './components/TypeManager.vue';

// 导入工具函数和数据
import { 
  fitnessTypes as defaultFitnessTypes, 
  intensityOptions, 
  saveData, 
  loadData, 
  migrateOldData,
  getRecordsByDate,
  saveTypes,
  loadTypes,
  updateRecordTypes
} from './utils/fitnessData';

// 当前选中的日期
const value = ref(dayjs());

// 健身类型引用
const fitnessTypesRef = ref([...defaultFitnessTypes]);

// 健身记录数据
const listData = ref(loadData());

// 模态框状态
const open = ref(false);
const selectDate = ref("");

// 抽屉状态
const drawerVisible = ref(false);

// 表单状态
const fitnessFormRef = ref(null);
const newRecord = ref({
  type: fitnessTypesRef.value[0],
  duration: 30,
  intensity: intensityOptions[1],
  note: ''
});

// 更新表单状态
const updateFormState = (formState) => {
  newRecord.value = formState;
};

// 根据日期获取健身记录
const getListData = (date) => {
  if (!date || !listData.value) return [];
  const dateStr = date.format("YYYY-MM-DD");
  return listData.value[dateStr] || [];
};

// 日期选择事件
const select = (selectedDates) => {
  // 打开模态框
  open.value = true;
  selectDate.value = selectedDates.format("YYYY-MM-DD");
  
  // 重置表单
  if (fitnessFormRef.value) {
    fitnessFormRef.value.resetForm();
  }
};

// 保存健身记录
const handleOk = () => {
  // 表单验证
  if (!newRecord.value.type || !newRecord.value.duration) {
    message.error('请完善健身信息');
    return;
  }
  
  // 创建记录对象
  const record = {
    type: newRecord.value.type,
    duration: newRecord.value.duration,
    intensity: newRecord.value.intensity,
    note: newRecord.value.note,
    timestamp: Date.now()
  };
  
  // 保存到数据中
  if (selectDate.value in listData.value) {
    listData.value[selectDate.value].push(record);
  } else {
    listData.value[selectDate.value] = [record];
  }
  
  // 保存到本地存储
  const saveResult = saveData(listData.value);
  
  // 提示结果
  if (saveResult) {
    message.success('健身记录已保存');
  } else {
    message.error('保存失败，请重试');
  }
  
  // 重置表单
  if (fitnessFormRef.value) {
    fitnessFormRef.value.resetForm();
  }
};

// 删除健身记录
const deletetag = (index) => {
  if (!listData.value[selectDate.value]) return;
  
  listData.value[selectDate.value].splice(index, 1);
  saveData(listData.value);
  message.success('已删除');
};

// 生成随机健身记录
const generateRandomFitnessRecord = () => {
  const typeIndex = Math.floor(Math.random() * fitnessTypesRef.value.length);
  const intensityIndex = Math.floor(Math.random() * intensityOptions.length);
  const duration = Math.floor(Math.random() * 90) + 10; // 10-100分钟
  
  return {
    type: fitnessTypesRef.value[typeIndex],
    duration: duration,
    intensity: intensityOptions[intensityIndex],
    note: `${fitnessTypesRef.value[typeIndex].value}锻炼 ${duration}分钟`,
    timestamp: Date.now() + Math.floor(Math.random() * 1000)
  };
};

// 生成当月的随机健身数据
const generateMonthlyData = () => {
  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();
  const daysInMonth = today.daysInMonth();
  
  const mockData = {};
  
  // 为本月的一些日期生成随机健身记录
  for (let i = 1; i <= daysInMonth; i++) {
    // 70%的概率生成数据
    if (Math.random() < 0.7) {
      const date = dayjs(new Date(currentYear, currentMonth, i));
      
      // 如果日期已经超过今天，就跳过
      if (date.isAfter(today)) continue;
      
      const dateStr = date.format('YYYY-MM-DD');
      
      // 每天1-3条记录
      const recordCount = Math.floor(Math.random() * 3) + 1;
      mockData[dateStr] = [];
      
      for (let j = 0; j < recordCount; j++) {
        mockData[dateStr].push(generateRandomFitnessRecord());
      }
    }
  }
  
  return mockData;
};

// 打开抽屉
const showDrawer = () => {
  drawerVisible.value = true;
};

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false;
};

// 更新健身类型
const updateFitnessTypes = (newTypes) => {
  fitnessTypesRef.value = newTypes;
  
  // 同步更新所有健身记录中的健身类型
  listData.value = updateRecordTypes(listData.value, newTypes);
  
  // 保存到本地存储
  saveTypes(newTypes);
  saveData(listData.value);
};

// 组件挂载时的处理
onMounted(() => {
  // 尝试加载保存的健身类型
  const savedTypes = loadTypes();
  if (savedTypes) {
    fitnessTypesRef.value = savedTypes;
  }
  
  // 检查数据是否为空
  if (Object.keys(listData.value).length === 0) {
    // 首先尝试迁移旧数据
    const migratedData = migrateOldData();
    
    if (migratedData) {
      listData.value = migratedData;
      saveData(migratedData);
      message.success('旧数据已成功迁移到新版本');
    } else {
      // 如果没有旧数据，生成随机数据
      const mockData = generateMonthlyData();
      listData.value = mockData;
      saveData(mockData);
      message.success('已生成示例健身数据');
    }
  } else {
    // 确保已有数据中的健身类型是最新的
    listData.value = updateRecordTypes(listData.value, fitnessTypesRef.value);
  }
});

const clearData = () => {
  listData.value = {};
  saveData(listData.value);
  message.success('已清空本地数据');
};
</script>

<style scoped lang="less">
.fitness-app {
  padding: 20px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.app-title {
  margin: 0;
}
</style>
