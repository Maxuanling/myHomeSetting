<template>
  <div class="home">
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
        realHeight: this.getRealHeight(i.type)
      }));

      this.relayout();
    },

    getRealHeight(type) {
      return type === "long" ? 260 : 140;
    },

    relayout() {
      const width = this.$refs.canvas.clientWidth;

      this.layout = layoutEngine(
        this.layout,
        width,
        this.getCols(),
        "runtime",
        10
      );
    },

    getCols() {
      const w = this.$refs.canvas.clientWidth;

      if (w < 768) return 2;
      if (w < 1024) return 3;
      return 3;
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
  border:1px solid #cccccc;
  background: #fff;
  border: 1px solid #ddd;
}
</style>