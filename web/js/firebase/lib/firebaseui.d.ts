/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare namespace firebaseui {}

export as namespace firebaseui;

type CredentialHelperType = string;

interface Callbacks {
    signInSuccessWithAuthResult?(
        // tslint:disable-next-line:no-any firebase dependency not available.
        authResult: any,
        redirectUrl?: string
    ): boolean;
    signInFailure?(error: firebaseui.auth.AuthUIError): Promise<void>;
    uiShown?(): void;
}

interface SignInOption {
    provider: string;
}

interface FederatedSignInOption extends SignInOption {
    authMethod?: string;
    clientId?: string;
    scopes?: string[];
    customParameters?: object;
}

interface EmailSignInOption extends SignInOption {
    requireDisplayName?: boolean;
}

interface PhoneSignInOption extends SignInOption {
    recaptchaParameters?: {
        type?: string;
        size?: string;
        badge?: string;
    };
    defaultCountry?: string;
    defaultNationalNumber?: string;
    loginHint?: string;
    whitelistedCountries?: string[];
    blacklistedCountries?: string[];
}

declare namespace firebaseui.auth {
    interface Config {
        acUiConfig?: object;
        autoUpgradeAnonymousUsers?: boolean;
        callbacks?: Callbacks;
        credentialHelper?: CredentialHelperType;
        popupMode?: boolean;
        queryParameterForSignInSuccessUrl?: string;
        queryParameterForWidgetMode?: string;
        signInFlow?: string;
        signInOptions?: Array<
            | string
            | FederatedSignInOption
            | EmailSignInOption
            | PhoneSignInOption
        >;
        signInSuccessUrl?: string;
        siteName?: string;
        tosUrl?: (() => void) | string;
        privacyPolicyUrl?: (() => void) | string;
        widgetUrl?: string;
    }

    class AuthUI {
        public static getInstance(appId?: string): AuthUI | null;
        // tslint:disable-next-line:no-any firebase dependency not available.
        constructor(auth: any, appId?: string);
        public disableAutoSignIn(): void;
        public start(
            element: string | Element,
            config: firebaseui.auth.Config
        ): void;
        public setConfig(config: firebaseui.auth.Config): void;
        public signIn(): void;
        public reset(): void;
        public delete(): Promise<void>;
        public isPendingRedirect(): boolean;
    }

    class AuthUIError {
        private constructor();
        public code: string;
        public message: string;
        // tslint:disable-next-line:no-any firebase dependency not available.
        public credential: any | null;
        public toJSON(): object;
    }

    class CredentialHelper {
        private constructor();
        public static ACCOUNT_CHOOSER_COM: CredentialHelperType;
        public static GOOGLE_YOLO: CredentialHelperType;
        public static NONE: CredentialHelperType;
    }

    class AnonymousAuthProvider {
        private constructor();
        public static PROVIDER_ID: string;
    }
}

export = firebaseui;
