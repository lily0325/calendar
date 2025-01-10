<template>
  <a-config-provider :locale="zhCN">
    <a-calendar v-model:value="value">
      <template #headerRender="{ value: current, onChange }">
        <div style="padding: 10px">
          <h2 style="text-align: center">行为日历</h2>
          <a-row type="flex" justify="space-evenly">
            <a-col>
              <a-select
                :dropdown-match-select-width="false"
                class="my-year-select"
                :value="String(current.year())"
                @change="
                  (newYear) => {
                    onChange(current.year(+newYear));
                  }
                "
              >
                <a-select-option
                  v-for="val in getYears(current)"
                  :key="String(val)"
                  class="year-item"
                >
                  {{ val }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col>
              <a-select
                :dropdown-match-select-width="false"
                :value="String(current.month())"
                @change="
                  (selectedMonth) => {
                    onChange(
                      current.month(parseInt(String(selectedMonth), 10))
                    );
                  }
                "
              >
                <a-select-option
                  v-for="(val, index) in getMonths(current)"
                  :key="String(index)"
                  class="month-item"
                >
                  {{ val }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </div>
      </template>
      <template #dateCellRender="{ current }">
        <ul class="events">
          <li v-for="(item,index) in getListData(current)" :key="item.content">
            <!-- <a-badge :status="item.type" :text="item.content" /> -->
            <div class="tag" :style="{'background':colorList[index]}">{{ item.content }}</div>
          </li>
        </ul>
      </template>
    </a-calendar>
  </a-config-provider>
</template>

<script setup>
import { ref, watch } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN.js";

const colorList = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
];

const value = ref();

const getListData = (value) => {
  let listData;
  // console.log(value.format("MM-DD") );
  switch (value.date()) {
    case 8:
      listData = [
        { type: "warning", content: "练胸" },
        { type: "success", content: "This is usual event." },
      ];
      break;
    case 10:
      listData = [
        { type: "warning", content: "练背" },
        { type: "success", content: "This is usual event." },
        { type: "error", content: "This is error event." },
      ];
      break;
    case 15:
      listData = [
        { type: "warning", content: "This is warning event" },
        { type: "success", content: "This is very long usual event。。...." },
        { type: "success", content: "This is very long usual event。。...." },
        { type: "success", content: "This is very long usual event。。...." },
        { type: "success", content: "This is very long usual event。。...." },
      ];
      break;
    default:
  }
  if (!listData) return [];
  listData = listData.map((e) => {
    return {
      ...e,
      content: e.content.substring(0, 4),
    };
  });
  return listData || [];
};

const getMonths = (value) => {
  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(localeData.monthsShort(value.month(i)));
  }
  return months;
};

const getYears = (value) => {
  const year = value.year();
  const years = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    years.push(i);
  }
  return years;
};
</script>

<style scoped lang="less">
.events {
  list-style: none;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.tag {
  font-size: 10px;
  // background: pink;
  border-radius: 12%;
  padding: 2px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  margin-bottom: 2px;
  color: white;
  // font-weight: bold;
}
</style>
