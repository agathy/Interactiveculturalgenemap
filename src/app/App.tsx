import ShanxiCultureGraph from './components/ShanxiCultureGraph';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <>
      <Toaster position="top-center" expand={false} richColors />
      <ShanxiCultureGraph />
    </>
  );
}
