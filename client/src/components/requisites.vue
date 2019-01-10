<template>
    <div>
        <h1 class="title">Ваши реквизиты</h1>
        <div v-if="requisites">
            <b-field v-for="(field,key) in requisitesInputFields" :key="key" :label="field.title"
                     :type="errors && errors[field.name]? 'is-danger':''"
                     :message="errors && errors[field.name]">
                <b-input v-if="field.type=='text'" v-model="requisites[field.name]"></b-input>
                <b-input v-if="field.type=='textarea'" type="textarea" v-model="requisites[field.name]"></b-input>
            </b-field>

            <div class="columns">
                <div class="column is-half-desktop">
                    <button @click="save()" class="button is-success">Сохранить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RequisitesService from '@/services/RequisitesService'

export default {
  name: 'Requisites',
  data: function () {
    return {
      requisitesInputFields: [
        {
          title: 'Название организации / Получатель',
          name: 'recipient',
          type: 'text'
        },
        {
          title: 'Название организации сокращенно',
          name: 'recipient_small',
          type: 'text'
        },
        {
          title: 'Название Банка',
          name: 'bank_name',
          type: 'text'
        },
        {
          title: 'Бик Банка',
          name: 'bik',
          type: 'text'
        },
        {
          title: 'Счет Банка',
          name: 'cor_account',
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
          title: 'Ваш счет в банке',
          name: 'account',
          type: 'text'
        },
        {
          title: 'Директор',
          name: 'director',
          type: 'text'
        },
        {
          title: 'Бухгалтер',
          name: 'accountant',
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
        }
      ],
      requisites: {},
      errors: null
    }
  },
  methods: {
    async getRequisites () {
      let response = await RequisitesService.fetchRequisites()

      this.requisites = response.data.requisites
    },
    async save () {
      await RequisitesService.saveRequisites(this.requisites)
    }
  },
  mounted () {
    this.getRequisites()
  }
}
</script>
