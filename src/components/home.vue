<template>
<div>
  <button @click="save">保存</button>
  <div class="page">

    <!-- 左侧 -->
    <div class="left">
      <div
        v-for="item in leftCards"
        :key="item.id"
        class="card"
        draggable
        @dragstart="dragItem = item"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- 右侧 -->
    <div
      class="canvas"
      ref="canvas"
      @dragover.prevent
      @drop="onDrop"
    >

      <div
        v-for="item in layoutCards"
        :key="item.uid"
        class="card abs"
        :style="style(item)"
      >
        {{ item.title }}
        <span class="close" @click="remove(item)">×</span>
      </div>

    </div>
  </div>
  <about v-if="showAbout"></about>
</div>
  
</template>

<script>
import { layoutEngine } from "./layoutEngine";
import about from './about'

export default {
  data() {
    return {
      showAbout:false,
      leftCards: [
        { id: 1, type: "long", heightRatio: 0.25, title: "长卡1" },
        { id: 2, type: "short", heightRatio: 0.15, title: "短卡1" },
        { id: 3, type: "short", heightRatio: 0.18, title: "短卡2" },
        { id: 4, type: "long", heightRatio: 0.28, title: "长卡2" }
      ],

      layoutCards: [],
      dragItem: null
    };
  },
  components:{about},
  mounted() {
    this.relayout();
    window.addEventListener("resize", this.relayout);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.relayout);
  },

  methods: {

    onDrop() {
      if (!this.dragItem) return;

      const item = {
        ...this.dragItem,
        uid: Date.now() + Math.random()
      };

      this.leftCards = this.leftCards.filter(i => i.id !== item.id);
      this.layoutCards.push(item);

      this.relayout();
      this.dragItem = null;
    },

    remove(item) {
      this.layoutCards = this.layoutCards.filter(i => i.uid !== item.uid);
      this.leftCards.push(item);
      this.relayout();
    },

    relayout() {
      const width = this.$refs.canvas.clientWidth;

      this.layoutCards = layoutEngine(
        this.layoutCards,
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
    },

    save() {
      // ⭐只存结构，不存布局
      const raw = this.layoutCards.map(i => ({
        id: i.id,
        type: i.type,
        heightRatio: i.heightRatio,
        title: i.title
      }));

      localStorage.setItem("layout_data", JSON.stringify(raw));
      this.showAbout = true;
      console.log(raw,'1111')
    }
  }
};
</script>

<style scoped>
.page { display: flex; }

.left {
  width: 200px;
  border-right: 1px solid #ddd;
}

.canvas {
  flex: 1;
  position: relative;
  min-height: 800px;
  background: #f7f7f7;
}

.card {
  margin: 6px;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: grab;
}

.abs {
  margin: 0;
  box-sizing: border-box;
}

.close {
  float: right;
  cursor: pointer;
}
</style>