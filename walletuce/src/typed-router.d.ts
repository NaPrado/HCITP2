/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/(auth)/emailVerification': RouteRecordInfo<'/(auth)/emailVerification', '/emailVerification', Record<never, never>, Record<never, never>>,
    '/(auth)/forgot-password': RouteRecordInfo<'/(auth)/forgot-password', '/forgot-password', Record<never, never>, Record<never, never>>,
    '/(auth)/login': RouteRecordInfo<'/(auth)/login', '/login', Record<never, never>, Record<never, never>>,
    '/(auth)/register': RouteRecordInfo<'/(auth)/register', '/register', Record<never, never>, Record<never, never>>,
    '/[...notFound]': RouteRecordInfo<'/[...notFound]', '/:notFound(.*)', { notFound: ParamValue<true> }, { notFound: ParamValue<false> }>,
    '/AdminCardsPage': RouteRecordInfo<'/AdminCardsPage', '/AdminCardsPage', Record<never, never>, Record<never, never>>,
    '/ConfirmDeposit': RouteRecordInfo<'/ConfirmDeposit', '/ConfirmDeposit', Record<never, never>, Record<never, never>>,
    '/ConfirmPayment': RouteRecordInfo<'/ConfirmPayment', '/ConfirmPayment', Record<never, never>, Record<never, never>>,
    '/DepositPage': RouteRecordInfo<'/DepositPage', '/DepositPage', Record<never, never>, Record<never, never>>,
    '/GeneratePaymentPage': RouteRecordInfo<'/GeneratePaymentPage', '/GeneratePaymentPage', Record<never, never>, Record<never, never>>,
    '/help': RouteRecordInfo<'/help', '/help', Record<never, never>, Record<never, never>>,
    '/HomePage': RouteRecordInfo<'/HomePage', '/HomePage', Record<never, never>, Record<never, never>>,
    '/LandingPage': RouteRecordInfo<'/LandingPage', '/LandingPage', Record<never, never>, Record<never, never>>,
    '/MakePaymentPage': RouteRecordInfo<'/MakePaymentPage', '/MakePaymentPage', Record<never, never>, Record<never, never>>,
    '/movements': RouteRecordInfo<'/movements', '/movements', Record<never, never>, Record<never, never>>,
    '/profile': RouteRecordInfo<'/profile', '/profile', Record<never, never>, Record<never, never>>,
    '/TransferPage': RouteRecordInfo<'/TransferPage', '/TransferPage', Record<never, never>, Record<never, never>>,
  }
}
