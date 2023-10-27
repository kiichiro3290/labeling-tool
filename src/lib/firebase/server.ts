
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

import serviceAccount from '../../../secret-key.json'

// サーバサイドでは，firebase-admin SDK によって認証することで，セキュリティルールを無視して通信する
const app = initializeApp({
    credential: cert({
        projectId: serviceAccount.project_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
    })
})

export const adminDB = getFirestore(app)