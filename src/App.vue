<template>
  <a-config-provider :locale="zhCN">
    <a-calendar v-model:value="value" @select="select">
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
          <li v-for="(item, index) in getListData(current)" :key="item">
            <div class="tag" :style="{ background: randomColor(index) }">
              {{ item }}
            </div>
          </li>
        </ul>
      </template>
    </a-calendar>
  </a-config-provider>
  <a-modal
    v-model:open="open"
    :title="selectDate"
    @ok="handleOk"
    okText="确认"
    cancelText="取消"
  >
    <a-list
      size="small"
      bordered
      :data-source="listData[selectDate]"
      class="list"
    >
      <template #renderItem="{ item, index }">
        <a-list-item style="justify-content: left"
          ><CloseCircleOutlined
            style="color: red"
            @click="deletetag(index)"
          /><a-tag
            :bordered="false"
            :color="randomColor(index)"
            class="list-tag"
            >{{ item }}</a-tag
          ></a-list-item
        >
      </template>
      <template #header>
        <div style="text-align: center">当天已填写内容</div>
      </template>
    </a-list>
    <a-textarea
      style="margin-top: 10px"
      v-model:value="dateNote"
      placeholder="填上你想填的内容"
      :rows="6"
    />
  </a-modal>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { CloseCircleOutlined } from "@ant-design/icons-vue";
import zhCN from "ant-design-vue/es/locale/zh_CN.js";
const colorList = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#87d068",
  "#1d90ff",
  "#f50000",
  "#008578",
  "#009688",
  "#536dfe",
  "#ff9800",
  "#00c853",
  "#d50000",
  "#00bfa5",
  "#ff6d00",
  "#00e676",
  "#ff3d00",
  "#00d5ee",
  "#ff6400",
  "#00c100",
];

const randomColor = (index) => {
  return colorList[parseInt(Math.random() * 20)];
};

const value = ref();

const listData = ref(JSON.parse(localStorage.getItem("listData") || "{}"));

const getListData = (value) => {
  if (listData.value) {
    if (listData.value[value.format("YYYY-MM-DD")]) {
      return listData.value[value.format("YYYY-MM-DD")];
    }
  }
  return [];
};

const open = ref(false);
const selectDate = ref("");
const dateNote = ref("");

const select = (selectedDates, info) => {
  // console.log(selectedDates.format("YYYY-MM-DD"));

  if (info.source && info.source != "date") {
    open.value = false;
    return;
  }
  open.value = true;
  selectDate.value = selectedDates.format("YYYY-MM-DD");
};

const handleOk = () => {
  if (!dateNote.value) return;
  selectDate.value in listData.value
    ? listData.value[selectDate.value].push(dateNote.value)
    : (listData.value[selectDate.value] = [dateNote.value]);
  localStorage.setItem("listData", JSON.stringify(listData.value));
  // open.value = false;
  dateNote.value = "";
};

const deletetag = (index) => {
  // console.log(index);
  listData.value[selectDate.value].splice(index, 1);
  localStorage.setItem("listData", JSON.stringify(listData.value));
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
  border-radius: 3px;
  padding: 2px;
  width: 100%;
  text-align: center;
  overflow-x: hidden;
  white-space: nowrap;
  margin-bottom: 2px;
  color: white;
  // font-weight: bold;
}
.list {
  height: 200px;
  overflow: scroll;
}
.list-tag {
  margin-left: 10px;
  overflow-x: scroll;
}
</style>
