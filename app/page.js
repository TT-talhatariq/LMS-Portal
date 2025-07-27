import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-5">
      <h1 className="text-4xl">Hello Workspace</h1>
      <Button>Shadcn Button</Button>
    </div>
  );
}
