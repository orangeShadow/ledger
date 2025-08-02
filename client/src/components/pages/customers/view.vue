<template>
    <div v-if="customer">
        <div class="columns">
            <div class="column is-one-third">
                <strong>Название:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.title}}
                <router-link class="button is-small is-primary" :to="'/customer/'+customer._id+'/invoice/add'">Выставить счет</router-link>
            </div>
            <div v-else class="column">
                <b-input v-model="customer.title"></b-input>
                <p v-if="errors && errors.title" class="help is-danger">{{errors.title}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>ИНН:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.INN}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.INN"></b-input>
                <p v-if="errors && errors.INN" class="help is-danger">{{errors.INN}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>КПП:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.KPP}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.KPP"></b-input>
                <p v-if="errors && errors.KPP" class="help is-danger">{{errors.KPP}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>ОГРН:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.OGRN}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.OGRN"></b-input>
                <p v-if="errors && errors.OGRN" class="help is-danger">{{errors.OGRN}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>Индкес:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.ZIP}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.ZIP"></b-input>
                <p v-if="errors && errors.ZIP" class="help is-danger">{{errors.ZIP}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>Область:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.area}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.area"></b-input>
                <p v-if="errors && errors.area" class="help is-danger">{{errors.area}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>Город:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.city}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.city"></b-input>
                <p v-if="errors && errors.city" class="help is-danger">{{errors.city}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>Адрес:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.address}}
            </div>
            <div v-else class="column">
                <b-input v-model="customer.address"></b-input>
                <p v-if="errors && errors.address" class="help is-danger">{{errors.address}}</p>
            </div>
        </div>
        <div class="columns">
            <div class="column is-one-third">
                <strong>Основания для перевода:</strong>
            </div>
            <div v-if="!edit" class="column">
                {{customer.reason}}
            </div>
            <div v-else class="column">
                <b-input  type="textarea" v-model="customer.reason"></b-input>
                <p v-if="errors && errors.reason" class="help is-danger">{{errors.reason}}</p>
            </div>
        </div>

        <!-- Секция услуг -->
        <div class="columns">
            <div class="column is-one-third">
                <strong>Услуги:</strong>
            </div>
            <div v-if="!edit" class="column">
                <div v-if="customer.services_description && customer.services_description.length > 0">
                    <ul class="services-list">
                        <li v-for="(service, index) in customer.services_description" :key="index" class="service-item">
                            {{service}}
                        </li>
                    </ul>
                </div>
                <div v-else class="has-text-grey-light">
                    Услуги не указаны
                </div>
            </div>
            <div v-else class="column">
                <div class="services-container">
                    <div v-for="(service, index) in customer.services_description" :key="index" class="field has-addons">
                        <div class="control is-expanded">
                            <b-input v-model="customer.services_description[index]" placeholder="Введите описание услуги"></b-input>
                        </div>
                        <div class="control">
                            <button @click="removeService(index)" class="button is-danger">
                                <span class="icon">
                                    <i class="fas fa-trash"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button @click="addService" class="button is-info">
                                <span class="icon">
                                    <i class="fas fa-plus"></i>
                                </span>
                                <span>Добавить услугу</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns">
            <div v-if="!edit"  class="column is-half-desktop">
                <button @click="edit=!edit" class="button is-warning">Редактировать</button>
                <router-link to="/customer" class="button is-pulled-right">Назад к списку</router-link>
                <router-link :to="`/customer/${customer._id}/invoices`" class="button is-info is-pulled-right invoice-button">Счета</router-link>
            </div>
            <div v-else  class="column is-half-desktop">
                <button @click="save()" class="button is-success">Сохранить</button>
                <button @click="cancel()" class="button is-danger">Отмена</button>
                <router-link to="/customer" class="button is-pulled-right">Назад к списку</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .invoice-button {
        margin-right: 10px;
    }

    .services-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .service-item {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
    }

    .service-item:last-child {
        border-bottom: none;
    }

    .services-container {
        margin-bottom: 1rem;
    }

    .services-container .field {
        margin-bottom: 0.5rem;
    }

    .services-container .field:last-child {
        margin-bottom: 0;
    }
</style>

<script>
import CustomerService from '@/services/CustomerService'

export default {
  name: 'CustomerView',
  data () {
    return {
      customer: null,
      edit: false,
      errors: {}
    }
  },
  methods: {
    async getCustomer () {
      const response = await CustomerService.fetchCustomer(this.$route.params.id)
      this.customer = response.data.customer
    },
    addService () {
      if (!this.customer.services_description) {
        this.customer.services_description = []
      }
      this.customer.services_description.push('')
    },
    removeService (index) {
      this.customer.services_description.splice(index, 1)
    },
    async save () {
      this.errors = {}
      // Фильтруем пустые услуги перед сохранением
      const customerToSave = {
        ...this.customer,
        services_description: this.customer.services_description
          ? this.customer.services_description.filter(service => service.trim() !== '') : []
      }

      await CustomerService.updateCustomer(this.$route.params.id, customerToSave).then(({data}) => {
        this.customer = data.customer
        this.edit = false
      }).catch((e) => {
        this.errors = e.response.data.errors
      })
    },
    async cancel () {
      const response = await CustomerService.fetchCustomer(this.$route.params.id)
      this.customer = response.data.customer
      this.edit = false
      this.errors = {}
    }
  },
  mounted () {
    this.getCustomer()
  }
}
</script>
