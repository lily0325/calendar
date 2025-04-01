<template>
  <div style="padding: 10px">
    <!-- <h2 style="text-align: center">健身记录日历</h2> -->
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
            v-for="val in years"
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
          class="my-month-select"
          @change="
            (selectedMonth) => {
              onChange(
                current.month(parseInt(String(selectedMonth), 10))
              );
            }
          "
        >
          <a-select-option
            v-for="(val, index) in months"
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

<script setup>
const props = defineProps({
  // value: {
  //   type: Object,
  //   required: true
  // },
  current: {
    type: Object,
    required: true
  },
  onChange: {
    type: Function,
    required: true
  }
});

// 获取月份数组
const months = (() => {
  const localeData = props.current.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    months.push(localeData.monthsShort(props.current.month(i)));
  }
  return months;
})();

// 获取年份数组
const years = (() => {
  const year = props.current.year();
  const years = [];
  for (let i = year - 10; i < year + 10; i += 1) {
    years.push(i);
  }
  return years;
})();
</script> 

<style scoped>
.my-year-select {
  min-width: 150px;
}

.my-month-select {
  min-width: 150px;
}


</style>
