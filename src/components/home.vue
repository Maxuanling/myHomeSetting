<template>
  <div class="page">
    <!-- ================= 左侧 ================= -->
    <div class="left">
      <div
        v-for="item in leftCards"
        :key="item.id"
        class="card left-card"
        draggable="true"
        @dragstart="onDragStartLeft(item)"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- ================= 右侧 ================= -->
    <div class="canvas" ref="canvas" @dragover.prevent @drop="onDropToCanvas">
      <div
        v-for="(item, index) in layoutCards"
        :key="item.uid"
        class="card right-card"
        :style="style(item)"
        draggable="true"
        @dragstart="onDragStartRight(index)"
        @dragover.prevent="onDragOverRight(index)"
        @dragend="onDragEndRight"
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
let uidSeed = Date.now();
function uid() {
  return uidSeed++;
}
export default {
  data() {
    return {
      leftCards: [],
      layoutCards: [],

      dragLeftItem: null,
      dragRightIndex: null
    };
  },

  mounted() {
    this.init();
    window.addEventListener("resize", this.relayout);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.relayout);
  },

  methods: {
    // ================= 初始化 =================
    init() {
      const cache = localStorage.getItem("layout_data");

      const defaults = [
        { id: 1, type: "short", title: "短卡1", mockHeight: 120 },
        { id: 2, type: "short", title: "短卡2", mockHeight: 100 },
        { id: 3, type: "short", title: "短卡3", mockHeight: 100 },
        { id: 4, type: "short", title: "短卡4", mockHeight: 100 },
        { id: 5, type: "long", title: "长卡1", mockHeight: 180 },
        { id: 6, type: "long", title: "长卡2", mockHeight: 180 },
        { id: 7, type: "long", title: "长卡3", mockHeight: 200 }
      ];

      if (cache) {
        this.layoutCards = JSON.parse(cache);
        this.leftCards = [];
      } else {
        this.leftCards = defaults;
        this.layoutCards = [];
      }

      this.layoutCards = this.layoutCards.map(i => ({
        ...i,
        uid: Date.now() + Math.random()
      }));

      this.relayout();
    },

    // ================= 左侧拖拽 =================
    onDragStartLeft(item) {
      this.dragLeftItem = item;
    },

    // ================= 放入右侧 =================
    onDropToCanvas() {
      if (!this.dragLeftItem) return;

      const item = {
        ...this.dragLeftItem,
        uid: Date.now() + Math.random()
      };

      // 从左侧删除
      this.leftCards = this.leftCards.filter(i => i.id !== item.id);

      // 插入右侧
      this.layoutCards.push(item);

      this.dragLeftItem = null;

      this.relayout();
    },

    // ================= 右侧拖拽排序 =================
    onDragStartRight(index) {
      this.dragRightIndex = index;
    },

    onDragOverRight(index) {
      if (this.dragRightIndex === null) return;
      if (this.dragRightIndex === index) return;

      const arr = this.layoutCards;

      const item = arr.splice(this.dragRightIndex, 1)[0];
      arr.splice(index, 0, item);

      this.dragRightIndex = index;

      // this.relayout();
      // ❌ 不调用 relayout（防闪核心）
      this.layoutCards = arr;
    },
    // ⭐关键：拖拽结束才重新布局
    onDragEndRight() {
      this.dragRightIndex = null;

      this.$nextTick(() => {
        this.relayout();
      });
    },

    // ================= 删除 =================
    remove(item) {
      console.log(item, "1");
      this.leftCards.push({
        id: item.id,
        type: item.type,
        title: item.title,
        mockHeight: item.mockHeight
      });
      console.log(this.leftCards, "2");
      this.layoutCards = this.layoutCards.filter(i => i.uid !== item.uid);

      this.relayout();
    },

    // ================= 布局 =================
    relayout() {
      const width = this.$refs.canvas.clientWidth;
      console.log(this.layoutCards, 3);
      this.layoutCards = layoutEngine(this.layoutCards, width, 3, 10);
    },

    // ================= 样式 =================
    style(item) {
      return {
        position: "absolute",
        top: item.top + "px",
        left: item.left + "px",
        width: item.width + "px",
        height: item.height + "px"
      };
    },

    // ================= 保存 =================
    save() {
      localStorage.setItem("layout_data", JSON.stringify(this.layoutCards));

      alert("保存成功");
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
}

.left {
  width: 220px;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.canvas {
  flex: 1;
  position: relative;
  min-height: 800px;
  background: #f7f7f7;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  box-sizing: border-box;
  padding: 10px;
}

.left-card {
  margin-bottom: 10px;
  cursor: grab;
}

.right-card {
  position: absolute;
  cursor: grab;
}

.close {
  float: right;
  cursor: pointer;
  color: #999;
}
</style>
