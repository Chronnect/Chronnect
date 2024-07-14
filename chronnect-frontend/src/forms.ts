import { showError, disableForm, enableForm, setPlaceholderForTextArea } from './utils';
import { clientPromise } from './client';
import { isValidPgpKeyResponseObj, isValidPgpKey } from './validation';
import { initializeSession } from './session';
import { samplePGPKey } from './sample-key';

export function initForms() {
    setupPgpKeyInput();
    setupSearchForm();
    setupPublishForm();
}

function setupPgpKeyInput() {
    const pgpKeyInput = document.getElementById('pgp-key') as HTMLTextAreaElement;
    if (pgpKeyInput) {
        setPlaceholderForTextArea(pgpKeyInput, samplePGPKey);
    }
}

function setupSearchForm() {
    const searchForm = document.getElementById('search-form') as HTMLFormElement;
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    const ethAddressInput = document.getElementById('eth-address') as HTMLInputElement;

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        disableForm(searchForm);

        let ethAddress = ethAddressInput.value.trim();
        const resultsContainer = document.getElementById('results-container') as HTMLDivElement;
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';

        if (ethAddress.length === 0) {
            showError(searchButton, searchForm, 'ETH address cannot be empty', enableSearchForm);
            return;
        }
        if (ethAddress.length !== 42 || !ethAddress.startsWith('0x')) {
            showError(searchButton, searchForm, 'Wrong ETH address format', enableSearchForm);
            return;
        }

        try {
            const client = await clientPromise;
            let tableHTML = '';

            ethAddress = ethAddress.substring(2);
            const resultContactInfo = await client.query("fetch_contact_info_by_eth", { eth_address: ethAddress });
            if (resultContactInfo) {
                tableHTML += `<table class='results-table'>
                    <tr><th>Contact Information</th></tr>
                    <tr><td>${resultContactInfo}</td></tr>
                </table>`;
                resultsContainer.innerHTML = tableHTML;
                resultsContainer.style.display = 'block';
            }

            const resultPgpKey = await client.query("fetch_pgp_public_key_by_eth", { eth_address: ethAddress });
            if (isValidPgpKeyResponseObj(resultPgpKey)) {
                const createdDate = resultPgpKey.created_at 
                    ? new Date(resultPgpKey.created_at).toISOString().split('.')[0].replace('T', ' ') + ' UTC' 
                    : "Not available";
                tableHTML += `<table id='results-key-info' class='results-table'>
                    <tr><th>Created At</th><th>Status</th><th>Type</th></tr>
                    <tr>
                        <td>${createdDate}</td>
                        <td>${resultPgpKey.key_status}</td>
                        <td>${resultPgpKey.key_type}</td>
                    </tr>
                    <tr><td colspan="3"><pre>${resultPgpKey.public_key}</pre></td></tr>
                </table>`;
                resultsContainer.innerHTML = tableHTML;
            }
            enableSearchForm();
        } catch (error) {
            showError(searchButton, searchForm, 'No PGP public key found', enableSearchForm);
        }
    });
}

function setupPublishForm() {
    const publishForm = document.getElementById('publish-form') as HTMLFormElement;
    const publishButton = document.getElementById('publish-button') as HTMLButtonElement;
    const contactInfoInput = document.getElementById('contact-info') as HTMLTextAreaElement;
    const pgpKeyInput = document.getElementById('pgp-key') as HTMLTextAreaElement;
    let session: any = null;

    publishForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        disableForm(publishForm);

        if (!pgpKeyInput.value.trim() && !contactInfoInput.value.trim()) {
            showError(publishButton, publishForm, 'At least a PGP public key or contact information is needed', enablePublishForm);
            return;
        }

        if (pgpKeyInput.value.trim() && !isValidPgpKey(pgpKeyInput.value.trim())) {
            showError(publishButton, publishForm, 'Invalid PGP Public Key format', enablePublishForm);
            return;
        }

        publishButton.textContent = 'Connecting to wallet...';

        if (!session) {
            try {
                session = await initializeSession();
            } catch (error) {
                showError(publishButton, publishForm, 'Wallet connection failed', enablePublishForm);
                return;
            }
        }

        try {
            publishButton.textContent = 'Publishing your data...';

            if (contactInfoInput.value.trim() !== '') {
                await session.call({ name: "publish_contact_info", args: [contactInfoInput.value] });
            }
            if (pgpKeyInput.value.trim() !== '') {
                await session.call({ name: "publish_pgp_public_key", args: [pgpKeyInput.value] });
            }

            publishButton.textContent = 'Published successfully';
            setTimeout(() => {
                enablePublishForm();
            }, 3000);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes("Illegal base64")) {
                    showError(publishButton, publishForm, 'Invalid PGP Public Key format', enablePublishForm);
                } else {
                    showError(publishButton, publishForm, 'Unable to publish PGP public key', enablePublishForm);
                }
            } else {
                showError(publishButton, publishForm, 'Unable to publish PGP public key', enablePublishForm);
            }
        }
    });
}

function enableSearchForm() {
    const searchForm = document.getElementById('search-form') as HTMLFormElement;
    enableForm(searchForm);
    const searchButton = document.getElementById('search-button') as HTMLButtonElement;
    searchButton.textContent = 'Search';
}

function enablePublishForm() {
    const publishForm = document.getElementById('publish-form') as HTMLFormElement;
    enableForm(publishForm);
    const publishButton = document.getElementById('publish-button') as HTMLButtonElement;
    publishButton.textContent = 'Publish';
}
