<template>
  <slot v-if="loading"/>
  <div v-else>暂无数据</div>
</template>
<script lang="ts" setup>
import {bool} from 'vue-types'
const COMPONENT_NAME = 'HdWithEmpty'
defineOptions({
  name: COMPONENT_NAME,
})
const { loading } = defineProps({
  loading: bool().isRequired,
})
</script>
