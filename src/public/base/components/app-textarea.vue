<template>
  <textarea :value="value"
            v-bind="{...$attrs}"
            @input="onInput($event)"
            @blur="onBlur"
            ref="textarea"
  ></textarea>
</template>

<script>

import {FormInputAdapter} from "../../adapter/element";

function calcBoxStyle(target) {
  const style = window.getComputedStyle(target);
  return {
    scrollHeight: target.scrollHeight,
    clientHeight: target.clientHeight,
    positionInfo: target.getBoundingClientRect(),
    ...[
      'box-sizing',
      'width',
      'height',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'letter-spacing',
      'line-height',
      'font-family',
      'font-weight',
      'font-size',
      'text-rendering',
      'text-transform',
      'text-indent',
      'border-width'
    ].reduce((m, c) => {
      m[c] = style.getPropertyValue(c)
      return m
    }, {})
  }
}

/** textarea盒模型：
 *                                         margin-top
 *                                       | border-top     |
 *                                       | padding-top    |
 * margin-left border-left padding-left  | content        |  padding-right border-right margin-right
 *                                       | padding-bottom |
 *                                       | border-bottom  |
 *                                         margin-bottom
 * 计算textarea的高度时:
 * scrollHeight = padding + content
 * box-sizing为border-box时，height = border + padding + content
 * box-sizing为content-box时，height = content
 *
 *
 *
 */
export default {
  name: "app-textarea",
  props: ['value'],
  computed: {
    textarea() {
      return this.$refs.textarea
    }
  },
  di: {
    providers: [FormInputAdapter],
    inject: {
      formInput: FormInputAdapter
    }
  },
  created() {
  },
  mounted() {
    this.refresh()
  },
  updated() {
    this.refresh()
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
      if (this.formInput) {
        this.formInput.validate("change");
      }
    },
    onBlur() {
      if (this.formInput) {
        this.formInput.validate("blur");
      }
    },
    refresh() {
      const {scrollHeight, clientHeight} = calcBoxStyle(this.textarea)
      if(scrollHeight !== clientHeight) {
        this.textarea.style.height = 'auto';
        const style = calcBoxStyle(this.textarea)
        const initialHeight = parseFloat(style.height)
        const offset = style.scrollHeight - style.clientHeight
        const newHeight = offset + initialHeight;
        if(offset > 0) {
          this.textarea.style.height = newHeight + 'px'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
textarea {
  //box-sizing: content-box;
  //box-sizing: border-box;

  display: block;
  width: 100%;
  padding: 5px 15px;
  line-height: 1.5;
  color: rgb(96, 98, 102);
  background-color: rgb(255, 255, 255);
  background-image: none;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  resize: vertical;
}
</style>
