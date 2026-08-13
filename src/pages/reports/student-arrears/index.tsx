import { CONFIG } from '@/global-config';
import { StudentArrearsView } from '@/sections/reports/view';

// ==========================\

const metadata = { title: `Tunggakan Siswa - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <StudentArrearsView />
    </>
  );
}
