import { BRANCHES } from '@/constants/site';
export default function BranchContacts() {
  return <div className="space-y-3">{BRANCHES.map(branch => <a key={branch.name} href={`tel:${branch.phone.replace(/\s/g, '')}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 hover:text-accent transition-colors"><span>{branch.name}</span><span className="font-medium">{branch.phone}</span></a>)}</div>;
}
