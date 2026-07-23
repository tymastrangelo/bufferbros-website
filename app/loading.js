import Wheel from '@/components/Wheel';

export default function Loading() {
  return (
    <div className="min-h-[60svh] grid place-items-center">
      <Wheel size={48} />
    </div>
  );
}
