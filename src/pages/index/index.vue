<template>
  <view class="head">
    <text class="headTitle">记账本</text>
    <!-- 总支出 -->
    <view>
      <text class="toYM">
        {{ getToDate[0] + dateName[0] + getToDate[1] + dateName[1] }}
      </text>
      <text class="totalText">
        总支出￥{{ totalExpenditure }} 总收入￥{{ totalIncome }}
      </text>
    </view>
  </view>
  <!-- 内容框 -->
  <!-- 遍历年份 -->
  <view v-for="(yearItem, yearIndex) in userCashBookDB.year" :key="yearIndex">
    <!-- 遍历月份 -->
    <view v-for="(monthItem, monthIndex) in yearItem.month" :key="monthIndex">
      <!-- 遍历天数 -->
      <view v-for="(dayItem, dayIndex) in monthItem.day" :key="dayIndex">
        <uni-card
          :title="`${yearItem.date}${dateName[0]}${monthItem.date}${dateName[1]}${dayItem.date}${dateName[2]}`"
        >
          <!-- 卡片 -->
          <view
            class="cardInfo"
            v-for="(infoitem, infoIndex) in dayItem.info"
            :key="infoIndex"
          >
            <!-- 卡片内容 -->
            <view>
              <view class="infoTop">
                <!-- 显示分类 -->
                <text> {{ infoitem.typeName }} </text>
                <!-- 显示金额 -->
                <text
                  class="amountText"
                  :class="{
                    isIncome: infoitem.type == 'income',
                    isExpend: infoitem.type == 'expend',
                  }"
                >
                  {{ infoitem.type == "income" ? "+" : "-" }}
                  {{ infoitem.amount.toFixed(2) }}
                </text></view
              >
              <!-- 卡片内容底部 -->
              <view class="infoBottom">
                <text>{{ infoitem.detailTime }}</text>
                <span> | </span>
                <text>{{ infoitem.remark }}</text>
              </view>
            </view>
            <!-- 显示价格 -->
          </view>
        </uni-card>
      </view>
    </view>
    <!-- 弹出表单 -->
    <uni-popup ref="popup" type="bottom" background-color="white">
      <uni-forms ref="form">
        <uni-row>
          <view id="formInfo"></view>
          <uni-col :span="18" :offset="3">
            <!-- 支出&收入按钮 -->
            <uni-forms-item required>
              <uni-data-checkbox
                mode="tag"
                selectedColor="#42b883"
                v-model="baseFormData.type"
                :localdata="formDBRule.fundType"
              />
              <!-- 时间 -->
              <uni-datetime-picker
                type="timestamp"
                :clear-icon="false"
                v-model="baseFormData.detailTime"
                @change="setlectTime"
              />
            </uni-forms-item>
            <!-- 金额 -->
            <uni-forms-item label="金额" required>
              <uni-easyinput v-model="baseFormData.amount" />
            </uni-forms-item>
            <!-- 时间 -->
            <uni-forms-item label="类型" required>
              <uni-easyinput v-model="baseFormData.typeName" />
            </uni-forms-item>
            <!-- 备注 -->
            <uni-forms-item label="备注">
              <uni-easyinput v-model="baseFormData.remark" />
            </uni-forms-item>
            <!-- 按钮 -->
            <uni-forms-item>
              <uni-row>
                <uni-col :span="10">
                  <button @click="cancel">取消</button>
                </uni-col>
                <uni-col :offset="4" :span="10">
                  <button @click="submit">确定</button>
                </uni-col>
              </uni-row>
            </uni-forms-item>
          </uni-col>
        </uni-row>
      </uni-forms>
    </uni-popup>
    <!-- 悬浮按钮 -->
  </view>
  <uni-fab
    horizontal="right"
    vertical="bottom"
    direction="vertical"
    :pattern="{ icon: 'compose', buttonColor: '#42b883' }"
    @fabClick="openpopup"
  />
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import { cashBookDB } from "@/db/cashBookDB.js";
import { formsDB } from "@/db/formsDB.js";
// import { uniPopup } from "@/components/uni-popup/uni-popup.vue";
const cashBookDBs = cashBookDB();
// cashBookDBs.cashBookDB
// 用于vuefor批量渲染
if (uni.getStorageSync("cashBookDB") == null || uni.getStorageSync("cashBookDB") == "") {
  cashBookDBs.saveData();
  cashBookDBs.sortData();
}
// cashBookDBs.replaceData(userCashBookDB);
// let userCashBookDB = ref(uni.getStorageSync("cashBookDB"));

let userCashBookDB = ref(uni.getStorageSync("cashBookDB"));
// 用于计算所在月收入
const totalIncome = cashBookDBs.calculateTotalIncome();
// 用于计算所在月总支出
const totalExpenditure = cashBookDBs.calculateTotalExpenditure();
console.log(totalIncome, totalExpenditure);

const formsDBs = formsDB();
let formDBRule = ref(formsDBs.formsDB);
const dateName = ref(["年", "月", "日"]);
const getToDate = ref([
  new Date().getFullYear(),
  new Date().getMonth() + 1,
  new Date().getDay(),
]);
const popup = ref();
const openpopup = () => {
  console.log(popup);
  if (popup.value) {
    popup.value[0].open();
  }
};

let baseFormData = ref({
  amount: null,
  typeName: null,
  type: null,
  detailTime: null,
  remark: null,
});
let setlectTime = (e) => {
  baseFormData.value.detailTime = e;
};
// let { year, mouth, day } = defineStore(cashBookDBs);

let dialogInputConfirm = () => {};
let cancel = () => {
  if (popup.value) {
    popup.value[0].close();
  }
};
let submit = (Qyear, Qmonth, Qday, Qtype, QtypeName, Qamount, Qremark, QdetailTime) => {
  let dateObj = new Date(baseFormData.value.detailTime);
  Qyear = dateObj.getFullYear();
  Qmonth = dateObj.getMonth() + 1;
  Qday = dateObj.getDate();
  Qtype = baseFormData.value.type;
  QtypeName = baseFormData.value.typeName;
  Qamount = parseInt(baseFormData.value.amount);
  Qremark = baseFormData.value.remark;
  QdetailTime = dateObj.getHours().toString() + ":" + dateObj.getMinutes().toString();
  console.log("submit", baseFormData.value.detailTime);
  if (baseFormData.value.amount != null) {
    cashBookDBs.pushDate(
      Qyear,
      Qmonth,
      Qday,
      Qtype,
      QtypeName,
      Qamount,
      Qremark,
      QdetailTime
    );
    console.log(Qyear, Qmonth, Qday, baseFormData.value.detailTime);
    popup.value[0].close();

    cashBookDBs.saveData();
    cashBookDBs.sortData();
  }
};
</script>

<style scoped>
form {
  @apply px-4;
}
.head {
  background: #42b883;
  @apply text-white;
  @apply pb-4 z-10 absolute;
  @apply sticky top-0;
}
.cardBody {
  @apply text-2xl;
}
.headTitle {
  @apply text-center text-2xl block py-5;
}
.toYM {
  @apply pl-5;
}
.totalText {
  @apply float-right pr-4 opacity-80;
}
.amountText {
  @apply float-right;
}
#formInfo {
  @apply mt-4 pt-5;
}
.isIncome {
  @apply text-lime-500;
}
.isExpend {
  @apply text-rose-500;
}
.infoTop {
  @apply pt-2 text-base;
}
.infoBottom {
  border-bottom: 2px solid #ededed;
  @apply pb-1 text-xs;
}
.cardInfo {
  @apply pb-2;
}
</style>
