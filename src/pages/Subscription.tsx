import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';

const Subscription = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Simple, transparent <span className="text-primary">pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your freelance business. Upgrade anytime as you grow.
          </p>
        </div>
        
        <SubscriptionCard />
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
