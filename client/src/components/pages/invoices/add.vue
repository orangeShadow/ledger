<template>
    <section>
        <div class="column is-half-desktop">
        <b-field v-for="(field,key) in invoiceInputFields" :key="key" :label="field.title"
                 :type="errors && errors.invoice && errors.invoice[field.name]? 'is-danger':''"
                 :message="errors && errors.invoice && errors.invoice[field.name]">
            <b-input v-if="field.type=='text'" v-model="invoice[field.name]"></b-input>
            <b-input v-if="field.type=='textarea'" type="textarea" v-model="invoice[field.name]"></b-input>
            <b-input v-if="field.type=='date'" type="date" v-model="invoice[field.name]"></b-input>
            <b-input v-if="field.type=='number'" type="number" v-model="invoice[field.name]"></b-input>
        </b-field>
        </div>
        <div class="column">
            <h3 class="subtitle">Услуги: <button class="button is-small" @click="(event)=>{this.addServiceShow=true}"> Добавить услугу</button></h3>
            <b-collapse class="card" v-if="addServiceShow">
                <div slot="trigger" slot-scope="props" class="card-header">
                </div>
                <div class="card-content">
                    <div class="content">
                        <b-field label="Название"
                                 :type="errors && errors.services && errors.services.title? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.title">
                            <b-input v-model="service.title"></b-input>
                        </b-field>
                        <b-field label="Количество"
                                 :type="errors && errors.services && errors.services.quantity? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.quantity">
                            <b-input v-model="service.quantity"></b-input>
                        </b-field>
                        <b-field label="Ед. измерения"
                                 :type="errors && errors.services && errors.services.unit? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.unit">
                            <b-input v-model="service.unit"></b-input>
                        </b-field>
                        <b-field label="Сумма"
                                 :type="errors && errors.services && errors.services.price? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.price">
                            <b-input v-model="service.price"></b-input>
                        </b-field>
                    </div>
                </div>
                <footer class="card-footer">
                    <a class="card-footer-item" @click="addToInvocie">Добавить</a>
                    <a class="card-footer-item">Очистить</a>
                </footer>
            </b-collapse>
            <b-field>
                <table class="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Наименование</th>
                            <th>Кол-во</th>
                            <th>Ед. измерения</th>
                            <th>Сумма</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(service, key) in invoice.services" :key="`${key}-service`">
                            <td>{{service.title}}</td>
                            <td>{{service.quantity}}</td>
                            <td>{{service.unit}}</td>
                            <td>{{service.price}}</td>
                            <td><button @click="(event)=>{invoice.services.splice(key,1)}" class="button is-small is-danger"><b-icon
                                    icon="delete"
                                    size="is-small">
                            </b-icon></button></td>
                        </tr>
                    </tbody>
                </table>
            </b-field>
        </div>
        <div class="columns mt-3">
            <div class="column is-half-desktop">
                <button @click="save()" class="button is-success">Сохранить</button>
                <router-link to="/customer" class="button is-pulled-right">Назад к списку</router-link>
            </div>
        </div>
    </section>
</template>

<script>
import InvoiceService from '@/services/InvoiceService'

export default {
  name: 'InvoiceAdd',
  data () {
    return {
      invoiceInputFields: [
        {
          title: 'Номер счета',
          name: 'number',
          type: 'number'
        },
        {
          title: 'Дата счета',
          name: 'invoice_date',
          type: 'date'
        }
      ],
      invoice: {
        services: []
      },
      addServiceShow: false,
      service: {},
      errors: {}
    }
  },
  methods: {
    async save () {
      await InvoiceService.addInvoiceByCustomerId(this.$route.params.id, this.invoice).then(({data}) => {
        this.$route.path(`customer/${data.customer._id}/invoices`)
      }).catch((e) => {
        if (e.response && e.response.data) {
          this.errors = e.response.data.errors
        }
        console.log(e)
      })
    },
    addToInvocie () {
      this.invoice.services.push(this.service)
      this.service = {}
      this.addServiceShow = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (typeof this.invoice._id !== 'undefined') {
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
