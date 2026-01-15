import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CreateInvoiceForm } from '@/components/dashboard/CreateInvoiceForm';

const CreateInvoice = () => {
  return (
    <DashboardLayout>
      <CreateInvoiceForm />
    </DashboardLayout>
  );
};

export default CreateInvoice;
