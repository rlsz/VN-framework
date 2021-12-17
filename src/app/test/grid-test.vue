<template>
  <div class="flex vertical">
    <div class="test-grid">
      <span>name</span>
      <span>是股票名称的<span class="test-tag color-2">输出字段</span>与<span class="test-tag color-1">检索字段</span>，在后续步骤中设置为<span class="test-tag color-3">模糊匹配</span>，对应字段类型为keyword。</span>
      <span>code</span>
      <span>是股票编码的<span class="test-tag color-2">输出字段</span>与<span class="test-tag color-1">检索字段</span>，在后续步骤中设置为<span class="test-tag color-3">模糊匹配</span>，对应字段类型为keyword。</span>
      <span>rate</span>
      <span class="placeholder"></span>
      <span>riskLevel</span>
      <span style="grid-row:3/5;" class="merge-row">为<span class="test-tag color-2">输出字段</span>与<span class="test-tag color-4">排序字段</span>，对应字段类型为keyword。</span>
      <span>company</span>
      <span class="placeholder"></span>
      <span>manager</span>
      <span style="grid-row:5/7;" class="merge-row">为<span class="test-tag color-2">输出字段</span>，对应字段类型为keyword。</span>
      <span>market</span>
      <span class="placeholder"></span>
      <span>maeketName</span>
      <span class="placeholder"></span>
      <span>subType</span>
      <span class="placeholder"></span>
      <span>subTypes</span>
      <span style="grid-row:7/11;" class="merge-row">为<span class="hs-tag-1 color-2">输出字段</span>与<span class="hs-tag-1 color-4">排序字段</span>，对应字段类型为keyword。</span>
    </div>
    <div class="flex">
      <button class="app-form" @click="showMenu = !showMenu">{{showMenu?'隐藏菜单':'显示菜单'}}</button>
      <button class="app-form" @click="expend = !expend">{{expend?'收起菜单':'展开菜单'}}</button>
    </div>
    <div class="test-grid-1" :class="{'hide-menu':!showMenu, fold: !expend}">
      <span class="menu">menu area</span>
      <span class="header">header area</span>
      <span class="navigation">navigation area</span>
      <span class="content">content area</span>
      <span class="footer">footer area</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "grid-test",
  data() {
    return {
      showMenu: true,
      expend: true
    }
  }
}
</script>

<style lang="less" scoped>
.test-grid {
  background: #fafafa;
  border: 1px solid #cfd2d6;
  border-radius: 4px;
  padding: 5px 8px;

  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Light;
  font-weight: 300;
  text-align: left;
  color: #303235;
  line-height: 20px;

  display: grid;
  grid-template-columns: auto 1fr;
  //grid-template-columns: repeat(12, minmax(0,1fr));
  column-gap: 8px;

  > *:nth-child(2n + 1) {
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: left;
    color: #292c33;
  }

  > * {
    margin: 5px 0;
    padding: 0 8px;
    &:nth-child(2n + 1) {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #292c33;
    }
    &:nth-child(2n) {
      border: 1px dashed rgba(0,0,0,0.1);
    }
  }
  .merge-row {
    grid-column: 2;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .placeholder {
    display: none;
  }
}
.test-tag {
  display: inline-block;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  padding: 0px 6px;
  background: rgba(234, 236, 241, 0.6);
  color: #5e697e;
  margin: 0 4px;
  &.color-1 {
    background: #e6f7f1;
    color: #10b981;
  }
  &.color-2 {
    background: #ecf1fd;
    color: #4c7cee;
  }
  &.color-3 {
    background: #efeffd;
    color: #6366f1;
  }
  &.color-4 {
    background: #e6f6fd;
    color: #0ea5e9;
  }
}
.test-grid-1 {
  display: grid;
  grid-template-areas:
      "menu header"
      "menu navigation"
      "menu content"
      "menu footer";
  grid-template-columns: auto 1fr;
  grid-gap: 10px;

  background: #fafafa;
  //border: 1px solid #cfd2d6;
  border-radius: 4px;
  //padding: 5px 8px;
  margin: 4px 0;

  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Light;
  font-weight: 300;
  text-align: left;
  color: #303235;
  line-height: 20px;
  > * {
    padding: 0 8px;
  }

  .menu {
    grid-area: menu;
    border: 1px dashed rgba(0,0,0,0.1);
    width: 200px;
  }
  .header {
    grid-area: header;
    border: 1px dashed rgba(0,0,0,0.1);
  }
  .navigation {
    grid-area: navigation;
    border: 1px dashed rgba(0,0,0,0.1);
  }
  .content {
    grid-area: content;
    border: 1px dashed rgba(0,0,0,0.1);
    min-height: 200px;
  }
  .footer {
    grid-area: footer;
    border: 1px dashed rgba(0,0,0,0.1);
  }

  &.hide-menu {
    grid-column-gap: 0;
    grid-row-gap: 1px;
    .menu {
      display: none;
    }
  }
  &.fold {
    .menu {
      width: 60px;
    }
  }
}
</style>
