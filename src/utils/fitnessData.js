/**
 * 健身类型选项
 */
export const fitnessTypes = [
  { id: 1, value: '跑步', color: '#f56a00' },
  { id: 2, value: '力量训练', color: '#ffbf00' },
  { id: 3, value: '游泳', color: '#00a2ae' },
  { id: 4, value: '骑行', color: '#87d068' },
  { id: 5, value: '篮球', color: '#536dfe' },
  { id: 6, value: '足球', color: '#ff9800' },
  { id: 7, value: '其他', color: '#00c853' },
];

/**
 * 强度选项
 */
export const intensityOptions = [
  { value: '低', color: '#87d068' },
  { value: '中', color: '#ffbf00' },
  { value: '高', color: '#f50000' },
];

/**
 * 保存健身记录数据到本地存储
 * @param {Object} data 健身记录数据
 */
export const saveData = (data) => {
  try {
    localStorage.setItem("fitnessRecords", JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
};

/**
 * 从本地存储加载健身记录数据
 * @returns {Object} 健身记录数据
 */
export const loadData = () => {
  try {
    return JSON.parse(localStorage.getItem("fitnessRecords") || "{}");
  } catch (error) {
    console.error('加载数据失败:', error);
    return {};
  }
};

/**
 * 保存健身类型数据到本地存储
 * @param {Array} types 健身类型数据
 */
export const saveTypes = (types) => {
  try {
    localStorage.setItem("fitnessTypes", JSON.stringify(types));
    return true;
  } catch (error) {
    console.error('保存健身类型失败:', error);
    return false;
  }
};

/**
 * 从本地存储加载健身类型数据
 * @returns {Array} 健身类型数据
 */
export const loadTypes = () => {
  try {
    const savedTypes = localStorage.getItem("fitnessTypes");
    return savedTypes ? JSON.parse(savedTypes) : null;
  } catch (error) {
    console.error('加载健身类型失败:', error);
    return null;
  }
};

/**
 * 转换旧数据格式到新格式
 * @returns {Object} 转换后的健身记录数据
 */
export const migrateOldData = () => {
  try {
    const oldData = JSON.parse(localStorage.getItem("listData") || "{}");
    const hasOldData = Object.keys(oldData).length > 0;
    
    if (!hasOldData) return null;
    
    const newData = {};
    Object.keys(oldData).forEach(date => {
      newData[date] = oldData[date].map((text, index) => ({
        type: fitnessTypes[index % fitnessTypes.length],
        duration: 30,
        intensity: intensityOptions[1],
        note: text,
        timestamp: Date.now() + index
      }));
    });
    
    return newData;
  } catch (error) {
    console.error('迁移旧数据失败:', error);
    return null;
  }
};

/**
 * 根据日期获取当天的健身记录
 * @param {Object} date 日期对象
 * @param {Object} data 健身记录数据
 * @returns {Array} 当天的健身记录
 */
export const getRecordsByDate = (date, data) => {
  if (!date || !data) return [];
  
  const dateStr = date.format("YYYY-MM-DD");
  return data[dateStr] || [];
};

/**
 * 计算指定日期的总健身时长
 * @param {Object} date 日期对象
 * @param {Object} data 健身记录数据
 * @returns {Number} 总健身时长
 */
export const calculateDurationTotal = (date, data) => {
  const records = getRecordsByDate(date, data);
  return records.reduce((total, item) => {
    return total + (item.duration || 0);
  }, 0);
};

/**
 * 更新所有健身记录中的健身类型
 * @param {Object} data 健身记录数据
 * @param {Array} types 最新的健身类型数据
 * @returns {Object} 更新后的健身记录数据
 */
export const updateRecordTypes = (data, types) => {
  const typesMap = {};
  types.forEach(type => {
    typesMap[type.id] = type;
  });
  
  const updatedData = { ...data };
  
  Object.keys(updatedData).forEach(dateStr => {
    updatedData[dateStr] = updatedData[dateStr].map(record => {
      // 如果记录中的健身类型存在并且在类型映射中找到对应的ID，则更新为最新的类型数据
      if (record.type && record.type.id && typesMap[record.type.id]) {
        return {
          ...record,
          type: typesMap[record.type.id]
        };
      }
      return record;
    });
  });
  
  return updatedData;
}; 