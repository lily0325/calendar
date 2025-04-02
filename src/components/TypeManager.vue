<template>
  <div class="type-manager">
    <div class="toolbar">
      <a-button type="primary" @click="showAddDialog">
        <PlusOutlined /> 添加健身类型
      </a-button>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      row-key="id"
      size="small"
    >
      <!-- 健身类型名称 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'value'">
          {{ record.value }}
        </template>

        <!-- 颜色显示 -->
        <template v-if="column.dataIndex === 'color'">
          <a-tag :color="record.color">{{ record.color }}</a-tag>
        </template>

        <!-- 操作列 -->
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" size="small" @click="showEditDialog(record)">
            编辑
          </a-button>
          <a-popconfirm
            title="确定要删除此健身类型吗？"
            @confirm="deleteType(record)"
            ok-text="确定"
            cancel-text="取消"
          >
            <a-button
              type="link"
              size="small"
              danger
              :disabled="isTypeInUse(record.id)"
            >
              删除
            </a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>

    <!-- 编辑/新增对话框 -->
    <a-modal
      v-model:visible="dialogVisible"
      :title="isEditing ? '编辑健身类型' : '添加健身类型'"
      @ok="handleSave"
      @cancel="handleCancel"
      :okButtonProps="{ disabled: !currentType.value.trim() }"
      okText="保存"
      cancelText="取消"
    >
      <a-form layout="vertical">
        <a-form-item 
          label="健身类型名称" 
          :validateStatus="!currentType.value.trim() ? 'error' : ''"
          :help="!currentType.value.trim() ? '健身类型名称不能为空' : ''"
        >
          <a-input v-model:value="currentType.value" placeholder="请输入健身类型名称" />
        </a-form-item>

        <a-form-item label="颜色">
          <a-select v-model:value="currentType.color">
            <a-select-option
              v-for="color in colorOptions"
              :key="color.value"
              :value="color.value"
            >
              <div style="display: flex; align-items: center">
                <div
                  :style="{
                    backgroundColor: color.value,
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    marginRight: '8px',
                  }"
                ></div>
                {{ color.name }}
              </div>
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 预览 -->
        <a-form-item label="预览">
          <div class="preview-container">
            <a-tag 
              :color="currentType.color" 
              style="font-size: 14px; padding: 5px 10px;"
            >
              {{ currentType.value || '健身类型' }}
            </a-tag>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";

const props = defineProps({
  fitnessTypes: {
    type: Array,
    required: true,
  },
  listData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:fitnessTypes"]);

// 对话框状态
const dialogVisible = ref(false);
const isEditing = ref(false);
const currentType = reactive({
  id: null,
  value: '',
  color: '#1890ff'
});

// 表格数据
const tableData = computed(() => {
  return props.fitnessTypes;
});

// 列定义
const columns = [
  {
    title: "健身类型",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "颜色",
    dataIndex: "color",
    key: "color",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];

// 颜色选项
const colorOptions = [
  { name: "红色", value: "#f5222d" },
  { name: "粉红", value: "#eb2f96" },
  { name: "紫色", value: "#722ed1" },
  { name: "蓝色", value: "#1890ff" },
  { name: "青色", value: "#13c2c2" },
  { name: "绿色", value: "#52c41a" },
  { name: "黄色", value: "#faad14" },
  { name: "橙色", value: "#fa8c16" },
  { name: "褐色", value: "#fa541c" },
  { name: "灰色", value: "#8c8c8c" },
];

// 显示添加对话框
const showAddDialog = () => {
  isEditing.value = false;
  resetCurrentType();
  dialogVisible.value = true;
};

// 显示编辑对话框
const showEditDialog = (record) => {
  isEditing.value = true;
  Object.assign(currentType, {
    id: record.id,
    value: record.value,
    color: record.color
  });
  dialogVisible.value = true;
};

// 重置当前编辑的类型
const resetCurrentType = () => {
  // 生成新ID (找到最大ID然后+1)
  const maxId = Math.max(0, ...props.fitnessTypes.map((type) => type.id));
  
  Object.assign(currentType, {
    id: maxId + 1,
    value: '',
    color: colorOptions[Math.floor(Math.random() * colorOptions.length)].value
  });
};

// 处理保存
const handleSave = () => {
  if (!currentType.value.trim()) {
    message.error("健身类型名称不能为空");
    return;
  }

  // 检查名称是否已存在
  const isDuplicate = props.fitnessTypes.some(
    (type) => type.id !== currentType.id && type.value === currentType.value
  );

  if (isDuplicate) {
    message.error("该健身类型名称已存在");
    return;
  }

  if (isEditing.value) {
    // 更新现有类型
    const updatedTypes = props.fitnessTypes.map((type) => {
      if (type.id === currentType.id) {
        return { ...currentType };
      }
      return type;
    });
    emit("update:fitnessTypes", updatedTypes);
    message.success("修改成功");
  } else {
    // 添加新类型
    const newType = { ...currentType };
    const updatedTypes = [...props.fitnessTypes, newType];
    emit("update:fitnessTypes", updatedTypes);
    message.success("添加成功");
  }

  dialogVisible.value = false;
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
};

// 删除健身类型
const deleteType = (record) => {
  if (isTypeInUse(record.id)) {
    message.error("该健身类型正在使用中，无法删除");
    return;
  }

  const updatedTypes = props.fitnessTypes.filter(
    (type) => type.id !== record.id
  );
  emit("update:fitnessTypes", updatedTypes);
  message.success("删除成功");
};

// 检查健身类型是否在使用中
const isTypeInUse = (typeId) => {
  for (const dateStr in props.listData) {
    for (const record of props.listData[dateStr]) {
      if (record.type && record.type.id === typeId) {
        return true;
      }
    }
  }
  return false;
};
</script>

<style scoped>
.type-manager {
  padding: 16px;
}

.toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.preview-container {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
}
</style> 