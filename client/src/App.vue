<template>
  <div id="app">
    <nav class="navbar is-danger">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">

            <img src="https://bulma.io/images/bulma-logo-white.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28">

        </a>
        <div class="navbar-burger burger" data-target="navMenuColordanger-example">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">Главная</router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" href="#!">
              Заказчики
            </a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" to="/customer">Список</router-link>
              <router-link class="navbar-item" to="/customer/add">Добавить</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="section">
      <div class="container">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
