<template>
    <section>
        <b-field v-for="(field,key) in customerInputFields" :key="key" :label="field.title"
                 :type="errors && errors[field.name]? 'is-danger':''"
                 :message="errors && errors[field.name]">
            <b-input v-if="field.type=='text'" v-model="customer[field.name]"></b-input>
            <b-input v-if="field.type=='textarea'" type="textarea" v-model="customer[field.name]"></b-input>
        </b-field>
        <div class="columns">
            <div   class="column is-half-desktop">
                <button @click="save()" class="button is-success">Сохранить</button>
                <router-link to="/customer" class="button is-pulled-right">Назад к списку</router-link>
            </div>
        </div>
    </section>
</template>

<script>
import CustomerService from '@/services/CustomerService'

export default {
  name: 'CustomerView',
  data () {
    return {
      customerInputFields: [
        {
          title: 'Название',
          name: 'title',
          type: 'text'
        },
        {
          title: 'ИНН',
          name: 'INN',
          type: 'text'
        },
        {
          title: 'КПП',
          name: 'KPP',
          type: 'text'
        },
        {
          title: 'ОГРН',
          name: 'OGRN',
          type: 'text'
        },
        {
          title: 'Индкес',
          name: 'ZIP',
          type: 'text'
        },
        {
          title: 'Область',
          name: 'area',
          type: 'text'
        },
        {
          title: 'Город',
          name: 'city',
          type: 'text'
        },
        {
          title: 'Адрес',
          name: 'address',
          type: 'text'
        },
        {
          title: 'Основания для перевода',
          name: 'reason',
          type: 'textarea'
        }
      ],
      customer: {},
      errors: {}
    }
  },
  methods: {
    async save () {
      await CustomerService.addCustomer(this.customer).then(({customer}) => {
        this.$route.path(`customer/${customer.id}`)
      }).catch((e) => {
        this.errors = e.response.data.errors
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (typeof this.customer._id !== 'undefined') {
      next()
    }
    const answer = window.confirm('Данные не сохранены вы действительно хотите покинуть эту страницу?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
</script>
