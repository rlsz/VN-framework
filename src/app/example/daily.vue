<template>
  <div class="page-frame">
    <div class="header">
      <!--      <div class="daily-top">-->
      <!--        <img src="../../assets/images/push_top_pic.png"/>-->
      <!--        <div class="inner flex vertical">-->
      <!--          <span class="font-1 bottom-line">虎博当日要闻</span>-->
      <!--          <span class="font-2 margin-1">{{ now|date('yyyy.MM.dd') }}</span>-->
      <!--          <span class="flex">-->
      <!--            <span class="font-3">{{ weekDay }}</span>-->
      <!--            <span class="font-3 right">Powered By Tigerobo</span>-->
      <!--          </span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="body">
      <div class="news-wrapper" v-if="list && list.length">
        <template v-for="(item,index) in list">
          <div class="news-item flex cross-center bg-white" :key="'news-item-'+index">
            <span class="order">{{ index + 1 | fillNumber('2.0') }}</span>
            <div class="fill-content flex vertical">
              <a :href="item.url" target="_blank" class="title" v-limit-line="2">{{ item.title }}</a>
              <div class="footer">
                <span>{{ item.publishTime }}</span>
                <span>{{ item.source }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-else-if="finish" class="flex center" style="flex: 1 1 0px;">
        <i class="empty">暂无资讯</i>
      </div>
    </div>
  </div>
</template>

<script>
import {AjaxService, GetQuery} from "@/public/base";
import {MainAjaxService} from "@/app/example/main.service";

export default {
  name: "daily",
  di: {
    inject: {
      ajax: AjaxService,
      mas: MainAjaxService
    }
  },
  data() {
    return {
      list: [],
      now: new Date(),
      finish: false
    }
  },
  computed: {
    sendDate() {
      return this.$options.filters.date(this.now, 'yyyy-MM-dd')
    },
    weekDay() {
      const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
      return '星期' + weekMap[this.now.getDay()]
    }
  },
  created() {
    const params = GetQuery()
    if (params.sendDate) {
      this.now = new Date(params.sendDate)
    } else {
      this.now = new Date('2021-03-25')
    }
    this.ajax.post('https://shgsec-csp-frontend-test.aigauss.com/api/home/parkBanner', {
      "offset": 0,
      "pageNum": 1,
      "pageSize": 10
    }, {
      headers: {
        authorization: 'null'
      }
    }).then(res => {
      this.list = res.data || []
    }).finally(() => {
      this.finish = true
    })
  },
}
</script>

<style lang="less" scoped>
.daily-top {
  position: relative;
  display: flex;

  img {
    width: 100%;
  }

  .inner {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 20px;
    bottom: 20px;

    .bottom-line {
      border-bottom: 3px solid #C21C1C;
      padding-bottom: 7px;
      align-self: flex-start;
    }

    .margin-1 {
      margin: 15px 0 4px;
    }
  }
}

.font-1 {
  font-size: 28px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #222222;
  line-height: 26px;
}

.font-2 {
  font-size: 14px;
  font-family: PingFang SC, PingFang SC-Medium;
  font-weight: 500;
  color: #222222;
  line-height: 14px;
}

.font-3 {
  font-size: 12px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #999999;
  line-height: 12px;
}

.news-wrapper {
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;

  .news-item {
    border-bottom: 1px solid rgba(234, 234, 234, 1);
    padding: 20px 12px;

    .footer {
      margin-top: 12px;

      font-size: 12px;
      line-height: 12px;
      display: flex;
      align-items: center;

      > * ~ * {
        margin-left: 10px;
      }
    }

    .order {
      font-size: 14px;
      font-family: Oswald, Oswald-Regular;
      font-weight: 400;
      color: #999999;

      margin: 0 12px 0 2px;
    }

    .title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 24px;
    }

    &:last-of-type {
      border-bottom: none;
    }

    &:nth-child(-n+3) .order {
      width: 19px;
      height: 19px;
      color: rgba(0, 0, 0, 0);
    }

    &:nth-child(1) .order {
      background: url("../../assets/images/rank_01_icon.png") center/cover no-repeat;
    }

    &:nth-child(2) .order {
      background: url("../../assets/images/rank_02_icon.png") center/cover no-repeat;
    }

    &:nth-child(3) .order {
      background: url("../../assets/images/rank_03_icon.png") center/cover no-repeat;
    }
  }
}
</style>
