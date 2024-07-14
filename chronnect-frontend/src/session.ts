import { clientPromise } from './client';
import {
  Session,
  createKeyStoreInteractor,
  createSingleSigAuthDescriptorRegistration,
  createWeb3ProviderEvmKeyStore,
  hours,
  registerAccount,
  registrationStrategy,
  ttlLoginRule,
} from "@chromia/ft4";
import { createClient } from "postchain-client";

declare global {
  interface Window {
    ethereum: any;
  }
}

export async function initializeSession() {
  try {
    const client = await clientPromise;
    const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
    const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
    const accounts = await evmKeyStoreInteractor.getAccounts();

    if (accounts.length > 0) {
      const { session } = await evmKeyStoreInteractor.login({
        accountId: accounts[0].id,
        config: {
          rules: ttlLoginRule(hours(2)),
          flags: ["chronnect_session"],
        }
      });
      return session;
    } else {
      const authDescriptor = createSingleSigAuthDescriptorRegistration(
        ["A", "T"],
        evmKeyStore.id
      );
      const { session } = await registerAccount(
        client,
        evmKeyStore,
        registrationStrategy.open(authDescriptor, {
          config: {
            rules: ttlLoginRule(hours(2)),
            flags: ["chronnect_session"],
          },
        }),
        {
          name: "register_user"
        }
      );
      return session;
    }
  } catch (error) {
    console.error('Error initializing session:', error);
    throw error;
  }
}
