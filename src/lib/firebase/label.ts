import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { db } from "./client"

export const createLabels = async (userId: string, name: string, type: LabelType) => {
    const labelData: Label = {
        userId,
        name,
        type,
        createdAt: new Date()
    }
    const ref = doc(collection(db, 'labels'))
    setDoc(ref, labelData)
}

export const getConditionLabels = async (userId: string): Promise<Label[]> => {
 const ref = collection(db, 'labels')   
 const q = query(ref, where('type', '==', 'condition'), where('userId', '==', userId))
 const snapshot = await getDocs(q)

 const data: Label[] = snapshot.docs.map((item) => {
    const row = item.data()
    return {
        userId: row.userId,
        name: row.name,
        createdAt: row.createdAt,
        type: row.type
    }
 })
 return data
}

export const getLabels = async (userId: string): Promise<Label[]> => {
    const ref = collection(db, 'labels')
    const q = query(ref, where('userId', '==', userId))
    const snapshot = await getDocs(q)

    const data: Label[] = snapshot.docs.map((item) => {
        const row = item.data()
        return {
            userId: row.userId,
            name: row.name,
            createdAt: row.createdAt,
            type: row.type
        }
    })

    return data
}