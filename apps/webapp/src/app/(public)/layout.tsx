// Force dynamic rendering since Navigation includes wallet status that uses wallet adapters
export const dynamic = 'force-dynamic';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
