<template>
  <div>
    Home Page

    <JsonFormatter :json="umbracoData"/>
  </div>
</template>

<script>
import JsonFormatter from '../components/JsonFormatter'

export default {
  name: 'index',
  layout: 'default',
  components: {
    JsonFormatter
  },
  async asyncData (context) {
    let data = {}
    try {
      data = await context.$Umbraco.get(context, {
        fetch: {
          type: 'path',
          pattern: context.route.meta[0].Jpath
        },
        ignore: [
          {
            key: ['children'],
            excludeStartLevel: 0
          }
        ]
      }) || {}
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.message)
    }
    return {
      umbracoData: data
    }
  },
  computed: {
    rootData() {
      return this.$store.getters['Umbraco/getGlobalDataByKey']('root')
    }
  }
}
</script>
