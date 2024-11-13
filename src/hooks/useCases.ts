import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Case } from '../types/case';
import { useAuth } from '../context/AuthContext';

export const useCases = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const q = query(
          collection(db, 'cases'),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const casesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Case[];

        setCases(casesData);
      } catch (error: any) {
        console.error('Error fetching cases:', error);
        setError(
          error.code === 'permission-denied'
            ? 'Unable to access cases. Please check your connection and try again.'
            : 'Unable to load cases. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const reportCase = async (
    data: Omit<Case, 'id' | 'raised' | 'createdAt' | 'userId' | 'status'>,
    image: File
  ) => {
    if (!user) {
      throw new Error('Must be logged in to report a case');
    }

    try {
      // Upload image first
      const imageRef = ref(storage, `cases/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Create case document
      const caseData = {
        ...data,
        imageUrl,
        raised: 0,
        createdAt: Timestamp.now(),
        userId: user.uid,
        status: 'open'
      };

      const docRef = await addDoc(collection(db, 'cases'), caseData);
      return docRef.id;
    } catch (error: any) {
      console.error('Error reporting case:', error);
      throw new Error(
        error.code === 'permission-denied'
          ? 'You do not have permission to report cases. Please log in again.'
          : 'Failed to report case. Please try again.'
      );
    }
  };

  const donate = async (caseId: string, amount: number) => {
    if (!user) {
      throw new Error('Must be logged in to donate');
    }

    try {
      await runTransaction(db, async (transaction) => {
        const caseRef = doc(db, 'cases', caseId);
        const caseDoc = await transaction.get(caseRef);

        if (!caseDoc.exists()) {
          throw new Error('Case not found');
        }

        const currentCase = caseDoc.data() as Case;
        transaction.update(caseRef, {
          raised: currentCase.raised + amount
        });
      });
    } catch (error: any) {
      console.error('Error donating:', error);
      throw new Error(
        error.code === 'permission-denied'
          ? 'You do not have permission to donate. Please log in again.'
          : 'Failed to process donation. Please try again.'
      );
    }
  };

  return {
    cases,
    loading,
    error,
    reportCase,
    donate
  };
};