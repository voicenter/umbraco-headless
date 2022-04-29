<template>
  <json-viewer :value="json"/>
<!--  <pre>-->
<!--    {{ JSON.stringify(json, null, 4) }}-->
<!--  </pre>-->
</template>

<script>
import JsonViewer from 'vue-json-viewer/ssr'
import 'vue-json-viewer/style.css'

export default {
  name: 'JsonFormatter',
  components: {
    JsonViewer
  },
  props: {
    json: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
