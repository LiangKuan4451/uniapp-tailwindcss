<template>
  <view>
    <view class="container">
      <!-- 用户头像 -->
      <button
        class="userAvatar"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
        :disabled="isLogin == true"
      >
        <!-- 头像地址 -->
        <image class="userImgUrl" :src="userImgUrl"></image>
      </button>
      <!-- 用户昵称 -->
      <input
        class="userNickName"
        type="nickname"
        placeholder="请点击输入昵称"
        :value="userName"
        @change="onUserName"
        :disabled="isLogin == true"
      />
    </view>
    <view class="EventButton">
      <button v-if="!isLogin" @click="OnLogin">登录</button>
      <button v-else @click="OnQuit">退出</button>
      <button @click="clearDB">清除数据</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
// 检测登录状态
let isLogin = ref(uni.getStorageSync("isLogin"));
// console.log(isLogin.value);
// 默认头像地址
const defaultAvatarUrl =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";
// 储存用户名称
let userName = ref(null);
// 储存用户头像
let userImgUrl = ref(defaultAvatarUrl);

// 用户登录
uni.login({
  provider: "weixin",
  success: (result) => {
    uni.request({
      url: "https://api.weixin.qq.com/sns/jscode2session",
      data: {
        appid: "wxdb16a214c8c623d1",
        secret: "eb2aa59cb629c169915b3a6c6d83bb5e",
        js_code: result.code,
        grant_type: "authorization_code",
      },
      success: (res) => {
        //获得token完成登录

        uni.setStorageSync("token", res.data);
      },
    });
    if (isLogin.value == true) {
      userName.value = uni.getStorageSync("userName");
      userImgUrl.value = uni.getStorageSync("userImgUrl");
    }
    console.log("uni.login", result);
  },
  fail: (error) => {
    console.log("uni.login", error);
  },
});

const userInfo = uni.getAccountInfoSync();
// 获取用户认证
uni.authorize({
  scope: "scope.userInfo",
  success: (result) => {
    console.log("uni.authorize", result);
  },
  fail: (error) => {
    console.log(error);
  },
});
// 获取用户名称
let onUserName = (e) => {
  userName.value = e.detail.value;
  // console.log(userInfo);
  console.log(e);
};

// 获取用户头像
let onChooseAvatar = (e) => {
  userImgUrl.value = e.detail.avatarUrl;
  // console.log(userInfo);
  // console.log(e);
};
let OnLogin = () => {
  if (
    userName.value == null ||
    userName.value == "" ||
    userImgUrl.value == defaultAvatarUrl
  ) {
  } else {
    uni.setStorage({
      key: "isLogin",
      data: true,
      success: function () {
        isLogin.value = true;
        uni.setStorageSync("userImgUrl", userImgUrl.value);
        uni.setStorageSync("userName", userName.value);
        // console.log("uni.setStorage", isLogin);
      },
    });
  }
};
let OnQuit = () => {
  uni.setStorage({
    key: "isLogin",
    data: false,
    success: function () {
      isLogin.value = false;
      userImgUrl.value = defaultAvatarUrl;
      userName.value = "";
      uni.setStorageSync("userImgUrl", defaultAvatarUrl);
      uni.setStorageSync("userName", userName.value);
    },
  });
};
let clearDB = () => {
  uni.clearStorageSync("cashBookDB");
};
</script>

<style scoped>
.container {
  @apply pt-10;
}
.userAvatar {
  @apply w-24 h-24 p-0;
}
.userImgUrl {
  @apply w-24 h-24;
}
.userNickName {
  @apply my-4 h-10 text-center text-4xl;
}
.EventButton {
  @apply px-20 pt-32;
}
</style>
