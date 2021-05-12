<template>
  <div class="test2-root">
    <div class="flex">
      <!-- 后端给的html内容中含有样式链接，会污染页面样式(例如导致所有页面a链接失效)，所以使用v-html-new来把样式内容处理掉 -->
<!--      <span class="test-box-1 html-new-general" v-html="$options.filters.highlight(test1)"></span>-->
      <span class="test-box-1" v-html-new="$options.filters.highlight(test1)"></span>
    </div>
    <div>
      <span>test multi select of el-select</span>
      <multi-select-bridge
          style="width: 378px;"
          v-model="multiValue1"
          placeholder="多选选择"
          :remote-method="queryOptions"
          value-key="id"
      >
        <template v-slot:default="{value,index}">
          <el-option :key="value.id" :label="value.name" :value="value"></el-option>
        </template>
      </multi-select-bridge>
      <multi-select-bridge
          style="width: 378px;"
          v-model="multiValue2"
          placeholder="单选选择"
          :remote-method="queryOptions"
          :multiple="false"
          value-key="id"
      >
        <template v-slot:default="{value,index}">
          <el-option :key="value.id" :label="value.name" :value="value"></el-option>
        </template>
      </multi-select-bridge>
    </div>
    <div @click="testFunc">
      <span>{{as.test2 || '-'}}</span>
    </div>
<!--    <div class="test-abc">center</div>-->
    <div>
      <compParent>
        <compChild></compChild>
      </compParent>
      <span @click="pushArray">add test item</span>
    </div>
    <app-sticky-container class="banners-test" :auto-scroll="3000" loop>
      <div class="test-item" v-for="(item, index) in testArray" v-bind:key="'test-sticky-key-'+index">
        <div class="item-content">{{ item }}</div>
      </div>
    </app-sticky-container>
    <div style="display: flex;background: green;overflow-x: hidden;">
      <span style="flex: 1;width:0;border:1px solid black;">ljaskjdilsjidasjjdlksasjdkajsdoiasjdlksjaajldlasjdlaskljasdlj</span>
      <span style="flex: 1;width:0;border:1px solid black;">111</span>
    </div>
    <!--    <span>{{data|filter}}</span>-->
    <div class="flex vertical">
      <span v-for="(value,index) in values" v-bind:key="'test-emotion-key-'+index">
        <span style="margin-right:12px;">{{ value }}</span>
        <app-emotion :value="value"></app-emotion>
      </span>
      <span>canvas test:<button @click="drawCanvas()">draw</button></span>
      <canvas id="test_canvas" style="width: 300px;height: 150px;border:1px solid black;"></canvas>
    </div>
    <div>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
              d="M10 15C9.44772 15 9 14.5523 9 14V11H6C5.44772 11 5 10.5523 5 10C5 9.44772 5.44772 9 6 9H9V6C9 5.44772 9.44772 5 10 5C10.5523 5 11 5.44772 11 6V9H14C14.5523 9 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H11V14C11 14.5523 10.5523 15 10 15Z"
              fill="#C11616"/>
        <path d="M1 10C1 14.9706 5.02944 19 10 19C14.6326 19 18.4476 15.5 18.9451 11" stroke="#569C3E"
              stroke-width="2"/>
        <path d="M19 10C19 5.02944 14.9706 1 10 1C5.36745 1 1.55238 4.50005 1.05493 9" stroke="#C11616"
              stroke-width="2"/>
      </svg>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 10C1 14.9706 5.02944 19 10 19C14.6326 19 18.4476 15.5 18.9451 11" stroke="#569C3E"
              stroke-width="2"/>
        <path d="M19 10C19 5.02944 14.9706 1 10 1C5.36745 1 1.55238 4.50005 1.05493 9" stroke="#C11616"
              stroke-width="2"/>
        <rect x="5" y="9" width="10" height="2" rx="1" fill="#569C3E"/>
      </svg>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 10C1 14.9706 5.02944 19 10 19C14.6326 19 18.4476 15.5 18.9451 11" stroke="#569C3E"
              stroke-width="2"/>
        <path d="M19 10C19 5.02944 14.9706 1 10 1C5.36745 1 1.55238 4.50005 1.05493 9" stroke="#C11616"
              stroke-width="2"/>
        <circle cx="10" cy="10" r="4" fill="#777777"/>
      </svg>
    </div>
    <div>
      <span>test icon</span>
      <input v-model.number="emotion"/>
      <app-emotion :value="emotion"></app-emotion>
      <span class="test-clip-path">
        <span
            :style="{'clip-path': path, width: '100px', height: '100px', display: 'inline-block', background: 'yellow'}"></span>
      </span>
      <span style="width: 200px;height: 200px;display: inline-block;">
<!--        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <path fill="none" stroke="red"-->
        <!--                d="M 0,0-->
        <!--               C 20,0, 60,50, 100,50-->
        <!--               S 120,120, 200,100-->
        <!--               " />-->
        <!--        </svg>-->
        <!--        <svg style="transform: translateY(-126px);" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <path fill="none" stroke="red"-->
        <!--                d="M 0,0-->
        <!--               C 20,0, 60,50, 100,50-->
        <!--               C 140,50, 120,120, 200,100-->
        <!--               " />-->
        <!--        </svg>-->
        <!--        <svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <path fill="none" stroke="red"-->
        <!--                d="M 0,0-->
        <!--               Q 60,40, 100,50-->
        <!--               Q 140,60, 200,100-->
        <!--               " />-->
        <!--        </svg>-->
        <!--        <svg style="transform: translateY(-126px);" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <path fill="none" stroke="red"-->
        <!--                d="M 0,0-->
        <!--               Q 60,40, 100,50-->
        <!--               T 200,100-->
        <!--               " />-->
        <!--        </svg>-->
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<!--          <path fill="none" stroke="red"-->
          <!--                d="M 100,50-->
          <!--                   A 60 40 0 1 0 110,50-->
          <!--                   A 25 25 90 1 0 100,50" />-->

          <path fill="none" stroke="red"
                d="M 100,50
                   A 60 40 0 1 0 150,80
                   Z"/>
          <!--          <path d="M100 100a9 9 0 1 0 -9 -9" stroke="#C11616" stroke-width="2"/>-->
          <path fill="none" stroke="red"
                d="M 6,10
                   A 6 4 10 1 0 14,10"/>
          <path fill="none" stroke="lime"
                d="M 6,10
                   A 6 4 10 1 1 14,10"/>

          <path fill="none" stroke="purple"
                d="M 6,10
                   A 6 4 10 0 1 14,10"/>

          <path fill="none" stroke="pink"
                d="M 6,10
                   A 6 4 10 0 0 14,10"/>
          <g>
            <circle cx="6" cy="10" r="1.5"/>
            <circle cx="14" cy="10" r="1.5"/>
          </g>
        </svg>
      </span>
    </div>
    <div>
      test
      <i class="arrow right solid"></i>
      <i class="arrow left solid"></i>
      <i class="arrow up solid"></i>
      <i class="arrow down solid"></i>
      <i class="arrow right"></i>
      <i class="arrow left"></i>
      <i class="arrow up"></i>
      <i class="arrow down"></i>
    </div>
    <div>
      <span>content box(default):</span>
      <div class="box-test">
        <div class="box-children-test">test</div>
      </div>
    </div>
    <div>
      <span>border box:</span>
      <div class="box-test">
        <div class="box-children-test" style="box-sizing: border-box;">test</div>
      </div>
    </div>
    <div>
      <span>test v-copy:</span>
      <span v-copy>text to copy</span>
    </div>
    <div>
      <span>test v-link:</span>
      <span v-link="'./test1'">click jump to test1</span>
    </div>
    <div>
      <span>test v-limit-line:</span>
      <span v-limit-line>line 1 text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line </span>
      <span v-limit-line="2">line 2 text to limit line text to limit text to limit line text to limiline text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line </span>
    </div>
    <div>
      <span>test highlight:</span>
      <span v-html="$options.filters.highlight(test, ['text'])"></span>
    </div>
  </div>
</template>

<script>
import {ModuleComponents} from './components'
import {AppService} from "@/app/app.service";
import {ForceRepaint} from "@/public/base";
import {LoggerService} from "@/public/logger";
import {test_text} from "./test11111";

export default {
  name: "test2",
  components: {
    ...ModuleComponents
  },
  di: {
    inject: {
      as: AppService,
      ls: LoggerService
    }
  },
  data() {
    return {
      multiValue1: [],
      multiValue2: null,
      test: 'text to limit line text to limit text to limit line text to limiline text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line text to limit line ',
      emotion: 0.3,
      testArray: [],
      path: "path('M 10,10 h 10 10 m  0,10 h 10')",
      values: [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.25, 0.499, 0.5, 0.501, 0.75, 0.98, 0.99, 1],
      test1: test_text
    }
  },
  created() {
    setTimeout(() => {
      ForceRepaint()
      this.ls.info('repaint success')
    }, 3000)

    const g = /([A-Z]\d+)\1+/g // 使用\1表达与前面group内容相同的匹配
    const g1 = /([A-Z]\d+){2,}/g
    const s = "A1+M2-N2N2+H4H4+H1H2H3H4+G7+H5/J3J3J3J3*PREXM('','','')"
    console.log(s)
    console.log('g', s.replace(g, '$1')) // 将excel公式中重复的变量去掉
    console.log('g1', s.replace(g1, '$1'))
  },
  methods: {
    drawCanvas() {
      const canvas = document.getElementById('test_canvas');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 300, 150);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(50, 50);
      ctx.arc(50, 75, 50, 0, 1.5 * Math.PI);
      ctx.arc(100, 75, 50, 0, 1.5 * Math.PI);

      // ctx.moveTo(0, 0);
      // ctx.bezierCurveTo(40,0, 60,50, 100,50);
      // ctx.bezierCurveTo(140, 50, 160,100, 200,100);
      // ctx.moveTo(0, 0);
      // ctx.quadraticCurveTo(40,0, 100,50)
      ctx.stroke();
    },
    pushArray() {
      if (this.testArray.length === 0) {
        this.testArray = [0, 1, 2]
      } else {
        this.testArray.unshift(this.testArray.length)
      }

    },
    testFunc() {
      var b = {
        a: 10
      }
      {
        b.a = 20
        function b(){}
        b.a = 30
      }
      console.log('here',b.a)
    },
    queryOptions(keyword) {
      return [{
        id: 1,
        name: 'test 1'
      },{
        id: 2,
        name: 'test 2'
      },{
        id: 3,
        name: 'test 3'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
.box-test {
  //display: inline-block;
  width: 200px;
  height: 200px;
  background-color: yellow;
  padding: 5px;
  border: yellowgreen solid 5px;
  margin: 5px;

  .box-children-test {
    width: 100%;
    height: 100%;
    padding: 10px;
    border: rgba(0, 0, 0, 1) solid 10px;
    background: greenyellow;
    opacity: 0.7;
  }
}

i.emotion {
  width: 20px;
  height: 20px;
  position: relative;
  z-index: 0;
  display: inline-block;

  &:before {
    position: absolute;
    content: '';
    left: 2px;
    top: 2px;
    right: 2px;
    bottom: 2px;
    background: white;
    z-index: -1;
    clip-path: circle(50%);
  }

  &:after {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;

    border: 3px solid #C11616; // #569C3E
    box-sizing: border-box;
    border-radius: 50%;
  }
}

.test-clip-path {
  display: inline-block;
  width: 300px;
  height: 300px;
  background: green;
  border: 1px solid black;
}

.banners-test {
  margin: 20px 0;
}

.test-item {
  box-sizing: border-box;
  width: 60%;
  height: 100px;
  margin: 0 5%;

  .item-content {
    box-sizing: border-box;
    background: green;
    width: 100%;
    height: 100%;
    padding: 20px 0;
  }
}
.test-abc{
  width: 150px;
  height: calc(100% - 0px);
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 5px;
  bottom: 5px;
  background: green;
}
.test-box-1 {
  border: 1px solid green;
  margin: 10px;
  flex: 0 0 46%;
  min-width: 0px;
  overflow-x: hidden;
  height: 300px;
  overflow-y: auto;
}
</style>
