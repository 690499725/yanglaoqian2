<template>
  <div class="custom-map-container">
    <div class="map-controls">
      <el-button-group>
        <el-button @click="zoomIn" class="map-control-btn">
          <el-icon><Plus /></el-icon>
        </el-button>
        <el-button @click="zoomOut" class="map-control-btn">
          <el-icon><Minus /></el-icon>
        </el-button>
        <el-button @click="resetView" class="map-control-btn">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </el-button-group>
    </div>
    
    <div class="map-content" ref="mapContainer">
      <svg
        :width="width"
        :height="height"
        :viewBox="viewBox"
        @mousedown="startPan"
        @mousemove="pan"
        @mouseup="stopPan"
        @mouseleave="stopPan"
        @wheel="handleZoom"
      >
        <!-- 养老院建筑 -->
        <g v-for="building in buildings" :key="building.id" class="building-group">
          <rect
            :x="building.x"
            :y="building.y"
            :width="building.width"
            :height="building.height"
            :fill="building.color"
            :stroke="building.stroke"
            stroke-width="2"
            rx="8"
            ry="8"
            class="building-rect"
            @click="handleBuildingClick(building)"
          />
          <text
            :x="building.x + building.width/2"
            :y="building.y + building.height/2"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#333"
            font-size="18"
            font-weight="bold"
            class="building-name"
          >
            {{ building.name }}
          </text>
        </g>

        <!-- 监控点标记 -->
        <g v-for="camera in cameras" :key="camera.id" class="camera-group">
          <circle
            :cx="camera.x"
            :cy="camera.y"
            :r="5"
            :fill="getCameraColor(camera.status)"
            stroke="#fff"
            stroke-width="2"
            @click="handleCameraClick(camera)"
          />
          <text
            :x="camera.x"
            :y="camera.y - 10"
            text-anchor="middle"
            fill="#fff"
            font-size="12"
          >
            {{ camera.name }}
          </text>
        </g>

        <!-- 老人位置标记 -->
        <g v-if="elderlyLocation" class="elderly-location">
          <circle
            :cx="elderlyLocation.x"
            :cy="elderlyLocation.y"
            :r="6"
            fill="#ff4d4f"
            stroke="#fff"
            stroke-width="2"
            class="elderly-marker"
          />
          <text
            :x="elderlyLocation.x"
            :y="elderlyLocation.y - 15"
            text-anchor="middle"
            fill="#fff"
            font-size="14"
            font-weight="bold"
            class="elderly-name"
          >
            {{ elderlyName }}
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Minus, Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  buildings: {
    type: Array,
    required: true
  },
  cameras: {
    type: Array,
    required: true
  },
  elderlyLocation: {
    type: Object,
    default: null
  },
  elderlyName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['camera-click', 'building-click'])

const width = ref(800)
const height = ref(600)
const viewBox = ref('0 0 800 600')
const scale = ref(1)
const panOffset = ref({ x: 0, y: 0 })

const getCameraColor = (status) => {
  const colors = {
    normal: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    offline: '#d9d9d9'
  }
  return colors[status] || colors.normal
}

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3)
  updateViewBox()
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.5)
  updateViewBox()
}

const resetView = () => {
  scale.value = 1
  panOffset.value = { x: 0, y: 0 }
  updateViewBox()
}

const isPanning = ref(false)
const startPanPoint = ref({ x: 0, y: 0 })

const startPan = (event) => {
  isPanning.value = true
  startPanPoint.value = {
    x: event.clientX,
    y: event.clientY
  }
}

const pan = (event) => {
  if (!isPanning.value) return
  const dx = event.clientX - startPanPoint.value.x
  const dy = event.clientY - startPanPoint.value.y
  panOffset.value.x += dx
  panOffset.value.y += dy
  startPanPoint.value = {
    x: event.clientX,
    y: event.clientY
  }
  updateViewBox()
}

const stopPan = () => {
  isPanning.value = false
}

const handleZoom = (event) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  scale.value = Math.max(0.5, Math.min(3, scale.value * delta))
  updateViewBox()
}

const updateViewBox = () => {
  const scaledWidth = width.value / scale.value
  const scaledHeight = height.value / scale.value
  const x = -panOffset.value.x / scale.value
  const y = -panOffset.value.y / scale.value
  viewBox.value = `${x} ${y} ${scaledWidth} ${scaledHeight}`
}

const handleBuildingClick = (building) => {
  emit('building-click', building)
}

const handleCameraClick = (camera) => {
  emit('camera-click', camera)
}

onMounted(() => {
  updateViewBox()
})
</script>

<style scoped>
.custom-map-container {
  position: relative;
  width: 100%;
  height: 60vh;
  background: #1a1a1a;
  border-radius: 4px;
  overflow: visible;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
}

.map-control-btn {
  background-color: rgba(255, 255, 255, 0.9) !important;
  border-color: #dcdfe6 !important;
  color: #333 !important;
}

.map-control-btn:hover {
  background-color: #fff !important;
  border-color: #409eff !important;
  color: #409eff !important;
}

.map-content {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.building-group {
  cursor: pointer;
  transition: all 0.3s;
}

.building-group:hover {
  opacity: 0.8;
}

.building-rect {
  transition: all 0.3s;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.building-group:hover .building-rect {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transform: translateY(-2px);
}

.building-name {
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.camera-group {
  cursor: pointer;
}

.camera-group:hover {
  filter: brightness(1.2);
}

.elderly-location {
  pointer-events: none;
}

.elderly-marker {
  animation: markerPulse 1s infinite;
  transform-origin: center;
}

.elderly-name {
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
}

@keyframes markerPulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style> 