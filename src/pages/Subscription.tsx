import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';

const Subscription = () => {
  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Manage your plan and billing
          </p>
        </div>
        
        <SubscriptionCard />
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
