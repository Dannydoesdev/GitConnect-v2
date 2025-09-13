import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/clientApp';
import { Button, Group, Space } from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { Edit3, Share2, Eye, Users, Briefcase } from 'lucide-react';

const coreBenefits = [
  {
    name: 'Your Code, Visualised.',
    description:
      'Turn your code into a visual story. Present your work in a way that impresses both technical and non-technical audiences alike.',
    icon: Eye,
  },
  {
    name: 'A Showcase for Developers.',
    description:
      'Display your work in a gallery of dev projects. A place to find inspiration, get discovered, and see what the community is building.',
    icon: Users,
  },
  {
    name: 'Built for the Job Hunt.',
    description:
      'Give hiring managers a clean, professional portfolio that tells the story behind your code, not just a list of repositories.',
    icon: Briefcase,
  },
];

export default function LandingPage() {
  const Router = useRouter();

  const signupHandler = useCallback(
    async (e: any) => {
      e.preventDefault();
      const provider = new GithubAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.log(error);
      } finally {
        Router.push('/addproject');
      }
    },
    [Router]
  );

  return (
    <div className='bg-gray-900'>
      <main>
        {/* HERO */}
        <section className='relative isolate overflow-hidden bg-gray-900 pb-18 pt-20 sm:pb-26'>
          <div
            className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
            aria-hidden='true'
          >
            <div
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>

          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl py-28 sm:py-44 lg:pt-56 lg:pb-50'>
              <div className='text-center'>
                <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl'>
                  Show the world what you’re building
                </h1>
                <p className='mt-6 text-lg leading-8 text-gray-300'>
                  Create a polished visual portfolio from your GitHub
                  repositories, built to impress hiring managers and inspire
                  fellow developers.
                </p>

                <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
                  <Button
                    onClick={signupHandler}
                    variant='gradient'
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    radius='lg'
                    size='lg'
                  >
                    Start your portfolio
                  </Button>

                  <Link href='/' passHref legacyBehavior>
                    <Button
                      component='a'
                      variant='filled'
                      color='gray'
                      radius='lg'
                      size='lg'
                    >
                      Explore Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'
            aria-hidden='true'
          >
            <div
              className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <div className='bg-gray-900 py-28 sm:py-32'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-3xl lg:text-center'>
              <h2 className='text-base font-semibold leading-7 text-indigo-400'>
                Simple. Fast. Professional.
              </h2>
              <p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                Create your portfolio in three simple steps
              </p>
              <p className='mt-6 text-lg leading-8 text-gray-300'>
                Turn GitHub repos into portfolio pieces in minutes, no complex
                setup or design skills needed.
              </p>
            </div>

            <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
              <div className='grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3'>
                {/* Step 1 */}
                <div className='flex flex-col'>
                  <div className='flex items-center gap-x-4 mb-6'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-600 ring-2 ring-indigo-500/20 shadow-lg'>
                      <IconBrandGithub className='h-6 w-6 text-indigo-400' />
                    </div>
                    <div className='text-sm font-semibold text-indigo-400'>
                      STEP 1
                    </div>
                  </div>
                  <div className='text-xl font-semibold leading-7 text-white mb-4'>
                    Connect & Import
                  </div>
                  <div className='text-base leading-7 text-gray-300'>
                    Sign in with your GitHub account and select the repositories
                    you want to showcase. Project details and your README are
                    automatically imported.
                  </div>
                </div>

                {/* Step 2 */}
                <div className='flex flex-col'>
                  <div className='flex items-center gap-x-4 mb-6'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-600 ring-2 ring-indigo-500/20 shadow-lg'>
                      <Edit3 className='h-6 w-6 text-indigo-400' />
                    </div>
                    <div className='text-sm font-semibold text-indigo-400'>
                      STEP 2
                    </div>
                  </div>
                  <div className='text-xl font-semibold leading-7 text-white mb-4'>
                    Design & Tell Your Story
                  </div>
                  <div className='text-base leading-7 text-gray-300'>
                    Use the rich editor to add context, screenshots, and code
                    snippets. Transform your raw code into a compelling project
                    narrative.
                  </div>
                </div>

                {/* Step 3 */}
                <div className='flex flex-col'>
                  <div className='flex items-center gap-x-4 mb-6'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 border border-gray-600 ring-2 ring-indigo-500/20 shadow-lg'>
                      <Share2 className='h-6 w-6 text-indigo-400' />
                    </div>
                    <div className='text-sm font-semibold text-indigo-400'>
                      STEP 3
                    </div>
                  </div>
                  <div className='text-xl font-semibold leading-7 text-white mb-4'>
                    Publish & Share
                  </div>
                  <div className='text-base leading-7 text-gray-300'>
                    Get a personalised GitConnect URL to share with employers,
                    collaborators, and the developer community.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BENEFITS SECTION */}
        <div className='bg-gray-900 py-40 sm:py-48'>
          <div className='mx-auto max-w-7xl px-6 lg:px-8'>
            <div className='mx-auto max-w-2xl lg:text-center'>
              <p className='mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                More Than Just a Link to Your Repo
              </p>
            </div>
            <div className='mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none'>
              <dl className='grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3'>
                {coreBenefits.map((benefit) => (
                  <div key={benefit.name} className='flex flex-col'>
                    <dt className='flex items-center gap-x-3 text-base font-semibold leading-7 text-white'>
                      <benefit.icon
                        className='h-5 w-5 flex-none text-indigo-400'
                        aria-hidden='true'
                      />
                      {benefit.name}
                    </dt>
                    <dd className='mt-4 flex flex-auto flex-col text-base leading-7 text-gray-300'>
                      <p className='flex-auto'>{benefit.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* FOUNDER */}
        <section className='relative bg-gray-900 pt-28 pb-40'>
          <div className='mx-auto flex max-w-7xl flex-col-reverse lg:flex-row items-center gap-y-10 px-6 lg:px-8 xl:items-stretch'>
            <div className='w-full max-w-2xl xl:max-w-none xl:flex-auto lg:px-16 xl:px-18 xl:py-16'>
              <h2 className='text-3xl font-bold text-white'>
                Hi, I'm Danny - the dev behind GitConnect.
              </h2>
              <p className='mt-4 text-lg text-gray-300'>
                I built GitConnect to give developers a simple, visual way to
                tell the story <em>behind</em> their code. GitHub is great for
                the code itself, GitConnect is made for the <em>context</em>.{' '}
                <br />
                <br /> What started as a passion project is now an open-source
                platform where you can create an online presence of your work to
                use personally or professionally - and publish your story where
                it can inspire others in the community.
              </p>
              <Group
                sx={(theme) => ({
                  [theme.fn.smallerThan('lg')]: { justifyContent: 'center' },
                })}
              >
                <Link href='/portfolio/dannydoesdev' passHref legacyBehavior>
                  <Button
                    component='a'
                    size='lg'
                    radius='md'
                    variant='white'
                    color='dark'
                    mt={40}
                    sx={(theme) => ({
                      '&:hover': { color: 'white', backgroundColor: 'black' },
                      width: '100%',
                      maxWidth: '320px',
                      [theme.fn.largerThan('lg')]: {
                        width: '75%',
                        maxWidth: 'none',
                      },
                    })}
                  >
                    Danny's Portfolio
                  </Button>
                </Link>
              </Group>
            </div>

            <div className='w-full max-w-md xl:w-80 xl:flex-none mt-8 h-96 md:h-80 xl:h-auto'>
              <div className='relative h-full md:-mx-8 xl:mx-0'>
                <img
                  className='absolute inset-0 h-full w-full rounded-2xl bg-gray-800 object-cover shadow-2xl'
                  src='/img/landing/danny-avatar_768x768.webp'
                  alt='Danny portrait'
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTRIBUTE */}
        <Space h={60} />
        <section className='bg-white py-8 sm:py-12'>
          <div className='sm:px-3 md:px-30 lg:px-40 xl:px-70'>
            <div className='relative isolate overflow-hidden bg-gray-900 px-6 py-16 shadow-2xl sm:rounded-3xl sm:px-18 xl:py-30'>
              <div className='mx-auto max-w-7xl'>
                <h2 className='mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                  An Open-Source Community Project
                </h2>
                <p className='mx-auto mt-4 max-w-xl text-center text-lg leading-8 text-gray-300'>
                  Gitconnect is now an open-source project. Ideas and
                  contributions from the developer community are welcome. If
                  there's a feature you would love to see, feel free to open an
                  issue or PR on GitHub.
                </p>

                <div className='mt-8 flex justify-center'>
                  <Link
                    href='https://github.com/Dannydoesdev/GitConnect-v2'
                    passHref
                    legacyBehavior
                  >
                    <Button
                      component='a'
                      variant='gradient'
                      gradient={{ from: 'indigo', to: 'cyan' }}
                      radius='lg'
                      size='md'
                    >
                      View Repository
                    </Button>
                  </Link>
                </div>
              </div>

              <svg
                viewBox='0 0 1024 1024'
                className='absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2'
                aria-hidden='true'
              >
                <circle
                  cx={512}
                  cy={512}
                  r={512}
                  fill='url(#radial)'
                  fillOpacity='0.7'
                />
                <defs>
                  <radialGradient
                    id='radial'
                    cx={0}
                    cy={0}
                    r={1}
                    gradientUnits='userSpaceOnUse'
                    gradientTransform='translate(512 512) rotate(90) scale(512)'
                  >
                    <stop stopColor='#7775D6' />
                    <stop offset={1} stopColor='#E935C1' stopOpacity={0} />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
