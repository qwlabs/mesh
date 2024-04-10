<template>
  <div>错误页面:{{ code }}</div>
</template>
<script lang="ts" setup>
import { string } from 'vue-types'
const COMPONENT_NAME = 'HdExceptionPage'
defineOptions({
  name: COMPONENT_NAME,
})
const props = defineProps({
  code: string().isRequired,
})
defineExpose(props)
</script>
