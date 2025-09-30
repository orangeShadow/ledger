<template>
    <section v-if="invoice">
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
                                    {{service.name}}
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
                    <a class="card-footer-item" @click="addToInvoice">Добавить</a>
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
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(service, key) in invoice.services" :key="`${key}-service`">
                        <td>{{service.title}}</td>
                        <td>{{service.quantity}}</td>
                        <td>{{service.unit}}</td>
                        <td>{{service.price}}</td>
                        <td>
                            <button @click="editService(key)" class="button is-small is-info mr-2">
                                <b-icon icon="edit" size="is-small"></b-icon>
                            </button>
                            <button @click="removeService(key)" class="button is-small is-danger">
                                <b-icon icon="delete" size="is-small"></b-icon>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </b-field>
        </div>
        <div class="columns mt-3">
            <div class="column is-half-desktop">
                <button @click="save()" class="button is-success" :disabled="isSaving">
                  <span v-if="isSaving">Сохранение...</span>
                  <span v-else>Сохранить</span>
                </button>
                <router-link to="/customer" class="button is-pulled-right">Назад к списку</router-link>
            </div>
        </div>

        <!-- Модальное окно для редактирования услуги -->
        <div v-if="editServiceShow" class="modal is-active">
            <div class="modal-background" @click="editServiceShow = false"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Редактировать услугу</p>
                    <button class="delete" aria-label="close" @click="editServiceShow = false"></button>
                </header>
                <section class="modal-card-body">
                    <b-field label="Название услуги">
                        <b-input v-model="editingService.title" type="textarea" placeholder="Название услуги"></b-input>
                    </b-field>
                    <div class="columns">
                        <div class="column">
                            <b-field label="Количество">
                                <b-input v-model.number="editingService.quantity" placeholder="Количество"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Единица измерения">
                                <b-input v-model="editingService.unit" placeholder="шт"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <b-field label="Цена">
                                <b-input v-model.number="editingService.price" placeholder="Цена"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Номер заявки">
                                <b-input v-model="editingService.requestNumber" placeholder="Номер заявки"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <b-field label="Дата заявки">
                                <b-input v-model="editingService.requestDate" type="date" placeholder="Дата заявки"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Название проекта">
                                <b-input v-model="editingService.projectName" placeholder="Название проекта"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <div class="columns">
                        <div class="column">
                            <b-field label="Ссылка на Jira">
                                <b-input v-model="editingService.projectJiraLink" placeholder="Ссылка на Jira"></b-input>
                            </b-field>
                        </div>
                        <div class="column">
                            <b-field label="Ссылка на Git">
                                <b-input v-model="editingService.projectGitLink" placeholder="Ссылка на Git"></b-input>
                            </b-field>
                        </div>
                    </div>
                    <b-field label="Описание">
                        <b-input v-model="editingService.description" type="textarea" placeholder="Описание услуги"></b-input>
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="saveEditedService">Сохранить</button>
                    <button class="button" @click="editServiceShow = false">Отмена</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
import InvoiceService from '@/services/InvoiceService'
import CustomerService from '@/services/CustomerService'
import moment from 'moment'

export default {
  name: 'InvoiceView',
  components: {
    BModal: () => import('buefy/src/components/modal/Modal')
  },
  data () {
    return {
      isSaving: false,
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
      invoice: null,
      addServiceShow: false,
      service: {
        title: '',
        quantity: '',
        unit: '',
        price: '',
        requestNumber: '',
        requestDate: '',
        description: '',
        projectName: '',
        projectJiraLink: '',
        projectGitLink: ''
      },
      selectedCustomerService: '',
      customerServices: [],
      originalCustomerServices: [],
      errors: {},
      editServiceShow: false,
      editingServiceIndex: -1,
      editingService: {
        title: '',
        quantity: '',
        unit: '',
        price: '',
        requestNumber: '',
        requestDate: '',
        description: '',
        projectName: '',
        projectJiraLink: '',
        projectGitLink: ''
      }
    }
  },
  methods: {
    async getInvoice () {
      const response = await InvoiceService.fetchInvoice(this.$route.params.id)
      this.invoice = response.data
      if (this.invoice.invoice_date) {
        this.invoice.invoice_date = moment(this.invoice.invoice_date).format('YYYY-MM-DD')
      }
      // Загружаем услуги клиента после получения счета
      await this.loadCustomerServices()
    },
    async loadCustomerServices () {
      try {
        const response = await CustomerService.fetchCustomer(this.invoice.customer._id)
        this.originalCustomerServices = response.data.customer.services_description || []
        this.customerServices = [...this.originalCustomerServices]
        console.log('Загружены услуги клиента:', this.customerServices)
      } catch (error) {
        console.error('Ошибка загрузки услуг клиента:', error)
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
        // Получаем оригинальный объект услуги
        const originalService = this.originalCustomerServices[this.selectedCustomerService]
        console.log('Оригинальная услуга:', originalService)

        // Заменяем плейсхолдеры в описании услуги
        const replacedDescription = this.getReplacedServiceText(originalService.description)

        // Заменяем плейсхолдеры в пост-описании услуги
        const replacedPostDescription = originalService.postDescription
          ? this.getReplacedServiceText(originalService.postDescription) : ''

        // Объединяем описание и пост-описание
        const fullTitle = replacedDescription + (replacedPostDescription ? '\n\n' + replacedPostDescription : '')
        this.service.title = fullTitle

        // Сохраняем данные проекта из выбранной услуги клиента
        this.service.projectName = originalService.name || ''
        this.service.projectJiraLink = originalService.jira_link || ''
        this.service.projectGitLink = originalService.git_link || ''

        // Сохраняем оригинальное описание для использования в шаблоне
        this.service.description = originalService.description || ''

        console.log('Установлено service.title с заменой плейсхолдеров:', this.service.title)
        console.log('Данные проекта:', {
          projectName: this.service.projectName,
          projectJiraLink: this.service.projectJiraLink,
          projectGitLink: this.service.projectGitLink
        })

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
        requestDate: '',
        description: '',
        projectName: '',
        projectJiraLink: '',
        projectGitLink: ''
      }
      this.selectedCustomerService = ''
    },
    async save () {
      // Защита от двойного нажатия
      if (this.isSaving) {
        return
      }

      this.isSaving = true

      try {
        const {data} = await InvoiceService.updateInvoice(this.invoice)
        this.$router.push({path: `/customer/${data.customer._id}/invoices`})
      } catch (e) {
        if (e.response && e.response.data) {
          this.errors = e.response.data.errors
        }
        console.log(e)
      } finally {
        this.isSaving = false
      }
    },
    addToInvoice () {
      // Создаем объект service с полными данными
      const serviceToAdd = {
        title: this.service.title,
        quantity: this.service.quantity,
        unit: this.service.unit,
        price: this.service.price,
        requestNumber: this.service.requestNumber,
        requestDate: this.service.requestDate,
        description: this.service.description,
        projectName: this.service.projectName,
        projectJiraLink: this.service.projectJiraLink,
        projectGitLink: this.service.projectGitLink
      }

      this.invoice.services.push(serviceToAdd)
      this.clearService()
      this.addServiceShow = false
    },
    removeService (index) {
      this.invoice.services.splice(index, 1)
    },
    editService (index) {
      console.log('editService вызван с индексом:', index)
      console.log('Услуга для редактирования:', this.invoice.services[index])
      this.editingServiceIndex = index
      this.editingService = { ...this.invoice.services[index] }
      this.editServiceShow = true
      console.log('Модальное окно открыто:', this.editServiceShow)
    },
    saveEditedService () {
      if (this.editingServiceIndex >= 0) {
        this.invoice.services[this.editingServiceIndex] = { ...this.editingService }
        this.editServiceShow = false
        this.editingServiceIndex = -1
      }
    }
  },
  mounted () {
    this.getInvoice()
  }
}
</script>
