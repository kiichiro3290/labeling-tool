import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { db } from "./client"

export const createExperiments = async (userId: string, exName: string) => {
    const exData: Experiment = {
        userId,
        name: exName,
        conditions: [],
        createdAt: new Date()
    }
    const ref = doc(collection(db, 'experiments'))
    await setDoc(ref, exData)
}

// ユーザが作成した実験名の一覧を取得
export const getExperimentNames = async (userId: string) => {
    const ref = collection(db, 'experiments')
    const q = query(ref, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    const names = snapshot.docs.map((item) => item.data().name)
    return names
}

// 実験名からユーザが作成したドキュメントのrefを検索する
const findExperiment = async (exName: string, userId: string) => {
    const ref = collection(db, 'experiments')
    const q = query(ref, where("name", "==", exName), where("userId", '==', userId))
    const snapshot = await getDocs(q)
    const docRef = snapshot.docs[0]

    return docRef
}

// 実験のIDを検索する
export const findExperimentId = async (exName: string, userId: string) => {
    const ref = await findExperiment(exName, userId)
    return ref.id
}

// 実験ドキュメントのconditionsに条件のラベルを追加する
export const addCondition = async (exId: string, condition: string) => {
    const ref = doc(db, 'experiments', exId)
    const data = await getDoc(ref)

    const curr = data.data()?.conditions
    curr.push(condition)

    await updateDoc(ref, {conditions: curr})
}

// タイムスタンプを追加
export const addStamp = async (exId: string, userId: string, condition: string, state: string) => {
 const ref = doc(collection(db, 'experiments', exId, 'stamps'))
 const data: Stamp = {
    userId,
    timestamp: new Date(),
    experimentId: exId,
    condition,
    state
 }
 await setDoc(ref, data)
}