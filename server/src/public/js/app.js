var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!'
    },
    mounted(){
        console.log(this.message);
    }
});