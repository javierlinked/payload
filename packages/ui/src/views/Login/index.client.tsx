import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory, useLocation } from 'react-router-dom'

import { FormLoadingOverlayToggle } from '../../elements/Loading'
import Form from '../../forms/Form'
import FormSubmit from '../../forms/Submit'
import Email from '../../forms/field-types/Email'
import Password from '../../forms/field-types/Password'
import { useAuth } from '../../providers/Auth'
import { useConfig } from '../../providers/Config'
import './index.scss'

const baseClass = 'login'

export const LoginClient: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('authentication')
  const { fetchFullUser, user } = useAuth()
  const config = useConfig()
  const {
    admin: { autoLogin, user: userSlug },
    routes: { admin, api },
    serverURL,
  } = config

  // Fetch 'redirect' from the query string which denotes the URL the user originally tried to visit. This is set in the Routes.tsx file when a user tries to access a protected route and is redirected to the login screen.
  const query = new URLSearchParams(useLocation().search)
  const redirect = query.get('redirect')

  const onSuccess = async (data) => {
    if (data.token) {
      await fetchFullUser()

      // Ensure the redirect always starts with the admin route, and concatenate the redirect path
      history.push(admin + (redirect || ''))
    }
  }

  const prefillForm = autoLogin && autoLogin.prefillOnly

  return (
    <Form
      action={`${serverURL}${api}/${userSlug}/login`}
      className={`${baseClass}__form`}
      disableSuccessStatus
      initialData={
        prefillForm
          ? {
              email: autoLogin.email,
              password: autoLogin.password,
            }
          : undefined
      }
      method="post"
      onSuccess={onSuccess}
      waitForAutocomplete
    >
      <FormLoadingOverlayToggle action="loading" name="login-form" />
      <div className={`${baseClass}__inputWrap`}>
        <Email admin={{ autoComplete: 'email' }} label={t('general:email')} name="email" required />
        <Password autoComplete="off" label={t('general:password')} name="password" required />
      </div>
      <Link to={`${admin}/forgot`}>{t('forgotPasswordQuestion')}</Link>
      <FormSubmit>{t('login')}</FormSubmit>
    </Form>
  )
}