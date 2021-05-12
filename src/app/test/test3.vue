<template>
  <div class="flex vertical">
    <div>array:{{ list }}</div>
    <div class="bg-white">item 2:{{ list[1] }}</div>
    <div>item 2' deepList:{{ list[1].deepList }}</div>
  </div>
</template>

<script>
import {LoggerService} from "@/public/logger";
import {DialogService} from "@/public/dialogs";

export default {
  name: "test3",
  di: {
    inject: {
      ls: LoggerService,
      ds: DialogService
    }
  },
  data() {
    return {
      list: [
        {
          id: 1,
          name: 'data 1',
          deepList: [
            {
              id: 11,
              name: 'name 11'
            },
            {
              id: 12,
              name: 'name 12'
            }
          ]
        },
        {
          id: 2,
          name: 'data 2',
          deepList: [
            {
              id: 21,
              name: 'name 21'
            },
            {
              id: 22,
              name: 'name 22'
            }
          ]
        }
      ]
    }
  },
  created() {
    setTimeout(() => {
      // the code below will break two-way binding
      // this.list[1] = {
      //   id: 5,
      //   name: 'data 5',
      //   deepList: [
      //     {
      //       id: 51,
      //       name: 'name 51'
      //     },
      //     {
      //       id: 52,
      //       name: 'name 52'
      //     }
      //   ]
      // }

      this.$set(this.list, 1, {
        id: 5,
        name: 'data 5',
        deepList: [
          {
            id: 51,
            name: 'name 51'
          },
          {
            id: 52,
            name: 'name 52'
          }
        ]
      })
      this.ls.warning('modify 1')
    }, 1000)
    setTimeout(() => {
      this.list[1].deepList = [
        {
          id: 31,
          name: 'name 31'
        },
        {
          id: 32,
          name: 'name 32'
        }
      ]
      this.ls.warning('updated')
    }, 3000)
  }
}
</script>

<style scoped>

</style>
