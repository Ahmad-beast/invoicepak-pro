import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ReferralEntry {
  id: string;
  source: string;
  url: string;
  timestamp: Date;
  date: string;
}

export interface ReferralSourceStat {
  source: string;
  count: number;
  lastVisit: Date;
  todayCount: number;
  weekCount: number;
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReferrals = useCallback(async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'referrals');
      const q = query(ref, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);

      const list: ReferralEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          source: data.source || 'unknown',
          url: data.url || '',
          timestamp: data.timestamp?.toDate() || new Date(),
          date: data.date || '',
        };
      });

      setReferrals(list);
    } catch (err) {
      console.error('Error fetching referrals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  // Aggregate by source
  const sourceStats: ReferralSourceStat[] = (() => {
    const map = new Map<string, { count: number; lastVisit: Date; todayCount: number; weekCount: number }>();
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    referrals.forEach((r) => {
      const existing = map.get(r.source) || { count: 0, lastVisit: new Date(0), todayCount: 0, weekCount: 0 };
      existing.count++;
      if (r.timestamp > existing.lastVisit) existing.lastVisit = r.timestamp;
      if (r.date === today) existing.todayCount++;
      if (r.timestamp.getTime() > weekAgo) existing.weekCount++;
      map.set(r.source, existing);
    });

    return Array.from(map.entries())
      .map(([source, stats]) => ({ source, ...stats }))
      .sort((a, b) => b.count - a.count);
  })();

  return {
    referrals,
    sourceStats,
    totalVisits: referrals.length,
    loading,
    refetch: fetchReferrals,
  };
};
