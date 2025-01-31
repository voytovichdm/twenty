import { useSignInUp } from '@/auth/sign-in-up/hooks/useSignInUp';
import { useSignInUpForm } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { SignInUpStep } from '@/auth/states/signInUpStepState';
import { isRequestingCaptchaTokenState } from '@/captcha/states/isRequestingCaptchaTokenState';
import { captchaState } from '@/client-config/states/captchaState';
import { workspaceAuthProvidersState } from '@/workspace/states/workspaceAuthProvidersState';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { isDefined } from '~/utils/isDefined';

const searchParams = new URLSearchParams(window.location.search);
const email = searchParams.get('email');

enum LoadingStatus {
  Loading = 'loading',
  RequestingCaptchaToken = 'requestingCaptchaToken',
  Done = 'done',
}

export const SignInUpWorkspaceScopeFormEffect = () => {
  const workspaceAuthProviders = useRecoilValue(workspaceAuthProvidersState);

  const isRequestingCaptchaToken = useRecoilValue(
    isRequestingCaptchaTokenState,
  );

  const captcha = useRecoilValue(captchaState);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.Loading,
  );

  const { form } = useSignInUpForm();

  const { signInUpStep, continueWithEmail, continueWithCredentials } =
    useSignInUp(form);

  useEffect(() => {
    if (loadingStatus === LoadingStatus.Done) {
      return;
    }

    if (!isDefined(captcha?.provider)) {
      setLoadingStatus(LoadingStatus.Done);
      return;
    }

    if (isRequestingCaptchaToken) {
      setLoadingStatus(LoadingStatus.RequestingCaptchaToken);
    }

    if (
      !isRequestingCaptchaToken &&
      loadingStatus === LoadingStatus.RequestingCaptchaToken
    ) {
      setLoadingStatus(LoadingStatus.Done);
    }
  }, [captcha?.provider, isRequestingCaptchaToken, loadingStatus]);

  useEffect(() => {
    if (
      signInUpStep === SignInUpStep.Init &&
      !workspaceAuthProviders.google &&
      !workspaceAuthProviders.microsoft &&
      !workspaceAuthProviders.sso
    ) {
      continueWithEmail();
      return;
    }

    if (
      isDefined(email) &&
      workspaceAuthProviders.password &&
      loadingStatus === LoadingStatus.Done
    ) {
      continueWithCredentials();
    }
  }, [
    signInUpStep,
    workspaceAuthProviders.google,
    workspaceAuthProviders.microsoft,
    workspaceAuthProviders.sso,
    workspaceAuthProviders.password,
    continueWithEmail,
    continueWithCredentials,
    loadingStatus,
  ]);

  return <></>;
};
