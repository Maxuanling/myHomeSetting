<template>
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

    <button @click="save">保存</button>

  </div>
</template>

<script>
import { layoutEngine } from "./layoutEngine";

export default {
  data() {
    return {
      leftCards: [
        { id: 1, type: "long", title: "长卡1" },
        { id: 2, type: "short", title: "短卡1" },
        { id: 3, type: "short", title: "短卡2" },
        { id: 4, type: "long", title: "长卡2" }
      ],

      layoutCards: [],
      dragItem: null,

      mockHeight: {
        long: 180,
        short: 100
      }
    };
  },

  mounted() {
    this.relayout();
    window.addEventListener("resize", this.relayout);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.relayout);
  },

  methods: {

    // ⭐拖拽迁移（左 → 右）
    onDrop() {
      if (!this.dragItem) return;

      const item = {
        ...this.dragItem,
        uid: Date.now(),
        mockHeight: this.mockHeight[this.dragItem.type]
      };

      // ⭐关键：左侧删除
      this.leftCards = this.leftCards.filter(
        i => i.id !== this.dragItem.id
      );

      // ⭐右侧加入
      this.layoutCards.push(item);

      this.relayout();
      this.dragItem = null;
    },

    remove(item) {
      // ⭐右 → 左
      const raw = {
        id: item.id,
        type: item.type,
        title: item.title
      };

      this.leftCards.push(raw);

      this.layoutCards = this.layoutCards.filter(
        i => i.uid !== item.uid
      );

      this.relayout();
    },

    relayout() {
      const width = this.$refs.canvas.clientWidth;

      this.layoutCards = layoutEngine(
        this.layoutCards,
        width,
        this.getCols(),
        "design",
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
    },

    save() {
      const raw = this.layoutCards.map(i => ({
        id: i.id,
        type: i.type,
        mockHeight: i.mockHeight,
        title: i.title
      }));

      localStorage.setItem("layout_data", JSON.stringify(raw));
       this.$router.push("/about"); 
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
  margin: 0;
  padding: 10px;
  background: #fff;
  border: 1px solid #ddd;
  cursor: grab;
}

.abs {
  box-sizing: border-box;
}

.close {
  float: right;
  cursor: pointer;
}
</style>