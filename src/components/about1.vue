<template>
  <div class="home" >

    <div class="canvas" ref="canvas" style="width:1200px;">

      <div
        v-for="item in layout"
        :key="item.uid"
        class="card"
        :style="getStyle(item)"
      >
        {{ item.title }}
      </div>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      layout: []
    };
  },

  mounted() {
    this.load();
  },

  methods: {

    load() {
      const data = localStorage.getItem("layout_engine_final");

      if (data) {
        this.layout = JSON.parse(data);
      }
    },

    getStyle(item) {

      const containerWidth = this.$refs.canvas.clientWidth;
      console.log(containerWidth,'222')
      return {
        position: "absolute",
        left: item.x * containerWidth + "px",
        width: item.w * containerWidth + "px",
        top: item.y * containerWidth + "px",
        height: item.height + "px"
      };
    }
  }
};
</script>

<style scoped>
.home {
  width: 100%;
}

.canvas {
  position: relative;
  min-height: 800px;
  background: #f7f7f7;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  margin: 6px;
  padding: 10px;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>