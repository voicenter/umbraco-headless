<template>
  <div>
    About Page

    <JsonFormatter :json="umbracoData" />
  </div>
</template>

<script>
import JsonFormatter from '../components/JsonFormatter'

export default {
  name: 'AboutUs',
  layout: "default",
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
        include: ['mainSolutionBlockSubtitle'],
        apiOnly: true
      }) || {}
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.message)
    }
    return {
      umbracoData: data
    }
  },
}
</script>
