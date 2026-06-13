<template>
  <div>
    <div class="page">

      <!-- ================= 左侧卡片库 ================= -->
      <div class="left">
        <h3>卡片库</h3>

        <div
          v-for="item in leftCards"
          :key="item.id"
          class="card"
          draggable="true"
          @dragstart="onDragStart(item)"
        >
          {{ item.title }}
        </div>
      </div>

      <!-- ================= 右侧画布 ================= -->
      <div
        class="canvas"
        ref="canvas"
        @dragover.prevent
        @drop="onDrop"
      >

        <div
          v-for="item in layoutCards"
          :key="item.uid"
          class="card abs-card"
          :style="getStyle(item)"
        >
          <span>{{ item.title }}</span>
          <span class="close" @click.stop="remove(item)">×</span>
        </div>

      </div>

      <!-- ================= 工具栏 ================= -->
      <div class="tools">
        <button @click="relayout">重新排版</button>
        <button @click="save">保存</button>
      </div>

      
    </div>
    <about v-if="showAbout"></about>
  </div>
 
</template>

<script>
import about from './about'
export default {
  data() {
    return {
      leftCards: [
        { id: 1, type: "long", height: 220, title: "长卡1" },
        { id: 2, type: "short", height: 120, title: "短卡1" },
        { id: 3, type: "short", height: 140, title: "短卡2" },
        { id: 4, type: "long", height: 240, title: "长卡2" },
        { id: 5, type: "short", height: 160, title: "短卡3" },
        { id: 6, type: "short", height: 100, title: "短卡4" }
      ],

      layoutCards: [],

      dragItem: null,

      COLS: 2,
      showAbout:false,
    };
  },
  components:{about},

  mounted() {
    this.updateLayout();
    window.addEventListener("resize", this.updateLayout);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.updateLayout);
  },

  methods: {

    // ================= 响应式列数 =================
    getCols() {
      const w = this.$refs.canvas.clientWidth;

      if (w < 768) return 2;
      if (w < 1024) return 3;
      return 4;
    },

    updateLayout() {
      if (!this.$refs.canvas) return;

      this.COLS = this.getCols();
      this.relayout();
    },

    // ================= 拖拽 =================
    onDragStart(item) {
      this.dragItem = item;
    },

    onDrop() {
      if (!this.dragItem) return;

      const item = {
        ...this.dragItem,
        uid: Date.now() + Math.random()
      };

      this.leftCards = this.leftCards.filter(i => i.id !== item.id);
      this.layoutCards.push(item);

      this.dragItem = null;

      this.relayout();
    },

    // ================= 删除 =================
    remove(item) {
      this.layoutCards = this.layoutCards.filter(i => i.uid !== item.uid);
      this.leftCards.push(item);

      this.relayout();
    },

    // ================= span规则 =================
    getSpan(item) {
      return item.type === "long" ? 2 : 1;
    },

    // ================= 核心布局引擎 =================
    // relayout() {

    //   const containerWidth = this.$refs.canvas.clientWidth;
    //   const COLS = this.COLS;

    //   const colWidth = containerWidth / COLS;
    //   const colHeights = new Array(COLS).fill(0);

    //   const result = [];

    //   const findBestCol = (span) => {
    //     let best = 0;
    //     let minH = Infinity;

    //     for (let i = 0; i <= COLS - span; i++) {
    //       const h = Math.max(...colHeights.slice(i, i + span));

    //       if (h < minH) {
    //         minH = h;
    //         best = i;
    //       }
    //     }

    //     return best;
    //   };

    //   this.layoutCards.forEach(item => {

    //     const span = this.getSpan(item);

    //     const col = findBestCol(span);

    //     const top = Math.max(...colHeights.slice(col, col + span));

    //     const width = colWidth * span;
    //     const height = item.height;

    //     // 更新列高度
    //     for (let i = 0; i < span; i++) {
    //       colHeights[col + i] = top + height;
    //     }

    //     result.push({
    //       ...item,
    //       top,
    //       left: col * colWidth,
    //       width,
    //       height
    //     });

    //   });

    //   this.layoutCards = result;
    // },
    relayout() {

  const containerWidth = this.$refs.canvas.clientWidth;
  const COLS = this.COLS;

  const colWidth = containerWidth / COLS;

  // ✔ 每列真实高度（核心）
  const colHeights = new Array(COLS).fill(0);

  const result = [];

  const getSpan = (item) => {
    return item.type === "long" ? 2 : 1;
  };

  const findBestCol = (span) => {

    let best = 0;
    let minHeight = Infinity;

    for (let i = 0; i <= COLS - span; i++) {

      // ❗关键修复：不要用 max，而是用 min baseline
      const h = Math.min(...colHeights.slice(i, i + span));

      if (h < minHeight) {
        minHeight = h;
        best = i;
      }
    }

    return best;
  };

  this.layoutCards.forEach(item => {

    const span = getSpan(item);

    const col = findBestCol(span);

    // ❗关键修复：top = baseline（不是 max）
    const top = Math.min(...colHeights.slice(col, col + span));

    const height = item.height;
    const width = colWidth * span;

    result.push({
      ...item,
      top,
      left: col * colWidth,
      width,
      height
    });

    // ❗关键修复：只更新“最低列”
    const newHeight = top + height;

    for (let i = 0; i < span; i++) {
      colHeights[col + i] = newHeight;
    }

  });

  this.layoutCards = result;
},

    // ================= 样式 =================
    getStyle(item) {
      return {
        position: "absolute",
        top: item.top + "px",
        left: item.left + "px",
        width: item.width + "px",
        height: item.height + "px",
        transition: "all 0.2s ease"
      };
    },

    // ================= 保存 =================
    save() {

      const containerWidth = this.$refs.canvas.clientWidth;
      const COLS = this.COLS;

      const result = this.layoutCards.map(item => {

        const span = this.getSpan(item);

        return {
          uid: item.uid,
          type: item.type,
          height: item.height,

          // 👉 转成比例
          x: item.left / containerWidth,
          w: item.width / containerWidth,
          y: item.top / containerWidth // 或 heightRatio（可优化）
        };
      });

      localStorage.setItem(
        "layout_engine_final",
        JSON.stringify(result)
      );
      console.log(result,'1111')
      this.showAbout =true;
      // this.$router.push("/about");
    }
   
  }
};
</script>

<style scoped>
.page {
  display: flex;
}

/* 左侧 */
.left {
  width: 220px;
  border-right: 1px solid #eee;
  padding: 10px;
}

/* 画布 */
.canvas {
  flex: 1;
  position: relative;
  min-height: 800px;
  background: #f7f7f7;
}

/* 卡片 */
.card {
  background: #fff;
  border: 1px solid #ddd;
  margin: 6px;
  padding: 10px;
  border-radius: 6px;
  cursor: grab;
}

/* 绝对定位卡片 */
.abs-card {
  margin: 0;
  box-sizing: border-box;
}

/* 工具栏 */
.tools {
  width: 120px;
  padding: 10px;
}

.close {
  float: right;
  cursor: pointer;
  color: #999;
}
</style>