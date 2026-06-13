<template>
  <div class="home" style="width:900px;">
    <div class="canvas" ref="canvas">

      <div
        v-for="item in layout"
        :key="item.uid"
        class="card"
        :style="style(item)"
      >
        {{ item.title }}
      </div>

    </div>
  </div>
</template>

<script>
import { layoutEngine } from "./layoutEngine";

export default {
  data() {
    return {
      layout: []
    };
  },

  mounted() {
    this.load();
    window.addEventListener("resize", this.relayout);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.relayout);
  },

  methods: {

    load() {
      const raw = JSON.parse(localStorage.getItem("layout_data") || "[]");

      this.layout = raw.map(i => ({
        ...i,
        uid: Math.random()
      }));

      this.relayout();
    },

    relayout() {
      const width = this.$refs.canvas.clientWidth;

      this.layout = layoutEngine(
        this.layout,
        width,
        this.getCols()
      );
    },

    getCols() {
      const w = this.$refs.canvas.clientWidth;

      if (w < 768) return 2;
      if (w < 1024) return 3;
      return 4;
    },

    style(item) {
      return {
        position: "absolute",
        top: item.top + "px",
        left: item.left + "px",
        width: item.width + "px",
        height: item.height + "px"
      };
    }
  }
};
</script>

<style scoped>
.home { width: 100%; }

.canvas {
  position: relative;
  min-height: 800px;
  background: #f7f7f7;
}

.card {
  margin: 6px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
}
</style>