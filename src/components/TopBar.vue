<template>
  <div class="top-bar">
    <div class="left-column"></div>
    <div class="center-area">
      <img src="/icons/gold-logo.svg" alt="XTM Inc" class="logo" />
    </div>
    <div class="right-column">
      <div class="user-menu">
        <div class="user-name">John Doe</div>
        <div class="dropdown-icon">
          <div class="chevron-down"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopBar'
}
</script>

<style scoped>
.top-bar {
  width: 100%;
  height: 76px;
  background: white;
  border-bottom: 1px solid #EDEDEE;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 10;
}

.left-column {
  width: 200px;
  height: 100%;
}

.center-area {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-column {
  width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.logo {
  height: 12px;
  width: auto;
  object-fit: contain;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.user-menu:hover {
  opacity: 0.8;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.dropdown-icon:hover {
  transform: rotate(180deg);
}

.chevron-down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #666;
}
</style>
