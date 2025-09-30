<template>
    <b-table
            :data="data"
            paginated
            per-page="10"
    >
        <template slot-scope="props">
            <b-table-column field="title" label="Счет №" >
                <router-link class="navbar-item" :to="`/invoice/${props.row._id}`">
                    Счет № {{ props.row.number }}
                </router-link>
            </b-table-column>
            <b-table-column  label="Дата" >
                {{printDate(props.row.invoice_date)}}
            </b-table-column>
            <b-table-column  label="Заказчик" >
                {{props.row.customer.title}}
            </b-table-column>
            <b-table-column  label="Действия">
                <a :href="`http://localhost:8081/invoice/${props.row._id}`"
                   target="_blank"
                   class="button is-small">
                    <b-icon icon="printer" size="is-small"></b-icon> <span>Счет</span>
                </a>
                <a :href="`http://localhost:8081/act/${props.row._id}`"
                   target="_blank"
                   class="button is-small">
                    <b-icon icon="printer" size="is-small"></b-icon> <span> Акт</span>
                </a>
                <button @click="downloadActFile(props.row._id)"
                        class="button is-info is-small"
                        :disabled="downloadingFiles.has(props.row._id)">
                    <b-icon icon="download" size="is-small"></b-icon>
                    <span v-if="downloadingFiles.has(props.row._id)">Загрузка...</span>
                    <span v-else>Акт-файл</span>
                </button>
                <a href="#!" @click="remove(props.row._id)" class="button is-danger is-small">
                    <b-icon icon="delete" size="is-small"></b-icon>
                </a>
            </b-table-column>
        </template>
    </b-table>
</template>

<script>
import InvoiceService from '@/services/InvoiceService'
import Moment from 'moment'
import BIcon from 'buefy/src/components/icon/Icon'

export default {
  name: 'InvoiceList',
  components: {BIcon},
  data () {
    return {
      data: [],
      downloadingFiles: new Set() // Множество ID файлов, которые загружаются
    }
  },
  methods: {
    async getInvoices () {
      let response
      if (this.$route.params.id) {
        response = await InvoiceService.fetchInvoicesByCustomer(this.$route.params.id)
      } else {
        response = await InvoiceService.fetchInvoices()
      }
      this.data = response.data.data
    },
    printDate (date) {
      let dt = new Moment(date)
      return dt.format('DD.MM.YYYY')
    },
    async remove (id) {
      await InvoiceService.deleteInvoice(id).then(({data}) => { this.getInvoices() })
    },
    async downloadActFile (id) {
      // Защита от двойного нажатия
      if (this.downloadingFiles.has(id)) {
        return
      }

      this.downloadingFiles.add(id)

      try {
        const response = await InvoiceService.downloadActFile(id)

        // Проверяем, что ответ содержит данные
        if (!response.data || response.data.size === 0) {
          throw new Error('Получен пустой файл')
        }

        // Создаем Blob из ответа
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
        
        console.log('Размер полученного файла:', blob.size, 'байт')

        // Создаем ссылку для скачивания
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `act-${id}.docx`

        // Скачиваем файл
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Освобождаем URL
        window.URL.revokeObjectURL(url)

        console.log('Акт-файл успешно загружен')
      } catch (error) {
        console.error('Ошибка загрузки акт-файла:', error)
        console.error('Детали ошибки:', {
          message: error.message,
          status: error.response && error.response.status,
          statusText: error.response && error.response.statusText,
          data: error.response && error.response.data
        })
        // Можно добавить уведомление об ошибке
      } finally {
        this.downloadingFiles.delete(id)
      }
    }
  },
  mounted () {
    this.getInvoices()
  }
}
</script>
