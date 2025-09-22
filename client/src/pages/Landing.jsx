import { Hero, Logo } from '../components';

const Landing = () => {
  return (
    <div className='w-full h-[calc(100vh-2rem)] flex flex-col gap-[10rem] max-w-5xl mx-auto p-6 lg:p-16'>
      <Logo />
      <Hero />
    </div>
  );
};

export default Landing;
