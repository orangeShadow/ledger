<template>
  <b-table
      :data="data"
      paginated
      per-page="10"
  >
      <template slot-scope="props">
          <b-table-column field="title" label="Название" >
              <router-link class="navbar-item" :to="'/customer/'+props.row._id">{{ props.row.title }}</router-link>
          </b-table-column>
      </template>
  </b-table>
</template>

<script>
import CustomerService from '@/services/CustomerService'

export default {
  name: 'CustomerList',
  data () {
    return {
      data: []
    }
  },
  methods: {
    async getCustomers () {
      const response = await CustomerService.fetchCustomers()
      this.data = response.data.data
    }
  },
  mounted () {
    this.getCustomers()
  }
}
</script>
