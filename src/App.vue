<template>
  <a-calendar :value="date" @select="onSelect" @panelChange="onPanelChange">
    <template #headerRender="{ value: current, type, onChange, onTypeChange }">
      <div style="padding: 10px">
        <div style="margin-bottom: 10px">行为日历</div>
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-radio-group
              size="small"
              :value="type"
              @change="(e) => onTypeChange(e.target.value)"
            >
              <a-radio-button value="month">Month</a-radio-button>
              <a-radio-button value="year">Year</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col>
            <a-select
              size="small"
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
              size="small"
              :dropdown-match-select-width="false"
              :value="String(current.month())"
              @change="
                (selectedMonth) => {
                  onChange(current.month(parseInt(String(selectedMonth), 10)));
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
  </a-calendar>
</template>

<script setup>
import { ref, watch } from "vue";
import dayjs, { Dayjs } from "dayjs";
const date = ref(dayjs("2017-01-25"));
const selectedValue = ref(dayjs("2017-01-25"));

const onSelect = (value) => {
  date.value = value;
  selectedValue.value = value;
};
const onPanelChange = (value) => {
  date.value = value;
};
</script>

<style scoped lang="less">
</style>
