import { CustomLink } from '..';
import heroImg from '../../images/undraw_eco-conscious_oqny.svg';

const Hero = () => {
  return (
    <header>
      <div className='md:flex md:items-center gap-4'>
        <div className='md:w-1/1'>
          <h1>
            Footprint <span className='text-green-500'>Tracking</span> App
          </h1>
          <p className='md:text-sm/loose'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
            sequi ex minus sit dolorum nobis sunt consequuntur blanditiis.
            Voluptas esse aut ea veritatis tempora ullam error ex vel beatae
            nam!
          </p>
          <div className=' flex justify-between w-fit items-center gap-4 mt-4'>
            <CustomLink to='/register' label='register' />
            <CustomLink to='/login' label='login' />
          </div>
        </div>
        <div className='hidden md:block '>
          <img
            src={heroImg}
            alt='hero'
            className='object-cover transform'
            // className='object-cover transform scale-x-[-1]'
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;
