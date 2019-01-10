import Vue from 'vue'
import Router from 'vue-router'
import Requisites from '@/components/requisites'

import CustomerList from '@/components/pages/Customers/list'
import CustomerAdd from '@/components/pages/Customers/add'
import CustomerView from '@/components/pages/Customers/view'

import InvoiceAdd from '@/components/pages/Invoices/add'
import InvoiceList from '@/components/pages/Invoices/list'
import InvoiceView from '@/components/pages/Invoices/view'

Vue.use(Router)

export default new Router({
  hashbang: false,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Requisites',
      component: Requisites
    },
    {
      path: '/customer',
      name: 'CustomerList',
      component: CustomerList
    },
    {
      path: '/customer/add',
      name: 'CustomerAdd',
      component: CustomerAdd
    },
    {
      path: '/customer/:id',
      name: 'CustomerView',
      component: CustomerView
    },
    {
      path: '/customer/:id/invoice/add',
      name: 'InvoiceAdd',
      component: InvoiceAdd
    },
    {
      path: '/customer/:id/invoices',
      name: 'InvoiceList',
      component: InvoiceList
    },
    {
      path: '/invoice/:id',
      name: 'InvoiceView',
      component: InvoiceView
    }
  ]
})
