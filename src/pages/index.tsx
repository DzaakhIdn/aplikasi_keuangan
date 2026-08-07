import { CONFIG } from '@/global-config';
import { OverviewView } from '@/sections/overview/view';

// ==========================\

const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function OverviewAppPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <OverviewView />
    </>
  );
}
