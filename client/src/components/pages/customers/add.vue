<template>
    <section>
        <b-field v-for="(field,key) in customerInputFields" :key="key" :label="field.title"
                 :type="errors && errors[field.name]? 'is-danger':''"
                 :message="errors && errors[field.name]">
            <b-input v-if="field.type=='text'" v-model="customer[field.name]"></b-input>
            <b-input v-if="field.type=='textarea'" type="textarea" v-model="customer[field.name]"></b-input>
        </b-field>

        <!-- Секция услуг -->
        <div class="field">
            <label class="label">Услуги</label>
            <div class="services-container">
                <div v-for="(service, index) in customer.services_description" :key="index" class="service-item">
                    <div class="field">
                        <label class="label is-small">Название услуги</label>
                        <b-input v-model="service.name" placeholder="Введите название услуги"></b-input>
                    </div>
                    <div class="field">
                        <label class="label is-small">Описание</label>
                        <b-input type="textarea" v-model="service.description" placeholder="Введите описание услуги"></b-input>
                    </div>
                    <div class="field">
                        <label class="label is-small">Пост-описание (дополнительная информация)</label>
                        <b-input type="textarea" v-model="service.postDescription" placeholder="Введите дополнительную информацию"></b-input>
                    </div>
                    <div class="field">
                        <label class="label is-small">Ссылка на Jira</label>
                        <b-input v-model="service.jira_link" placeholder="https://jira.company.com/browse/PROJECT-123"></b-input>
                    </div>
                    <div class="field">
                        <label class="label is-small">Ссылка на Git</label>
                        <b-input v-model="service.git_link" placeholder="https://github.com/company/repo/pull/123"></b-input>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button @click="removeService(index)" class="button is-danger is-small">
                                <span class="icon">
                                    <i class="fas fa-trash"></i>
                                </span>
                                <span>Удалить услугу</span>
                            </button>
                        </div>
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
      customer: {
        services_description: []
      },
      errors: {}
    }
  },
  methods: {
    addService () {
      this.customer.services_description.push({
        name: '',
        description: '',
        postDescription: '',
        jira_link: '',
        git_link: ''
      })
    },
    removeService (index) {
      this.customer.services_description.splice(index, 1)
    },
    async save () {
      // Фильтруем пустые услуги перед сохранением
      const customerToSave = {
        ...this.customer,
        services_description: this.customer.services_description.filter(service =>
          service.name.trim() !== '' && service.description.trim() !== ''
        )
      }

      await CustomerService.addCustomer(customerToSave).then(({customer}) => {
        this.$router.push(`/customer/${customer.id}`)
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

<style scoped>
.services-container {
    margin-bottom: 1rem;
}

.service-item {
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #fafafa;
}

.service-item:last-child {
    margin-bottom: 0;
}

.services-container .field {
    margin-bottom: 0.5rem;
}

.services-container .field:last-child {
    margin-bottom: 0;
}
</style>
