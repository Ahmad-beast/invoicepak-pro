import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ReferralEntry {
  id: string;
  source: string;
  url: string;
  timestamp: Date;
  date: string;
  device?: string;
  browser?: string;
  timezone?: string;
  hour?: number;
}

export interface ReferralSourceStat {
  source: string;
  count: number;
  lastVisit: Date;
  todayCount: number;
  weekCount: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface DeviceBreakdown {
  device: string;
  count: number;
  percentage: number;
}

export interface BrowserBreakdown {
  browser: string;
  count: number;
  percentage: number;
}

export interface HourlyCount {
  hour: number;
  count: number;
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener
  useEffect(() => {
    const ref = collection(db, 'referrals');
    const q = query(ref, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ReferralEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          source: data.source || 'unknown',
          url: data.url || '',
          timestamp: data.timestamp?.toDate() || new Date(),
          date: data.date || '',
          device: data.device || 'unknown',
          browser: data.browser || 'unknown',
          timezone: data.timezone || '',
          hour: data.hour ?? null,
        };
      });
      setReferrals(list);
      setLoading(false);
    }, (err) => {
      console.error('Error listening to referrals:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Aggregate by source
  const sourceStats = useMemo<ReferralSourceStat[]>(() => {
    const map = new Map<string, { count: number; lastVisit: Date; todayCount: number; weekCount: number }>();

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
  }, [referrals, today, weekAgo]);

  // Daily counts (last 14 days)
  const dailyCounts = useMemo<DailyCount[]>(() => {
    const days: DailyCount[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = referrals.filter(r => r.date === dateStr).length;
      days.push({ date: dateStr, count });
    }
    return days;
  }, [referrals]);

  // Device breakdown
  const deviceBreakdown = useMemo<DeviceBreakdown[]>(() => {
    const map = new Map<string, number>();
    referrals.forEach(r => {
      const d = r.device || 'unknown';
      map.set(d, (map.get(d) || 0) + 1);
    });
    const total = referrals.length || 1;
    return Array.from(map.entries())
      .map(([device, count]) => ({ device, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [referrals]);

  // Browser breakdown
  const browserBreakdown = useMemo<BrowserBreakdown[]>(() => {
    const map = new Map<string, number>();
    referrals.forEach(r => {
      const b = r.browser || 'unknown';
      map.set(b, (map.get(b) || 0) + 1);
    });
    const total = referrals.length || 1;
    return Array.from(map.entries())
      .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [referrals]);

  // Hourly distribution (today)
  const hourlyToday = useMemo<HourlyCount[]>(() => {
    const hours: HourlyCount[] = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    referrals.filter(r => r.date === today).forEach(r => {
      if (r.hour != null && r.hour >= 0 && r.hour < 24) {
        hours[r.hour].count++;
      }
    });
    return hours;
  }, [referrals, today]);

  // Recent visits (last 20)
  const recentVisits = useMemo(() => referrals.slice(0, 20), [referrals]);

  const todayCount = referrals.filter(r => r.date === today).length;
  const weekCount = referrals.filter(r => r.timestamp.getTime() > weekAgo).length;

  return {
    referrals,
    sourceStats,
    dailyCounts,
    deviceBreakdown,
    browserBreakdown,
    hourlyToday,
    recentVisits,
    totalVisits: referrals.length,
    todayCount,
    weekCount,
    loading,
  };
};
