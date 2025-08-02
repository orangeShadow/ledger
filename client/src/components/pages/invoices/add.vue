<template>
    <section>
        <div class="column is-half-desktop">
        <b-field v-for="(field,key) in invoiceInputFields" :key="key" :label="field.title"
                 :type="errors && errors.invoice && errors.invoice[field.name]? 'is-danger':''"
                 :message="errors && errors.invoice && errors.invoice[field.name]">
            <b-input v-if="field.type=='text'" v-model="invoice[field.name]"></b-input>
            <b-input v-if="field.type=='textarea'" type="textarea" v-model="invoice[field.name]"></b-input>
            <b-input v-if="field.type=='date'" type="date" v-model="invoice[field.name]" @change="updateMonthDates"></b-input>
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
                        <!-- Поля заявки -->
                        <b-field label="Номер заявки"
                                 :type="errors && errors.services && errors.services.requestNumber? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.requestNumber">
                            <b-input v-model="service.requestNumber" placeholder="Введите номер заявки"></b-input>
                        </b-field>
                        <b-field label="Дата заявки"
                                 :type="errors && errors.services && errors.services.requestDate? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.requestDate">
                            <b-input type="date" v-model="service.requestDate"></b-input>
                        </b-field>

                        <!-- Выбор услуги из списка клиента -->
                        <b-field label="Выбрать услугу клиента" v-if="customerServices && customerServices.length > 0">
                            <b-select v-model="selectedCustomerService" placeholder="Выберите услугу из списка клиента" @input="selectCustomerService">
                                <option value="">-- Выберите услугу --</option>
                                <option v-for="(service, index) in customerServices" :key="index" :value="index">
                                    {{service}}
                                </option>
                            </b-select>
                        </b-field>

                        <b-field label="Название"
                                 :type="errors && errors.services && errors.services.title? 'is-danger':''"
                                 :message="errors && errors.services && errors.services.title">
                            <b-input type="textarea" v-model="service.title" placeholder="Введите или выберите название услуги"></b-input>
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
                    <a class="card-footer-item" @click="clearService">Очистить</a>
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
import CustomerService from '@/services/CustomerService'

export default {
  name: 'InvoiceAdd',
  data () {
    return {
      lastInvoice: null,
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
        number: null,
        invoice_date: null,
        services: []
      },
      addServiceShow: false,
      service: {
        title: '',
        quantity: '',
        unit: '',
        price: '',
        requestNumber: '',
        requestDate: ''
      },
      selectedCustomerService: '',
      customerServices: [],
      originalCustomerServices: [],
      errors: {}
    }
  },
  mounted () {
    console.log('тут')
    this.loadLastInvoice()
    this.loadCustomerServices()
  },
  methods: {
    loadLastInvoice () {
      let self = this
      InvoiceService.getLastInvoice(this.$route.params.id).then(({data}) => {
        self.lastInvoice = data.data
        if (self.lastInvoice && self.lastInvoice.number) {
          self.invoice.number = parseInt(self.lastInvoice.number) + 1
          self.invoice.services = self.lastInvoice.services
        }
      })
    },
    async loadCustomerServices () {
      try {
        const response = await CustomerService.fetchCustomer(this.$route.params.id)
        this.originalCustomerServices = response.data.customer.services_description || []
        this.customerServices = [...this.originalCustomerServices]
        console.log('Загружены услуги клиента:', this.customerServices)
      } catch (error) {
        console.error('Ошибка загрузки услуг клиента:', error)
      }
    },
    updateMonthDates () {
      if (this.invoice.invoice_date) {
        const date = new Date(this.invoice.invoice_date)
        const year = date.getFullYear()
        const month = date.getMonth()

        // Автоматически устанавливаем дату счета на последний день месяца
        const lastDayOfMonth = new Date(year, month + 1, 0)
        this.invoice.invoice_date = lastDayOfMonth.toISOString().split('T')[0]

        // Дата счета автоматически установлена на последний день месяца
      }
    },
    getReplacedServiceText (originalText) {
      let replacedText = originalText

      if (this.invoice.invoice_date) {
        const date = new Date(this.invoice.invoice_date)
        const year = date.getFullYear()
        const month = date.getMonth()

        // Первое число выбранного месяца
        const startDate = new Date(year, month, 1)
        const startMonth = this.formatDate(startDate)

        // Последний день выбранного месяца
        const endDate = new Date(year, month + 1, 0)
        const endMonth = this.formatDate(endDate)

        // Заменяем плейсхолдеры дат
        replacedText = replacedText.replace('{startMonth}', startMonth).replace('{endMonth}', endMonth)
      }

      // Заменяем плейсхолдеры заявки
      if (this.service.requestNumber) {
        replacedText = replacedText.replace('{N}', this.service.requestNumber)
      }

      if (this.service.requestDate) {
        const requestDate = new Date(this.service.requestDate)
        const formattedRequestDate = this.formatDate(requestDate)
        replacedText = replacedText.replace('{date}', formattedRequestDate)
      }

      return replacedText
    },
    formatDate (date) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    },
    selectCustomerService () {
      console.log('selectCustomerService вызван с значением:', this.selectedCustomerService)
      if (this.selectedCustomerService !== '' && this.selectedCustomerService !== null) {
        // Получаем оригинальный текст услуги
        const originalService = this.originalCustomerServices[this.selectedCustomerService]
        console.log('Оригинальная услуга:', originalService)
        // Заменяем плейсхолдеры и помещаем в поле "Название"
        const replacedService = this.getReplacedServiceText(originalService)
        this.service.title = replacedService
        console.log('Установлено service.title с заменой плейсхолдеров:', this.service.title)
        // Фокусируемся на поле названия для удобства редактирования
        this.$nextTick(() => {
          const titleTextarea = this.$el.querySelector('textarea[v-model="service.title"]')
          if (titleTextarea) {
            titleTextarea.focus()
            titleTextarea.select()
          }
        })
        // Очищаем выбор для возможности повторного выбора
        this.$nextTick(() => {
          this.selectedCustomerService = ''
        })
      }
    },
    clearService () {
      this.service = {
        title: '',
        quantity: '',
        unit: '',
        price: '',
        requestNumber: '',
        requestDate: ''
      }
      this.selectedCustomerService = ''
    },
    async save () {
      let self = this
      await InvoiceService.addInvoiceByCustomerId(this.$route.params.id, this.invoice).then(({data}) => {
        self.invoice = data
        self.$router.push({path: `/customer/${data.customer._id}/invoices`})
      }).catch((e) => {
        if (e.response && e.response.data) {
          this.errors = e.response.data.errors
        }
        console.log(e)
      })
    },
    addToInvocie () {
      this.invoice.services.push(this.service)
      this.clearService()
      this.addServiceShow = false
    }
  },
  beforeRouteLeave (to, from, next) {
    if (typeof this.invoice._id !== 'undefined') {
      return next()
    }
    const answer = window.confirm('Данные не сохранены вы действительно хотите покинуть эту страницу?')
    if (answer) {
      return next()
    } else {
      return next(false)
    }
  }
}
</script>
