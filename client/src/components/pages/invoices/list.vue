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
      data: []
    }
  },
  methods: {
    async getCustomers () {
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
    }
  },
  mounted () {
    this.getCustomers()
  }
}
</script>
