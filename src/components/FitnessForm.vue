<template>
  <div class="fitness-form">
    <a-form layout="vertical" :model="formState">
      <a-form-item 
        label="健身类型" 
        name="type"
        :rules="[{ required: true, message: '请选择健身类型' }]"
      >
        <a-select v-model:value="selectedTypeId" style="width: 100%">
          <a-select-option v-for="type in fitnessTypes" :key="type.id" :value="type.id">
            <a-tag :color="type.color">{{ type.value }}</a-tag>
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item 
        label="时长(分钟)" 
        name="duration"
        :rules="[{ required: true, message: '请输入时长' }]"
      >
        <a-input-number v-model:value="formState.duration" :min="1" :max="360" style="width: 100%" />
      </a-form-item>
      
      <a-form-item 
        label="强度" 
        name="intensity"
        :rules="[{ required: true, message: '请选择强度' }]"
      >
        <a-select v-model:value="selectedIntensityValue" style="width: 100%">
          <a-select-option v-for="intensity in intensityOptions" :key="intensity.value" :value="intensity.value">
            <a-tag :color="intensity.color">{{ intensity.value }}</a-tag>
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="备注(可选)" name="note">
        <a-textarea v-model:value="formState.note" placeholder="填写备注信息" :rows="2" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';

const props = defineProps({
  fitnessTypes: {
    type: Array,
    required: true
  },
  intensityOptions: {
    type: Array,
    required: true
  },
  initialValues: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:formState']);

const formState = reactive({
  type: props.initialValues.type || props.fitnessTypes[0],
  duration: props.initialValues.duration || 30,
  intensity: props.initialValues.intensity || props.intensityOptions[1],
  note: props.initialValues.note || ''
});

// 使用计算属性来处理类型选择 - 使用ID
const selectedTypeId = computed({
  get: () => formState.type?.id || props.fitnessTypes[0]?.id,
  set: (id) => {
    formState.type = props.fitnessTypes.find(type => type.id === id) || props.fitnessTypes[0];
  }
});

// 使用计算属性来处理强度选择
const selectedIntensityValue = computed({
  get: () => formState.intensity?.value || '',
  set: (value) => {
    formState.intensity = props.intensityOptions.find(intensity => intensity.value === value) || props.intensityOptions[1];
  }
});

// 监听表单状态变化并发送给父组件
watch(formState, (newValue) => {
  emit('update:formState', newValue);
}, { deep: true });

// 重置表单方法，暴露给父组件
const resetForm = () => {
  formState.type = props.fitnessTypes[0];
  formState.duration = 30;
  formState.intensity = props.intensityOptions[1];
  formState.note = '';
};

// 暴露方法给父组件
defineExpose({
  resetForm,
  formState
});
</script>

<style scoped>
.fitness-form {
  margin-top: 20px;
}
</style> 