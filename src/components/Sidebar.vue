<template>
  <div class="sidebar">
    <div class="nav-section">
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/home.svg" alt="Dashboard" />
        </div>
        <div class="nav-label">Dashboard</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Internal.svg" alt="Internal" />
        </div>
        <div class="nav-label">Internal</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Programs.svg" alt="Programs" />
        </div>
        <div class="nav-label">Programs</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Clients.svg" alt="Clients" />
        </div>
        <div class="nav-label">Clients</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/wallet.svg" alt="Wallets" />
        </div>
        <div class="nav-label">Wallets</div>
      </div>
      
      <div class="nav-item active">
        <div class="nav-icon">
          <img src="/icons/Members_active.svg" alt="Members" />
        </div>
        <div class="nav-label active">Members</div>
        <div class="active-indicator"></div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Reverse_ATM.svg" alt="Reverse ATM" />
        </div>
        <div class="nav-label">Reverse ATM</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Subscriptions.svg" alt="Subscriptions" />
        </div>
        <div class="nav-label">Subscriptions</div>
      </div>
      
      <div class="nav-item">
        <div class="nav-icon">
          <img src="/icons/Merchant_control.svg" alt="Merchant Control" />
        </div>
        <div class="nav-label">
          <div>Merchant</div>
          <div>control</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>

<style scoped>
.sidebar {
  width: 116px;
  background: white;
  border-right: 1px solid rgba(39, 39, 42, 0.06);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  position: relative;
  z-index: 5;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.nav-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon img {
  width: 100%;
  height: 100%;
}

.nav-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #76767F;
  text-align: center;
  letter-spacing: 0.01px;
  white-space: nowrap;
}

.nav-item.active .nav-label {
  color: #27272A;
  font-weight: 500;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 64px;
  background: #F8C332;
  border-radius: 0 100px 100px 0;
}

.nav-item:hover {
  background: rgba(39, 39, 42, 0.02);
}
</style>
