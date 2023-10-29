import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { db } from "./client"

export const createLabels = async (name: string, type: LabelType) => {
    const labelData: Label = {
        name,
        type,
        createdAt: new Date()
    }
    const ref = doc(collection(db, 'labels'))
    setDoc(ref, labelData)
}

export const getConditionLabels = async (): Promise<Label[]> => {
 const ref = collection(db, 'labels')   
 const q = query(ref, where('type', '==', 'condition'))
 const snapshot = await getDocs(q)

 const data: Label[] = snapshot.docs.map((item) => {
    const row = item.data()
    return {
        name: row.name,
        createdAt: row.createdAt,
        type: row.type
    }
 })
 return data
}

export const getLabels = async (): Promise<Label[]> => {
    const snapshot = await getDocs(collection(db, 'labels'))

    const data: Label[] = snapshot.docs.map((item) => {
        const row = item.data()
        return {
            name: row.name,
            createdAt: row.createdAt,
            type: row.type
        }
    })

    return data
}